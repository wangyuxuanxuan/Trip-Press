import type {CSSProperties} from 'react';
import {SafeImage} from '../mobile/SafeImage';
import {CoverSticker,type CoverMotif} from './CoverSticker';
import styles from './collage.module.css';

type CoverRecipe={photo:string;detail:string;motif:CoverMotif;accent:string;note:string;label:string};
const recipes:Record<string,CoverRecipe>={
 red:{photo:'red',detail:'street',motif:'sign',accent:'#FF8873',note:'灯火、人潮\n大阪的夜',label:'OSAKA'},
 food:{photo:'lantern',detail:'takoyaki',motif:'octopus',accent:'#FF8873',note:'边走边吃\n一口大阪',label:'GOOD FOOD'},
 noodles:{photo:'ramen',detail:'takoyaki',motif:'noodles',accent:'#FFDC6F',note:'热气腾腾\n又是好一天',label:'A LITTLE BREAK'},
 green:{photo:'shrine',detail:'shrine',motif:'leaf',accent:'#92CC70',note:'转角遇见\n一片绿意',label:'SLOW MOMENTS'},
 street:{photo:'street',detail:'store',motif:'lantern',accent:'#6CCCF0',note:'还想再走\n远一点',label:'ON THE WAY'},
 people:{photo:'companion',detail:'street',motif:'ticket',accent:'#6CCCF0',note:'和你们\n一起走过',label:'TOGETHER'},
 store:{photo:'store',detail:'alley',motif:'lantern',accent:'#FFCF74',note:'晚归路上\n总有一盏灯',label:'LITTLE FINDS'},
};
export function coverRecipeForGroup(id:string){
 if(/friends|wang|camera|ahead/.test(id))return 'people';
 if(/noodles/.test(id))return 'noodles';
 if(/green/.test(id))return 'green';
 if(/signs/.test(id))return 'food';
 if(/store|windows|rain/.test(id))return 'store';
 if(/blue/.test(id))return 'street';
 return 'red';
}
export function CollageCover({recipe='red',wide=false,className=''}:{recipe?:string;wide?:boolean;className?:string}){
 const item=recipes[recipe]??recipes.red;
 return <span className={`${styles.cover} ${className}`} data-cover-recipe={recipe} data-wide={wide} style={{'--cover-accent':item.accent} as CSSProperties} aria-hidden="true">
  <span className={styles.spine}/><span className={styles.coverWord}>{item.label}<i/></span>
  <span className={styles.mainPhoto}><SafeImage src={`./assets/photos/${item.photo}.jpg`} alt="" draggable={false}/></span>
  <span className={styles.detailPhoto}><SafeImage src={`./assets/photos/${item.detail}.jpg`} alt="" draggable={false} loading="lazy"/><i/></span>
  <CoverSticker motif={item.motif} className={styles.mainSticker}/>
  <span className={styles.note}>{item.note}</span>
  <CoverSticker motif={recipe==='red'?'lantern':recipe==='green'?'shrine':recipe==='noodles'?'leaf':'ticket'} className={styles.smallSticker}/>
  <span className={styles.marks}><i/><i/><i/></span>
 </span>;
}
