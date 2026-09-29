# Trip Press · 清新旅行手账视觉更新

本轮依据用户的新方向，将原先高饱和红橙色改为奶白、薄荷绿主色，蜜桃粉、雾蓝、奶油黄作为小面积点缀。保留五场景、导入置顶、整组选择与印刷发布流程。

## 收集的参考

- [MIDORI Journal Sticker](https://www.midori-japan.co.jp/english/products/journal-sticker/)：手账标签、纸张分区和小面积装饰。
- [MIDORI Yuru Log](https://www.midori-japan.co.jp/english/products/yurulog/)：轻松的留白和旅行主题插画。
- [Eve Anderson Travel Sticker Sheet](https://eveandersondraws.com/products/travel-sticker-sheet-travel-stickers)：旅行箱、相机、明信片、白边裁切与统一淡色。仅参考视觉原则，不复制其贴纸素材。
- [Papier Daydreaming](https://www.papier.com/us/daydreaming-52184)：旅行日记的封面层次和独立文具品牌感。
- [Snap Click Supply Camera Stamp](https://www.snapclicksupply.com/digital-products/camera-stamp-print-cut-file/)：相机和邮票结合的标识方向。仅作概念参考，不使用其图形。

## 落地方案

- 原创 Logo：薄荷绿的相机/印刷机，吐出一张蜜桃色照片；白边、不对称轮廓，搭配深森林绿「旅印所」。同时更新 favicon。
- 原创 SVG 贴纸组：旅行箱与车票、大阪街屋、帆船、雨伞、花朵。全部本地文件，无远程图片依赖。
- 旅行盒子：导入在顶部变为轻巧的插画邀请纸签；旅行收藏以白色标签、照片及彩色纸面呈现，减少大色块与粗重投影。
- 工作桌与详情：清淡纸面、统一细线与柔和胶带，保留真实照片的对比度；罗盘、操作纸签采用一致的色彩层次。
- 印刷与作品墙：统一新色板；真实人物照片保留，作品中红色仍作为主题线索。
- 继续支持 44px 触控、安全区、键盘避让和 Reduce Motion。不引入新流程、远程字体或位图装饰负担。

资产：`public/assets/brand/trip-press-mark.svg`、`public/assets/brand/travel-stickers.svg`。

## 验证结果

- 四个手机尺寸（375×812、390×844、393×852、430×932）及 Reduce Motion：主流程、导入、旅行盒子、触控和安全区 25 项通过。
- 作品墙、透明 PNG、配文、键盘、图片失败、旋转及返回状态专项：20 项通过；另 2 项因旧测试固定了原色板而失败，更新颜色预期后复跑均通过。总计 47 项浏览器用例通过。
- 22 项单元测试通过，TypeScript 检查与 Vite 生产构建通过。
- 主按钮对比度约 4.63:1；深色小字在作品墙纸面上约 4.56:1；罗盘选中态约 4.66:1；导入提示约 5.11:1。数值为不含纹理的基础颜色计算。
- 新 Logo 与五枚界面贴纸的 SVG 合计约 6KB；无新增远程素材、字体或图片服务。真实人物照片及透明 PNG 内的人物像素保持原摄影素材。
- 截图检查覆盖五个主场景与四个手机尺寸；以上为浏览器模拟，不是实机性能验收。

界面截图：[旅行盒子](visual-refresh-shelf.png) · [作品墙](visual-refresh-gallery.png)。
