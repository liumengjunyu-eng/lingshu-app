import { AppState } from '@/lib/state';
import { generateTask } from '@/lib/ai/taskGenerator';

let cache: { stateHash: string; task: any } | null = null;

export async function getTask(state: AppState) {
  const stateHash = JSON.stringify(state);
  if (cache && cache.stateHash === stateHash) {
    return cache.task;
  }

  const task = await generateTask(state);
  cache = { stateHash, task };
  return task;
}

export function clearTaskCache() {
  cache = null;
}
