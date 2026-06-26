# LINGSHU SYSTEM ARCHITECTURE AUDIT MAP

Version: V3 → V4 transition checkpoint
Purpose: Ensure no module loss, duplication, or orphan logic exists

---

# 1. SYSTEM CORE FLOW (MUST EXIST)

This product must always maintain the following execution chain:

Input Layer
→ Symptom Collection (5-question Diagnose System)

↓

Signal Engine Layer
→ Converts raw input into structured system state

↓

Decision Engine Layer
→ Generates:
- actions
- warnings
- prohibitions
- recovery protocol

↓

Recovery Pathway Layer
→ 3-phase structured behavior correction system

↓

Output Layer
→ Result Page:
- Free diagnostic layer (shock + recognition)
- Paid explanation layer (WHY + trajectory)
- Share layer (identity output)

---

# 2. ACTIVE MODULES (CURRENTLY REQUIRED)

## lib/symbol/v2/
- engine.ts ✔ CORE SYSTEM ENGINE
- decision.ts ✔ DECISION ENGINE

## app/
- diagnose/ ✔ INPUT COLLECTION
- result/ ✔ OUTPUT + PAYWALL
- share/ ✔ IDENTITY EXPORT (if enabled)

---

# 3. RECOVERY SYSTEM (MUST NOT BREAK)

Recovery Pathway Structure:

Phase 1 → Stop Doing Layer
Phase 2 → Start Doing Layer
Phase 3 → Maintenance / Tool Layer

Rules:
- Each phase MUST map to at least one action
- Product mapping is OPTIONAL (can be null)
- No phase should be empty

---

# 4. DEPRECATED / ARCHIVED MODULES

These must NOT be imported in runtime:

## omega layer (REMOVED)
- lib/omega/plus ❌ deprecated
- lib/omega/plusplus ❌ deprecated
- lib/omega/infinity ❌ deprecated

Status:
→ Isolated in /_archive, zero runtime dependencies confirmed

---

# 5. UI SYSTEM RULES

## Result Page Rules:
- Free layer = recognition shock ONLY
- Paid layer = explanation + trajectory + recovery path
- Share layer = identity expression

DO NOT:
- show recovery pathway in free layer
- show product catalog outside recovery path
- mix decision engine output into UI without gating

---

# 6. LANGUAGE SYSTEM (GLOBAL RULE)

System terminology must follow:

- energy_level → system operating capacity
- stress_level → compression pressure
- fatigue_type → cost pattern
- recovery_speed → recharge velocity
- warning → risk signal
- product → recovery tool

Rule:
→ All UI-facing text MUST use metaphorical system language

---

# 7. CRITICAL DEPENDENCIES CHECK

The system is INVALID if any of the following occur:

❌ decision.ts not imported in engine.ts
❌ recovery_pathway missing in V2Output
❌ result page uses product_mapping (old system)
❌ omega modules referenced in runtime
❌ share system missing identity generator

---

# 8. VALIDATION CHECKLIST (BEFORE DEPLOY)

Run mental or CI check:

[ ] Input → Engine → Decision → Output chain complete
[ ] Recovery Pathway exists and renders
[ ] Paywall is isolated
[ ] Share layer exists (even minimal)
[ ] No omega imports in runtime
[ ] No orphan modules in lib/

---

# 9. SYSTEM PRINCIPLE

This system is valid only if:

> Every user input produces:
> - a diagnosis
> - a decision constraint
> - a recovery direction
> - a shareable identity artifact

If any layer is missing → system is incomplete

---

END OF SYSTEM MAP
