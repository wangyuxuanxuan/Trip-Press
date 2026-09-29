import type {Photo,PhotoGroup,Trip,GroupCategory} from '../domain/types';
import type {ShelfTrip} from './tripShelf';
import {casePhotos} from './casePhotos';
import {journeyGroups} from './journeyGroups';
export const curatedTrip=(id:string)=>({'osaka':'osaka-2026','fuji-notes':'osaka-2026','japan-coast':'osaka-2026','alpine-notes':'italy-2026','coastal-notes':'italy-2026','alpine':'italy-2026','seaside':'italy-2026','rail-notes':'italy-2026','grassland':'desert'}[id]??id);

export interface EditorialPhoto extends Photo {author:string;source:string;selection:'recommended'|'materials'|'other';reason:string;}
const shot=(id:string,tripId:string,label:string,location:string,author:string,slug:string,selection:EditorialPhoto['selection']='recommended',reason='主体明确，保留环境层次与自然光线。'):EditorialPhoto=>({id:`editorial-${id}`,tripId,label,location,author,source:`https://www.pexels.com/photo/${slug}-${id}/`,src:`./assets/editorial/${id}.jpg`,takenAt:'公开摄影样片 · 拍摄日期未读取',selection,reason});
export const editorialPhotos:EditorialPhoto[]=[
 shot('31239492','osaka-2026','樱花与大阪城','日本 · 大阪','Zoë Crafton','osaka-castle-with-cherry-blossoms-in-spring'),
 shot('4058521','osaka-2026','花枝框住的城堡','日本 · 大阪','Satoshi Hirayama','osaka-castle'),
 shot('31418360','osaka-2026','樱花框景里的富士山','日本 · 富士吉田','Rafael Hideki Tamanaha','serene-view-of-mount-fuji-with-cherry-blossoms'),
 shot('4336279','osaka-2026','宝塔与富士山的另一角度','日本 · 富士吉田','Regev Ace Subay','pagoda-and-mount-fuji-in-spring','other','与主片视角相近，主片的天空和花枝层次更清晰；仍可加入本组。'),
 shot('17815282','italy-2026','山湖边的木船','意大利 · 多洛米蒂','fatma kaya','boat-at-pier-at-lake-in-mountains-landscape'),
 shot('20027106','italy-2026','坐在船里看山','意大利 · 布莱埃斯湖','Julien R','man-rowing-a-wooden-boat-on-the-pragser-wildsee-lake-towards-the-seekofel-mountain-in-the-italian-dolomites','materials','保留真实人物与木船细节，未重绘人物；作为备用摄影素材。'),
 shot('18118570','italy-2026','彩色房子与海湾','意大利 · 里奥马焦雷','Gabriele Niek','colorful-houses-on-the-coast-of-italy'),
 shot('13193404','japan-coast','沿着蓝色海岸','日本 · 海岸铁路','Shin Konoa','blue-train-by-the-sea'),
 shot('18546565','rail-notes','向海而行的列车','海岸铁路 · 具体地点未核实','Sandaru Muthuwadige','train-on-tracks-along-sea'),
 {...shot('3909922','desert','沙丘的光与影','摩洛哥 · 沙漠','Maria Sanchez','brown-sand-under-blue-sky'),src:'./assets/landscapes/desert-dunes.jpg'},
 {...shot('30374242','desert','走上沙脊','摩洛哥 · 沙漠','Othmane Ettalbi','sand-dunes-under-a-bright-blue-sky'),src:'./assets/landscapes/desert-sky.jpg'},
 shot('34980659','grassland','山谷里的两座毡房','中国 · 新疆伊犁','庭辉 欧','stunning-mountain-landscape-in-xinjiang-china'),
 shot('28700663','grassland','毡房与牧场','中国 · 新疆','Rain Lü','scenic-grassland-with-yurts-in-xinjiang'),
 shot('28700471','grassland','草地里的木屋','中国 · 新疆','Rain Lü','rustic-landscape-with-mountain-meadow','materials','木屋与草地的环境素材，暂未制作对应贴纸。'),
 shot('27987223','grassland','傍晚的营地','中国 · 新疆阿勒泰','Lywin','a-group-of-yurts-on-top-of-a-hill','other','光线与本组白天的照片不同，单独保留，不硬凑进同一组。'),
 {...shot('19137460','seaside','棕榈树下的海岸','印度尼西亚 · 巴厘岛','Joe Fikar','turquoise-sea-off-the-coast-of-bali'),src:'./assets/landscapes/coast-palms.jpg'},
 {...shot('16660722','alpine','山峰下的花海','山间花海 · 具体地点未核实','Vasilis Karkalas','flowers-on-meadow-in-mountains'),src:'./assets/landscapes/alpine-flowers.jpg'},
 ...casePhotos,
 {...shot('4321815','italy-2026','海浪写下的白色曲线','海岸 · 具体地点未核实','Jess Loiterton','aerial-view-of-ocean-waves'),src:'./assets/landscapes/coast-waves.jpg'},
 {...shot('22610570','desert','山脊与积云','山野 · 具体地点未核实','Francesco Ungaro','scenic-view-of-green-hills-under-a-blue-sky','materials'),src:'./assets/landscapes/grass-forest.jpg'},
 {...shot('11562341','desert','沿着绿色山坡走','山野 · 具体地点未核实','Brett Jordan','green-hills-under-a-blue-sky'),src:'./assets/landscapes/grass-hills.jpg'},
 {...shot('16853153','desert','山前的黄色花甸','山野 · 具体地点未核实','Yakup Tuğ','meadow-with-yellow-flowers-in-mountains'),src:'./assets/landscapes/yellow-meadow.jpg'},
].map(p=>({...p,tripId:curatedTrip(p.tripId)}));
// Journey identity is independent of destinations and grouping perspectives.
const group=(id:string,tripId:string,name:string,category:GroupCategory,description:string,ids:string[]):PhotoGroup=>({id,tripId,name,category,description,photoIds:ids.map(id=>'editorial-'+id)});
const legacyEditorialGroups:PhotoGroup[]=[
 group('osaka-spring','osaka-2026','大阪城的春天','recommended','花枝围着城堡，两张照片留住同一段散步。',['31239492','4058521']),
 group('fuji-spring','osaka-2026','富士山下看花','recommended','山、宝塔和近处的樱花，放在同一个画面里。',['31418360']),
 group('kyoto-walk','osaka-2026','撑着伞，走过京都','recommended','街巷、宝塔和一起入镜的人，组成一段散步。',['30970483','17258243','5463374']),
 group('japan-company','osaka-2026','一起走在路上','people','镜头里的同行：竹林、街巷和回廊中的背影。',['15829774','30970483','5463374']),
 group('japan-portraits','osaka-2026','停下来拍一张','people','合影、对视和一起看照片；保留真实面孔。',['30472132','3534660','17258243']),
 group('japan-blossoms','osaka-2026','总会停下来看花','theme','一路反复拍下的，是建筑前的花枝。',['4058521','31418360']),
 group('japan-roofs','osaka-2026','抬头看屋檐','theme','从大阪到富士，再到京都，总会拍下建筑的轮廓。',['31239492','31418360','17258243']),
 group('japan-umbrellas','osaka-2026','街头的两把伞','theme','重复出现在画面里的纸伞、衣纹与街道细节。',['30970483','17258243']),
 group('japan-pink','osaka-2026','花枝里的浅粉','color','浅粉的花枝与轻亮的天色，让两张画面靠近。',['31239492','4058521']),
 group('japan-vermillion','osaka-2026','朱红与日光','color','宝塔、鸟居与回廊，跨越地点的明亮暖色。',['31418360','30472132','5463374']),
 group('japan-green','osaka-2026','走进清凉的绿','color','竹林与城堡周围的树，让视线安静下来。',['15829774','4058521']),
 group('alpine-lake','italy-2026','在山湖边停一会儿','recommended','从湖畔船屋走到码头，再划进山与松林之间。',['17815282','28217989','8859354','17077785','20027106']),
 group('italy-venice','italy-2026','威尼斯，慢慢走的早晨','recommended','广场、水边和桥下，连起来是一段散步。',['29735737','29735740','29735738','36690045','20053305']),
 group('coastal-village','italy-2026','在彩色海湾待到傍晚','recommended','从港口的小船和窗户，走到能看见整座村庄的地方。',['18118570','32054738','7611304','30861103']),
 group('italy-together','italy-2026','我们一起走过的地方','people','同一对旅伴，在水边、广场和石柱旁留下四个瞬间。',['29735737','29735738','29735740','29735739']),
 group('italy-glances','italy-2026','看风景，也看看你','people','牵手和对视，比背景里的景点更值得留下。',['29735737','29735739']),
 group('italy-boats','italy-2026','一路遇见的小船','theme','湖上的木船、运河的贡多拉、海港的渔船。',['17815282','8859354','36690045','32054738','17077785']),
 group('italy-facades','italy-2026','忍不住拍下的窗与屋檐','theme','船屋、石桥和海边百叶窗，跨越三站的建筑细节。',['28217989','36690045','32054738','7611304']),
 group('italy-water','italy-2026','清澈的蓝绿','color','山湖、运河与海湾，不同地点留下相近的颜色。',['17815282','17077785','36690045','18118570']),
 group('italy-light','italy-2026','温柔一点的光','color','水边的柔光、暖色外墙和傍晚的海湾。',['29735739','20053305','30861103']),
 group('rail-blue','japan-coast','沿着冬日海岸','recommended','蓝色列车、雪与海。',['13193404']),
 group('rail-silver','rail-notes','开往海边','recommended','铁轨把视线带到远处。',['18546565']),
 group('desert-ridges','desert','走过沙丘','recommended','一处看起伏，一处看沙脊的线条。',['3909922','30374242']),
 group('desert-caravan','desert','等驼队出发','recommended','停下来的驼队、等候的人和沙脊上的队伍。',['35654411','27947497','30320422']),
 group('desert-company','desert','沙漠里的旅人','people','一个背影和一张双人合影，人物保留原始摄影。',['27947497','36579413']),
 group('desert-camels','desert','每次看到驼队','theme','远远望见、走近看，再望着队伍离开。',['35654411','27947497','30320422']),
 group('desert-lines','desert','沙脊的线条','theme','反复被镜头留下的曲线与斜线。',['3909922','30374242']),
 group('desert-light','desert','沙金色的下午','color','沙丘、头巾和夕阳，把暖色分出层次。',['3909922','27947497','30320422','36579413']),
 group('grass-valley','grassland','在山谷里停留','recommended','两座白色毡房，落在绿色山坡上。',['34980659']),
 group('grass-pasture','grassland','在牧场边停下车','recommended','从远处的毡房，走近聚在草坡上的马群。',['28700663','28700649']),
 group('grass-horses','grassland','镜头总会追着马','theme','环境里的小小身影，和走近后的一整群马。',['28700663','28700649']),
 group('grass-yurts','grassland','草地上的毡房','theme','沿路两次把白色毡房放进画面。',['34980659','28700663']),
 group('grass-green','grassland','满眼绿色','color','山坡与牧场，不同深浅的绿。',['34980659','28700663']),
 group('bali-shore','seaside','棕榈与浪线','recommended','从高处看海，浪线沿着岸边展开。',['19137460']),
 group('alpine-bloom','alpine','走进山间花海','recommended','近处的花与远处的山，共同组成这一页。',['16660722']),
];
export const editorialGroups=journeyGroups;
const journey=(id:string,name:string,date:string):Trip=>({id,name,date,photoCount:editorialPhotos.filter(p=>p.tripId===id).length});
// Dates describe demonstration itineraries, never inferred camera metadata.
export const editorialTrips:Trip[]=[
 journey('osaka-2026','2026.04 日本漫游','2026.04.12—04.25'),
 journey('italy-2026','2026.06 山海长假','2026.06.01—06.30'),
 journey('desert','2026.07 旷野漫游','2026.07.01—07.31'),
];
const shelfDetails=[
 ['JAPAN','#FF7967','#FFF0E9','花枝、京都街巷与海岸列车'],
 ['SEA & MOUNTAINS','#5EB9A6','#F0FAF7','山湖、城市、列车与海岛的一段长假'],
 ['OPEN LAND','#F0B267','#FFF2DF','从沙丘到草原，把辽阔收进同一本'],
];
export const allEditorialShelf:ShelfTrip[]=editorialTrips.map((trip,i)=>({id:trip.id,name:trip.name,place:shelfDetails[i][0],note:shelfDetails[i][3],kind:'box',colors:{main:'#fff',secondary:shelfDetails[i][1],accent:shelfDetails[i][1]},theme:{primary:shelfDetails[i][1],paper:shelfDetails[i][2],ink:'#17394C',onPrimary:'#17394C'},date:trip.name.slice(0,7),country:'TRAVEL SAMPLE',photos:editorialPhotos.filter(p=>p.tripId===trip.id).map(p=>({src:p.src,alt:p.label,author:p.author,source:p.source})),motifs:['flower','leaf']}));
// Retain older source sets for saved editions; the shelf focuses on complete itineraries.
export const editorialShelf=allEditorialShelf;
export const editorialTrip=(id:string)=>editorialTrips.find(t=>t.id===curatedTrip(id));
export const editorialGroup=(id:string|null)=>{const current=editorialGroups.find(g=>g.id===id);if(current)return current;const legacy=legacyEditorialGroups.find(g=>g.id===id);return legacy?{...legacy,tripId:curatedTrip(legacy.tripId)}:undefined;};
export const editorialPhoto=(id:string)=>editorialPhotos.find(p=>p.id===id);
export const editorialGroupsForMode=(mode:GroupCategory,id:string)=>editorialGroups.filter(g=>g.tripId===curatedTrip(id)&&g.category===mode);

export interface ArtSticker {id:string;title:string;photoId:string;alsoFrom?:string[];tripId:string;atlas:'japan'|'landscape'|'train'|'terrain'|'coast'|'italy'|'photo'|'journey';cell:number;kind:'object'|'scene'|'atmosphere';anchor:[number,number];medium?:'photo';}
const sticker=(id:string,title:string,photoId:string,atlas:ArtSticker['atlas'],cell:number,kind:ArtSticker['kind'],anchor:[number,number],alsoFrom?:string[]):ArtSticker=>({id,title,photoId:`editorial-${photoId}`,tripId:editorialPhotos.find(p=>p.id===`editorial-${photoId}`)!.tripId,atlas,cell,kind,anchor,alsoFrom:alsoFrom?.map(id=>`editorial-${id}`)});
export const artStickers:ArtSticker[]=[
 sticker('castle','大阪城','31239492','japan',0,'scene',[49,43],['4058521']),
 sticker('sakura','粉樱花枝','31239492','japan',1,'object',[77,68]),
 sticker('lantern','花下灯笼','31239492','japan',2,'object',[87,85]),
 sticker('pagoda','朱红宝塔','31418360','japan',3,'object',[87,49],['4336279']),
 sticker('fuji','富士山','31418360','japan',4,'scene',[47,50],['4336279']),
 sticker('blossom','枝头春色','4058521','japan',5,'object',[22,29]),
 sticker('lake','山与湖','17815282','landscape',0,'scene',[43,43]),
 sticker('boats','湖边木船','17815282','landscape',1,'object',[78,84]),
 sticker('forest','沿岸松林','17815282','landscape',2,'atmosphere',[80,60]),
 sticker('village','彩色海湾','18118570','landscape',3,'scene',[50,50]),
 sticker('quay','岸边小船','18118570','landscape',4,'object',[83,83]),
 sticker('sea','海水的颜色','18118570','landscape',5,'atmosphere',[24,83]),
 sticker('lake-house','湖畔船屋','28217989','italy',0,'scene',[75,56]),
 sticker('oar-boat','木船与船桨','8859354','italy',1,'object',[51,66]),
 sticker('rialto','里亚托桥','36690045','italy',2,'scene',[52,52]),
 sticker('gondola','黑色贡多拉','36690045','italy',3,'object',[60,80],['20053305','29735738']),
 sticker('venice-lamp','水边的绿路灯','29735737','italy',4,'object',[12,40]),
 sticker('green-shutters','绿百叶窗与晾衣绳','32054738','italy',5,'object',[48,35]),
 sticker('blue-train','蓝色列车','13193404','train',0,'object',[29,56]),
 sticker('snow-coast','雪与海','13193404','train',1,'scene',[75,67]),
 sticker('station','海边站牌','13193404','train',2,'object',[62,62]),
 sticker('silver-train','海岸列车','18546565','train',3,'object',[49,72]),
 sticker('tracks','向海的铁轨','18546565','train',4,'scene',[50,91]),
 sticker('horizon','一段海平线','18546565','train',5,'atmosphere',[16,65]),
 sticker('dune-landscape','沙丘与蓝天','3909922','terrain',0,'scene',[50,65]),
 sticker('sand-crest','沙脊的曲线','3909922','terrain',1,'atmosphere',[55,71]),
 sticker('high-dune','云下的沙峰','30374242','terrain',2,'scene',[57,65]),
 sticker('green-valley','山谷与毡房','34980659','terrain',3,'scene',[52,68]),
 sticker('white-yurt','白色毡房','28700663','terrain',4,'object',[50,72]),
 sticker('pasture-horse','牧场里的马','28700663','terrain',5,'object',[65,76]),
 sticker('bali-coast','巴厘岛海岸','19137460','coast',0,'scene',[50,55]),
 sticker('palm','海边棕榈','19137460','coast',1,'object',[68,72]),
 sticker('surf','一道浪花','19137460','coast',2,'atmosphere',[37,59]),
 sticker('flower-mountain','山间花海','16660722','coast',3,'scene',[50,55]),
 sticker('pink-flower','粉色花枝','16660722','coast',4,'object',[37,79]),
 sticker('alpine-tree','山间的树','16660722','coast',5,'object',[52,47]),
 sticker('paper-parasols','两把纸伞','30970483','journey',0,'object',[55,30],['17258243']),
 sticker('bamboo-leaves','竹林里的绿','15829774','journey',1,'object',[75,40]),
 sticker('torii-path','朱红鸟居','30472132','journey',2,'scene',[50,30],['3534660']),
 sticker('turquoise-surf','浪花与沙滩','4321815','journey',3,'atmosphere',[54,62]),
 sticker('yellow-flowers','山前的小黄花','16853153','journey',4,'object',[60,70]),
 sticker('flower-meadow','花甸与云山','16853153','journey',5,'scene',[50,40]),
 // Photographic paper pieces preserve people exactly. These are not AI cutouts.
 ...editorialPhotos.filter(p=>casePhotos.some(c=>c.id===p.id)||['editorial-20027106','editorial-4321815','editorial-22610570','editorial-11562341','editorial-16853153','editorial-28700471','editorial-27987223'].includes(p.id)).map(p=>({id:`paper-${p.id}`,title:p.label,photoId:p.id,tripId:p.tripId,atlas:'photo' as const,cell:0,kind:'scene' as const,anchor:[82,83] as [number,number],medium:'photo' as const})),
];
export const stickersForPhoto=(id:string)=>artStickers.filter(s=>s.photoId===id||s.alsoFrom?.includes(id));
export const stickersForTrip=(id:string)=>artStickers.filter(s=>s.tripId===curatedTrip(id));
export const stickersForPhotos=(ids:string[])=>artStickers.filter(s=>ids.includes(s.photoId)||s.alsoFrom?.some(id=>ids.includes(id)));

// Cover art follows the group's editorial idea as well as its source membership.
const coverSelections:Record<string,string[]>={
 'italy-boats':['oar-boat','boats','gondola','paper-editorial-17077785','paper-editorial-32054738','paper-editorial-36690045'],
 'italy-facades':['green-shutters','lake-house','rialto','paper-editorial-7611304','paper-editorial-32054738','paper-editorial-28217989'],
 'italy-light':['paper-editorial-29735739','paper-editorial-30861103','paper-editorial-20053305','gondola'],
 'japan-blossoms':['sakura','blossom','fuji','pagoda'],
 'japan-roofs':['castle','pagoda','fuji','paper-editorial-17258243'],
 'japan-umbrellas':['paper-editorial-30970483','paper-editorial-17258243'],
};
export const stickersForCover=(ids:string[],groupId?:string)=>{
 const available=stickersForPhotos(ids),selection=coverSelections[groupId??''];
 if(!selection)return available;
 const focused=selection.flatMap(id=>available.filter(s=>s.id===id));
 return focused.length?focused:available;
};
