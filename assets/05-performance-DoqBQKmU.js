import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{useMDXComponents as o}from"./index-CxbY7dAs.js";import{M as i}from"./index-DJ8QvP8f.js";import"./index-yBjzXJbu.js";import"./index-G8LIXM5I.js";import"./_commonjsHelpers-CqkleIqs.js";import"./iframe-H2tmL3vN.js";import"./index-BaBTCQBq.js";import"./index-B6ujFmsw.js";import"./index-DgH-xKnr.js";import"./index-Bhqu_tAV.js";function r(s){const n={code:"code",h1:"h1",li:"li",p:"p",strong:"strong",ul:"ul",...o(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Guides/Performance"}),`
`,e.jsx(n.h1,{id:"performance",children:"Performance"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Canvas for dense data."}),` Time series, navigators and heatmaps draw on a canvas sized for the
device pixel ratio (capped at 2 to save memory on phones).`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Level of detail."})," ",e.jsx(n.code,{children:"minMaxIndices"}),` keeps the first, min, max and last point of every pixel
column, so 100 000 points draw as ~4 per pixel and peaks never disappear. `,e.jsx(n.code,{children:"lttbIndices"}),` is
available for smooth line shapes.`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"One frame, one redraw."}),` Pointer moves, live ticks and resizes are coalesced with
`,e.jsx(n.code,{children:"rafThrottle"}),`; hover state lives in refs, not React state, so moving the mouse does not
re-render the tree.`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Prefix sums."})," Aggregating hours into days or weeks and summing any window is O(1) per bucket."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tiles."})," With a ",e.jsx(n.code,{children:"TileSource"}),` only the visible window (plus overscan) at the needed
granularity is loaded; stale requests are aborted.`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"No layout thrash."})," Sizes come from ",e.jsx(n.code,{children:"ResizeObserver"}),`; tooltips and crosshairs move through CSS
variables and `,e.jsx(n.code,{children:"transform"}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Small bundles."})," Subpath imports, no runtime dependencies, CSS shipped separately."]}),`
`]}),`
`,e.jsxs(n.p,{children:["Open ",e.jsx(n.strong,{children:"Charts → Performance"}),` stories to see tens of thousands of points pan and zoom at 60 fps
(an FPS meter is shown in the story).`]})]})}function f(s={}){const{wrapper:n}={...o(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(r,{...s})}):r(s)}export{f as default};
