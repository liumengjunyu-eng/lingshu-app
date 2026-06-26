/** @v4 - System Auditor: validates output integrity at runtime */
export function auditSystem(output: any) {
  const issues: string[] = [];

  if (!output.decision) issues.push('missing decision layer');
  if (!output.recovery_pathway) issues.push('missing recovery pathway layer');
  if (!output.user_profile) issues.push('missing user profile');
  if (!output.interpretation) issues.push('missing interpretation layer');
  if (!output.signals) issues.push('missing signal data');

  // Decision integrity
  if (output.decision) {
    if (!Array.isArray(output.decision.actions)) issues.push('decision.actions is not an array');
    if (!Array.isArray(output.decision.warnings)) issues.push('decision.warnings is not an array');
    if (!Array.isArray(output.decision.prohibitions)) issues.push('decision.prohibitions is not an array');
  }

  // Recovery pathway integrity
  if (output.recovery_pathway) {
    ['phase_1', 'phase_2', 'phase_3'].forEach((phase) => {
      if (!output.recovery_pathway[phase]) issues.push(`recovery_pathway.${phase} missing`);
      else if (!output.recovery_pathway[phase]?.action) issues.push(`recovery_pathway.${phase}.action missing`);
    });
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
