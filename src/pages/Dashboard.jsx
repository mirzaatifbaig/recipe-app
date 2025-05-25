import { useRecipes } from "@/context/RecipeContext";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { CategoryCard } from "@/components/recipe/CategoryCard";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterBar } from "@/components/search/FilterBar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { categories, trendingTags } from "@/data/mockRecipes";
import { motion } from "framer-motion";
import { ChefHat, Cookie, Heart, History } from "lucide-react";

export function Dashboard({ onRecipeSelect }) {
  const { filteredRecipes, updateFilterOptions } = useRecipes();

  const favoriteRecipes = filteredRecipes.filter((recipe) => recipe.isFavorite);
  const recentRecipes = [...filteredRecipes]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  const handleCategorySelect = (categoryId) => {
    updateFilterOptions({
      categories: [categoryId],
    });
  };

  const handleTagSelect = (tag) => {
    updateFilterOptions({ tags: [tag] });
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 space-y-10">
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="bg-primary/10 p-2 rounded-full"
          >
            <ChefHat className="h-6 w-6 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight">RecipeFlow</h1>
        </div>
        <ThemeToggle />
      </div>

      <div className="space-y-4">
        <SearchBar />
        <FilterBar />
      </div>

      <Tabs defaultValue="all" className="space-y-8">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all" className="relative">
              <Cookie className="h-4 w-4 mr-2" />
              All Recipes
            </TabsTrigger>
            <TabsTrigger value="favorites" className="relative">
              <Heart className="h-4 w-4 mr-2" />
              Favorites
              {favoriteRecipes.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {favoriteRecipes.length}
                  </Badge>
                </motion.div>
              )}
            </TabsTrigger>
            <TabsTrigger value="recent">
              <History className="h-4 w-4 mr-2" />
              Recent
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-8">
          <section className="space-y-4">
            <SectionHeader
              title="Categories"
              description="Browse recipes by category"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={handleCategorySelect}
                />
              ))}
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <SectionHeader
              title="Trending Tags"
              description="Popular recipe collections"
            />
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer text-sm py-1.5 px-3"
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <SectionHeader
              title="All Recipes"
              description={`${filteredRecipes.length} recipes available`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={onRecipeSelect}
                />
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">
                  No recipes found with the current filters.
                </p>
              </motion.div>
            )}
          </section>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-8">
          <section className="space-y-4">
            <SectionHeader
              title="Your Favorite Recipes"
              description={`${favoriteRecipes.length} favorite recipes`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={onRecipeSelect}
                />
              ))}
            </div>

            {favoriteRecipes.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">
                  You haven't added any favorites yet.
                </p>
              </motion.div>
            )}
          </section>
        </TabsContent>

        <TabsContent value="recent" className="space-y-8">
          <section className="space-y-4">
            <SectionHeader
              title="Recently Added"
              description="The latest additions to your collection"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={onRecipeSelect}
                />
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
