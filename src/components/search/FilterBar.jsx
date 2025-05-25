import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, X } from "lucide-react";
import { useRecipes } from "@/context/RecipeContext";
import { categories, trendingTags } from "@/data/mockRecipes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function FilterBar() {
  const { filterOptions, updateFilterOptions, resetFilters } = useRecipes();
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (categoryId) => {
    const updatedCategories = filterOptions.categories.includes(categoryId)
      ? filterOptions.categories.filter((id) => id !== categoryId)
      : [...filterOptions.categories, categoryId];

    updateFilterOptions({ categories: updatedCategories });
  };

  const handleTagToggle = (tag) => {
    const updatedTags = filterOptions.tags.includes(tag)
      ? filterOptions.tags.filter((t) => t !== tag)
      : [...filterOptions.tags, tag];

    updateFilterOptions({ tags: updatedTags });
  };

  const handleFavoritesToggle = () => {
    updateFilterOptions({ favoritesOnly: !filterOptions.favoritesOnly });
  };

  const handleDifficultyChange = (difficulty) => {
    updateFilterOptions({ difficulty });
  };

  const hasActiveFilters =
    filterOptions.categories.length > 0 ||
    filterOptions.tags.length > 0 ||
    filterOptions.favoritesOnly ||
    filterOptions.difficulty !== undefined;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-2",
              hasActiveFilters && "border-primary/50 bg-primary/5 text-primary",
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 px-1.5 text-xs font-normal"
              >
                {filterOptions.categories.length +
                  filterOptions.tags.length +
                  (filterOptions.favoritesOnly ? 1 : 0) +
                  (filterOptions.difficulty ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Categories</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {categories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category.id}
              checked={filterOptions.categories.includes(category.id)}
              onCheckedChange={() => handleCategoryToggle(category.id)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </div>
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Tags</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {trendingTags.map((tag) => (
            <DropdownMenuCheckboxItem
              key={tag}
              checked={filterOptions.tags.includes(tag)}
              onCheckedChange={() => handleTagToggle(tag)}
            >
              {tag}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Difficulty</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuCheckboxItem
            checked={filterOptions.difficulty === "easy"}
            onCheckedChange={() =>
              handleDifficultyChange(
                filterOptions.difficulty === "easy" ? undefined : "easy",
              )
            }
          >
            Easy
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={filterOptions.difficulty === "medium"}
            onCheckedChange={() =>
              handleDifficultyChange(
                filterOptions.difficulty === "medium" ? undefined : "medium",
              )
            }
          >
            Medium
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={filterOptions.difficulty === "hard"}
            onCheckedChange={() =>
              handleDifficultyChange(
                filterOptions.difficulty === "hard" ? undefined : "hard",
              )
            }
          >
            Hard
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Other</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuCheckboxItem
            checked={filterOptions.favoritesOnly}
            onCheckedChange={handleFavoritesToggle}
          >
            Favorites Only
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {filterOptions.categories.map((categoryId) => {
            const category = categories.find((c) => c.id === categoryId);
            if (!category) return null;

            return (
              <motion.div
                key={`cat-${categoryId}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleCategoryToggle(categoryId)}
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              </motion.div>
            );
          })}

          {filterOptions.tags.map((tag) => (
            <motion.div
              key={`tag-${tag}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            </motion.div>
          ))}

          {filterOptions.difficulty && (
            <motion.div
              key="difficulty"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Badge
                variant="outline"
                className="cursor-pointer"
                onClick={() => handleDifficultyChange(undefined)}
              >
                {filterOptions.difficulty}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            </motion.div>
          )}

          {filterOptions.favoritesOnly && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Badge
                variant="outline"
                className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 cursor-pointer"
                onClick={handleFavoritesToggle}
              >
                Favorites
                <X className="h-3 w-3 ml-1" />
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
