function LoadingSkeleton() {
  return (
    <div className="max-w-[1600px] mx-auto px-10">
      <div className="h-16 bg-gray-200 animate-pulse" />{" "}
      {/* Skeleton สำหรับ Navbar */}
      <div className="mt-4 h-64 bg-gray-200 animate-pulse" />{" "}
      {/* Skeleton สำหรับ content */}
    </div>
  );
}

export default LoadingSkeleton;
