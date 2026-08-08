import { ViewMode, Book, BlogPost, SiteConfig } from '../types';

export function updateSEOMeta({
  view,
  selectedBook,
  selectedBlog,
  siteConfig
}: {
  view: ViewMode;
  selectedBook?: Book | null;
  selectedBlog?: BlogPost | null;
  siteConfig?: SiteConfig | null;
}) {
  const authorName = siteConfig?.siteName || 'জুবায়ের আহমেদ';
  let title = `${authorName} - প্রাতিষ্ঠানিক ও সাহিত্য ওয়েবসাইট`;
  let description = siteConfig?.heroSubtitle || 'কথাসাহিত্যিক ও প্রাবন্ধিক জুবায়ের আহমেদের অফিসিয়াল ওয়েবসাইট। নতুন বই, প্রবন্ধ, সাক্ষাৎকার ও পাঠক তথ্যপঞ্জি।';

  switch (view) {
    case 'home':
      title = `${authorName} - হোম | প্রাতিষ্ঠানিক ওয়েবসাইট`;
      description = siteConfig?.heroSubtitle || 'কথাসাহিত্যিক জুবায়ের আহমেদের বই, ইভেন্ট ও ব্লগসমূহ সম্বলিত হোম পেজ।';
      break;
    case 'books':
      title = `বইসমূহ | ${authorName}`;
      description = `${authorName}-এর প্রকাশিত সকল উপন্যাস, প্রবন্ধ ও সংকলন গ্রন্থমালা। সরাসরি অর্ডার করুন।`;
      break;
    case 'single-book':
      if (selectedBook) {
        title = `${selectedBook.title} - ${authorName} এর বই`;
        description = selectedBook.summary ? selectedBook.summary.slice(0, 160) : `${selectedBook.title} বইটি কিনুন। মূল্য: ৳ ${selectedBook.price}`;
      }
      break;
    case 'blog':
      title = `নিউজ ও ব্লগ | ${authorName}`;
      description = `${authorName}-এর সাম্প্রতিক ব্লগ পোস্ট, সাহিত্যচিন্তা, প্রবন্ধ ও সমসাময়িক কলাম।`;
      break;
    case 'single-blog':
      if (selectedBlog) {
        title = `${selectedBlog.title} - ${authorName} এর ব্লগ`;
        description = selectedBlog.excerpt ? selectedBlog.excerpt.slice(0, 160) : selectedBlog.title;
      }
      break;
    case 'accolades':
      title = `স্বীকৃতি ও সম্মাননা | ${authorName}`;
      description = `${authorName}-এর সাহিত্য জীবনের অর্জন, পদক ও বিশিষ্ট সম্মাননা তালিকা।`;
      break;
    case 'events':
      title = `ইভেন্ট ও কার্যক্রম | ${authorName}`;
      description = `${authorName}-এর আগামী বইমেলা, পাঠক আড্ডা ও সাহিত্য সভার সূচি।`;
      break;
    case 'gallery':
      title = `গ্যালারি | ${authorName}`;
      description = `${authorName}-এর সাহিত্য জীবনের ফটো গ্যালারি ও চিত্রমালা।`;
      break;
    case 'contact':
      title = `যোগাযোগ | ${authorName}`;
      description = `${authorName}-এর সাথে সরাসরি যোগাযোগ ও বার্তা পাঠাবার অফিসিয়াল মাধ্যম।`;
      break;
    case 'wishlist':
      title = `আমার উইশলিস্ট | ${authorName}`;
      description = 'আপনার সংরক্ষিত বইয়ের তালিকা।';
      break;
    case 'dashboard':
      title = `পাঠক ড্যাশবোর্ড | ${authorName}`;
      description = 'আপনার অর্ডার, বার্তা, ও রিভিউ পরিচালনা করুন।';
      break;
    case 'admin':
      title = `এডমিন স্টুডিও | ${authorName}`;
      description = 'অফিসিয়াল কন্টেন্ট ম্যানেজমেন্ট ও কন্ট্রোল প্যানেল।';
      break;
  }

  // Update Document Title
  document.title = title;

  // Update Document Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);
}
