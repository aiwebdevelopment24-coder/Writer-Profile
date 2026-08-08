import React, { useState } from 'react';
import { Mail, Send, CheckCircle, Facebook, Youtube, Twitter, Instagram, Linkedin, MessageSquare, Copy } from 'lucide-react';
import { SiteConfig, InquiryMessage, UserProfile } from '../types';

interface ContactViewProps {
  siteConfig?: SiteConfig;
  onSendMessage?: (msg: { senderName: string; senderEmail?: string; subject: string; message: string; userKey?: string }) => void;
  currentUser?: UserProfile | null;
  onTriggerAuthRequired?: (msg?: string) => void;
  userInquiries?: InquiryMessage[];
  onReplyInquiry?: (inquiryId: string, replyMessage: string) => void;
  setCurrentView?: (view: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ 
  siteConfig, 
  onSendMessage,
  currentUser,
  onTriggerAuthRequired,
  userInquiries = [],
  onReplyInquiry,
  setCurrentView
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Follow up replies per inquiry
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const contactEmail = siteConfig?.contactEmail || 'contact@ahmedsharif.com';
  const social = siteConfig?.socialLinks || {
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    twitter: '',
    instagram: '',
    linkedin: '',
  };

  const showSocialSection = siteConfig?.showSocialMediaSection !== false;
  const showFb = siteConfig?.showFacebook !== false && !!social.facebook;
  const showYt = siteConfig?.showYoutube !== false && !!social.youtube;
  const showTw = siteConfig?.showTwitter !== false && !!social.twitter;
  const showIg = siteConfig?.showInstagram !== false && !!social.instagram;
  const showLi = siteConfig?.showLinkedin !== false && !!social.linkedin;

  // Filter messages belonging to currentUser if logged in
  const myInquiries = currentUser
    ? userInquiries.filter(i => 
        i.userKey === (currentUser.id || currentUser.emailOrPhone) ||
        i.senderName.toLowerCase() === currentUser.name.toLowerCase() ||
        (i.senderEmail && i.senderEmail === currentUser.emailOrPhone)
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser && !name) {
      if (onTriggerAuthRequired) {
        onTriggerAuthRequired('মেসেজ পাঠাতে আপনার নাম লিখুন অথবা লগইন করুন।');
      }
      return;
    }

    if (!name || !message) return;

    if (onSendMessage) {
      onSendMessage({
        senderName: name,
        senderEmail: email || undefined,
        subject: subject || 'সাধারণ বার্তা / প্রতিক্রিয়া',
        message: message,
        userKey: currentUser ? (currentUser.id || currentUser.emailOrPhone) : undefined,
      });
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 4000);
  };

  const handleSendFollowupReply = (inquiryId: string) => {
    const replyText = replyInputs[inquiryId];
    if (!replyText || !replyText.trim() || !onReplyInquiry) return;
    onReplyInquiry(inquiryId, replyText.trim());
    setReplyInputs(prev => ({ ...prev, [inquiryId]: '' }));
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10 animate-fade-in">
      
      {/* Title Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#C29B47] uppercase tracking-widest block">
          আমাদের সাথে যুক্ত হোন
        </span>
        <h1 className="font-serif-bn font-bold text-3xl sm:text-5xl text-[#1D1E20] relative inline-block">
          আপনার সাথে কথা বলতে চাই
          <span className="absolute -bottom-3 left-0 w-16 h-1 bg-[#C29B47] rounded-full" />
        </h1>
      </div>

      {/* Main Form Box */}
      <div className="bg-[#EFECE6] border border-[#E2DDD3] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        {submitted ? (
          <div className="text-center py-12 space-y-4 bg-white p-8 rounded-2xl border border-[#D9D3C7] shadow-sm">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">
              আপনার বার্তাটি ইনবক্সে পাঠানো হয়েছে!
            </h3>
            <p className="text-xs text-[#5C584E] max-w-md mx-auto leading-relaxed">
              ধন্যবাদ <strong>{name}</strong>, আপনার বার্তাটি সফলভাবে লেখকের ইনবক্সে পৌঁছেছে। আপনার বার্তা এবং এর উত্তর দেখতে ড্যাশবোর্ডে মেসেজেস ট্যাবে যান।
            </p>
            {setCurrentView && (
              <button
                type="button"
                onClick={() => {
                  setCurrentView('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-2 px-6 py-3 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl shadow transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#C29B47]" />
                <span>ড্যাশবোর্ডে মেসেজ দেখুন</span>
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3A3834] mb-1">আপনার নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="আপনার পুরো নাম লিখুন"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A3834] mb-1">ইমেইল বা ফোন নম্বর (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="ইমেইল বা মোবাইল নম্বর (ঐচ্ছিক)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3A3834] mb-1">বিষয় (Subject)</label>
              <input
                type="text"
                placeholder="যেমন: বই সংক্রান্ত মন্তব্য / নতুন প্রসঙ্গ"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3A3834] mb-1">বার্তা / আপনার মতামত *</label>
              <textarea
                required
                rows={5}
                placeholder="আপনার মনের কথা বা যেকোনো বার্তা বিস্তারিত লিখুন..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3.5 bg-[#C29B47] hover:bg-[#a88338] text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>আপনার বার্তা পৌঁছে দিন লেখকের কাছে</span>
            </button>
          </form>
        )}
      </div>

      {/* Banner directing user to Dashboard for conversation history */}
      {currentUser && (
        <div className="bg-[#FFF7E6] border border-[#C29B47]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#C29B47] text-white rounded-xl shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-bn font-bold text-base text-[#1D1E20]">পূর্বে পাঠানো বার্তার তালিকা ও উত্তর</h4>
              <p className="text-xs text-[#5C584E]">আপনার সকল অতীত বার্তা এবং লেখকের সরাসরি জবাব দেখতে ইউজার ড্যাশবোর্ডের ইনবক্স ভিজিট করুন।</p>
            </div>
          </div>
          {setCurrentView && (
            <button
              type="button"
              onClick={() => {
                setCurrentView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              ড্যাশবোর্ডে মেসেজেস দেখুন
            </button>
          )}
        </div>
      )}

      {/* Direct Contact & Social Links */}
      <div className="grid sm:grid-cols-2 gap-6">
        
        {/* Direct Email Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#E6E2D8] space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex p-2.5 bg-[#FFF7E6] text-[#C29B47] rounded-xl mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif-bn font-bold text-xl text-[#1D1E20]">সরাসরি ইমেইল করুন</h3>
            <p className="text-xs text-[#8C887B] mt-1">
              যেকোনো অফিশিয়াল কাজের জন্য সরাসরি ইমেইল পাঠাতে পারেন।
            </p>
          </div>

          <div className="p-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-2xl flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#1D1E20] truncate">{contactEmail}</span>
            <button
              type="button"
              onClick={copyEmailToClipboard}
              className="px-3 py-1.5 bg-[#C29B47] text-white text-[11px] font-bold rounded-xl hover:bg-[#a88338] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedEmail ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
            </button>
          </div>
        </div>

        {/* Social Media Card */}
        {showSocialSection && (
          <div className="bg-white p-6 rounded-3xl border border-[#E6E2D8] space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex p-2.5 bg-[#FFF7E6] text-[#C29B47] rounded-xl mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-serif-bn font-bold text-xl text-[#1D1E20]">সামাজিক যোগাযোগ মাধ্যম</h3>
              <p className="text-xs text-[#8C887B] mt-1">
                সোশ্যাল মিডিয়ায় লেখকের সাম্প্রতিক আপডেট ও সাহিত্যভাবনা ফলো করুন।
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap pt-2">
              {showFb && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl flex items-center gap-2 text-xs font-bold text-[#1D1E20] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all shadow-sm"
                >
                  <Facebook className="w-4 h-4 text-[#1877F2]" />
                  <span>ফেসবুক</span>
                </a>
              )}

              {showYt && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl flex items-center gap-2 text-xs font-bold text-[#1D1E20] hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all shadow-sm"
                >
                  <Youtube className="w-4 h-4 text-[#FF0000]" />
                  <span>ইউটিউব</span>
                </a>
              )}

              {showTw && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl flex items-center gap-2 text-xs font-bold text-[#1D1E20] hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all shadow-sm"
                >
                  <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                  <span>টুইটার (X)</span>
                </a>
              )}

              {showIg && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl flex items-center gap-2 text-xs font-bold text-[#1D1E20] hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all shadow-sm"
                >
                  <Instagram className="w-4 h-4 text-[#E4405F]" />
                  <span>ইনস্টাগ্রাম</span>
                </a>
              )}

              {showLi && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl flex items-center gap-2 text-xs font-bold text-[#1D1E20] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all shadow-sm"
                >
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <span>লিংকডইন</span>
                </a>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
