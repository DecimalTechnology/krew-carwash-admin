import React from 'react';
import { Bell, Calendar, DollarSign, AlertCircle, Filter } from 'lucide-react';
import { NotificationStoriesProps } from '../../interface/INotification';


const NotificationStories: React.FC<NotificationStoriesProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'BOOKING':
        return <Calendar size={18} />;
      case 'PAYMENT':
        return <DollarSign size={18} />;
      case 'ISSUE_REPORT':
        return <AlertCircle size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="sticky top-[73px] z-40 bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => onTabChange('ALL')}
          className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl transition-all ${
            activeTab === 'ALL'
              ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/20'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
          }`}
        >
          <Bell size={18} />
          <span className="font-medium">All</span>
        </button>

        {tabs?.map(
          (tab) =>
            tab !== 'ALL' && (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                {getTabIcon(tab)}
                <span className="font-medium">{tab.replace('_', ' ')}</span>
              </button>
            )
        )}

        <button className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md transition-all">
          <Filter size={18} />
          <span className="font-medium">Filter</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationStories;