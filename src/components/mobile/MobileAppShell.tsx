import { useEffect, useRef, type ReactNode, type PointerEvent } from 'react';
import { touchFeedback } from './feedback';
import {PortraitGuard} from './PortraitGuard';
import styles from './mobile.module.css';
interface Props { children: ReactNode; onBack: () => void; canGoBack: boolean; gestureEnabled?: boolean; freshLayout?:boolean; }
export function MobileAppShell({ children, onBack, canGoBack, gestureEnabled = true, freshLayout=false }: Props) {
  const start = useRef<{ x: number; y: number; id: number; time: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const pressed = useRef<{ element: HTMLElement; id: number; x: number; y: number } | null>(null);
  const clearPress = () => {
    pressed.current?.element.removeAttribute('data-pressed');
    pressed.current = null;
  };
  useEffect(() => {
    const cancel = () => { clearPress(); start.current = null; };
    window.addEventListener('blur', cancel);
    return () => { window.removeEventListener('blur', cancel); cancel(); };
  }, []);
  const down = (event: PointerEvent<HTMLDivElement>) => {
    suppressClickUntil.current = 0;
    clearPress();
    const control = (event.target as Element).closest<HTMLElement>('button:not(:disabled), input:not(:disabled)');
    if (control && event.isPrimary) {
      control.dataset.pressed = 'true';
      pressed.current = { element: control, id: event.pointerId, x: event.clientX, y: event.clientY };
    }
    start.current = null;
    if (!canGoBack || !gestureEnabled || event.pointerType === 'mouse' || !event.isPrimary) return;
    if (event.clientX - event.currentTarget.getBoundingClientRect().left > 28) return;
    const interactive = (event.target as Element).closest('button, input, a, dialog');
    if (interactive && !interactive.matches('[data-back-gesture="allow"]')) return;
    start.current = { x: event.clientX, y: event.clientY, id: event.pointerId, time: performance.now() };
  };
  const up = (event: PointerEvent<HTMLDivElement>) => {
    clearPress();
    const point = start.current;
    start.current = null;
    if (!point || point.id !== event.pointerId || !gestureEnabled) return;
    if (event.clientX - point.x >= 76 && Math.abs(event.clientY - point.y) < 48 && performance.now() - point.time < 900) {
      suppressClickUntil.current = performance.now() + 400;
      touchFeedback(); onBack();
    }
  };
  return <div className={styles.appShell} data-fresh-layout={freshLayout} data-testid="mobile-app-shell" onPointerDownCapture={down} onPointerUpCapture={up}
    onPointerMoveCapture={event => { const point = pressed.current; if (point && point.id === event.pointerId && Math.hypot(event.clientX - point.x, event.clientY - point.y) > 12) clearPress(); }}
    onPointerCancelCapture={() => { clearPress(); start.current = null; }}
    onLostPointerCapture={clearPress} onScrollCapture={clearPress} onContextMenuCapture={clearPress}
    onClickCapture={event => { clearPress(); if (performance.now() < suppressClickUntil.current) { event.preventDefault(); event.stopPropagation(); return; } if ((event.target as Element).closest('button:not(:disabled), label')) touchFeedback(); }}>
    {children}<PortraitGuard/>
  </div>;
}
