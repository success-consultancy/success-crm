"use client";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/cn";

import { SidebarNavItem, SidebarNavType } from "@/types/sidebar-type";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ClipFromLeftAnimation } from "@/components/common/clip-from-left-animation";

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

  const isActive = props.currentPathname === props.href;

  const Tag = !!props.subNav ? "button" : Link;
  const Icon = props.icon;

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
        {/* <NavItemTooltip
          disabled={
            !!props.subNavItems ||
            props.title === "Notifications" ||
            !props.isCollapsed
          }
          tip={props.title}
        > */}
        <span
          className={cn([
            "transition-all duration-300 relative rounded-md overflow-hidden line-clamp-1 flex items-center gap-5 cursor-pointer",
            "py-[0.4375rem] px-2.5",
            "after:absolute after:w-0.5 after:left-0 after:duration-200 after:rounded-md after:h-1/2 after:bg-accent-600",
            isActive
              ? "bg-accent-50 after:scale-x-100 text-accent-700"
              : "after:scale-x-0",
            props.isCollapsed && "w-11  2xl:w-12",
            "hover:bg-accent-50",
          ])}
        >
          <Icon className="w-5.5 h-5.5 2xl:w-6.5 2xl:h-6.5 text-center shrink-0 stroke-[.0938rem]" />

          <ClipFromLeftAnimation
            show={!props.isCollapsed}
            className={`text-b1 overflow-hidden truncate line-clamp-1 text-content-subtitle ${
              isActive && "text-accent-700"
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

      {/* divider */}
      {/* {props.hasDivider && (
        <Separator
          orientation="horizontal"
          className="my-0.5 w-[90%] mx-auto"
          dark
        />
      )} */}
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
                    "block relative text-b1 px-2 py-1.5 ms-3 rounded hover:bg-accent-50",
                    "after:absolute after:top-1/2 after:left-0 after:bg-accent-600 after:rounded-lg after:w-0.5 after:translate-y-[-50%] after:h-[70%]",
                    props.currentPathname === nav.href
                      ? "after:scale-y-100 bg-accent-50 text-accent-700"
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

