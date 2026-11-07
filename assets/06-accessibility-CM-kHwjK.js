import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{useMDXComponents as i}from"./index-CxbY7dAs.js";import{M as o}from"./index-DJ8QvP8f.js";import"./index-yBjzXJbu.js";import"./index-G8LIXM5I.js";import"./_commonjsHelpers-CqkleIqs.js";import"./iframe-H2tmL3vN.js";import"./index-BaBTCQBq.js";import"./index-B6ujFmsw.js";import"./index-DgH-xKnr.js";import"./index-Bhqu_tAV.js";function r(s){const n={code:"code",h1:"h1",li:"li",strong:"strong",ul:"ul",...i(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Guides/Accessibility"}),`
`,e.jsx(n.h1,{id:"accessibility",children:"Accessibility"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Screen readers."})," Every drawing is ",e.jsx(n.code,{children:"aria-hidden"})," and paired with a ",e.jsx(n.code,{children:"ChartDataTable"}),` — a real
table with a caption (the chart title). Dense series are capped with a summary.`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Keyboard."})," Charts are focusable: arrow keys move between buckets/data points, ",e.jsx(n.code,{children:"Home"}),"/",e.jsx(n.code,{children:"End"}),`
jump, `,e.jsx(n.code,{children:"+"}),"/",e.jsx(n.code,{children:"−"})," zoom, ",e.jsx(n.code,{children:"Escape"}),` unpins a tooltip. Legend items are toggle buttons
(`,e.jsx(n.code,{children:"aria-pressed"}),"); ",e.jsx(n.code,{children:"Alt+Enter"}),` keeps only one series. Segmented controls are radio groups, tabs
are tab lists with roving focus. Tables are ARIA grids with cell navigation.`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Not colour alone."}),` Deltas carry an arrow and a sign; hidden legend items are struck through;
comparison series are dashed.`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Motion."})," ",e.jsx(n.code,{children:"prefers-reduced-motion"}),` turns off transitions, count-ups, pulses and viewport
easing; `,e.jsx(n.code,{children:"<VizProvider animate={false}>"})," does the same globally."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Contrast."})," Text tokens meet WCAG AA on their surfaces in both themes; ",e.jsx(n.code,{children:"contrastRatio"}),`
checks custom palettes.`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Touch targets"})," grow to 36–40 px on coarse pointers."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Live regions."})," Tooltips announce politely; ",e.jsx(n.code,{children:"LiveNumber announce"})," is opt-in to avoid noise."]}),`
`]})]})}function g(s={}){const{wrapper:n}={...i(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(r,{...s})}):r(s)}export{g as default};
