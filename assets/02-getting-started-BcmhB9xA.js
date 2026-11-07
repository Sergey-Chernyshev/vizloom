import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{useMDXComponents as i}from"./index-CxbY7dAs.js";import{M as t}from"./index-DJ8QvP8f.js";import"./index-yBjzXJbu.js";import"./index-G8LIXM5I.js";import"./_commonjsHelpers-CqkleIqs.js";import"./iframe-H2tmL3vN.js";import"./index-BaBTCQBq.js";import"./index-B6ujFmsw.js";import"./index-DgH-xKnr.js";import"./index-Bhqu_tAV.js";function o(r){const n={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...i(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(t,{title:"Getting started"}),`
`,e.jsx(n.h1,{id:"getting-started",children:"Getting started"}),`
`,e.jsx(n.h2,{id:"install",children:"Install"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`npm install vizloom
# or
pnpm add vizloom
`})}),`
`,e.jsx(n.p,{children:"React 18.2+ or 19 is a peer dependency. No other runtime dependencies."}),`
`,e.jsx(n.h2,{id:"import-the-styles-once",children:"Import the styles once"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import 'vizloom/styles.css'; // everything
// or only what you use:
import 'vizloom/core.css';
import 'vizloom/charts.css';
import 'vizloom/dashboard.css';
`})}),`
`,e.jsx(n.p,{children:"The JavaScript never imports CSS, so the package works in any bundler and on the server."}),`
`,e.jsx(n.h2,{id:"first-dashboard",children:"First dashboard"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { VizProvider, currencyUnit, UNIT_COUNT } from 'vizloom/core';
import { DashboardGrid, KpiStrip, ChartCard } from 'vizloom/dashboard';

export function Overview() {
  return (
    <VizProvider locale="en">
      <DashboardGrid>
        <KpiStrip
          items={[
            { id: 'rev', label: 'Revenue', value: 117763, unit: currencyUnit('USD'), delta: 9, sub: 'after refunds' },
            { id: 'sold', label: 'Tickets sold', value: 2874, unit: UNIT_COUNT, delta: 18 },
          ]}
        />
        <ChartCard title="Sales by day" span={8} info="Tickets sold per day">
          {/* any chart from vizloom/charts */}
        </ChartCard>
      </DashboardGrid>
    </VizProvider>
  );
}
`})}),`
`,e.jsx(n.h2,{id:"locale-and-time-zone",children:"Locale and time zone"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { VizProvider, intlZone, defineLocale, en } from 'vizloom/core';

<VizProvider locale="ru" zone={intlZone('Europe/Moscow')}>…</VizProvider>
<VizProvider locale={defineLocale(en, { code: 'en-GB', dayFirst: true })}>…</VizProvider>
`})}),`
`,e.jsx(n.p,{children:"Without a provider components use English and UTC."}),`
`,e.jsx(n.h2,{id:"server-rendering",children:"Server rendering"}),`
`,e.jsxs(n.p,{children:[`All components render on the server: sizes start at zero and canvases draw after hydration;
no `,e.jsx(n.code,{children:"window"}),` access during render. Tooltips are positioned inside the chart container, so no
portal root is needed.`]}),`
`,e.jsx(n.h2,{id:"subpath-imports-and-tree-shaking",children:"Subpath imports and tree-shaking"}),`
`,e.jsxs(n.p,{children:["Import from the narrowest subpath — ",e.jsx(n.code,{children:"vizloom/charts"}),", ",e.jsx(n.code,{children:"vizloom/table"}),` — and unused components
are dropped by any ESM bundler (`,e.jsx(n.code,{children:"sideEffects"})," is limited to CSS files)."]})]})}function j(r={}){const{wrapper:n}={...i(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(o,{...r})}):o(r)}export{j as default};
