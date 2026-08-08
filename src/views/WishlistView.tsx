import React from 'react';
import { Book, ViewMode } from '../types';
import { Heart, ShoppingCart, FileText, Trash2, ArrowLeft, BookOpen } from 'lucide-react';
import { BookCoverImage } from '../components/BookCoverImage';

interface WishlistViewProps {
  books: Book[];
  wishlistIds: string[];
  onToggleWishlist: (bookId: string) => void;
  onClearWishlist: () => void;
  setCurrentView: (view: ViewMode) => void;
  onSelectBook: (book: Book) => void;
  onOpenOrderModal: (book?: Book) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  books,
  wishlistIds,
  onToggleWishlist,
  onClearWishlist,
  setCurrentView,
  onSelectBook,
  onOpenOrderModal,
}) => {
  const wishlistBooks = books.filter(b => wishlistIds.includes(b.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E2D8] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span className="text-xs font-bold text-[#C29B47] uppercase tracking-widest">
              সংরক্ষিত বইসমূহ
            </span>
          </div>
          <h1 className="font-serif-bn font-bold text-3xl sm:text-4xl text-[#1D1E20]">
            আমার উইশলিস্ট ({wishlistBooks.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('books')}
            className="px-4 py-2.5 bg-[#EFECE6] hover:bg-[#E2DDD3] text-[#1D1E20] text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>আরও বই দেখুন</span>
          </button>

          {wishlistBooks.length > 0 && (
            <button
              onClick={onClearWishlist}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>সব মুছুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Wishlist Items Grid */}
      {wishlistBooks.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {wishlistBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white border border-[#E6E2D8] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
            >
              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(book.id);
                }}
                className="absolute top-3 right-3 z-20 p-2 bg-white/90 hover:bg-rose-50 text-rose-600 rounded-full shadow border border-rose-100 transition-colors cursor-pointer"
                title="উইশলিস্ট থেকে সরান"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Book Cover Container */}
              <div className="relative bg-[#EFECE6] p-6 flex items-center justify-center overflow-hidden min-h-[220px]">
                <div 
                  onClick={() => onSelectBook(book)}
                  className="w-36 h-52 rounded-r-lg rounded-l-sm shadow-2xl transform group-hover:scale-105 transition-transform duration-300 relative overflow-hidden book-shadow cursor-pointer shrink-0 aspect-[2/3]"
                >
                  <BookCoverImage
                    src={book.coverImage}
                    alt={book.title}
                    containerClassName="w-36 h-52 rounded-r-lg rounded-l-sm"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#C29B47] uppercase tracking-wider block truncate">
                    {book.category}
                  </span>
                  <h3 
                    onClick={() => onSelectBook(book)}
                    className="font-serif-bn font-bold text-lg text-[#1D1E20] group-hover:text-[#C29B47] cursor-pointer transition-colors leading-snug line-clamp-2"
                  >
                    {book.title}
                  </h3>
                  {book.author && (
                    <p className="text-xs text-[#8C887B] font-semibold">
                      লেখক: <span className="text-[#1D1E20]">{book.author}</span>
                    </p>
                  )}
                  <p className="text-xs text-[#5C584E] leading-relaxed line-clamp-2 pt-1 font-medium">
                    {book.shortSynopsis || book.fullSynopsis}
                  </p>
                </div>

                {/* Price & Order Action */}
                <div className="pt-3 border-t border-[#E6E2D8] space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#8C887B]">মূল্য:</span>
                    <div className="flex items-baseline gap-1.5">
                      <strong className="text-[#1D1E20] text-lg font-serif-bn font-bold">৳ {book.price}</strong>
                      {book.originalPrice && book.originalPrice > book.price && (
                        <span className="text-xs text-[#8C887B] line-through font-serif-bn">৳ {book.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenOrderModal(book)}
                      className="flex-1 py-3 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>বই অর্ডার করুন</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E6E2D8] p-8 space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FFF7E6] text-[#C29B47] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-[#C29B47]" />
          </div>
          <h3 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">
            আপনার উইশলিস্ট এখন খালি!
          </h3>
          <p className="text-xs text-[#8C887B] leading-relaxed">
            পছন্দের বইগুলো পরবর্তীতে দেখার জন্য উইশলিস্টে যুক্ত করে রাখতে পারেন।
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentView('books')}
              className="px-6 py-3 bg-[#C29B47] hover:bg-[#a88338] text-white text-xs font-bold rounded-xl shadow transition-colors inline-flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>বইসমূহ ব্রাউজ করুন</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
