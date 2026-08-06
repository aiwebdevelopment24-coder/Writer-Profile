import React, { useState } from 'react';
import { Search, X, BookOpen, FileText, Eye } from 'lucide-react';
import { Book, BlogPost, ViewMode } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  blogs: BlogPost[];
  onSelectBook: (book: Book) => void;
  onSelectBlog: (blog: BlogPost) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  books,
  blogs,
  onSelectBook,
  onSelectBlog
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(query.toLowerCase()) || 
    b.category.toLowerCase().includes(query.toLowerCase()) ||
    b.shortSynopsis.toLowerCase().includes(query.toLowerCase())
  );

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(query.toLowerCase()) || 
    b.excerpt.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#F9F8F5] border border-[#E6E2D8] rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E6E2D8] bg-white flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8C887B]" />
          <input
            type="text"
            autoFocus
            placeholder="বইয়ের নাম, ক্যাটাগরি বা ব্লগের বিষয় লিখে খুঁজুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent outline-none text-[#1D1E20] placeholder-[#8C887B]"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#8C887B] hover:text-[#1D1E20] hover:bg-[#EFECE6] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-xs text-[#8C887B]">
              বই বা আর্টিকেলের শিরোনাম অনুসন্ধান করুন...
            </div>
          ) : (
            <>
              {/* Books Section */}
              {filteredBooks.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-[#8C887B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>বইসমূহ ({filteredBooks.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {filteredBooks.map((book) => (
                      <div
                        key={book.id}
                        onClick={() => {
                          onSelectBook(book);
                          onClose();
                        }}
                        className="p-3 bg-white hover:bg-[#EFECE6] rounded-xl border border-[#E6E2D8] cursor-pointer transition-colors flex items-center gap-3"
                      >
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif-bn font-bold text-sm text-[#1D1E20] truncate">
                            {book.title}
                          </h5>
                          <p className="text-xs text-[#8C887B] truncate">
                            {book.category} • ৳ {book.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blogs Section */}
              {filteredBlogs.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-[#8C887B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>ব্লগ পোস্ট ({filteredBlogs.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {filteredBlogs.map((blog) => (
                      <div
                        key={blog.id}
                        onClick={() => {
                          onSelectBlog(blog);
                          onClose();
                        }}
                        className="p-3 bg-white hover:bg-[#EFECE6] rounded-xl border border-[#E6E2D8] cursor-pointer transition-colors"
                      >
                        <h5 className="font-serif-bn font-semibold text-sm text-[#1D1E20] line-clamp-1">
                          {blog.title}
                        </h5>
                        <div className="text-xs text-[#8C887B] mt-0.5 flex items-center justify-between gap-2">
                          <span>{blog.date} • {blog.readTime}</span>
                          <span className="flex items-center gap-1 text-[#C29B47] font-semibold">
                            <Eye className="w-3 h-3" />
                            <span>{(blog.views || 0).toLocaleString('bn-BD')}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredBooks.length === 0 && filteredBlogs.length === 0 && (
                <div className="text-center py-8 text-xs text-[#8C887B]">
                  কোন ফলাফল পাওয়া যায়নি।
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
