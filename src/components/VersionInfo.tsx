import { cn } from '@/lib/utils';

interface VersionInfoProps {
  className?: string;
}

export function VersionInfo({ className }: VersionInfoProps) {
  return (
    <div className={cn('fixed bottom-2 right-2 text-xs text-gray-500', className)}>
      <div>Next.js 14.1.0 | Supabase SSR 0.6.1 | Resend 4.2.0</div>
    </div>
  );
} 