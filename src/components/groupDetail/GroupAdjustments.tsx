import {editorialPhoto} from '../../data/editorial';
import {localTrip} from '../../data/localTrips';
import {SafeImage} from '../mobile/SafeImage';
import type { PhotoGroup } from '../../domain/types';
import type { GroupDraft, GroupEdit } from '../../state/groupEdits';
import { candidatesForGroup, photoById } from '../../data/mock';
import styles from './groupDetail.module.css';
interface Props {group:PhotoGroup;draft?:GroupDraft;activeId?:string;onEdit:(edit:GroupEdit)=>void;onUndo:()=>void;onRename:()=>void;onInfo:()=>void;}
export function GroupAdjustments({group,draft,activeId,onEdit,onUndo,onRename,onInfo}:Props){
 const index=group.photoIds.indexOf(activeId??'');
 const move=(by:number)=>{const ids=[...group.photoIds];[ids[index],ids[index+by]]=[ids[index+by],ids[index]];onEdit({type:'reorder',photoIds:ids});};
 const candidates=candidatesForGroup(group).filter(id=>!group.photoIds.includes(id));
 return <div className={styles.adjustments}>
  <p className={styles.hint}>调整都是可选的。移出与替换只影响这一组。</p>
  <div className={styles.actionRow}><button onClick={onRename}>修改组名</button><button disabled={!draft?.undo.length} onClick={onUndo}>撤销上一步</button></div>
  {activeId&&<><h3>当前照片 · 第 {index+1} 张</h3><div className={styles.currentSummary}><SafeImage src={photoById(activeId).src} alt=""/><span>{photoById(activeId).label}</span></div>
   <div className={styles.actionRow}><button onClick={onInfo}>拍摄信息</button><button className={styles.remove} onClick={()=>onEdit({type:'remove',photoId:activeId})}>移出本组</button></div>
   <div className={styles.actionRow}><button disabled={index<=0} onClick={()=>move(-1)}>向前移一张</button><button disabled={index>=group.photoIds.length-1} onClick={()=>move(1)}>向后移一张</button></div>
   <h3>从素材与其他照片中替换</h3><p className={styles.hint}>点一张，替换当前照片；原照片会收进下方。</p>
   <div className={styles.candidates}>{candidates.map(id=><button key={id} aria-label={`替换为：${photoById(id).label}`} onClick={()=>onEdit({type:'replace',photoId:activeId,candidateId:id})}><SafeImage src={photoById(id).src} alt=""/><span>{photoById(id).label}{editorialPhoto(id)?.selection==='other'?' · 其他照片':editorialPhoto(id)?.selection==='materials'?' · 备用素材':''}</span></button>)}</div>{!candidates.length&&<p className={styles.hint}>候补照片都已在本组中。</p>}
  </>}
  <h3>收起的照片 · {draft?.removed.length??0}</h3>
  {!draft?.removed.length?<p className={styles.hint}>移出或被替换的照片会留在这里，随时可恢复。</p>:<div className={styles.removed}>{draft.removed.map(({photoId})=><div key={photoId}><SafeImage src={photoById(photoId).src} alt=""/><span>{photoById(photoId).label}</span><button aria-label={`恢复照片：${photoById(photoId).label}`} onClick={()=>onEdit({type:'restore',photoId})}>恢复</button></div>)}</div>}
 </div>;
}
