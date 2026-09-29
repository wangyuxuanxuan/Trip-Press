export interface LandscapePhoto {src:string;alt:string;author:string;source:string;}
const photo=(file:string,alt:string,author:string,page:string):LandscapePhoto=>({src:`./assets/landscapes/${file}.jpg`,alt,author,source:`https://www.pexels.com/photo/${page}/`});
export const landscapes={
 coast:[photo('coast-waves','碧蓝海浪漫过沙滩','Jess Loiterton','aerial-view-of-ocean-waves-4321815'),photo('coast-palms','棕榈树下的海岸','Joe Fikar','turquoise-sea-off-the-coast-of-bali-19137460')],
 desert:[photo('desert-dunes','蓝天下延伸的金色沙丘','Maria Sanchez','brown-sand-under-blue-sky-3909922'),photo('desert-sky','白云下的沙丘','Othmane Ettalbi','sand-dunes-under-a-bright-blue-sky-30374242')],
 grassland:[photo('grass-forest','起伏的草地与远山','Francesco Ungaro','scenic-view-of-green-hills-under-a-blue-sky-22610570'),photo('grass-hills','蓝天下的绿色山丘','Brett Jordan','green-hills-under-a-blue-sky-11562341')],
 alpine:[photo('alpine-flowers','山间盛开的粉色野花','Vasilis Karkalas','flowers-on-meadow-in-mountains-16660722'),photo('yellow-meadow','黄花草甸与山峰','Yakup Tuğ','meadow-with-yellow-flowers-in-mountains-16853153')],
};
