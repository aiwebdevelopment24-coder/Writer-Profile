import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, CheckCircle2, Truck, Phone, MapPin, User, BookOpen, Plus, Trash2 } from 'lucide-react';
import { Book, Order, SiteConfig } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  selectedBook?: Book | null;
  siteConfig?: SiteConfig;
  onPlaceOrder: (order: Omit<Order, 'id' | 'orderDate' | 'status'>) => void;
}

interface CartItem {
  id: string;
  bookId: string;
  quantity: number;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  books,
  selectedBook,
  siteConfig,
  onPlaceOrder,
}) => {
  const publishedBooks = books.filter(b => b.status === 'published' || !b.status);
  const availableBooks = publishedBooks.length > 0 ? publishedBooks : books;
  const defaultBook = selectedBook || availableBooks[0];

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 'item-1', bookId: defaultBook?.id || '', quantity: 1 }
  ]);
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'suburban' | 'outside'>('dhaka');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [orderRef, setOrderRef] = useState<string>('');

  // Synchronize cart when selectedBook changes or modal opens
  useEffect(() => {
    if (isOpen && defaultBook?.id) {
      setCartItems([{ id: `item-${Date.now()}`, bookId: defaultBook.id, quantity: 1 }]);
    }
  }, [isOpen, selectedBook]);

  if (!isOpen) return null;

  // Delivery Fees from SiteConfig or defaults
  const dhakaFee = siteConfig?.dhakaCityDeliveryFee ?? 50;
  const suburbanFee = siteConfig?.dhakaSuburbanDeliveryFee ?? 80;
  const outsideFee = siteConfig?.outsideDhakaDeliveryFee ?? 95;

  let currentDeliveryFee = dhakaFee;
  let deliveryAreaName = 'ঢাকা সিটি';
  if (deliveryArea === 'suburban') {
    currentDeliveryFee = suburbanFee;
    deliveryAreaName = 'ঢাকা সাব-আর্বান';
  } else if (deliveryArea === 'outside') {
    currentDeliveryFee = outsideFee;
    deliveryAreaName = 'ঢাকা সিটির বাহিরে';
  }

  // Calculate items subtotal and breakdown
  const cartDetails = cartItems.map(item => {
    const bookObj = availableBooks.find(b => b.id === item.bookId) || availableBooks[0];
    const price = bookObj?.price || 0;
    const itemSubtotal = price * item.quantity;
    return {
      ...item,
      bookObj,
      price,
      itemSubtotal,
    };
  });

  const booksSubtotal = cartDetails.reduce((sum, item) => sum + item.itemSubtotal, 0);
  const totalQuantity = cartDetails.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = booksSubtotal + currentDeliveryFee;

  // Cart operations
  const handleAddBookLine = () => {
    // Find next book not already in cart if possible
    const currentBookIds = cartItems.map(ci => ci.bookId);
    const nextBook = availableBooks.find(b => !currentBookIds.includes(b.id)) || availableBooks[0];
    setCartItems(prev => [
      ...prev,
      { id: `item-${Date.now()}-${Math.random()}`, bookId: nextBook?.id || '', quantity: 1 }
    ]);
  };

  const handleUpdateBookId = (itemId: string, newBookId: string) => {
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, bookId: newBookId } : item));
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (itemId: string) => {
    if (cartItems.length <= 1) return;
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) return;

    // Format books summary title for administration & notifications
    const summaryTitleParts = cartDetails.map(item => `${item.bookObj?.title || 'বই'} (${item.quantity}টি)`);
    const formattedBookTitle = summaryTitleParts.join(', ');

    onPlaceOrder({
      customerName,
      customerPhone,
      customerAddress,
      deliveryArea: deliveryAreaName,
      deliveryFee: currentDeliveryFee,
      bookId: cartDetails[0]?.bookId || '',
      bookTitle: formattedBookTitle,
      bookPrice: booksSubtotal,
      quantity: totalQuantity,
      totalPrice,
      items: cartDetails.map(ci => ({
        bookId: ci.bookId,
        bookTitle: ci.bookObj?.title || 'বই',
        bookPrice: ci.price,
        quantity: ci.quantity
      }))
    });

    const randomId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderRef(randomId);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setDeliveryArea('dhaka');
    setCartItems([{ id: 'item-1', bookId: defaultBook?.id || '', quantity: 1 }]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-hidden">
      <div className="bg-white border border-[#E6E2D8] rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col p-5 sm:p-7 shadow-2xl relative my-auto overflow-hidden">
        
        {/* Prominent Visible Close Button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-4 right-4 z-20 p-2.5 bg-[#F9F8F5] hover:bg-rose-50 border-2 border-[#D9D3C7] hover:border-rose-300 text-[#1D1E20] hover:text-rose-600 rounded-full transition-all shadow-md flex items-center justify-center group"
          title="বন্ধ করুন (Close)"
        >
          <X className="w-5 h-5 transition-transform group-hover:scale-110" />
        </button>

        {isSubmitted ? (
          <div className="text-center space-y-4 py-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">
              অর্ডার গ্রহণ করা হয়েছে!
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#1D1E20] max-w-sm mx-auto leading-relaxed bg-[#F9F8F5] p-4 rounded-2xl border border-[#E6E2D8]">
              আপনার অর্ডার গ্রহণ করা হয়েছে আলহামদুলিল্লাহ। একজন প্রতিনিধি কল করে অর্ডারটি কনফার্ম করবেন ইনশাআল্লাহ।
            </p>
            
            <div className="p-4 bg-[#F9F8F5] border border-[#E6E2D8] rounded-2xl text-left text-xs space-y-2">
              <p className="font-bold text-[#1D1E20] border-b pb-2">
                অর্ডারের বিশদ বিবরণ (রেফারেন্স: <span className="font-mono text-[#C29B47]">{orderRef}</span>):
              </p>
              <div className="flex justify-between text-[#5C584E]">
                <span>গ্রাহকের নাম:</span>
                <span className="font-bold text-[#1D1E20]">{customerName}</span>
              </div>
              
              <div className="space-y-1 py-1 border-y border-[#E2DDD3]">
                <span className="font-bold text-[#3A3834] block">অর্ডারকৃত বইসমূহ:</span>
                {cartDetails.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[#1D1E20] pl-2 text-[11px]">
                    <span>• {item.bookObj?.title} ({item.quantity}টি)</span>
                    <span className="font-bold">৳{item.itemSubtotal}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-[#5C584E]">
                <span>ডেলিভারি এরিয়া:</span>
                <span>{deliveryAreaName} (৳{currentDeliveryFee})</span>
              </div>
              <div className="flex justify-between text-[#5C584E] border-t pt-2 mt-1">
                <span>সর্বমোট প্রদেয় মূল্য:</span>
                <span className="font-bold text-[#C29B47] text-sm">৳{totalPrice}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl transition-colors"
            >
              বন্ধ করুন
            </button>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="text-center space-y-1.5 pr-10 shrink-0 border-b pb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF7E6] text-[#C29B47] flex items-center justify-center mx-auto shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <h2 className="font-serif-bn font-bold text-2xl text-[#1D1E20]">
                বই অর্ডার করুন
              </h2>
              <p className="text-xs text-[#8C887B]">
                ক্যাশ অন ডেলিভারিতে এক বা একাধিক বই পেতে ফরমটি পূরণ করুন।
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden mt-2">
              
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
                
                {/* Book Selection List (Multiple Books supported) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#1D1E20]">
                      বই নির্বাচন করুন ({cartItems.length}টি)
                    </label>
                    <span className="text-[11px] text-[#C29B47] font-semibold">
                      একাধিক বই যোগ করতে পারবেন
                    </span>
                  </div>

                  {cartDetails.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="p-3 bg-[#F9F8F5] border border-[#D9D3C7] rounded-2xl space-y-2 relative transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-[#8C887B] uppercase tracking-wider">
                          বই #{index + 1}
                        </span>
                        
                        {cartItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCartItem(item.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                            title="বইটি সরিয়ে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>সরান</span>
                          </button>
                        )}
                      </div>

                      {/* Select Book Dropdown */}
                      <div className="relative">
                        <select
                          value={item.bookId}
                          onChange={(e) => handleUpdateBookId(item.id, e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] font-bold focus:outline-none focus:border-[#C29B47] appearance-none"
                        >
                          {availableBooks.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.title} — ৳{b.price}
                            </option>
                          ))}
                        </select>
                        <BookOpen className="w-4 h-4 text-[#8C887B] absolute left-3 top-3 pointer-events-none" />
                      </div>

                      {/* Quantity & Item Subtotal */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#3A3834]">পরিমাণ:</span>
                          <div className="flex items-center gap-2 bg-white border border-[#D9D3C7] rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              className="w-7 h-7 rounded-lg bg-[#EFECE6] font-bold text-[#1D1E20] text-sm hover:bg-[#C29B47] hover:text-white transition-colors flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="font-serif-bn font-bold text-sm text-[#1D1E20] min-w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              className="w-7 h-7 rounded-lg bg-[#EFECE6] font-bold text-[#1D1E20] text-sm hover:bg-[#C29B47] hover:text-white transition-colors flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-[#8C887B] block">সাবটোটাল</span>
                          <span className="font-serif-bn font-bold text-sm text-[#1D1E20]">৳{item.itemSubtotal}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Another Book Button */}
                  <button
                    type="button"
                    onClick={handleAddBookLine}
                    className="w-full py-2.5 bg-white border-2 border-dashed border-[#C29B47] text-[#C29B47] hover:bg-[#FFF7E6] rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ আরো একটি বই যোগ করুন</span>
                  </button>
                </div>

                {/* Delivery Area Options */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-bold text-[#3A3834]">
                    ডেলিভারি চার্জ নির্বাচন করুন *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryArea('dhaka')}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                        deliveryArea === 'dhaka'
                          ? 'bg-[#1D1E20] text-white border-[#1D1E20] shadow-sm'
                          : 'bg-[#F9F8F5] text-[#3A3834] border-[#D9D3C7] hover:bg-[#EFECE6]'
                      }`}
                    >
                      <span className="text-[11px] font-bold block">ঢাকা সিটি</span>
                      <span className={`text-[10px] font-mono mt-0.5 ${deliveryArea === 'dhaka' ? 'text-[#C29B47]' : 'text-[#8C887B]'}`}>৳{dhakaFee}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryArea('suburban')}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                        deliveryArea === 'suburban'
                          ? 'bg-[#1D1E20] text-white border-[#1D1E20] shadow-sm'
                          : 'bg-[#F9F8F5] text-[#3A3834] border-[#D9D3C7] hover:bg-[#EFECE6]'
                      }`}
                    >
                      <span className="text-[11px] font-bold block">ঢাকা সাব-আর্বান</span>
                      <span className={`text-[10px] font-mono mt-0.5 ${deliveryArea === 'suburban' ? 'text-[#C29B47]' : 'text-[#8C887B]'}`}>৳{suburbanFee}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryArea('outside')}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                        deliveryArea === 'outside'
                          ? 'bg-[#1D1E20] text-white border-[#1D1E20] shadow-sm'
                          : 'bg-[#F9F8F5] text-[#3A3834] border-[#D9D3C7] hover:bg-[#EFECE6]'
                      }`}
                    >
                      <span className="text-[11px] font-bold block">ঢাকার বাহিরে</span>
                      <span className={`text-[10px] font-mono mt-0.5 ${deliveryArea === 'outside' ? 'text-[#C29B47]' : 'text-[#8C887B]'}`}>৳{outsideFee}</span>
                    </button>
                  </div>
                </div>

                {/* Customer Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3A3834]">
                    আপনার পূর্ণ নাম *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="যেমন: তানভীর রহমান"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                    />
                    <User className="w-4 h-4 text-[#8C887B] absolute left-3.5 top-3" />
                  </div>
                </div>

                {/* Customer Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3A3834]">
                    মোবাইল নম্বর (কন্ট্যাক্ট নম্বর) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                    />
                    <Phone className="w-4 h-4 text-[#8C887B] absolute left-3.5 top-3" />
                  </div>
                </div>

                {/* Customer Address */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3A3834]">
                    ডেলিভারি ঠিকানা (বাসা/রোড/থানা/জেলা) *
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      rows={2}
                      placeholder="বাসা/রোড/থানা/জেলা"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F9F8F5] border border-[#D9D3C7] rounded-xl text-xs text-[#1D1E20] focus:outline-none focus:border-[#C29B47]"
                    />
                    <MapPin className="w-4 h-4 text-[#8C887B] absolute left-3.5 top-3" />
                  </div>
                </div>

                {/* Pricing Breakdown Box */}
                <div className="p-3.5 bg-[#EFECE6] border border-[#E2DDD3] rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between text-[#5C584E]">
                    <span>বইয়ের সাবটোটাল ({totalQuantity}টি):</span>
                    <span>৳{booksSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-[#5C584E]">
                    <span>ডেলিভারি চার্জ ({deliveryAreaName}):</span>
                    <span>৳{currentDeliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1D1E20] border-t border-[#D9D3C7] pt-1.5 mt-1 text-sm">
                    <span>সর্বমোট প্রদেয় মূল্য:</span>
                    <span className="text-[#C29B47]">৳{totalPrice}</span>
                  </div>
                </div>

              </div>

              {/* Fixed Footer Submit Button */}
              <div className="shrink-0 pt-3 border-t mt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1D1E20] hover:bg-[#C29B47] text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>অর্ডার কনফার্ম করুন (৳{totalPrice})</span>
                </button>
              </div>

            </form>
          </>
        )}

      </div>
    </div>
  );
};
