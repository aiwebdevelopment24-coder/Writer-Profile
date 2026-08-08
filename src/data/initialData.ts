import { Book, BlogPost, EventItem, InquiryMessage, Accolade, Review, SiteConfig, Order, BlogComment } from '../types';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: 'জুবায়ের আহমেদ',
  siteLogo: 'https://i.ibb.co/0yjYyZ69/Whats-App-Image-2026-08-08-at-6-07-50-PM.jpg',
  authorName: 'জুবায়ের আহমেদ',
  authorDesignation: 'ইসলামি লেখক',
  authorImage: 'https://i.ibb.co/hJxXKrc0/Whats-App-Image-2026-08-08-at-9-16-42-AM.jpg',
  authorBioHeading: 'আমার সম্পর্কে',
  authorBioText: `"নশ্বর এই পৃথিবীর মায়া কাটিয়ে একদিন সবাইকে চলে যেতে হবে ধ্রুব সত্যের পথে। কিন্তু সেই যাত্রার আগে পৃথিবীর বুকে এমন কিছু কী রেখে যাওয়া যায়, যা মৃত্যুর পরেও আলোকবর্তিকা হয়ে থাকবে আর সাওয়াব পৌঁছাতে থাকবে আমার জন্য? সেই 'সদকায়ে জারিয়াহ'র স্বপ্ন বুনেই আমার কলম ধরা।

আমি জুবায়ের আহমেদ, কুমিল্লার তিতাস উপজেলার ওমরপুর গ্রামের সন্তান। আমার যৎসামান্য জ্ঞান ও লেখালেখির মাধ্যমে আপনাদের হাতে তুলে দিয়েছি- 'সুন্দর জীবন' 'খানিক গেলেই পথ', 'রাইটার্স টাইমলাইন' (যৌথ)। "কাবার আঙ্গিনার আশ্চর্য গল্প" (সংকলন)। কাবার মালিকের কাছে প্রার্থনা—তিনি যেন এই ক্ষুদ্র প্রচেষ্টাটুকু কবুল করে নেন।"`,
  authorPhilosophyText: `আমার অনুপ্রেরণা আসে সাধারণ মানুষের জীবনের অসাধারণ সব গল্প থেকে। আমি বিশ্বাস করি, প্রতিটি নীরবতার আড়ালে একটি মহাকাব্য লুকিয়ে থাকে। লেখকের কাজ হলো সেই নীরবতাকে ভাষায় রূপ দেওয়া।`,
  heroTitle: 'আমার কলমে ইসলামের আলো',
  heroSubtitle: 'গল্পের মাধ্যমে মানুষের জীবনের মূল্যবোধ, শিষ্টাচার এবং জীবনের অর্থ খুঁজে পাওয়া যায়, যদি তা গ্রহণ করে। সে জায়গায় কলম হাতে নেওয়া।।',
  heroBadgeText: 'ইসলামি লেখক',
  heroImage: 'https://i.ibb.co/hJxXKrc0/Whats-App-Image-2026-08-08-at-9-16-42-AM.jpg',
  heroBgImage: 'https://i.ibb.co/1t7hfKj9/Whats-App-Image-2026-08-08-at-9-17-06-AM.jpg',
  heroButtonText: 'বই অর্ডার করুন',
  rokomariLink: 'https://www.rokomari.com',
  footerText: '© ২০২৪ জুবায়ের আহমেদ। সর্বস্বত্ব সংরক্ষিত।',
  footerSubtext: 'আমি ক্ষুদ্র মানুষের ওয়েবসাইট ভিজিট করার জন্য কৃতজ্ঞতা।',
  contactEmail: 'jobayerahmed0123@gmail.com',
  contactPhone: '+880 1700-000000',
  dhakaCityDeliveryFee: 50,
  dhakaSuburbanDeliveryFee: 80,
  outsideDhakaDeliveryFee: 95,
  showSocialMediaSection: true,
  showFacebook: true,
  showYoutube: true,
  showTwitter: true,
  showInstagram: true,
  showLinkedin: true,
  socialLinks: {
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    twitter: '',
    instagram: '',
    linkedin: ''
  },
  adminEmail: 'aiwebdevelopment24@gmail.com',
  adminPassword: '112233'
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    customerName: 'মাসুদ পারভেজ',
    customerPhone: '01711223344',
    customerAddress: 'হাউজ ১২, রোড ৫, ধানমন্ডি, ঢাকা',
    bookId: 'book-1',
    bookTitle: 'সুন্দর জীবন',
    bookPrice: 350,
    quantity: 1,
    totalPrice: 350,
    status: 'pending',
    orderDate: '২০২৪-০৮-০২'
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'সুন্দর জীবন',
    englishTitle: 'Sunder Jibon',
    author: 'জুবায়ের আহমেদ',
    category: 'ইসলামি সাহিত্য',
    genreTag: 'ইসলামি • ২০২৪',
    year: '২০২৪',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    shortSynopsis: 'ইসলামি জীবনবোধ ও সুন্দর জীবন গড়ার দিকনির্দেশনা মূলক গ্রন্থ।',
    fullSynopsis: 'মানুষের জীবনের প্রকৃত মূল্যবোধ, নীতি-নৈতিকতা ও সুন্দর জীবন যাপনের জন্য দিকনির্দেশনামূলক একটি বই।',
    price: 350,
    originalPrice: 420,
    pages: 220,
    isbn: '978-984-1234-56-7',
    publisher: 'ইসলামি সাময়িকী প্রকাশনী',
    rating: 5.0,
    ratingCount: 120,
    isNewRelease: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'book-2',
    title: 'খানিক গেলেই পথ',
    englishTitle: 'Khanik Gelei Poth',
    author: 'জুবায়ের আহমেদ',
    category: 'ভাবনা ও জীবন',
    genreTag: 'ইসলামি ভাবনা • ২০২৩',
    year: '২০২৩',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    shortSynopsis: 'জীবনের মোড়ে মোড়ে আলোর সন্ধান এবং সঠিক পথ চেনার গল্প।',
    fullSynopsis: 'ধৈর্য, অধ্যবসায় এবং ইমানের সাথে জীবন চলার পথ খুঁজে পাওয়ার চমৎকার একটি পথপ্রদর্শক।',
    price: 300,
    originalPrice: 380,
    pages: 180,
    isbn: '978-984-8832-11-2',
    publisher: 'প্রকাশনী',
    rating: 4.9,
    ratingCount: 85,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'book-3',
    title: 'রাইটার্স টাইমলাইন (যৌথ)',
    englishTitle: 'Writers Timeline',
    author: 'জুবায়ের আহমেদ ও অন্যান্য',
    category: 'সংকলন',
    genreTag: 'সংকলন • ২০২২',
    year: '২০২২',
    coverImage: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    shortSynopsis: 'উদীয়মান লেখকদের ভাবনা ও লেখার সময়রেখা নিয়ে একটি অনুপ্রেরণামূলক গ্রন্থ।',
    fullSynopsis: 'লেখক জীবন ও লেখালেখির অভিজ্ঞতার গল্প সংকলন।',
    price: 280,
    pages: 160,
    isbn: '978-984-9910-44-3',
    publisher: 'সাহিত্য প্রকাশন',
    rating: 4.8,
    ratingCount: 95,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'book-4',
    title: 'কাবার আঙ্গিনার আশ্চর্য গল্প',
    englishTitle: 'Kabar Anginar Achorjo Golpo',
    author: 'জুবায়ের আহমেদ (সংকলন)',
    category: 'ইসলামি ইতিহাস',
    genreTag: 'ইসলামি • ২০২৪',
    year: '২০২৪',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
    shortSynopsis: 'বাইতুল্লাহর ইতিহাস, প্রাঙ্গণের চমৎকার গল্প ও স্মৃতির অনন্য সংকলন।',
    fullSynopsis: 'পবিত্র কাবা প্রাঙ্গণের ইতিহাস, অনুভূতির আখ্যান ও অনুপ্রেরণাদায়ী সংকলিত অভিজ্ঞতা।',
    price: 400,
    originalPrice: 500,
    pages: 250,
    isbn: '978-984-7721-05-9',
    publisher: 'ঐতিহ্য প্রকাশনী',
    rating: 5.0,
    ratingCount: 150,
    isNewRelease: true,
    isFeatured: true,
    status: 'published'
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'সুন্দর জীবনের সন্ধান ও ইমানি সচেতনতা',
    category: 'ইসলামি জীবন',
    date: '২০ অক্টোবর, ২০২৪',
    readTime: '৫ মিনিট পাঠ',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'জীবনের প্রতিটি পদক্ষেপে আল্লাহ তাআলার সন্তুষ্টি অর্জন এবং সুন্দর জীবনযাপনের দিকনির্দেশনা।',
    content: `মানুষের জীবনের আসল সৌন্দর্য তার আত্মিক প্রশান্তিতে। আমরা যখন দ্বীনের সঠিক শিক্ষা অনুযায়ী জীবন পরিচালনায় মনোযোগ দেই, তখন দুনিয়া ও আখিরাত উভয় জায়গাতেই সুন্দর পথ সুগম হয়।`,
    isFeatured: true,
    status: 'published',
    views: 1200
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'event-1',
    dateDay: '১৫',
    dateMonth: 'নভেম্বর',
    title: 'ইসলামি বইমেলা',
    location: 'জাতীয় মসজিদ বায়তুল মোকাররম প্রাঙ্গণ',
    iconType: 'calendar'
  }
];

export const INITIAL_ACCOLADES: Accolade[] = [
  {
    id: 'acc-1',
    title: 'ইসলামি সাহিত্য সম্মাননা',
    year: '২০২৪',
    category: 'ইসলামি বই রচনায় বিশেষ অবদান',
    iconName: 'Award'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    bookId: 'book-1',
    reviewerName: 'তানভীর হোসেন',
    reviewerTitle: 'পাঠক',
    rating: 5,
    date: '১ মে, ২০২৪',
    comment: 'জুবায়ের আহমেদ ভাইয়ের বইগুলো সত্যি হৃদয়স্পর্শী ও অনুপ্রেরণাদায়ী।'
  }
];

export const INITIAL_INQUIRIES: InquiryMessage[] = [
  {
    id: 'inq-1',
    senderName: 'আব্দুল্লাহ আল মাসউদ',
    senderEmail: 'masud@example.com',
    subject: 'বই বিষয়ভিত্তিক পরামর্শ',
    message: 'আসসালামু আলাইকুম ওয়া রহমাতুল্লাহ। আপনার লেখা সুন্দর জীবন বইটি পড়ে খুব উপকৃত হয়েছি।',
    date: '২ ঘণ্টা আগে',
    timeAgo: '২ ঘণ্টা আগে',
    isRead: false,
    isUrgent: false
  }
];

export const INITIAL_BLOG_COMMENTS: BlogComment[] = [
  {
    id: 'cmt-1',
    blogId: 'blog-1',
    userName: 'মাসুদ পারভেজ',
    date: '১৫ মার্চ, ২০২৪',
    comment: 'আলহামদুলিল্লাহ, খুব সুন্দর একটা পোস্ট।'
  }
];


