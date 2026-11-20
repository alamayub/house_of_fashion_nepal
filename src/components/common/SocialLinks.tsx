import { ArrowUpRight } from 'lucide-react';
import {
  AGENCY_SOCIAL_CHANNELS,
  type SocialPlatformId,
} from '../../constants/socialLinks.ts';

function SocialPlatformIcon({
  id,
  className = 'w-4 h-4',
}: {
  id: SocialPlatformId;
  className?: string;
}) {
  switch (id) {
    case 'facebook':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={className}
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={className}
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case 'youtube':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={className}
        >
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3v6Z" />
        </svg>
      );
    case 'x':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={className}
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
  }
}

interface SocialLinksProps {
  variant?: 'list' | 'tiles' | 'icons';
  tone?: 'dark' | 'light';
  className?: string;
}

export function SocialLinks({
  variant = 'list',
  tone = 'dark',
  className = '',
}: SocialLinksProps) {
  if (variant === 'icons') {
    const iconBoxClass =
      tone === 'dark'
        ? 'border-white/15 text-[#FAF8F4]/80 hover:border-[#B6A48D] hover:text-[#B6A48D]'
        : 'border-[#101010]/20 text-[#101010]/80 hover:border-[#632B37] hover:text-[#632B37]';

    return (
      <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
        {AGENCY_SOCIAL_CHANNELS.map((channel) => (
          <a
            key={channel.id}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={channel.ariaLabel}
            title={channel.name}
            className={`w-9 h-9 border inline-flex items-center justify-center transition-colors ${iconBoxClass}`}
          >
            <SocialPlatformIcon id={channel.id} className="w-4 h-4" />
          </a>
        ))}
      </div>
    );
  }

  if (variant === 'tiles') {
    const tileClass =
      tone === 'dark'
        ? 'border-white/15 bg-white/5 text-[#FAF8F4] hover:border-[#B6A48D] hover:text-[#B6A48D]'
        : 'border-[#101010]/15 bg-[#F5F1EA] text-[#101010] hover:border-[#632B37] hover:text-[#632B37]';

    return (
      <div className={`grid grid-cols-2 gap-2.5 ${className}`}>
        {AGENCY_SOCIAL_CHANNELS.map((channel) => (
          <a
            key={channel.id}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={channel.ariaLabel}
            className={`group flex items-center justify-between gap-2 px-3 py-2.5 border text-xs transition-colors ${tileClass}`}
          >
            <span className="inline-flex items-center gap-2 min-w-0">
              <SocialPlatformIcon id={channel.id} className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate font-medium">{channel.name}</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    );
  }

  const linkClass =
    tone === 'dark'
      ? 'text-[#FAF8F4]/80 hover:text-[#B6A48D]'
      : 'text-[#101010]/80 hover:text-[#632B37]';

  return (
    <ul className={`space-y-2.5 text-sm ${className}`}>
      {AGENCY_SOCIAL_CHANNELS.map((channel) => (
        <li key={channel.id}>
          <a
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={channel.ariaLabel}
            className={`group inline-flex items-center gap-2 transition-colors ${linkClass}`}
          >
            <SocialPlatformIcon
              id={channel.id}
              className="w-3.5 h-3.5 shrink-0 opacity-75 group-hover:opacity-100"
            />
            <span>{channel.name}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>
        </li>
      ))}
    </ul>
  );
}
