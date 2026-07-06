import { useEffect, useReducer, useRef } from 'react';
import { createProgressSyncController } from '../progress/progress-sync-controller.js';

export function useProgressSync({ completedLessons, setCompletedLessons }) {
  const lessonsRef = useRef(completedLessons);
  lessonsRef.current = completedLessons;

  const controllerRef = useRef(null);
  if (!controllerRef.current) {
    controllerRef.current = createProgressSyncController({
      getCompletedLessons: () => lessonsRef.current,
      replaceCompletedLessons: (lessons) => setCompletedLessons(lessons),
    });
  }

  const [, rerender] = useReducer((value) => value + 1, 0);

  useEffect(() => {
    const controller = controllerRef.current;
    return controller.subscribe(() => rerender());
  }, []);

  useEffect(() => {
    controllerRef.current.sync();
  }, []);

  return controllerRef.current;
}
