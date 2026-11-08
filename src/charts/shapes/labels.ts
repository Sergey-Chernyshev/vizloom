import type { Locale } from '../../core';
import type { DonutLabels } from './donut-chart';
import type { FunnelLabels } from './funnel-chart';
import type { HeatmapLabels } from './heatmap-chart';

/** Russian-speaking locale (`ru`, `ru-RU`, …). */
export const isRu = (locale: Locale): boolean => locale.code.toLowerCase().startsWith('ru');

export const FUNNEL_LABELS_RU: FunnelLabels = {
  reached: 'Дошли',
  fromStart: 'от входа',
  fromPrevious: 'от прошлого шага',
  lost: 'ушли',
  untracked: 'нет данных',
  skipped: 'шаг пропускают',
  summary: (last) => `дошли до шага «${last}»`,
  summaryOf: (end, start) => `${end} из ${start}`,
  worst: (step, share) => `Больше всего уходят перед шагом «${step}» — ${share}`,
  step: 'Шаг',
  stepOf: (n, total) => `шаг ${n} из ${total}`,
  sheetHere: 'На этом шаге',
  sheetFromStart: (share) => `${share} от начала`,
  sheetStart: 'начало воронки',
  sheetFromPrevious: 'С прошлого шага',
  sheetNext: 'Дальше прошли',
  sheetLostNext: 'Ушли после шага',
  sheetFirst: 'первый шаг',
  sheetLast: 'последний шаг',
  sheetOf: (value) => `из ${value}`,
  close: 'Закрыть',
};

export const HEATMAP_LABELS_RU: HeatmapLabels = {
  value: 'Продано',
  ofWeek: 'от всей недели',
  vsUsual: 'к среднему',
  dayTotal: 'Весь день',
  noData: 'Данных за это время нет',
  few: 'мало',
  many: 'много',
  perDay: 'за день',
  perHour: 'за час',
  peak: (slot, value) => `Пик: ${slot} · ${value}`,
  hot: (value) => `пик · ${value}`,
  bestDay: (day, share) => `Сильнее всего ${day} — ${share} продаж недели`,
  day: 'День',
  total: 'Итого',
  sheetShare: 'Доля недели',
  hoursHint: (from, to) => `с ${from} до ${to}`,
  weekTotal: (total) => `из ${total} за неделю`,
  dayShare: (share) => `${share} недели`,
  meanHint: (mean, step) => `обычно ${mean} за ${step === 1 ? 'час' : `${step} ч`}`,
  topSlot: 'Пик недели',
  hotSlot: 'Много покупок',
  aboveSlot: 'Больше обычного',
  usualSlot: 'Как обычно',
  quietSlot: 'Меньше обычного',
  emptySlot: 'Покупок не было',
  topDetail: 'Больше всего покупок за неделю',
  dayPeak: (slot, value) => `Пик дня — ${slot} · ${value}`,
  isDayPeak: 'Это пик дня',
  timelineHint: (step) => `Столбик — продажи за ${step === 1 ? 'час' : `${step} часа`}. Листайте шкалу, чтобы смотреть соседние часы.`,
  close: 'Закрыть',
};

export const DONUT_LABELS_RU: DonutLabels = {
  value: 'Количество',
  share: 'Доля',
  ofTotal: (total) => `из ${total}`,
  close: 'Закрыть',
};
