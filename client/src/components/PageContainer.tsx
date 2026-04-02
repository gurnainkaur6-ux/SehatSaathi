import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "flex flex-col w-full bg-background relative",
        // Mobile: full screen with bottom padding for nav
        "min-h-screen",
        // Desktop: fill the sidebar layout naturally
        "md:min-h-0 md:flex-1",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
