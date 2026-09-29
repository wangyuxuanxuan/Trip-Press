import {useEffect,useRef} from 'react';
import styles from './mobile.module.css';
/** screen dimensions do not shrink with the virtual keyboard. */
export function PortraitGuard(){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
  const dialog=ref.current!;let previous:HTMLElement|null=null;
  const check=()=>{const sideways=matchMedia('(pointer:coarse)').matches&&screen.width>screen.height&&innerWidth>innerHeight;
   if(sideways&&!dialog.open){previous=document.activeElement as HTMLElement;dialog.showModal();}
   else if(!sideways&&dialog.open){dialog.close();previous?.focus({preventScroll:true});}
  };
  window.addEventListener('resize',check);screen.orientation?.addEventListener('change',check);check();
  return()=>{window.removeEventListener('resize',check);screen.orientation?.removeEventListener('change',check);dialog.close();};
 },[]);
 return <dialog ref={ref} className={styles.portraitGuard} aria-label="竖屏提示" onCancel={e=>e.preventDefault()}>
  <svg viewBox="0 0 100 120" aria-hidden="true"><rect x="22" y="9" width="56" height="96" rx="8" fill="#FDFCF7" stroke="#D19081" strokeWidth="5"/><path d="M40 17h20M41 96h18" stroke="#364D43" strokeWidth="3" strokeLinecap="round"/><path d="M3 50q0-30 17-30m-9-6 9 6-8 8m85 42q0 30-17 30m9 6-9-6 8-8" fill="none" stroke="#A8CCD4" strokeWidth="4"/></svg>
  <h2>请竖起手机，继续这趟旅行。</h2><p>照片与调整都留在原位。</p>
 </dialog>;
}
