const BackgroundFX = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.5] dark:opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-accent/30 dark:bg-accent/20 blur-[120px] animate-blob" />
      <div
        className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-pink-400/25 dark:bg-indigo-500/15 blur-[120px] animate-blob"
        style={{ animationDelay: '-4s' }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-sky-400/20 dark:bg-fuchsia-500/10 blur-[120px] animate-blob"
        style={{ animationDelay: '-8s' }}
      />
    </div>
  );
};

export default BackgroundFX;
