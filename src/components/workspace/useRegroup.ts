import { useEffect, useRef, useState } from 'react';
import type { GroupCategory } from '../../domain/types';
export type PilePhase = 'settled' | 'scatter' | 'gather';
/** Cancel older timers when intent changes or the scene unmounts. */
export function useRegroup(mode: GroupCategory, reduced: boolean) {
  const [displayedMode,setDisplayedMode] = useState(mode);
  const currentMode = useRef(mode);
  const regrouping = useRef(false);
  const [phase,setPhase] = useState<PilePhase>('settled');
  useEffect(()=>{
    const gatherDuration = reduced ? 180 : 520;
    const settle = () => {regrouping.current=false;setPhase('settled');};
    // Returning to the still-visible mode mid-scatter must first gather its
    // sheets back; do not enable selection or announce completion prematurely.
    if(mode===currentMode.current) {
      if(!regrouping.current) return;
      setPhase('gather');
      const timer=window.setTimeout(settle,gatherDuration);
      return ()=>window.clearTimeout(timer);
    }
    regrouping.current=true;
    setPhase('scatter');
    const scatterDuration = reduced ? 140 : 290;
    const swap=window.setTimeout(()=>{
      currentMode.current=mode;
      setDisplayedMode(mode);
      setPhase('gather');
    },scatterDuration);
    const done=window.setTimeout(settle,scatterDuration+gatherDuration);
    return ()=>{window.clearTimeout(swap);window.clearTimeout(done);};
  },[mode,reduced]);
  return {displayedMode,phase};
}
