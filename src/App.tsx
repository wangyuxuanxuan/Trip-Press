import {readCreations,creationStorageKey,type Creation} from './state/creations';
import {editorialTrip} from './data/editorial';
import {useCallback,useReducer,useState} from 'react';
import {MotionConfig} from 'framer-motion';
import {trip} from './data/mock';
import {localTrip} from './data/localTrips';
import {initialState,reducer,resolveGroup} from './state/flow';
import {SceneSpace} from './components/SceneSpace';
import {MobileAppShell} from './components/mobile';
import {WorkspaceHeader} from './components/workspace/WorkspaceHeader';
import {TripShelf} from './scenes/TripShelf';
import {Workspace} from './scenes/Workspace';
import {GroupDetail} from './scenes/GroupDetail';
import {Printing} from './scenes/Printing';
import {Gallery} from './scenes/Gallery';
import {StickerCollection} from './scenes/StickerCollection';
import styles from './components/shared.module.css';
const sceneNames={tripShelf:'旅行盒子',workspace:'照片工作桌',groupDetail:'照片组详情',printing:'作品生成过程',gallery:'发布包',stickerCollection:'旅行贴纸册'};
export function App(){
 const [creations,setCreations]=useState<Creation[]>(()=>{try{return readCreations(localStorage.getItem(creationStorageKey));}catch{return [];}});
 const saveCreation=(draft:Creation)=>{const next=[draft,...creations.filter(c=>c.id!==draft.id)].slice(0,50);setCreations(next);try{localStorage.setItem(creationStorageKey,JSON.stringify(next));return true;}catch{return false;}};
 const [state,dispatch]=useReducer(reducer,initialState);
 const [detailModal,setDetailModal]=useState(false);
 const group=resolveGroup(state,state.selectedGroupId),edition=state.editions.find(item=>item.id===state.activeEditionId);
 const currentTrip=localTrip(state.activeTripId)?.trip??editorialTrip(state.activeTripId)??trip;
 const collectionScope=state.activeTripId;
 const advance=useCallback(()=>dispatch({type:'ADVANCE_PRINT'}),[]);
 const openGallery=useCallback(()=>dispatch({type:'OPEN_GALLERY'}),[]);
 const back=useCallback(()=>dispatch({type:'BACK'}),[]);
 const advanceImport=useCallback(()=>dispatch({type:'ADVANCE_IMPORT'}),[]);
 const completeImport=useCallback(()=>dispatch({type:'COMPLETE_IMPORT'}),[]);
 const backScene=state.history.at(-1);
 return <MotionConfig reducedMotion="user"><MobileAppShell freshLayout canGoBack={Boolean(backScene)} onBack={back} gestureEnabled={!detailModal&&state.shelfView==='collection'}>
  {state.scene==='workspace'&&<WorkspaceHeader trip={currentTrip} mode={state.workspaceMode} onModeChange={mode=>dispatch({type:'SET_WORKSPACE_MODE',mode})} onBack={back} onGallery={()=>dispatch({type:'OPEN_COLLECTION',scope:collectionScope})}/>}
  {state.scene==='tripShelf'&&<header className={`${styles.header} ${styles.freshHeader}`}><div className={styles.brand}><svg className={styles.brandMark} viewBox="0 0 96 96" aria-hidden="true"><use href="./assets/brand/trip-press-mark-fresh.svg#mark"/></svg><span>旅印所<span className={styles.brandEnglish}>TRIP PRESS</span></span></div><button className={styles.collectionEntry} disabled={state.shelfView==='importing'||detailModal} aria-label="打开全部旅行贴纸册" onClick={()=>dispatch({type:'OPEN_COLLECTION',scope:'all'})}><svg viewBox="0 0 30 32" width="25" height="27" aria-hidden="true"><path d="M5 2h21v28H5z" fill="#fff0e9" stroke="#FF7967" strokeWidth="1.5"/><path d="M5 2v28" stroke="#FF7967" strokeWidth="4"/><path d="m16 7 2 5 6 1-4 4 1 6-5-3-5 3 1-6-4-4 6-1Z" fill="#ffca51" stroke="white" strokeWidth="2"/></svg><span>贴纸册</span></button></header>}
  <SceneSpace scene={state.scene} direction={state.direction}>
   {state.scene==='tripShelf'&&<TripShelf view={state.shelfView} step={state.importStep} onOpen={tripId=>dispatch({type:'OPEN_TRIP',tripId})} onStart={tripId=>dispatch({type:'START_IMPORT',tripId})} onAdvance={advanceImport} onComplete={completeImport} onBack={back} onModalChange={setDetailModal}/>}
   {state.scene==='workspace'&&<Workspace tripId={state.activeTripId} drafts={state.drafts} mode={state.workspaceMode} onSelect={groupId=>dispatch({type:'SELECT_GROUP',groupId})}/>}
   {state.scene==='groupDetail'&&group&&<GroupDetail activePhotoId={state.activePhotoIds[group.id]} onActivePhoto={photoId=>dispatch({type:'SET_ACTIVE_PHOTO',photoId})} group={group} draft={state.drafts[group.id]} onEdit={edit=>dispatch({type:'EDIT_GROUP',edit})} onUndo={()=>dispatch({type:'UNDO_GROUP'})} onBack={back} onModalChange={setDetailModal} onShare={()=>dispatch({type:'PREPARE_SHARE'})}/>}
   {state.scene==='printing'&&group&&<Printing group={group} step={state.printStep} status={state.printStatus} autoEnter={state.printAutoEnter} onAdvance={advance} onGallery={openGallery} onBack={back} onFail={()=>dispatch({type:'FAIL_PRINT'})} onRetry={()=>dispatch({type:'RETRY_PRINT'})}/>}
   {state.scene==='gallery'&&<Gallery key={edition?.id??'empty'} edition={edition} onBack={back} backLabel={`← 返回${backScene?sceneNames[backScene]:'照片工作桌'}`} onGroup={()=>dispatch({type:'RETURN_GROUP'})} onEdit={edit=>dispatch({type:'EDIT_EDITION',edit})} onModalChange={setDetailModal} onWorkspace={()=>dispatch({type:'RETURN_WORKSPACE'})} onCollection={()=>dispatch({type:'OPEN_COLLECTION',scope:collectionScope})}/>}
   {state.scene==='stickerCollection'&&<StickerCollection creations={creations} onSaveCreation={saveCreation} onScope={scope=>dispatch({type:'SET_COLLECTION_SCOPE',scope})} scope={state.collectionScope} editions={state.editions} onBack={back} onPackage={id=>dispatch({type:'OPEN_PACKAGE',id})} onModalChange={setDetailModal}/>}
  </SceneSpace>
 </MobileAppShell></MotionConfig>;
}
