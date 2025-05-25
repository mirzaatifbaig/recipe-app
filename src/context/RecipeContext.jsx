import { createContext, useContext, useState, useEffect } from "react";
import { mockRecipes } from "@/data/mockRecipes";

const defaultFilterOptions = {
  query: "",
  categories: [],
  tags: [],
  favoritesOnly: false,
};

const RecipeContext = createContext(undefined);

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState(mockRecipes);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [filterOptions, setFilterOptions] = useState(defaultFilterOptions);
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);

  useEffect(() => {
    let filtered = [...recipes];

    // Apply search query
    if (filterOptions.query) {
      const query = filterOptions.query.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Apply category filter
    if (filterOptions.categories.length > 0) {
      filtered = filtered.filter((recipe) =>
        filterOptions.categories.includes(recipe.category),
      );
    }

    // Apply difficulty filter
    if (filterOptions.difficulty) {
      filtered = filtered.filter(
        (recipe) => recipe.difficulty === filterOptions.difficulty,
      );
    }

    // Apply time filter
    if (filterOptions.maxTime) {
      filtered = filtered.filter(
        (recipe) => recipe.prepTime + recipe.cookTime <= filterOptions.maxTime,
      );
    }

    // Apply tags filter
    if (filterOptions.tags.length > 0) {
      filtered = filtered.filter((recipe) =>
        recipe.tags.some((tag) => filterOptions.tags.includes(tag)),
      );
    }

    // Apply favorites only filter
    if (filterOptions.favoritesOnly) {
      filtered = filtered.filter((recipe) => recipe.isFavorite);
    }

    setFilteredRecipes(filtered);
  }, [recipes, filterOptions]);

  const updateFilterOptions = (options) => {
    setFilterOptions((prev) => ({ ...prev, ...options }));
  };

  const resetFilters = () => {
    setFilterOptions(defaultFilterOptions);
  };

  const updateRecipe = (updatedRecipe) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe,
      ),
    );

    if (activeRecipe?.id === updatedRecipe.id) {
      setActiveRecipe(updatedRecipe);
    }
  };

  const toggleFavorite = (id) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === id
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe,
      ),
    );
  };

  const addRecipe = (newRecipe) => {
    setRecipes((prev) => [...prev, newRecipe]);
  };

  const deleteRecipe = (id) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  const toggleIngredientCheck = (recipeId, ingredientId) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              ingredients: recipe.ingredients.map((ingredient) =>
                ingredient.id === ingredientId
                  ? { ...ingredient, checked: !ingredient.checked }
                  : ingredient,
              ),
            }
          : recipe,
      ),
    );
  };

  const toggleStepCompleted = (recipeId, stepId) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              steps: recipe.steps.map((step) =>
                step.id === stepId
                  ? { ...step, completed: !step.completed }
                  : step,
              ),
            }
          : recipe,
      ),
    );
  };

  const updateStepNotes = (recipeId, stepId, notes) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              steps: recipe.steps.map((step) =>
                step.id === stepId ? { ...step, notes } : step,
              ),
            }
          : recipe,
      ),
    );
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        filteredRecipes,
        activeRecipe,
        filterOptions,
        setActiveRecipe,
        updateRecipe,
        toggleFavorite,
        addRecipe,
        deleteRecipe,
        updateFilterOptions,
        resetFilters,
        toggleIngredientCheck,
        toggleStepCompleted,
        updateStepNotes,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return context;
};
