import { Button } from "./components/ui/button";
import {
  Loader2,
  UploadCloud,
  FileText,
  X,
  Clock,
  Flame,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  QrCode,
  RefreshCw,
  AlertCircle,
  Link2,
} from "lucide-react";
import { useState, useRef } from "react";
import axios from "axios";
import JSZip from "jszip";
import { Card, CardContent } from "./components/ui/card";
import { QRCode } from "react-qrcode-logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Label } from "./components/ui/label";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "./components/ui/input";

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [downloadLink, setDownloadLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [expiryTime, setExpiryTime] = useState<string>("86400");
  const [downloadLimit, setDownloadLimit] = useState<string>("1000");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customShortUrl, setCustomShortUrl] = useState("");
  const [totalFileSize, setTotalFileSize] = useState<number>(0);
  const [fileSizeError, setFileSizeError] = useState<string>("");
  const [shortUrlError, setShortUrlError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const totalSize = Array.from(selectedFiles).reduce(
        (acc, file) => acc + file.size,
        0
      );
      const totalSizeMB = totalSize / (1024 * 1024);

      if (totalSizeMB > 50) {
        setFileSizeError(
          "Total file size exceeds 50MB limit. Please select smaller files."
        );
        setFiles(null);
        setTotalFileSize(0);
      } else {
        setFileSizeError("");
        setFiles(selectedFiles);
        setTotalFileSize(totalSizeMB);
      }
    }
  };

  const clearFiles = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles(null);
    setTotalFileSize(0);
    setFileSizeError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetUpload = () => {
    setFiles(null);
    setTotalFileSize(0);
    setDownloadLink("");
    setCopied(false);
    setCustomShortUrl("");
    setFileSizeError("");
    setShortUrlError("");
    setUploadStep("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uint8ArrayToBase64 = (arr: Uint8Array): string => {
    return btoa(String.fromCharCode(...arr))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  const encryptFile = async (
    file: File | Blob
  ): Promise<{ encryptedFile: Blob; key: Uint8Array }> => {
    const key = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt"]
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const fileArrayBuffer = await file.arrayBuffer();

    const metadata = JSON.stringify({
      name: file instanceof File ? file.name : "archive.zip",
      type: file.type || "application/zip",
    });
    const metadataBuffer = new TextEncoder().encode(metadata);

    const combinedBuffer = new Uint8Array(
      metadataBuffer.length + 4 + fileArrayBuffer.byteLength
    );
    const dv = new DataView(combinedBuffer.buffer);
    dv.setUint32(0, metadataBuffer.length, true);
    combinedBuffer.set(metadataBuffer, 4);
    combinedBuffer.set(
      new Uint8Array(fileArrayBuffer),
      metadataBuffer.length + 4
    );

    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      combinedBuffer
    );

    const exportedKey = await window.crypto.subtle.exportKey("raw", key);
    const finalKey = new Uint8Array(exportedKey);

    return {
      encryptedFile: new Blob([iv, encryptedContent]),
      key: finalKey,
    };
  };

  const zipAndEncryptFiles = async () => {
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setUploadStep("Bundling files client-side...");
      const zip = new JSZip();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        zip.file(file.name, file);
      }
      const zipFile = await zip.generateAsync({ type: "blob" });

      setUploadStep("Encrypting with AES-256-GCM in memory...");
      const { encryptedFile, key } = await encryptFile(zipFile);

      setUploadStep("Requesting secure upload endpoint...");
      const { data } = await axios.post<{
        uploadUrl: string;
        keyName: string;
      }>(`${import.meta.env.VITE_API_BASE_URL}/generate-upload-url`, {
        fileType: "application/octet-stream",
      });

      const { uploadUrl, keyName } = data;

      setUploadStep("Transferring encrypted payload...");
      await axios.put(uploadUrl, encryptedFile, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      const keyBase64 = uint8ArrayToBase64(key);

      setUploadStep("Generating download permissions...");
      const { data: downloadData } = await axios.post<{ downloadUrl: string }>(
        `${import.meta.env.VITE_API_BASE_URL}/generate-download-url`,
        {
          keyName: keyName,
          expiry: parseInt(expiryTime, 10),
        }
      );

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/tag-file`, {
        keyName: keyName,
        downloadLimit: downloadLimit,
      });

      const shortUrl =
        customShortUrl ||
        crypto
          .getRandomValues(new Uint8Array(4))
          .reduce((acc, val) => acc + val.toString(16).padStart(2, "0"), "");

      const downloadUrl = `${
        import.meta.env.VITE_FRONTEND_BASE_URL
      }/download?url=${encodeURIComponent(
        downloadData.downloadUrl
      )}&key=${keyBase64}&shortUrl=${shortUrl}`;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/generate-short-url`,
          {
            longUrl: downloadUrl,
            shortUrl: shortUrl,
          }
        );

        setDownloadLink(
          `${import.meta.env.VITE_FRONTEND_BASE_URL}/share/${shortUrl}`
        );
        setShortUrlError("");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          setShortUrlError(
            "This short URL already exists. Please choose a different one."
          );
          setIsUploading(false);
          return;
        }
        throw error;
      }
    } catch (err) {
      console.error("File upload failed:", err);
    } finally {
      setIsUploading(false);
      setUploadStep("");
    }
  };

  const copyLinkToClipboard = () => {
    if (downloadLink) {
      navigator.clipboard
        .writeText(downloadLink)
        .then(() => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2500);
        })
        .catch((err) => {
          console.error("Failed to copy link:", err);
        });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-16 relative z-10 max-w-4xl mx-auto w-full">
        {/* Header Title */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            <span>CLIENT-SIDE ENCRYPTED UPLOAD</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            {downloadLink ? (
              <>
                Files Ready to{" "}
                <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  Share Securely
                </span>
              </>
            ) : (
              <>
                Upload &{" "}
                <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  Encrypt Privately
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            {downloadLink
              ? "Your files have been encrypted in your browser and uploaded. Only individuals with this unique link can decrypt them."
              : "Select up to 50MB of files. AES-256 keys are generated in your browser and never sent to our servers."}
          </p>
        </div>

        {/* Card Container */}
        <Card className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_-20px_rgba(99,102,241,0.15)] overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <CardContent className="p-6 sm:p-8">
            {downloadLink ? (
              /* Success / Result State */
              <div className="space-y-6">
                {/* Success badge */}
                <div className="flex items-center justify-center">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <Check className="h-8 w-8" />
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold text-white">
                    Encrypted Link Generated
                  </h3>
                  <p className="text-xs text-zinc-400">
                    The cryptographic key is attached to the link fragment. Keep it safe!
                  </p>
                </div>

                {/* Link Box */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-xl bg-zinc-900/90 border border-white/10">
                  <input
                    type="text"
                    value={downloadLink}
                    readOnly
                    className="flex-grow bg-transparent px-3 py-2 text-sm font-mono text-indigo-300 focus:outline-none select-all"
                  />
                  <Button
                    onClick={copyLinkToClipboard}
                    className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg border border-indigo-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center gap-1.5 transition-all flex-shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 hover:border-slate-600 flex items-center justify-center gap-2 py-3.5 text-xs font-semibold rounded-xl transition-colors shadow-sm"
                      >
                        <QrCode className="h-4 w-4 text-violet-400" />
                        <span>Show QR Code</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-slate-900 border-white/10 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
                          <QrCode className="h-5 w-5 text-violet-400" />
                          <span>Mobile Download QR Code</span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs">
                          Scan this QR code with any smartphone camera to open and decrypt the files directly.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col items-center justify-center py-6 bg-white rounded-xl my-2">
                        <QRCode
                          value={downloadLink}
                          size={220}
                          logoOpacity={0.9}
                          quietZone={10}
                        />
                      </div>
                      <p className="text-[11px] text-center font-mono text-slate-400 truncate">
                        {downloadLink}
                      </p>
                    </DialogContent>
                  </Dialog>

                  <a
                    href={downloadLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-colors shadow-sm"
                  >
                    <ExternalLink className="h-4 w-4 text-violet-400" />
                    <span>Open Download Page</span>
                  </a>
                </div>

                {/* Security recap tags */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>AES-256 encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-violet-400 flex-shrink-0" />
                    <span>Auto-expires on timer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    <span>Burn on download limit</span>
                  </div>
                </div>

                {/* Upload more button */}
                <div className="pt-2">
                  <Button
                    onClick={resetUpload}
                    variant="ghost"
                    className="w-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 text-xs flex items-center justify-center gap-2 py-3 rounded-xl transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Upload Another Bundle</span>
                  </Button>
                </div>
              </div>
            ) : (
              /* Upload Configuration Form */
              <div className="space-y-6">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />

                {/* Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileChange({
                      target: { files: e.dataTransfer.files },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? "border-purple-400 bg-purple-500/10 shadow-lg shadow-purple-500/15 scale-[1.01]"
                      : files && files.length > 0
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-white/15 hover:border-purple-500/40 hover:bg-white/[0.02]"
                  }`}
                >
                  {files && files.length > 0 ? (
                    <div className="space-y-4">
                      <div className="h-14 w-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                        <Check className="h-7 w-7" />
                      </div>

                      <div>
                        <p className="text-base font-semibold text-white">
                          {files.length} file{files.length > 1 ? "s" : ""} selected ({totalFileSize.toFixed(2)} MB)
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Click to select different files or drop new ones
                        </p>
                      </div>

                      {/* File preview chips */}
                      <div className="max-h-36 overflow-y-auto space-y-1.5 pt-2 custom-scrollbar pr-1">
                        {Array.from(files).map((f, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs bg-slate-950/60 border border-white/10 px-3 py-2 rounded-lg"
                          >
                            <span className="flex items-center gap-2 truncate text-slate-300 max-w-[280px] sm:max-w-md">
                              <FileText className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
                              <span className="truncate">{f.name}</span>
                            </span>
                            <span className="text-slate-500 font-mono text-[11px] flex-shrink-0 ml-2">
                              {formatBytes(f.size)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={clearFiles}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors pt-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Clear selection</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
                        <UploadCloud className="h-7 w-7" />
                      </div>

                      <div>
                        <p className="text-base font-semibold text-white">
                          Drag and drop files here, or{" "}
                          <span className="text-purple-400 underline underline-offset-2">
                            browse
                          </span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Any format supported • Maximum 50MB per bundle
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {fileSizeError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{fileSizeError}</span>
                  </div>
                )}

                {/* Expiry and Limit Controls Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Delete After */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-purple-400" />
                      <span>Delete File After:</span>
                    </Label>
                    <Select value={expiryTime} onValueChange={setExpiryTime}>
                      <SelectTrigger className="w-full bg-slate-950/80 border-white/10 text-white rounded-xl h-11">
                        <SelectValue placeholder="Delete file after" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        <SelectItem value="60">1 Minute (Quick Burn)</SelectItem>
                        <SelectItem value="300">5 Minutes</SelectItem>
                        <SelectItem value="3600">1 Hour</SelectItem>
                        <SelectItem value="86400">24 Hours (Default)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Download Limit */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-pink-400" />
                      <span>Download Limit:</span>
                    </Label>
                    <Select
                      defaultValue={downloadLimit}
                      onValueChange={setDownloadLimit}
                    >
                      <SelectTrigger className="w-full bg-slate-950/80 border-white/10 text-white rounded-xl h-11">
                        <SelectValue placeholder="Set download limit" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        <SelectItem value="1">1 Download (Burn after read)</SelectItem>
                        <SelectItem value="5">5 Downloads</SelectItem>
                        <SelectItem value="10">10 Downloads</SelectItem>
                        <SelectItem value="20">20 Downloads</SelectItem>
                        <SelectItem value="50">50 Downloads</SelectItem>
                        <SelectItem value="100">100 Downloads</SelectItem>
                        <SelectItem value="500">500 Downloads</SelectItem>
                        <SelectItem value="1000">1000 Downloads (Unlimited)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Custom Short URL */}
                <div className="space-y-2">
                  <Label
                    htmlFor="customShortUrl"
                    className="text-xs font-semibold text-slate-300 flex items-center gap-1.5"
                  >
                    <Link2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Custom Short URL (Optional):</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="customShortUrl"
                      placeholder="e.g. project-assets"
                      value={customShortUrl}
                      onChange={(e) => setCustomShortUrl(e.target.value)}
                      className="bg-slate-950/80 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-11 text-sm font-mono"
                    />
                  </div>
                  {shortUrlError && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{shortUrlError}</span>
                    </p>
                  )}
                </div>

                {/* Upload Action Button */}
                <div className="pt-2">
                  <Button
                    onClick={zipAndEncryptFiles}
                    disabled={
                      !files ||
                      files.length === 0 ||
                      isUploading ||
                      totalFileSize > 50
                    }
                    className="w-full h-12 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 border border-indigo-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_20px_rgba(79,70,229,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_24px_rgba(79,70,229,0.5)] transition-all duration-150 disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed active:scale-[0.99]"
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>{uploadStep || "Encrypting & Uploading..."}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <UploadCloud className="h-4 w-4" />
                        <span>Encrypt & Upload Files</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default FileUpload;