# 回退到 V6 + 推送部署

**Objective:** 从 V2.4 回退到 V6（Vercel 可构建版本），修复 V7+ 类型错误，重新上线。

**Action:**
1. 确认远程 HEAD 在 `b15055a`（强制回退结果）
2. 本地 `git reset --hard ac6eb40`（V6 commit `填：v6: autonomous growth system`）
3. 绕过 `_BINARY` 环境变量污染问题，通过 `node next build` 直接构建
4. 构建通过：27/27 全绿
5. `git push origin main --force` 推送成功

**Current state:**
- 本地和远程均在 V6 commit `ac6eb40`
- Vercel 自动构建中
- 核心功能：FREEZE 5题诊断 → 结果 → Life Graph 路径可用
- V7+ 层（V7/V8/Ω/∞/META/BLACK/Singularity）未推送

**Remaining issues:**
- V7 `intensity_score` 类型错误根因：V4+ 类型定义中 `emotionProfile[]` 的字段为可选（`?`），但 V7 直接当作必填使用
- Shell 环境 `_BINARY` 污染依旧存在，本地通过 `node直接调用next二进制` 绕过
- commit-fix.bat 已在 V2.4 回退时丢弃
