import { useParams } from 'react-router-dom';
import { MessagesSquare } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { RequireAuth } from '../components/ui-kit';
import ConversationList from '../components/chat/ConversationList';
import Thread from '../components/chat/Thread';

export default function MessagesPage() {
  return <RequireAuth title="برای دیدن پیام‌ها وارد شوید"><Inner /></RequireAuth>;
}

function Inner() {
  const { id } = useParams();
  return (
    <div className="glass grid h-[calc(100dvh-12rem)] min-h-[480px] overflow-hidden rounded-3xl md:h-[calc(100dvh-8rem)] md:grid-cols-[320px_1fr]">
      <aside className={cn('border-l border-border', id && 'hidden md:block')}>
        <div className="border-b border-border px-4 py-3 text-lg font-black">پیام‌ها</div>
        <div className="h-[calc(100%-3.25rem)]"><ConversationList activeId={id} /></div>
      </aside>
      <section className={cn('min-w-0', !id && 'hidden md:block')}>
        {id ? <Thread key={id} id={id} /> : (
          <div className="grid h-full place-items-center text-center text-muted-foreground">
            <div><MessagesSquare className="mx-auto mb-3 h-10 w-10 text-primary" />یک گفتگو را انتخاب کنید</div>
          </div>
        )}
      </section>
    </div>
  );
}
