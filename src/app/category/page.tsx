'use client';

import { Container } from '@/components/ui/Container';
import { Sidebar } from '@/components/ui/Sidebar';
import { categories } from '@/lib/types/categories';
import Link from 'next/link';

export default function CategoriesPage() {
  return (
    <main className="min-h-screen py-6">
      <Container>
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Categories Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                Browse Categories
              </h1>
              <p className="text-gray-400">
                Discover curated articles from different art categories
              </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon.icon;
                const gradient = cat.icon.color;
                
                return (
                  <Link
                    key={cat.slug}
                    href={cat.href}
                    className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-[#1A1C2E] to-[#242638] p-6 hover:from-[#242638] hover:to-[#2A2D42] transition-all duration-300 border border-white/5"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} shadow-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          {cat.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-400">
                        Browse {cat.name.toLowerCase()} articles
                      </p>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80">
            <Sidebar />
          </div>
        </div>
      </Container>
    </main>
  );
} 