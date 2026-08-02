const MapLoading = () => (
  <div className="flex flex-col gap-6 py-10">
    <div className="skeleton mx-auto h-9 w-72" />

    <div className="skeleton mx-auto aspect-square w-full max-w-[500px]" />

    <div className="flex flex-row flex-wrap justify-center gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="skeleton rounded-box h-64 w-full max-w-sm shrink-0" />
      ))}
    </div>
  </div>
);

export default MapLoading;
