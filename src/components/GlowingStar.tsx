import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface Props {
  label: string;
  interval?: number;
}

export const GlowingStars = ({ label, interval = 1800 }: Props) => {
  const words = label.split(" ");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotating, setRotating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRotating(true);
      setTimeout(() => setRotating(false), 1200); // Stop rotation after 1.2s
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, words.length]);

  return (
    <div className="flex items-center justify-center h-32 space-x-2 text-2xl font-semibold">
      <span>{words[currentIndex]}</span>
      <svg
    viewBox="0 0 24 24"
    className={`w-7 h-7 ${rotating ? "rotate-[360deg] transition-transform duration-1000" : ""}`}
  >
    <defs>
      {/* golden centre → warm edge */}
      <radialGradient id="starGrad" cx="50%" cy="50%" r="50%">
  {/* 0-20 % stays solid ⇒ smaller bright spot */}
  <stop offset="0%"  stopColor="#ffe066" />
  <stop offset="10%" stopColor="#ffd54d" />
  {/* edge hue unchanged */}
  <stop offset="100%" stopColor="#f59e0b" />
</radialGradient>

      {/* soft outer glow */}
      <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur stdDeviation="2" result="blur" />

  <feComponentTransfer in="blur">
    <feFuncA type="linear" slope="0.6" />
  </feComponentTransfer>

  <feMerge>
    <feMergeNode />           
    <feMergeNode in="SourceGraphic" />
  </feMerge>
</filter>
    </defs>

    <path
      d="M12 2.5l2.9 6.6 7.1.8-5.2 5.1 1.3 7-6.1-3.5-6.1 3.5 1.3-7-5.2-5.1 7.1-.8z"
      fill="url(#starGrad)"
      filter="url(#starGlow)"
    />
  </svg>
    </div>
  );
};
