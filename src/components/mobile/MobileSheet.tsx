import { useEffect, useId, useRef, type ReactNode, type CSSProperties } from 'react';
import { HandDrawnIcon } from './HandDrawnIcon';
import styles from './mobile.module.css';
export function MobileSheet({ open, title, onClose, children,className='',style }: { open: boolean; title: string; onClose: () => void; children: ReactNode;className?:string;style?:CSSProperties }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!open) { element.close(); return; }
    const previous = document.activeElement as HTMLElement | null;
    element.showModal();
    return () => { element.close(); previous?.focus({ preventScroll: true }); };
  }, [open]);
  useEffect(()=>{
    if(!open)return;
    const viewport=window.visualViewport;
    const fit=()=>{
      const element=dialog.current;if(!element||!viewport)return;
      const keyboard=Math.max(0,window.innerHeight-viewport.height-viewport.offsetTop);
      if(keyboard>100){
        element.style.bottom=keyboard+'px';
        element.style.maxHeight=Math.max(180,viewport.height-24)+'px';
      }else{element.style.removeProperty('bottom');element.style.removeProperty('max-height');}
      if(element.contains(document.activeElement)&&(document.activeElement instanceof HTMLInputElement||document.activeElement instanceof HTMLTextAreaElement)){
        document.activeElement.scrollIntoView({block:'nearest',behavior:'instant'});
      }
    };
    viewport?.addEventListener('resize',fit);viewport?.addEventListener('scroll',fit);fit();
    return()=>{viewport?.removeEventListener('resize',fit);viewport?.removeEventListener('scroll',fit);dialog.current?.style.removeProperty('bottom');dialog.current?.style.removeProperty('max-height');};
  },[open]);
  return <dialog ref={dialog} className={`${styles.sheet} ${className}`} style={style} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
    <div className={styles.sheetHandle} aria-hidden="true" /><header className={styles.sheetHeader}><h2 id={titleId}>{title}</h2><button type="button" className={styles.iconButton} onClick={onClose} aria-label={`关闭${title}`}><HandDrawnIcon name="close" /></button></header>{children}
  </dialog>;
}
