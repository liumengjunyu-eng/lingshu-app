declare module 'lunar-javascript' {
  export class Solar {
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar;
    getLunar(): Lunar;
  }

  export class Lunar {
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Lunar;
    getBaZi(): BaZiPillar[];
    getShengXiao(): string;
    getEightChar(): EightChar;
    getSolar(): Solar;
    toString(): string;
    getYearNaYin(): string;
    getMonthNaYin(): string;
    getDayNaYin(): string;
    getTimeNaYin(): string;
  }

  export class BaZiPillar {
    getGan(): string;
    getZhi(): string;
    getGanZhi(): string;
    toString(): string;
  }

  export class EightChar {
    getYearShiShenGan(): string;
    getMonthShiShenGan(): string;
    getDayShiShenGan(): string;
    getTimeShiShenGan(): string;
    getYearShiShenZhi(): string;
    getMonthShiShenZhi(): string;
    getDayShiShenZhi(): string;
    getTimeShiShenZhi(): string;
  }
}
