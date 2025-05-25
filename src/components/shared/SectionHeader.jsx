import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function SectionHeader({ title, description, className, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-1.5", className)}
      {...props}
    >
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </motion.div>
  );
}
