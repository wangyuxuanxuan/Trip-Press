import type {GroupCategory} from '../domain/types';

// Presentation order is independent of the stable group/category identities.
export const workspaceViews: {id:GroupCategory;label:string;description:string}[] = [
 {id:'recommended',label:'这一刻',description:'具体发生过的片段'},
 {id:'people',label:'我们',description:'片段里重要的人和关系'},
 {id:'theme',label:'一路发现',description:'用户反复注视的事物'},
 {id:'color',label:'同一种感觉',description:'跨越地点与事件的视觉情绪'},
];
