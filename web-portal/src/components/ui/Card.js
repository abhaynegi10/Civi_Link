import { cn } from '@/lib/utils';

export default function Card({ children, className, hoverable = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm',
        hoverable &&
          'transition-all duration-200 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
