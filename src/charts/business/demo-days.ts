/** Demo data of the day-column charts (stories and tests). Deterministic. */
import type { CountdownColumn, CountdownZone } from './countdown-chart';
import type { DayEvent, RateDay } from './rate-columns-chart';

export type DemoEventKind = 'start' | 'announce' | 'price' | 'promo' | 'ads' | 'social' | 'mail' | 'bot' | 'edit';

/** 45 days of visitors and buyers ending on `end`, shaped by launch and campaign days. */
export function demoRateDays(
  visitors = 36400,
  buyers = 573,
  monthsShort: readonly string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  end = new Date(2026, 9, 30),
  lang: 'en' | 'ru' = 'en',
): { days: RateDay[]; events: DayEvent<DemoEventKind>[] } {
  const n = 45;
  const visitBoost: Record<number, number> = { 0: 2.6, 8: 1.8, 20: 3, 21: 1.7, 30: 1.4, 38: 3.4, 39: 2.1 };
  const rateBoost: Record<number, number> = { 0: 2, 8: 1.5, 20: 2.2, 21: 1.6, 30: 2.8, 31: 0.8, 24: 0.3, 38: 3.6, 39: 2.4 };
  const vp = Array.from({ length: n }, (_, i) => (700 + 22 * i + 180 * Math.abs(Math.sin(i * 1.3))) * (visitBoost[i] ?? 1));
  const cp = Array.from({ length: n }, (_, i) => rateBoost[i] ?? 1.1 + 0.25 * Math.sin(i * 0.9));
  const vs = vp.reduce((a, b) => a + b, 0);
  const base = vp.map((v) => Math.round((v / vs) * visitors));
  const raw = base.map((v, i) => (v * (cp[i] as number)) / 100);
  const rs = raw.reduce((a, b) => a + b, 0);
  const count = raw.map((v) => Math.max(0, Math.round((v / rs) * buyers)));
  const days = base.map((b, i) => {
    const d = new Date(end);
    d.setDate(end.getDate() - (n - 1 - i));
    return { label: `${d.getDate()} ${monthsShort[d.getMonth()]}`, base: b, count: count[i] as number };
  });
  const ru = lang === 'ru';
  const events: DayEvent<DemoEventKind>[] = [
    { index: 0, kind: 'start', label: ru ? 'Старт продаж' : 'Sales open' },
    { index: 8, kind: 'announce', label: ru ? 'Анонс лайнапа' : 'Line-up announced' },
    { index: 20, kind: 'mail', label: ru ? 'Рассылка «Осталось 30% билетов»' : 'Mailing "30% of tickets left"' },
    { index: 20, kind: 'social', label: ru ? 'Сторис организатора' : 'Organiser stories' },
    { index: 31, kind: 'price', label: ru ? 'Танцпол: 2 500 → 3 000 ₽' : 'Dance floor: 2 500 → 3 000' },
    { index: 38, kind: 'social', label: ru ? 'Пост артиста' : 'Artist post' },
    { index: 38, kind: 'ads', label: ru ? 'Реклама ВКонтакте' : 'Social ads' },
    { index: 38, kind: 'promo', label: ru ? 'Промокод FRIENDS20' : 'Promo code FRIENDS20' },
  ];
  return { days, events };
}

export interface DemoCountdownInput {
  /** Requests in the whole period. */
  readonly n: number;
  /** Requested amount in the whole period. */
  readonly sum: number;
  /** Declined (they go to the last days). */
  readonly no: number;
  /** Still pending. */
  readonly wait: number;
}

/** Refund requests by days before an event (30 … 0) split into approved / declined / pending. */
export function demoCountdown(
  input: DemoCountdownInput = { n: 19, sum: 57880, no: 4, wait: 2 },
  lang: 'en' | 'ru' = 'en',
): {
  columns: CountdownColumn[];
  events: DayEvent<DemoEventKind>[];
  zones: CountdownZone[];
  average: number;
} {
  const span = 30;
  const offsets = Array.from({ length: span + 1 }, (_, i) => span - i);
  const pattern: Record<number, number> = { 27: 1, 23: 1, 17: 1, 11: 2, 10: 1, 8: 1, 6: 2, 5: 1, 4: 1, 3: 2, 2: 2, 1: 2, 0: 2 };
  const raw = offsets.map((d) => (pattern[d] ?? 0) + 1e-3);
  const s = raw.reduce((a, b) => a + b, 0);
  const cnt = raw.map((v) => Math.floor((v / s) * input.n));
  const rest = input.n - cnt.reduce((a, b) => a + b, 0);
  const order = raw.map((v, i) => [(v / s) * input.n - (cnt[i] as number), i] as const).sort((a, b) => b[0] - a[0]);
  for (let k = 0; k < rest; k++) {
    const at = (order[k % order.length] as readonly [number, number])[1];
    cnt[at] = (cnt[at] as number) + 1;
  }
  let no = input.no;
  let wait = input.wait;
  const cols = offsets.map((d, i) => ({ offset: d, n: cnt[i] as number, ok: 0, no: 0, wait: 0 }));
  for (let i = cols.length - 1; i >= 0; i--) {
    const c = cols[i] as (typeof cols)[number];
    for (let u = 0; u < c.n; u++) {
      if (c.offset < 3 && no > 0) {
        c.no++;
        no--;
      } else if (wait > 0) {
        c.wait++;
        wait--;
      } else c.ok++;
    }
  }
  const ru = lang === 'ru';
  const events: DayEvent<DemoEventKind>[] = [
    { index: 11, kind: 'edit', label: ru ? 'Начало сдвинули на 23:00' : 'Start moved to 23:00' },
    { index: 11, kind: 'mail', label: ru ? 'Письмо об изменении времени' : 'Mail about the time change' },
    { index: 7, kind: 'mail', label: ru ? 'Напоминание о мероприятии' : 'Event reminder' },
    { index: 1, kind: 'bot', label: ru ? 'Напоминание в Telegram' : 'Reminder in the messenger' },
  ];
  const zones: CountdownZone[] = [
    { from: 30, to: 11, label: '100%', detail: ru ? 'больше 10 дней · ' : 'more than 10 days · ' },
    { from: 10, to: 5, label: '50%', detail: ru ? '5–10 дней · ' : '5–10 days · ' },
    { from: 4, to: 3, label: '30%' },
    { from: 2, to: 0, label: '0%', shaded: true },
  ];
  return {
    columns: cols.map((c) => ({ offset: c.offset, parts: { ok: c.ok, no: c.no, wait: c.wait } })),
    events,
    zones,
    average: input.sum / Math.max(1, input.n),
  };
}
