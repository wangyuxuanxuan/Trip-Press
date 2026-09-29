/** Optional enhancement: browsers without vibration retain CSS press feedback. */
export function touchFeedback() {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try { navigator.vibrate(8); } catch { /* Unsupported or denied: CSS remains available. */ }
}
