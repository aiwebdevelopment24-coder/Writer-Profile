export const uploadImageToImgBB = async (file: File): Promise<string> => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY || '9a15e5b707a498a72bd01624d219a810';
  
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data && data.success && data.data && data.data.url) {
      return data.data.url;
    } else {
      throw new Error(data?.error?.message || 'ImgBB আপলোড ব্যর্থ হয়েছে');
    }
  } catch (error: any) {
    console.error('ImgBB Upload Error:', error);
    throw new Error(error?.message || 'ছবি আপলোড করতে সমস্যা হয়েছে। ইন্টারনেট কানেকশন চেক করুন।');
  }
};
