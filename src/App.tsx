import { useState } from "react";
import { ImageUploader } from "./components/ImageUploader";
import { ResultsDisplay } from "./components/ResultsDisplay";
import { GlowingStars } from "./components/GlowingStar";
import { BrandHeading } from "./components/Header";
import { LeafLoader } from "./components/LeafLoader";

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layoutState, setLayoutState] = useState<"centered" | "split">(
    "centered"
  );
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setImageUploaded(true);
    setLayoutState("split");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:8000/analyze-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const result = await response.json();
      setAnalysisResult(result.issues || []);
    } catch (err: any) {
      console.error("Error analyzing image:", err);
      setError(err.message || "Failed to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setLoading(false);
    setError(null);
    setImageUploaded(false);
    setLayoutState("centered");
  };

  return (
    <div
      className={`min-h-screen bg-glowra via-purple-100 to-pink-100 min-h-screen bg-gray-50 flex py-12 transition-all duration-700 ease-in-out
        ${
          layoutState === "centered"
            ? "flex-col items-center justify-center"
            : "flex-row items-start justify-start px-8"
        }
      `}
    >
      <div
        className={`
        ${
          layoutState === "centered"
            ? "w-full max-w-md"
            : "w-1/2 flex flex-col items-center justify-center h-full pt-12"
        }
        transition-all duration-700 ease-in-out
      `}
      >
        <BrandHeading />
        <GlowingStars
          label="Skin. Glow. Healthy. Clear. Glow—Naturally."
          interval={1800}
        />
        <ImageUploader onImageUpload={handleImageUpload} />

        {layoutState === "split" && (analysisResult || error) && (
          <button
            onClick={handleReset}
            className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          >
            Upload New Image
          </button>
        )}
      </div>

      {imageUploaded && (
        <div
          className={`
          ${
            layoutState === "split"
              ? "w-1/2 ml-8 flex flex-col items-start justify-start pt-12"
              : "hidden"
          }
          transition-all duration-700 ease-in-out animate-fadeIn
        `}
        >
          {loading && <LeafLoader />}

          {error && (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg shadow-md w-full">
              Error: {error}
            </div>
          )}

          {analysisResult && <ResultsDisplay issues={analysisResult} />}
        </div>
      )}
    </div>
  );
}
