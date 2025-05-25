import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function CategoryCard({ category, isSelected = false, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(category.id)}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-xl border",
        "bg-gradient-to-b from-background/80 to-background",
        "backdrop-blur-md transition-all duration-300",
        isSelected
          ? "border-primary shadow-lg shadow-primary/20"
          : "border-border hover:border-primary/50",
      )}
    >
      <div className="absolute inset-0 z-0">
        <img
          src={category.imageUrl}
          alt={category.name}
          className="h-full w-full object-cover opacity-20"
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `linear-gradient(to bottom, transparent, ${category.color}40)`,
          }}
        />
      </div>

      <div className="relative z-10 p-4 flex flex-col items-center justify-center h-full aspect-square">
        <span
          className="h-3 w-3 rounded-full mb-2"
          style={{ backgroundColor: category.color }}
        />
        <h3 className="font-medium text-lg text-center">{category.name}</h3>
      </div>
    </motion.div>
  );
}
