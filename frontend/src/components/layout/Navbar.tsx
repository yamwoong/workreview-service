import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useLogout } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export const Navbar = (): JSX.Element => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Logged out successfully');
      navigate('/');
      setIsDropdownOpen(false);
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#4DCDB3] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="text-xl font-bold text-gray-900">WorkReview</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center ml-10 space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-[#4DCDB3] font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/stores"
                className="text-gray-700 hover:text-[#4DCDB3] font-medium transition-colors"
              >
                Find Stores
              </Link>
              <Link
                to="/stores/search"
                className="text-gray-700 hover:text-[#4DCDB3] font-medium transition-colors"
              >
                Search
              </Link>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#4DCDB3] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-900 font-medium hidden sm:block">
                      {user.name}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-600 transition-transform ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                      />

                      {/* Menu */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm text-gray-900 font-medium truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          disabled={logoutMutation.isPending}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Login/Register Buttons */}
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 font-medium hover:text-[#4DCDB3] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
