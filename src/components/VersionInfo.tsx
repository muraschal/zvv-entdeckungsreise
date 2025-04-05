import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface VersionInfoProps {
  className?: string;
}

export function VersionInfo({ className }: VersionInfoProps) {
  return (
    <div className={cn(
      'fixed bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm px-3 py-2 flex flex-col gap-1 border border-gray-200',
      className
    )}>
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-gray-400" />
        <div className="text-xs font-medium text-gray-600">
          Integration | 15.2.24 | 15.4.2025
        </div>
      </div>
      <div className="text-[10px] text-gray-500 pl-6">
        Next.js 14.1.0 • Supabase SSR 0.6.1 • Resend 4.2.0
      </div>
    </div>
  );
} 