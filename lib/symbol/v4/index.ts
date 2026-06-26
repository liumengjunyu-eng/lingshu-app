// lib/symbol/v4/index.ts
// V4 Autonomous Growth System — 自主增长体统一入口
// 四大系统：Acquisition Brain / Content Brain / Conversion Brain / Evolution Brain

import { AcquisitionBrain, type AcquisitionStrategy, type AcquisitionChannel } from './acquisition';
import { generateAdaptiveContent, type AdaptiveContentOutput } from './content_brain';
import { ConversionBrain } from './conversion';
import { EvolutionBrain, type SystemState, type EvolvedConfig, type MutationDecision } from './evolution';

export interface V4Engine {
  acquisition: AcquisitionBrain;
  conversion: ConversionBrain;
  evolution: EvolutionBrain;

  /** Run a full V4 cycle against a given profile and state */
  runCycle(profile: any, state: SystemState): V4CycleOutput;
}

export interface V4CycleOutput {
  strategy: AcquisitionStrategy;
  content: AdaptiveContentOutput;
  paywallVariant: { id: string; score: number; text: string };
  evolvedConfig: EvolvedConfig;
  mutation: MutationDecision;
  recommendations: string[];
}

export function createV4Engine(): V4Engine {
  return {
    acquisition: new AcquisitionBrain(),
    conversion: ConversionBrain.create(),
    evolution: EvolutionBrain.create(),

    runCycle(profile: any, state: SystemState): V4CycleOutput {
      const strategy = this.acquisition.generateAcquisitionStrategy(profile);
      const content = generateAdaptiveContent(profile.insight || profile.interpretation?.insight || 'Your patterns are shifting.');
      const paywallVariants = [
        { id: 'urgency', text: 'What happens when you ignore this pattern for another year?' },
        { id: 'identity', text: 'This is what your system needs you to know.' },
        { id: 'truth', text: 'The truth about your recovery deficit.' },
        { id: 'action', text: 'Do nothing and your pattern gets worse. Here is how to change it.' },
      ];
      const paywallVariant = this.conversion.optimizePaywall(paywallVariants);
      const evolvedConfig = this.evolution.evolve(state);
      const recommendations = this.evolution.getRecommendations(state);

      return {
        strategy,
        content,
        paywallVariant,
        evolvedConfig,
        mutation: this.evolution.getMutationHistory().slice(-1)[0],
        recommendations,
      };
    },
  };
}

export { AcquisitionBrain, generateAdaptiveContent, ConversionBrain, EvolutionBrain };
export type { AcquisitionStrategy, AcquisitionChannel, AdaptiveContentOutput, SystemState, EvolvedConfig, MutationDecision };
