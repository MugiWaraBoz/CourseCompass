export function LivePing({ h, w }) {
  return (
    <span className={`relative flex h-${h} w-${w}`}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span
        className={`relative inline-flex h-${h} w-${w} rounded-full bg-emerald-400`}
      />
    </span>
  );
}

export default LivePing;
