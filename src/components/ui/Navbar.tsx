'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from './Button';
import { supabase } from '@/lib/supabase';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    async function getSession() {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
        }
      );
      
      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
    
    getSession();
  }, []);
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };
  
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-lg text-blue-600 dark:text-blue-400">
                Unjica
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'border-blue-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
                }`}
              >
                Home
              </Link>
              <Link
                href="/art-news"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/art-news') 
                    ? 'border-blue-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
                }`}
              >
                Art News
              </Link>
              <Link
                href="/about"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/about') 
                    ? 'border-blue-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/contact') 
                    ? 'border-blue-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            ) : session ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu-button"
                    aria-expanded={isMenuOpen}
                    aria-haspopup="true"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    {session.user.user_metadata?.avatar_url ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={session.user.user_metadata.avatar_url}
                        alt={session.user.user_metadata?.name || session.user.email || 'User'}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center">
                        {session.user.user_metadata?.name?.charAt(0).toUpperCase() || 
                         session.user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>
                </div>
                
                {isMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                      <div className="font-medium">{session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User'}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">{session.user.email}</div>
                      {(session.user.user_metadata?.role === 'ADMIN' || session.user.email === 'sanja.malovic2@gmail.com') && (
                        <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1">Administrator</div>
                      )}
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                    >
                      Profile
                    </Link>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-1"
                      onClick={handleLogout}
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                isActive('/') 
                  ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 text-blue-700 dark:text-blue-100' 
                  : 'border-l-4 border-transparent text-gray-500 dark:text-gray-300'
              }`}
            >
              Home
            </Link>
            <Link
              href="/art-news"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                isActive('/art-news') 
                  ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 text-blue-700 dark:text-blue-100' 
                  : 'border-l-4 border-transparent text-gray-500 dark:text-gray-300'
              }`}
            >
              Art News
            </Link>
            <Link
              href="/about"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                isActive('/about') 
                  ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 text-blue-700 dark:text-blue-100' 
                  : 'border-l-4 border-transparent text-gray-500 dark:text-gray-300'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                isActive('/contact') 
                  ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 text-blue-700 dark:text-blue-100' 
                  : 'border-l-4 border-transparent text-gray-500 dark:text-gray-300'
              }`}
            >
              Contact
            </Link>
          </div>
          
          {/* Mobile authentication */}
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {loading ? (
              <div className="flex justify-center py-2">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : session ? (
              <div>
                <div className="flex items-center px-4">
                  {session.user.user_metadata?.avatar_url ? (
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={session.user.user_metadata.avatar_url}
                        alt={session.user.user_metadata?.name || session.user.email || 'User'}
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center">
                        {session.user.user_metadata?.name?.charAt(0).toUpperCase() || 
                         session.user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{session.user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    href="/profile"
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1 px-4">
                <Link
                  href="/login"
                  className="block text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="block text-base font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 