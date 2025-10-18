export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center group relative">
        <div className="flex items-center mb-8 relative">
          <div className="w-30 h-30 rounded-full bg-black transition-transform duration-300 group-hover:-translate-y-2" />
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-3 h-1 bg-black -rotate-45" />
            <div className="w-6 h-1 bg-black ml-6" />
            <div className="w-3 h-1 bg-black rotate-45" />
          </div>
        </div>
        <div className="w-40 h-40 bg-black transition-transform duration-300 group-hover:-translate-y-2" />
      </div>
      <div className="flex flex-col items-center mx-10 mt-52">
        <div className="flex flex-row items-center">
          <div className="w-60 h-4 bg-black" />
        </div>
    <div className="flex flex-row justify-between w-60 mt-0 items-end">
          <div className="w-4 h-20 bg-black" />
          <div className="w-4 h-20 bg-black" />
        </div>
      </div>
      <div className="flex flex-col items-center group">
        <div className="w-30 h-30 rounded-full bg-black mb-8 transition-transform duration-300 group-hover:-translate-y-2" />
        <div className="absolute right-full ml-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-3 h-1 bg-black -rotate-45" />
            <div className="w-6 h-1 bg-black ml-6" />
            <div className="w-3 h-1 bg-black rotate-45" />
          </div>
        <div className="w-40 h-40 bg-black transition-transform duration-300 group-hover:-translate-y-2" />
      </div>
    </div>
  );
}
