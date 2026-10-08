import { MessageCircle, Zap, Store, Bot, Trophy, Dumbbell } from 'lucide-react';

export type Notif = { id: string; type: 'msg' | 'sys'; title: string; ago: string; icon: typeof Zap; dot: string };

export const NOTIFS: Notif[] = [
  { id: 'n1', type: 'msg', title: 'پیام جدید از مربی شما', ago: '۲ دقیقه پیش', icon: MessageCircle, dot: 'bg-accent' },
  { id: 'n2', type: 'sys', title: 'چالش روزانه', ago: '۲۰ دقیقه پیش', icon: Zap, dot: 'bg-primary' },
  { id: 'n3', type: 'sys', title: 'تخفیف ویژه فروشگاه کایوش', ago: '۱ ساعت پیش', icon: Store, dot: 'bg-orange-400' },
  { id: 'n4', type: 'msg', title: 'پاسخ بدن‌یار', ago: '۲ ساعت پیش', icon: Bot, dot: 'bg-accent' },
  { id: 'n5', type: 'sys', title: 'دستاورد جدید', ago: '۵ ساعت پیش', icon: Trophy, dot: 'bg-primary' },
  { id: 'n6', type: 'sys', title: 'یادآوری تمرین', ago: '۸ ساعت پیش', icon: Dumbbell, dot: 'bg-primary' },
];
