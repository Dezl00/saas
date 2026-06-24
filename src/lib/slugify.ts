export function slugifyArabic(text: string): string {
  const arabicMap: { [key: string]: string } = {
    'ا': 'a', 'أ': 'a', 'إ': 'e', 'آ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'th', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
    'ة': 'h', 'ئ': 'e', 'ؤ': 'o', 'ء': 'a'
  };

  let slug = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (arabicMap[char]) {
      slug += arabicMap[char];
    } else if (/[a-zA-Z0-9]/.test(char)) {
      slug += char.toLowerCase();
    } else if (char === ' ' || char === '-') {
      slug += '-';
    }
  }

  // Remove multiple hyphens and trim
  slug = slug.replace(/-+/g, '-').replace(/^-|-$/g, '');
  
  return slug;
}
