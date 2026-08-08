import React, { useState } from 'react';
import { BlogPost, BlogComment, ViewMode, UserProfile } from '../types';
import { ArrowLeft, Calendar, Eye, User, MessageCircle, Send, Edit3, Trash2, Check, Star } from 'lucide-react';

interface SingleBlogViewProps {
  blog: BlogPost;
  setCurrentView: (view: ViewMode) => void;
  comments: BlogComment[];
  onAddComment: (comment: BlogComment) => void;
  onUpdateComment: (comment: BlogComment) => void;
  onDeleteComment: (commentId: string) => void;
  currentUser: UserProfile | null;
  onTriggerAuthRequired: (msg?: string) => void;
  isAdmin?: boolean;
}

export const SingleBlogView: React.FC<SingleBlogViewProps> = ({
  blog,
  setCurrentView,
  comments = [],
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  currentUser,
  onTriggerAuthRequired,
  isAdmin = false,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [guestName, setGuestName] = useState('');
  
  // Comment being edited
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');

  const blogComments = comments.filter(c => c.blogId === blog.id);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser && !guestName.trim()) {
      if (onTriggerAuthRequired) {
        onTriggerAuthRequired('ব্লগে মন্তব্য করতে লগইন করুন বা নাম প্রদান করুন।');
      }
      return;
    }

    if (!newCommentText.trim()) return;

    const authorName = currentUser ? currentUser.name : guestName.trim();
    const userKey = currentUser ? (currentUser.id || currentUser.emailOrPhone) : undefined;

    const newComment: BlogComment = {
      id: 'cmt_' + Date.now(),
      blogId: blog.id,
      userName: authorName,
      userEmailOrPhone: currentUser ? currentUser.emailOrPhone : undefined,
      userKey: userKey,
      date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
      comment: newCommentText.trim(),
    };

    onAddComment(newComment);
    setNewCommentText('');
  };

  const handleStartEdit = (comment: BlogComment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.comment);
  };

  const handleSaveEdit = (comment: BlogComment) => {
    if (!editCommentText.trim()) return;
    onUpdateComment({
      ...comment,
      comment: editCommentText.trim(),
    });
    setEditingCommentId(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('blog')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C887B] hover:text-[#1D1E20] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>ব্লগ তালিকায় ফিরে যান</span>
      </button>

      {/* Header Info */}
      <div className="space-y-4">
        <span className="inline-block px-3 py-1 bg-[#C29B47]/20 text-[#C29B47] text-xs font-bold rounded-full uppercase">
          {blog.category}
        </span>

        <h1 className="font-serif-bn font-bold text-3xl sm:text-4xl text-[#1D1E20] leading-tight">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-[#8C887B] border-b border-[#E6E2D8] pb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#C29B47]" />
            <span>{blog.date}</span>
          </span>
          <span className="flex items-center gap-1 text-[#C29B47] font-semibold">
            <Eye className="w-3.5 h-3.5" />
            <span>{(blog.views || 0).toLocaleString('bn-BD')} বার পঠিত</span>
          </span>
          <span className="flex items-center gap-1 text-[#8C887B]">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{blogComments.length} টি মন্তব্য</span>
          </span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-[#E6E2D8] bg-[#EFECE6]">
        <img
          src={blog.coverImage}
          alt={blog.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body */}
      <div className="bg-white p-8 sm:p-12 border border-[#E6E2D8] rounded-3xl shadow-sm space-y-6 text-sm sm:text-base text-[#3A3834] font-serif-bn leading-relaxed whitespace-pre-line">
        {blog.content}
      </div>

      {/* Comments Section */}
      <div className="space-y-6 pt-6 border-t border-[#E6E2D8]">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-bn font-bold text-2xl text-[#1D1E20] flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#C29B47]" />
            <span>পাঠকদের মন্তব্য ({blogComments.length})</span>
          </h3>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="bg-[#EFECE6] border border-[#E2DDD3] rounded-2xl p-5 space-y-4 shadow-sm">
          {!currentUser && (
            <div>
              <label className="block text-xs font-bold text-[#3A3834] mb-1">আপনার নাম *</label>
              <input
                type="text"
                placeholder="যেমন: তানভীর আহমেদ"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#3A3834] mb-1">আপনার মন্তব্য লিখুন *</label>
            <textarea
              rows={3}
              required
              placeholder="এই লেখাসম্পর্কে আপনার মূল্যবান মতামত লিখুন..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#C29B47] hover:bg-[#a88338] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>মন্তব্য প্রকাশ করুন</span>
          </button>
        </form>

        {/* Comments List */}
        {blogComments.length > 0 ? (
          <div className="space-y-4">
            {blogComments.map((comment) => {
              const isOwner = currentUser && (
                comment.userKey === currentUser.id ||
                comment.userKey === currentUser.emailOrPhone ||
                comment.userName.toLowerCase() === currentUser.name.toLowerCase()
              );
              const canModify = isOwner || isAdmin;
              const isEditing = editingCommentId === comment.id;

              return (
                <div key={comment.id} className="bg-white border border-[#E6E2D8] rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#C29B47] text-white font-bold font-serif-bn text-xs flex items-center justify-center">
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#1D1E20] block">{comment.userName}</span>
                        <span className="text-[10px] text-[#8C887B]">{comment.date}</span>
                      </div>
                    </div>

                    {canModify && !isEditing && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(comment)}
                          className="p-1.5 text-[#5C584E] hover:text-[#C29B47] hover:bg-[#EFECE6] rounded-lg transition-colors cursor-pointer"
                          title="এডিট করুন"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="ডিলিট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 bg-[#F9F8F5] p-3 rounded-xl border border-[#D9D3C7]">
                      <textarea
                        rows={3}
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveEdit(comment)}
                          className="px-4 py-2 bg-[#1D1E20] text-white text-xs font-bold rounded-lg hover:bg-[#C29B47] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>সংরক্ষণ</span>
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-4 py-2 bg-[#EFECE6] text-[#5C584E] text-xs font-bold rounded-lg hover:bg-[#E2DDD3] transition-colors cursor-pointer"
                        >
                          বাতিল
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#3A3834] leading-relaxed whitespace-pre-line">{comment.comment}</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#E6E2D8] text-xs text-[#8C887B]">
            এখনো কোনো মন্তব্য করা হয়নি। আপনার মতামত জানান প্রথম হিসেবে!
          </div>
        )}
      </div>

    </div>
  );
};

