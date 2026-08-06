import React from 'react';
import { ViewMode, SiteConfig } from '../types';

interface AuthorBioViewProps {
  setCurrentView: (view: ViewMode) => void;
  siteConfig: SiteConfig;
}

export const AuthorBioView: React.FC<AuthorBioViewProps> = ({ siteConfig }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10 animate-fade-in">
      
      {/* Author Top Profile Banner */}
      <div className="space-y-6 text-center">
        {siteConfig.authorImage && (
          <div className="relative w-full max-w-lg mx-auto h-96 sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#EFECE6]">
            <img
              src={siteConfig.authorImage}
              alt={siteConfig.authorName || 'লেখক'}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}

        <div className="space-y-2">
          {siteConfig.authorDesignation && (
            <span className="text-xs font-bold text-[#C29B47] uppercase tracking-widest block">
              {siteConfig.authorDesignation}
            </span>
          )}
          {siteConfig.authorName && (
            <h1 className="font-serif-bn font-bold text-4xl sm:text-5xl text-[#1D1E20]">
              {siteConfig.authorName}
            </h1>
          )}
        </div>

        {siteConfig.authorPhilosophyText && (
          <div className="p-6 bg-[#EFECE6] border-l-4 border-[#C29B47] rounded-r-2xl italic font-serif-bn text-sm sm:text-base text-[#3A3834] leading-relaxed max-w-2xl mx-auto shadow-sm">
            "{siteConfig.authorPhilosophyText}"
          </div>
        )}
      </div>

      {/* Life & Philosophy Section (Title and Content from Admin) */}
      {(siteConfig.authorBioHeading || siteConfig.authorBioText) && (
        <div className="bg-white p-8 sm:p-12 border border-[#E6E2D8] rounded-3xl shadow-sm space-y-6">
          {siteConfig.authorBioHeading && (
            <h2 className="font-serif-bn font-bold text-2xl sm:text-3xl text-[#1D1E20] border-b border-[#E6E2D8] pb-4">
              {siteConfig.authorBioHeading}
            </h2>
          )}

          {siteConfig.authorBioText && (
            <div className="space-y-4 text-sm sm:text-base text-[#5C584E] leading-relaxed whitespace-pre-line">
              {siteConfig.authorBioText}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
