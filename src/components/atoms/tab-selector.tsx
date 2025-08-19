import { cn } from '@/lib/utils';
import React, { useState } from 'react';

type Tab = {
  label: string;
  key: string;
  count?: number;
};

type TabSelectorType = {
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  tabs: Array<Tab>;
  className?: string;
  btnClassName?: string;
};

const TabSelector = ({ activeTab, onTabChange, tabs, className, btnClassName }: TabSelectorType) => {
  return (
    <div className={cn('border-b flex gap-2', className)}>
      {tabs.map(({ key, label, count }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={cn(
            'px-4 py-2 transition delay-150 duration-300 ease-in-out transition-colors border-b-2 border-b-transparent',
            btnClassName,
            activeTab === key
              ? 'border-b-[#007ACC] border-b-2 text-bolder text-b3-b'
              : 'hover:bg-gray-100 text-b1-b cursor-pointer',
          )}
        >
          {label}
          {count && <span className="px-2 py-[2px] rounded-full bg-blue-extra-light ml-1">{count}</span>}
        </button>
      ))}
    </div>
  );
};

export default TabSelector;
