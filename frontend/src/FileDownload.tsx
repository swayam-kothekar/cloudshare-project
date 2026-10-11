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
      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-purple-600/15 via-fuchsia-600/5 to-transparent blur-[140px]" />
        <div className="absolute top-[60%] -right-32 w-[500px] h-[500px] bg-pink-600/5 blur-[120px] rounded-full" />
      </div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12 md:py-16 relative z-10 max-w-5xl mx-auto w-full">
        <Card className="w-full rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Files Download List */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-3">
                    <Lock className="h-3.5 w-3.5" />
                    <span>DECRYPTED IN BROWSER</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Your Files Are Ready
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Click any file to download individually or grab the entire bundle below.
                  </p>
                </div>

                {extractedFiles.length > 0 ? (
                  <div className="space-y-4">
                    <ul className="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                      {extractedFiles.map((file, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center bg-slate-950/70 border border-white/10 p-3.5 rounded-xl hover:border-purple-500/40 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer group"
                          onClick={() => downloadFile(file)}
                        >
                          <span className="flex items-center truncate mr-3 text-slate-300 group-hover:text-white transition-colors text-sm font-medium">
                            <FileText className="mr-2.5 h-4 w-4 text-purple-400 flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-white bg-purple-600/80 group-hover:bg-purple-500 flex-shrink-0 transition-colors">
                            <Download className="h-3.5 w-3.5" />
                            <span>Download</span>
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={downloadAllFiles}
                      className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01]"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download All Files ({extractedFiles.length})</span>
                    </Button>
                  </div>
                ) : (
                  <div className="py-12 text-center rounded-xl border border-white/5 bg-slate-950/40 space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto" />
                    <p className="text-sm text-slate-400">
                      {status || "Decrypting files in browser..."}
                    </p>
                  </div>
                )}

                {status && extractedFiles.length > 0 && (
                  <p className="text-xs text-purple-300/80 text-center font-mono">
                    {status}
                  </p>
                )}
              </div>

              {/* Right Column: Security Card & Sharing */}
              <div className="lg:col-span-5 space-y-6 pt-6 lg:pt-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-white/10">
                <div className="space-y-3">
                  <h1 className="text-3xl font-extrabold text-white">
                    End-to-End{" "}
                    <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                      Encrypted
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Decrypted locally in your browser with AES-256-GCM. CloudShare servers never see or log the unencrypted contents.
                  </p>
                </div>

                {/* Security Guarantee Box */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Cryptographic Verification Passed</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Once the file reaches its expiry time or download quota, it is instantly deleted from storage.
                  </p>
                </div>

                {/* Share Link again */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300">
                    Share Link Again:
                  </span>
                  <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-slate-950/80 border border-white/10">
                    <input
                      type="text"
                      value={downloadLink}
                      readOnly
                      className="flex-grow bg-transparent text-xs font-mono text-purple-300 focus:outline-none truncate select-all"
                    />
                    <Button
                      onClick={copyLinkToClipboard}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors flex-shrink-0"
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
                        className="w-full bg-white/[0.03] border-white/10 hover:bg-white/[0.08] text-white hover:text-white flex items-center justify-center gap-2 py-4 text-xs font-semibold"
                      >
                        <QrCode className="h-3.5 w-3.5 text-purple-400" />
                        <span>Show Mobile QR Code</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-slate-900 border-white/10 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
                          <QrCode className="h-5 w-5 text-purple-400" />
                          <span>QR Code for Download Link</span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs">
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
                    className="w-full text-slate-400 hover:text-white hover:bg-white/5 py-3 text-xs flex items-center justify-center gap-2"
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
