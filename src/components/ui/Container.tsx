import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animate?: boolean;
}

export function Container({ 
  children, 
  className,
  animate = true,
  ...props 
}: ContainerProps) {
  const baseStyles = "max-w-2xl mx-auto text-center z-10";
  
  const content = (
    <div
      className={cn(baseStyles, className)}
      {...props}
    >
      {children}
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="px-3"
    >
      {content}
    </motion.div>
  );
} 