import {TravelSticker} from '../mobile/TravelSticker';
import {SafeImage} from '../mobile/SafeImage';
import type {CSSProperties} from 'react';
import type {ShelfTrip} from '../../data/tripShelf';
import {HandDrawnIcon,Tape} from '../mobile';
import styles from './tripShelf.module.css';
export const tripColors=(trip:ShelfTrip)=>({'--box-main':trip.colors.main,'--box-secondary':trip.colors.secondary,'--box-accent':trip.colors.accent,'--box-leaf':trip.colors.leaf??trip.colors.main}) as CSSProperties;
export function TravelMotif({kind}:{kind:ShelfTrip['kind']}){
 const motif={box:'osaka',film:'sea',envelope:'umbrella',summer:'flower'} as const;
 return <TravelSticker kind={motif[kind]} className={styles.motif}/>;
}
export function TravelContainer({trip,onOpen,preview=false}:{trip:ShelfTrip;onOpen?:()=>void;preview?:boolean}){
 const content=<><span className={styles.boxEdge} aria-hidden="true"/><div className={styles.containerFace}>
  <span className={styles.boxKicker}>{trip.kind==='film'?'WEEKEND FILM / 36':trip.kind==='envelope'?'A LETTER FROM THE RAIN':'LITTLE DAYS, WELL KEPT'}</span>
  <strong className={styles.place}>{trip.place}</strong><TravelMotif kind={trip.kind}/>
  {trip.kind==='box'&&<span className={styles.photoPeek}><SafeImage src="./assets/photos/red.jpg" alt="道顿堀的红色街景"/><Tape tone="blue"/></span>}
  {trip.kind==='envelope'&&<span className={styles.envelopeFold} aria-hidden="true"/>}
  <span className={styles.tripLabel}><b>{trip.name}</b><small>{trip.note}</small></span>
  <span className={styles.boxSeal}>{trip.id==='osaka'?'OPEN ME':'旅行样盒'}</span>
 </div></>;
 return preview?<div className={styles.container} data-kind={trip.kind} style={tripColors(trip)}>{content}</div>:<button className={styles.container} data-trip-box={trip.id} data-kind={trip.kind} style={tripColors(trip)} onClick={onOpen} aria-label={trip.id==='osaka'?'进入大阪散步日记':`查看${trip.name}旅行样盒`}>{content}<span className={styles.openHint}>{trip.id==='osaka'?'打开这一趟旅行':'看看旅行样盒'}<HandDrawnIcon name="arrow"/></span></button>;
}
export function EmptyTravelBox({onOpen}:{onOpen:()=>void}){
 return <button className={styles.newTrip} onClick={onOpen} aria-label="导入一次新旅行"><TravelSticker kind="suitcase" className={styles.importSticker}/><span className={styles.newTripCopy}><small>MAKE ROOM FOR MEMORIES</small><span className={styles.newTripLabel}>导入一次新旅行</span><span className={styles.newTripHint}>让照片，变成可以收藏的故事</span></span><HandDrawnIcon name="arrow"/></button>;
}
