import type {EditorialPhoto} from './editorial';

// A curated composite itinerary, not claimed to be one person's actual camera roll.
// Only the four Carlo Betttuolo blue-dress frames are treated as the same people.
const photo=(id:string,tripId:string,label:string,location:string,author:string,slug:string,selection:EditorialPhoto['selection']='recommended'):EditorialPhoto=>({
 id:`editorial-${id}`,tripId,label,location,author,source:`https://www.pexels.com/photo/${slug}-${id}/`,src:`./assets/editorial/${id}.jpg`,takenAt:'公开摄影样片 · 拍摄日期未读取',selection,
 reason:selection==='recommended'?'构图与主体明确，供旅行片段、人物和视觉主题的交叉分组演示。':'保留在素材中；不把不同人物或重复视角硬放入推荐组。',
});
export const casePhotos:EditorialPhoto[]=[
 photo('17077785','italy-2026','两个人划过湖面','意大利 · 布莱埃斯湖','Consuelo Borroni','people-boating-on-lake'),
 photo('8859354','italy-2026','船桨与透明的湖水','意大利 · 布莱埃斯湖','Иван Лемехов','wooden-rowboat-docked-in-clear-alpine-lake'),
 photo('28217989','italy-2026','湖畔船屋的倒影','意大利 · 布莱埃斯湖','eberhard grossgasteiger','a-wooden-house-on-a-lake-surrounded-by-mountains'),
 photo('29735737','italy-2026','牵手走过水边','意大利 · 威尼斯','carlo bettuolo','romantic-couple-stroll-in-venice-at-sunrise'),
 photo('29735738','italy-2026','在贡多拉旁合影','意大利 · 威尼斯','carlo bettuolo','romantic-couple-by-gondolas-in-venice-italy'),
 photo('29735740','italy-2026','走过圣马可广场','意大利 · 威尼斯','carlo bettuolo','romantic-couple-in-st-mark-s-square-venice'),
 photo('29735739','italy-2026','石柱旁的对视','意大利 · 威尼斯','carlo bettuolo','romantic-venetian-couple-at-sunset'),
 photo('29735715','italy-2026','水边的另一对旅人','意大利 · 威尼斯','carlo bettuolo','romantic-couple-embracing-in-venice-italy','materials'),
 photo('36690045','italy-2026','贡多拉经过里亚托桥','意大利 · 威尼斯','Eugenia Sol','gondola-under-rialto-bridge-in-venice'),
 photo('20053305','italy-2026','大运河的柔光','意大利 · 威尼斯','Ozan Tabakoğlu','gondola-on-canal-grande-in-venice'),
 photo('32054738','italy-2026','绿百叶窗下停着小船','意大利 · 里奥马焦雷','Daciana Cristina Visan','colorful-boats-docked-in-italian-village'),
 photo('7611304','italy-2026','转过海港的街角','意大利 · 里奥马焦雷','Batın Özen','photo-of-cinque-terre-in-italy'),
 photo('30861103','italy-2026','海湾的傍晚','意大利 · 里奥马焦雷','Duc Tinh Ngo','colorful-coastal-village-in-riomaggiore-italy'),
 photo('12406341','italy-2026','提着行李走进小巷','意大利 · 威尼斯','Anastasiia Lopushynska','woman-with-suitcase-walking-venice-street','materials'),
 photo('30472132','osaka-2026','鸟居下，一起看照片','日本 · 京都','Mano JI','couple-in-traditional-kimono-at-fushimi-inari'),
 photo('15829774','osaka-2026','沿着竹林慢慢走','日本 · 京都','Willian Justen de Vasconcellos','couple-in-traditional-japanese-clothing-walking-in-the-bamboo-forest'),
 photo('30970483','osaka-2026','两把伞下的背影','日本 · 京都','Andrea De Santis','traditional-kimono-fashion-in-kyoto-s-streets'),
 photo('5463374','osaka-2026','一起走过朱红的回廊','日本 · 京都','Kodi Kodama','people-wearing-traditional-kimonos-walking-near-a-red-and-black-temple'),
 photo('3534660','osaka-2026','鸟居下的留影','日本 · 京都','Kassandre Pedro','people-in-traditional-oriental-shrine'),
 photo('17258243','osaka-2026','宝塔前的合影','日本 · 京都','Agustin Villalba','woman-and-man-in-traditional-clothing-posing-with-pagoda-in-town-behind'),
 photo('3011702','osaka-2026','巷子里的灯笼与行人','日本 · 京都','Satoshi Hirayama','two-women-wearing-kimono','materials'),
 photo('35654411','desert','驼队停下来休息','摩洛哥 · 撒哈拉','laura parenti','camel-caravan-in-the-sahara-desert-landscape'),
 photo('30320422','desert','沿着沙脊出发','摩洛哥 · 梅尔祖卡','mourad barkassi','camel-caravan-crossing-sahara-desert-dunes'),
 photo('27947497','desert','坐下来等一会儿','摩洛哥 · 撒哈拉','Hamza El Asely','morocco-sahara-desert'),
 photo('36579413','desert','日落前的合影','摩洛哥 · 马拉喀什近郊','Mike Art','romantic-couple-at-sunset-in-moroccan-desert'),
 photo('28700649','grassland','草坡上聚在一起的马','中国 · 新疆','Rain Lü','group-of-horses-grazing-in-xinjiang-grassland'),
];
