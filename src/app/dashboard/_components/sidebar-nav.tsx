'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/cn';

import { SidebarNavItem, SidebarNavType } from '@/types/sidebar-type';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { ClipFromLeftAnimation } from '@/components/common/clip-from-left-animation';
import Tooltip from '@/components/common/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { includes } from 'lodash';

type SidebarNavProps = {
  className?: string;
  isCollapsed: boolean;
  currentPathname?: string;
  isSidebarShown?: boolean;
} & SidebarNavItem;

const SidebarNav: React.FC<SidebarNavProps> = (props) => {
  const [expandSubNavs, setExpandSubNavs] = React.useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const toggleExpandSubNav = () => {
    if (!props.isCollapsed) {
      setExpandSubNavs((pre) => !pre);
    }
  };

  const isActive = props.currentPathname?.includes(props.href as string);

  const Tag = !!props.subNav ? 'button' : Link;

  const linkProps = !!props.subNav
    ? {
        onClick: () => {
          toggleExpandSubNav();
        },
      }
    : { href: props.href, prefetch: false };

  const subNavHrefs: string[] = [];

  if (props.subNav) {
    props.subNav?.forEach(({ href }) => subNavHrefs.push(href as string));
  }

  // Check if any sub-navigation item is active
  const isSubNavActive = props.subNav?.some((nav) => props.currentPathname?.includes(nav.href as string));

  return (
    <>
      {/* Main Navigation Item */}
      {props.isCollapsed && props.subNav ? (
        // Collapsed state with sub-navigation - use Popover
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <button className={cn(['px-2 2xl:px-2.5', props.className])} tabIndex={0}>
              <Tooltip 
                trigger={
                  <span
                    className={cn([
                      'transition-all duration-300 relative rounded-md overflow-hidden line-clamp-1 flex items-center gap-5 cursor-pointer',
                      'py-2 px-2.5',
                      'after:absolute after:w-0.5 after:left-0 after:duration-200 after:rounded-md after:h-1/2 after:bg-primary',
                      isActive || isSubNavActive ? 'bg-component-active after:scale-x-100 text-primary-blue' : 'after:scale-x-0',
                      'w-11 2xl:w-12',
                      'hover:bg-accent-50 transition-colors duration-200',
                    ])}
                  >
                    {props.icon}
                  </span>
                } 
                side="right" 
                sideOffset={20}
              >
                {props.title}
              </Tooltip>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[12.5rem] bg-white-100 p-2"
            side="right"
            align="start"
            sideOffset={10}
          >
            <div className="flex flex-col">
              {props.subNav?.map((nav, idx) => (
                <Link
                  href={nav.href as string}
                  key={nav.title + idx}
                  className={cn([
                    'flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1 rounded-md transition-colors duration-200',
                    props.currentPathname?.includes(nav.href as string) && 'text-primary bg-primary-faded',
                  ])}
                  onClick={() => setIsPopoverOpen(false)}
                >
                  {nav.title}
                </Link>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ) : props.isCollapsed ? (
        // Collapsed state without sub-navigation - use Tooltip
        <Tooltip 
          trigger={
            {/* @ts-expect-error Tag is dynamic as it can be button or link */}
            <Tag {...linkProps} className={cn(['px-2 2xl:px-2.5', props.className])} tabIndex={0}>
              <span
                className={cn([
                  'transition-all duration-300 relative rounded-md overflow-hidden line-clamp-1 flex items-center gap-5 cursor-pointer',
                  'py-2 px-2.5',
                  'after:absolute after:w-0.5 after:left-0 after:duration-200 after:rounded-md after:h-1/2 after:bg-primary',
                  isActive ? 'bg-component-active after:scale-x-100 text-primary-blue' : 'after:scale-x-0',
                  'w-11 2xl:w-12',
                  'hover:bg-accent-50 transition-colors duration-200',
                ])}
              >
                {props.icon}
              </span>
            </Tag>
          } 
          side="right" 
          sideOffset={20}
        >
          {props.title}
        </Tooltip>
      ) : (
        // Expanded state
        {/* @ts-expect-error Tag is dynamic as it can be button or link */}
        <Tag {...linkProps} className={cn(['px-2 2xl:px-2.5', props.className])} tabIndex={0}>
          <span
            className={cn([
              'transition-all duration-300 relative rounded-md overflow-hidden line-clamp-1 flex items-center gap-5 cursor-pointer',
              'py-2 px-2.5',
              'after:absolute after:w-0.5 after:left-0 after:duration-200 after:rounded-md after:h-1/2 after:bg-primary',
              isActive || isSubNavActive ? 'bg-component-active after:scale-x-100 text-primary-blue' : 'after:scale-x-0',
              'hover:bg-accent-50 transition-colors duration-200',
            ])}
          >
            {props.icon}

            <ClipFromLeftAnimation
              show={!props.isCollapsed}
              className={`text-b1-b overflow-hidden truncate line-clamp-1 text-content-subtitle ${
                isActive || isSubNavActive ? 'text-accent-700' : ''
              }`}
            >
              {props.title}
            </ClipFromLeftAnimation>

            {/* render chevron if has sub nav items */}
            {!!props.subNav && (
              <ChevronDown
                className={cn([
                  'absolute z-10 -translate-y-1/2 top-1/2 duration-200 stroke-[.0625rem]',
                  'h-5 w-5 right-2.5',
                  expandSubNavs ? 'rotate-180' : 'rotate-0',
                ])}
              />
            )}
          </span>
        </Tag>
      )}

      {/* Sub-navigation for expanded state */}
      {!props.isCollapsed && !!props.subNav && (
        <SubNavigations
          setIsExpanded={setExpandSubNavs}
          isExpanded={expandSubNavs}
          currentPathname={props.currentPathname}
          subNavItems={props.subNav}
        />
      )}
    </>
  );
};

interface SubNavigationsProps {
  isExpanded?: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  subNavItems: Array<SidebarNavType>;
  currentPathname?: string;
  className?: string;
}

const SubNavigations: React.FC<SubNavigationsProps> = (props) => {
  // on close subnavs, set isExpanded to false
  React.useEffect(() => {
    return () => {
      props.setIsExpanded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {props.isExpanded && (
        <motion.ul
          initial={{ height: '0px' }}
          animate={{ height: 'auto' }}
          exit={{ height: '0px' }}
          transition={{
            duration: 0.2,
            ease: 'linear',
          }}
          className={cn([
            'overflow-hidden shrink-0 ml-7 2xl:ml-8 border-l border-l-stroke-divider',
            'px-2.5',
            props.className,
          ])}
        >
          {props.subNavItems.map((nav, i) => {
            return (
              <li key={(nav.href as string) + i}>
                <Link
                  href={nav.href as string}
                  prefetch={false}
                  className={cn([
                    i === 0 ? 'mt-0' : 'mt-1',
                    'block relative text-b1 px-2 py-1.5 ms-3 rounded hover:bg-primary-faded transition-colors duration-200',
                    'after:absolute after:top-1/2 after:left-0 after:bg-primary after:rounded-lg after:w-0.5 after:translate-y-[-50%] after:h-[70%] after:transition-transform after:duration-200',
                    props.currentPathname === nav.href
                      ? 'after:scale-y-100 bg-primary-faded text-accent-700'
                      : 'after:scale-y-0',
                  ])}
                >
                  {nav.title}
                </Link>
              </li>
            );
          })}
        </motion.ul>
      )}
    </AnimatePresence>
  );
};

export { SidebarNav };