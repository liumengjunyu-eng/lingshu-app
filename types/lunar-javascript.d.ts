declare module 'lunar-javascript' {
  export class Lunar {
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Lunar;
    getBaZi(): string[];
    getShengXiao(): string;
    getEightChar(): EightChar;
    getSolar(): { toString(): string };
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
    getBaZiNaYin(): string[];
  }
}
