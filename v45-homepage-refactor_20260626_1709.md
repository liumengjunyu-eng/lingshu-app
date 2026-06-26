# V4.5 首页重构记录

**时间**: 2026-06-26 17:09-17:15 GMT+8
**Commit**: `5bc84f4` (v45)
**构建**: 28/28 全绿

## 做了什么

首页从"功能堆叠"全面改为"转化心理学设计"，对标 Nebula/Co-Star/hint.app 的入口结构。

### 六层升级

1. **加载序列** — 进页面先走三个状态（Analyzing → Listening → Ready），约 1.6 秒。用户感觉"系统准备理解我"而非"我在使用工具"。

2. **标题升级** — "You are not broken" → "Your symptoms are speaking." 副标题："Most people treat the symptom. Few understand the system behind it." 开始引导症状→系统的认知转换。

3. **动态占位词轮播** — 4 句话自动切换（I feel tired all the time... / I can't switch off my mind... / My body is resting but not recovering... / Something feels off but I don't know why...），3.5 秒间隔。用户下意识找跟自己相似的话，命中时建立心理连接。

4. **背景呼吸响应输入** — 光核随字数等比放大（最多 12%）和变亮（0.12→0.30）。打字时背景在动，产生"它在听"的感知。

5. **CTA 动态切换** — 输入短（<20字符）显示 "Understand My System"，长时变为 "Reveal My Pattern"。揭示感转化率高于开始感。

6. **信任锚点** — 底部改为引用三套体系："Based on Traditional Chinese Medicine, Five Elements Theory, and Behavioral Pattern Analysis."

### 序列时间线
- 0ms: 进入 Loading (Analyzing...)
- 500ms: Listening..
- 1000ms: Ready...
- 1600ms: 标题浮现 (Your symptoms are speaking.)
- 2400ms: 输入框浮现
- 3000ms: CTA 按钮浮现
- 轮播 3500ms 切换

## 待完成
- **push**: commit 已进入本地 main，需要用户通过 GitHub Desktop 推送
- **下一步建议**: 诊断页重构（当前流失率高的核心页面）
