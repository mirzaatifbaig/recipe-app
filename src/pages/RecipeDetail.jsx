import { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import { IngredientsList } from "@/components/cooking/IngredientsList";
import { CookingStepsList } from "@/components/cooking/CookingStepsList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useConfetti } from "@/hooks/useConfetti";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Flame, Heart, Users, Utensils } from "lucide-react";
import ReactConfetti from "react-confetti";

export function RecipeDetail({ recipe, onBack }) {
  const { toggleFavorite } = useRecipes();
  const [activeTab, setActiveTab] = useState("cook");
  const { play } = useSoundEffect();
  const {
    isActive: showConfetti,
    startConfetti,
    stopConfetti,
    confettiProps,
  } = useConfetti({
    duration: 4000,
    numberOfPieces: 200,
  });

  const totalTime = recipe.prepTime + recipe.cookTime;

  const handleFavoriteToggle = () => {
    if (!recipe.isFavorite) {
      startConfetti();
      play("success");
    } else {
      play("toggle");
    }
    toggleFavorite(recipe.id);
  };

  const handleBack = () => {
    play("click");
    onBack();
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    play("click");
  };

  const difficultyColors = {
    easy: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    hard: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <>
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          {...confettiProps}
        />
      )}

      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-8">
        <Button
          variant="ghost"
          className="px-0 text-muted-foreground hover:text-foreground"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to recipes
        </Button>

        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full aspect-[21/9] object-cover"
          />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge
                variant="secondary"
                className={difficultyColors[recipe.difficulty]}
              >
                {recipe.difficulty}
              </Badge>
              {recipe.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-white border-white/30 bg-black/30"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
            <p className="text-white/80 mb-4 max-w-2xl">{recipe.description}</p>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-white/70" />
                <span>{totalTime} min total</span>
              </div>
              <div className="flex items-center">
                <Flame className="h-5 w-5 mr-2 text-white/70" />
                <span>{recipe.prepTime} min prep</span>
              </div>
              <div className="flex items-center">
                <Utensils className="h-5 w-5 mr-2 text-white/70" />
                <span>{recipe.cookTime} min cook</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-white/70" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30"
              onClick={handleFavoriteToggle}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: recipe.isFavorite ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={`h-5 w-5 ${recipe.isFavorite ? "fill-red-500 text-red-500" : "text-white"}`}
                />
              </motion.div>
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="cook"
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cook">Cook Mode</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="cook" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <IngredientsList
                  recipeId={recipe.id}
                  ingredients={recipe.ingredients}
                />
              </div>

              <div className="md:col-span-2">
                <CookingStepsList recipeId={recipe.id} steps={recipe.steps} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">About this recipe</h3>
              <p className="text-muted-foreground">{recipe.description}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Nutrition Facts</h3>
              <p className="text-muted-foreground italic">
                Nutrition information is not available for this recipe.
              </p>
            </div>

            <Separator />

            {recipe.notes ? (
              <div>
                <h3 className="text-lg font-medium mb-2">Notes</h3>
                <p className="text-muted-foreground">{recipe.notes}</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-2">Notes</h3>
                <p className="text-muted-foreground italic">
                  No notes have been added to this recipe.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
