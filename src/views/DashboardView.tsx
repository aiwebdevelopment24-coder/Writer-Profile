import React, { useState } from 'react';
import { UserProfile, Order, Review, BlogComment, InquiryMessage, Book, ViewMode } from '../types';
import { 
  Package, 
  MessageSquare, 
  Star, 
  MessageCircle, 
  Heart, 
  User, 
  Send, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Clock, 
  ShoppingBag,
  LogOut,
  Camera,
  Upload,
  Settings,
  Save,
  Smile,
  ImageIcon
} from 'lucide-react';
import { BookCoverImage } from '../components/BookCoverImage';

interface DashboardViewProps {
  currentUser: UserProfile;
  orders: Order[];
  reviews: Review[];
  blogComments: BlogComment[];
  inquiries: InquiryMessage[];
  books: Book[];
  wishlistIds: string[];
  onToggleWishlist: (bookId: string) => void;
  onUpdateReview: (review: Review) => void;
  onDeleteReview: (reviewId: string) => void;
  onUpdateComment: (comment: BlogComment) => void;
  onDeleteComment: (commentId: string) => void;
  onReplyInquiry: (inquiryId: string, message: string, responderName?: string, imageUrl?: string) => void;
  onDeleteInquiry?: (inquiryId: string) => void;
  onDeleteInquiryReply?: (inquiryId: string, replyId: string) => void;
  onEditInquiryMessage?: (inquiryId: string, message: string) => void;
  onEditInquiryReply?: (inquiryId: string, replyId: string, message: string) => void;
  onLogout: () => void;
  setCurrentView: (view: ViewMode) => void;
  onSelectBook: (book: Book) => void;
  onOpenOrderModal: (book?: Book) => void;
  onUpdateCurrentUser?: (updatedUser: UserProfile) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  orders,
  reviews,
  blogComments,
  inquiries,
  books,
  wishlistIds,
  onToggleWishlist,
  onUpdateReview,
  onDeleteReview,
  onUpdateComment,
  onDeleteComment,
  onReplyInquiry,
  onDeleteInquiry,
  onDeleteInquiryReply,
  onEditInquiryMessage,
  onEditInquiryReply,
  onLogout,
  setCurrentView,
  onSelectBook,
  onOpenOrderModal,
  onUpdateCurrentUser,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'messages' | 'reviews' | 'comments' | 'wishlist' | 'profile'>('orders');

  // Profile Edit Local States
  const isDigitsName = /^[0-9+]+$/.test(currentUser.name?.trim() || '');
  const initialDisplayName = (isDigitsName || !currentUser.name?.trim()) ? 'শ্রদ্ধেয় পাঠক' : currentUser.name;

  const [editName, setEditName] = useState(initialDisplayName);
  const [editEmailOrPhone, setEditEmailOrPhone] = useState(currentUser.emailOrPhone || '');
  const [editAddress, setEditAddress] = useState(currentUser.address || '');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState('');

  // Image & Lightbox & Inline Edit state for messages
  const [replyImages, setReplyImages] = useState<Record<string, string>>({});
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [editingMsgKey, setEditingMsgKey] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateCurrentUser) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateCurrentUser({
            ...currentUser,
            avatarUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter user specific data based on userKey or phone/email or name
  const userKey = currentUser.id || currentUser.emailOrPhone;

  const userOrders = orders.filter(o => 
    o.userKey === userKey || 
    o.customerPhone === currentUser.emailOrPhone ||
    o.customerName.toLowerCase() === currentUser.name.toLowerCase()
  );

  const userReviews = reviews.filter(r => 
    r.authorKey === userKey || 
    r.reviewerName.toLowerCase() === currentUser.name.toLowerCase()
  );

  const userComments = blogComments.filter(c => 
    c.userKey === userKey || 
    c.userName.toLowerCase() === currentUser.name.toLowerCase()
  );

  const userInquiries = inquiries.filter(i => 
    i.userKey === userKey || 
    i.senderName.toLowerCase() === currentUser.name.toLowerCase() ||
    i.senderEmail === currentUser.emailOrPhone ||
    i.senderPhone === currentUser.emailOrPhone
  );

  const wishlistBooks = books.filter(b => wishlistIds.includes(b.id));

  // Edit Review Modal State
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editReviewText, setEditReviewText] = useState('');
  const [editReviewRating, setEditReviewRating] = useState(5);

  // Edit Comment State
  const [editingComment, setEditingComment] = useState<BlogComment | null>(null);
  const [editCommentText, setEditCommentText] = useState('');

  // Inquiry Reply State per inquiry id
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const handleStartEditReview = (rev: Review) => {
    setEditingReview(rev);
    setEditReviewText(rev.comment);
    setEditReviewRating(rev.rating);
  };

  const handleSaveReview = () => {
    if (!editingReview) return;
    onUpdateReview({
      ...editingReview,
      comment: editReviewText,
      rating: editReviewRating,
    });
    setEditingReview(null);
  };

  const handleStartEditComment = (comment: BlogComment) => {
    setEditingComment(comment);
    setEditCommentText(comment.comment);
  };

  const handleSaveComment = () => {
    if (!editingComment) return;
    onUpdateComment({
      ...editingComment,
      comment: editCommentText,
    });
    setEditingComment(null);
  };

  const handleSendInquiryReply = (inquiryId: string) => {
    const msg = replyInputs[inquiryId];
    if (!msg || !msg.trim()) return;
    onReplyInquiry(inquiryId, msg.trim());
    setReplyInputs(prev => ({ ...prev, [inquiryId]: '' }));
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-full">নিশ্চিতকৃত</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">ডেলিভারি সম্পন্ন</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-full">বাতিলকৃত</span>;
      default:
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full">অপেক্ষমাণ (Pending)</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Profile Header Banner */}
      <div className="bg-[#EFECE6] border border-[#E2DDD3] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="relative group w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#C29B47] text-white flex items-center justify-center font-serif-bn font-bold text-3xl shadow-md border-2 border-white shrink-0 overflow-hidden">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={initialDisplayName} className="w-full h-full object-cover" />
            ) : (
              initialDisplayName.charAt(0).toUpperCase()
            )}
            
            <label 
              className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
              title="ছবি পরিবর্তন করুন"
            >
              <Camera className="w-5 h-5 mb-0.5" />
              <span>ছবি পরিবর্তন</span>
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white border border-[#D9D3C7] rounded-full text-[11px] font-bold text-[#8C887B] mb-1">
              <User className="w-3 h-3 text-[#C29B47]" />
              <span>পাঠক ড্যাশবোর্ড</span>
            </div>
            <h1 className="font-serif-bn font-bold text-2xl sm:text-3xl text-[#1D1E20]">
              স্বাগতম, {initialDisplayName}
            </h1>
            <p className="text-xs text-[#5C584E] font-medium mt-0.5">
              {currentUser.emailOrPhone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveSubTab('profile')}
            className="px-4 py-2.5 bg-white hover:bg-[#1D1E20] hover:text-white border border-[#D9D3C7] text-[#1D1E20] text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-[#C29B47]" />
            <span>প্রোফাইল সম্পাদন</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E6E2D8] pb-3">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'profile'
              ? 'bg-[#1D1E20] text-white shadow'
              : 'bg-[#EFECE6] text-[#5C584E] hover:bg-[#E2DDD3]'
          }`}
        >
          <Settings className="w-4 h-4 text-[#C29B47]" />
          <span>প্রোফাইল ও নাম</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'orders'
              ? 'bg-[#1D1E20] text-white shadow'
              : 'bg-[#EFECE6] text-[#5C584E] hover:bg-[#E2DDD3]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>আমার অর্ডার ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('messages')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'messages'
              ? 'bg-[#1D1E20] text-white shadow'
              : 'bg-[#EFECE6] text-[#5C584E] hover:bg-[#E2DDD3]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>কথোপকথন ({userInquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reviews')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'reviews'
              ? 'bg-[#1D1E20] text-white shadow'
              : 'bg-[#EFECE6] text-[#5C584E] hover:bg-[#E2DDD3]'
          }`}
        >
          <Star className="w-4 h-4 text-[#C29B47]" />
          <span>আমার রিভিউ ({userReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('comments')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'comments'
              ? 'bg-[#1D1E20] text-white shadow'
              : 'bg-[#EFECE6] text-[#5C584E] hover:bg-[#E2DDD3]'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>ব্লগ মন্তব্য ({userComments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wishlist')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'wishlist'
              ? 'bg-[#1D1E20] text-white shadow'
              : 'bg-[#EFECE6] text-[#5C584E] hover:bg-[#E2DDD3]'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>উইশলিস্ট ({wishlistBooks.length})</span>
        </button>
      </div>

      {/* Tab 0: Profile & Custom Name Edit */}
      {activeSubTab === 'profile' && (
        <div className="bg-white border border-[#E6E2D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div className="border-b border-[#F2EFE9] pb-4">
            <h2 className="font-serif-bn font-bold text-xl sm:text-2xl text-[#1D1E20] flex items-center gap-2">
              <User className="w-6 h-6 text-[#C29B47]" />
              <span>আপনার প্রোফাইল তথ্য ও নাম পরিবর্তন করুন</span>
            </h2>
            <p className="text-xs text-[#8C887B] mt-1">
              এখানে যেকোনো পছন্দের নাম লিখতে পারেন (যেমন: আপনার নিজস্ব নাম বা যেকোনো সুন্দর উপাধি)। আপনার অ্যাকাউন্ট ও অর্ডারে এই নামটিই দৃশ্যমান হবে।
            </p>
          </div>

          {profileSaveSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{profileSaveSuccess}</span>
            </div>
          )}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!editName.trim()) return;
              if (onUpdateCurrentUser) {
                onUpdateCurrentUser({
                  ...currentUser,
                  name: editName.trim(),
                  emailOrPhone: editEmailOrPhone.trim() || currentUser.emailOrPhone,
                  address: editAddress.trim(),
                });
                setProfileSaveSuccess('আপনার প্রোফাইল তথ্য ও নাম সফলভাবে পরিবর্তন করা হয়েছে!');
                setTimeout(() => setProfileSaveSuccess(''), 3000);
              }
            }} 
            className="space-y-6 max-w-2xl"
          >
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1D1E20]">
                আপনার নাম (Display Name) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="যেমন: তানভীর আহমেদ / শ্রদ্ধেয় পাঠক / আপনার নিজস্ব নাম"
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] font-bold focus:outline-none focus:border-[#C29B47]"
              />
              <p className="text-[11px] text-[#8C887B]">
                ফোন নম্বর দিয়ে বা ইমেইল দিয়ে লগইন করা থাকলেও আপনার পছন্দমতো যেকোনো নাম এখানে বসাতে পারেন।
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1D1E20]">
                ইমেইল / মোবাইল নাম্বার (Contact Info)
              </label>
              <input
                type="text"
                value={editEmailOrPhone}
                onChange={(e) => setEditEmailOrPhone(e.target.value)}
                placeholder="ইমেইল বা মোবাইল নাম্বার"
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1D1E20]">
                ডিফল্ট ডেলিভারি ঠিকানা (Default Delivery Address)
              </label>
              <textarea
                rows={3}
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder="যেমন: বাসা #১২, রোড #৪, ধানমন্ডি, ঢাকা"
                className="w-full px-4 py-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
            >
              <Save className="w-4 h-4" />
              <span>পরিবর্তিত তথ্য সংরক্ষণ করুন</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 1: Orders History & Admin Status */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="font-serif-bn font-bold text-xl text-[#1D1E20]">
            অর্ডার হিস্ট্রি ও স্ট্যাটাস
          </h2>

          {userOrders.length > 0 ? (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-white border border-[#E6E2D8] rounded-2xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2EFE9] pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#8C887B]">অর্ডার ID: #{order.id.slice(-6)}</span>
                        {getOrderStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-[#8C887B]">তারিখ: {order.orderDate}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#8C887B]">মোট মূল্য:</span>
                      <strong className="block text-lg font-serif-bn font-bold text-[#1D1E20]">৳ {order.totalPrice}</strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-serif-bn font-bold text-lg text-[#1D1E20]">{order.bookTitle}</h4>
                      <p className="text-xs text-[#5C584E] mt-0.5">
                        পরিমাণ: <span className="font-bold">{order.quantity} টি</span> | দাম: ৳ {order.bookPrice}
                      </p>
                      <p className="text-xs text-[#8C887B] mt-1">
                        প্রাপকের ঠিকানা: {order.customerAddress} ({order.customerPhone})
                      </p>
                    </div>

                    <div className="px-3 py-2 bg-[#F9F8F5] border border-[#E2DDD3] rounded-xl text-xs space-y-1 w-full sm:w-auto">
                      <div className="flex justify-between gap-4 text-[#8C887B]">
                        <span>বইয়ের মূল্য:</span>
                        <span>৳ {order.bookPrice * order.quantity}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-[#8C887B]">
                        <span>ডেলিভারি চার্জ:</span>
                        <span>৳ {order.deliveryFee || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-[#E6E2D8] space-y-3">
              <ShoppingBag className="w-10 h-10 text-[#C29B47] mx-auto" />
              <h3 className="font-serif-bn font-bold text-lg text-[#1D1E20]">আপনার কোনো অর্ডার নেই!</h3>
              <p className="text-xs text-[#8C887B]">আপনার পছন্দের বই অর্ডার করুন খুব সহজেই।</p>
              <button
                onClick={() => setCurrentView('books')}
                className="px-5 py-2.5 bg-[#C29B47] text-white text-xs font-bold rounded-xl shadow hover:bg-[#a88338] transition-colors"
              >
                বইসমূহ দেখুন
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Messages & Conversation Threads (Messenger Style) */}
      {activeSubTab === 'messages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-bn font-bold text-xl text-[#1D1E20] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#C29B47]" />
              <span>লেখক ও টিমের সাথে কথোপকথন (মেসেঞ্জার সাপোর্ট)</span>
            </h2>
            <button
              onClick={() => setCurrentView('contact')}
              className="px-4 py-2 bg-[#C29B47] text-white text-xs font-bold rounded-xl shadow hover:bg-[#a88338] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>নতুন প্রশ্ন / বার্তা পাঠান</span>
            </button>
          </div>

          {userInquiries.length > 0 ? (
            <div className="space-y-6">
              {userInquiries.map((inquiry) => (
                <div 
                  key={inquiry.id}
                  className="bg-white border border-[#E6E2D8] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-3">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-[#C29B47] block">
                        বিষয়: {inquiry.subject}
                      </span>
                      <p className="text-[11px] text-[#8C887B]">{inquiry.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-[#FFF7E6] text-[#C29B47] border border-[#C29B47]/30 text-[11px] font-bold rounded-full">
                        {inquiry.replies?.length ? `${inquiry.replies.length} টি উত্তর` : inquiry.adminReply ? 'উত্তর প্রদান করা হয়েছে' : 'প্রক্রিয়াধীন'}
                      </span>
                      {onDeleteInquiry && (
                        <button
                          type="button"
                          onClick={() => onDeleteInquiry(inquiry.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="সম্পূর্ণ থ্রেডটি মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Messenger Chat Container */}
                  <div className="bg-[#F9F8F5] p-4 rounded-2xl border border-[#E6E2D8] space-y-3 max-h-[450px] overflow-y-auto">
                    {/* Primary Message (Sent by User -> Right Aligned) */}
                    <div className="flex flex-col items-end gap-1 max-w-[85%] ml-auto group">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#8C887B] font-bold px-1">
                        {onEditInquiryMessage && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMsgKey(`main-${inquiry.id}`);
                              setEditingText(inquiry.message);
                            }}
                            className="p-1 text-[#C29B47] hover:bg-[#C29B47]/10 rounded transition-colors cursor-pointer"
                            title="সম্পাদনা করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteInquiry && (
                          <button
                            type="button"
                            onClick={() => onDeleteInquiry(inquiry.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="বার্তা মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span>{inquiry.date}</span>
                        <span>•</span>
                        <span>{inquiry.senderName || currentUser.name}</span>
                        {inquiry.avatarUrl || currentUser.avatarUrl ? (
                          <img 
                            src={inquiry.avatarUrl || currentUser.avatarUrl} 
                            alt={currentUser.name} 
                            className="w-4 h-4 rounded-full object-cover border border-[#C29B47]" 
                          />
                        ) : (
                          <span className="w-4 h-4 rounded-full bg-[#C29B47] text-white flex items-center justify-center text-[8px] font-bold">
                            {(currentUser.name || 'U').charAt(0)}
                          </span>
                        )}
                      </div>

                      <div className="bg-[#1D1E20] text-white p-3.5 rounded-2xl rounded-tr-sm text-xs leading-relaxed space-y-2 shadow-xs w-full">
                        {editingMsgKey === `main-${inquiry.id}` ? (
                          <div className="space-y-2">
                            <textarea
                              rows={3}
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full p-2 bg-white text-[#1D1E20] border border-[#C29B47] rounded-lg text-xs focus:outline-none"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingMsgKey(null)}
                                className="px-2.5 py-1 text-[11px] font-bold text-gray-300 hover:text-white rounded-lg"
                              >
                                বাতিল
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (onEditInquiryMessage && editingText.trim()) {
                                    onEditInquiryMessage(inquiry.id, editingText);
                                  }
                                  setEditingMsgKey(null);
                                }}
                                className="px-3 py-1 text-[11px] font-bold bg-[#C29B47] text-white rounded-lg hover:bg-[#A88234]"
                              >
                                সংরক্ষণ
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="whitespace-pre-line font-medium">{inquiry.message}</p>
                            {inquiry.editedAt && (
                              <span className="text-[9px] text-gray-400 italic block">(সম্পাদিত)</span>
                            )}
                          </>
                        )}

                        {inquiry.imageUrl && (
                          <img 
                            src={inquiry.imageUrl} 
                            alt="Attached" 
                            onClick={() => setEnlargedImage(inquiry.imageUrl || null)}
                            className="max-h-48 rounded-xl object-cover cursor-pointer border border-[#E2DDD3] hover:opacity-90 transition-opacity"
                          />
                        )}
                      </div>
                    </div>

                    {/* Legacy Admin Reply (Left Aligned for User) */}
                    {inquiry.adminReply && (!inquiry.replies || inquiry.replies.length === 0) && (
                      <div className="flex flex-col items-start gap-1 max-w-[85%] mr-auto">
                        <div className="flex items-center gap-2 text-[10px] text-[#C29B47] font-bold px-1">
                          <span>লেখক / টিমের উত্তর</span>
                        </div>
                        <div className="bg-[#FFF7E6] border border-[#C29B47]/30 text-[#1D1E20] p-3.5 rounded-2xl rounded-tl-sm text-xs leading-relaxed space-y-1 shadow-xs">
                          <p className="whitespace-pre-line">{inquiry.adminReply}</p>
                        </div>
                      </div>
                    )}

                    {/* Threaded Messenger Bubbles */}
                    {inquiry.replies && inquiry.replies.length > 0 && inquiry.replies.map((reply) => {
                      const isMe = reply.sender === 'user';
                      return (
                        <div 
                          key={reply.id} 
                          className={`flex flex-col gap-1 max-w-[85%] group ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                        >
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold px-1 ${isMe ? 'text-[#8C887B]' : 'text-[#C29B47]'}`}>
                            {isMe && onEditInquiryReply && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMsgKey(reply.id);
                                  setEditingText(reply.message);
                                }}
                                className="p-1 text-[#C29B47] hover:bg-[#C29B47]/10 rounded transition-colors cursor-pointer"
                                title="সম্পাদনা করুন"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {isMe && onDeleteInquiryReply && (
                              <button
                                type="button"
                                onClick={() => onDeleteInquiryReply(inquiry.id, reply.id)}
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                title="এই বার্তাটি মুছুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <span>{reply.senderName || (isMe ? currentUser.name : 'এডমিন')}</span>
                            <span>•</span>
                            <span className="font-normal">{reply.date}</span>
                            {isMe && (
                              reply.avatarUrl || currentUser.avatarUrl ? (
                                <img src={reply.avatarUrl || currentUser.avatarUrl} alt={currentUser.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full bg-[#C29B47] text-white flex items-center justify-center text-[7px] font-bold">
                                  {(currentUser.name || 'U').charAt(0)}
                                </span>
                              )
                            )}
                          </div>

                          <div 
                            className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 shadow-xs w-full ${
                              isMe 
                                ? 'bg-[#1D1E20] text-white rounded-tr-sm' 
                                : 'bg-[#FFF7E6] border border-[#C29B47]/30 text-[#1D1E20] rounded-tl-sm'
                            }`}
                          >
                            {editingMsgKey === reply.id ? (
                              <div className="space-y-2">
                                <textarea
                                  rows={3}
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="w-full p-2 bg-white text-[#1D1E20] border border-[#C29B47] rounded-lg text-xs focus:outline-none"
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingMsgKey(null)}
                                    className="px-2.5 py-1 text-[11px] font-bold text-gray-300 hover:text-white rounded-lg"
                                  >
                                    বাতিল
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onEditInquiryReply && editingText.trim()) {
                                        onEditInquiryReply(inquiry.id, reply.id, editingText);
                                      }
                                      setEditingMsgKey(null);
                                    }}
                                    className="px-3 py-1 text-[11px] font-bold bg-[#C29B47] text-white rounded-lg hover:bg-[#A88234]"
                                  >
                                    সংরক্ষণ
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="whitespace-pre-line font-medium">{reply.message}</p>
                                {reply.editedAt && (
                                  <span className="text-[9px] text-gray-400 italic block">(সম্পাদিত)</span>
                                )}
                              </>
                            )}

                            {reply.imageUrl && (
                              <img 
                                src={reply.imageUrl} 
                                alt="Attachment" 
                                onClick={() => setEnlargedImage(reply.imageUrl || null)}
                                className="max-h-48 rounded-xl object-cover cursor-pointer border border-[#E6E2D8] hover:opacity-90 transition-opacity"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Messenger Reply Input Bar */}
                  <div className="bg-white p-3 border border-[#E6E2D8] rounded-2xl space-y-2">
                    {replyImages[inquiry.id] && (
                      <div className="relative inline-block">
                        <img 
                          src={replyImages[inquiry.id]} 
                          alt="Attachment preview" 
                          className="w-16 h-16 object-cover rounded-xl border border-[#C29B47]"
                        />
                        <button
                          type="button"
                          onClick={() => setReplyImages(prev => ({ ...prev, [inquiry.id]: '' }))}
                          className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 hover:bg-rose-700 shadow"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <label 
                        className="p-2.5 bg-[#F9F8F5] hover:bg-[#EFECE6] border border-[#D9D3C7] rounded-xl text-[#5C584E] cursor-pointer transition-colors"
                        title="ছবি পাঠান"
                      >
                        <ImageIcon className="w-4 h-4 text-[#C29B47]" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) {
                                  setReplyImages(prev => ({ ...prev, [inquiry.id]: ev.target?.result as string }));
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      <input
                        type="text"
                        placeholder="আপনার জবাব বা নতুন বার্তা লিখুন..."
                        value={replyInputs[inquiry.id] || ''}
                        onChange={(e) => setReplyInputs(prev => ({ ...prev, [inquiry.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const msg = replyInputs[inquiry.id];
                            const img = replyImages[inquiry.id];
                            if ((msg && msg.trim()) || img) {
                              onReplyInquiry(inquiry.id, (msg || '').trim(), initialDisplayName, img || undefined);
                              setReplyInputs(prev => ({ ...prev, [inquiry.id]: '' }));
                              setReplyImages(prev => ({ ...prev, [inquiry.id]: '' }));
                            }
                          }
                        }}
                        className="flex-1 px-4 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const msg = replyInputs[inquiry.id];
                          const img = replyImages[inquiry.id];
                          if ((msg && msg.trim()) || img) {
                            onReplyInquiry(inquiry.id, (msg || '').trim(), initialDisplayName, img || undefined);
                            setReplyInputs(prev => ({ ...prev, [inquiry.id]: '' }));
                            setReplyImages(prev => ({ ...prev, [inquiry.id]: '' }));
                          }
                        }}
                        className="px-4 py-2.5 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>পাঠান</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-[#E6E2D8] space-y-3">
              <MessageSquare className="w-10 h-10 text-[#C29B47] mx-auto" />
              <h3 className="font-serif-bn font-bold text-lg text-[#1D1E20]">কোনো বার্তা নেই</h3>
              <p className="text-xs text-[#8C887B]">লেখকের সাথে যেকোনো প্রশ্ন বা বার্তা শেয়ার করুন।</p>
              <button
                onClick={() => setCurrentView('contact')}
                className="px-5 py-2.5 bg-[#C29B47] text-white text-xs font-bold rounded-xl shadow hover:bg-[#a88338] transition-colors cursor-pointer"
              >
                যোগাযোগ পেজে যান
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Reviews */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-4">
          <h2 className="font-serif-bn font-bold text-xl text-[#1D1E20]">
            আমার প্রকাশিত বইয়ের রিভিউসমূহ
          </h2>

          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((rev) => {
                const book = books.find(b => b.id === rev.bookId);
                const isEditing = editingReview?.id === rev.id;

                return (
                  <div key={rev.id} className="bg-white border border-[#E6E2D8] rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-3">
                      <div>
                        <h4 className="font-serif-bn font-bold text-base text-[#1D1E20]">
                          বই: {book ? book.title : 'অজানা বই'}
                        </h4>
                        <p className="text-xs text-[#8C887B]">{rev.date}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!isEditing && (
                          <>
                            <button
                              onClick={() => handleStartEditReview(rev)}
                              className="p-1.5 text-[#5C584E] hover:text-[#C29B47] hover:bg-[#EFECE6] rounded-lg transition-colors cursor-pointer"
                              title="সম্পাদনা করুন"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteReview(rev.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 bg-[#F9F8F5] p-4 rounded-xl border border-[#D9D3C7]">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-[#3A3834] mr-2">রেটিং:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditReviewRating(star)}
                              className="p-1"
                            >
                              <Star className={`w-5 h-5 ${star <= editReviewRating ? 'fill-[#C29B47] text-[#C29B47]' : 'text-gray-300'}`} />
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={3}
                          value={editReviewText}
                          onChange={(e) => setEditReviewText(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                        />

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSaveReview}
                            className="px-4 py-2 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>সংরক্ষণ করুন</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingReview(null)}
                            className="px-4 py-2 bg-[#EFECE6] text-[#5C584E] text-xs font-bold rounded-lg hover:bg-[#E2DDD3] transition-colors"
                          >
                            বাতিল
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= rev.rating ? 'fill-[#C29B47] text-[#C29B47]' : 'text-gray-200'}`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-[#3A3834] leading-relaxed">{rev.comment}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-[#E6E2D8] space-y-2">
              <Star className="w-10 h-10 text-[#C29B47] mx-auto" />
              <h3 className="font-serif-bn font-bold text-lg text-[#1D1E20]">কোনো রিভিউ পাওয়া যায়নি</h3>
              <p className="text-xs text-[#8C887B]">আপনি যে বইগুলো পড়েছেন তার উপর মতামত প্রকাশ করতে পারেন।</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Blog Comments */}
      {activeSubTab === 'comments' && (
        <div className="space-y-4">
          <h2 className="font-serif-bn font-bold text-xl text-[#1D1E20]">
            আমার ব্লগ মন্তব্যসমূহ
          </h2>

          {userComments.length > 0 ? (
            <div className="space-y-4">
              {userComments.map((comment) => {
                const isEditing = editingComment?.id === comment.id;

                return (
                  <div key={comment.id} className="bg-white border border-[#E6E2D8] rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-2">
                      <span className="text-xs text-[#8C887B]">{comment.date}</span>
                      
                      {!isEditing && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartEditComment(comment)}
                            className="p-1.5 text-[#5C584E] hover:text-[#C29B47] hover:bg-[#EFECE6] rounded-lg transition-colors cursor-pointer"
                            title="সম্পাদনা করুন"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteComment(comment.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 bg-[#F9F8F5] p-4 rounded-xl border border-[#D9D3C7]">
                        <textarea
                          rows={3}
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                        />

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSaveComment}
                            className="px-4 py-2 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>সংরক্ষণ করুন</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingComment(null)}
                            className="px-4 py-2 bg-[#EFECE6] text-[#5C584E] text-xs font-bold rounded-lg hover:bg-[#E2DDD3] transition-colors"
                          >
                            বাতিল
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[#3A3834] leading-relaxed">{comment.comment}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-[#E6E2D8] space-y-2">
              <MessageCircle className="w-10 h-10 text-[#C29B47] mx-auto" />
              <h3 className="font-serif-bn font-bold text-lg text-[#1D1E20]">কোনো মন্তব্য নেই</h3>
              <p className="text-xs text-[#8C887B]">ব্লগ পোস্টে আপনার মতামত মন্তব্য আকারে জানাতে পারেন।</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Wishlist */}
      {activeSubTab === 'wishlist' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-bn font-bold text-xl text-[#1D1E20]">
              আমার সংরক্ষিত বইসমূহ
            </h2>
            <button
              onClick={() => setCurrentView('wishlist')}
              className="text-xs font-bold text-[#C29B47] hover:underline"
            >
              উইশলিস্ট পেজে যান →
            </button>
          </div>

          {wishlistBooks.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistBooks.map((book) => (
                <div key={book.id} className="bg-white border border-[#E6E2D8] rounded-2xl p-4 flex gap-4 shadow-sm items-center">
                  <div className="w-16 h-24 bg-[#EFECE6] rounded-lg shrink-0 overflow-hidden">
                    <BookCoverImage src={book.coverImage} alt={book.title} containerClassName="w-16 h-24" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-serif-bn font-bold text-base text-[#1D1E20] truncate">{book.title}</h4>
                    <p className="text-xs font-bold text-[#C29B47]">৳ {book.price}</p>
                    <button
                      onClick={() => onOpenOrderModal(book)}
                      className="px-3 py-1.5 bg-[#1D1E20] text-white text-[11px] font-bold rounded-lg hover:bg-[#C29B47] transition-colors"
                    >
                      অর্ডার করুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-[#E6E2D8] space-y-2">
              <Heart className="w-10 h-10 text-rose-500 mx-auto" />
              <h3 className="font-serif-bn font-bold text-lg text-[#1D1E20]">উইশলিস্ট খালি</h3>
              <p className="text-xs text-[#8C887B]">আপনার পছন্দের বইগুলো সংরক্ষণ করে রাখুন।</p>
            </div>
          )}
        </div>
      )}

      {/* Image Lightbox Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-black p-2">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-black p-2 rounded-full z-10 transition-colors cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={enlargedImage} alt="Enlarged view" className="max-w-full max-h-[85vh] object-contain rounded-xl mx-auto" />
          </div>
        </div>
      )}

    </div>
  );
};
