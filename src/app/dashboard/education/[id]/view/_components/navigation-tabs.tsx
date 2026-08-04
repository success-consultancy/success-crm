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
  /** Right-aligned actions rendered on the same row as the tabs. */
  actions?: React.ReactNode;
}

const TabsMenu: React.FC<TabsMenuProps> = ({ items, active, onChange, actions }) => {
  return (
    <div className="sticky top-0 z-10 -mx-4 -mt-4 rounded-t-lg bg-white px-4 pt-4 flex items-center border-b">
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

      {actions && <div className="ml-auto pb-1">{actions}</div>}
    </div>
  );
};

export default TabsMenu;
