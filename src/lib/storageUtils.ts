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
  remoteItems: T[],
  currentLocalItems: T[],
  deletedKey: string
): T[] {
  const deletedIds = getDeletedIds(deletedKey);
  
  // 1. Filter out deleted items from remote
  const validRemote = (remoteItems || []).filter(item => item && item.id && !deletedIds.has(item.id));
  
  // Map of remote items indexed by id
  const remoteMap = new Map<string, T>();
  validRemote.forEach(item => {
    remoteMap.set(item.id, item);
  });
  
  // Map for final result
  const resultMap = new Map<string, T>();

  // First, include all valid remote items
  validRemote.forEach(item => {
    resultMap.set(item.id, item);
  });

  // Next, include local items that are not in remote and not in deletedIds (newly added local items)
  (currentLocalItems || []).forEach(localItem => {
    if (localItem && localItem.id && !deletedIds.has(localItem.id)) {
      if (!remoteMap.has(localItem.id)) {
        // Local item newly added, keep it!
        resultMap.set(localItem.id, localItem);
      } else {
        // Exists in both remote and local. Merge fields, preferring remote values for server updates
        const remoteItem = remoteMap.get(localItem.id)!;
        resultMap.set(localItem.id, { ...localItem, ...remoteItem });
      }
    }
  });

  return Array.from(resultMap.values());
}
