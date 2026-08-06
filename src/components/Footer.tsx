import React from 'react';
import { ViewMode, SiteConfig } from '../types';
import { Mail, Facebook, Youtube, Twitter, Instagram, Linkedin, Lock } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: ViewMode) => void;
  siteConfig: SiteConfig;
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView, siteConfig, onAdminClick }) => {
  return (
    <footer className="bg-[#EFECE6] border-t border-[#E2DDD3] pt-12 pb-16 text-[#5C584E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Section: Author Info & Social Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#E2DDD3]">
          
          {/* Brand & Author Name (Editable from Admin) */}
          <div className="text-center md:text-left space-y-1">
            <h3 className="font-serif-bn font-bold text-2xl sm:text-3xl text-[#1D1E20]">
              {siteConfig.authorName || siteConfig.siteName || 'আহমেদ শরীফ'}
            </h3>
            <p className="text-sm font-semibold text-[#C29B47]">
              {siteConfig.authorDesignation || 'সাহিত্যিক ও প্রাবন্ধিক'}
            </p>
            {siteConfig.footerText && (
              <p className="text-xs text-[#5C584E] mt-1.5 max-w-md leading-relaxed">
                {siteConfig.footerText}
              </p>
            )}
          </div>

          {/* Social Links & External Contacts (Icons render ONLY for links enabled by Admin) */}
          {siteConfig.showSocialMediaSection !== false && (
            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              {siteConfig.showFacebook !== false && siteConfig.socialLinks?.facebook && (
                <a
                  href={siteConfig.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#F9F8F5] border border-[#D9D3C7] flex items-center justify-center text-[#3A3834] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all shadow-sm hover:-translate-y-0.5"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}

              {siteConfig.showYoutube !== false && siteConfig.socialLinks?.youtube && (
                <a
                  href={siteConfig.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#F9F8F5] border border-[#D9D3C7] flex items-center justify-center text-[#3A3834] hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all shadow-sm hover:-translate-y-0.5"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}

              {siteConfig.showTwitter !== false && siteConfig.socialLinks?.twitter && (
                <a
                  href={siteConfig.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#F9F8F5] border border-[#D9D3C7] flex items-center justify-center text-[#3A3834] hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all shadow-sm hover:-translate-y-0.5"
                  title="Twitter (X)"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}

              {siteConfig.showInstagram !== false && siteConfig.socialLinks?.instagram && (
                <a
                  href={siteConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#F9F8F5] border border-[#D9D3C7] flex items-center justify-center text-[#3A3834] hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all shadow-sm hover:-translate-y-0.5"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}

              {siteConfig.showLinkedin !== false && siteConfig.socialLinks?.linkedin && (
                <a
                  href={siteConfig.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#F9F8F5] border border-[#D9D3C7] flex items-center justify-center text-[#3A3834] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all shadow-sm hover:-translate-y-0.5"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}

              {siteConfig.contactEmail && (
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="w-10 h-10 rounded-xl bg-[#F9F8F5] border border-[#D9D3C7] flex items-center justify-center text-[#3A3834] hover:bg-[#C29B47] hover:text-white hover:border-[#C29B47] transition-all shadow-sm hover:-translate-y-0.5"
                  title={`ইমেইল: ${siteConfig.contactEmail}`}
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Bottom Section: Footer Note & Admin Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C887B] gap-4 pt-2">
          <p className="text-center sm:text-left leading-relaxed">
            {siteConfig.footerText || '© ২০২৪ আহমেদ শরীফ। সর্বস্বত্ব সংরক্ষিত।'}
          </p>

          {/* Admin Panel Access Button in Footer */}
          <button
            onClick={onAdminClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#F9F8F5] hover:bg-[#1D1E20] text-[#3A3834] hover:text-white border border-[#D9D3C7] rounded-xl transition-all shadow-sm font-medium"
          >
            <Lock className="w-3.5 h-3.5 text-[#C29B47]" />
            <span>এডমিন প্যানেল</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
