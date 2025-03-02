import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gradient' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'gradient', size = 'md', asChild = false, ...props }, ref) => {
    const baseStyles = "inline-flex items-center font-medium text-white rounded-lg transition-all";
    
    const variants = {
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity",
      outline: "border border-purple-500 hover:bg-purple-500/10 transition-colors text-purple-500 dark:text-purple-400"
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-md",
      md: "px-6 py-3 text-base rounded-lg",
      lg: "px-8 py-4 text-lg rounded-xl"
    };

    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button'; 