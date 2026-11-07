import{j as r}from"./jsx-runtime-Cf8x2fCZ.js";import{useMDXComponents as n}from"./index-CxbY7dAs.js";import{M as i,C as s}from"./index-DJ8QvP8f.js";import{ZoomWithTiles as a}from"./recipes.stories-MrNDioIB.js";import"./index-yBjzXJbu.js";import"./index-G8LIXM5I.js";import"./_commonjsHelpers-CqkleIqs.js";import"./iframe-H2tmL3vN.js";import"./index-BaBTCQBq.js";import"./index-B6ujFmsw.js";import"./index-DgH-xKnr.js";import"./index-Bhqu_tAV.js";import"./demo-data-Cs6fF4T1.js";import"./cx-BrTOQ2Ro.js";import"./hooks-aQKESm79.js";import"./format-B5KDo3eI.js";import"./provider-BLSBXahb.js";import"./state-BXFRhFLu.js";import"./primitives-CzyPZwcc.js";import"./source-C-kKhT28.js";import"./time-series-chart-BNf7qztB.js";import"./series-B9b5enKs.js";import"./palette-D2rnmE_p.js";import"./navigator-Bi4TuIt5.js";import"./colors-byAFwtRc.js";import"./curve-BD7CZoyo.js";import"./tooltip-BMOcmBfF.js";import"./scale-CSJBkx9O.js";import"./bottom-sheet-kofgg8jr.js";import"./hooks-Bwsyy9Sg.js";import"./delta-BOwf6Ond.js";import"./zoom-controls-D7tobNcm.js";import"./legend-BxY2FnMB.js";import"./live-BwF85EkP.js";import"./live-number-BkZ5ByzU.js";function t(o){const e={code:"code",h1:"h1",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...n(),...o.components};return r.jsxs(r.Fragment,{children:[r.jsx(i,{title:"Recipes/Zoom with tiles"}),`
`,r.jsx(e.h1,{id:"zoom-with-tiles",children:"Zoom with tiles"}),`
`,r.jsxs(e.p,{children:["For long periods, do not ship every hourly point to the browser. Give the chart a ",r.jsx(e.strong,{children:"tile source"}),` and it asks
for exactly the window and granularity on screen:`]}),`
`,r.jsx(e.pre,{children:r.jsx(e.code,{className:"language-ts",children:`import type { TileSource } from 'vizloom/core';

export const source: TileSource<'floor' | 'vip', 'tickets'> = {
  extent: { start: periodStart, end: periodEnd, now: Date.now() },
  async load({ metric, granularity, range, signal }) {
    const res = await fetch(\`/api/sales?metric=\${metric}&g=\${granularity}&from=\${range.start}&to=\${range.end}\`, { signal });
    const body = await res.json();
    // { start, step, length, values: { floor: number[], vip: number[] } }
    return body;
  },
};
`})}),`
`,r.jsx(e.p,{children:"What you get for free:"}),`
`,r.jsxs(e.ul,{children:[`
`,r.jsxs(e.li,{children:[r.jsx(e.strong,{children:"Granularity follows zoom"})," — hours when zoomed in, days or weeks when zoomed out (",r.jsx(e.code,{children:"granularityThresholds"}),`
tunes the switch points).`]}),`
`,r.jsxs(e.li,{children:[r.jsx(e.strong,{children:"Cache and cancellation"}),` — tiles are cached per metric × granularity × range; a request that went stale
while the user kept zooming is aborted through `,r.jsx(e.code,{children:"signal"}),"."]}),`
`,r.jsxs(e.li,{children:[r.jsx(e.strong,{children:"No blank frames"})," — the previous frame stays on screen until the next one arrives."]}),`
`,r.jsxs(e.li,{children:[r.jsx(e.strong,{children:"Navigator and buttons"})," — ",r.jsx(e.code,{children:"navigator"})," draws the whole period with a draggable window, ",r.jsx(e.code,{children:"zoomControls"}),`
adds +/−/reset for users without a wheel or a trackpad. Keyboard: `,r.jsx(e.code,{children:"+"}),", ",r.jsx(e.code,{children:"−"}),", arrows, ",r.jsx(e.code,{children:"0"}),"."]}),`
`]}),`
`,r.jsxs(e.p,{children:["For a local array, ",r.jsx(e.code,{children:"createLocalSource"})," builds the same contract with aggregation done in the browser."]}),`
`,r.jsx(s,{of:a})]})}function A(o={}){const{wrapper:e}={...n(),...o.components};return e?r.jsx(e,{...o,children:r.jsx(t,{...o})}):t(o)}export{A as default};
