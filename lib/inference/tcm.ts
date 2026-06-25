// lib/inference/tcm.ts
import { Wuxing, TCMResult } from './types';

const WUXING_ORGANS: Record<string, { zang: string; fu: string; emotion: string }> = {
  '\u6728': { zang: '\u809d', fu: '\u80c6', emotion: '\u6012' },
  '\u706b': { zang: '\u5fc3', fu: '\u5c0f\u80a0', emotion: '\u559c' },
  '\u571f': { zang: '\u813e', fu: '\u80c3', emotion: '\u601d' },
  '\u91d1': { zang: '\u80ba', fu: '\u5927\u80a0', emotion: '\u60b2' },
  '\u6c34': { zang: '\u80be', fu: '\u8180\u80f1', emotion: '\u6050' },
};

const CONSTITUTIONS: Record<string, {
  name: string; description: string; recommendation: string[]; foodAdvice: string[];
}> = {
  '\u5e73\u548c\u8d28': {
    name: '\u5e73\u548c\u8d28',
    description: '\u9634\u9633\u6c14\u8840\u8c03\u548c\uff0c\u4f53\u6001\u9002\u4e2d\uff0c\u9762\u8272\u7ea2\u6da6\uff0c\u7cbe\u529b\u5145\u6c9b\u3002',
    recommendation: ['\u4fdd\u6301\u89c4\u5f8b\u4f5c\u606f', '\u5747\u8861\u996e\u98df', '\u9002\u5ea6\u8fd0\u52a8', '\u907f\u514d\u8fc7\u5ea6\u52b3\u7d2f'],
    foodAdvice: ['\u4e94\u8c37\u6742\u7cae', '\u65b0\u9c9c\u852c\u679c', '\u4f18\u8d28\u86cb\u767d', '\u9002\u91cf\u996e\u6c34'],
  },
  '\u6c14\u865a\u8d28': {
    name: '\u6c14\u865a\u8d28',
    description: '\u5143\u6c14\u4e0d\u8db3\uff0c\u75b2\u4e4f\u3001\u6c14\u77ed\u3001\u81ea\u6c57\u3002',
    recommendation: ['\u8865\u6c14\u4e3a\u4e3b', '\u907f\u514d\u8fc7\u5ea6\u52b3\u7d2f', '\u89c4\u5f8b\u4f5c\u606f', '\u9002\u5ea6\u8fd0\u52a8'],
    foodAdvice: ['\u9ec4\u82aa\u3001\u515a\u53c2', '\u5c71\u836f\u3001\u5927\u67a3', '\u9e21\u8089\u3001\u725b\u8089', '\u5c0f\u7c73\u3001\u7cb3\u7c73'],
  },
  '\u9633\u865a\u8d28': {
    name: '\u9633\u865a\u8d28',
    description: '\u9633\u6c14\u4e0d\u8db3\uff0c\u754f\u5bd2\u6015\u51b7\u3001\u624b\u8db3\u4e0d\u6e29\u3002',
    recommendation: ['\u6e29\u9633\u6563\u5bd2', '\u6ce8\u610f\u4fdd\u6696', '\u9002\u5ea6\u8fd0\u52a8', '\u907f\u514d\u751f\u51b7'],
    foodAdvice: ['\u751f\u59dc\u3001\u8089\u6842', '\u7f8a\u8089\u3001\u725b\u8089', '\u6838\u6843\u3001\u677f\u6817', '\u97ed\u83dc\u3001\u8471\u849c'],
  },
  '\u9634\u865a\u8d28': {
    name: '\u9634\u865a\u8d28',
    description: '\u9634\u6db2\u4e8f\u5c11\uff0c\u53e3\u71e5\u54bd\u5e72\u3001\u624b\u8db3\u5fc3\u70ed\u3002',
    recommendation: ['\u6ecb\u9634\u6da6\u71e5', '\u907f\u514d\u71ac\u591c', '\u51cf\u5c11\u8f9b\u8fa3', '\u4fdd\u6301\u60c5\u7eea\u7a33\u5b9a'],
    foodAdvice: ['\u767e\u5408\u3001\u94f6\u8033', '\u6781\u679d\u3001\u6851\u8393', '\u68a8\u3001\u8378\u8398', '\u9e2d\u8089\u3001\u732a\u8089'],
  },
  '\u75f0\u6e7f\u8d28': {
    name: '\u75f0\u6e7f\u8d28',
    description: '\u75f0\u6e7f\u51dd\u805a\uff0c\u5f62\u4f53\u80a5\u80d6\u3001\u8179\u90e8\u80a5\u6ee1\u3002',
    recommendation: ['\u5065\u813e\u6d47\u6e7f', '\u63a7\u5236\u996e\u98df', '\u589e\u52a0\u8fd0\u52a8', '\u907f\u514d\u6cb9\u817b'],
    foodAdvice: ['\u8568\u7c73\u3001\u8d64\u5c0f\u8c46', '\u51ac\u74dc\u3001\u767d\u841d\u535c', '\u9648\u76ae\u3001\u82cf\u83b1', '\u6e05\u6de1\u852c\u83dc'],
  },
};

const WX_TO_ZANG: Record<string, string> = {
  '\u6728': '\u809d', '\u706b': '\u5fc3', '\u571f': '\u813e', '\u91d1': '\u80ba', '\u6c34': '\u80be',
};

function sortWuxingDesc(wuxing: Wuxing): [string, number][] {
  return Object.entries(wuxing).sort((a, b) => b[1] - a[1]);
}

export function getTCMInfo(wuxing: Wuxing, isWeak: boolean, dayMasterWuxing: string): TCMResult {
  const sorted = sortWuxingDesc(wuxing);
  const dominant = sorted[0][0];

  // 确定体质类型
  let constitutionType = '\u5e73\u548c\u8d28';
  if (isWeak) {
    const weakMap: Record<string, string> = {
      'wood': '\u6c14\u865a\u8d28', 'fire': '\u9634\u865a\u8d28',
      'earth': '\u6c14\u865a\u8d28', 'metal': '\u9634\u865a\u8d28', 'water': '\u9633\u865a\u8d28',
    };
    constitutionType = weakMap[dayMasterWuxing] || '\u6c14\u865a\u8d28';
  } else {
    const map: Record<string, string> = {
      'wood': '\u6c14\u90c1\u8d28', 'fire': '\u9634\u865a\u8d28',
      'earth': '\u75f0\u6e7f\u8d28', 'metal': '\u6c14\u865a\u8d28', 'water': '\u9633\u865a\u8d28',
    };
    constitutionType = map[dominant] || '\u5e73\u548c\u8d28';
  }

  const data = CONSTITUTIONS[constitutionType] || CONSTITUTIONS['\u5e73\u548c\u8d28'];

  // 找到最弱和最强的五行对应脏腑
  const weakest = sorted[sorted.length - 1][0];
  const strongest = sorted[0][0];
  const organs: string[] = [];
  if (WUXING_ORGANS[weakest]) organs.push(WUXING_ORGANS[weakest].zang);
  if (strongest !== weakest && WUXING_ORGANS[strongest]) organs.push(WUXING_ORGANS[strongest].zang);

  // 情绪（对应最弱的脏腑之志）
  const emotion = WUXING_ORGANS[weakest]?.emotion || '\u601d';

  return {
    constitution: data.name,
    description: data.description,
    organs,
    emotion,
    recommendation: data.recommendation,
    foodAdvice: data.foodAdvice,
  };
}
