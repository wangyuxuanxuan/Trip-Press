# 旅印所 · 手机 App 视觉系统

保留 React / TypeScript / Framer Motion / CSS Modules、五场景、reducer 和场景转场。此次只完善移动外壳、色彩、纸感基础组件与触摸反馈。

- 外壳：100dvh，375–430px 手机宽度；桌面只居中显示390×844参考画幅。viewport-fit=cover；顶部、底部使用 env 安全区。固定顶部上下文，内部滚动；场景切换回到内部滚动起点。
- 视觉：奶油白底、珊瑚红主色、金橙辅助，少量黄/湖蓝/绿；SVG纸纤维与低透明印刷颗粒。照片保持占位；提供真实照片src接口，不新增相册内容。
- 组件：MobileAppShell、SafeAreaScene、PaperSurface、PhotoCard、PhotoStack、PaperLabel、Tape、StampButton、CompassShell、PrintMachineShell、ArtworkFrame、StickerAsset、HandDrawnIcon、MobileSheet、ContextualAction。
- 交互：44px最小触控目标，按压缩放/阴影；可用时轻振动，失败静默降级。左边缘向右滑返回，有始终可见的返回按钮；纵向滚动不触发返回。信息按钮打开可关闭且焦点受控的旅程信息底部面板。
- 不增加分类逻辑、印刷流程、作品内容、真实AI、上传、导出、持久导航或横屏专属布局。

验证顺序：先写手机外壳/手势/面板回归测试并观察旧实现失败；再实现组件并接入现有场景；运行状态测试、375×812 / 390×844 / 430×932 /桌面居中/Reduce Motion浏览器测试与构建；查看截图。
