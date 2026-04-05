import { Inbox } from 'lucide-react';
export default function EmptyState({ title = 'No data found', description = 'Try adjusting your filters.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-section flex items-center justify-center mb-4">
        <Inbox size={28} className="text-muted" />
      </div>
      <h3 className="font-headline font-bold text-lg text-display mb-1">{title}</h3>
      <p className="text-sm text-sub">{description}</p>
    </div>
  );
}
