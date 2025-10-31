import { Button, extendVariants } from '@heroui/react'

export const NavButton = extendVariants(Button, {
  variants: {
    variant: {
      nav: {
        base: [
          'font-semibold',
          'tracking-wide',
          'px-4',
          'justify-start',
          'text-left',
          'shadow-lg',
          'shadow-secondary/45',
          'bg-secondary',
          'text-secondary-foreground',
          'transition-transform-colors',
          'data-[hover=true]:shadow-secondary/60',
          'data-[hover=true]:bg-secondary/95',
          'data-[hover=true]:-translate-y-0.5',
          'data-[pressed=true]:translate-y-0',
          'data-[focus-visible=true]:outline-none',
          'data-[focus-visible=true]:ring-2',
          'data-[focus-visible=true]:ring-secondary/60',
          'data-[focus-visible=true]:ring-offset-2',
          'data-[focus-visible=true]:ring-offset-background',
        ],
        content: [
          'justify-start',
          'text-left',
          'gap-2',
        ],
      },
    },
  },
  defaultVariants: {
    variant: 'nav',
    radius: 'md',
    size: 'sm',
    color: 'secondary',
  },
})
