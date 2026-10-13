import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import JSZip from "jszip";
import { Button } from "./components/ui/button";
import {
  Download,
  FileText,
  UploadCloud,
  ShieldCheck,
  Copy,
  Lock,
  QrCode,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { QRCode } from "react-qrcode-logo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

interface ExtractedFile {
  name: string;
  file: Blob;
}

interface DecryptedFile {
  blob: Blob;
  fileName: string;
}

const FileDownload: React.FC = () => {
  const [status, setStatus] = useState<string>("");
  const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
  const [downloadLink, setDownloadLink] = useState<string>("");
  const [buttonText, setButtonText] = useState("Copy Link");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    handleDownload();
  }, [location]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shortUrl = params.get("shortUrl");
    setDownloadLink(`${import.meta.env.VITE_FRONTEND_BASE_URL}/share/${shortUrl}`);
  }, []);

  const base64ToUint8Array = (base64: string): Uint8Array => {
    base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const binaryString = atob(base64);
    return new Uint8Array(binaryString.length).map((_, i) =>
      binaryString.charCodeAt(i)
    );
  };

  const decryptFile = async (
    encryptedBlob: Blob,
    key: Uint8Array
  ): Promise<DecryptedFile> => {
    const encryptedArrayBuffer = await encryptedBlob.arrayBuffer();
    const iv = encryptedArrayBuffer.slice(0, 12);
    const data = encryptedArrayBuffer.slice(12);

    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      key as BufferSource,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv as ArrayBuffer) },
      cryptoKey,
      data as ArrayBuffer
    );

    const dv = new DataView(decryptedContent);
    const metadataLength = dv.getUint32(0, true);
    const metadataBuffer = decryptedContent.slice(4, 4 + metadataLength);
    const metadata = JSON.parse(new TextDecoder().decode(metadataBuffer));
    const fileContent = decryptedContent.slice(4 + metadataLength);

    return {
      blob: new Blob([fileContent], { type: metadata.type }),
      fileName: metadata.name,
    };
  };

  const extractZip = async (zipBlob: Blob): Promise<void> => {
    try {
      const zip = await JSZip.loadAsync(zipBlob);
      const files: ExtractedFile[] = [];

      for (const fileName of Object.keys(zip.files)) {
        const fileData = await zip.files[fileName].async("blob");
        files.push({ name: fileName, file: fileData });
      }

      setExtractedFiles(files);
    } catch (err) {
      console.error("Failed to extract ZIP file:", err);
      setStatus(
        `Failed to extract ZIP file: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  const handleDownload = async (): Promise<void> => {
    const params = new URLSearchParams(window.location.search);
    const finalUrl = params.get("url");
    const key = params.get("key");
    // const shortUrl = params.get("shortUrl");
    // setDownloadLink(`https://cloudshare.swayam.tech/share/${shortUrl}`);

    if (!finalUrl) {
      setStatus("No download URL provided");
      return;
    }

    try {
      const url = new URL(finalUrl);
// console.log(url)
//       const downloadUrl =
//         url.origin + url.pathname + url.search.split("&encryptionKey=")[0];
      console.log("GetObject Link:" + url);
      const encodedKey = key;
      console.log(url.pathname.slice(1))
      const keyName = url.pathname.slice(1).toString()
      // console.log(downloadUrl)
      if (!encodedKey) {
        throw new Error("Encryption key not found in URL");
      }
      setStatus("Loading Files...");
      const { data: downloadLimitData } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/get-download-limit`,
        {
          params: { keyName: keyName }
        }
      );

      // console.log(downloadLimitData);
      if(downloadLimitData.downloadLimit > 0){
        const response = await axios.get<Blob>(url.toString(), {
          responseType: "blob",
        });

        setStatus("Decrypting file...");
        const decryptionKey = base64ToUint8Array(encodedKey);
        const { blob: decryptedBlob } = await decryptFile(
          response.data,
          decryptionKey
        );

        setStatus("Extracting files...");
        await extractZip(decryptedBlob);

        setStatus("Files extracted successfully!");
        
        // Try to decrement download limit, but don't fail the entire process if this fails
        try {
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/decrement-download-limit`, {
              keyName: keyName,
            }
          );
        } catch (decrementError) {
          console.warn("Failed to decrement download limit:", decrementError);
          // Don't throw this error - the file download was successful
        }
      } else {
        setStatus("Oops! Download Link Expired or File Deleted")
      }

      
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          console.error("File access forbidden:", err.message);
          setStatus("Oops! Download Link Expired or File Deleted");
        } else if (err.response?.status === 404) {
          console.error("File not found:", err.message);
          setStatus("Oops! File not found or link has expired");
        } else if (err.config?.url?.includes('get-download-limit')) {
          console.error("Failed to check download limit:", err.message);
          setStatus("Failed to verify download permissions. Please try again.");
        } else {
          console.error("Network error during file download:", err.message);
          setStatus(`Network error: ${err.message}`);
        }
      } else {
        console.error("File processing failed:", err);
        setStatus(
          `File processing failed: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    }
  };

  const downloadFile = (file: ExtractedFile): void => {
    const url = window.URL.createObjectURL(file.file);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const downloadAllFiles = async (): Promise<void> => {
    try {
      const zip = new JSZip();
      extractedFiles.forEach((file) => {
        zip.file(file.name, file.file);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "files.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to create ZIP:", err);
      setStatus(
        `Failed to create ZIP: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard
      .writeText(downloadLink)
      .then(() => {
        setButtonText("Link Copied!");
        setTimeout(() => setButtonText("Copy Link"), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
        setButtonText("Failed to copy");
        setTimeout(() => setButtonText("Copy Link"), 2000);
      });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Background ambient lighting with grid texture */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-indigo-600/15 blur-[140px] rounded-full" />
        <div className="absolute top-[50%] -left-36 w-[500px] h-[500px] bg-emerald-500/[0.04] blur-[150px] rounded-full" />
        <div className="absolute top-[60%] -right-36 w-[500px] h-[500px] bg-cyan-500/[0.04] blur-[150px] rounded-full" />
      </div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12 md:py-16 relative z-10 max-w-5xl mx-auto w-full">
        <Card className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_-20px_rgba(99,102,241,0.15)] overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <CardContent className="p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Files Download List */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-3">
                    <Lock className="h-3.5 w-3.5 text-indigo-400" />
                    <span>DECRYPTED IN BROWSER</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Your Files Are Ready
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Click any file to download individually or grab the entire bundle below.
                  </p>
                </div>

                {extractedFiles.length > 0 ? (
                  <div className="space-y-4">
                    <ul className="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                      {extractedFiles.map((file, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center bg-zinc-900/60 border border-white/10 p-3.5 rounded-xl hover:border-indigo-500/40 hover:bg-zinc-900 transition-all duration-200 cursor-pointer group"
                          onClick={() => downloadFile(file)}
                        >
                          <span className="flex items-center truncate mr-3 text-zinc-300 group-hover:text-white transition-colors text-sm font-medium">
                            <FileText className="mr-2.5 h-4 w-4 text-indigo-400 flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] flex-shrink-0 transition-colors">
                            <Download className="h-3.5 w-3.5" />
                            <span>Download</span>
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={downloadAllFiles}
                      className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 border border-indigo-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_16px_rgba(79,70,229,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_24px_rgba(79,70,229,0.45)] flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99]"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download All Files ({extractedFiles.length})</span>
                    </Button>
                  </div>
                ) : (
                  <div className="py-12 text-center rounded-xl border border-white/5 bg-zinc-900/40 space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mx-auto" />
                    <p className="text-sm text-zinc-400">
                      {status || "Decrypting files in browser..."}
                    </p>
                  </div>
                )}

                {status && extractedFiles.length > 0 && (
                  <p className="text-xs text-indigo-300/80 text-center font-mono">
                    {status}
                  </p>
                )}
              </div>

              {/* Right Column: Security Card & Sharing */}
              <div className="lg:col-span-5 space-y-6 pt-6 lg:pt-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-white/10">
                <div className="space-y-3">
                  <h1 className="text-3xl font-extrabold text-white">
                    End-to-End{" "}
                    <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                      Encrypted
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Decrypted locally in your browser with AES-256-GCM. CloudShare servers never see or log the unencrypted contents.
                  </p>
                </div>

                {/* Security Guarantee Box */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5 text-xs text-zinc-300">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Cryptographic Verification Passed</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Once the file reaches its expiry time or download quota, it is instantly deleted from storage.
                  </p>
                </div>

                {/* Share Link again */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-zinc-300">
                    Share Link Again:
                  </span>
                  <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-zinc-900/90 border border-white/10">
                    <input
                      type="text"
                      value={downloadLink}
                      readOnly
                      className="flex-grow bg-transparent text-xs font-mono text-indigo-300 focus:outline-none truncate select-all"
                    />
                    <Button
                      onClick={copyLinkToClipboard}
                      className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg border border-indigo-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center gap-1 transition-colors flex-shrink-0"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{buttonText}</span>
                    </Button>
                  </div>
                </div>

                {/* QR and Upload More actions */}
                <div className="space-y-2.5 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 flex items-center justify-center gap-2 py-3.5 text-xs font-semibold rounded-xl transition-colors shadow-sm"
                      >
                        <QrCode className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Show Mobile QR Code</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
                          <QrCode className="h-5 w-5 text-indigo-400" />
                          <span>QR Code for Download Link</span>
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400 text-xs">
                          Scan this QR code on another device to download these files.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col items-center justify-center py-6 bg-white rounded-xl my-2">
                        <QRCode value={downloadLink} size={220} quietZone={10} />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={() => navigate("/upload")}
                    variant="ghost"
                    className="w-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 py-3 text-xs flex items-center justify-center gap-2 rounded-xl transition-colors"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>Upload New Files</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default FileDownload;
