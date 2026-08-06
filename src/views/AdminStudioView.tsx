import React, { useState } from 'react';
import { Book, BlogPost, InquiryMessage, AdminSubTab, SiteConfig, Order, Review } from '../types';
import { ImageInputWithUpload } from '../components/ImageInputWithUpload';
import { 
  BookOpen, Eye, Mail, TrendingUp, Plus, Edit, Trash2, 
  Search, CheckCircle, Clock, FileText, ArrowUpRight, 
  X, Filter, Settings, User, ShoppingBag, Check, ShieldAlert,
  Globe, LayoutDashboard, Bold, Type, Link, Sparkles, Upload, Star
} from 'lucide-react';

interface AdminStudioViewProps {
  books: Book[];
  blogs: BlogPost[];
  inquiries: InquiryMessage[];
  orders: Order[];
  reviews?: Review[];
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (config: SiteConfig) => void;
  onAddBook: (book: Book) => void;
  onUpdateBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onAddBlog: (blog: BlogPost) => void;
  onUpdateBlog: (blog: BlogPost) => void;
  onDeleteBlog: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  onDeleteInquiry: (inquiryId: string) => void;
  onDeleteReview?: (id: string) => void;
}

export const AdminStudioView: React.FC<AdminStudioViewProps> = ({
  books,
  blogs,
  inquiries,
  orders,
  reviews = [],
  siteConfig,
  onUpdateSiteConfig,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  onAddBlog,
  onUpdateBlog,
  onDeleteBlog,
  onUpdateOrderStatus,
  onDeleteOrder,
  onDeleteInquiry,
  onDeleteReview
}) => {
  const [activeTab, setActiveTab] = useState<AdminSubTab>('site');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Site Config Form Local State
  const [configForm, setConfigForm] = useState<SiteConfig>({ ...siteConfig });

  // Book Modal States
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState<Partial<Book>>({
    title: '',
    category: 'উপন্যাস',
    genreTag: 'উপন্যাস • ২০২৪',
    year: '২০২৪',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    shortSynopsis: '',
    fullSynopsis: '',
    price: 450,
    pages: 300,
    isbn: '978-984-1234-56-7',
    publisher: 'ঐতিহ্য প্রকাশনী',
    rating: 4.9,
    ratingCount: 50,
    status: 'published',
    isNewRelease: true,
    isFeatured: true,
    pdfUrl: '',
  });

  // Blog Modal States
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: '',
    category: 'সাহিত্যচর্চা',
    date: '২০২৪',
    readTime: '৫ মিনিট পাঠ',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    excerpt: '',
    content: '',
    status: 'published',
    isFeatured: false,
  });

  // Selected Inquiry State
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryMessage | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  const triggerSaveToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleSaveSiteConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteConfig(configForm);
    triggerSaveToast('ওয়েবসাইটের যাবতীয় তথ্য সফলভাবে পরিবর্তন করা হয়েছে!');
  };

  // Open Book Modal for Create or Edit
  const handleOpenBookModal = (bookToEdit?: Book) => {
    if (bookToEdit) {
      setEditingBookId(bookToEdit.id);
      setBookForm({ ...bookToEdit });
    } else {
      setEditingBookId(null);
      setBookForm({
        title: '',
        category: 'উপন্যাস',
        genreTag: 'উপন্যাস • ২০২৪',
        year: '২০২৪',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        shortSynopsis: '',
        fullSynopsis: '',
        price: 450,
        pages: 300,
        isbn: '978-984-1234-56-7',
        publisher: 'ঐতিহ্য প্রকাশনী',
        rating: 4.9,
        ratingCount: 50,
        status: 'published',
        isNewRelease: true,
        isFeatured: true,
        pdfUrl: '',
      });
    }
    setBookModalOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title) return;

    if (editingBookId) {
      onUpdateBook({
        ...(bookForm as Book),
        id: editingBookId,
      });
      triggerSaveToast('বইয়ের তথ্য আপডেট করা হয়েছে!');
    } else {
      const newBook: Book = {
        ...(bookForm as Book),
        id: `book-${Date.now()}`,
        author: siteConfig.authorName || 'আহমেদ শরীফ',
      };
      onAddBook(newBook);
      triggerSaveToast('নতুন বই সফলভাবে যুক্ত করা হয়েছে!');
    }
    setBookModalOpen(false);
  };

  // Open Blog Modal for Create or Edit
  const handleOpenBlogModal = (blogToEdit?: BlogPost) => {
    if (blogToEdit) {
      setEditingBlogId(blogToEdit.id);
      setBlogForm({ ...blogToEdit });
    } else {
      setEditingBlogId(null);
      setBlogForm({
        title: '',
        category: 'সাহিত্যচর্চা',
        date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
        readTime: '৫ মিনিট পাঠ',
        coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
        excerpt: '',
        content: '',
        status: 'published',
        isFeatured: false,
      });
    }
    setBlogModalOpen(true);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title) return;

    if (editingBlogId) {
      onUpdateBlog({
        ...(blogForm as BlogPost),
        id: editingBlogId,
      });
      triggerSaveToast('ব্লগ পোস্ট আপডেট করা হয়েছে!');
    } else {
      const newBlog: BlogPost = {
        ...(blogForm as BlogPost),
        id: `blog-${Date.now()}`,
        views: 0,
      };
      onAddBlog(newBlog);
      triggerSaveToast('নতুন ব্লগ পোস্ট পাবলিশ করা হয়েছে!');
    }
    setBlogModalOpen(false);
  };

  const filteredOrders = orderStatusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === orderStatusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-[#1D1E20] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C29B47]/20 border border-[#C29B47]/40 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#C29B47]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C29B47]">
              ADMIN CONTROL CENTER
            </span>
          </div>
          <h1 className="font-serif-bn font-bold text-2xl sm:text-3xl text-white">
            অথর স্টুডিও - এডমিন প্যানেল
          </h1>
          <p className="text-xs text-[#D9D3C7]">
            ওয়েবসাইটের টেক্সট, ছবি, বই, অর্ডার এবং কন্টেন্ট সরাসরি এডিট ও ম্যানেজ করুন।
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#2B2C2E] p-1.5 rounded-2xl border border-white/10 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('site')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'site' ? 'bg-[#C29B47] text-white shadow' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>সাইট সেটিংস</span>
          </button>

          <button
            onClick={() => setActiveTab('author')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'author' ? 'bg-[#C29B47] text-white shadow' : 'text-gray-300 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>লেখক বায়ো</span>
          </button>

          <button
            onClick={() => setActiveTab('books')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'books' ? 'bg-[#C29B47] text-white shadow' : 'text-gray-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>বইসমূহ ({books.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 relative ${
              activeTab === 'orders' ? 'bg-[#C29B47] text-white shadow' : 'text-gray-300 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>অর্ডারসমূহ</span>
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'blogs' ? 'bg-[#C29B47] text-white shadow' : 'text-gray-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ব্লগপোস্ট</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'messages' ? 'bg-[#C29B47] text-white shadow' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>বার্তা</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'reviews' ? 'bg-[#C29B47] text-white shadow' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>রিভিউসমূহ ({reviews.length})</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* TAB 1: SITE SETTINGS ("ওয়েবসাইট সেটিংস & হিরো ছবি পরিবর্তন") */}
      {activeTab === 'site' && (
        <form onSubmit={handleSaveSiteConfig} className="bg-white p-6 sm:p-10 border border-[#E6E2D8] rounded-3xl shadow-sm space-y-8">
          
          <div className="border-b border-[#E6E2D8] pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">ওয়েবসাইট সেটিংস ও হিরো এডিটর</h2>
              <p className="text-xs text-[#8C887B]">হোম পেজ, হিরো ইমেজ, ব্র্যান্ড লোগো, ফুটার ও সোশ্যাল মিডিয়া পরিবর্তন করুন।</p>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#C29B47] hover:bg-[#a88338] text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Site Name & Author Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#3A3834]">ওয়েবসাইটের নাম (Site Name)</label>
              <input
                type="text"
                value={configForm.siteName}
                onChange={(e) => setConfigForm({ ...configForm, siteName: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs font-bold text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#3A3834]">লেখকের নাম (Author Name - ফুটারে ও সর্বত্র প্রদর্শন হবে)</label>
              <input
                type="text"
                value={configForm.authorName}
                onChange={(e) => setConfigForm({ ...configForm, authorName: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs font-bold text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#3A3834]">লেখকের পদবী/পরিচয় (Author Designation)</label>
              <input
                type="text"
                value={configForm.authorDesignation}
                onChange={(e) => setConfigForm({ ...configForm, authorDesignation: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs font-bold text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            {/* Site Logo Upload */}
            <div className="md:col-span-2">
              <ImageInputWithUpload
                label="ওয়েবসাইট লোগো (Site Logo)"
                sublabel="ওয়েবসাইট হেডার ও ফুটারে ব্র্যান্ড লোগো হিসেবে দেখাবে (খালি রাখলে লেখায় দেখাবে)।"
                value={configForm.siteLogo}
                onChange={(val) => setConfigForm({ ...configForm, siteLogo: val })}
              />
            </div>

            {/* Hero Featured Card Image */}
            <div className="md:col-span-2">
              <ImageInputWithUpload
                label="হিরো কার্ডের ছবি (Hero Featured Image)"
                sublabel="হিরো সেকশনের ডানপাশের কার্ডে দেখানো ছবি।"
                value={configForm.heroImage}
                onChange={(val) => setConfigForm({ ...configForm, heroImage: val })}
                required
              />
            </div>

            {/* Hero Soft Background Image */}
            <div className="md:col-span-2">
              <ImageInputWithUpload
                label="হিরো ব্যাকগ্রাউন্ড ছবি (Hero Background Image)"
                sublabel="হিরো সেকশনের পেছনে হালকা ট্রান্সপারেন্ট হিসেবে প্রদর্শিত ব্যাকগ্রাউন্ড ছবি।"
                value={configForm.heroBgImage || ''}
                onChange={(val) => setConfigForm({ ...configForm, heroBgImage: val })}
              />
            </div>

            {/* Hero Badge & Titles */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#3A3834]">হিরো ব্যাজ টেক্সট (Hero Badge Text)</label>
              <input
                type="text"
                placeholder="সাহিত্যিক ও প্রাবন্ধিক"
                value={configForm.heroBadgeText || ''}
                onChange={(e) => setConfigForm({ ...configForm, heroBadgeText: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs font-bold text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            {/* Hero Titles */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#3A3834]">হিরো হেডিং (Hero Title)</label>
              <input
                type="text"
                value={configForm.heroTitle}
                onChange={(e) => setConfigForm({ ...configForm, heroTitle: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs font-bold text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#3A3834]">অর্ডার বাটন টেক্সট (Hero Button Text)</label>
              <input
                type="text"
                value={configForm.heroButtonText}
                onChange={(e) => setConfigForm({ ...configForm, heroButtonText: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs font-bold text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-[#3A3834]">হিরো সাবটাইটেল (Hero Subtitle)</label>
              <textarea
                rows={2}
                value={configForm.heroSubtitle}
                onChange={(e) => setConfigForm({ ...configForm, heroSubtitle: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            {/* Delivery Fees Configuration */}
            <div className="md:col-span-2 p-5 bg-[#F9F8F5] border border-[#E6E2D8] rounded-2xl space-y-4">
              <h3 className="font-serif-bn font-bold text-base text-[#1D1E20]">ডেলিভারি চার্জ নির্ধারণ (Delivery Charge Settings)</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3A3834]">ঢাকা সিটি (৳)</label>
                  <input
                    type="number"
                    value={configForm.dhakaCityDeliveryFee ?? 50}
                    onChange={(e) => setConfigForm({ ...configForm, dhakaCityDeliveryFee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white border border-[#D9D3C7] rounded-xl text-xs font-bold text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3A3834]">ঢাকা সাব-আর্বান (৳)</label>
                  <input
                    type="number"
                    value={configForm.dhakaSuburbanDeliveryFee ?? 80}
                    onChange={(e) => setConfigForm({ ...configForm, dhakaSuburbanDeliveryFee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white border border-[#D9D3C7] rounded-xl text-xs font-bold text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3A3834]">ঢাকা সিটির বাহিরে (৳)</label>
                  <input
                    type="number"
                    value={configForm.outsideDhakaDeliveryFee ?? 95}
                    onChange={(e) => setConfigForm({ ...configForm, outsideDhakaDeliveryFee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white border border-[#D9D3C7] rounded-xl text-xs font-bold text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                  />
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-[#3A3834]">ফুটার টেক্সট (Footer Custom Text - ফুটারে লেখকের নামের নিচে দেখাবে)</label>
              <input
                type="text"
                placeholder="যেমন: সাহিত্যিক ও প্রাবন্ধিক"
                value={configForm.footerText}
                onChange={(e) => setConfigForm({ ...configForm, footerText: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#3A3834]">যোগাযোগ ইমেইল (Contact Email)</label>
              <input
                type="email"
                value={configForm.contactEmail}
                onChange={(e) => setConfigForm({ ...configForm, contactEmail: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            {/* Social Media Links & Visibility Controls */}
            <div className="md:col-span-2 p-5 bg-[#F9F8F5] border border-[#E6E2D8] rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-3">
                <h3 className="font-serif-bn font-bold text-base text-[#1D1E20]">সামাজিক যোগাযোগ মাধ্যম ও আইকন কন্ট্রোল</h3>
                <label className="flex items-center gap-2 text-xs font-bold text-[#C29B47] cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-[#D9D3C7] shadow-sm">
                  <input
                    type="checkbox"
                    checked={configForm.showSocialMediaSection !== false}
                    onChange={(e) => setConfigForm({ ...configForm, showSocialMediaSection: e.target.checked })}
                    className="w-4 h-4 text-[#C29B47] rounded border-[#D9D3C7]"
                  />
                  <span>সোশ্যাল মিডিয়া সেকশন অন রাখুন</span>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Facebook */}
                <div className="p-3 bg-white border border-[#D9D3C7] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#3A3834]">ফেসবুক (Facebook)</label>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#C29B47] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configForm.showFacebook !== false}
                        onChange={(e) => setConfigForm({ ...configForm, showFacebook: e.target.checked })}
                        className="w-3.5 h-3.5 text-[#C29B47] rounded border-[#D9D3C7]"
                      />
                      <span>শো করুন</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="https://facebook.com/your-page"
                    value={configForm.socialLinks.facebook || ''}
                    onChange={(e) => setConfigForm({
                      ...configForm,
                      socialLinks: { ...configForm.socialLinks, facebook: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-[#F9F8F5] border border-[#D9D3C7] rounded-lg text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                  />
                </div>

                {/* YouTube */}
                <div className="p-3 bg-white border border-[#D9D3C7] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#3A3834]">ইউটিউব (YouTube)</label>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#C29B47] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configForm.showYoutube !== false}
                        onChange={(e) => setConfigForm({ ...configForm, showYoutube: e.target.checked })}
                        className="w-3.5 h-3.5 text-[#C29B47] rounded border-[#D9D3C7]"
                      />
                      <span>শো করুন</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="https://youtube.com/@channel"
                    value={configForm.socialLinks.youtube || ''}
                    onChange={(e) => setConfigForm({
                      ...configForm,
                      socialLinks: { ...configForm.socialLinks, youtube: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-[#F9F8F5] border border-[#D9D3C7] rounded-lg text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                  />
                </div>

                {/* Twitter */}
                <div className="p-3 bg-white border border-[#D9D3C7] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#3A3834]">টুইটার / X (Twitter)</label>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#C29B47] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configForm.showTwitter !== false}
                        onChange={(e) => setConfigForm({ ...configForm, showTwitter: e.target.checked })}
                        className="w-3.5 h-3.5 text-[#C29B47] rounded border-[#D9D3C7]"
                      />
                      <span>শো করুন</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="https://x.com/username"
                    value={configForm.socialLinks.twitter || ''}
                    onChange={(e) => setConfigForm({
                      ...configForm,
                      socialLinks: { ...configForm.socialLinks, twitter: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-[#F9F8F5] border border-[#D9D3C7] rounded-lg text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                  />
                </div>

                {/* Instagram */}
                <div className="p-3 bg-white border border-[#D9D3C7] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#3A3834]">ইনস্টাগ্রাম (Instagram)</label>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#C29B47] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configForm.showInstagram !== false}
                        onChange={(e) => setConfigForm({ ...configForm, showInstagram: e.target.checked })}
                        className="w-3.5 h-3.5 text-[#C29B47] rounded border-[#D9D3C7]"
                      />
                      <span>শো করুন</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="https://instagram.com/username"
                    value={configForm.socialLinks.instagram || ''}
                    onChange={(e) => setConfigForm({
                      ...configForm,
                      socialLinks: { ...configForm.socialLinks, instagram: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-[#F9F8F5] border border-[#D9D3C7] rounded-lg text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                  />
                </div>

                {/* LinkedIn */}
                <div className="md:col-span-2 p-3 bg-white border border-[#D9D3C7] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#3A3834]">লিংকডইন (LinkedIn)</label>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#C29B47] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configForm.showLinkedin !== false}
                        onChange={(e) => setConfigForm({ ...configForm, showLinkedin: e.target.checked })}
                        className="w-3.5 h-3.5 text-[#C29B47] rounded border-[#D9D3C7]"
                      />
                      <span>শো করুন</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/username"
                    value={configForm.socialLinks.linkedin || ''}
                    onChange={(e) => setConfigForm({
                      ...configForm,
                      socialLinks: { ...configForm.socialLinks, linkedin: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-[#F9F8F5] border border-[#D9D3C7] rounded-lg text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                  />
                </div>
              </div>
            </div>

            {/* Security Settings: Admin Credentials */}
            <div className="md:col-span-2 pt-6 border-t border-[#E6E2D8] space-y-4">
              <h3 className="font-serif-bn font-bold text-lg text-[#1D1E20]">এডমিন নিরাপত্তা সেটিংস (Security Credentials)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3A3834]">এডমিন ইমেইল (Admin Email)</label>
                  <input
                    type="email"
                    required
                    value={configForm.adminEmail}
                    onChange={(e) => setConfigForm({ ...configForm, adminEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs font-bold text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3A3834]">এডমিন পাসওয়ার্ড (Admin Password)</label>
                  <input
                    type="text"
                    required
                    value={configForm.adminPassword}
                    onChange={(e) => setConfigForm({ ...configForm, adminPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs font-bold text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>ওয়েবসাইটের তথ্য আপডেট করুন</span>
            </button>
          </div>

        </form>
      )}

      {/* TAB 2: AUTHOR PROFILE ('author') */}
      {activeTab === 'author' && (
        <form onSubmit={handleSaveSiteConfig} className="bg-white p-6 sm:p-10 border border-[#E6E2D8] rounded-3xl shadow-sm space-y-8">
          <div className="border-b border-[#E6E2D8] pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">লেখক বায়োগ্রাফি এডিটর</h2>
              <p className="text-xs text-[#8C887B]">লেখকের নাম, ছবি, পদবী ও জীবন-দর্শন এডিট করুন।</p>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#C29B47] hover:bg-[#a88338] text-white text-xs font-bold rounded-xl shadow transition-colors"
            >
              সংরক্ষণ করুন
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#3A3834]">লেখকের নাম (Author Name)</label>
              <input
                type="text"
                value={configForm.authorName}
                onChange={(e) => setConfigForm({ ...configForm, authorName: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs font-bold text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#3A3834]">পদবী (Designation)</label>
              <input
                type="text"
                value={configForm.authorDesignation}
                onChange={(e) => setConfigForm({ ...configForm, authorDesignation: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            <div className="md:col-span-2">
              <ImageInputWithUpload
                label="লেখকের ছবি (Author Image)"
                sublabel="জীবন ও দর্শন পেইজে এবং ফুটারে ব্যবহৃত ছবি।"
                value={configForm.authorImage}
                onChange={(val) => setConfigForm({ ...configForm, authorImage: val })}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-[#3A3834]">সেকশন শিরোনাম (Section Heading)</label>
              <input
                type="text"
                placeholder="জীবন ও দর্শন"
                value={configForm.authorBioHeading || ''}
                onChange={(e) => setConfigForm({ ...configForm, authorBioHeading: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs font-bold text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-[#3A3834]">দর্শনের সংক্ষিপ্ত উক্তি (Philosophy Quote)</label>
              <input
                type="text"
                value={configForm.authorPhilosophyText}
                onChange={(e) => setConfigForm({ ...configForm, authorPhilosophyText: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-[#3A3834]">জীবন ও দর্শন বিস্তারিত বিবরণ (Bio Text)</label>
              <textarea
                rows={6}
                value={configForm.authorBioText}
                onChange={(e) => setConfigForm({ ...configForm, authorBioText: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: BOOKS MANAGEMENT ('books') */}
      {activeTab === 'books' && (
        <div className="bg-white p-6 sm:p-8 border border-[#E6E2D8] rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6E2D8] pb-4">
            <div>
              <h2 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">বই ক্যাটালগ ম্যানেজমেন্ট</h2>
              <p className="text-xs text-[#8C887B]">নতুন বই যুক্ত করুন, তথ্য ও প্রচ্ছদ এডিট করুন বা বই মুছে ফেলুন।</p>
            </div>

            <button
              onClick={() => handleOpenBookModal()}
              className="px-5 py-2.5 bg-[#C29B47] text-white text-xs font-bold rounded-xl hover:bg-[#a88338] shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন বই যোগ করুন</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((b) => (
              <div key={b.id} className="bg-[#F9F8F5] border border-[#E6E2D8] rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between group hover:border-[#C29B47] transition-all">
                <div className="space-y-3">
                  <div className="w-full h-48 bg-white rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner">
                    <img src={b.coverImage} alt={b.title} className="h-40 object-cover shadow-md rounded" />
                    {b.isNewRelease && (
                      <span className="absolute top-2 left-2 bg-[#C29B47] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                        নতুন
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#C29B47]">{b.category} • ৳{b.price}</span>
                    <h3 className="font-serif-bn font-bold text-lg text-[#1D1E20] line-clamp-1">{b.title}</h3>
                    <p className="text-xs text-[#8C887B] line-clamp-2 mt-1">{b.shortSynopsis}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-[#E6E2D8]">
                  <button
                    onClick={() => handleOpenBookModal(b)}
                    className="flex-1 py-2 bg-white border border-[#D9D3C7] text-xs font-bold text-[#1D1E20] rounded-xl hover:bg-[#EFECE6] flex items-center justify-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>এডিট</span>
                  </button>
                  <button
                    onClick={() => {
                      onDeleteBook(b.id);
                      triggerSaveToast(`"${b.title}" বইটি মুছে ফেলা হয়েছে!`);
                    }}
                    className="p-2 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-colors"
                    title="বইটি মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS MANAGEMENT ('orders') */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 sm:p-8 border border-[#E6E2D8] rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6E2D8] pb-4">
            <div>
              <h2 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">ক্যাশ-অন-ডেলিভারি অর্ডার তালিকা</h2>
              <p className="text-xs text-[#8C887B]">গ্রাহকদের বইয়ের অর্ডারের বিস্তারিত দেখুন এবং স্ট্যাটাস আপডেট করুন।</p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              {['all', 'pending', 'confirmed', 'delivered', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    orderStatusFilter === st
                      ? 'bg-[#1D1E20] text-white shadow'
                      : 'bg-[#EFECE6] text-[#5C584E] hover:bg-[#E2DDD3]'
                  }`}
                >
                  {st === 'all' ? 'সব' : st === 'pending' ? 'পেন্ডিং' : st === 'confirmed' ? 'কনফার্মড' : st === 'delivered' ? 'ডেলিভার্ড' : 'বাতিল'}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((ord) => (
                <div key={ord.id} className="p-5 bg-[#F9F8F5] border border-[#E6E2D8] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#C29B47]">{ord.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ord.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        ord.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {ord.status}
                      </span>
                      <span className="text-[10px] text-[#8C887B]">{ord.orderDate}</span>
                    </div>
                    <h4 className="font-bold text-base text-[#1D1E20]">{ord.customerName} ({ord.customerPhone})</h4>
                    <p className="text-xs text-[#5C584E]"><strong>বই:</strong> {ord.bookTitle} — {ord.quantity} টি (মোট: ৳{ord.totalPrice})</p>
                    <p className="text-xs text-[#8C887B]"><strong>ঠিকানা:</strong> {ord.customerAddress}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {ord.status === 'pending' && (
                      <button
                        onClick={() => {
                          onUpdateOrderStatus(ord.id, 'confirmed');
                          triggerSaveToast('অর্ডার কনফার্ম করা হয়েছে!');
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        কনফার্ম করুন
                      </button>
                    )}
                    {ord.status === 'confirmed' && (
                      <button
                        onClick={() => {
                          onUpdateOrderStatus(ord.id, 'delivered');
                          triggerSaveToast('অর্ডার ডেলিভার্ড হিসেবে চিহ্নিত করা হয়েছে!');
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        ডেলিভার্ড সম্পন্ন
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onDeleteOrder(ord.id);
                        triggerSaveToast(`অর্ডারটি (${ord.id}) মুছে ফেলা হয়েছে!`);
                      }}
                      className="p-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="অর্ডারটি মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-[#8C887B]">
              কোনো অর্ডার পাওয়া যায়নি।
            </div>
          )}
        </div>
      )}

      {/* TAB 5: BLOGS MANAGEMENT ('blogs') */}
      {activeTab === 'blogs' && (
        <div className="bg-white p-6 sm:p-8 border border-[#E6E2D8] rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-4">
            <div>
              <h2 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">ব্লগ ও খবর ম্যানেজমেন্ট</h2>
              <p className="text-xs text-[#8C887B]">নতুন খবর বা সাহিত্য ভাবনা প্রকাশ ও এডিট করুন।</p>
            </div>
            <button
              onClick={() => handleOpenBlogModal()}
              className="px-5 py-2.5 bg-[#C29B47] text-white text-xs font-bold rounded-xl hover:bg-[#a88338] shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন পোস্ট লিখুন</span>
            </button>
          </div>

          <div className="space-y-4">
            {blogs.map((post) => (
              <div key={post.id} className="bg-[#F9F8F5] p-5 rounded-2xl border border-[#E6E2D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={post.coverImage} alt={post.title} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#C29B47]">{post.category} • {post.date}</span>
                    <h4 className="font-serif-bn font-bold text-base text-[#1D1E20]">{post.title}</h4>
                    <p className="text-xs text-[#8C887B] line-clamp-1">{post.excerpt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenBlogModal(post)}
                    className="px-3 py-1.5 bg-white border border-[#D9D3C7] text-xs font-bold rounded-lg hover:bg-[#EFECE6]"
                  >
                    এডিট
                  </button>
                  <button
                    onClick={() => {
                      onDeleteBlog(post.id);
                      triggerSaveToast(`"${post.title}" ব্লগ পোস্টটি মুছে ফেলা হয়েছে!`);
                    }}
                    className="p-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="ব্লগ পোস্টটি মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: INQUIRIES & MESSAGES ('messages') */}
      {activeTab === 'messages' && (
        <div className="bg-white p-6 sm:p-8 border border-[#E6E2D8] rounded-3xl shadow-sm space-y-6">
          <div className="border-b border-[#E6E2D8] pb-4">
            <h2 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">গ্রাহক ও পাঠক বার্তা</h2>
            <p className="text-xs text-[#8C887B]">ওয়েবসাইটের কন্টাক্ট ফর্ম থেকে আসা ইনকোয়ারি বার্তা।</p>
          </div>

          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-5 space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedInquiry?.id === inq.id
                      ? 'bg-white border-[#C29B47] shadow-md'
                      : 'bg-[#F9F8F5] border-[#E6E2D8] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#1D1E20]">{inq.senderName}</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-[#8C887B]">{inq.timeAgo}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteInquiry(inq.id);
                          if (selectedInquiry?.id === inq.id) setSelectedInquiry(null);
                          triggerSaveToast('বার্তাটি মুছে ফেলা হয়েছে!');
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-100 rounded transition-colors"
                        title="বার্তা মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-[#C29B47] truncate mt-0.5">{inq.subject}</p>
                  <p className="text-xs text-[#8C887B] line-clamp-1 mt-1">{inq.message}</p>
                </div>
              ))}
            </div>

            <div className="md:col-span-7 bg-[#F9F8F5] p-6 border border-[#E6E2D8] rounded-2xl">
              {selectedInquiry ? (
                <div className="space-y-4">
                  <div className="border-b border-[#E6E2D8] pb-3 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-[#1D1E20]">{selectedInquiry.subject}</h3>
                      <p className="text-xs text-[#8C887B]">প্রেরক: {selectedInquiry.senderName} ({selectedInquiry.senderEmail})</p>
                    </div>
                    <button
                      onClick={() => {
                        onDeleteInquiry(selectedInquiry.id);
                        setSelectedInquiry(null);
                        triggerSaveToast('বার্তা মুছে ফেলা হয়েছে');
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg"
                      title="বার্তা মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[#3A3834] leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-[#E6E2D8]">
                    {selectedInquiry.message}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${selectedInquiry.senderEmail}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C29B47] text-white text-xs font-bold rounded-xl shadow hover:bg-[#a88338] transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>আপনার ইমেইল থেকে উত্তর পাঠান</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedInquiry.senderEmail);
                        triggerSaveToast('ইমেইল কপি করা হয়েছে!');
                      }}
                      className="px-4 py-2.5 bg-white border border-[#D9D3C7] text-xs font-bold text-[#1D1E20] rounded-xl hover:bg-[#EFECE6] transition-colors"
                    >
                      ইমেইল কপি করুন ({selectedInquiry.senderEmail})
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-xs text-[#8C887B]">
                  বামপাশ থেকে বার্তা সিলেক্ট করে বিস্তারিত দেখুন...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: REVIEWS MANAGEMENT ('reviews') */}
      {activeTab === 'reviews' && (
        <div className="bg-white p-6 sm:p-8 border border-[#E6E2D8] rounded-3xl shadow-sm space-y-6">
          <div className="border-b border-[#E6E2D8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">পাঠকদের রিভিউ ও রেটিং ম্যানাজমেন্ট</h2>
              <p className="text-xs text-[#8C887B]">ওয়েবসাইটে পাঠকদের দেওয়া রিভিউগুলো সরাসরি দেখুন ও অপ্রয়োজনীয়/ভুল রিভিউ মুছে ফেলুন।</p>
            </div>
            <div className="bg-[#FFF7E6] border border-[#C29B47]/30 px-3 py-1.5 rounded-xl text-xs font-bold text-[#C29B47] flex items-center gap-1.5 shrink-0">
              <Star className="w-4 h-4 fill-current text-[#C29B47]" />
              <span>মোট {reviews.length}টি রিভিউ</span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-16 bg-[#F9F8F5] rounded-2xl border border-[#E6E2D8] text-xs text-[#8C887B]">
              এখনো কোনো রিভিউ জমা পড়েনি।
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((rev) => {
                const b = books.find(item => item.id === rev.bookId);
                return (
                  <div key={rev.id} className="bg-[#F9F8F5] p-5 rounded-2xl border border-[#E6E2D8] space-y-3 relative group hover:border-[#C29B47] transition-all">
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <h4 className="font-bold text-sm text-[#1D1E20]">{rev.reviewerName}</h4>
                        {b && <p className="text-[11px] text-[#C29B47] font-semibold">বই: {b.title}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#8C887B]">{rev.date}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`আপনি কি "${rev.reviewerName}" এর এই রিভিউটি ডিলিট করতে চান?`)) {
                              onDeleteReview?.(rev.id);
                              triggerSaveToast('রিভিউ সফলভাবে মুছে ফেলা হয়েছে!');
                            }
                          }}
                          className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                          title="রিভিউটি মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>মুছে ফেলুন</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#3A3834] font-serif-bn italic leading-relaxed bg-white p-3 rounded-xl border border-[#E6E2D8]">
                      "{rev.comment}"
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT BOOK */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white border border-[#E6E2D8] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col p-5 sm:p-7 shadow-2xl relative my-auto overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3 pr-10 shrink-0">
              <h3 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">
                {editingBookId ? 'বইয়ের তথ্য সম্পাদনা করুন' : 'নতুন বই যুক্ত করুন'}
              </h3>
              <button
                onClick={() => setBookModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-[#F9F8F5] border border-[#D9D3C7] text-[#1D1E20] hover:bg-rose-50 hover:text-rose-600 rounded-full transition-colors shadow-sm"
                title="বন্ধ করুন (Close)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="flex flex-col flex-1 overflow-hidden mt-3">
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-bold text-[#3A3834]">বইয়ের নাম (Title) *</label>
                    <input
                      type="text"
                      required
                      value={bookForm.title || ''}
                      onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs font-bold focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#3A3834]">লেখকের নাম (Author) *</label>
                    <input
                      type="text"
                      required
                      placeholder="আহমেদ শরীফ"
                      value={bookForm.author || siteConfig.authorName || 'আহমেদ শরীফ'}
                      onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs font-bold focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#3A3834]">প্রকাশনী (Publisher) *</label>
                    <input
                      type="text"
                      required
                      placeholder="রাইয়ান প্রকাশন"
                      value={bookForm.publisher || 'রাইয়ান প্রকাশন'}
                      onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#3A3834]">ISBN নম্বর *</label>
                    <input
                      type="text"
                      required
                      placeholder="978-984-XXXX-XX-X"
                      value={bookForm.isbn || ''}
                      onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#3A3834]">ক্যাটাগরি *</label>
                    <input
                      type="text"
                      required
                      placeholder="উপন্যাস / কবিতা / প্রবন্ধ ইত্যাদি"
                      value={bookForm.category || ''}
                      onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#3A3834]">বিক্রি মূল্য (ছাড়ের পর) (৳) *</label>
                    <input
                      type="number"
                      required
                      value={bookForm.price || 400}
                      onChange={(e) => setBookForm({ ...bookForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#3A3834]">মূল মূল্য (ছাড়ের আগে) (৳) (ঐচ্ছিক)</label>
                    <input
                      type="number"
                      placeholder="যেমন: ৫৫০ (কাটা দাগ দেখাবে)"
                      value={bookForm.originalPrice || ''}
                      onChange={(e) => setBookForm({ ...bookForm, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#3A3834]">প্রকাশকাল / বছর</label>
                    <input
                      type="text"
                      placeholder="২০২৪"
                      value={bookForm.year || '২০২৪'}
                      onChange={(e) => setBookForm({ ...bookForm, year: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#3A3834]">পৃষ্ঠা সংখ্যা</label>
                    <input
                      type="number"
                      value={bookForm.pages || 250}
                      onChange={(e) => setBookForm({ ...bookForm, pages: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>

                  {/* Cover Image Upload Helper */}
                  <div className="sm:col-span-2">
                    <ImageInputWithUpload
                      label="বইয়ের কাভার ছবি (Cover Image)"
                      sublabel="বইয়ের সামনের প্রচ্ছদের ছবি আপলোড করুন অথবা লিংক দিন।"
                      value={bookForm.coverImage || ''}
                      onChange={(val) => setBookForm({ ...bookForm, coverImage: val })}
                      required
                    />
                  </div>

                  {/* PDF or Media Video Upload / Link */}
                  <div className="sm:col-span-2 space-y-1 p-3.5 bg-[#F9F8F5] border border-[#E6E2D8] rounded-2xl">
                    <label className="block text-xs font-bold text-[#1D1E20]">বইয়ের পিডিএফ ফাইল / ড্রাইভ লিংক / ইউটিউব ভিডিও লিংক (ঐচ্ছিক)</label>
                    <p className="text-[10px] text-[#8C887B]">পিডিএফ আপলোড করলে বা গুগল ড্রাইভ / ইউটিউব লিংক দিলে সরাসরি পাঠকরা দেখতে ও পড়তে পারবে।</p>
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="https://drive.google.com/file/.../view অথবা ইউটিউব লিংক"
                        value={bookForm.pdfUrl || ''}
                        onChange={(e) => setBookForm({ ...bookForm, pdfUrl: e.target.value })}
                        className="flex-1 w-full px-3 py-2 bg-white border border-[#D9D3C7] rounded-xl text-xs focus:outline-none focus:border-[#C29B47]"
                      />
                      <label className="shrink-0 px-3.5 py-2 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow">
                        <Upload className="w-3.5 h-3.5" />
                        <span>পিডিএফ আপলোড</span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 15 * 1024 * 1024) {
                              alert('ফাইল সাইজ ১৫ মেগাবাইটের বেশি হতে পারবে না। গুগল ড্রাইভ লিংক ব্যবহার করুন।');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setBookForm(prev => ({ ...prev, pdfUrl: reader.result as string }));
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-xs font-bold text-[#3A3834]">সংক্ষিপ্ত সারসংক্ষেপ (Short Synopsis)</label>
                    <textarea
                      rows={2}
                      value={bookForm.shortSynopsis || ''}
                      onChange={(e) => setBookForm({ ...bookForm, shortSynopsis: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-xs font-bold text-[#3A3834]">বিস্তারিত বিবরণ (Full Synopsis)</label>
                    <textarea
                      rows={3}
                      value={bookForm.fullSynopsis || ''}
                      onChange={(e) => setBookForm({ ...bookForm, fullSynopsis: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>

                  <div className="flex items-center gap-4 sm:col-span-2">
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bookForm.isNewRelease || false}
                        onChange={(e) => setBookForm({ ...bookForm, isNewRelease: e.target.checked })}
                        className="w-4 h-4 text-[#C29B47] rounded border-[#D9D3C7]"
                      />
                      <span>নতুন প্রকাশিত হিসেবে দেখাও</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="shrink-0 pt-3 border-t mt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl transition-colors shadow"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT BLOG */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white border border-[#E6E2D8] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col p-5 sm:p-7 shadow-2xl relative my-auto overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3 pr-10 shrink-0">
              <h3 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">
                {editingBlogId ? 'ব্লগ পোস্ট এডিট করুন' : 'নতুন ব্লগ পোস্ট তৈরি করুন'}
              </h3>
              <button
                onClick={() => setBlogModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-[#F9F8F5] border border-[#D9D3C7] text-[#1D1E20] hover:bg-rose-50 hover:text-rose-600 rounded-full transition-colors shadow-sm"
                title="বন্ধ করুন (Close)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="flex flex-col flex-1 overflow-hidden mt-3">
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#3A3834]">শিরোনাম (Title) *</label>
                <input
                  type="text"
                  required
                  value={blogForm.title || ''}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#F9F8F5] border rounded-xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#3A3834]">ক্যাটাগরি</label>
                <input
                  type="text"
                  value={blogForm.category || 'সাহিত্যচর্চা'}
                  onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#F9F8F5] border rounded-xl text-xs"
                />
              </div>

              {/* Blog Cover Image Upload Helper */}
              <ImageInputWithUpload
                label="ব্লগের কভার ছবি (Cover Image)"
                sublabel="ব্লগ পোস্টের কভার ফটো আপলোড করুন অথবা লিংক দিন।"
                value={blogForm.coverImage || ''}
                onChange={(val) => setBlogForm({ ...blogForm, coverImage: val })}
                required
              />

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#3A3834]">সারাংশ (Excerpt)</label>
                <textarea
                  rows={2}
                  value={blogForm.excerpt || ''}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#F9F8F5] border rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#3A3834]">মূল বক্তব্য (Full Content)</label>
                <textarea
                  rows={6}
                  value={blogForm.content || ''}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#F9F8F5] border rounded-xl text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="shrink-0 pt-3 border-t mt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl transition-colors shadow"
              >
                পাবলিশ করুন
              </button>
            </div>
          </form>
          </div>
        </div>
      )}

    </div>
  );
};
