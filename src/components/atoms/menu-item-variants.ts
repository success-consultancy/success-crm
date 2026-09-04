import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Menu item states/sizes from the CRM design file ("menu item" component set).
 * States: default | hovered | active | disabled — hovered is handled by the
 * `hover:` modifier on the default state, so callers only pick default/active/disabled.
 */
export const menuItemVariants = cva(
  'flex w-full items-center whitespace-nowrap rounded-[4px] px-2 tracking-[-0.01em] leading-normal text-neutral-black transition-colors cursor-pointer select-none text-b14-500',
  {
    variants: {
      size: {
        large: 'h-10 gap-3',
        medium: 'h-9 gap-2.5',
        small: 'h-8 gap-2.5',
      },
      state: {
        default: 'bg-transparent hover:bg-component-hovered-light',
        active: 'bg-component-active text-primary hover:bg-component-active text-b14-600',
        disabled: 'pointer-events-none cursor-not-allowed opacity-50',
      },
    },
    defaultVariants: {
      size: 'large',
      state: 'default',
    },
  },
);

/** Leading/trailing icon size per menu item size, per the design file. */
export const menuItemIconSize = {
  large: 20,
  medium: 16,
  small: 16,
} as const;

export type MenuItemSize = keyof typeof menuItemIconSize;
export type MenuItemVariantProps = VariantProps<typeof menuItemVariants>;

/** Resolves the item's visual state from its active/disabled flags. */
export const getMenuItemState = (
  isActive?: boolean,
  isDisabled?: boolean,
): NonNullable<MenuItemVariantProps['state']> => (isDisabled ? 'disabled' : isActive ? 'active' : 'default');
