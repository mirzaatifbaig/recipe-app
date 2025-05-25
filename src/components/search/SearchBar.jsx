import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useRecipes } from "@/context/RecipeContext";
import { motion, AnimatePresence } from "framer-motion";

export function SearchBar() {
  const { filterOptions, updateFilterOptions } = useRecipes();

  const handleSearchChange = (e) => {
    updateFilterOptions({ query: e.target.value });
  };

  const clearSearch = () => {
    updateFilterOptions({ query: "" });
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filterOptions.query}
          onChange={handleSearchChange}
          placeholder="Search recipes, ingredients, tags..."
          className="pl-9 pr-10 h-10 bg-background border-2 focus-visible:ring-1 transition-all"
        />
        <AnimatePresence>
          {filterOptions.query && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear search</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
