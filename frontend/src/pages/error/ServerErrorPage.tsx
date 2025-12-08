import { Link } from 'react-router-dom';

export const ServerErrorPage = (): JSX.Element => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Error code section */}
      <div className="flex w-full md:w-1/2 bg-gradient-to-br from-[#4DCDB3] via-[#3CB89F] to-[#2FA48B] flex-col justify-center items-center px-6 md:px-12 lg:px-16 min-h-[30vh] md:min-h-screen">
        <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4">
          500
        </h2>
        <p className="text-white/90 text-lg md:text-xl font-medium">Internal Server Error</p>
      </div>

      {/* Right: Message section */}
      <div className="w-full md:w-1/2 bg-[#f6f8fa] flex items-center justify-center px-6 md:px-8 py-12 md:py-0">
        <div className="max-w-md w-full">
          <div className="bg-white border border-[#d0d7de] rounded-md p-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Server error occurred
            </h1>

            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              A temporary problem has occurred.
              <br />
              Please try again in a moment.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRefresh}
                className="px-6 py-3 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium text-sm rounded-md border border-[#4DCDB3] hover:border-[#3CB89F] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DCDB3]"
              >
                Refresh page
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium text-sm rounded-md border border-[#d0d7de] hover:border-gray-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Go to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
