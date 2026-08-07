import React, { useState, useEffect } from 'react';
import { ViewMode, Book, BlogPost, EventItem, InquiryMessage, Review, SiteConfig, Order } from './types';
import { 
  INITIAL_BOOKS, 
  INITIAL_BLOGS, 
  INITIAL_EVENTS, 
  INITIAL_INQUIRIES, 
  INITIAL_REVIEWS,
  DEFAULT_SITE_CONFIG,
  INITIAL_ORDERS
} from './data/initialData';

import { 
  subscribeBooks, 
  saveBookFirestore, 
  deleteBookFirestore,
  subscribeBlogs,
  saveBlogFirestore,
  incrementBlogViewsFirestore,
  deleteBlogFirestore,
  subscribeOrders,
  addOrderFirestore,
  updateOrderStatusFirestore,
  deleteOrderFirestore,
  subscribeReviews,
  saveReviewFirestore,
  deleteReviewFirestore,
  subscribeInquiries,
  addInquiryFirestore,
  deleteInquiryFirestore,
  subscribeSiteConfig,
  saveSiteConfigFirestore
} from './lib/firebaseService';

import { 
  getDeletedIds, 
  addDeletedId, 
  removeDeletedId, 
  mergeCollection 
} from './lib/storageUtils';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SearchModal } from './components/SearchModal';

import { HomeView } from './views/HomeView';
import { AuthorBioView } from './views/AuthorBioView';
import { BooksView } from './views/BooksView';
import { SingleBookView } from './views/SingleBookView';
import { SampleReaderView } from './views/SampleReaderView';
import { BlogView } from './views/BlogView';
import { SingleBlogView } from './views/SingleBlogView';
import { ContactView } from './views/ContactView';
import { AdminStudioView } from './views/AdminStudioView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('as_admin_auth') === 'true';
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // Site Config State (Synced with Firebase & LocalStorage)
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('as_site_config');
    return saved ? JSON.parse(saved) : DEFAULT_SITE_CONFIG;
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('as_orders');
    const items: Order[] = saved ? JSON.parse(saved) : INITIAL_ORDERS;
    const deleted = getDeletedIds('as_deleted_orders');
    return items.filter(o => !deleted.has(o.id));
  });

  // Books State
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('as_books');
    const items: Book[] = saved ? JSON.parse(saved) : INITIAL_BOOKS;
    const deleted = getDeletedIds('as_deleted_books');
    return items.filter(b => !deleted.has(b.id));
  });

  // Blogs State
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('as_blogs');
    const items: BlogPost[] = saved ? JSON.parse(saved) : INITIAL_BLOGS;
    const deleted = getDeletedIds('as_deleted_blogs');
    return items.filter(b => !deleted.has(b.id));
  });

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('as_reviews');
    const items: Review[] = saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    const deleted = getDeletedIds('as_deleted_reviews');
    return items.filter(r => !deleted.has(r.id));
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState<InquiryMessage[]>(() => {
    const saved = localStorage.getItem('as_inquiries');
    const items: InquiryMessage[] = saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    const deleted = getDeletedIds('as_deleted_inquiries');
    return items.filter(i => !deleted.has(i.id));
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('as_wishlist');
    return saved ? JSON.parse(saved) : ['book-1'];
  });

  // Selected Items
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [orderModalBook, setOrderModalBook] = useState<Book | null>(null);

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Firebase Real-time Subscriptions with Smart Merging
  useEffect(() => {
    const unsubBooks = subscribeBooks((data) => {
      if (data) {
        setBooks(prev => mergeCollection(data, prev, 'as_deleted_books'));
      }
    });

    const unsubBlogs = subscribeBlogs((data) => {
      if (data) {
        setBlogs(prev => mergeCollection(data, prev, 'as_deleted_blogs'));
      }
    });

    const unsubOrders = subscribeOrders((data) => {
      if (data) {
        setOrders(prev => mergeCollection(data, prev, 'as_deleted_orders'));
      }
    });

    const unsubReviews = subscribeReviews((data) => {
      if (data) {
        setReviews(prev => mergeCollection(data, prev, 'as_deleted_reviews'));
      }
    });

    const unsubInquiries = subscribeInquiries((data) => {
      if (data) {
        setInquiries(prev => mergeCollection(data, prev, 'as_deleted_inquiries'));
      }
    });

    const unsubConfig = subscribeSiteConfig((data) => {
      if (data) setSiteConfig(data);
    });

    return () => {
      unsubBooks();
      unsubBlogs();
      unsubOrders();
      unsubReviews();
      unsubInquiries();
      unsubConfig();
    };
  }, []);

  // Sync selected defaults when books/blogs load
  useEffect(() => {
    if (!selectedBook && books.length > 0) {
      setSelectedBook(books[0]);
    }
  }, [books, selectedBook]);

  useEffect(() => {
    if (!selectedBlog && blogs.length > 0) {
      setSelectedBlog(blogs[0]);
    }
  }, [blogs, selectedBlog]);

  // Persistent localStorage synchronization
  useEffect(() => {
    if (books) localStorage.setItem('as_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    if (blogs) localStorage.setItem('as_blogs', JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    if (orders) localStorage.setItem('as_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (reviews) localStorage.setItem('as_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (inquiries) localStorage.setItem('as_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    if (siteConfig) {
      localStorage.setItem('as_site_config', JSON.stringify(siteConfig));
      if (siteConfig.siteName) {
        document.title = siteConfig.siteName;
      }
    }
  }, [siteConfig]);

  useEffect(() => {
    localStorage.setItem('as_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('as_admin_auth', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

  // Navigation Handlers
  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentView('single-book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBlog = (blog: BlogPost) => {
    const updatedViews = (blog.views || 0) + 1;
    const updatedBlog = { ...blog, views: updatedViews };
    setSelectedBlog(updatedBlog);
    setBlogs(prev => prev.map(b => b.id === blog.id ? updatedBlog : b));
    incrementBlogViewsFirestore(blog.id);
    setCurrentView('single-blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSampleReader = (book: Book) => {
    setSelectedBook(book);
    setCurrentView('sample-reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOrderModal = (book?: Book) => {
    if (book) {
      setOrderModalBook(book);
    } else {
      setOrderModalBook(selectedBook);
    }
    setIsOrderModalOpen(true);
  };

  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.setItem('as_admin_auth', 'false');
    if (currentView === 'admin') {
      setCurrentView('home');
    }
  };

  const toggleWishlist = (bookId: string) => {
    setWishlist(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  // Place Cash-on-Delivery Order (Persisted to Firebase & LocalState)
  const handlePlaceOrder = (newOrderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => {
    const newOrder: Order = {
      ...newOrderData,
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      orderDate: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'pending',
    };
    setOrders(prev => [newOrder, ...prev]);
    addOrderFirestore(newOrder);
  };

  // Admin Actions (Persisted to Firebase & LocalState)
  const handleUpdateSiteConfig = (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
    saveSiteConfigFirestore(newConfig);
  };

  const handleAddBook = (newBook: Book) => {
    removeDeletedId('as_deleted_books', newBook.id);
    setBooks(prev => {
      const updated = [newBook, ...prev.filter(b => b.id !== newBook.id)];
      localStorage.setItem('as_books', JSON.stringify(updated));
      return updated;
    });
    saveBookFirestore(newBook);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(prev => {
      const updated = prev.map(b => b.id === updatedBook.id ? updatedBook : b);
      localStorage.setItem('as_books', JSON.stringify(updated));
      return updated;
    });
    saveBookFirestore(updatedBook);
  };

  const handleDeleteBook = (id: string) => {
    addDeletedId('as_deleted_books', id);
    setBooks(prev => {
      const updated = prev.filter(b => b.id !== id);
      localStorage.setItem('as_books', JSON.stringify(updated));
      if (selectedBook?.id === id) {
        setSelectedBook(updated[0] || null);
      }
      return updated;
    });
    deleteBookFirestore(id);
  };

  const handleAddBlog = (newBlog: BlogPost) => {
    removeDeletedId('as_deleted_blogs', newBlog.id);
    setBlogs(prev => {
      const updated = [newBlog, ...prev.filter(b => b.id !== newBlog.id)];
      localStorage.setItem('as_blogs', JSON.stringify(updated));
      return updated;
    });
    saveBlogFirestore(newBlog);
  };

  const handleUpdateBlog = (updatedBlog: BlogPost) => {
    setBlogs(prev => {
      const updated = prev.map(b => b.id === updatedBlog.id ? updatedBlog : b);
      localStorage.setItem('as_blogs', JSON.stringify(updated));
      return updated;
    });
    saveBlogFirestore(updatedBlog);
  };

  const handleDeleteBlog = (id: string) => {
    addDeletedId('as_deleted_blogs', id);
    setBlogs(prev => {
      const updated = prev.filter(b => b.id !== id);
      localStorage.setItem('as_blogs', JSON.stringify(updated));
      if (selectedBlog?.id === id) {
        setSelectedBlog(updated[0] || null);
      }
      return updated;
    });
    deleteBlogFirestore(id);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status } : o);
      localStorage.setItem('as_orders', JSON.stringify(updated));
      return updated;
    });
    updateOrderStatusFirestore(orderId, status);
  };

  const handleDeleteOrder = (orderId: string) => {
    addDeletedId('as_deleted_orders', orderId);
    setOrders(prev => {
      const updated = prev.filter(o => o.id !== orderId);
      localStorage.setItem('as_orders', JSON.stringify(updated));
      return updated;
    });
    deleteOrderFirestore(orderId);
  };

  const handleDeleteInquiry = (inquiryId: string) => {
    addDeletedId('as_deleted_inquiries', inquiryId);
    setInquiries(prev => {
      const updated = prev.filter(i => i.id !== inquiryId);
      localStorage.setItem('as_inquiries', JSON.stringify(updated));
      return updated;
    });
    deleteInquiryFirestore(inquiryId);
  };

  const handleAddInquiry = (newInquiry: { senderName: string; senderEmail: string; subject: string; message: string }) => {
    const item: InquiryMessage = {
      id: `inq-${Date.now()}`,
      senderName: newInquiry.senderName,
      senderEmail: newInquiry.senderEmail,
      subject: newInquiry.subject,
      message: newInquiry.message,
      date: new Date().toLocaleDateString('bn-BD'),
      timeAgo: 'মাত্র এখন',
      isRead: false,
    };
    setInquiries(prev => [item, ...prev]);
    addInquiryFirestore(item);
  };

  const handleAddReview = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
    saveReviewFirestore(newReview);
  };

  const handleDeleteReview = (reviewId: string) => {
    addDeletedId('as_deleted_reviews', reviewId);
    setReviews(prev => {
      const updated = prev.filter(r => r.id !== reviewId);
      localStorage.setItem('as_reviews', JSON.stringify(updated));
      return updated;
    });
    deleteReviewFirestore(reviewId);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5] text-[#1D1E20] flex flex-col font-sans selection:bg-[#C29B47]/20 selection:text-[#8C6B1F]">
      
      {/* Header */}
      {currentView !== 'sample-reader' && (
        <Header
          currentView={currentView}
          setCurrentView={(v) => {
            setCurrentView(v);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          cartCount={orders.length}
          openSearch={() => setIsSearchOpen(true)}
          openCart={() => handleOpenOrderModal()}
          siteConfig={siteConfig}
          isAdminAuthenticated={isAdminAuthenticated}
          onAdminClick={handleAdminClick}
          onAdminLogout={handleAdminLogout}
        />
      )}

      {/* Main Views */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            books={books}
            blogs={blogs}
            reviews={reviews}
            events={INITIAL_EVENTS}
            siteConfig={siteConfig}
            setCurrentView={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectBook={handleSelectBook}
            onSelectBlog={handleSelectBlog}
            onOpenOrderModal={handleOpenOrderModal}
          />
        )}

        {currentView === 'author' && (
          <AuthorBioView
            setCurrentView={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            siteConfig={siteConfig}
          />
        )}

        {currentView === 'books' && (
          <BooksView
            books={books}
            setCurrentView={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectBook={handleSelectBook}
            onOpenOrderModal={handleOpenOrderModal}
          />
        )}

        {currentView === 'single-book' && selectedBook && (
          <SingleBookView
            book={selectedBook}
            allBooks={books}
            reviews={reviews}
            setCurrentView={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectBook={handleSelectBook}
            onOpenOrderModal={handleOpenOrderModal}
            onAddReview={handleAddReview}
            onDeleteReview={handleDeleteReview}
            isAdmin={isAdminAuthenticated}
          />
        )}

        {currentView === 'sample-reader' && selectedBook && (
          <SampleReaderView
            book={selectedBook}
            setCurrentView={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenOrderModal={handleOpenOrderModal}
          />
        )}

        {currentView === 'blog' && (
          <BlogView
            blogs={blogs}
            setCurrentView={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectBlog={handleSelectBlog}
          />
        )}

        {currentView === 'single-blog' && selectedBlog && (
          <SingleBlogView
            blog={selectedBlog}
            setCurrentView={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'contact' && (
          <ContactView siteConfig={siteConfig} onSendMessage={handleAddInquiry} />
        )}

        {currentView === 'admin' && (
          <AdminStudioView
            books={books}
            blogs={blogs}
            inquiries={inquiries}
            orders={orders}
            reviews={reviews}
            siteConfig={siteConfig}
            onUpdateSiteConfig={handleUpdateSiteConfig}
            onAddBook={handleAddBook}
            onUpdateBook={handleUpdateBook}
            onDeleteBook={handleDeleteBook}
            onAddBlog={handleAddBlog}
            onUpdateBlog={handleUpdateBlog}
            onDeleteBlog={handleDeleteBlog}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onDeleteInquiry={handleDeleteInquiry}
            onDeleteReview={handleDeleteReview}
          />
        )}
      </main>

      {/* Footer */}
      {currentView !== 'sample-reader' && (
        <Footer
          setCurrentView={(v) => {
            setCurrentView(v);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          siteConfig={siteConfig}
          onAdminClick={handleAdminClick}
        />
      )}



      {/* Cash-on-Delivery Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        books={books}
        selectedBook={orderModalBook}
        siteConfig={siteConfig}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Admin Login Gate Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        siteConfig={siteConfig}
        onLoginSuccess={() => {
          setIsAdminAuthenticated(true);
          localStorage.setItem('as_admin_auth', 'true');
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        books={books}
        blogs={blogs}
        onSelectBook={handleSelectBook}
        onSelectBlog={handleSelectBlog}
      />

    </div>
  );
}
