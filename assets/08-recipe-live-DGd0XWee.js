import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{useMDXComponents as o}from"./index-CxbY7dAs.js";import{M as s,C as r}from"./index-DJ8QvP8f.js";import{LiveData as l}from"./recipes.stories-MrNDioIB.js";import"./index-yBjzXJbu.js";import"./index-G8LIXM5I.js";import"./_commonjsHelpers-CqkleIqs.js";import"./iframe-H2tmL3vN.js";import"./index-BaBTCQBq.js";import"./index-B6ujFmsw.js";import"./index-DgH-xKnr.js";import"./index-Bhqu_tAV.js";import"./demo-data-Cs6fF4T1.js";import"./cx-BrTOQ2Ro.js";import"./hooks-aQKESm79.js";import"./format-B5KDo3eI.js";import"./provider-BLSBXahb.js";import"./state-BXFRhFLu.js";import"./primitives-CzyPZwcc.js";import"./source-C-kKhT28.js";import"./time-series-chart-BNf7qztB.js";import"./series-B9b5enKs.js";import"./palette-D2rnmE_p.js";import"./navigator-Bi4TuIt5.js";import"./colors-byAFwtRc.js";import"./curve-BD7CZoyo.js";import"./tooltip-BMOcmBfF.js";import"./scale-CSJBkx9O.js";import"./bottom-sheet-kofgg8jr.js";import"./hooks-Bwsyy9Sg.js";import"./delta-BOwf6Ond.js";import"./zoom-controls-D7tobNcm.js";import"./legend-BxY2FnMB.js";import"./live-BwF85EkP.js";import"./live-number-BkZ5ByzU.js";function n(i){const t={code:"code",h1:"h1",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...o(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Recipes/Live data"}),`
`,e.jsx(t.h1,{id:"live-data",children:"Live data"}),`
`,e.jsx(t.p,{children:`Live mode is not a polling helper — it is a rendering contract. Push new data however you like
(WebSocket, SSE, polling) and the components animate the difference:`}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:e.jsx(t.code,{children:"LiveNumber"})})," and ",e.jsx(t.strong,{children:e.jsx(t.code,{children:"Kpi"})})," tween to the new value and show a short ",e.jsx(t.code,{children:"+N"})," bump."]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:e.jsx(t.code,{children:"TimeSeriesChart live"})}),` slides new buckets in and keeps the window pinned to "now" until the user pans away.
Panning back to the right edge resumes following.`]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:e.jsx(t.code,{children:"Pulse"})}),` / table cell pulses mark what changed, at most a handful at a time, so a burst does not flash the
whole screen.`]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:e.jsx(t.code,{children:"LiveIndicator"})}),' shows "updated N s ago" and turns muted when updates stop.']}),`
`]}),`
`,e.jsxs(t.p,{children:["All animations respect ",e.jsx(t.code,{children:"prefers-reduced-motion"})," and ",e.jsx(t.code,{children:"VizProvider animate={false}"}),"."]}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-tsx",children:`const [sold, setSold] = useState(initial);
useEffect(() => socket.on('sale', (n) => setSold((s) => s + n)), []);

<KpiStrip items={[{ id: 'sold', label: 'Tickets sold', value: sold, unit: UNIT_COUNT }]} />
<TimeSeriesChart title="Sales" series={series} source={source} metric="tickets" live />
`})}),`
`,e.jsx(r,{of:l})]})}function V(i={}){const{wrapper:t}={...o(),...i.components};return t?e.jsx(t,{...i,children:e.jsx(n,{...i})}):n(i)}export{V as default};
