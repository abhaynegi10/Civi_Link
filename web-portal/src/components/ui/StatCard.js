import { cn } from '@/lib/utils';

export default function StatCard({ label, value, icon: Icon, accentColor = 'blue', className }) {
  const accents = {
    blue: 'border-l-blue-500 text-blue-600 dark:text-blue-400',
    amber: 'border-l-amber-500 text-amber-600 dark:text-amber-400',
    emerald: 'border-l-emerald-500 text-emerald-600 dark:text-emerald-400',
    purple: 'border-l-purple-500 text-purple-600 dark:text-purple-400',
  };

  const [borderClass, textClass] = (accents[accentColor] || accents.blue).split(' text-');

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 border-l-4 shadow-sm',
        borderClass,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">{label}</p>
          <p className={cn('text-3xl font-bold', `text-${textClass}`)}>{value}</p>
        </div>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-slate-800">
            <Icon size={22} className="text-gray-400 dark:text-slate-500" />
          </div>
        )}
      </div>
    </div>
  );
}
