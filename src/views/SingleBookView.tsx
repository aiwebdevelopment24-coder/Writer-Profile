import React, { useState } from 'react';
import { Book, Review, ViewMode } from '../types';
import { Star, ShoppingBag, ArrowLeft, CheckCircle, FileText, ChevronDown, ChevronUp, Trash2, Video } from 'lucide-react';
import { PdfReaderModal } from '../components/PdfReaderModal';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '../utils/mediaUtils';

interface SingleBookViewProps {
  book: Book;
  allBooks: Book[];
  reviews: Review[];
  setCurrentView: (view: ViewMode) => void;
  onSelectBook: (book: Book) => void;
  onOpenOrderModal: (book?: Book) => void;
  onAddReview: (review: Review) => void;
  onDeleteReview?: (reviewId: string) => void;
  isAdmin?: boolean;
}

export const SingleBookView: React.FC<SingleBookViewProps> = ({
  book,
  allBooks,
  reviews,
  setCurrentView,
  onSelectBook,
  onOpenOrderModal,
  onAddReview,
  onDeleteReview,
  isAdmin = false
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);

  // Local storage tracking for public user's own submitted review IDs
  const [myReviewIds, setMyReviewIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('as_my_review_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const bookReviews = reviews.filter(r => r.bookId === book.id || r.bookId === 'book-1');
  const otherBooks = allBooks.filter(b => b.id !== book.id).slice(0, 2);

  const synopsisText = book.fullSynopsis || book.shortSynopsis;
  const isLongSynopsis = synopsisText.length > 120;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewComment) return;

    const newId = `rev-${Date.now()}`;
    const newRev: Review = {
      id: newId,
      bookId: book.id,
      reviewerName: newReviewName,
      reviewerTitle: 'পাঠক',
      rating: newReviewRating,
      date: 'আজ',
      comment: newReviewComment,
      authorKey: 'my-local-review'
    };

    onAddReview(newRev);

    // Save ID locally
    const updatedMyIds = [...myReviewIds, newId];
    setMyReviewIds(updatedMyIds);
    try {
      localStorage.setItem('as_my_review_ids', JSON.stringify(updatedMyIds));
    } catch (err) {
      console.error(err);
    }

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setShowReviewForm(false);
      setNewReviewName('');
      setNewReviewComment('');
    }, 2000);
  };

  const handleDelete = (revId: string) => {
    onDeleteReview?.(revId);
  };

  const isVideo = book.pdfUrl && isYouTubeUrl(book.pdfUrl);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-12 animate-fade-in">
      
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('books')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C887B] hover:text-[#1D1E20] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>সকল বইয়ে ফিরে যান</span>
      </button>

      {/* Book Primary Hero Layout */}
      <div className="bg-white border border-[#E6E2D8] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* Book Cover Image */}
          <div className="md:col-span-5 flex flex-col items-center gap-4">
            <div className="w-52 h-76 sm:w-60 sm:h-84 rounded-r-xl rounded-l-sm overflow-hidden shadow-2xl relative book-shadow border border-[#E6E2D8]">
              <img
                src={book.coverImage}
                alt={book.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-y-0 left-0 w-3 book-spine-effect" />
            </div>

            {book.isNewRelease && (
              <span className="bg-[#C29B47] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                সদ্য প্রকাশিত বই
              </span>
            )}
          </div>

          {/* Book Info */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-1.5">
              <h1 className="font-serif-bn font-bold text-3xl sm:text-4xl text-[#1D1E20]">
                {book.title}
              </h1>
              {book.author && (
                <p className="text-sm font-semibold text-[#8C887B]">
                  লেখক: <span className="text-[#1D1E20] font-bold">{book.author}</span>
                </p>
              )}
              <div className="pt-0.5">
                <span className="text-xs font-bold text-[#C29B47] uppercase tracking-wider bg-[#FFF7E6] border border-[#C29B47]/30 px-2.5 py-1 rounded-md inline-block">
                  ক্যাটাগরি: {book.category}
                </span>
              </div>
            </div>

            {/* Price Display with Discount */}
            <div className="p-4 bg-[#F9F8F5] border border-[#E6E2D8] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#8C887B] block font-semibold">মূল্য ও বিশেষ ছাড়:</span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className="font-serif-bn font-bold text-2xl text-[#1D1E20]">৳ {book.price}</span>
                  {book.originalPrice && book.originalPrice > book.price && (
                    <span className="text-sm text-[#8C887B] line-through font-serif-bn">৳ {book.originalPrice}</span>
                  )}
                </div>
              </div>

              {book.originalPrice && book.originalPrice > book.price && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-xl text-xs font-bold">
                  {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% ছাড়
                </div>
              )}
            </div>

            {/* Collapsible Wafilife-Style Synopsis */}
            <div className="space-y-2 bg-white p-4 rounded-2xl border border-[#E2DDD3]">
              <h3 className="font-serif-bn font-bold text-sm text-[#1D1E20] border-b pb-1.5">
                বইয়ের সারসংক্ষেপ ও বিবরণ
              </h3>
              
              <div className="relative">
                <p className={`text-xs sm:text-sm text-[#5C584E] leading-relaxed font-medium ${
                  !isSynopsisExpanded && isLongSynopsis ? 'line-clamp-3' : ''
                }`}>
                  {synopsisText}
                </p>

                {isLongSynopsis && (
                  <button
                    type="button"
                    onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                    className="text-xs font-bold text-[#C29B47] hover:text-[#1D1E20] transition-colors inline-flex items-center gap-1 mt-2.5 bg-[#FFF7E6] px-3 py-1.5 rounded-lg border border-[#C29B47]/30"
                  >
                    {isSynopsisExpanded ? (
                      <>
                        <span>সংক্ষিপ্ত করুন</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>আরো পড়ুন</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenOrderModal(book)}
                className="flex-1 sm:flex-none px-7 py-3.5 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>বই অর্ডার করুন</span>
              </button>

              {book.pdfUrl && !isVideo && (
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex-1 sm:flex-none px-6 py-3.5 bg-[#F9F8F5] border border-[#D9D3C7] hover:bg-[#EFECE6] text-[#1D1E20] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <FileText className="w-4 h-4 text-[#C29B47]" />
                  <span>একটু পড়ুন (PDF)</span>
                </button>
              )}
            </div>

            {/* YouTube Embedded Video Player if PDF/Link is YouTube */}
            {isVideo && (
              <div className="space-y-2 pt-3 border-t">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1D1E20]">
                  <Video className="w-4 h-4 text-rose-600" />
                  <span>বই সম্পর্কিত ভিডিও রিভিউ / ট্রেইলার:</span>
                </div>
                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#D9D3C7] bg-black shadow-inner">
                  <iframe
                    src={getYouTubeEmbedUrl(book.pdfUrl!) || ''}
                    title={book.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-[#E6E2D8] text-xs">
              <div>
                <span className="text-[#8C887B] block">প্রকাশনী</span>
                <strong className="text-[#1D1E20] font-semibold">{book.publisher || 'রাইয়ান প্রকাশন'}</strong>
              </div>
              <div>
                <span className="text-[#8C887B] block">ISBN</span>
                <strong className="text-[#1D1E20] font-semibold">{book.isbn || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-[#8C887B] block">পৃষ্ঠা সংখ্যা</span>
                <strong className="text-[#1D1E20] font-semibold">{book.pages} পৃষ্ঠা</strong>
              </div>
              <div>
                <span className="text-[#8C887B] block">প্রচ্ছদ মূল্য</span>
                <strong className="text-[#1D1E20] font-bold text-sm">৳ {book.originalPrice || book.price}.০০</strong>
              </div>
              <div>
                <span className="text-[#8C887B] block">প্রথম প্রকাশ</span>
                <strong className="text-[#1D1E20] font-semibold">{book.year || '২০২৪'}</strong>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Reader Reviews Section ("পাঠক রিভিউ") */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-4">
          <div>
            <h2 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">পাঠক রিভিউ</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#1D1E20]">
                {book.rating} ({bookReviews.length}টি রিভিউ)
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-[#1D1E20] text-white text-xs font-semibold rounded-xl hover:bg-[#C29B47] transition-colors"
          >
            রিভিউ লিখুন
          </button>
        </div>

        {/* Review Input Form Toggle */}
        {showReviewForm && (
          <div className="bg-white p-6 border border-[#E6E2D8] rounded-2xl shadow-sm space-y-4">
            <h3 className="font-serif-bn font-bold text-base text-[#1D1E20]">আপনার নিজস্ব রিভিউ যোগ করুন</h3>
            {reviewSubmitted ? (
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs py-2">
                <CheckCircle className="w-5 h-5" />
                <span>ধন্যবাদ! আপনার রিভিউটি যুক্ত হয়েছে।</span>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3834] mb-1">আপনার নাম</label>
                    <input
                      type="text"
                      required
                      placeholder="আপনার নাম লিখুন"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F9F8F5] border border-[#D9D3C7] rounded-lg focus:outline-none focus:border-[#C29B47]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3834] mb-1">রেটিং</label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-[#F9F8F5] border border-[#D9D3C7] rounded-lg focus:outline-none focus:border-[#C29B47]"
                    >
                      <option value={5}>৫ তারকা (অসাধারণ)</option>
                      <option value={4}>৪ তারকা (খুব ভালো)</option>
                      <option value={3}>৩ তারকা (মোটামুটি)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3A3834] mb-1">মতামত</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="বইটি সম্পর্কে আপনার সৎ মতামত শেয়ার করুন..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F9F8F5] border border-[#D9D3C7] rounded-lg focus:outline-none focus:border-[#C29B47]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#C29B47] text-white text-xs font-bold rounded-lg hover:bg-[#a88338] transition-colors shadow-sm"
                  >
                    সাবমিট করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] text-[#1D1E20] text-xs font-bold rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
                  >
                    বাদ দিন
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews Cards List */}
        <div className="space-y-4">
          {bookReviews.map((rev) => {
            const isMyReview = myReviewIds.includes(rev.id) || rev.authorKey === 'my-local-review';
            const canDelete = isAdmin || isMyReview;

            return (
              <div key={rev.id} className="bg-white p-5 rounded-2xl border border-[#E6E2D8] space-y-2 shadow-sm relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#8C887B]">{rev.date}</span>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDelete(rev.id)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                        title="রিভিউটি মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>মুছে ফেলুন</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#3A3834] font-serif-bn italic leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <div className="w-7 h-7 rounded-full bg-[#1D1E20] text-white font-bold text-xs flex items-center justify-center">
                    {rev.reviewerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1D1E20]">
                      {rev.reviewerName} {isMyReview && <span className="text-[10px] text-[#C29B47] font-semibold">(আপনার রিভিউ)</span>}
                    </h4>
                    {rev.reviewerTitle && <p className="text-[10px] text-[#8C887B]">{rev.reviewerTitle}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations ("অন্যান্য বই") */}
      <div className="space-y-6 pt-4 border-t border-[#E6E2D8]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">অন্যান্য বই</h2>
          <button
            onClick={() => setCurrentView('books')}
            className="text-xs font-semibold text-[#C29B47] hover:underline"
          >
            সব দেখুন →
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {otherBooks.map((obook) => (
            <div
              key={obook.id}
              onClick={() => onSelectBook(obook)}
              className="bg-white p-4 rounded-2xl border border-[#E6E2D8] hover:shadow-md transition-all cursor-pointer flex gap-4"
            >
              <img
                src={obook.coverImage}
                alt={obook.title}
                loading="lazy"
                decoding="async"
                className="w-20 h-28 object-cover rounded-lg shadow shrink-0 bg-[#EFECE6]"
              />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#C29B47]">
                    {obook.category}
                  </span>
                  <h4 className="font-serif-bn font-bold text-base text-[#1D1E20]">
                    {obook.title}
                  </h4>
                  {obook.author && (
                    <p className="text-xs text-[#8C887B]">{obook.author}</p>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <strong className="text-xs text-[#1D1E20]">৳ {obook.price}</strong>
                  {obook.originalPrice && obook.originalPrice > obook.price && (
                    <span className="text-[11px] text-[#8C887B] line-through">৳ {obook.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Modal */}
      {book.pdfUrl && !isVideo && (
        <PdfReaderModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          bookTitle={book.title}
          pdfUrl={book.pdfUrl}
        />
      )}

    </div>
  );
};
