import { cn } from '@/lib/utils';
import { Info, Github } from 'lucide-react';
import Link from 'next/link';

interface VersionInfoProps {
  className?: string;
}

// Das Build-Datum wird zur Build-Zeit gesetzt
const BUILD_DATE = process.env.NEXT_PUBLIC_BUILD_DATE || '15.02.24';
const GIT_COMMIT_DATE = process.env.NEXT_PUBLIC_GIT_COMMIT_DATE || BUILD_DATE;
const GIT_COMMIT_SHA = process.env.NEXT_PUBLIC_GIT_COMMIT_SHA || 'main';

// Links zu den Changelogs
const CHANGELOG_LINKS = {
  nextjs: 'https://github.com/vercel/next.js/releases/tag/v15.2.4',
  supabase: 'https://github.com/supabase/auth-helpers/releases/tag/v0.6.1',
  resend: 'https://github.com/resend/resend-node/releases/tag/v4.2.0'
} as const;

export function VersionInfo({ className }: VersionInfoProps) {
  return (
    <div className={cn(
      'fixed bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm px-3 py-2 flex flex-col gap-1 border border-gray-200',
      className
    )}>
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-gray-400" />
        <div className="text-xs font-medium text-gray-600">
          Integration | {GIT_COMMIT_DATE}
        </div>
        <Link 
          href={`https://github.com/muraschal/zvv-entdeckungsreise/commit/${GIT_COMMIT_SHA}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-800"
        >
          <Github className="w-4 h-4" />
        </Link>
      </div>
      <div className="text-[10px] text-gray-500 pl-6 space-x-2">
        <Link href={CHANGELOG_LINKS.nextjs} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
          Next.js 15.2.4
        </Link>
        •
        <Link href={CHANGELOG_LINKS.supabase} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
          Supabase SSR 0.6.1
        </Link>
        •
        <Link href={CHANGELOG_LINKS.resend} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
          Resend 4.2.0
        </Link>
      </div>
    </div>
  );
} 