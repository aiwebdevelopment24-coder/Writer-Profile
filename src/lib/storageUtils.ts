export const getDeletedIds = (key: string): Set<string> => {
  try {
    const saved = localStorage.getItem(key);
    return new Set(saved ? JSON.parse(saved) : []);
  } catch {
    return new Set();
  }
};

export const addDeletedId = (key: string, id: string) => {
  try {
    const ids = getDeletedIds(key);
    ids.add(id);
    localStorage.setItem(key, JSON.stringify(Array.from(ids)));
  } catch (e) {
    console.error(e);
  }
};

export const removeDeletedId = (key: string, id: string) => {
  try {
    const ids = getDeletedIds(key);
    ids.delete(id);
    localStorage.setItem(key, JSON.stringify(Array.from(ids)));
  } catch (e) {
    console.error(e);
  }
};

export function mergeCollection<T extends { id: string }>(
  remoteItems: T[] | null,
  currentLocalItems: T[],
  deletedKey: string
): T[] {
  const deletedIds = getDeletedIds(deletedKey);

  // If remote snapshot array exists, use remote as primary source of truth and filter out any deleted IDs
  if (Array.isArray(remoteItems)) {
    return remoteItems.filter(item => item && item.id && !deletedIds.has(item.id));
  }

  // Fallback to local items if remote is not available
  return (currentLocalItems || []).filter(item => item && item.id && !deletedIds.has(item.id));
}
