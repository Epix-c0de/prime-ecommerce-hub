import { useCallback, useRef, useState } from "react";

export function useUndoStack<T>(initial: T) {
  const undoStack = useRef<T[]>([]);
  const redoStack = useRef<T[]>([]);
  const [state, setState] = useState<T>(initial);

  const set = useCallback(
    (next: T) => {
      undoStack.current.push(state);
      redoStack.current = [];
      setState(next);
    },
    [state]
  );

  const undo = useCallback(() => {
    const previous = undoStack.current.pop();
    if (previous !== undefined) {
      redoStack.current.push(state);
      setState(previous);
    }
  }, [state]);

  const redo = useCallback(() => {
    const next = redoStack.current.pop();
    if (next !== undefined) {
      undoStack.current.push(state);
      setState(next);
    }
  }, [state]);

  const reset = useCallback(
    (value: T) => {
      undoStack.current = [];
      redoStack.current = [];
      setState(value);
    },
    []
  );

  return { state, set, undo, redo, canUndo: undoStack.current.length > 0, canRedo: redoStack.current.length > 0, reset };
}

