'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadState, saveState } from './storage';
import { AppState, DEFAULT_STATE } from './types';

export function useAppState() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = loadState();
    setState(s);
    setReady(true);
  }, []);

  const updateState = useCallback((patch: Partial<AppState>) => {
    setState((prev) => {
      const next = deepMerge(prev, patch);
      saveState(next);
      return next;
    });
  }, []);

  const resetState = useCallback(() => {
    const fresh = {
      ...DEFAULT_STATE,
      meta: { ...DEFAULT_STATE.meta, updatedAt: Date.now() },
    };
    setState(fresh);
    saveState(fresh);
  }, []);

  return {
    state,
    updateState,
    resetState,
    ready,
  };
}

function deepMerge(target: any, source: any): any {
  const output = { ...target };
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}
