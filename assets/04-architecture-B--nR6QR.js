import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{useMDXComponents as t}from"./index-CxbY7dAs.js";import{M as i}from"./index-DJ8QvP8f.js";import"./index-yBjzXJbu.js";import"./index-G8LIXM5I.js";import"./_commonjsHelpers-CqkleIqs.js";import"./iframe-H2tmL3vN.js";import"./index-BaBTCQBq.js";import"./index-B6ujFmsw.js";import"./index-DgH-xKnr.js";import"./index-Bhqu_tAV.js";function s(r){const n={code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...t(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Guides/Architecture"}),`
`,e.jsx(n.h1,{id:"architecture",children:"Architecture"}),`
`,e.jsx(n.p,{children:"One package, four subpaths, dependencies pointing down only:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`vizloom/dashboard ─┐
vizloom/charts ────┼──► vizloom/core
vizloom/table ─────┘
`})}),`
`,e.jsx(n.h2,{id:"core-layers",children:"Core layers"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"model"})," — pure functions and classes, no React: time (UTC ms + ",e.jsx(n.code,{children:"TimeZone"}),`), granularity with
hysteresis, scales, formatting, palettes, aggregation (prefix sums), `,e.jsx(n.code,{children:"Viewport"}),", LOD."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"data"})," — the tile source contract and ",e.jsx(n.code,{children:"useTileData"}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"motion / gestures / positioning"})," — framework-free and unit-tested."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"theme / hooks"})," — ",e.jsx(n.code,{children:"VizProvider"}),", CSS variables → canvas colours, element size, viewport, series state."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"ui"})," — shared components: legend, tooltip, crosshair, delta badge, live number, skeletons, states."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"contracts"})," — the public prop types of charts and tables."]}),`
`]}),`
`,e.jsx(n.h2,{id:"tile-data-source",children:"Tile data source"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`interface TileSource<Id, Metric> {
  extent: { start: number; end: number; now?: number; event?: number };
  load(request: {
    metric: Metric;
    granularity: 'hour' | 'day' | 'week';
    range: { start: number; end: number };
    signal?: AbortSignal;
  }): Promise<{ start: number; step: number; length: number; values: Record<Id, ArrayLike<number>> }>;
}
`})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"useTileData(source, { metric, granularity, range })"}),` asks only when the cached frame does not
cover the window (plus overscan), aborts stale requests, debounces while the window moves and
keeps the previous frame on screen so the chart morphs into the new one. `,e.jsx(n.code,{children:"createLocalSource"}),`
aggregates client-side hourly data into any granularity.`]}),`
`,e.jsx(n.h2,{id:"viewport",children:"Viewport"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"Viewport"}),` is the single time window shared by a chart, its navigator, markers and zoom buttons.
It eases the centre and the logarithm of the width, so zooming feels the same at any scale.
Wheel, trackpad pinch, two-finger pinch and buttons all call `,e.jsx(n.code,{children:"zoomAround(anchor, factor)"}),`;
drags call `,e.jsx(n.code,{children:"panBy"}),"."]}),`
`,e.jsx(n.h2,{id:"decisions",children:"Decisions"}),`
`,e.jsxs(n.p,{children:["The full list of decisions with reasons lives in ",e.jsx(n.code,{children:"docs/ARCHITECTURE.md"})," in the repository."]})]})}function g(r={}){const{wrapper:n}={...t(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(s,{...r})}):s(r)}export{g as default};
