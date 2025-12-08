import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';

// Style constants
const BUTTON_BASE =
  'w-full sm:w-auto text-center px-6 py-3 font-medium text-sm rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';
const BUTTON_PRIMARY = `${BUTTON_BASE} bg-[#4DCDB3] hover:bg-[#3CB89F] text-white border border-[#4DCDB3] hover:border-[#3CB89F] focus:ring-[#4DCDB3]`;
const BUTTON_SECONDARY = `${BUTTON_BASE} border-2 border-[#4DCDB3] text-[#2FA48B] hover:bg-[#E8F9F6] focus:ring-[#4DCDB3]`;

export const HomePage: React.FC = () => {
  const { user, isAuthenticated, isInitialized } = useAuth();

  // Show loading indicator during initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4DCDB3] via-[#3CB89F] to-[#2FA48B]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect authenticated users to profile page
  if (isAuthenticated && user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Gradient intro section */}
      <div className="flex w-full md:w-1/2 bg-gradient-to-br from-[#4DCDB3] via-[#3CB89F] to-[#2FA48B] flex-col justify-center items-start px-6 md:px-12 lg:px-16 min-h-[30vh] md:min-h-screen">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 md:mb-6">
          Manage your work performance
          <br />
          systematically with feedback
        </h2>
        <p className="text-white/90 text-sm md:text-base mb-6">
          Track team and individual performance in one place,
          <br />
          and set growth direction through regular reviews.
        </p>

        <ul className="mt-4 space-y-2 text-sm md:text-base text-white/95" role="list">
          <li className="flex items-center gap-2">
            <span className="text-lg" role="img" aria-label="document">
              📝
            </span>
            <span>Create and manage reviews</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-lg" role="img" aria-label="chart">
              📊
            </span>
            <span>Track and analyze performance</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-lg" role="img" aria-label="people">
              👥
            </span>
            <span>Strengthen team collaboration</span>
          </li>
        </ul>
      </div>

      {/* Right: Auth entry section */}
      <div className="w-full md:w-1/2 bg-[#f6f8fa] flex items-center justify-center px-6 md:px-8 py-12 md:py-0">
        <div className="max-w-md w-full">
          <div className="bg-white border border-[#d0d7de] rounded-md p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              WorkReview
            </h1>

            <section>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Smarter work reviews
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Manage reviews and feedback for organizational
                  <br />
                  and personal growth all in one place with WorkReview.
                </p>
              </div>

              <nav className="flex flex-col sm:flex-row gap-3" aria-label="Authentication menu">
                <Link to="/login" className={BUTTON_PRIMARY}>
                  Sign in
                </Link>
                <Link to="/register" className={BUTTON_SECONDARY}>
                  Sign up
                </Link>
              </nav>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
