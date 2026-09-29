import type {Artwork,CaptionTone,EditionLayout} from '../domain/types';
export const captionPresets:Record<CaptionTone,string>={
 natural:'回来整理照片才发现，大阪好像一直在用红色提醒我看它。',
 fun:'去了五天大阪，景点没记住几个，红色倒是收集了一整套。',
 mood:'红色的招牌、雨伞和晚霞，把散落的几天重新串在了一起。',
};
export const toneLabels:Record<CaptionTone,string>={natural:'自然',fun:'有梗',mood:'氛围'};
export const layoutLabels:Record<EditionLayout,string>={journal:'旅行手账',poster:'海报留白',postcard:'明信片'};
export const slideTitles=['街角的第一眼','抬头，是红灯笼','衣角里的好心情','一碗热气腾腾','路过，也要记住','把红色带回家'];
export const makeArtworks=():Artwork[]=>[
 {id:'cover',kind:'cover',title:'社交图组封面',description:'01 / COVER'},
 ...slideTitles.map((title,index)=>({id:`slide-${index+1}`,kind:'carousel' as const,title,description:`0${index+1} / 06`,slideIndex:index})),
 {id:'stickers',kind:'stickers',title:'完整贴纸纸张',description:'08 / STICKERS'},
 {id:'collage',kind:'collage',title:'主题拼贴海报',description:'PHOTO → DRAWING'},
 {id:'caption',kind:'caption',title:'社交配文纸条',description:'A NOTE FROM OSAKA'},
];
