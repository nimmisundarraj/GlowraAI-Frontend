import { VideoText } from "./magicui/video-text";

const BrandHeading = () => (
  <header className="flex flex-col items-center text-center select-none">
    <h1 className="brand-heading flex items-center gap-1 text-5xl md:text-6xl font-extrabold tracking-tight">
      <div className="relative header-glowra overflow-hidden">
        <VideoText src="/videos/bg3-video.mp4">Glowra</VideoText>
      </div>
    </h1>
  </header>
);

export { BrandHeading };
