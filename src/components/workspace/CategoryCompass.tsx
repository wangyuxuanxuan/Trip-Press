import { useRef, useState, type KeyboardEvent, type PointerEvent, type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { GroupCategory } from '../../domain/types';
import { categoryLabels } from '../../data/mock';
import { touchFeedback } from '../mobile/feedback';
import styles from './workspace.module.css';
export const compassModes: GroupCategory[] = ['recommended','color','people','theme'];
const angles = { recommended: 0, color: 90, people: 180, theme: 270 };
export function CategoryCompass({ mode, onChange }: { mode: GroupCategory; onChange: (mode: GroupCategory) => void }) {
  const reduced = useReducedMotion();
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [pull, setPull] = useState({ x: 0, y: 0 });
  const choose = (next: GroupCategory, focus = false) => {
    onChange(next);
    if (focus) buttons.current[compassModes.indexOf(next)]?.focus({ preventScroll: true });
  };
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index+1)%4;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index+3)%4;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 3;
    else return;
    event.preventDefault(); choose(compassModes[next], true); touchFeedback();
  };
  const finish = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const origin = start.current;
    start.current = null; setPull({ x: 0, y: 0 });
    if (!origin || origin.id !== event.pointerId || cancelled) return;
    const dx = event.clientX - origin.x, dy = event.clientY - origin.y;
    if (Math.hypot(dx,dy) < 18) return;
    const next = Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'color' : 'theme' : dy > 0 ? 'people' : 'recommended';
    choose(next); touchFeedback();
  };
  return <div className={styles.compassWrap}>
    <span className={styles.compassCaption}>换个角度，看看旅途</span>
    <div className={styles.compass} role="radiogroup" aria-label="照片分类方式" aria-describedby="compass-help" data-mode={mode}>
      <svg className={styles.compassRing} viewBox="0 0 152 152" aria-hidden="true"><circle cx="76" cy="76" r="47" fill="#FDFCF7" stroke="#AEC3AD" strokeWidth="1" /><circle cx="76" cy="76" r="40" fill="none" stroke="#AEC3AD" strokeDasharray="1 8" /></svg>
      {compassModes.map((item,index) => <button key={item} type="button" role="radio" aria-checked={mode===item} tabIndex={mode===item?0:-1}
        ref={element=>{buttons.current[index]=element;}} className={styles.compassChoice} data-mode={item} data-selected={mode===item}
        onClick={()=>choose(item)} onKeyDown={event=>keyDown(event,index)}>{categoryLabels[item]}</button>)}
      <div className={styles.compassDrag} data-testid="compass-drag" aria-hidden="true"
        onPointerDown={event=>{ if(!event.isPrimary) return; event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); start.current={x:event.clientX,y:event.clientY,id:event.pointerId}; }}
        onPointerMove={event=>{ const origin=start.current; if(origin?.id===event.pointerId) setPull({x:Math.max(-12,Math.min(12,event.clientX-origin.x)),y:Math.max(-12,Math.min(12,event.clientY-origin.y))}); }}
        onPointerUp={event=>finish(event)} onPointerCancel={event=>finish(event,true)} onLostPointerCapture={()=>{start.current=null;setPull({x:0,y:0});}}>
        <motion.div animate={{x:reduced?0:pull.x,y:reduced?0:pull.y,rotate:reduced?0:angles[mode]}} transition={reduced?{duration:0}:{type:'spring',stiffness:430,damping:29}} className={styles.compassNeedle} style={{'--selected-color':`var(--mode-${mode})`} as CSSProperties}>
          <svg viewBox="0 0 48 48"><path d="M24 4 35 33 24 27 13 33Z" fill="var(--selected-color)" stroke="#364D43" strokeWidth="1" /><path d="m24 27 0 17 11-11Z" fill="#EEE8D9" /><circle cx="24" cy="25" r="3" fill="#FDFCF7" stroke="#364D43" /></svg>
        </motion.div>
      </div>
    </div><span className={styles.compassHelp} id="compass-help">点文字 · 轻拨指针</span>
  </div>;
}
