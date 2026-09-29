# 旅行盒子与导入空状态

目标：保留五场景与现有内容，完善 tripShelf 的收藏、空桌面和模拟导入三个子状态。
技术：沿用 React、TypeScript、Framer Motion、CSS Modules。

- [x] 在 `src/state/flow.ts` 增加 shelfView（collection/empty/importing）和 importStep。OPEN_IMPORT 打开空桌面，START_IMPORT 开始，ADVANCE_IMPORT 更新至第4步，COMPLETE_IMPORT 进入推荐工作桌。BACK 从导入返回空桌面，再返回收藏；取消后忽略晚到回调。不得重置 drafts/editions。
- [x] `src/data/tripShelf.ts` 定义四只旅行容器的独立颜色、形状和文案。大阪是实用入口，其他打开明确的静态样盒面板，避免假入口和误进入大阪。
- [x] `src/components/tripShelf/TravelContainer.tsx` 绘制纸盒、胶卷盒、信封和夏日纸盒。新旅行入口使用空牛皮纸盒。采用 CSS/SVG、纸纹、胶带与柔和阴影，所有入口整体可触摸。
- [x] `ImportDesk.tsx` 绘制打开的旅行箱、空白拍立得和彩色胶带。说明与按钮使用用户原文。模拟导入复用大阪83张示例数据，并明确提示。五个可见阶段在约4.5秒内完成：落下、散开、靠近、成堆、罗盘出现；只动画 transform/opacity，Reduce Motion 改为渐显。
- [x] `TripShelf.tsx` 组合子状态；`App.tsx` 接入 reducer、返回按钮与手势、模态开关。导入时可取消，返回后计时器清理。
- [x] 先验证 reducer 中取消、完成与已有数据保留，再浏览器检查四入口、模拟导入、取消重试、无文件上传、手机尺寸、安全区、Reduce Motion，回归现有旅程链。

静态旅行不接工作桌，不新增多旅行分类数据；导入是现有大阪示例的演示路径，不创建重复旅行。新增子状态保持在 tripShelf 中，不改变五个顶层场景。

验证：22 项单元测试通过；25 项浏览器检查通过，覆盖三个手机尺寸、桌面手机预览与 Reduce Motion，包含新增旅行盒子、静态样盒、空状态、导入取消重试和原有五场景完整路径。TypeScript 与 Vite 生产构建通过。人工查看 390px/375px 带安全区空状态及照片成堆截图；只读代码审查未发现明确缺陷。
