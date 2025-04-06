"use client";

import { cn } from '@/lib/utils';
import { Info, Github } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  const [isIntegrationEnv, setIsIntegrationEnv] = useState(false);
  
  useEffect(() => {
    // Überprüfe die Umgebung anhand der Hostname-Endung
    const hostname = window.location.hostname;
    const isInt = hostname.includes('localhost') || 
                hostname.includes('vercel.app') || 
                hostname.includes('-int') || 
                hostname === 'entdeckungsreise-int.zvv.ch';
    
    setIsIntegrationEnv(isInt);
  }, []);

  return (
    <div className={cn(
      'fixed bottom-2 right-2 backdrop-blur-sm rounded-lg shadow-sm px-3 py-2 flex flex-col gap-1 border',
      isIntegrationEnv ? 'bg-zvv-integration-light-red/30 border-zvv-integration-red text-zvv-integration-red' : 'bg-zvv-light-blue/30 border-zvv-blue text-zvv-blue',
      className
    )}>
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4" />
        <div className="text-xs font-medium">
          {isIntegrationEnv ? 'Integration' : 'Produktion'} | {GIT_COMMIT_DATE}
        </div>
        <Link 
          href={`https://github.com/muraschal/zvv-entdeckungsreise/commit/${GIT_COMMIT_SHA}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-black"
        >
          <Github className="w-4 h-4" />
        </Link>
      </div>
      <div className="text-[10px] pl-6 space-x-2 opacity-90">
        <Link href={CHANGELOG_LINKS.nextjs} target="_blank" rel="noopener noreferrer" className="hover:text-black">
          Next.js 15.2.4
        </Link>
        •
        <Link href={CHANGELOG_LINKS.supabase} target="_blank" rel="noopener noreferrer" className="hover:text-black">
          Supabase SSR 0.6.1
        </Link>
        •
        <Link href={CHANGELOG_LINKS.resend} target="_blank" rel="noopener noreferrer" className="hover:text-black">
          Resend 4.2.0
        </Link>
      </div>
    </div>
  );
} 