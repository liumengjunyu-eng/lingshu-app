import { AppState, DEFAULT_STATE } from './types';

// ============================================================
// Deep Merge（递归合并对象）
// ============================================================

export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else if (sourceValue !== undefined && sourceValue !== null) {
        result[key] = sourceValue as any;
      }
    }
  }

  return result;
}

// ============================================================
// 状态加载（含 hydration 容错）
// ============================================================

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

// ============================================================
// 状态保存（统一写入）
// ============================================================

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ling-shu-state', JSON.stringify(state));
  } catch {
    // 静默失败
  }
}

// ============================================================
// 轻量迁移：旧版分散存储 → 新版单状态树
// ============================================================

export function migrateOldState(): void {
  if (typeof window === 'undefined') return;

  const oldRecovery = localStorage.getItem('recovery_state');
  const oldPremium = localStorage.getItem('isPremium');

  if (!oldRecovery && oldPremium === null) return;

  const current = loadState();
  let merged = { ...current };

  if (oldRecovery) {
    try {
      const parsed = JSON.parse(oldRecovery);
      merged = deepMerge(merged, {
        recovery: {
          ...current.recovery,
          ...parsed,
        },
      });
    } catch {
      // 解析失败则忽略
    }
  }

  if (oldPremium !== null) {
    const isPremium = oldPremium === 'true';
    merged = deepMerge(merged, {
      premium: {
        isPremium,
        purchasedAt: isPremium ? Date.now() : null,
      },
    });
  }

  saveState(merged);

  localStorage.removeItem('recovery_state');
  localStorage.removeItem('isPremium');
}
