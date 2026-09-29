# 旅印所 Trip Press

React + TypeScript + Framer Motion + CSS Modules 的竖屏手机 App 原型。白底、墨蓝文字、珊瑚红打印机、旅行照片与白边贴纸贯穿所有场景，没有底部导航。

## 运行

Node.js 22+、pnpm；执行 `pnpm install`、`pnpm dev`，打开 http://127.0.0.1:5173 。验证命令：`pnpm test`、`pnpm build`、`pnpm test:e2e`。Playwright 使用本机 Microsoft Edge。

## 页面职责

- **首页 / tripShelf**：上方打印机直接打开浏览器照片选择器；取消停在首页。确认照片后，在打印机区域播放约 4 秒的落下、散开与成组动画，然后进入新旅行工作桌。没有空桌面中转页。
- **工作桌 / workspace**：这一刻、我们、一路发现、同一种感觉；始终选择完整照片组。大阪保留原 13 个唯一组和分类映射；本机照片暂按导入顺序每 8 张成组，各视角显示同一组数据并注明智能分类待接入。
- **照片组 / groupDetail**：翻页、放大、缩放、长按信息、重排、移出、候补替换、恢复、改名、撤销；调整可跳过。
- **印刷 / printing**：约 4 秒的本地生成演示，有失败与重试。本机照片不展示大阪示例人物或假装提取出的贴纸。
- **发布包 / gallery**：一次印制的封面、六张轮播、拼贴、配文与示例贴纸。保存与分享明确模拟，配文复制、透明 PNG 导出实际在浏览器执行。大阪 10 件，本机旅行未生成贴纸，保留 9 件照片排版与配文。
- **旅行贴纸册 / stickerCollection**：首页右上角查看全部旅行；工作桌进入当前旅行。以有主题色的纸页收集独立物件，点开查看参考照片、导出单枚贴纸。当前素材为明确标注的手绘主题示例；本机照片没有识别结果时显示收藏空状态。相关发布包有独立文字入口，不把封面与配文当成贴纸。

## 相册与本机照片

首页保留 8 本演示相册及横向书架：原生滑动、吸附、左右按钮、键盘；各预览窗共享相册主题色。大阪可完整演示，其余静态样册用于展示主题。打印机上方始终使用三张卡通风明信片。

`src/data/localTrips.ts` 管理本次会话的本机照片及 Blob URL。读取过程按张顺序执行，预览图最长边 1600px、JPEG 质量 .86；取消、失败会释放临时 URL，并停止继续解码。原文件不修改、不上传。一次最多 120 张、合计 200 MB、单张 20 MB；无法解码的 HEIC 或损坏图片显示说明，可重新选取。

新导入旅行和编辑仅保留在本次浏览中，刷新、关闭后重置。尚未读取 EXIF，不用文件修改时间伪装拍摄时间；主题色提取、人物识别、贴纸生成均未接入。

## 手机体验

主画幅 390×844，同时适配 375×812、393×852、430×932。`100dvh`、`viewport-fit=cover`、顶部/底部 `env(safe-area-inset-*)`；桌面仅居中展示手机。旋转显示竖屏提示，状态保留。

所有触控目标至少 44px；场景主操作至少 52px。触摸反馈、可选轻振动、左边缘返回及按钮替代保留。Reduce Motion 使用淡入淡出。`MobileSheet` 使用原生 dialog、焦点恢复与 visualViewport 键盘避让；场景返回恢复滚动和当前照片。

## 关键模块

| 模块 | 职责 / 后续替换 |
| --- | --- |
| `src/state/flow.ts` | 唯一场景状态、旅程作用域、编辑快照及发布包；后续接持久化 |
| `src/data/localTrips.ts` | 真实本机文件读取与会话素材；原生版替换相册权限、文件缓存与 EXIF 读取 |
| `TripShelf.tsx` / `HomeImportAnimation.tsx` | 原位选图与整理动效；接真实任务进度 |
| `src/data/mock.ts` | 大阪示例分组及本地排版数据；替换图片分析、聚类、文案服务 |
| `StickerCollection.tsx` | 全局/旅程收藏、参考来源、单枚导出；替换真实元素资产与收藏数据库 |
| `TravelElement.tsx` / `SceneIllustration.tsx` | 手工 SVG 示例；替换与选中照片关联的抠图和插画，人物保留摄影 |
| `Gallery.tsx` / `exportStickers.ts` | 发布包、预览、复制、PNG；保存分享接原生相册和系统分享 |
| `src/components/mobile/` | App 壳、安全区、纸张、印章按钮、底部面板、图片容错 |

旧 `ImportDesk.tsx` 与 `TravelContainer.tsx` 保留为未使用组件，不再连接到用户流程。风景来源见 [风景照片说明](public/assets/landscapes/attribution.html)，大阪素材见 [照片许可](public/assets/photos/attribution.html)。

最新改版设计见 [首页与收藏设计](docs/superpowers/specs/2026-09-27-home-collection-design.md)。前轮手机测试记录为 [2026-09-26 验证](docs/mobile-audit.md)，本轮见 [2026-09-27 验证](docs/home-collection-validation.md)。浏览器模拟不替代 iOS/Android 真机键盘、照片库权限、硬件帧率和峰值内存检查。

