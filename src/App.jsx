import { useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { RecipeDetail } from "./pages/RecipeDetail";
import { ThemeProvider } from "./context/ThemeProvider";
import { RecipeProvider } from "./context/RecipeContext";
import { Toaster } from "./components/ui/toaster";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <ThemeProvider>
      <RecipeProvider>
        <AnimatePresence mode="wait">
          {selectedRecipe ? (
            <motion.div
              key="recipe-detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <RecipeDetail
                recipe={selectedRecipe}
                onBack={() => setSelectedRecipe(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard onRecipeSelect={setSelectedRecipe} />
            </motion.div>
          )}
        </AnimatePresence>
        <Toaster />
      </RecipeProvider>
    </ThemeProvider>
  );
}

export default App;
