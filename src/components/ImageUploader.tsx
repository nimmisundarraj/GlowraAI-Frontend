import { Camera, Leaf } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import FaceAnalyzer from "./FaceAnalyzer";

interface Props {
  onImageUpload: (file: File) => void;
  loading: boolean;
}

export default function ImageUploader({ onImageUpload, loading }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [showWebcam, setShow] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "selfie.png", { type: "image/png" });
      setPreview(URL.createObjectURL(file));
      onImageUpload(file);
      setShow(false);
      setFile(file);
    }, "image/png");
  }, [onImageUpload]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onImageUpload(file);
    setShow(false);
    setFile(file);
  };

  const handleOnClick = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <section className="w-full max-w-sm md:max-w-lg mx-auto shadow-md">
      <div className="backdrop-blur-md rounded-lg border border-white/30 items-center flex flex-col gap-6 shadow-2xl p-6">
        <p className="text-xl font-semibold text-[#d9dacf] text-center drop-shadow-sm">
          Upload or Take a Selfie
        </p>
        <div className="flex flex-wrap justify-center items-center gap-3 flex-col sm:flex-row">
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFile}
            onClick={handleOnClick}
            className="hidden"
            ref={fileInputRef}
          />
          <label
            htmlFor="file-input"
            className="choose-button hover:opacity-90 cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-white shadow-md transition focus:outline-none"
          >
            Choose Image
          </label>
          <Leaf
            className="w-8 h-8 text-lime-500 drop-shadow-sm
                  animate-[pulse_4s_ease-in-out_infinite]"
          />
          <button
            onClick={() => {
              handleOnClick();
              setShow((open) => !open);
            }}
            className="upload-button rounded-md hover:opacity-90 px-4 py-2 text-sm font-medium text-white shadow-md hover:border-color-none focus:outline-none bg-[#2E3D30] hover:bg-[#3F4F40] transition duration-200"
          >
            {showWebcam ? "Close Camera" : "Open Camera"}
          </button>
        </div>
        {showWebcam && (
          <div className="relative w-full aspect-square overflow-hidden rounded-lg flex items-center justify-center bg-[#2E3D30] hover:bg-[#3F4F40] transition duration-200">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              playsInline
              muted
            />

            <button
              className="absolute bottom-4 right-4 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
              title="Capture"
              aria-label="Capture"
              onClick={takePhoto}
              data-tooltip-id="tooltip"
              data-tooltip-content="Take a photo"
            >
              <Camera
                className="h-10 w-10 text-emerald-600"
                fill="text-emerald-600"
              />{" "}
            </button>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {preview && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-white">Last capture:</span>
            <FaceAnalyzer file={file} loading={loading} />
          </div>
        )}
      </div>
    </section>
  );
}

export { ImageUploader };
