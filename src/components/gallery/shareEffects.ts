export const effects={original:'原图',stickers:'贴纸集',journal:'手账',postcard:'明信片'} as const;
export type ShareEffect=keyof typeof effects;
export function readEffect(groupId:string):ShareEffect{
 try{const value=sessionStorage.getItem(`trip-effect-${groupId}`);if(value&&value in effects)return value as ShareEffect;}catch{/* Optional storage. */}
 return 'journal';
}
export function saveEffect(groupId:string,value:ShareEffect){try{sessionStorage.setItem(`trip-effect-${groupId}`,value);}catch{/* Keep current state. */}}
