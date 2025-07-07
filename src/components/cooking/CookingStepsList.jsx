import { useState } from "react";
import { CookingStepItem } from "./CookingStepItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { useConfetti } from "@/hooks/useConfetti";
import ReactConfetti from "react-confetti";

function SortableStep({
  id,
  recipeId,
  step,
  index,
  isActive,
  onToggleExpand,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CookingStepItem
        recipeId={recipeId}
        step={step}
        index={index}
        isActive={isActive}
        onToggleExpand={onToggleExpand}
      />
    </div>
  );
}

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const allStepsCompleted = localSteps.every((step) => step.completed);

  if (allStepsCompleted && !showConfetti && localSteps.length > 0) {
    startConfetti();
    play("success");
  }

  const handleToggleExpand = (stepId) => {
    setActiveStepId(activeStepId === stepId ? null : stepId);
    play("click");
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLocalSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      play("click");
    }
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={localSteps.map((step) => step.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {localSteps.map((step, index) => (
                <SortableStep
                  key={step.id}
                  id={step.id}
                  recipeId={recipeId}
                  step={step}
                  index={index}
                  isActive={activeStepId === step.id}
                  onToggleExpand={() => handleToggleExpand(step.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
