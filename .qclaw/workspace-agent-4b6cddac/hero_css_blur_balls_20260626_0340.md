# Hero 改造落地记录

**时间：** 2026-06-26 03:40 GMT+8

**目标：** Canvas 呼吸球 → CSS 模糊球 + 场景化文案 + 极简结果页（保留）+ 无假数据分享卡（保留）

## 实际完成

### 核心改动
1. **Hero.tsx**（新文件）：CSS 模糊球（3层渐变blur圆球，GPU加速）+ 场景化文案 + 5语言翻译
2. **tailwind.config.js**：新增 `cream`/`forest`/`ink` 色值 + `breath-slow`/`pulse-slow`/`float-slow` keyframes
3. **app/[locale]/page.tsx**：从 HookLine 改为 Hero 组件
4. **lib/i18n/context.tsx**：`useTranslations` 返回 `{ t, rich }` 解构形式（向后兼容；diagnose/page.tsx 已适配）
5. **messages/{zh,en,zh-TW,ja,ko}.json**：5语言 5 键（heroTitle/heroTitleEm/heroSubtitle/learnMore/heroMeta）

### 明确不动的
- `result/page.tsx`（免 i18n）：保留真实 persona + ShareCard 完整体验
- `[locale]/result`：保留四级恢复标签 + 五维组件
- `ShareCard.tsx`：已接 html2canvas + 埋点，不改
- 所有现有诊断/报告/付费页面：不动

## 构建结果
- `npm run build` 全绿通过，13/13 静态页面
- `commit 2076a9f` → 已推送至 GitHub main → Vercel 自动部署中
