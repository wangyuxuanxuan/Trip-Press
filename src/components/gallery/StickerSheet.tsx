import { TravelElement,travelElements } from '../printing/TravelElement';
export function StickerSheet({exportable=false}:{exportable?:boolean}){
 return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 440" role="img" aria-label="八枚独立旅行贴纸" data-sticker-export={exportable?'true':undefined}>
  {travelElements.map((kind,i)=><g key={kind} transform={`translate(${13+(i%3)*126} ${5+Math.floor(i/3)*146}) rotate(${i%2?5:-4} 50 65)`}><TravelElement kind={kind} decorative/></g>)}
 </svg>;
}
