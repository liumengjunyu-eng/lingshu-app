import { AppState, DEFAULT_STATE } from './types';

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

export function loadState(): AppState {
  if (typeof window === 'undefined') return DEFAULT_STATE;

  try {
    const raw = localStorage.getItem('ling-shu-state');
    if (!raw) return DEFAULT_STATE;

    const parsed = JSON.parse(raw);
    return deepMerge(DEFAULT_STATE, parsed);
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState) {
  const next = {
    ...state,
    meta: {
      ...state.meta,
      updatedAt: Date.now(),
    },
  };

  localStorage.setItem('ling-shu-state', JSON.stringify(next));
}

export function resetState() {
  localStorage.removeItem('ling-shu-state');
  return DEFAULT_STATE;
}
