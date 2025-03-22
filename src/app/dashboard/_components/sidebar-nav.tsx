"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/cn";

import { SidebarNavItem, SidebarNavType } from "@/types/sidebar-type";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ClipFromLeftAnimation } from "@/components/common/clip-from-left-animation";
import Tooltip from "@/components/common/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { includes } from "lodash";

type SidebarNavProps = {
  className?: string;
  isCollapsed: boolean;
  currentPathname?: string;
  isSidebarShown?: boolean;
  //   onSetNewActiveIndex: () => void;
  //   onClearActiveIndex: () => void;
  //   onClearNewSidebarItemIndex: () => void;
  //   isActiveIndex: boolean;
} & SidebarNavItem;

const SidebarNav: React.FC<SidebarNavProps> = (props) => {
  const [expandSubNavs, setExpandSubNavs] = React.useState(false);

  const toggleExpandSubNav = () => {
    setExpandSubNavs((pre) => !pre);
  };

  const isActive = props.currentPathname?.includes(props.href as string);

  const Tag = !!props.subNav ? "button" : Link;

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

  return (
    <>
      {/* @ts-expect-error Tag is dynamic as it can be button or link */}

      <Tag
        {...linkProps}
        className={cn(["px-2 2xl:2.5", props.className])}
        tabIndex={0}
      >
        <span
          className={cn([
            "transition-all duration-300 relative rounded-md overflow-hidden line-clamp-1 flex items-center gap-5 cursor-pointer",
            "py-2 px-2.5",
            "after:absolute after:w-0.5 after:left-0 after:duration-200 after:rounded-md after:h-1/2 after:bg-primary",
            isActive
              ? "bg-component-active after:scale-x-100 text-primary-blue"
              : "after:scale-x-0",
            props.isCollapsed && "w-11 2xl:w-12 ",
            "hover:bg-accent-50",
          ])}
        >
          <Popover>
            <PopoverTrigger asChild>
              {!props.subNav ? (
                <Tooltip
                  trigger={props.icon}
                  side="right"
                  sideOffset={20}
                  hidden={!props.isCollapsed}
                >
                  {props.title}
                </Tooltip>
              ) : (
                props.icon
              )}
            </PopoverTrigger>
            <PopoverContent
              className="w-[12.5rem] bg-white-100 p-2"
              hidden={!props.subNav}
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
                      "flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1 ",
                      props.currentPathname?.includes(nav.href as string) &&
                        "text-primary bg-primary-faded  ",
                    ])}
                  >
                    {nav.title}
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <ClipFromLeftAnimation
            show={!props.isCollapsed}
            className={`text-b1-b overflow-hidden truncate line-clamp-1 text-content-subtitle ${
              isActive && "text-accent-700 "
            }`}
          >
            {props.title}
          </ClipFromLeftAnimation>

          {/* render chevron if has sub nav items */}
          {!!props.subNav && (
            <ChevronDown
              className={cn([
                "absolute z-10 -translate-y-1/2 top-1/2 duration-200 stroke-[.0625rem]",
                props.isCollapsed
                  ? "-rotate-90 hidden right-0 w-3 h-3 "
                  : [
                      "h-5 w-5 right-2.5",
                      expandSubNavs ? "rotate-180" : "rotate-0",
                    ],
              ])}
            />
          )}

          {/* popover sub navigations menu for collapsed state */}
        </span>
        {/* </NavItemTooltip> */}
      </Tag>

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
          initial={{ height: "0px" }}
          animate={{ height: "auto" }}
          exit={{ height: "0px" }}
          transition={{
            duration: 0.2,
            ease: "linear",
          }}
          className={cn([
            "overflow-hidden shrink-0 ml-7 2xl:ml-8 border-l border-l-stroke-divider",
            "px-2.5",
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
                    i === 0 ? "mt-0" : "mt-1",
                    "block relative text-b1 px-2 py-1.5 ms-3 rounded hover:bg-primary-faded",
                    "after:absolute after:top-1/2 after:left-0 after:bg-primary after:rounded-lg after:w-0.5 after:translate-y-[-50%] after:h-[70%]",
                    props.currentPathname === nav.href
                      ? "after:scale-y-100 bg-primary-faded text-accent-700"
                      : "after:scale-y-0",
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

