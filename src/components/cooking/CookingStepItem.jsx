import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Edit,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useTimer } from "@/hooks/useTimer";
import { useRecipes } from "@/context/RecipeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { cn } from "@/lib/utils";

export function CookingStepItem({
  recipeId,
  step,
  index,
  isActive,
  onToggleExpand,
}) {
  const { toggleStepCompleted, updateStepNotes } = useRecipes();
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState(step.notes || "");
  const { play } = useSoundEffect();

  const {
    timeRemaining,
    formattedTime,
    isRunning,
    isPaused,
    percentComplete,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer({
    duration: step.timerDuration || 60,
    onComplete: () => {
      play("timer");
    },
  });

  const handleToggleStep = () => {
    toggleStepCompleted(recipeId, step.id);
    if (!step.completed) {
      play("complete");
    } else {
      play("toggle");
    }
  };

  const handleStartTimer = () => {
    play("click");
    startTimer();
  };

  const handlePauseTimer = () => {
    play("click");
    pauseTimer();
  };

  const handleResetTimer = () => {
    play("click");
    resetTimer();
  };

  const handleSaveNotes = () => {
    updateStepNotes(recipeId, step.id, noteText);
    setIsNotesOpen(false);
    play("success");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={cn(
          "border-2 transition-all",
          isActive && "shadow-md",
          step.completed &&
            "border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/20",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id={step.id}
              checked={step.completed}
              onCheckedChange={handleToggleStep}
              className="mt-1"
            />

            <div className="flex-1 space-y-2">
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={onToggleExpand}
              >
                <div
                  className={cn(
                    "font-medium",
                    step.completed && "line-through text-muted-foreground",
                  )}
                >
                  <span className="text-muted-foreground mr-2">
                    {index + 1}.
                  </span>
                  {step.description}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand();
                  }}
                >
                  {isActive ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </Button>
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 overflow-hidden"
                  >
                    {step.estimatedTime && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Clock size={12} />
                        <span>Est. {step.estimatedTime} min</span>
                      </Badge>
                    )}

                    {step.hasTimer && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Timer
                          </span>
                          <span className="font-mono font-medium">
                            {formattedTime}
                          </span>
                        </div>

                        <Progress value={percentComplete} className="h-2" />

                        <div className="flex items-center gap-2 justify-end">
                          {!isRunning && !isPaused && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleStartTimer}
                            >
                              <Play size={14} className="mr-1" /> Start
                            </Button>
                          )}

                          {isRunning && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handlePauseTimer}
                            >
                              <Pause size={14} className="mr-1" /> Pause
                            </Button>
                          )}

                          {isPaused && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleStartTimer}
                            >
                              <Play size={14} className="mr-1" /> Resume
                            </Button>
                          )}

                          {(isRunning ||
                            isPaused ||
                            timeRemaining < step.timerDuration) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleResetTimer}
                            >
                              <RotateCcw size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="px-0">
                            <Edit size={14} className="mr-1" />
                            {step.notes ? "Edit Notes" : "Add Notes"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Step Notes</DialogTitle>
                          </DialogHeader>
                          <Textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Add your notes for this step..."
                            className="min-h-[100px]"
                          />
                          <Button onClick={handleSaveNotes}>Save Notes</Button>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {step.notes && (
                      <div className="text-sm bg-muted/50 p-3 rounded-md italic text-muted-foreground">
                        {step.notes}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
