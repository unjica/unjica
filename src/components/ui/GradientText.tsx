import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  animate?: boolean;
  children: React.ReactNode;
}

export function GradientText({
  as: Component = 'h1',
  animate = true,
  className,
  children,
  ...props
}: GradientTextProps) {
  const baseStyle = "font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent";
  
  const motionProps: MotionProps = animate ? {
    animate: { y: [0, -8, 0] },
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    },
    whileHover: { 
      scale: 1.02,
      textShadow: "0 0 8px rgba(255,255,255,0.5)",
      transition: { duration: 0.2 }
    }
  } : {};

  return (
    <motion.div
      {...motionProps}
      className="relative"
    >
      <Component 
        className={cn(baseStyle, "relative z-10 cursor-default", className)}
        {...props}
      >
        {children}
      </Component>
      {animate && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 blur-xl -z-10"
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
} 