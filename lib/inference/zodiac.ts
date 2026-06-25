// lib/inference/zodiac.ts
import { ZodiacResult } from './types';

const ZODIAC_DATA: Record<string, Omit<ZodiacResult, 'name'>> = {
  '\u767d\u7f8a\u5ea7':  { element: '\u706b', quality: '\u57fa\u672c', traits: ['\u70ed\u60c5','\u679c\u65ad','\u76f4\u63a5','\u52c7\u6562'], compatibility: ['\u72ee\u5b50\u5ea7','\u5c04\u624b\u5ea7'], ruler: '\u706b\u661f' },
  '\u91d1\u725b\u5ea7':  { element: '\u571f', quality: '\u56fa\u5b9a', traits: ['\u7a33\u5b9a','\u52a1\u5b9e','\u8010\u5fc3','\u575a\u6301'], compatibility: ['\u5904\u5973\u5ea7','\u6469\u7faf\u5ea7'], ruler: '\u91d1\u661f' },
  '\u53cc\u5b50\u5ea7':  { element: '\u98ce', quality: '\u53d8\u52a8', traits: ['\u7075\u6d3b','\u597d\u5947','\u5584\u4e8e\u6c9f\u901a','\u591a\u53d8'], compatibility: ['\u5929\u79e4\u5ea7','\u6c34\u74f6\u5ea7'], ruler: '\u6c34\u661f' },
  '\u5de8\u87f9\u5ea7':  { element: '\u6c34', quality: '\u57fa\u672c', traits: ['\u654f\u611f','\u5173\u6000','\u76f4\u89c9\u5f3a','\u5bb6\u5ead\u5bfc\u5411'], compatibility: ['\u5929\u874e\u5ea7','\u53cc\u9c7c\u5ea7'], ruler: '\u6708\u4eae' },
  '\u72ee\u5b50\u5ea7':  { element: '\u706b', quality: '\u56fa\u5b9a', traits: ['\u81ea\u4fe1','\u6162\u6168','\u9886\u5bfc\u529b','\u70ed\u60c5'], compatibility: ['\u767d\u7f8a\u5ea7','\u5c04\u624b\u5ea7'], ruler: '\u592a\u9633' },
  '\u5904\u5973\u5ea7': { element: '\u571f', quality: '\u53d8\u52a8', traits: ['\u7ec6\u81f4','\u5206\u6790\u529b\u5f3a','\u52a1\u5b9e','\u5b8c\u7f8e\u4e3b\u4e49'], compatibility: ['\u91d1\u725b\u5ea7','\u6469\u7faf\u5ea7'], ruler: '\u6c34\u661f' },
  '\u5929\u79e4\u5ea7': { element: '\u98ce', quality: '\u57fa\u672c', traits: ['\u5e73\u8861','\u793e\u4ea4','\u4f18\u96c5','\u516c\u6b63'], compatibility: ['\u53cc\u5b50\u5ea7','\u6c34\u74f6\u5ea7'], ruler: '\u91d1\u661f' },
  '\u5929\u874e\u5ea7': { element: '\u6c34', quality: '\u56fa\u5b9a', traits: ['\u6df1\u523b','\u4e13\u6ce8','\u6d1e\u5bdf\u529b\u5f3a','\u5fe0\u8bda'], compatibility: ['\u5de8\u87f9\u5ea7','\u53cc\u9c7c\u5ea7'], ruler: '\u51a5\u738b\u661f' },
  '\u5c04\u624b\u5ea7': { element: '\u706b', quality: '\u53d8\u52a8', traits: ['\u4e50\u89c2','\u81ea\u7531','\u63a2\u7d22','\u76f4\u63a5'], compatibility: ['\u767d\u7f8a\u5ea7','\u72ee\u5b50\u5ea7'], ruler: '\u6728\u661f' },
  '\u6469\u7faf\u5ea7': { element: '\u571f', quality: '\u57fa\u672c', traits: ['\u81ea\u5f8b','\u52a1\u5b9e','\u575a\u97e7','\u8d23\u4efb'], compatibility: ['\u91d1\u725b\u5ea7','\u5904\u5973\u5ea7'], ruler: '\u571f\u661f' },
  '\u6c34\u74f6\u5ea7': { element: '\u98ce', quality: '\u56fa\u5b9a', traits: ['\u72ec\u7acb','\u521b\u65b0','\u4eba\u9053\u4e3b\u4e49','\u7406\u6027'], compatibility: ['\u53cc\u5b50\u5ea7','\u5929\u79e4\u5ea7'], ruler: '\u5929\u738b\u661f' },
  '\u53cc\u9c7c\u5ea7': { element: '\u6c34', quality: '\u53d8\u52a8', traits: ['\u76f4\u89c9\u5f3a','\u5171\u60c5','\u827a\u672f','\u5305\u5bb9'], compatibility: ['\u5de8\u87f9\u5ea7','\u5929\u874e\u5ea7'], ruler: '\u6d77\u738b\u661f' },
};

export function getZodiacInfo(month: number, day: number): ZodiacResult {
  const dates = [
    { month: 1, day: 20, name: '\u6c34\u74f6\u5ea7' },
    { month: 2, day: 19, name: '\u53cc\u9c7c\u5ea7' },
    { month: 3, day: 21, name: '\u767d\u7f8a\u5ea7' },
    { month: 4, day: 20, name: '\u91d1\u725b\u5ea7' },
    { month: 5, day: 21, name: '\u53cc\u5b50\u5ea7' },
    { month: 6, day: 22, name: '\u5de8\u87f9\u5ea7' },
    { month: 7, day: 23, name: '\u72ee\u5b50\u5ea7' },
    { month: 8, day: 23, name: '\u5904\u5973\u5ea7' },
    { month: 9, day: 23, name: '\u5929\u79e4\u5ea7' },
    { month: 10, day: 24, name: '\u5929\u874e\u5ea7' },
    { month: 11, day: 23, name: '\u5c04\u624b\u5ea7' },
    { month: 12, day: 22, name: '\u6469\u7faf\u5ea7' },
  ];

  let zodiacName = '\u6469\u7faf\u5ea7';
  for (const d of dates) {
    if (month < d.month || (month === d.month && day < d.day)) break;
    zodiacName = d.name;
  }

  const data = ZODIAC_DATA[zodiacName];
  return { name: zodiacName, ...data };
}
