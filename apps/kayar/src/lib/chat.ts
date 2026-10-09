import { useQuery } from '@tanstack/react-query';
import { useAuth } from 'zitejs/auth';
import { listConversations, getMessages } from 'zitejs/api';

/** Polling keeps chats near-real-time; react-query pauses it in background tabs and refetches on reconnect/focus. */
export function useConversations() {
  const { user } = useAuth();
  return useQuery({ queryKey: ['conversations'], queryFn: () => listConversations({}), enabled: !!user, refetchInterval: 10_000 });
}

export function useThread(id?: string) {
  return useQuery({ queryKey: ['thread', id], queryFn: () => getMessages({ conversationId: id! }), enabled: !!id, refetchInterval: 3_000 });
}

export const timeFa = (iso: string) => new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
export function relFa(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso); const today = new Date();
  return d.toDateString() === today.toDateString() ? timeFa(iso) : d.toLocaleDateString('fa-IR-u-ca-persian', { month: 'short', day: 'numeric' });
}
