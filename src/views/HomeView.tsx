import React, { useState, useMemo } from 'react';
import { Book, BlogPost, EventItem, ViewMode, SiteConfig, Review } from '../types';
import { ShoppingCart, Sparkles, ArrowRight, FileText, Heart, Eye } from 'lucide-react';
import { PdfReaderModal } from '../components/PdfReaderModal';
import { BookCoverImage } from '../components/BookCoverImage';

interface HomeViewProps {
  books: Book[];
  blogs: BlogPost[];
  reviews?: Review[];
  events: EventItem[];
  siteConfig: SiteConfig;
  setCurrentView: (view: ViewMode) => void;
  onSelectBook: (book: Book) => void;
  onSelectBlog?: (blog: BlogPost) => void;
  onOpenOrderModal: (book?: Book) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (bookId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  books,
  blogs,
  reviews = [],
  siteConfig,
  setCurrentView,
  onSelectBook,
  onSelectBlog,
  onOpenOrderModal,
  wishlistIds = [],
  onToggleWishlist,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সবগুলো');
  const [activePdfBook, setActivePdfBook] = useState<Book | null>(null);

  // Derive available categories dynamically from published books
  const categories = useMemo(() => {
    return ['সবগুলো', ...Array.from(new Set(books.map(b => b.category)))];
  }, [books]);

  const publishedBooks = useMemo(() => {
    return books.filter(b => b.status === 'published' || !b.status);
  }, [books]);

  const filteredBooks = useMemo(() => {
    return selectedCategory === 'সবগুলো'
      ? publishedBooks
      : publishedBooks.filter(b => b.category === selectedCategory);
  }, [publishedBooks, selectedCategory]);

  const displayNewReleases = useMemo(() => {
    const newReleases = publishedBooks.filter(b => b.isNewRelease);
    return newReleases.length > 0 ? newReleases : publishedBooks.slice(0, 3);
  }, [publishedBooks]);

  // Display strictly 3 books on home page under "আমার বইসমূহ"
  const homeDisplayBooks = useMemo(() => {
    return filteredBooks.slice(0, 3);
  }, [filteredBooks]);

  const bgImg = siteConfig.heroBgImage || siteConfig.heroImage || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80';
  const cardImg = siteConfig.heroImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-16 pb-16 animate-fade-in">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#EFECE6] border border-[#E2DDD3] text-[#1D1E20] rounded-2xl sm:rounded-3xl mx-3 sm:mx-6 lg:mx-8 shadow-sm mt-3 sm:mt-4">
        {/* Soft Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-20 mix-blend-multiply pointer-events-none transition-all duration-700" 
          style={{ backgroundImage: `url('${bgImg}')` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#EFECE6]/90 via-[#EFECE6]/70 to-transparent z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-12 py-10 sm:py-20 grid md:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          <div className="md:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#C29B47]/15 border border-[#C29B47]/30 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#C29B47]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C887B]">
                {siteConfig.heroBadgeText || siteConfig.authorDesignation || 'সাহিত্যিক ও প্রাবন্ধিক'}
              </span>
            </div>

            <h1 className="font-serif-bn font-bold text-3xl sm:text-5xl lg:text-6xl text-[#1D1E20] leading-tight">
              {siteConfig.heroTitle || 'শব্দের মায়াজালে জীবনের গল্প'}
            </h1>

            <p className="text-sm sm:text-base text-[#5C584E] max-w-xl leading-relaxed font-medium">
              {siteConfig.heroSubtitle || 'সমকালীন কথাসাহিত্যে এক অন্য ঘরানার পথচলা। অনুভূতির নিপুণ অলঙ্করণ আর গভীর জীবনবোধের গল্প নিয়ে আপনার মুখোমুখি।'}
            </p>

            {/* "বিস্তারিত" Button -> goes to author bio page */}
            <div className="pt-1 sm:pt-2">
              <button
                onClick={() => setCurrentView('author')}
                className="px-7 sm:px-8 py-3 sm:py-3.5 bg-[#C29B47] hover:bg-[#a88338] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
              >
                <span>বিস্তারিত</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Featured Hero Card Image */}
          <div className="md:col-span-5 flex justify-center items-center pt-2 md:pt-0">
            <div className="rounded-2xl overflow-hidden shadow-xl border-2 sm:border-4 border-white bg-white relative mx-auto max-w-xs sm:max-w-sm">
              <img
                src={cardImg}
                alt={siteConfig.siteName}
                loading="lazy"
                decoding="async"
                className="w-full h-auto max-h-[480px] object-contain rounded-xl block"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. NEW RELEASED BOOKS ("নতুন প্রকাশিত বই") */}
      {displayNewReleases.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-[220px]">
          <div className="border-b border-[#E6E2D8] pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif-bn font-bold text-2xl sm:text-3xl text-[#1D1E20] relative inline-block">
                নতুন প্রকাশিত বই
                <span className="absolute -bottom-4 left-0 w-16 h-1 bg-[#C29B47] rounded-full" />
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('books')}
              className="text-xs font-bold text-[#C29B47] hover:text-[#1D1E20] transition-colors flex items-center gap-1 py-1 px-2 rounded-lg cursor-pointer"
            >
              <span>সবগুলো দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayNewReleases.map((book) => {
              const isWishlisted = wishlistIds.includes(book.id);
              return (
                <div
                  key={book.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E6E2D8] hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row gap-4 group"
                >
                  <div 
                    className="w-28 h-40 shrink-0 rounded-lg overflow-hidden shadow-md cursor-pointer bg-[#EFECE6] relative aspect-[2/3] mx-auto sm:mx-0"
                    onClick={() => onSelectBook(book)}
                  >
                    <BookCoverImage
                      src={book.coverImage}
                      alt={book.title}
                      containerClassName="w-28 h-40 rounded-lg"
                      className="group-hover:scale-105 transition-transform duration-300"
                      showSpine={false}
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {book.isNewRelease && (
                            <span className="bg-[#C29B47] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs shrink-0">
                              নতুন
                            </span>
                          )}
                          <span className="text-[10px] font-bold uppercase text-[#C29B47] block truncate">
                            {book.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {book.originalPrice && book.originalPrice > book.price && (
                            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs shrink-0">
                              {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% ছাড়
                            </span>
                          )}
                          {onToggleWishlist && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleWishlist(book.id);
                              }}
                              className="p-1.5 bg-[#F9F8F5] hover:bg-rose-50 border border-[#E2DDD3] rounded-full shadow-xs transition-colors cursor-pointer"
                              title="উইশলিস্টে রাখুন"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[#8C887B]'}`} />
                            </button>
                          )}
                        </div>
                      </div>
                      <h4 
                        onClick={() => onSelectBook(book)}
                        className="font-serif-bn font-bold text-base sm:text-lg text-[#1D1E20] group-hover:text-[#C29B47] cursor-pointer transition-colors leading-snug truncate"
                        title={book.title}
                      >
                        {book.title}
                      </h4>
                      {(book.author || siteConfig.authorName) && (
                        <p className="text-[11px] text-[#8C887B] font-semibold truncate">
                          লেখক: <span className="text-[#1D1E20] font-bold">{book.author || siteConfig.authorName}</span>
                        </p>
                      )}
                      <p className="text-xs text-[#5C584E] line-clamp-2 mt-1 font-medium break-words">
                        {book.shortSynopsis || book.fullSynopsis}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F2EFE9] mt-2 space-y-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif-bn font-bold text-base text-[#1D1E20]">৳{book.price}</span>
                        {book.originalPrice && book.originalPrice > book.price && (
                          <span className="text-xs text-[#8C887B] line-through font-serif-bn">৳{book.originalPrice}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {book.pdfUrl && (
                          <button
                            onClick={() => setActivePdfBook(book)}
                            className="px-2.5 py-1.5 min-h-[36px] bg-[#F9F8F5] border border-[#D9D3C7] text-[#1D1E20] text-[11px] font-bold rounded-lg hover:bg-[#EFECE6] flex items-center gap-1 active:scale-95 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            <FileText className="w-3 h-3 text-[#C29B47]" />
                            <span>একটু পড়ুন</span>
                          </button>
                        )}
                        <button
                          onClick={() => onOpenOrderModal(book)}
                          className="px-3.5 py-2 min-h-[36px] bg-[#1D1E20] hover:bg-[#C29B47] text-white text-[11px] font-bold rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 group/orderbtn"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 transition-transform group-hover/orderbtn:scale-110 group-hover/orderbtn:-rotate-12" />
                          <span>বই অর্ডার করুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. FULL BOOK CATALOG PREVIEW ("বইসমূহ" - SHOW STRICTLY 3 BOOKS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-[560px]">
        
        <div className="border-b border-[#E6E2D8] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 
              onClick={() => setCurrentView('books')}
              className="font-serif-bn font-bold text-2xl sm:text-3xl text-[#1D1E20] relative inline-block cursor-pointer hover:text-[#C29B47] transition-colors"
            >
              বইসমূহ
              <span className="absolute -bottom-4 left-0 w-16 h-1 bg-[#C29B47] rounded-full" />
            </h2>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 min-h-[40px] rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1D1E20] text-white shadow-md'
                    : 'bg-[#EFECE6] text-[#5C584E] hover:bg-[#E2DDD3]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Book Cards Grid */}
        {homeDisplayBooks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {homeDisplayBooks.map((book) => {
              const isWishlisted = wishlistIds.includes(book.id);
              return (
                <div
                  key={book.id}
                  className="bg-white border border-[#E6E2D8] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col group h-full"
                >
                  <div 
                    className="relative bg-[#EFECE6] p-6 flex items-center justify-center overflow-hidden min-h-[250px]"
                  >
                    {book.isNewRelease && (
                      <span className="absolute top-4 left-4 bg-[#C29B47] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow z-10">
                        সদ্য প্রকাশিত
                      </span>
                    )}

                    {onToggleWishlist && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(book.id);
                        }}
                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow hover:scale-110 transition-transform z-10 cursor-pointer"
                        title="উইশলিস্টে রাখুন"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[#8C887B]'}`} />
                      </button>
                    )}

                    <div 
                      onClick={() => onSelectBook(book)}
                      className="w-36 h-52 sm:w-40 sm:h-56 rounded-r-lg rounded-l-sm shadow-2xl transform group-hover:scale-105 transition-transform duration-300 will-change-transform relative overflow-hidden book-shadow cursor-pointer shrink-0 aspect-[2/3]"
                    >
                      <BookCoverImage
                        src={book.coverImage}
                        alt={book.title}
                        containerClassName="w-36 h-52 sm:w-40 sm:h-56 rounded-r-lg rounded-l-sm"
                      />
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex-1 min-w-0 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#C29B47] uppercase tracking-wider block truncate">
                          {book.category}
                        </span>
                        {book.originalPrice && book.originalPrice > book.price && (
                          <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow-xs shrink-0">
                            {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% ছাড়
                          </span>
                        )}
                      </div>
                      <h3 
                        onClick={() => onSelectBook(book)}
                        className="font-serif-bn font-bold text-lg sm:text-xl text-[#1D1E20] group-hover:text-[#C29B47] cursor-pointer transition-colors leading-snug line-clamp-2 break-words"
                      >
                        {book.title}
                      </h3>
                      {(book.author || siteConfig.authorName) && (
                        <p className="text-xs text-[#8C887B] font-semibold truncate">
                          লেখক: <span className="text-[#1D1E20] font-bold">{book.author || siteConfig.authorName}</span>
                        </p>
                      )}
                      <p className="text-xs text-[#5C584E] leading-relaxed line-clamp-2 font-medium pt-1 break-words">
                        {book.shortSynopsis || book.fullSynopsis}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E6E2D8] space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[11px] text-[#8C887B]">মূল্য:</span>
                          <span className="font-serif-bn font-bold text-lg text-[#1D1E20]">৳{book.price}</span>
                          {book.originalPrice && book.originalPrice > book.price && (
                            <span className="text-xs text-[#8C887B] line-through font-serif-bn">৳{book.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenOrderModal(book)}
                          className="flex-1 py-2.5 min-h-[42px] bg-[#C29B47] hover:bg-[#a88338] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                          <span className="whitespace-nowrap">বই অর্ডার করুন</span>
                        </button>

                        {book.pdfUrl && (
                          <button
                            onClick={() => setActivePdfBook(book)}
                            className="px-3 py-2.5 min-h-[42px] bg-[#F9F8F5] border border-[#D9D3C7] text-[#1D1E20] text-xs font-bold rounded-xl hover:bg-[#EFECE6] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
                            title="একটু পড়ুন"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#C29B47] shrink-0" />
                            <span className="whitespace-nowrap">একটু পড়ুন</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E6E2D8] text-[#8C887B] font-medium text-sm min-h-[200px] flex items-center justify-center">
            এই ক্যাটাগরিতে বর্তমানে কোনো বই নেই।
          </div>
        )}

        {/* View All Books Button */}
        <div className="text-center pt-4">
          <button
            onClick={() => setCurrentView('books')}
            className="px-8 py-3.5 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-sm font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>সবগুলো দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* 4. RECENT BLOGS & LITERARY NEWS ("নিউজ ও ব্লগ") */}
      {blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-b border-[#E6E2D8] pb-4">
            <h2 
              onClick={() => setCurrentView('blog')}
              className="font-serif-bn font-bold text-2xl sm:text-3xl text-[#1D1E20] cursor-pointer hover:text-[#C29B47] transition-colors relative inline-block"
            >
              নিউজ ও ব্লগ
              <span className="absolute -bottom-4 left-0 w-16 h-1 bg-[#C29B47] rounded-full" />
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectBlog ? onSelectBlog(post) : setCurrentView('blog')}
                className="bg-white border border-[#E6E2D8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="h-44 bg-[#EFECE6] overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-[#C29B47] uppercase tracking-wider">
                      <span>{post.category} • {post.date}</span>
                      <span className="flex items-center gap-1 text-[#8C887B] font-semibold">
                        <Eye className="w-3 h-3 text-[#C29B47]" />
                        <span>{(post.views || 0).toLocaleString('bn-BD')} বার পঠিত</span>
                      </span>
                    </div>
                    <h3 className="font-serif-bn font-bold text-lg text-[#1D1E20] group-hover:text-[#C29B47] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#8C887B] line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#1D1E20] group-hover:text-[#C29B47] transition-colors flex items-center gap-1">
                    <span>পড়ুন</span> →
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentView('blog')}
              className="px-8 py-3.5 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 shadow-md"
            >
              <span>সবগুলো নিউজ ও ব্লগ দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* PDF Reader Modal */}
      {activePdfBook && (
        <PdfReaderModal
          isOpen={!!activePdfBook}
          onClose={() => setActivePdfBook(null)}
          bookTitle={activePdfBook.title}
          pdfUrl={activePdfBook.pdfUrl}
        />
      )}

    </div>
  );
};
