import React from 'react';
import { X, BookOpen, ExternalLink } from 'lucide-react';
import { getEmbeddablePdfUrl } from '../utils/mediaUtils';

interface PdfReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  pdfUrl?: string;
}

export const PdfReaderModal: React.FC<PdfReaderModalProps> = ({
  isOpen,
  onClose,
  bookTitle,
  pdfUrl,
}) => {
  if (!isOpen || !pdfUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1D1E20] border border-[#3A3834] rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 sm:px-6 bg-[#26272B] border-b border-[#3A3834] flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C29B47] text-white flex items-center justify-center shadow">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-bn font-bold text-lg sm:text-xl text-white">
                একটু পড়ুন: {bookTitle}
              </h3>
              <p className="text-[11px] text-[#A6A296]">নমুনা অধ্যায় / ডিজিটাল পঠন</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#3A3834] hover:bg-[#C29B47] text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">নতুন ট্যাবে খুলুন</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 text-[#A6A296] hover:text-white rounded-full hover:bg-[#3A3834] transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Embed */}
        <div className="flex-1 bg-[#121315] relative overflow-hidden">
          <iframe
            src={getEmbeddablePdfUrl(pdfUrl)}
            title={`PDF Reader - ${bookTitle}`}
            className="w-full h-full border-0"
          />
        </div>

      </div>
    </div>
  );
};
