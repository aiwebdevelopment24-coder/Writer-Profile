import { Book, BlogPost, EventItem, InquiryMessage, Accolade, Review, SiteConfig, Order } from '../types';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: 'আহমেদ শরীফ',
  siteLogo: '',
  authorName: 'আহমেদ শরীফ',
  authorDesignation: 'সাহিত্যিক ও প্রাবন্ধিক',
  authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
  authorBioHeading: 'জীবন ও দর্শন',
  authorBioText: `আহমেদ শরীফ একজন আধুনিক কথাসাহিত্যিক, যাঁর লেখনীতে সমকালীন জীবনের জটিলতা এবং ধ্রুপদী সাহিত্যের গাম্ভীর্য ফুটে ওঠে। তিনি গত এক দশক ধরে বাংলা সাহিত্যের নতুন ধারা নির্মাণে অগ্রণী ভূমিকা পালন করছেন।\n\nশৈশব থেকেই বইয়ের পাতা ছিল আমার পরম আশ্রয়। ছোটবেলার সেই পুরনো লাইব্রেরির গন্ধ আজও আমার লেখনীকে প্রাণ দেয়। সাহিত্যের পথচলা শুরু হয়েছিল একটি ভাঙা কলম আর কিছু অব্যক্ত আবেগের মাধ্যমে।`,
  authorPhilosophyText: `আমার অনুপ্রেরণা আসে সাধারণ মানুষের জীবনের অসাধারণ সব গল্প থেকে। আমি বিশ্বাস করি, প্রতিটি নীরবতার আড়ালে একটি মহাকাব্য লুকিয়ে থাকে। লেখকের কাজ হলো সেই নীরবতাকে ভাষায় রূপ দেওয়া।`,
  heroTitle: 'শব্দের মায়াজালে জীবনের গল্প',
  heroSubtitle: 'সমকালীন কথাসাহিত্যে এক অন্য ঘরানার পথচলা। অনুভূতির নিপুণ অলঙ্করণ আর গভীর জীবনবোধের গল্প নিয়ে আপনার মুখোমুখি।',
  heroBadgeText: 'সাহিত্যিক ও প্রাবন্ধিক',
  heroImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  heroBgImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
  heroButtonText: 'বই অর্ডার করুন',
  rokomariLink: 'https://www.rokomari.com',
  footerText: '© ২০২৪ আহমেদ শরীফ। সর্বস্বত্ব সংরক্ষিত।',
  contactEmail: 'contact@ahmedsharif.com',
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
    bookTitle: 'নীল সীমানার ওপারে',
    bookPrice: 450,
    quantity: 1,
    totalPrice: 450,
    status: 'pending',
    orderDate: '২০২৪-০৮-০২'
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'নীল সীমানার ওপারে',
    englishTitle: 'Neel Seemanar Opare',
    author: 'আহমেদ শরীফ',
    category: 'উপন্যাস',
    genreTag: 'উপন্যাস • ২০২৪',
    year: '২০২৪',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    shortSynopsis: 'স্মৃতি ও বাস্তবতার এক অনন্য মিশ্রণ। জীবন যখন ক্লান্ত হয়ে কোনো এক অজানা মোহনায় এসে দাঁড়ায়, তখন সেই নীল সীমানার গল্প শুরু হয়।',
    fullSynopsis: 'এক নির্জন গোধূলির গল্প, যেখানে আকাশ আর সমুদ্রের মিলনে গড়ে উঠেছে জীবন ও সময়ের এক চিরন্তন রূপক। নীল সীমানার ওপারে এমন এক জগতের সন্ধান মিলে যেখানে মানুষের আবেগ আর প্রকৃতির নীরবতা একাকার হয়ে বয়। আহমেদ শরীফ তার নিপুণ লেখনীতে বুনেছেন বিরহ, প্রেম আর না-বলা ভাষার এক তীব্র আকুতি। এই উপন্যাস কেবল একটি পাঠ নয়, বরং একটি আত্মিক জীবনের উৎস হিসেবে রূপকের মধ্য দিয়ে সত্যকে খুঁজে পাওয়ার এক অনন্য ভ্রমণ।',
    price: 450,
    originalPrice: 550,
    pages: 312,
    isbn: '978-984-1234-56-7',
    publisher: 'ঐতিহ্য প্রকাশনী',
    rating: 4.9,
    ratingCount: 142,
    isNewRelease: true,
    isFeatured: true,
    status: 'published',
    sampleChapter: {
      chapterTitle: 'অধ্যায় এক: প্রারম্ভ - সমুদ্রের শেষ সীমানায়',
      chapterSubtitle: 'একটি মহাজাগতিক মায়ার গল্প যা সময়ের সীমানা ছাড়িয়ে যায়।',
      pages: [
        `নীল দিগন্ত যেখানে এসে মিশেছে লবণাক্ত জলের গভীরে, সেখানে এক অদ্ভুত স্তব্ধতা বিরাজ করে। বাতাস সেখানে অন্য এক ভাষায় কথা বলে—যে ভাষা কেবল ক্লান্ত পথিকরাই বুঝতে পারে। আকাশ আর সমুদ্রের সেই চিরকালীন মিলনের স্থলে দাঁড়িয়ে জয় এক অদ্ভুত শিহরণ অনুভব করল। আজ পনেরো বছর পর সে আবার এখানে ফিরে এসেছে, যেখানে সবকিছু শুরু হয়েছিল।

পুরানো লাইটহাউসটি আগের মতোই অটল দাঁড়িয়ে আছে। নোনা হাওয়ায় এর গায়ে ধরেছে অজস্র আঁচড়, ঠিক যেমন মনের হৃদয়েও জমেছে সময়ের কিছু ক্ষত। সমুদ্রের ঢেউগুলো একের পর এক বালুকাবেলায় আছড়ে পড়ছে, যেন কোনো এক প্রাচীন গোপন কথা বলতে চাইছে। জয়ের পকেট থেকে নীল রঙের খামটি বের করল। এখানে চিঠির গন্ধটি সেই একই রকম—হালকা ল্যাভেন্ডার আর স্মৃতির ছাপ।`,
        `সে জানত, নীল সীমানার ওপারেও এক জগৎ আছে। এমন এক জগৎ যেখানে হারিয়ে যাওয়া মুহূর্তগুলো আবার নতুন করে ডানা মেলে। কিন্তু সেই জগতে পৌঁছানোর পথ সবার জানা নেই। সমুদ্রের এই উত্তাল ঢেউয়ের মধ্যেই কোথাও লুকিয়ে আছে সেই রহস্যের চাবিকাঠি। জয় এক পা এগিয়ে গেল। বাতাসের ঝাপটায় তার চুলগুলো অবিন্যস্ত হয়ে পড়ল, কিন্তু তার চোখের দৃষ্টি ছিল স্থির। সে জানে, এই যাত্রায় ফিরতি কোনো টিকিট নেই।

দূর থেকে এক বিষণ্ণ গাঙচিলের ডাক ভেসে এল। জয় ভাবল, পাখিরা কি হৃদয়ের ক্লান্তি বোঝে? নাকি তারাও এই অনন্ত নীলিমার টানে সারাজীবন ডানা ঝাপটে যায়? হয়তো আমরা সবাই কোনো না কোনো অসীমের খোঁজে যাত্রাবোঝা। কারো গন্তব্য শহর, কারো বা কেবলই এক টুকরো নীল আকাশ।`,
        `আকাশে তখন গোধূলির রং জমেছে। গাঢ় নীল থেকে ধীরে ধীরে বেগুনি আর সোনাঝরা এক আভা ছড়িয়ে পড়ছে চারদিকে। এই সেই সময়, যখন বাস্তবতা আর কল্পনার সীমারেখা মুছে যায়। জয় দীর্ঘশ্বাস ফেলল। নীল সীমানার ওপারে কি সত্যিই সে তাকে খুঁজে পাবে? যার জন্য এই দীর্ঘ অপেক্ষা, এই পনেরো বছরের নিঃশব্দ রোদন?`,
        `গল্পের সমাপ্তি ঘটে কিন্তু অনুভূতির সৃষ্টি চিরন্তন। নীল সীমানার ওপারে উপন্যাসের পূর্ণাঙ্গ অভিজ্ঞতার জন্য মূল বইটি অনলাইনে বা নিকটস্থ বইয়ের দোকানে সংগ্রহ করতে পারেন।`
      ]
    }
  },
  {
    id: 'book-2',
    title: 'হৃদয় কথন ও অন্যান্য',
    englishTitle: 'Hridoy Kothon o Onnayno',
    author: 'আহমেদ শরীফ',
    category: 'কবিতা',
    genreTag: 'কবিতা • ২০২৩',
    year: '২০২৩',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    shortSynopsis: 'নির্জন বিকেলের ক্লান্ত আলোয় যেমন কবিতার জন্ম হয়, তাদের নিয়েই এই সংকলন। অনুভূতির সূক্ষ্ম কারুকাজ প্রতিটি ছত্রে।',
    fullSynopsis: 'হৃদয়ের গহীন কোণে জমতে থাকা না-বলা কথার সমাহার এই কাব্যগ্রন্থ। জীবনের প্রাত্যহিক ব্যাকুলতা, প্রেম, বিরহ এবং প্রকৃতির চিরায়ত সৌন্দর্যকে কবির কলম ছুঁয়ে গেছে এক অসামান্য অলঙ্করণে।',
    price: 320,
    originalPrice: 400,
    pages: 128,
    isbn: '978-984-8832-11-2',
    publisher: 'অনন্যা প্রকাশনী',
    rating: 4.8,
    ratingCount: 88,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'book-3',
    title: 'অন্ধকারের শহর',
    englishTitle: 'Ondhokarer Shohor',
    author: 'আহমেদ শরীফ',
    category: 'থ্রিলার',
    genreTag: 'থ্রিলার • ২০২২',
    year: '২০২২',
    coverImage: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    shortSynopsis: 'শহরের অলিতে-গলিতে লুকিয়ে থাকা রহস্য যখন উন্মোচিত হতে শুরু করে, তখন অন্ধকারই হয়ে ওঠে একমাত্র সত্য।',
    fullSynopsis: 'একটি বৃষ্টিস্নাত রাতে পুরান ঢাকার এক পরিত্যক্ত অট্টালিকায় ঘটে যায় এক রহস্যময় হত্যাকাণ্ড। ঘটনা উন্মোচনে গিয়ে গোয়েন্দা রাইহান প্রবেশ করেন এমন এক জালে যেখানে সত্য আর মিথ্যার সীমানা ঝাপসা হয়ে আসে।',
    price: 380,
    pages: 256,
    isbn: '978-984-9910-44-3',
    publisher: 'বাতিঘর',
    rating: 4.7,
    ratingCount: 115,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'book-4',
    title: 'নিশীথ প্রহর',
    englishTitle: 'Nishith Prohor',
    author: 'আহমেদ শরীফ',
    category: 'উপন্যাস',
    genreTag: 'উপন্যাস • ২০২১',
    year: '২০২১',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
    shortSynopsis: 'রাতের নীরবতায় জেগে ওঠা কিছু স্মৃতির উপাখ্যান। গল্প সংকলন ও মনস্তাত্ত্বিক কাহিনীর অনন্য সমাহার।',
    fullSynopsis: 'নিশীথ প্রহর মানুষের মনের অবচেতন স্তরের কথন। মধ্যরাতের নিঃসঙ্গতায় যখন স্মৃতির কোলাহল বাড়ে, তখন প্রতিটি মানুষ নিজের মুখোমুখি দাঁড়ায়।',
    price: 350,
    pages: 210,
    isbn: '978-984-7721-05-9',
    publisher: 'প্রথমা প্রকাশন',
    rating: 4.8,
    ratingCount: 96,
    status: 'published'
  },
  {
    id: 'book-5',
    title: 'উপরে আকাশ',
    englishTitle: 'Upore Aakash',
    author: 'আহমেদ শরীফ',
    category: 'প্রবন্ধ',
    genreTag: 'স্মৃতিকথা • ২০২০',
    year: '২০২০',
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80',
    shortSynopsis: 'একটি গ্রামীণ জীবনের উপন্যাস ও স্মৃতিচারণ। উন্মুক্ত আকাশের নিচে জীবনের পাঠ অনুসন্ধানের আখ্যান।',
    fullSynopsis: 'লেখক আহমেদ শরীফের কৈশোর এবং শৈশবের স্মৃতিকথা। গ্রামীণ রূপসী বাংলার সাধারণ জীবনের মাঝে লুকিয়ে থাকা গভীর জীবনবোধকে তিনি তুলে ধরেছেন অপূর্ব প্রাঞ্জলতায়।',
    price: 290,
    pages: 180,
    isbn: '978-984-6620-33-8',
    publisher: 'ঐতিহ্য',
    rating: 4.9,
    ratingCount: 104,
    status: 'published'
  },
  {
    id: 'book-6',
    title: 'দ্য সাইলেন্ট ইঙ্ক',
    englishTitle: 'The Silent Ink',
    author: 'আহমেদ শরীফ',
    category: 'উপন্যাস',
    genreTag: 'সাহিত্যিক কথাসাহিত্য',
    year: '২০২৩',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    shortSynopsis: 'যুদ্ধোত্তর ল্যান্ডস্কেপে না বলা কথা এবং ইতিহাসের ভার নিয়ে একটি অনুসন্ধান।',
    fullSynopsis: 'An exploration of unspoken words and the weight of history in a post-war landscape.',
    price: 420,
    pages: 342,
    isbn: '978-012-3456-78-9',
    publisher: 'Author Studio Press',
    rating: 4.8,
    ratingCount: 65,
    status: 'published'
  },
  {
    id: 'book-7',
    title: 'ইকোস অফ ইন্ডাস্ট্রি',
    englishTitle: 'Echoes of Industry',
    author: 'আহমেদ শরীফ',
    category: 'প্রবন্ধ',
    genreTag: 'নন-ফিকশন',
    year: '২০২৪',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    shortSynopsis: 'শেষ পর্যায়ের শিল্পায়ন এবং আত্মার ওপর এর স্থাপত্যগত ছাপের একটি সমালোচনামূলক বিশ্লেষণ।',
    fullSynopsis: 'A critical analysis of late-stage industrialism and its architectural footprint on the soul.',
    price: 480,
    pages: 218,
    isbn: '978-012-9876-54-3',
    publisher: 'Academic Press',
    rating: 4.6,
    ratingCount: 42,
    status: 'draft'
  },
  {
    id: 'book-8',
    title: 'ফ্র্যাগমেন্টস অফ ডেলাইট',
    englishTitle: 'Fragments of Daylight',
    author: 'আহমেদ শরীফ',
    category: 'প্রবন্ধ',
    genreTag: 'প্রবন্ধ সংকলন',
    year: '২০২২',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    shortSynopsis: 'সময়ের অতিবাহিত হওয়া এবং জাগতিক সংযোগস্থলে খুঁজে পাওয়া সৌন্দর্য নিয়ে শান্ত পর্যবেক্ষণ।',
    fullSynopsis: 'Quiet observations on the passing of time and the beauty found in mundane intersections.',
    price: 360,
    pages: 156,
    isbn: '978-012-5554-33-2',
    publisher: 'Literary Press',
    rating: 4.9,
    ratingCount: 78,
    status: 'published'
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'কলকাতা আন্তর্জাতিক বইমেলায় নতুন উপন্যাসের মোড়ক উন্মোচন',
    category: 'ইন্ডাস্ট্রি নিউজ',
    date: '২০ অক্টোবর, ২০২৪',
    readTime: '৬ মিনিট পাঠ',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'এবারের বইমেলায় পাঠকদের ভিড় ছিল চোখে পড়ার মতো। নতুন প্রজন্মের পাঠকদের সাথে মতবিনিময়ের কিছু মুহূর্ত যা জীবনের অন্যতম সেরা স্মৃতি।',
    content: `কলকাতা আন্তর্জাতিক বইমেলায় এবছর আমার নতুন উপন্যাস 'নীল সীমানার ওপারে'-এর আনুষ্ঠানিক মোড়ক উন্মোচন সম্পন্ন হয়েছে। অনুষ্ঠানের সভাপতি ছিলেন বিশিষ্ট সাহিত্য সমালোচক ও বাংলা একাডেমির কর্মকর্তাবৃন্দ।

পাঠকদের উপস্থিতি ও ভালোবাসা আমাকে অভিভূত করেছে। বিশেষ করে তরুণদের মাঝে বই পড়ার এই জোয়ার বাংলা সাহিত্যের ভবিষ্যৎ নিয়ে আমাদের আশাবাদী করে তোলে। লিটল ম্যাগাজিন চত্বর থেকে শুরু করে মূল প্যাভিলিয়নগুলোতে পাঠকদের যে স্বতঃস্ফূর্ত আলোচনা ছিল, তা সত্যি প্রশংসনীয়।`,
    isFeatured: true,
    status: 'published',
    views: 1420
  },
  {
    id: 'blog-2',
    title: 'লেখালিখির নেপথ্য কাহিনী: একটি নির্জন দুপুর',
    category: 'সাহিত্যচর্চা',
    date: '১৫ অক্টোবর, ২০২৪',
    readTime: '৫ মিনিট পাঠ',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    excerpt: 'সৃজনশীল কাজের জন্য একান্ত সময়ের গুরুত্ব অপরিসীম। আমার নতুন পান্ডুলিপি তৈরির দিনগুলো ছিল বৃষ্টির শব্দ আর গভীর ভাবনার সংমিশ্রণ।',
    content: `একজন লেখকের কাছে নিরবতা হলো সবচেয়ে বড় শক্তি। নির্জন এক দুপুরে বসে যখন প্রথম পাতার বাক্যগুলো তৈরি হচ্ছিল, তখন বাইরের বৃষ্টির টিপ টিপ শব্দ আর ঘরের কোণে কফির সুবাস এক অদ্ভুত আবেশ তৈরি করেছিল।

লেখার টেবিলে বসে কালির আঁচড়ে যখন কোনো চরিত্রের জন্ম হয়, তখন লেখক কেবল স্রষ্টা থাকেন না, তিনি নিজেও সেই চরিত্রের সুখ-দুঃখের অংশীদার হয়ে ওঠেন।`,
    status: 'published',
    views: 980
  },
  {
    id: 'blog-3',
    title: 'প্রিয় বইয়ের তালিকায় যে পাঁচটি নাম না থাকলেই নয়',
    category: 'নতুন বই',
    date: '০৫ অক্টোবর, ২০২৪',
    readTime: '৮ মিনিট পাঠ',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    excerpt: 'বিশ্বসাহিত্যের কিছু ক্লাসিক বই যা আমার চিন্তাধারাকে আমূল বদলে দিয়েছে। আপনাদের সাথে শেয়ার করলাম সেই তালিকার সারাংশ।',
    content: `বই পড়া কেবল সময় কাটানোর মাধ্যম নয়, এটি নিজের চিন্তাজগৎকে বিস্তৃত করার এক অনন্য মাধ্যম। আমার জীবন ও লেখালিখির ওপর যে বইগুলো গভীর প্রভাব ফেলেছে, তার মধ্যে পাঁচটি কালজয়ী সাহিত্যের কথা আজ বলব...`,
    status: 'published',
    views: 1250
  },
  {
    id: 'blog-4',
    title: 'বর্ষার দিনে কবিতার সাথে কিছুক্ষণ',
    category: 'কবিতা',
    date: '২৭ সেপ্টেম্বর, ২০২৪',
    readTime: '৪ মিনিট পাঠ',
    coverImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
    excerpt: 'বৃষ্টির শব্দের সাথে জীবনানন্দ বা শক্তি চট্টোপাধ্যায়ের কবিতা এক অনন্য আবহ তৈরি করে। অনুভূতির গভীরে নামার এক মুহূর্ত।',
    content: `বর্ষা আর কবিতা বাংলা সাহিত্যে একে অপরের পরিপূরক। জানালার পাশে বসে যখন কদম ফুলের সুবাস আর রিমঝিম বৃষ্টির শব্দ কানে আসে, তখন রবিঠাকুর বা জীবনানন্দের পংক্তিমালা নিজের অজান্তেই মনে গুঞ্জরিত হয়...`,
    status: 'published',
    views: 740
  },
  {
    id: 'blog-5',
    title: 'Finding Silence in a Hyper-Connected World',
    category: 'প্রক্রিয়া',
    date: 'October 02, 2024',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    excerpt: 'A personal reflection on the necessity of mental quietude for deep literary creation.',
    content: 'In an era dominated by notifications and constant connectedness, deep reading and writing require deliberate acts of withdrawal...',
    status: 'draft',
    views: 310
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'event-1',
    dateDay: '১৫',
    dateMonth: 'নভেম্বর',
    title: 'ঢাকা লিট ফেস্ট',
    location: 'বাংলা একাডেমি প্রাঙ্গণ',
    iconType: 'calendar'
  },
  {
    id: 'event-2',
    dateDay: '০২',
    dateMonth: 'ডিসেম্বর',
    title: 'পাঠক সমাবেশ',
    location: 'বিশ্বসাহিত্য কেন্দ্র',
    iconType: 'calendar'
  },
  {
    id: 'event-3',
    dateDay: '২০',
    dateMonth: 'ডিসেম্বর',
    title: 'সাহিত্য সম্মেলন',
    location: 'অনলাইন জুম মিটিং',
    iconType: 'video'
  }
];

export const INITIAL_ACCOLADES: Accolade[] = [
  {
    id: 'acc-1',
    title: 'বাংলা একাডেমি সাহিত্য পুরস্কার',
    year: '২০২২',
    category: 'কথাসাহিত্য: অনন্য অবদানের জন্য',
    iconName: 'Award'
  },
  {
    id: 'acc-2',
    title: 'একুশে পদক',
    year: '২০২৪',
    category: 'ভাষা ও সাহিত্য বিশেষ অবদানের স্বীকৃতিস্বরূপ',
    iconName: 'Medal'
  },
  {
    id: 'acc-3',
    title: 'প্রথম আলো বর্ষসেরা বই',
    year: '২০১৯',
    category: 'শ্রেষ্ট উপন্যাস',
    iconName: 'Trophy'
  },
  {
    id: 'acc-4',
    title: 'আইএফআইসি ব্যাংক সাহিত্য পুরস্কার',
    year: '২০১৭',
    category: 'প্রবন্ধ ও গবেষণা',
    iconName: 'Star'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    bookId: 'book-1',
    reviewerName: 'তানভীর হোসেন',
    reviewerTitle: 'সাহিত্য সমালোচক',
    rating: 5,
    date: '১ মে, ২০২৪',
    comment: 'আহমেদের লেখনী শৈলী একাধারে আধুনিক ও ধ্রুপদী। সত্যিই নীল সীমানার ওপারে এই প্রথমবার অদ্ভুত এক অনুভূতির জন্ম দিল।'
  },
  {
    id: 'rev-2',
    bookId: 'book-1',
    reviewerName: 'নুশরাত জাহান',
    reviewerTitle: 'পাঠক',
    rating: 5,
    date: '৭ এপ্রিল, ২০২৪',
    comment: 'বইটির প্রচ্ছদ যেমন সুন্দর, ভেতরের গল্পটি তার চেয়েও বেশি গভীর। আধুনিক বাংলা সাহিত্যে এক অনন্য সংযোজন।'
  },
  {
    id: 'rev-3',
    bookId: 'book-1',
    reviewerName: 'রাকিব হাসান',
    reviewerTitle: 'দৈনিক বার্তা',
    rating: 5,
    date: '১০ মার্চ, ২০২৪',
    comment: 'তার গল্পে সাধারণ মানুষের অসাধারণ হয়ে ওঠার এক অদ্ভুত আবেদন আছে যা পাঠককে গভীরভাবে ভাবায়।'
  }
];

export const INITIAL_INQUIRIES: InquiryMessage[] = [
  {
    id: 'inq-1',
    senderName: 'Eleanor Vance',
    senderEmail: 'e.vance@literaryagency.com',
    subject: 'Request for Translation Rights (English Market)',
    message: 'Dear Author, We would like to inquire about acquiring translation rights for "Neel Seemanar Opare" for international publication.',
    date: '2 hours ago',
    timeAgo: '২ ঘণ্টা আগে',
    isRead: false,
    isUrgent: true
  },
  {
    id: 'inq-2',
    senderName: 'Julian Thorne',
    senderEmail: 'j.thorne@speakersbureau.org',
    subject: 'Speaking Invitation: Winter Literary Summit',
    message: 'It is our privilege to invite you as the keynote speaker for our annual literary gathering in December.',
    date: '5 hours ago',
    timeAgo: '৫ ঘণ্টা আগে',
    isRead: false
  },
  {
    id: 'inq-3',
    senderName: 'Clarissa Montague',
    senderEmail: 'c.montague@press.co.bd',
    subject: 'Translation Rights Inquiry for Spanish Market',
    message: 'We represent Literary Heights Agency and wish to discuss translation rights for your non-fiction collection.',
    date: 'Yesterday',
    timeAgo: 'গতকাল',
    isRead: true
  },
  {
    id: 'inq-4',
    senderName: 'Marcus Reed',
    senderEmail: 'marcus.reader@gmail.com',
    subject: 'Fan Mail & Reader Review',
    message: 'I just finished reading your latest novel and felt compelled to write. The character development was profoundly moving.',
    date: '2 days ago',
    timeAgo: '২ দিন আগে',
    isRead: true
  }
];
