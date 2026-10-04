// Offline cache is read-only: all clinical writes must reach the backend successfully.
export const readCached = key => { try { return JSON.parse(localStorage.getItem(`arogyacare.cache.${key}`) || 'null') } catch { return null } }
export const cacheRead = (key,value) => { try { localStorage.setItem(`arogyacare.cache.${key}`,JSON.stringify(value)) } catch {} }
