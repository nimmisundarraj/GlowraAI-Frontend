import { Leaf } from "lucide-react";

const BrandHeading = () => (
  <header className="flex flex-col items-center text-center select-none">
    {/* Logo line */}
    <h1 className="flex items-center gap-1 text-5xl md:text-6xl font-extrabold tracking-tight">
      {/* “Glowra” – gradient highlight */}
      <span className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-lime-400
                       bg-clip-text text-transparent drop-shadow-md">
        Glowra
      </span>

      {/* Leaf accent */}
      <Leaf
        className="w-8 h-8 text-lime-500 drop-shadow-sm
                   animate-[pulse_4s_ease-in-out_infinite]"
      />

      {/* “AI” – dark contrast for readability */}
      <span className="text-emerald-900">AI</span>
    </h1>

    {/* Tag-line */}
    <p className="mt-8 text-lg md:text-xl text-emerald-800/80">
      Snap a selfie—Glowra&nbsp;AI reveals skin concerns and gives home-powered fixes in seconds.
    </p>
  </header>
);

export { BrandHeading };
