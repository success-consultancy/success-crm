'use client';

import React from 'react';
import clsx from 'clsx';

interface TabItem {
  label: string;
  value: string;
}

interface TabsMenuProps {
  items: TabItem[];
  active: string;
  onChange: (value: string) => void;
}

const TabsMenu: React.FC<TabsMenuProps> = ({ items, active, onChange }) => {
  return (
    <div className="flex space-x-4 border-b">
      {items.map((item) => {
        const isActive = item.value === active;

        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={clsx(
              'px-3 py-2 text-sm font-medium focus:outline-none cursor-pointer',
              isActive ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabsMenu;
