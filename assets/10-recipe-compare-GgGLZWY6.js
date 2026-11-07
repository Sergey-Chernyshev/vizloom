import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{useMDXComponents as o}from"./index-CxbY7dAs.js";import{M as n,C as s}from"./index-DJ8QvP8f.js";import{Compare as a}from"./recipes.stories-MrNDioIB.js";import"./index-yBjzXJbu.js";import"./index-G8LIXM5I.js";import"./_commonjsHelpers-CqkleIqs.js";import"./iframe-H2tmL3vN.js";import"./index-BaBTCQBq.js";import"./index-B6ujFmsw.js";import"./index-DgH-xKnr.js";import"./index-Bhqu_tAV.js";import"./demo-data-Cs6fF4T1.js";import"./cx-BrTOQ2Ro.js";import"./hooks-aQKESm79.js";import"./format-B5KDo3eI.js";import"./provider-BLSBXahb.js";import"./state-BXFRhFLu.js";import"./primitives-CzyPZwcc.js";import"./source-C-kKhT28.js";import"./time-series-chart-BNf7qztB.js";import"./series-B9b5enKs.js";import"./palette-D2rnmE_p.js";import"./navigator-Bi4TuIt5.js";import"./colors-byAFwtRc.js";import"./curve-BD7CZoyo.js";import"./tooltip-BMOcmBfF.js";import"./scale-CSJBkx9O.js";import"./bottom-sheet-kofgg8jr.js";import"./hooks-Bwsyy9Sg.js";import"./delta-BOwf6Ond.js";import"./zoom-controls-D7tobNcm.js";import"./legend-BxY2FnMB.js";import"./live-BwF85EkP.js";import"./live-number-BkZ5ByzU.js";function t(i){const r={code:"code",h1:"h1",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...o(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(n,{title:"Recipes/Comparison"}),`
`,e.jsx(r.h1,{id:"comparison",children:"Comparison"}),`
`,e.jsxs(r.p,{children:[`"Are we selling faster than last time?" needs series from different periods on one axis.
Pass them as `,e.jsx(r.code,{children:"compare"})," instead of ",e.jsx(r.code,{children:"series"}),":"]}),`
`,e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-tsx",children:`<TimeSeriesChart
  title="Pace against past events"
  series={[]}
  kind="line"
  compareAlign="days-before" // or "date"
  compare={[
    { id: 'now', label: 'This concert', role: 'primary', event: eventAt, frame: thisFrame },
    { id: 'spring', label: 'Spring show', role: 'compare', event: springAt, frame: springFrame },
  ]}
/>
`})}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[e.jsx(r.strong,{children:e.jsx(r.code,{children:"days-before"})}),` aligns every series on its own event moment: the X axis reads "30 days before … event day".
Use it to compare events held at different times.`]}),`
`,e.jsxs(r.li,{children:[e.jsx(r.strong,{children:e.jsx(r.code,{children:"date"})}),' keeps calendar dates — for "this October vs last October".']}),`
`,e.jsxs(r.li,{children:["The primary series is solid in the main palette; comparisons are dashed in the separate ",e.jsx(r.code,{children:"--vl-compare-*"}),`
ramp, so they never look like another ticket type.`]}),`
`,e.jsx(r.li,{children:"The tooltip lists every series at the hovered position."}),`
`]}),`
`,e.jsxs(r.p,{children:["For KPIs, ",e.jsx(r.code,{children:"alignComparison"}),", ",e.jsx(r.code,{children:"cumulative"})," and ",e.jsx(r.code,{children:"valuesAt"})," from ",e.jsx(r.code,{children:"vizloom/dashboard"}),` give the same numbers without a
chart ("142 more tickets than the spring show at this point").`]}),`
`,e.jsx(s,{of:a})]})}function q(i={}){const{wrapper:r}={...o(),...i.components};return r?e.jsx(r,{...i,children:e.jsx(t,{...i})}):t(i)}export{q as default};
