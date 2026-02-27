import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type ClassValue } from "class-variance-authority/types";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-md text-sm font-bold",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    "uppercase tracking-widest",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary)]/90 focus-visible:ring-[var(--color-ring)] ring-offset-[var(--color-bg)]",
        digital:
          "bg-[var(--digital-cyan)] text-[var(--tech-slate)] hover:bg-[var(--digital-cyan)]/90 hover:shadow-[0_0_20px_rgba(0,255,229,0.35)] focus-visible:ring-[var(--digital-cyan)] ring-offset-[var(--color-bg)]",
        analog:
          "bg-transparent text-[var(--analog-amber)] border-2 border-[var(--analog-amber)] hover:bg-[var(--analog-amber)] hover:text-[var(--tech-slate)] focus-visible:ring-[var(--analog-amber)] ring-offset-[var(--color-bg)]",
        outline:
          "bg-transparent text-[var(--color-fg)] border-2 border-[var(--color-border)] hover:border-[var(--color-fg)] hover:bg-[var(--color-surface-2)] focus-visible:ring-[var(--color-ring)] ring-offset-[var(--color-bg)]",
        ghost:
          "bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-surface-2)] focus-visible:ring-[var(--color-ring)] ring-offset-[var(--color-bg)]",
        link:
          "bg-transparent text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:ring-[var(--color-ring)] ring-offset-[var(--color-bg)]",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 text-sm",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };