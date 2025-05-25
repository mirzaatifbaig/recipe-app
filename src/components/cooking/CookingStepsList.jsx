import { useState } from "react";
import { CookingStepItem } from "./CookingStepItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { useConfetti } from "@/hooks/useConfetti";
import ReactConfetti from "react-confetti";

export function CookingStepsList({ recipeId, steps }) {
  const [activeStepId, setActiveStepId] = useState(null);
  const [localSteps, setLocalSteps] = useState(steps);
  const { play } = useSoundEffect();
  const {
    isActive: showConfetti,
    startConfetti,
    confettiProps,
  } = useConfetti({
    duration: 5000,
    numberOfPieces: 200,
  });

  const allStepsCompleted = localSteps.every((step) => step.completed);

  // Check if all steps were just completed
  if (allStepsCompleted && !showConfetti && localSteps.length > 0) {
    startConfetti();
    play("success");
  }

  const handleToggleExpand = (stepId) => {
    setActiveStepId(activeStepId === stepId ? null : stepId);
    play("click");
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(localSteps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalSteps(items);
    play("click");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Steps</h3>
        <span className="text-sm text-muted-foreground">
          {localSteps.filter((s) => s.completed).length} / {localSteps.length}{" "}
          completed
        </span>
      </div>

      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          {...confettiProps}
        />
      )}

      <div className="space-y-3">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="steps">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {localSteps.map((step, index) => (
                  <Draggable key={step.id} draggableId={step.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${snapshot.isDragging ? "z-50" : ""}`}
                      >
                        <CookingStepItem
                          recipeId={recipeId}
                          step={step}
                          index={index}
                          isActive={activeStepId === step.id}
                          onToggleExpand={() => handleToggleExpand(step.id)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-2 text-center text-sm text-muted-foreground"
      >
        Drag steps to reorder your cooking flow
      </motion.div>
    </div>
  );
}
