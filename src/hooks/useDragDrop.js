import { useState } from "react";

export function useDragDrop(initialItems) {
  const [items, setItems] = useState(initialItems);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setItems(reorderedItems);
  };

  const updateItems = (newItems) => {
    setItems(newItems);
  };

  return {
    items,
    onDragEnd,
    updateItems,
  };
}
