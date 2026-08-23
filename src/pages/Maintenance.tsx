function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-xl w-full text-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-100">
              <span className="text-3xl">🛠️</span>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            We’re Under Maintenance
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Our system is currently undergoing scheduled maintenance to improve
            performance and reliability. We’ll be back shortly.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-400 text-left p-4 rounded-md mb-6">
            <p className="text-sm text-gray-700">
              🚧 Some features may be temporarily unavailable. We appreciate
              your patience.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2.5 rounded-lg text-sm font-medium transition"
          >
            Refresh Page
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-6">
          ©{new Date().getFullYear()} MyBrandLife.me. All rights reserved.
          Portions of the text and imagery may be AI-generated.
        </p>
      </div>
    </div>
  );
}

export default Maintenance;
