const FOOTER_REEL_SRC =
  "https://res.cloudinary.com/dwgkfg8ec/video/upload/v1782879721/samwills_pscnzj.mp4";

export default function FooterReel() {
  return (
    <video
      className="absolute inset-0 z-0 w-full h-full object-cover"
      src={FOOTER_REEL_SRC}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}
