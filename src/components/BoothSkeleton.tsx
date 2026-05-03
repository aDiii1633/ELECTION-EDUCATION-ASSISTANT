export default function BoothSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 rounded-2xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[400px] bg-gray-200 rounded-[2.5rem]" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
