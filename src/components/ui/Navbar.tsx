'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { supabase } from '@/lib/supabase';
import { LogOut, Search, User, Home, Newspaper, Info, Mail, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientText } from './GradientText';
import { categories } from '@/lib/types/categories';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
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

  // Handle clicks outside the menu and search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Handle menu clicks
      if (
        isMenuOpen && 
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        // check if click is not in the menu container
        setIsMenuOpen(false);
      }

      // Handle search clicks
      if (
        isSearchOpen &&
        searchRef.current &&
        searchButtonRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        !searchButtonRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen, isSearchOpen]);

  // Close menu when pathname changes (navigation)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };
  
  const isCategoryActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  return (
    <nav className="bg-[#0A0C1C] sticky top-0 z-50">
      {/* Main Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo and Main Navigation */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold">
                <GradientText animate={false} className="cursor-pointer">Unjica</GradientText>
              </Link>
              
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/"
                  className={`text-sm font-medium relative py-2 ${
                    isActive('/') 
                      ? 'text-white' 
                      : 'text-gray-300 hover:text-white transition-colors'
                  }`}
                >
                  <span>Home</span>
                  {isActive('/') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4A6BF6] to-[#6B8AFB]" />
                  )}
                </Link>
                <Link
                  href="/art-news"
                  className={`text-sm font-medium relative py-2 ${
                    isActive('/art-news') 
                      ? 'text-white' 
                      : 'text-gray-300 hover:text-white transition-colors'
                  }`}
                >
                  <span>Art News</span>
                  {isActive('/art-news') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4A6BF6] to-[#6B8AFB]" />
                  )}
                </Link>
                <Link
                  href="/about"
                  className={`text-sm font-medium relative py-2 ${
                    isActive('/about') 
                      ? 'text-white' 
                      : 'text-gray-300 hover:text-white transition-colors'
                  }`}
                >
                  <span>About</span>
                  {isActive('/about') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4A6BF6] to-[#6B8AFB]" />
                  )}
                </Link>
                <Link
                  href="/contact"
                  className={`text-sm font-medium relative py-2 ${
                    isActive('/contact') 
                      ? 'text-white' 
                      : 'text-gray-300 hover:text-white transition-colors'
                  }`}
                >
                  <span>Contact</span>
                  {isActive('/contact') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4A6BF6] to-[#6B8AFB]" />
                  )}
                </Link>
              </div>
            </div>

            {/* Right Side - Search and Auth */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                ref={searchButtonRef}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              ) : session ? (
                <div className="relative">
                  <button
                    type="button"
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A6BF6]"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    ref={buttonRef}
                  >
                    <span className="sr-only">Open user menu</span>
                    {session.user.user_metadata?.avatar_url ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={session.user.user_metadata.avatar_url}
                        alt={session.user.user_metadata?.name || session.user.email || 'User'}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[#4A6BF6] text-white flex items-center justify-center">
                        {session.user.user_metadata?.name?.charAt(0).toUpperCase() || 
                         session.user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>
                  
                  {isMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 bg-[#1A1C2E] ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      ref={menuRef}
                    >
                      <div className="px-4 py-2 text-sm border-b border-gray-700">
                        <div className="font-medium text-white">
                          {session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User'}
                        </div>
                        <div className="text-gray-400 text-xs">{session.user.email}</div>
                        {(session.user.user_metadata?.role === 'ADMIN' || session.user.email === 'sanja.malovic2@gmail.com') && (
                          <div className="text-xs font-medium text-[#4A6BF6] mt-1">Administrator</div>
                        )}
                      </div>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push('/profile');
                        }}
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                  >
                    <Button size="sm">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4A6BF6]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
      </div>

      {/* Sub Navigation - Categories and Filters */}
      <div className="hidden md:block border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            {/* Categories */}
            <div className="flex space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className={`group relative text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 ${
                    isCategoryActive(category.href)
                      ? 'text-white bg-[#1A1C2E]'
                      : 'text-gray-400 hover:text-white hover:bg-[#1A1C2E]/50'
                  }`}
                >
                  <span>{category.name}</span>
                  {isCategoryActive(category.href) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4A6BF6] to-[#6B8AFB]" />
                  )}
                </Link>
              ))}
            </div>

            {/* Filters */}
            {/* <div className="flex items-center space-x-4">
              <select
                defaultValue="latest"
                className="bg-transparent text-gray-400 text-sm border-none focus:ring-0 cursor-pointer hover:text-white transition-colors"
              >
                <option value="latest">Latest</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
              </select>

              <select
                defaultValue="news"
                className="bg-transparent text-gray-400 text-sm border-none focus:ring-0 cursor-pointer hover:text-white transition-colors"
              >
                <option value="news">News</option>
                <option value="analysis">Analysis</option>
                <option value="reviews">Reviews</option>
              </select>
            </div> */}
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <motion.div
          ref={searchRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-80 bg-[#1A1C2E] rounded-lg shadow-lg p-4 mr-4"
        >
          <form onSubmit={handleSearch} className="flex space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 px-3 py-2 bg-[#0A0C1C] text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A6BF6]"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#4A6BF6] text-white rounded-md hover:bg-[#3451C7] focus:outline-none focus:ring-2 focus:ring-[#4A6BF6] transition-colors"
            >
              Search
            </button>
          </form>
        </motion.div>
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Menu */}
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#1A1C2E] border-l border-gray-800 z-50 md:hidden overflow-y-auto"
          >
            {/* Close button */}
            <div className="sticky top-0 flex justify-end p-4 bg-[#1A1C2E] border-b border-gray-800">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main Navigation */}
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/"
                className={`flex items-center px-4 py-3 rounded-xl text-base font-medium ${
                  isActive('/') 
                    ? 'text-white bg-gradient-to-r from-[#4A6BF6] to-[#6B8AFB]' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="flex-1">Home</span>
                <Home className="w-4 h-4" />
              </Link>
              <Link
                href="/art-news"
                className={`flex items-center px-4 py-3 rounded-xl text-base font-medium ${
                  isActive('/art-news') 
                    ? 'text-white bg-gradient-to-r from-[#4A6BF6] to-[#6B8AFB]' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="flex-1">Art News</span>
                <Newspaper className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className={`flex items-center px-4 py-3 rounded-xl text-base font-medium ${
                  isActive('/about') 
                    ? 'text-white bg-gradient-to-r from-[#4A6BF6] to-[#6B8AFB]' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="flex-1">About</span>
                <Info className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className={`flex items-center px-4 py-3 rounded-xl text-base font-medium ${
                  isActive('/contact') 
                    ? 'text-white bg-gradient-to-r from-[#4A6BF6] to-[#6B8AFB]' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="flex-1">Contact</span>
                <Mail className="w-4 h-4" />
              </Link>
            </div>

            {/* Categories */}
            <div className="px-4 py-4 border-t border-gray-800">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      isCategoryActive(category.href)
                        ? 'text-white bg-gradient-to-r from-[#4A6BF6] to-[#6B8AFB]'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <span className="flex-1">{category.name}</span>
                    {isCategoryActive(category.href) && (
                      <span className="w-2 h-2 rounded-full bg-white" aria-hidden="true" />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Authentication */}
            <div className="px-4 py-3 border-t border-gray-800">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : session ? (
                <div>
                  <div className="mt-2 mb-4 space-y-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50"
                    >
                      <span className="flex-1">Profile</span>
                      <User className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50"
                    >
                      <span>Sign out</span>
                      <LogOut className="w-4 h-4 ml-auto" />
                    </button>
                  </div>
                  <div className="flex items-center px-4 py-4 border-t border-gray-800">
                    {session.user.user_metadata?.avatar_url ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={session.user.user_metadata.avatar_url}
                        alt={session.user.user_metadata?.name || session.user.email || 'User'}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[#4A6BF6] text-white flex items-center justify-center text-lg font-medium">
                        {session.user.user_metadata?.name?.charAt(0).toUpperCase() || 
                         session.user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">
                        {session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User'}
                      </div>
                      <div className="text-sm text-gray-400">{session.user.email}</div>
                      {(session.user.user_metadata?.role === 'ADMIN' || session.user.email === 'sanja.malovic2@gmail.com') && (
                        <div className="text-xs font-medium text-[#4A6BF6] mt-0.5">Administrator</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50"
                  >
                    Log In
                    <LogIn className="w-4 h-4 ml-auto" />
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50"
                  >
                    Register
                    <LogIn className="w-4 h-4 ml-auto" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </nav>
  );
} 