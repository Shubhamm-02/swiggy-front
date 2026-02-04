export default function FoodDeliveryLoading() {
  return (
    <div className="min-h-screen bg-[#f5f6f8] animate-pulse">
      <div className="h-16 bg-white" />
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="h-8 bg-[#eef0f5] rounded w-48 mb-6" />
        <div className="flex gap-4 overflow-hidden mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 w-24 rounded-lg bg-[#eef0f5] flex-shrink-0" />
          ))}
        </div>
        <div className="h-6 bg-[#eef0f5] rounded w-64 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-[#eef0f5]" />
          ))}
        </div>
      </div>
    </div>
  );
}
