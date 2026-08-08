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
  LogOut
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
  onReplyInquiry: (inquiryId: string, message: string) => void;
  onLogout: () => void;
  setCurrentView: (view: ViewMode) => void;
  onSelectBook: (book: Book) => void;
  onOpenOrderModal: (book?: Book) => void;
  onUpdateUserProfile?: (updatedUser: UserProfile) => void;
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
  onLogout,
  setCurrentView,
  onSelectBook,
  onOpenOrderModal,
  onUpdateUserProfile,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'messages' | 'reviews' | 'comments' | 'wishlist'>('orders');

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

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

  const handleSaveProfile = () => {
    if (!editName.trim()) return;
    const updated: UserProfile = {
      ...currentUser,
      name: editName.trim(),
      avatarUrl: editAvatarUrl.trim() || undefined,
    };
    if (onUpdateUserProfile) {
      onUpdateUserProfile(updated);
    }
    setIsEditingProfile(false);
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setEditAvatarUrl(result);
      }
      setIsUploadingAvatar(false);
    };
    reader.onerror = () => {
      setIsUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
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
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md border-2 border-white shrink-0"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#C29B47] text-white flex items-center justify-center font-serif-bn font-bold text-3xl shadow-md border-2 border-white shrink-0">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white border border-[#D9D3C7] rounded-full text-[11px] font-bold text-[#8C887B] mb-1">
              <User className="w-3 h-3 text-[#C29B47]" />
              <span>পাঠক ড্যাশবোর্ড</span>
            </div>
            <h1 className="font-serif-bn font-bold text-2xl sm:text-3xl text-[#1D1E20]">
              স্বাগতম, {currentUser.name}
            </h1>
            <p className="text-xs text-[#5C584E] font-medium mt-0.5">
              {currentUser.emailOrPhone}
            </p>

            {profileSaveSuccess && (
              <p className="text-xs text-emerald-600 font-bold mt-1">
                ✓ প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditName(currentUser.name);
              setEditAvatarUrl(currentUser.avatarUrl || '');
              setIsEditingProfile(true);
            }}
            className="px-4 py-2.5 bg-[#C29B47] hover:bg-[#a88338] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
          >
            <Edit3 className="w-4 h-4" />
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

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white border border-[#E6E2D8] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-4">
              <h3 className="font-serif-bn font-bold text-xl text-[#1D1E20]">
                প্রোফাইল তথ্য আপডেট করুন
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 text-[#8C887B] hover:text-[#1D1E20] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Avatar Preview */}
              <div className="flex flex-col items-center gap-3">
                {editAvatarUrl ? (
                  <img
                    src={editAvatarUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#C29B47] shadow"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-[#C29B47] text-white flex items-center justify-center font-bold text-2xl">
                    {editName.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}

                <label className="px-4 py-2 bg-[#EFECE6] hover:bg-[#E2DDD3] text-[#1D1E20] text-xs font-bold rounded-xl cursor-pointer border border-[#D9D3C7] transition-colors">
                  <span>{isUploadingAvatar ? 'আপলোড হচ্ছে...' : 'প্রোফাইল ছবি আপলোড করুন'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A3834] mb-1">
                  আপনার সম্পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="আপনার নাম লিখুন..."
                  className="w-full px-4 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A3834] mb-1">
                  মোবাইল নম্বর / ইমেইল (পরিবর্তনযোগ্য নয়)
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser.emailOrPhone}
                  className="w-full px-4 py-2.5 bg-[#EFECE6] border border-[#D9D3C7] rounded-xl text-xs text-[#8C887B] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-3 bg-[#C29B47] hover:bg-[#a88338] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>সংরক্ষণ করুন</span>
              </button>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="px-5 py-3 bg-[#EFECE6] hover:bg-[#E2DDD3] text-[#5C584E] text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E6E2D8] overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeSubTab === 'orders'
              ? 'bg-[#1D1E20] text-white shadow'
              : 'bg-[#EFECE6] text-[#5C584E] hover:bg-[#E2DDD3]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>আমার অর্ডারসমূহ ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('messages')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
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
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
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
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
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
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeSubTab === 'wishlist'
              ? 'bg-[#1D1E20] text-white shadow'
              : 'bg-[#EFECE6] text-[#5C584E] hover:bg-[#E2DDD3]'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>উইশলিস্ট ({wishlistBooks.length})</span>
        </button>
      </div>

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

      {/* Tab 2: Messages & Conversation Threads */}
      {activeSubTab === 'messages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-bn font-bold text-xl text-[#1D1E20]">
              লেখক / টিমের সাথে পূর্ববর্তী কথোপকথন
            </h2>
            <button
              onClick={() => setCurrentView('contact')}
              className="px-4 py-2 bg-[#C29B47] text-white text-xs font-bold rounded-xl shadow hover:bg-[#a88338] transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>নতুন বার্তা পাঠান</span>
            </button>
          </div>

          {userInquiries.length > 0 ? (
            <div className="space-y-6">
              {userInquiries.map((inquiry) => (
                <div 
                  key={inquiry.id}
                  className="bg-white border border-[#E6E2D8] rounded-2xl p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#C29B47] block">
                        বিষয়: {inquiry.subject}
                      </span>
                      <p className="text-xs text-[#8C887B]">{inquiry.date}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-[#FFF7E6] text-[#C29B47] border border-[#F2EFE9] text-[11px] font-bold rounded-full">
                      {inquiry.replies?.length ? `${inquiry.replies.length} টি উত্তর` : inquiry.adminReply ? 'উত্তর প্রদান করা হয়েছে' : 'প্রক্রিয়াধীন'}
                    </span>
                  </div>

                  {/* Initial Message */}
                  <div className="bg-[#F9F8F5] p-4 rounded-xl border border-[#E2DDD3] space-y-1">
                    <p className="text-xs font-bold text-[#1D1E20]">{inquiry.senderName}:</p>
                    <p className="text-xs text-[#3A3834] leading-relaxed whitespace-pre-line">{inquiry.message}</p>
                  </div>

                  {/* Legacy Admin Reply if any */}
                  {inquiry.adminReply && (!inquiry.replies || inquiry.replies.length === 0) && (
                    <div className="bg-[#FFF7E6] p-4 rounded-xl border border-[#C29B47]/30 space-y-1 ml-4 sm:ml-8">
                      <p className="text-xs font-bold text-[#C29B47] flex items-center gap-1">
                        <span>লেখক / এডমিন রেসপন্স:</span>
                      </p>
                      <p className="text-xs text-[#1D1E20] leading-relaxed whitespace-pre-line">{inquiry.adminReply}</p>
                    </div>
                  )}

                  {/* Threaded Replies List */}
                  {inquiry.replies && inquiry.replies.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {inquiry.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${
                            reply.sender === 'admin'
                              ? 'bg-[#FFF7E6] border-[#C29B47]/30 text-[#1D1E20] ml-4 sm:ml-8'
                              : 'bg-[#F9F8F5] border-[#D9D3C7] text-[#3A3834] mr-4 sm:mr-8'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-[11px]">
                            <span className={reply.sender === 'admin' ? 'text-[#C29B47]' : 'text-[#1D1E20]'}>
                              {reply.senderName}
                            </span>
                            <span className="text-[10px] text-[#8C887B] font-normal">{reply.date}</span>
                          </div>
                          <p className="whitespace-pre-line">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* In-thread Reply Form */}
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="আপনার উত্তর লিখুন..."
                      value={replyInputs[inquiry.id] || ''}
                      onChange={(e) => setReplyInputs(prev => ({ ...prev, [inquiry.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendInquiryReply(inquiry.id);
                        }
                      }}
                      className="flex-1 px-4 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendInquiryReply(inquiry.id)}
                      className="px-4 py-2.5 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>উত্তর দিন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-[#E6E2D8] space-y-3">
              <MessageSquare className="w-10 h-10 text-[#C29B47] mx-auto" />
              <h3 className="font-serif-bn font-bold text-lg text-[#1D1E20]">কোনো বার্তা নেই</h3>
              <p className="text-xs text-[#8C887B]">লেখকের সাথে কোনো বিষয় নিয়ে কথা বলতে বার্তা পাঠান।</p>
              <button
                onClick={() => setCurrentView('contact')}
                className="px-5 py-2.5 bg-[#C29B47] text-white text-xs font-bold rounded-xl shadow hover:bg-[#a88338] transition-colors"
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

    </div>
  );
};
