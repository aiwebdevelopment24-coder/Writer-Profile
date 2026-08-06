import React, { useState } from 'react';
import { BlogPost, ViewMode } from '../types';
import { Search, ArrowRight, ChevronRight, Eye } from 'lucide-react';

interface BlogViewProps {
  blogs: BlogPost[];
  setCurrentView: (view: ViewMode) => void;
  onSelectBlog: (blog: BlogPost) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({
  blogs,
  onSelectBlog
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সবগুলো');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['সবগুলো', ...Array.from(new Set(blogs.map(b => b.category)))];

  const featuredBlog = blogs.find(b => b.isFeatured) || blogs[0];

  const filteredBlogs = blogs.filter(b => {
    const matchesCategory = selectedCategory === 'সবগুলো' || b.category === selectedCategory;
    const matchesQuery = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-12 animate-fade-in">
      
      {/* Title Header */}
      <div className="border-b border-[#E6E2D8] pb-4">
        <span className="text-xs font-bold text-[#C29B47] uppercase tracking-widest block mb-1">
          সংবাদ ও ভাবনা
        </span>
        <h1 className="font-serif-bn font-bold text-3xl sm:text-4xl text-[#1D1E20]">
          নিউজ ও ব্লগ
        </h1>
      </div>

      {/* Hero Featured Blog Banner */}
      {featuredBlog && (
        <div 
          onClick={() => onSelectBlog(featuredBlog)}
          className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E6E2D8] group cursor-pointer bg-[#1D1E20] text-white min-h-[380px] flex flex-col justify-end"
        >
          <img
            src={featuredBlog.coverImage}
            alt={featuredBlog.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="relative z-10 p-6 sm:p-10 space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-block px-3 py-1 bg-[#C29B47] text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                সেরা ফিচার
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#D9D3C7]">
                <Eye className="w-3.5 h-3.5 text-[#C29B47]" />
                <span>{(featuredBlog.views || 0).toLocaleString('bn-BD')} বার পঠিত</span>
              </span>
            </div>

            <h2 className="font-serif-bn font-bold text-2xl sm:text-4xl text-white group-hover:text-[#C29B47] transition-colors">
              {featuredBlog.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#D9D3C7] line-clamp-2 max-w-2xl">
              {featuredBlog.excerpt}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#C29B47]">
              <span>বিস্তারিত পড়ুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      )}

      {/* Search Bar & Category Filters */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="ব্লগ খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#EFECE6] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
          />
          <Search className="w-4 h-4 text-[#8C887B] absolute left-3.5 top-3.5" />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1D1E20] text-white shadow'
                  : 'bg-[#EFECE6] text-[#5C584E] hover:bg-[#E2DDD3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Posts List ("সাম্প্রতিক পোস্টসমূহ") */}
      <div className="space-y-6">
        <h3 className="font-serif-bn font-bold text-xl text-[#1D1E20] border-b border-[#E6E2D8] pb-2">
          সাম্প্রতিক পোস্টসমূহ
        </h3>

        <div className="space-y-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => onSelectBlog(blog)}
              className="bg-white border border-[#E6E2D8] rounded-2xl overflow-hidden p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-5 group"
            >
              <div className="w-full sm:w-48 h-36 rounded-xl overflow-hidden shrink-0 bg-[#EFECE6]">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-[11px] text-[#8C887B]">
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Eye className="w-3.5 h-3.5 text-[#C29B47]" />
                      <span>{(blog.views || 0).toLocaleString('bn-BD')} বার পঠিত</span>
                    </span>
                  </div>

                  <h4 className="font-serif-bn font-bold text-lg text-[#1D1E20] group-hover:text-[#C29B47] transition-colors">
                    {blog.title}
                  </h4>

                  <p className="text-xs text-[#6B6659] line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#C29B47]">
                  <span>পড়ুন</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
