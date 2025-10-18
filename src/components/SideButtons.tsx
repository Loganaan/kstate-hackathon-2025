export default function SideButtons() {
  return (
    <div className="fixed top-1/4 left-2 flex flex-col space-y-4 z-50">
      <button
        className="w-12 h-12 bg-black text-white rounded-md flex items-center justify-center shadow hover:bg-gray-800 transform transition-transform duration-200 hover:scale-110"
        title="Technical Interview Practice"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 18l6-6-6-6M8 6l-6 6 6 6"
          />
        </svg>
      </button>
      <button
        className="w-12 h-12 bg-black text-white rounded-md flex items-center justify-center shadow hover:bg-gray-800 transform transition-transform duration-200 hover:scale-110"
        title="Behavioral Interview Practice"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path d="M12 3a7 7 0 0 0-4 12.9V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.1A7 7 0 0 0 12 3zm0 16v2m-2 0h4" />
        </svg>
      </button>
      <button
        className="w-12 h-12 bg-black text-white rounded-md flex items-center justify-center shadow hover:bg-gray-800 transform transition-transform duration-200 hover:scale-110"
  title="Flashcards"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <rect x="7" y="7" width="10" height="10" rx="2" />
          <rect x="4" y="4" width="10" height="10" rx="2" className="opacity-60" />
        </svg>
      </button>
      <button
        className="w-12 h-12 bg-black text-white rounded-md flex items-center justify-center shadow hover:bg-gray-800 transform transition-transform duration-200 hover:scale-110"
        title="About"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17v-6m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  );
}
