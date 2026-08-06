import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Book, BlogPost, Order, Review, InquiryMessage, SiteConfig } from '../types';
import { 
  INITIAL_BOOKS, 
  INITIAL_BLOGS, 
  INITIAL_ORDERS, 
  INITIAL_REVIEWS, 
  INITIAL_INQUIRIES, 
  DEFAULT_SITE_CONFIG 
} from '../data/initialData';

// Helper error handler
const handledErrors = new Set<string>();

const handleFirestoreError = (error: any, action: string, path: string) => {
  const isPermissionError = 
    error?.code === 'permission-denied' || 
    error?.message?.includes('permission-denied') || 
    error?.message?.includes('Missing or insufficient permissions');

  const key = `${action}:${path}`;
  if (isPermissionError) {
    if (!handledErrors.has(key)) {
      handledErrors.add(key);
      console.warn(`[Firebase Firestore Notice] Permission check for '${action}' on '${path}': ` +
        `Firebase security rules on project require read/write access. Using local application state.`);
    }
  } else {
    console.error(`Firestore error during ${action} on path [${path}]:`, error);
  }
};

// ==================== BOOKS ====================
export const fetchBooksFirestore = async (): Promise<Book[] | null> => {
  try {
    const colRef = collection(db, 'books');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      try {
        for (const book of INITIAL_BOOKS) {
          await setDoc(doc(db, 'books', book.id), book);
        }
      } catch (e) {
        handleFirestoreError(e, 'seed', 'books');
      }
      return INITIAL_BOOKS;
    } else {
      const items: Book[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Book);
      });
      return items;
    }
  } catch (err) {
    handleFirestoreError(err, 'fetch', 'books');
    return null;
  }
};

export const subscribeBooks = (onUpdate: (books: Book[]) => void) => {
  // Use getDocs once instead of onSnapshot to prevent layout flickering from snapshot permission errors/updates
  fetchBooksFirestore().then((books) => {
    if (books && books.length > 0) {
      onUpdate(books);
    }
  });
  return () => {};
};

export const saveBookFirestore = async (book: Book) => {
  try {
    const docRef = doc(db, 'books', book.id);
    await setDoc(docRef, book, { merge: true });
  } catch (err) {
    handleFirestoreError(err, 'save', `books/${book.id}`);
  }
};

export const deleteBookFirestore = async (bookId: string) => {
  try {
    await deleteDoc(doc(db, 'books', bookId));
  } catch (err) {
    handleFirestoreError(err, 'delete', `books/${bookId}`);
  }
};

// ==================== BLOGS ====================
export const subscribeBlogs = (onUpdate: (blogs: BlogPost[]) => void) => {
  const colRef = collection(db, 'blogs');
  let loadedFromFirestore = false;

  return onSnapshot(colRef, async (snapshot) => {
    loadedFromFirestore = true;
    if (snapshot.empty) {
      try {
        for (const blog of INITIAL_BLOGS) {
          await setDoc(doc(db, 'blogs', blog.id), blog);
        }
      } catch (e) {
        handleFirestoreError(e, 'seed', 'blogs');
      }
      onUpdate(INITIAL_BLOGS);
    } else {
      const items: BlogPost[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as BlogPost);
      });
      onUpdate(items);
    }
  }, (err) => {
    handleFirestoreError(err, 'listen', 'blogs');
    if (!loadedFromFirestore) {
      // Retain initial local state
    }
  });
};

export const saveBlogFirestore = async (blog: BlogPost) => {
  try {
    const docRef = doc(db, 'blogs', blog.id);
    await setDoc(docRef, blog, { merge: true });
  } catch (err) {
    handleFirestoreError(err, 'save', `blogs/${blog.id}`);
  }
};

export const deleteBlogFirestore = async (blogId: string) => {
  try {
    await deleteDoc(doc(db, 'blogs', blogId));
  } catch (err) {
    handleFirestoreError(err, 'delete', `blogs/${blogId}`);
  }
};

// ==================== ORDERS ====================
export const subscribeOrders = (onUpdate: (orders: Order[]) => void) => {
  const colRef = collection(db, 'orders');
  let loadedFromFirestore = false;

  return onSnapshot(colRef, async (snapshot) => {
    loadedFromFirestore = true;
    if (snapshot.empty) {
      try {
        for (const order of INITIAL_ORDERS) {
          await setDoc(doc(db, 'orders', order.id), order);
        }
      } catch (e) {
        handleFirestoreError(e, 'seed', 'orders');
      }
      onUpdate(INITIAL_ORDERS);
    } else {
      const items: Order[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
      onUpdate(items);
    }
  }, (err) => {
    handleFirestoreError(err, 'listen', 'orders');
    if (!loadedFromFirestore) {
      // Retain initial local state
    }
  });
};

export const addOrderFirestore = async (order: Order) => {
  try {
    const docRef = doc(db, 'orders', order.id);
    await setDoc(docRef, { ...order, createdAt: serverTimestamp() });
  } catch (err) {
    handleFirestoreError(err, 'add', `orders/${order.id}`);
  }
};

export const updateOrderStatusFirestore = async (orderId: string, status: Order['status']) => {
  try {
    await updateDoc(doc(db, 'orders', orderId), { status });
  } catch (err) {
    handleFirestoreError(err, 'update', `orders/${orderId}`);
  }
};

export const deleteOrderFirestore = async (orderId: string) => {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
  } catch (err) {
    handleFirestoreError(err, 'delete', `orders/${orderId}`);
  }
};

// ==================== REVIEWS ====================
export const subscribeReviews = (onUpdate: (reviews: Review[]) => void) => {
  const colRef = collection(db, 'reviews');
  let loadedFromFirestore = false;

  return onSnapshot(colRef, async (snapshot) => {
    loadedFromFirestore = true;
    if (snapshot.empty) {
      try {
        for (const review of INITIAL_REVIEWS) {
          await setDoc(doc(db, 'reviews', review.id), review);
        }
      } catch (e) {
        handleFirestoreError(e, 'seed', 'reviews');
      }
      onUpdate(INITIAL_REVIEWS);
    } else {
      const items: Review[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Review);
      });
      onUpdate(items);
    }
  }, (err) => {
    handleFirestoreError(err, 'listen', 'reviews');
    if (!loadedFromFirestore) {
      // Retain initial local state
    }
  });
};

export const saveReviewFirestore = async (review: Review) => {
  try {
    await setDoc(doc(db, 'reviews', review.id), review, { merge: true });
  } catch (err) {
    handleFirestoreError(err, 'save', `reviews/${review.id}`);
  }
};

export const deleteReviewFirestore = async (reviewId: string) => {
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
  } catch (err) {
    handleFirestoreError(err, 'delete', `reviews/${reviewId}`);
  }
};

// ==================== INQUIRIES / MESSAGES ====================
export const subscribeInquiries = (onUpdate: (inquiries: InquiryMessage[]) => void) => {
  const colRef = collection(db, 'inquiries');
  let loadedFromFirestore = false;

  return onSnapshot(colRef, async (snapshot) => {
    loadedFromFirestore = true;
    if (snapshot.empty) {
      try {
        for (const inq of INITIAL_INQUIRIES) {
          await setDoc(doc(db, 'inquiries', inq.id), inq);
        }
      } catch (e) {
        handleFirestoreError(e, 'seed', 'inquiries');
      }
      onUpdate(INITIAL_INQUIRIES);
    } else {
      const items: InquiryMessage[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as InquiryMessage);
      });
      onUpdate(items);
    }
  }, (err) => {
    handleFirestoreError(err, 'listen', 'inquiries');
    if (!loadedFromFirestore) {
      // Retain initial local state
    }
  });
};

export const addInquiryFirestore = async (inquiry: InquiryMessage) => {
  try {
    await setDoc(doc(db, 'inquiries', inquiry.id), inquiry);
  } catch (err) {
    handleFirestoreError(err, 'add', `inquiries/${inquiry.id}`);
  }
};

export const markInquiryReadFirestore = async (inquiryId: string, isRead: boolean) => {
  try {
    await updateDoc(doc(db, 'inquiries', inquiryId), { isRead });
  } catch (err) {
    handleFirestoreError(err, 'update', `inquiries/${inquiryId}`);
  }
};

export const deleteInquiryFirestore = async (inquiryId: string) => {
  try {
    await deleteDoc(doc(db, 'inquiries', inquiryId));
  } catch (err) {
    handleFirestoreError(err, 'delete', `inquiries/${inquiryId}`);
  }
};

// ==================== SITE CONFIG ====================
export const subscribeSiteConfig = (onUpdate: (config: SiteConfig) => void) => {
  const docRef = doc(db, 'settings', 'siteConfig');
  let loadedFromFirestore = false;

  return onSnapshot(docRef, async (docSnap) => {
    loadedFromFirestore = true;
    if (!docSnap.exists()) {
      try {
        await setDoc(docRef, DEFAULT_SITE_CONFIG);
      } catch (e) {
        handleFirestoreError(e, 'seed', 'settings/siteConfig');
      }
      onUpdate(DEFAULT_SITE_CONFIG);
    } else {
      onUpdate(docSnap.data() as SiteConfig);
    }
  }, (err) => {
    handleFirestoreError(err, 'listen', 'settings/siteConfig');
    if (!loadedFromFirestore) {
      // Retain initial local state
    }
  });
};

export const saveSiteConfigFirestore = async (config: SiteConfig) => {
  try {
    await setDoc(doc(db, 'settings', 'siteConfig'), config, { merge: true });
  } catch (err) {
    handleFirestoreError(err, 'save', 'settings/siteConfig');
  }
};
