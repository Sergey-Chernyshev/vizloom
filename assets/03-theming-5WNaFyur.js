import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{useMDXComponents as n}from"./index-CxbY7dAs.js";import{M as c}from"./index-DJ8QvP8f.js";import"./index-yBjzXJbu.js";import"./index-G8LIXM5I.js";import"./_commonjsHelpers-CqkleIqs.js";import"./iframe-H2tmL3vN.js";import"./index-BaBTCQBq.js";import"./index-B6ujFmsw.js";import"./index-DgH-xKnr.js";import"./index-Bhqu_tAV.js";function s(r){const d={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...n(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{title:"Guides/Theming"}),`
`,e.jsx(d.h1,{id:"theming",children:"Theming"}),`
`,e.jsxs(d.p,{children:["Every colour, radius, font, shadow and duration is a CSS custom property prefixed ",e.jsx(d.code,{children:"--vl-"}),`.
A theme is a block of overrides; canvases read the same variables at their element and redraw
when a theme attribute changes.`]}),`
`,e.jsx(d.h2,{id:"light-dark-auto",children:"Light, dark, auto"}),`
`,e.jsx(d.pre,{children:e.jsx(d.code,{className:"language-html",children:`<html data-vl-theme="dark">
  <!-- whole page dark -->
  <section data-vl-theme="light">
    <!-- a light island inside -->
    <body data-vl-theme="auto">
      <!-- follow the OS -->
    </body>
  </section>
</html>
`})}),`
`,e.jsx(d.h2,{id:"brand-palette",children:"Brand palette"}),`
`,e.jsx(d.pre,{children:e.jsx(d.code,{className:"language-css",children:`:root {
  --vl-accent: #0e7c66;
  --vl-cat-1: #0e7c66;
  --vl-cat-2: #e0912f;
  --vl-cat-3: #3c6fd8;
  --vl-font-family: 'Manrope', system-ui, sans-serif;
  --vl-radius-l: 8px;
}
[data-vl-theme='dark'] {
  --vl-accent: #34c3a3;
  --vl-cat-1: #34c3a3;
}
`})}),`
`,e.jsx(d.h2,{id:"token-groups",children:"Token groups"}),`
`,e.jsxs(d.table,{children:[e.jsx(d.thead,{children:e.jsxs(d.tr,{children:[e.jsx(d.th,{children:"Group"}),e.jsx(d.th,{children:"Variables"})]})}),e.jsxs(d.tbody,{children:[e.jsxs(d.tr,{children:[e.jsx(d.td,{children:"Surfaces"}),e.jsxs(d.td,{children:[e.jsx(d.code,{children:"--vl-bg"}),", ",e.jsx(d.code,{children:"--vl-surface"}),", ",e.jsx(d.code,{children:"--vl-surface-raised"}),", ",e.jsx(d.code,{children:"--vl-surface-sunken"}),", ",e.jsx(d.code,{children:"--vl-surface-hover"})]})]}),e.jsxs(d.tr,{children:[e.jsx(d.td,{children:"Text"}),e.jsxs(d.td,{children:[e.jsx(d.code,{children:"--vl-text"}),", ",e.jsx(d.code,{children:"--vl-text-secondary"}),", ",e.jsx(d.code,{children:"--vl-text-muted"})]})]}),e.jsxs(d.tr,{children:[e.jsx(d.td,{children:"Lines"}),e.jsxs(d.td,{children:[e.jsx(d.code,{children:"--vl-border"}),", ",e.jsx(d.code,{children:"--vl-border-strong"}),", ",e.jsx(d.code,{children:"--vl-grid"}),", ",e.jsx(d.code,{children:"--vl-axis"}),", ",e.jsx(d.code,{children:"--vl-crosshair"})]})]}),e.jsxs(d.tr,{children:[e.jsx(d.td,{children:"Tones"}),e.jsxs(d.td,{children:[e.jsx(d.code,{children:"--vl-accent"}),", ",e.jsx(d.code,{children:"--vl-positive"}),", ",e.jsx(d.code,{children:"--vl-negative"}),", ",e.jsx(d.code,{children:"--vl-warning"})," and their ",e.jsx(d.code,{children:"-soft"})," backgrounds"]})]}),e.jsxs(d.tr,{children:[e.jsx(d.td,{children:"Series"}),e.jsxs(d.td,{children:[e.jsx(d.code,{children:"--vl-cat-1"})," … ",e.jsx(d.code,{children:"--vl-cat-8"}),", ",e.jsx(d.code,{children:"--vl-cat-other"}),", ",e.jsx(d.code,{children:"--vl-compare-1"})," … ",e.jsx(d.code,{children:"--vl-compare-4"})]})]}),e.jsxs(d.tr,{children:[e.jsx(d.td,{children:"Ramps"}),e.jsxs(d.td,{children:[e.jsx(d.code,{children:"--vl-seq-from"}),", ",e.jsx(d.code,{children:"--vl-seq-to"}),", ",e.jsx(d.code,{children:"--vl-div-neg"}),", ",e.jsx(d.code,{children:"--vl-div-mid"}),", ",e.jsx(d.code,{children:"--vl-div-pos"})]})]}),e.jsxs(d.tr,{children:[e.jsx(d.td,{children:"Shape"}),e.jsxs(d.td,{children:[e.jsx(d.code,{children:"--vl-radius-s/m/l/pill"}),", ",e.jsx(d.code,{children:"--vl-space-1…6"}),", ",e.jsx(d.code,{children:"--vl-shadow-card"}),", ",e.jsx(d.code,{children:"--vl-shadow-pop"}),", ",e.jsx(d.code,{children:"--vl-focus-ring"})]})]}),e.jsxs(d.tr,{children:[e.jsx(d.td,{children:"Type"}),e.jsxs(d.td,{children:[e.jsx(d.code,{children:"--vl-font-family"}),", ",e.jsx(d.code,{children:"--vl-font-mono"}),", ",e.jsx(d.code,{children:"--vl-font-size-xs…kpi"}),", weights"]})]}),e.jsxs(d.tr,{children:[e.jsx(d.td,{children:"Motion"}),e.jsxs(d.td,{children:[e.jsx(d.code,{children:"--vl-duration-fast/base/slow"}),", ",e.jsx(d.code,{children:"--vl-ease"}),", ",e.jsx(d.code,{children:"--vl-ease-out"})]})]})]})]}),`
`,e.jsx(d.h2,{id:"series-colours-in-code",children:"Series colours in code"}),`
`,e.jsx(d.pre,{children:e.jsx(d.code,{className:"language-ts",children:`import { seriesColor, compareColor } from 'vizloom/core';
seriesColor(0); // 'var(--vl-cat-1)'
compareColor(0); // 'var(--vl-compare-1)'
`})}),`
`,e.jsxs(d.p,{children:["A series can also take any CSS colour: ",e.jsx(d.code,{children:"{ id: 'vip', label: 'VIP', color: 'var(--brand)' }"}),"."]}),`
`,e.jsx(d.h2,{id:"contrast",children:"Contrast"}),`
`,e.jsxs(d.p,{children:[e.jsx(d.code,{children:"contrastRatio"}),", ",e.jsx(d.code,{children:"readableOn"}),", ",e.jsx(d.code,{children:"mixColors"}),", ",e.jsx(d.code,{children:"sequentialRamp"})," and ",e.jsx(d.code,{children:"divergingRamp"}),` help build
accessible palettes; the built-in categorical palette is checked for colour-blind readers on
both themes (see `,e.jsx(d.strong,{children:"Core / Palette and tokens"}),")."]})]})}function u(r={}){const{wrapper:d}={...n(),...r.components};return d?e.jsx(d,{...r,children:e.jsx(s,{...r})}):s(r)}export{u as default};
