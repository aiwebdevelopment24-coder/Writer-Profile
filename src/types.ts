export type ViewMode = 
  | 'home' 
  | 'author' 
  | 'books' 
  | 'single-book' 
  | 'sample-reader' 
  | 'blog' 
  | 'single-blog' 
  | 'contact' 
  | 'admin';

export type AdminSubTab = 'overview' | 'site' | 'books' | 'orders' | 'blogs' | 'author' | 'messages' | 'reviews';

export interface SiteConfig {
  siteName: string;
  siteLogo: string;
  authorName: string;
  authorDesignation: string;
  authorImage: string;
  authorBioHeading: string;
  authorBioText: string;
  authorPhilosophyText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadgeText?: string;
  heroImage: string;
  heroBgImage?: string;
  heroButtonText: string;
  rokomariLink?: string;
  footerText: string;
  contactEmail: string;
  contactPhone?: string;
  dhakaCityDeliveryFee?: number;
  dhakaSuburbanDeliveryFee?: number;
  outsideDhakaDeliveryFee?: number;
  showSocialMediaSection?: boolean;
  showFacebook?: boolean;
  showYoutube?: boolean;
  showTwitter?: boolean;
  showInstagram?: boolean;
  showLinkedin?: boolean;
  socialLinks: {
    facebook: string;
    youtube: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  adminEmail: string;
  adminPassword: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryArea?: string;
  deliveryFee?: number;
  bookId: string;
  bookTitle: string;
  bookPrice: number;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  orderDate: string;
}

export interface Book {
  id: string;
  title: string;
  englishTitle?: string;
  author: string;
  category: string;
  genreTag: string;
  year: string;
  coverImage: string;
  shortSynopsis: string;
  fullSynopsis: string;
  price: number;
  originalPrice?: number;
  pages: number;
  isbn: string;
  publisher: string;
  rating: number;
  ratingCount: number;
  isNewRelease?: boolean;
  isFeatured?: boolean;
  status: 'published' | 'draft';
  pdfUrl?: string;
  sampleChapter?: {
    chapterTitle: string;
    chapterSubtitle: string;
    pages: string[];
  };
}

export interface Review {
  id: string;
  bookId: string;
  reviewerName: string;
  reviewerTitle?: string;
  rating: number;
  date: string;
  comment: string;
  avatar?: string;
  authorKey?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  englishTitle?: string;
  category: string;
  date: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string;
  isFeatured?: boolean;
  status: 'published' | 'draft';
  views?: number;
}

export interface EventItem {
  id: string;
  dateDay: string;
  dateMonth: string;
  title: string;
  location: string;
  iconType: 'calendar' | 'video';
}

export interface InquiryMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  date: string;
  timeAgo: string;
  isRead: boolean;
  isUrgent?: boolean;
}

export interface Accolade {
  id: string;
  title: string;
  year: string;
  category: string;
  iconName: string;
}
