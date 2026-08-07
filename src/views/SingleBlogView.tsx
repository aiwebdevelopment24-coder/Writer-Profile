import React from 'react';
import { BlogPost, ViewMode } from '../types';
import { ArrowLeft, Calendar, Eye, User } from 'lucide-react';

interface SingleBlogViewProps {
  blog: BlogPost;
  setCurrentView: (view: ViewMode) => void;
}

export const SingleBlogView: React.FC<SingleBlogViewProps> = ({ blog, setCurrentView }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('blog')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C887B] hover:text-[#1D1E20] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>ব্লগ তালিকায় ফিরে যান</span>
      </button>

      {/* Header Info */}
      <div className="space-y-4">
        <span className="inline-block px-3 py-1 bg-[#C29B47]/20 text-[#C29B47] text-xs font-bold rounded-full uppercase">
          {blog.category}
        </span>

        <h1 className="font-serif-bn font-bold text-3xl sm:text-4xl text-[#1D1E20] leading-tight">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-[#8C887B] border-b border-[#E6E2D8] pb-4">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[#C29B47]" />
            <span>{blog.author || 'জুবায়ের আহমেদ'}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{blog.date}</span>
          </span>
          <span className="flex items-center gap-1 text-[#C29B47] font-semibold">
            <Eye className="w-3.5 h-3.5" />
            <span>{(blog.views || 0).toLocaleString('bn-BD')} বার পঠিত</span>
          </span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-[#E6E2D8] bg-[#EFECE6]">
        <img
          src={blog.coverImage}
          alt={blog.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body */}
      <div className="bg-white p-8 sm:p-12 border border-[#E6E2D8] rounded-3xl shadow-sm space-y-6 text-sm sm:text-base text-[#3A3834] font-serif-bn leading-relaxed whitespace-pre-line">
        {blog.content}
      </div>

      {/* Author Sign-off Footer */}
      <div className="p-6 bg-[#EFECE6] rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1D1E20] text-[#C29B47] flex items-center justify-center font-bold font-serif-bn">
            জু
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1D1E20]">{blog.author || 'জুবায়ের আহমেদ'}</h4>
            <p className="text-xs text-[#8C887B]">সাহিত্যিক ও প্রাবন্ধিক</p>
          </div>
        </div>
      </div>

    </div>
  );
};
