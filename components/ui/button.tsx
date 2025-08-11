import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 no-tap-highlight [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-500 text-white shadow-premium button-premium active:scale-[0.98] active:shadow-premium-lg",
        destructive:
          "bg-error text-white shadow-premium button-premium active:scale-[0.98] active:shadow-premium-lg",
        outline:
          "border border-border bg-card touch-feedback shadow-sm active:shadow-premium active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm touch-feedback active:shadow-premium active:scale-[0.98]",
        ghost: 
          "touch-feedback active:scale-[0.95]",
        link: 
          "text-primary underline-offset-4 active:underline touch-feedback",
        premium:
          "premium-gradient text-white shadow-glow button-premium active:scale-[0.98] active:shadow-glow-strong border-0",
        gradient:
          "gradient-emerald text-white shadow-premium button-premium active:scale-[0.98] active:shadow-premium-lg",
        glass:
          "glass-effect text-foreground shadow-premium button-premium active:glass-effect-strong active:shadow-premium-lg active:scale-[0.98]"
      },
      size: {
        default: "h-11 px-6 py-2.5 text-sm min-w-[44px]",
        sm: "h-9 px-4 py-2 text-sm min-w-[36px]",
        lg: "h-12 px-8 py-3 text-base min-w-[48px]",
        xl: "h-14 px-10 py-4 text-lg min-w-[56px]",
        icon: "h-11 w-11 min-w-[44px]",
        "icon-sm": "h-9 w-9 min-w-[36px]",
        "icon-lg": "h-12 w-12 min-w-[48px]"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Add desktop hover effects for larger screens
    const desktopHoverClass = React.useMemo(() => {
      switch (variant) {
        case 'default':
        case 'destructive':
        case 'premium':
        case 'gradient':
          return 'xl:hover:translate-y-[-1px] xl:hover:shadow-premium-lg xl:active:translate-y-0';
        case 'outline':
        case 'secondary':
          return 'xl:hover:bg-card-hover xl:hover:border-border-hover xl:hover:shadow-premium';
        case 'ghost':
          return 'xl:hover:bg-primary-soft xl:hover:text-primary';
        case 'link':
          return 'xl:hover:underline xl:hover:text-primary-hover';
        case 'glass':
          return 'xl:hover:glass-effect-strong xl:hover:shadow-premium-lg xl:hover:translate-y-[-1px]';
        default:
          return '';
      }
    }, [variant]);
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), desktopHoverClass, className)}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }