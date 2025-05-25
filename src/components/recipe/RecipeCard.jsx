import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Clock, Utensils, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useRecipes } from "@/context/RecipeContext";
import { useState } from "react";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { cn } from "@/lib/utils";

export function RecipeCard({ recipe, onClick }) {
  const { toggleFavorite } = useRecipes();
  const [isHovered, setIsHovered] = useState(false);
  const { play } = useSoundEffect();

  const handleFavorite = (e) => {
    e.stopPropagation();
    play("toggle");
    toggleFavorite(recipe.id);
  };

  const handleCardClick = () => {
    play("click");
    onClick(recipe);
  };

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <motion.div
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <Card className="overflow-hidden border-2 h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative">
            <AspectRatio ratio={16 / 9}>
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="object-cover w-full h-full rounded-t-lg"
              />
            </AspectRatio>
            <div className="absolute top-2 right-2">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="bg-background/80 backdrop-blur-sm rounded-full p-1.5"
              >
                <Heart
                  className={cn(
                    "h-5 w-5 cursor-pointer transition-colors",
                    recipe.isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-muted-foreground hover:text-red-500",
                  )}
                  onClick={handleFavorite}
                />
              </motion.div>
            </div>
            {recipe.rating && (
              <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{recipe.rating}</span>
              </div>
            )}
            <div className="absolute bottom-2 right-2">
              <Badge
                variant="secondary"
                className="bg-background/80 backdrop-blur-sm"
              >
                {recipe.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg line-clamp-1">{recipe.title}</CardTitle>
          <CardDescription className="mt-1 line-clamp-2">
            {recipe.description}
          </CardDescription>
          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>{totalTime} min</span>
            </div>
            <div className="flex items-center">
              <Utensils className="mr-1 h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
          {recipe.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {recipe.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{recipe.tags.length - 2}
            </Badge>
          )}
          {isHovered && (
            <motion.div
              className="ml-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Button size="sm" variant="secondary">
                View Recipe
              </Button>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
