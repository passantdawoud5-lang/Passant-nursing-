import React from 'react';

interface SocialLinkItem {
  id: string;
  name: string;
  arabicName: string;
  href: string;
  handleOrEmail: string;
  ariaLabel: string;
  iconBgColor: string;
  iconHoverBg: string;
  textColor: string;
}

export const SOCIAL_LINKS = {
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    arabicName: 'فيسبوك',
    href: 'https://www.facebook.com/share/19jXU5Qqk5/?mibextid=wwXIfr',
    handleOrEmail: 'Passant Nursing',
    ariaLabel: 'صفحة فيسبوك الرسمية لـ Passant Nursing',
    color: '#1877F2',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    arabicName: 'انستغرام',
    href: 'https://www.instagram.com/passantnursing?exln=bGVhdDk0ZWpydjZz&utm_source=qr',
    handleOrEmail: '@passantnursing',
    ariaLabel: 'حساب انستغرام الرسمي لـ Passant Nursing',
    color: '#E4405F',
  },
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    arabicName: 'الجيميل',
    href: 'mailto:passantnursing@gmail.com',
    handleOrEmail: 'passantnursing@gmail.com',
    ariaLabel: 'راسلنا مباشرة عبر الجيميل',
    color: '#EA4335',
  },
} as const;

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const GmailIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

interface SocialLinksProps {
  variant?: 'footer' | 'compact' | 'bar' | 'mobile';
  className?: string;
  showLabels?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  variant = 'footer',
  className = '',
  showLabels = false,
}) => {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <a
          href={SOCIAL_LINKS.facebook.href}
          target="_blank"
          rel="noopener noreferrer"
          title="فيسبوك - Passant Nursing"
          aria-label={SOCIAL_LINKS.facebook.ariaLabel}
          className="w-7 h-7 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-[#1877F2] flex items-center justify-center transition-all duration-200"
        >
          <FacebookIcon className="w-3.5 h-3.5" />
        </a>
        <a
          href={SOCIAL_LINKS.instagram.href}
          target="_blank"
          rel="noopener noreferrer"
          title="انستغرام - @passantnursing"
          aria-label={SOCIAL_LINKS.instagram.ariaLabel}
          className="w-7 h-7 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 flex items-center justify-center transition-all duration-200"
        >
          <InstagramIcon className="w-3.5 h-3.5" />
        </a>
        <a
          href={SOCIAL_LINKS.gmail.href}
          title="الجيميل - passantnursing@gmail.com"
          aria-label={SOCIAL_LINKS.gmail.ariaLabel}
          className="w-7 h-7 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-[#EA4335] flex items-center justify-center transition-all duration-200"
        >
          <GmailIcon className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  if (variant === 'bar') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <a
          href={SOCIAL_LINKS.facebook.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={SOCIAL_LINKS.facebook.ariaLabel}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/80 hover:bg-[#1877F2] text-slate-300 hover:text-white text-xs transition-colors"
        >
          <FacebookIcon className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">فيسبوك</span>
        </a>
        <a
          href={SOCIAL_LINKS.instagram.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={SOCIAL_LINKS.instagram.ariaLabel}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/80 hover:bg-pink-600 text-slate-300 hover:text-white text-xs transition-colors"
        >
          <InstagramIcon className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">انستغرام</span>
        </a>
        <a
          href={SOCIAL_LINKS.gmail.href}
          aria-label={SOCIAL_LINKS.gmail.ariaLabel}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/80 hover:bg-red-600 text-slate-300 hover:text-white text-xs transition-colors"
        >
          <GmailIcon className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">الجيميل</span>
        </a>
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`grid grid-cols-3 gap-2 ${className}`}>
        <a
          href={SOCIAL_LINKS.facebook.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1877F2] border border-blue-200 transition-colors text-center"
        >
          <FacebookIcon className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-bold text-slate-800">فيسبوك</span>
        </a>
        <a
          href={SOCIAL_LINKS.instagram.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#E4405F] border border-pink-200 transition-colors text-center"
        >
          <InstagramIcon className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-bold text-slate-800">انستغرام</span>
        </a>
        <a
          href={SOCIAL_LINKS.gmail.href}
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#EA4335] border border-red-200 transition-colors text-center"
        >
          <GmailIcon className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-bold text-slate-800">الجيميل</span>
        </a>
      </div>
    );
  }

  // default 'footer'
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2.5">
        <a
          href={SOCIAL_LINKS.facebook.href}
          target="_blank"
          rel="noopener noreferrer"
          title="فيسبوك - صفحة Passant Nursing"
          aria-label={SOCIAL_LINKS.facebook.ariaLabel}
          className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-slate-700/60 hover:scale-105"
        >
          <FacebookIcon className="w-4 h-4" />
        </a>
        <a
          href={SOCIAL_LINKS.instagram.href}
          target="_blank"
          rel="noopener noreferrer"
          title="انستغرام - @passantnursing"
          aria-label={SOCIAL_LINKS.instagram.ariaLabel}
          className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-slate-700/60 hover:scale-105"
        >
          <InstagramIcon className="w-4 h-4" />
        </a>
        <a
          href={SOCIAL_LINKS.gmail.href}
          title="الجيميل - راسلنا على passantnursing@gmail.com"
          aria-label={SOCIAL_LINKS.gmail.ariaLabel}
          className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#EA4335] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-slate-700/60 hover:scale-105"
        >
          <GmailIcon className="w-4 h-4" />
        </a>
      </div>
      {showLabels && (
        <div className="flex flex-col gap-1 text-[11px] text-slate-400">
          <a
            href={SOCIAL_LINKS.gmail.href}
            className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span>
            <span>passantnursing@gmail.com</span>
          </a>
        </div>
      )}
    </div>
  );
};
