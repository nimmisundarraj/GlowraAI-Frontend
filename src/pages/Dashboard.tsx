import { useEffect, useState } from "react";
import { ImageUploader } from "../components/ImageUploader";
import { ResultsDisplay } from "../components/ResultsDisplay";
import { GlowingStars } from "../components/GlowingStar";
import { BrandHeading } from "../components/Header";
import { LeafLoader } from "../components/LeafLoader";
import { useAuth } from "../auth/AuthContext";
import API from "../services/api";

function Dashboard() {
  const { isAuthenticated, logout } = useAuth();
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layoutState, setLayoutState] = useState<"centered" | "split">(
    "centered"
  );

  const getEmailId = async () => {
    try {
      const userData = await API.get(`/auth/me`);
      const email = userData.data.email;
      return email;
    } catch (e: any) {
      console.error("Error getEmailId:", e);
      setError(e.message || "Failed to get email ID.");
      return null;
    }
  };

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 1000);
    const email = await getEmailId();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("email", email);
    if (email) {
      try {
        const response = await API.post(`/analyze-image`, formData);
        setAnalysisResult(response.data.issues || []);
        if (window.innerWidth > 962) {
          setLayoutState("split");
        }
      } catch (err: any) {
        console.error("Error analyzing image:", err);
        setError(err.message || "Failed to analyze image.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setLoading(false);
    setError(null);
    setLayoutState("centered");
  };

  const handleSSOLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/auth/login/google`;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      handleReset();
    }
  }, [isAuthenticated]);

  return (
    <div
      className={`relative min-h-screen bg-glowra via-purple-100 to-pink-100 bg-gray-50 flex py-12 transition-all duration-700 ease-in-out
        ${
          layoutState === "centered"
            ? "flex-col items-center justify-center"
            : "flex-row items-start justify-start px-8"
        }
      `}
    >
      {isAuthenticated && (
        <button
          onClick={logout}
          className="logout-btn absolute top-4 right-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 shadow transition"
        >
          <span
            className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-lime-400
                       bg-clip-text text-transparent drop-shadow-md"
          >
            Logout
          </span>
        </button>
      )}

      <div
        className={`
          ${
            layoutState === "centered"
              ? "w-full app-container"
              : "w-1/2 flex flex-col items-center justify-center h-full pt-12"
          }
          transition-all duration-700 ease-in-out m-2 sm:m-4 md:m-4 p-6
        `}
      >
        <div
          className={`glowra-heading${layoutState === "split" ? "-split" : ""}`}
        >
          <BrandHeading />
        </div>
        {isAuthenticated && (
          <>
            <p className="mt-8 text-center tagline text-lg md:text-xl text-emerald-800/80">
              Snap a selfie—Glowra&nbsp;AI reveals skin concerns and gives
              home-powered fixes in seconds.
            </p>
            <GlowingStars
              label="Skin Glow Healthy Clear Glow—Naturally"
              interval={1800}
            />
          </>
        )}

        {!isAuthenticated && (
          <div className="text-transparent bg-white/70 p-6 rounded-2xl">
            <h2 className="mt-2 text-xl md:text-2xl font-semibold text-center text-gray-800">
              Start Your Glow&nbsp;Journey—In&nbsp;10 Seconds
            </h2>

            <p className="mt-4 text-center text-gray-600 leading-relaxed">
              Snap a quick selfie and let Glowra AI uncover hidden skin concerns
              <br className="hidden sm:block" /> and easy, at-home fixes—before
              you finish your coffee.
            </p>

            <ul className="mt-6 space-y-2 text-gray-700 text-sm md:text-base self-start">
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                Instant AI skin grade
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                Remedies with ingredients already in your kitchen
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                Dermatology-backed tips, no subscription required
              </li>
            </ul>

            <p className="mt-4 text-xs text-gray-500 text-center">
              Your photo never leaves your device—analysis runs in a secure,
              private cloud.
            </p>
          </div>
        )}

        {isAuthenticated ? (
          <ImageUploader onImageUpload={handleImageUpload} loading={loading} />
        ) : (
          <div className="mt-8 flex flex-col gap-6 rounded-2xl bg-white/70 backdrop-blur-lg shadow-2xl p-6">
            <button
              onClick={handleSSOLogin}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition"
            >
              See My Free Skin Report
            </button>
          </div>
        )}

        {(analysisResult || error) && (
         <div className="w-full flex flex-col items-center justify-center">
           <button
            onClick={handleReset}
            className="mt-8 max-w-[200px] px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-md transition-colors"
          >
            Upload New Image
          </button>
          </div>
        )}
      </div>

      {(analysisResult && !loading) && (
        <div
          className={`
            ${`flex flex-col lg:min-h-screen items-start justify-center lg:pt-12 ${
              layoutState === "split" ? "w-1/2 ml-8 " : "w-full max-w-md"
            }`}
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

export { Dashboard };
