import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface VersionInfoProps {
  className?: string;
}

export function VersionInfo({ className }: VersionInfoProps) {
  return (
    <div className={cn(
      'fixed bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm px-3 py-2 flex items-center gap-2 border border-gray-200',
      className
    )}>
      <Info className="w-4 h-4 text-gray-400" />
      <div className="text-xs font-medium space-x-2 text-gray-600">
        <span>Integration | 15.2.24 | 15.4.2025</span>
      </div>
    </div>
  );
} 