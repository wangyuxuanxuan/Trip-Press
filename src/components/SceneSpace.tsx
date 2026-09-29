import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import type { Scene } from '../domain/types';
import { SafeAreaScene } from './mobile';
import styles from './shared.module.css';
export function SceneSpace({ scene, direction, children }: { scene: Scene; direction: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  const container = useRef<HTMLElement>(null);
  const positions=useRef<Partial<Record<Scene,number>>>({});
  const transitioning=useRef(false);
  useLayoutEffect(() => { transitioning.current=true;container.current?.scrollTo({ top: 0, behavior: 'instant' }); }, [scene]);
  return <main className={`${styles.space} ${(scene==='groupDetail'||scene==='printing')?styles.detailSpace:''}`} ref={container} data-reduced-motion={Boolean(reduce)} onScroll={e=>{if(!transitioning.current)positions.current[scene]=e.currentTarget.scrollTop;}}>
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.section key={scene} data-scene={scene} className={styles.scene} custom={direction}
        variants={{ enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 24, y: reduce ? 0 : 10, scale: reduce ? 1 : d > 0 ? 0.975 : 1.02 }), active: { opacity: 1, x: 0, y: 0, scale: 1 }, exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : -d * 20, scale: reduce ? 1 : d > 0 ? 1.02 : 0.975 }) }}
        initial="enter" animate="active" exit="exit" transition={{ duration: reduce ? 0 : 0.24, ease: 'easeOut' }}
        onAnimationComplete={definition => { if (definition === 'active') { container.current?.scrollTo({ top: direction<0?(positions.current[scene]??0):0, behavior: 'instant' });transitioning.current=false;container.current?.querySelector<HTMLElement>('[data-scene-heading]')?.focus({ preventScroll: true }); } }}>
        {(scene==='groupDetail'||scene==='printing'||scene==='gallery'||scene==='stickerCollection')?children:<SafeAreaScene>{children}</SafeAreaScene>}
      </motion.section>
    </AnimatePresence>
  </main>;
}
