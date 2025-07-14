

import { cn } from '@/lib/utils';
import React, { useState } from 'react';

type Tab = {
  label: string;
  key: string;
}

type TabSelectorType = { activeTab: string; onTabChange: (tabKey: string) => void, tabs: Array<Tab>; className?: string }


const TabSelector = ({ activeTab, onTabChange, tabs, className }: TabSelectorType) => {
  return (
    <div className={cn("border-b flex gap-2", className)}>
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={cn(
            'px-4 py-2 transition delay-150 duration-300 ease-in-out transition-colors border-b-2 border-b-transparent',
            activeTab === key ? 'bg-primary border-b-[#007ACC] border-b-2 text-bolder text-b3-b' : 'hover:bg-gray-100 text-b1-b',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TabSelector
