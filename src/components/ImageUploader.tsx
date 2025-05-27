import { useState, useRef, useEffect, useCallback } from "react";

interface Props {
  onImageUpload: (file: File) => void;
}

/**
 * A modern, centered selfie uploader that lets the user either pick an image
 * or capture one with the webcam.  Designed with Tailwind CSS.
 *
 * ➡️  Wrap this component in a parent with `class="flex justify-center items-start md:items-center min-h-screen bg-gradient-to-br from-emerald-50 via-indigo-50 to-sky-50"`
 *     (e.g. your <main> tag) to keep the whole experience vertically & horizontally centred on the page.
 */
export default function ImageUploader({ onImageUpload }: Props) {
  const [preview, setPreview]   = useState<string | null>(null);
  const [showWebcam, setShow]   = useState(false);

  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /* ────────────────────────── webcam lifecycle ───────────────────────── */
  useEffect(() => {
    if (!showWebcam) return;

    const open = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error(err);
        alert("Unable to access your camera.");
        setShow(false);
      }
    };

    open();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [showWebcam]);

  /* ───────────────────────────── take snapshot ───────────────────────── */
  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas  = canvasRef.current;
    const ctx     = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "selfie.png", { type: "image/png" });
      setPreview(URL.createObjectURL(file));
      onImageUpload(file);
      setShow(false);
    }, "image/png");
  }, [onImageUpload]);

  /* ─────────────────────────── local file picker ─────────────────────── */
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onImageUpload(file);
    setShow(false);
  };

  /* ─────────────────────────────── markup ────────────────────────────── */
  return (
    <section className="w-full max-w-sm md:max-w-lg mx-auto">
      <div className="flex flex-col gap-6 rounded-2xl bg-white/70 backdrop-blur-lg shadow-2xl p-6">
        {/* header */}
        <h2 className="text-center text-2xl font-semibold tracking-tight text-gray-800">
          Upload or Take a Selfie
        </h2>

        {/* action buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {/* hidden file input */}
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            Choose Image
          </label>

          <button
            onClick={() => setShow((open) => !open)}
            className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
          >
            {showWebcam ? "Close Camera" : "Open Camera"}
          </button>
        </div>

        {/* webcam area */}
        {showWebcam && (
          <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-900 flex items-center justify-center">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              playsInline
              muted
            />

            {/* capture button */}
            <button
              onClick={takePhoto}
              className="absolute bottom-3 right-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-xl shadow-lg transition hover:scale-105 hover:bg-emerald-600"
              title="Capture"
            >
              📸
            </button>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* thumbnail */}
        {preview && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-600">Last capture:</span>
            <img
              src={preview}
              alt="preview"
              className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-400"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export { ImageUploader };