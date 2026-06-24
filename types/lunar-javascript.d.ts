declare module 'lunar-javascript' {
  export class Lunar {
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Lunar;
    getBaZi(): string[];
    getNaYin(): string[];
    getShengXiao(): string;
    getSolar(): { toString(): string };
    toString(): string;
  }
  export const Lunar: {
    fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Lunar;
  };
}
