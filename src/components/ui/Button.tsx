import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gradient' | 'outline';
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'gradient', asChild = false, ...props }, ref) => {
    const baseStyles = "inline-flex items-center px-6 py-3 text-base font-medium text-white rounded-lg transition-all";
    
    const variants = {
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity",
      outline: "border border-purple-500 hover:bg-purple-500/10 transition-colors"
    };

    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(baseStyles, variants[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button'; 