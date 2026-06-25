# V3 Deep Report 闭环首次上线

**Commit:** `ef8b3ff`
**时间:** 2026-06-26 06:00 GMT+8

## 目标
让 V3（Symbol OS）第一次在用户路径上跑通：diagnose → Deep Report。

## 改动
1. **`app/diagnose/page.tsx`** — 终点从 `/report` 改为 `/deep-report`
2. **`lib/symbol/v3/mapper.ts`** — 新文件，把 diagnose 的 5 题答案映射为 V2 Symbol Engine 的 HumanInput 类型
3. **`app/deep-report/page.tsx`** — 新文件，V3 前端展示页（约 23KB），6 部分：
   - Recovery Debt + 五行失衡 + 镜像句
   - 人格原型 + 五行柱 + 冲突检测
   - 7天/30天风险预测
   - 5 领域决策建议（Tab 切换）
   - 进化趋势（第二次回访才有）
   - 邮箱收集（付费入口）

## 数据流
```
diagnose → localStorage → mapper.ts → runSymbolEngine() → SymbolOutput
                                                                ↓
                                              generateDeepReport() → 6 部分渲染
                                              runDecisionEngine() → 5 领域决策
                                              analyzeEvolution() → 趋势（如已有记忆）
                                              SymbolMemory (localStorage) ← saveSnapshot
```

## 状态
- Build 全绿（27 pages, 0 type errors）
- 已推送 GitHub + Vercel 部署中
- 仍需用户操作：Supabase 建表 + `.env.local`/Vercel 环境变量（不影响核心用户路径）
