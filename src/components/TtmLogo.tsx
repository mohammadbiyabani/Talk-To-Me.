import React from 'react';

interface TtmLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const TtmLogo: React.FC<TtmLogoProps> = ({ 
  size = 'md', 
  showText = false, 
  className = '' 
}) => {
  const dimensionMap = {
    sm: { box: 'w-7 h-7', text: 'text-xs', shield: 28 },
    md: { box: 'w-10 h-10', text: 'text-base', shield: 40 },
    lg: { box: 'w-14 h-14', text: 'text-xl', shield: 56 },
    xl: { box: 'w-20 h-20', text: 'text-3xl', shield: 80 }
  };

  const dim = dimensionMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* TTM Shield Badge */}
      <div className={`relative ${dim.box} flex items-center justify-center rounded-xl bg-slate-950 border border-emerald-500/40 shadow-lg shadow-emerald-500/20 group select-none`}>
        {/* Glow ambient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-teal-500/5 rounded-xl blur-[2px]" />
        
        {/* SVG Shield Icon with TTM Monogram */}
        <svg 
          viewBox="0 0 100 115" 
          className="w-4/5 h-4/5 relative z-10 filter drop-shadow-[0_2px_6px_rgba(16,185,129,0.5)]"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="10" y1="5" x2="90" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="shieldBorder" x1="0" y1="0" x2="100" y2="115" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="textGrad" x1="20" y1="35" x2="80" y2="75" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>
          </defs>

          {/* Shield Outline Path */}
          <path 
            d="M50 5 L88 20 C88 65 65 96 50 110 C35 96 12 65 12 20 Z" 
            fill="url(#shieldGrad)" 
            fillOpacity="0.25"
            stroke="url(#shieldBorder)" 
            strokeWidth="4" 
            strokeLinejoin="round" 
          />

          {/* Inner Accent Path */}
          <path 
            d="M50 14 L80 26 C80 62 60 88 50 99 C40 88 20 62 20 26 Z" 
            stroke="#10b981" 
            strokeWidth="1.5" 
            strokeOpacity="0.4"
            strokeDasharray="3 3"
          />

          {/* Bold Monogram "TTM" */}
          <text 
            x="50" 
            y="65" 
            textAnchor="middle" 
            fill="url(#textGrad)" 
            fontSize="26" 
            fontWeight="900" 
            letterSpacing="-1"
            fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          >
            TTM
          </text>

          {/* Security Keyhole / Lock Pin Dot */}
          <circle cx="50" cy="79" r="3.5" fill="#34d399" />
          <path d="M48.5 79 L47 88 L53 88 L51.5 79 Z" fill="#34d399" />
        </svg>

        {/* Outer Corner Accents */}
        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-emerald-400/80 rounded-tl-[2px]" />
        <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-emerald-400/80 rounded-br-[2px]" />
      </div>

      {/* Brand Title (Optional) */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-white ${dim.text}`}>
              Talk To Me
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider">
              TTM
            </span>
          </div>
          <span className="text-[10px] text-emerald-500/80 font-medium tracking-wide">
            Zero-Knowledge Mobile E2EE
          </span>
        </div>
      )}
    </div>
  );
};
