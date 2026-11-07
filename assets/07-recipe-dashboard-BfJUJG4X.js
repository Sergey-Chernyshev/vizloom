import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{useMDXComponents as i}from"./index-CxbY7dAs.js";import{M as s,C as o}from"./index-DJ8QvP8f.js";import{Sales as a,SalesPhone as d}from"./examples.stories-Bnbq_yH0.js";import"./index-yBjzXJbu.js";import"./index-G8LIXM5I.js";import"./_commonjsHelpers-CqkleIqs.js";import"./iframe-H2tmL3vN.js";import"./index-BaBTCQBq.js";import"./index-B6ujFmsw.js";import"./index-DgH-xKnr.js";import"./index-Bhqu_tAV.js";import"./demo-data-Cs6fF4T1.js";import"./cx-BrTOQ2Ro.js";import"./hooks-aQKESm79.js";import"./format-B5KDo3eI.js";import"./provider-BLSBXahb.js";import"./state-BXFRhFLu.js";import"./primitives-CzyPZwcc.js";import"./source-C-kKhT28.js";import"./live-BwF85EkP.js";import"./live-number-BkZ5ByzU.js";import"./delta-BOwf6Ond.js";import"./grid-D93VGQ47.js";import"./time-series-chart-BNf7qztB.js";import"./series-B9b5enKs.js";import"./palette-D2rnmE_p.js";import"./navigator-Bi4TuIt5.js";import"./colors-byAFwtRc.js";import"./curve-BD7CZoyo.js";import"./tooltip-BMOcmBfF.js";import"./scale-CSJBkx9O.js";import"./bottom-sheet-kofgg8jr.js";import"./hooks-Bwsyy9Sg.js";import"./zoom-controls-D7tobNcm.js";import"./legend-BxY2FnMB.js";import"./gauge-1OvoBuVV.js";import"./data-table-fallback-Bhe1RDYK.js";import"./feed-kdWXV9_z.js";import"./sparkline-fcQ60k-9.js";function n(r){const t={code:"code",h1:"h1",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...i(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Recipes/Full dashboard"}),`
`,e.jsx(t.h1,{id:"a-full-dashboard",children:"A full dashboard"}),`
`,e.jsxs(t.p,{children:["A dashboard is four layers, each a separate export of ",e.jsx(t.code,{children:"vizloom/dashboard"}),":"]}),`
`,e.jsxs(t.ol,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:e.jsx(t.code,{children:"KpiStrip"})}),` — the headline numbers. The delta sits under the number, not beside it, so the strip stays
readable at phone width. It becomes a 2-column grid when the container is narrow.`]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:e.jsx(t.code,{children:"DashboardGrid"})})," — a 12-column grid driven by ",e.jsx(t.strong,{children:"container queries"}),`, not the viewport: the same dashboard
placed in a side panel collapses correctly. Every `,e.jsx(t.code,{children:"ChartCard"})," takes ",e.jsx(t.code,{children:"span={1..12}"}),"."]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:e.jsx(t.code,{children:"ChartCard"})})," — title, the ",e.jsx(t.code,{children:"?"}),` explanation, actions (segments, tabs, menus), a status slot and a body.
Its `,e.jsx(t.code,{children:"state"})," prop renders loading, empty, no-access, partial and error consistently."]}),`
`,e.jsx(t.li,{children:"Content — any chart, list or table."}),`
`]}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-tsx",children:`import { BarList, Sparkline } from 'vizloom/charts';
import { TimeSeriesChart } from 'vizloom/charts';
import { ChartCard, DashboardGrid, KpiStrip, Segmented } from 'vizloom/dashboard';
import 'vizloom/styles.css';

export function Sales({ kpis, source, byType }) {
  const [metric, setMetric] = useState('tickets');
  return (
    <>
      <KpiStrip items={kpis} />
      <DashboardGrid>
        <ChartCard
          span={8}
          title="Sales by day"
          info="Tickets sold per hour, day or week — the detail follows the zoom."
          actions={
            <Segmented
              aria-label="Metric"
              value={metric}
              onChange={setMetric}
              options={[
                { value: 'tickets', label: 'Tickets' },
                { value: 'turnover', label: 'Turnover' },
              ]}
            />
          }
        >
          <TimeSeriesChart title="Sales by day" series={series} source={source} metric={metric} stack="stack" />
        </ChartCard>
        <ChartCard span={4} title="By ticket type" state={byType ? { status: 'ready' } : { status: 'loading' }}>
          {byType && <BarList title="By ticket type" items={byType} showShare scale="sum" />}
        </ChartCard>
      </DashboardGrid>
    </>
  );
}
`})}),`
`,e.jsx(o,{of:a}),`
`,e.jsx(t.h2,{id:"on-a-phone",children:"On a phone"}),`
`,e.jsxs(t.p,{children:[`Nothing changes in the code. Cards span the full width below the grid's narrow breakpoint, the KPI strip wraps
into two columns, tooltips dock to the top of the chart so the finger does not hide them, and touch keeps vertical
scrolling for the page (`,e.jsx(t.code,{children:"touch-action: pan-y"}),") — horizontal drags pan the chart."]}),`
`,e.jsx(o,{of:d}),`
`,e.jsxs(t.p,{children:["See every page under ",e.jsx(t.strong,{children:"Examples/Dashboards"}),"."]})]})}function V(r={}){const{wrapper:t}={...i(),...r.components};return t?e.jsx(t,{...r,children:e.jsx(n,{...r})}):n(r)}export{V as default};
