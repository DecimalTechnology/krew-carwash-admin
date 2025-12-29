export interface NotificationType {
  _id: string;
  type: 'BOOKING' | 'PAYMENT' | 'ISSUE_REPORT' | string;
  title: string;
  message?: string;
  bookingId?: string;
  isRead: boolean;
  createdAt: string;
  [key: string]: any;
}

export interface NotificationTypeInfo {
  icon: React.ReactNode;
  iconBg: string;
  badgeBg: string;
  badgeColor: string;
  badgeIcon: React.ReactNode;
  label: string;
}

export interface InstagramNotificationItemProps {
  notification: NotificationType;
  onMarkAsRead: (id: string, currentStatus: boolean) => void;
}

export interface NotificationStoriesProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface StatsBarProps {
  notifications: NotificationType[];
  unreadCount: number;
}