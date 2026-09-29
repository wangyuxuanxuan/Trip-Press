import {useRef} from 'react';
import type {GroupCategory} from '../../domain/types';
import {workspaceViews} from '../../data/workspaceViews';
import styles from './workspace.module.css';
export function ViewSwitcher({mode,onChange}:{mode:GroupCategory;onChange:(mode:GroupCategory)=>void}){
 const buttons=useRef<(HTMLButtonElement|null)[]>([]);
 return <div className={styles.viewSwitcher} role="radiogroup" aria-label="旅行浏览视角">
  {workspaceViews.map((view,index)=><button key={view.id} ref={el=>{buttons.current[index]=el;}} type="button" role="radio" aria-checked={view.id===mode} tabIndex={view.id===mode?0:-1} onClick={()=>onChange(view.id)}
   onKeyDown={event=>{let next=index;if(event.key==='Home')next=0;else if(event.key==='End')next=3;else if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%4;else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index+3)%4;else return;event.preventDefault();buttons.current[next]?.focus();onChange(workspaceViews[next].id);}}
  >{view.label}<span aria-hidden="true"/></button>)}
 </div>;
}
