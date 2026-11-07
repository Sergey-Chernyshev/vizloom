import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{useMDXComponents as i}from"./index-CxbY7dAs.js";import{M as d}from"./index-DJ8QvP8f.js";import"./index-yBjzXJbu.js";import"./index-G8LIXM5I.js";import"./_commonjsHelpers-CqkleIqs.js";import"./iframe-H2tmL3vN.js";import"./index-BaBTCQBq.js";import"./index-B6ujFmsw.js";import"./index-DgH-xKnr.js";import"./index-Bhqu_tAV.js";function r(n){const s={code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...i(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{title:"Charts/Time/Guide"}),`
`,e.jsx(s.h1,{id:"time-series-charts",children:"Time series charts"}),`
`,e.jsxs(s.p,{children:[e.jsx(s.code,{children:"TimeSeriesChart"}),` draws dense time series on canvas: smooth areas, lines, stacked and percent areas, and columns over
time. It comes with a legend, zoom buttons and a whole-period navigator, and it keeps 60 fps on thousands of points.`]}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-tsx",children:`import { AreaChart, LineChart, StackedAreaChart, TimeColumnChart } from 'vizloom/charts';
import 'vizloom/charts.css';

<AreaChart
  title="Tickets sold"
  series={[
    { id: 'web', label: 'Website' },
    { id: 'app', label: 'App' },
  ]}
  frame={frame}
/>;
`})}),`
`,e.jsx(s.h2,{id:"data",children:"Data"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:e.jsx(s.code,{children:"frame"})})," — ready buckets: ",e.jsx(s.code,{children:"{ start, step, length, values: { [seriesId]: ArrayLike<number> } }"}),". ",e.jsx(s.code,{children:"NaN"}),` is a gap
(no data), `,e.jsx(s.code,{children:"0"}),' means "nothing happened".']}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:e.jsx(s.code,{children:"source"})})," + ",e.jsx(s.strong,{children:e.jsx(s.code,{children:"metric"})})," — a tile source (",e.jsx(s.code,{children:"createLocalSource"})," or your own ",e.jsx(s.code,{children:"load(request)"}),`). Zooming in asks for
finer buckets (day → hour), stale requests are aborted, the old frame morphs into the new one. While a finer frame
loads a thin line runs on top; if it fails the current frame stays and a banner offers a retry.`]}),`
`]}),`
`,e.jsx(s.h2,{id:"kinds",children:"Kinds"}),`
`,e.jsxs(s.table,{children:[e.jsx(s.thead,{children:e.jsxs(s.tr,{children:[e.jsx(s.th,{children:"Prop"}),e.jsx(s.th,{children:"Values"})]})}),e.jsxs(s.tbody,{children:[e.jsxs(s.tr,{children:[e.jsx(s.td,{children:e.jsx(s.code,{children:"kind"})}),e.jsxs(s.td,{children:[e.jsx(s.code,{children:"area"})," (default), ",e.jsx(s.code,{children:"line"}),", ",e.jsx(s.code,{children:"columns"})]})]}),e.jsxs(s.tr,{children:[e.jsx(s.td,{children:e.jsx(s.code,{children:"stack"})}),e.jsxs(s.td,{children:[e.jsx(s.code,{children:"overlay"})," (default), ",e.jsx(s.code,{children:"stack"}),", ",e.jsx(s.code,{children:"percent"})," — animated switch"]})]}),e.jsxs(s.tr,{children:[e.jsx(s.td,{children:e.jsx(s.code,{children:"curve"})}),e.jsxs(s.td,{children:[e.jsx(s.code,{children:"smooth"})," (monotone, no overshoot), ",e.jsx(s.code,{children:"linear"}),", ",e.jsx(s.code,{children:"step"})]})]}),e.jsxs(s.tr,{children:[e.jsx(s.td,{children:e.jsx(s.code,{children:"points"})}),e.jsxs(s.td,{children:[e.jsx(s.code,{children:"auto"})," (when buckets get wide), ",e.jsx(s.code,{children:"always"}),", ",e.jsx(s.code,{children:"none"})]})]}),e.jsxs(s.tr,{children:[e.jsx(s.td,{children:e.jsx(s.code,{children:"guides"})}),e.jsx(s.td,{children:"dashed horizontal lines: average, goal"})]}),e.jsxs(s.tr,{children:[e.jsxs(s.td,{children:[e.jsx(s.code,{children:"zones"})," / ",e.jsx(s.code,{children:"now"})]}),e.jsx(s.td,{children:'coloured periods; the future after "now" is dimmed'})]}),e.jsxs(s.tr,{children:[e.jsxs(s.td,{children:[e.jsx(s.code,{children:"markers"})," / ",e.jsx(s.code,{children:"markerEffect"})]}),e.jsx(s.td,{children:'event icons with a "before → after" card'})]})]})]}),`
`,e.jsx(s.h2,{id:"interaction",children:"Interaction"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Mouse"}),`: hover shows a tooltip that glides between buckets; click pins it; wheel zooms around the cursor
(Ctrl — faster); horizontal wheel or drag pans with inertia.`]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Touch"}),`: tap shows the tooltip, pinch zooms, horizontal drag pans, a vertical swipe scrolls the page. On phones
the series summary opens as a bottom sheet.`]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Keyboard"}),`: focus the chart, ← → move between buckets, Enter pins, + − zoom, Home (or 0) shows the whole period,
Escape closes. The navigator is a slider with the same keys.`]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Legend"}),": click hides a series (the last one never hides), double-click solos it, hover focuses it."]}),`
`]}),`
`,e.jsx(s.h2,{id:"compare",children:"Compare"}),`
`,e.jsxs(s.p,{children:[e.jsx(s.code,{children:"compare"})," takes series with their own frames. ",e.jsx(s.code,{children:'compareAlign="date"'})," keeps real dates; ",e.jsx(s.code,{children:'"days-before"'}),` puts every
event at 0 so "30 days before" of different seasons stand one above another. Comparison series use the
`,e.jsx(s.code,{children:"--vl-compare-*"})," palette."]}),`
`,e.jsx(s.h2,{id:"live",children:"Live"}),`
`,e.jsxs(s.p,{children:["Set ",e.jsx(s.code,{children:"live"})," and move ",e.jsx(s.code,{children:"now"}),": when the window was at the right edge it follows. ",e.jsx(s.code,{children:"liveEvents"}),` add a pulse and a floating
"+N" caption on a series at a moment.`]}),`
`,e.jsx(s.h2,{id:"accessibility",children:"Accessibility"}),`
`,e.jsxs(s.p,{children:["The canvas has ",e.jsx(s.code,{children:'role="img"'}),` with the title as its name, a screen-reader table of the visible window (up to 60 rows)
and keyboard access to every bucket. Animations respect `,e.jsx(s.code,{children:"prefers-reduced-motion"}),"."]}),`
`,e.jsx(s.h2,{id:"theming",children:"Theming"}),`
`,e.jsxs(s.p,{children:["Colours come from CSS variables (",e.jsx(s.code,{children:"--vl-cat-1…8"}),", ",e.jsx(s.code,{children:"--vl-grid"}),", ",e.jsx(s.code,{children:"--vl-text-*"}),", ",e.jsx(s.code,{children:"--vl-zone"}),", ",e.jsx(s.code,{children:"--vl-future"}),`). The canvas
re-reads them when `,e.jsx(s.code,{children:"data-vl-theme"})," or a class changes on an ancestor. Any CSS colour works for ",e.jsx(s.code,{children:"series[].color"}),"."]})]})}function f(n={}){const{wrapper:s}={...i(),...n.components};return s?e.jsx(s,{...n,children:e.jsx(r,{...n})}):r(n)}export{f as default};
