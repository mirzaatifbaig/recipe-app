import { Checkbox } from "@/components/ui/checkbox";
import { useRecipes } from "@/context/RecipeContext";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSoundEffect } from "@/hooks/useSoundEffect";

export function IngredientsList({ recipeId, ingredients }) {
  const { toggleIngredientCheck } = useRecipes();
  const { play } = useSoundEffect();

  const handleCheckIngredient = (ingredientId) => {
    play("toggle");
    toggleIngredientCheck(recipeId, ingredientId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Ingredients</h3>
        <span className="text-sm text-muted-foreground">
          {ingredients.filter((i) => i.checked).length} / {ingredients.length}
        </span>
      </div>
      <Separator />
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05 }}
        className="space-y-3"
      >
        {ingredients.map((ingredient) => (
          <motion.li
            key={ingredient.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start space-x-3"
          >
            <Checkbox
              id={ingredient.id}
              checked={ingredient.checked}
              onCheckedChange={() => handleCheckIngredient(ingredient.id)}
              className="mt-1"
            />
            <Label
              htmlFor={ingredient.id}
              className={`flex-1 cursor-pointer ${ingredient.checked ? "text-muted-foreground line-through" : ""}`}
            >
              <div className="flex justify-between">
                <span>{ingredient.name}</span>
                <span className="text-muted-foreground">
                  {ingredient.amount} {ingredient.unit}
                </span>
              </div>
            </Label>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
