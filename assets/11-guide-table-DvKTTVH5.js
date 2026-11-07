import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{useMDXComponents as d}from"./index-CxbY7dAs.js";import{M as t,C as r}from"./index-DJ8QvP8f.js";import{Orders as l}from"./examples.stories-CFX_Hepg.js";import{Live as i}from"./table.stories-CAHWsigW.js";import"./index-yBjzXJbu.js";import"./index-G8LIXM5I.js";import"./_commonjsHelpers-CqkleIqs.js";import"./iframe-H2tmL3vN.js";import"./index-BaBTCQBq.js";import"./index-B6ujFmsw.js";import"./index-DgH-xKnr.js";import"./index-Bhqu_tAV.js";import"./stories-DpxJY8y_.js";import"./provider-BLSBXahb.js";import"./format-B5KDo3eI.js";import"./cx-BrTOQ2Ro.js";import"./sparkline-fcQ60k-9.js";import"./hooks-aQKESm79.js";import"./delta-BOwf6Ond.js";function o(n){const s={code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...d(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(t,{title:"Guides/Data table"}),`
`,e.jsx(s.h1,{id:"data-table",children:"Data table"}),`
`,e.jsxs(s.p,{children:[e.jsx(s.code,{children:"vizloom/table"})," has two layers:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:e.jsx(s.code,{children:"useDataTable"})}),` — the headless core. It takes columns and rows and gives back the prepared model
(filtered, sorted, grouped, paged rows, totals, extents for bars) plus actions (`,e.jsx(s.code,{children:"toggleSort"}),", ",e.jsx(s.code,{children:"setFilter"}),`,
`,e.jsx(s.code,{children:"setPin"}),", ",e.jsx(s.code,{children:"toggleRow"}),", …). Use it with your own markup if you like."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:e.jsx(s.code,{children:"DataTable"})})," and ",e.jsx(s.strong,{children:e.jsx(s.code,{children:"DataTableToolbar"})})," — the ready UI on top of it."]}),`
`]}),`
`,e.jsxs(s.p,{children:["Styles: ",e.jsx(s.code,{children:"vizloom/table.css"})," (sparkline cells also need ",e.jsx(s.code,{children:"charts.css"}),"), or simply ",e.jsx(s.code,{children:"vizloom/styles.css"}),"."]}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-tsx",children:`import { DataTable, DataTableToolbar, defineColumns, useDataTable } from 'vizloom/table';

const columns = defineColumns<Order>([
  { id: 'number', title: 'Order', type: 'text', value: (o) => o.number, pin: 'start' },
  { id: 'amount', title: 'Amount', type: 'money', value: (o) => o.amount, total: 'sum' },
  { id: 'status', title: 'Status', type: 'status', value: (o) => o.status, options: STATUSES },
  { id: 'createdAt', title: 'Created', type: 'datetime', value: (o) => o.createdAt },
]);

function Orders({ rows }: { rows: Order[] }) {
  const table = useDataTable({ columns, rows, rowKey: (o) => o.id, selectable: true, pagination: 'pages' });
  return (
    <>
      <DataTableToolbar table={table} search filters settings />
      <DataTable table={table} label="Orders" maxHeight={560} mobileLayout="cards" />
    </>
  );
}
`})}),`
`,e.jsx(s.h2,{id:"columns",children:"Columns"}),`
`,e.jsxs(s.p,{children:["A column's ",e.jsx(s.code,{children:"type"}),` sets the defaults: alignment, width, first sort direction, filter kind and how the phone
card uses it. `,e.jsx(s.code,{children:"text"}),", ",e.jsx(s.code,{children:"number"}),", ",e.jsx(s.code,{children:"money"}),", ",e.jsx(s.code,{children:"percent"})," (0–100), ",e.jsx(s.code,{children:"date"}),", ",e.jsx(s.code,{children:"datetime"}),", ",e.jsx(s.code,{children:"status"}),"."]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"value"})," returns the raw value; ",e.jsx(s.code,{children:"null"}),' is "unknown" and renders as a dash with ',e.jsx(s.code,{children:"unknownReason"})," on hover."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"render(row, { value, formatted, share, best })"})," draws a custom cell. Ready cells: ",e.jsx(s.code,{children:"StatusCell"}),", ",e.jsx(s.code,{children:"DeltaCell"}),`,
`,e.jsx(s.code,{children:"BarCell"}),", ",e.jsx(s.code,{children:"ProgressCell"}),", ",e.jsx(s.code,{children:"SparklineCell"}),", ",e.jsx(s.code,{children:"AvatarCell"}),", ",e.jsx(s.code,{children:"TwoLineCell"}),", ",e.jsx(s.code,{children:"DotCell"}),", ",e.jsx(s.code,{children:"PillCell"}),", ",e.jsx(s.code,{children:"LinkCell"}),", ",e.jsx(s.code,{children:"UnknownCell"}),"."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"total"})," (",e.jsx(s.code,{children:"sum"}),", ",e.jsx(s.code,{children:"avg"}),", ",e.jsx(s.code,{children:"min"}),", ",e.jsx(s.code,{children:"max"}),", ",e.jsx(s.code,{children:"count"}),`) adds the column to the totals row and to group rows.
A total is unknown when any of its values is unknown — the table never shows a partial sum as the whole.`]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"pin"}),", ",e.jsx(s.code,{children:"width"}),", ",e.jsx(s.code,{children:"minWidth"}),", ",e.jsx(s.code,{children:"hidden"}),", ",e.jsx(s.code,{children:"hideable"}),", ",e.jsx(s.code,{children:"sortable"}),", ",e.jsx(s.code,{children:"filter"}),", ",e.jsx(s.code,{children:"searchable"}),", ",e.jsx(s.code,{children:"bar"}),", ",e.jsx(s.code,{children:"highlight"}),", ",e.jsx(s.code,{children:"description"}),"."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"card"})," (",e.jsx(s.code,{children:"title"}),", ",e.jsx(s.code,{children:"value"}),", ",e.jsx(s.code,{children:"meta"}),", ",e.jsx(s.code,{children:"badge"}),", ",e.jsx(s.code,{children:"hidden"}),") places the column in the phone card."]}),`
`]}),`
`,e.jsx(s.h2,{id:"data-modes",children:"Data modes"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Client"}),` (default): give all rows; the table filters, sorts, groups and pages them. 50 000 rows stay
smooth with `,e.jsx(s.code,{children:"maxHeight"})," (rows are virtualized from 120 items)."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Server"}),": ",e.jsx(s.code,{children:"mode: 'server'"}),", ",e.jsx(s.code,{children:"rowCount"}),", and ",e.jsx(s.code,{children:"onStateChange"}),` — the table reports filters, search, sort and
page; you fetch and pass the prepared rows back. Pass `,e.jsx(s.code,{children:"loading"})," while a request runs."]}),`
`]}),`
`,e.jsx(s.h2,{id:"states",children:"States"}),`
`,e.jsxs(s.p,{children:[e.jsx(s.code,{children:"loading"}),", ",e.jsx(s.code,{children:"error"})," (with ",e.jsx(s.code,{children:"onRetry"}),"), ",e.jsx(s.code,{children:"refreshError"})," (keeps the old rows), ",e.jsx(s.code,{children:"noAccess"}),", ",e.jsx(s.code,{children:"empty"}),` — or one
`,e.jsx(s.code,{children:"state: BlockState"})," from ",e.jsx(s.code,{children:"vizloom/core"}),'. "Nothing found" after filtering offers to reset the filters.']}),`
`,e.jsx(s.h2,{id:"phones",children:"Phones"}),`
`,e.jsxs(s.p,{children:["Below ",e.jsx(s.code,{children:"mobileBelow"})," (640 px of the table's own width) the table turns into cards (",e.jsx(s.code,{children:'mobileLayout="cards"'}),`) or
keeps scrolling sideways with only the first column pinned, at most 45 % wide (`,e.jsx(s.code,{children:'"scroll"'}),`). Popovers become
bottom sheets; `,e.jsx(s.code,{children:"rowDetails"})," opens a row as a sheet."]}),`
`,e.jsx(s.h2,{id:"live-updates",children:"Live updates"}),`
`,e.jsxs(s.p,{children:["Pass new ",e.jsx(s.code,{children:"rows"})," with the same keys and ",e.jsx(s.code,{children:"pulseChanges"}),`: changed cells flash for 1.6 s with the change
(`,e.jsx(s.code,{children:"+3"}),"), at most 14 at once. With ",e.jsx(s.code,{children:"prefers-reduced-motion"})," they get a quiet tint instead."]}),`
`,e.jsx(s.h2,{id:"keyboard-and-screen-readers",children:"Keyboard and screen readers"}),`
`,e.jsxs(s.p,{children:["The table is an ARIA ",e.jsx(s.code,{children:"grid"})," with one tab stop. Arrows move between cells, ",e.jsx(s.code,{children:"Home"}),"/",e.jsx(s.code,{children:"End"})," (with ",e.jsx(s.code,{children:"Ctrl"}),` — to the
corners), `,e.jsx(s.code,{children:"PageUp"}),"/",e.jsx(s.code,{children:"PageDown"})," by ten rows, ",e.jsx(s.code,{children:"Enter"})," sorts in the header or opens the row, ",e.jsx(s.code,{children:"F2"}),` enters a cell's
control and `,e.jsx(s.code,{children:"Escape"})," leaves it, ",e.jsx(s.code,{children:"Space"}),` selects the row or toggles a group. Column edges resize with arrow keys
(`,e.jsx(s.code,{children:"Shift"})," for big steps). Sort state is announced through ",e.jsx(s.code,{children:"aria-sort"}),"."]}),`
`,e.jsx(s.h2,{id:"settings",children:"Settings"}),`
`,e.jsxs(s.p,{children:["With ",e.jsx(s.code,{children:"storageKey"}),`, column order, widths, visibility, pins, sort, density and grouping persist in
`,e.jsx(s.code,{children:"localStorage"})," (or your own ",e.jsx(s.code,{children:"storage"}),"). Stored settings are versioned and dropped when the columns change."]}),`
`,e.jsx(r,{of:l}),`
`,e.jsx(r,{of:i})]})}function P(n={}){const{wrapper:s}={...d(),...n.components};return s?e.jsx(s,{...n,children:e.jsx(o,{...n})}):o(n)}export{P as default};
