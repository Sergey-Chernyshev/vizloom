import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{r as d}from"./index-G8LIXM5I.js";import{u as i,a as c,D as k,f as mt,e as u,s as ht,g as wt,O as w,m as U,h as gt,i as bt,T as g,P as vt,c as xt,d as kt,t as St,b as ft,j as W,S as Y,B as yt,k as J,l as Q,A as X,n as jt,o as Rt,p as Dt,L as Z,U as Ct}from"./stories-DpxJY8y_.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-CqkleIqs.js";import"./provider-BLSBXahb.js";import"./format-B5KDo3eI.js";import"./cx-BrTOQ2Ro.js";import"./index-BaBTCQBq.js";import"./index-B6ujFmsw.js";import"./sparkline-fcQ60k-9.js";import"./hooks-aQKESm79.js";import"./delta-BOwf6Ond.js";const es={title:"Table/DataTable",parameters:{layout:"padded"}},x=U(200),_=t=>t.id,b=t=>t.id;function n({title:t,note:s,toolbar:r,children:a}){return e.jsxs("section",{className:"sbt-block",children:[e.jsxs("div",{className:"sbt-head",children:[e.jsx("h3",{className:"sbt-title",children:t}),r]}),s===void 0?null:e.jsx("p",{className:"sbt-note",children:s}),a]})}function Pt(t,s){kt(St(ft(t.model.matched,t.visible)),`${s}.csv`)}function o({rows:t=x,options:s,view:r,title:a="Orders",note:v}){const p=i({columns:w,rows:t,rowKey:_,storage:null,pagination:"pages",pageSize:25,...s});return e.jsx(n,{title:a,note:v,toolbar:e.jsx(k,{table:p,search:!0,filters:!0,settings:!0,exportFormats:["csv"],onExport:()=>Pt(p,"orders")}),children:e.jsx(c,{table:p,label:a,...r})})}function Ot(){const t=i({columns:g,rows:u,rowKey:b,storage:null});return e.jsx(n,{title:"Ticket types",note:"Click a header to sort, Shift+click adds a second key. Hover a header for its menu.",toolbar:e.jsx(k,{table:t,search:!0,settings:!0}),children:e.jsx(c,{table:t,label:"Ticket types"})})}const S={name:"Basic: sort, totals, toolbar",render:()=>e.jsx(Ot,{})},f={name:"Sorting: multi-sort",render:()=>e.jsx(o,{note:"Sorted by status, then by amount. Shift+click a header to add, flip or remove a key; the badge shows the key order.",options:{defaultSort:[{columnId:"status",direction:"asc"},{columnId:"amount",direction:"desc"}]}})};function Tt(){const t=d.useMemo(()=>w.map(r=>r.id==="status"?{...r,pin:"end"}:r.id==="fee"||r.id==="promo"?{...r,hidden:!1}:r),[]),s=i({columns:t,rows:x,rowKey:_,storage:null,selectable:!0});return e.jsx(n,{title:"Orders",note:"Order number and selection pinned to the start, status to the end. The table scrolls inside 420 px; shadows show there is more. Past the edges the page scrolls on.",toolbar:e.jsx(k,{table:s,settings:!0}),children:e.jsx(c,{table:s,label:"Orders",maxHeight:420})})}const y={name:"Pinned columns, max height, scroll shadows",render:()=>e.jsx(Tt,{})},j={name:"Grouping with group totals",render:()=>e.jsx(o,{note:"Grouped by ticket type with totals per group. Change grouping in Customize; groups collapse and the group checkbox selects its rows.",options:{selectable:!0,groupings:[{id:"ticket",label:"Ticket type",key:t=>t.ticket},{id:"channel",label:"Channel",key:t=>t.channel},{id:"status",label:"Status",key:t=>t.status,title:t=>t.charAt(0).toUpperCase()+t.slice(1)}],defaultGroupBy:"ticket",pagination:"none"},view:{maxHeight:560}})},R={name:"Expandable rows",render:()=>e.jsx(o,{options:{expandable:t=>t.status!=="failed",pageSize:10},note:"Failed orders have nothing to show and get no toggle.",view:{renderExpanded:t=>e.jsxs("dl",{className:"sbt-detail",children:[e.jsxs("div",{children:[e.jsx("dt",{children:"Email"}),e.jsx("dd",{children:t.email})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Tickets"}),e.jsxs("dd",{children:[t.quantity," × ",t.ticket]})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Checked in"}),e.jsxs("dd",{children:[t.checkedIn," of ",t.quantity]})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Promo code"}),e.jsx("dd",{children:t.promo??"—"})]})]})}})},D={name:"Row selection and bulk actions",render:()=>e.jsx(o,{options:{selectable:!0},note:"Select rows with the checkboxes or Space on a focused row. The bar below offers actions for the selection.",view:{bulkActions:t=>e.jsxs(e.Fragment,{children:[e.jsxs("button",{type:"button",className:"vl-table-button vl-table-button--secondary vl-table-button--xs",children:["Resend tickets (",t.length,")"]}),e.jsx("button",{type:"button",className:"vl-table-button vl-table-button--xs",children:"Refund"})]}),rowMenu:t=>[{id:"open",label:`Open ${t.number}`,onSelect:()=>{}},{id:"resend",label:"Resend tickets",onSelect:()=>{}},"separator",{id:"refund",label:"Refund",destructive:!0,disabled:t.status!=="paid",onSelect:()=>{}}]}})},C={name:"Column settings: visibility, order, width, pins, density",render:()=>e.jsx(o,{note:"Customize: show or hide columns, drag (or use arrow keys on the handle) to reorder, pin to an edge, switch density. Drag a header edge to resize, double-click it to fit. Settings persist under a storage key.",options:{storageKey:"vizloom-story-orders",storage:void 0}})},P={name:"Filters (text, range, select, dates) and search",render:()=>e.jsx(o,{note:"Filters: amount is a range, ticket and channel are lists with counts, created is a date range, buyer is text. Active filters show as chips above the table.",options:{defaultSort:[{columnId:"createdAt",direction:"desc"}]}})},O={name:"Pagination: pages, show more, infinite",render:()=>e.jsxs("div",{className:"sbt-stack",children:[e.jsx(o,{title:"Pages",options:{pagination:"pages",pageSize:10}}),e.jsx(o,{title:"Show more",options:{pagination:"more",pageSize:10}}),e.jsx(o,{title:"Infinite scroll",options:{pagination:"infinite",pageSize:30},view:{maxHeight:400}})]})};function zt(){const t=d.useMemo(()=>U(5e4,5),[]);return e.jsx(o,{rows:t,title:"50 000 orders",note:"Only the visible rows are in the DOM. Sorting, filtering, search and totals run over all 50 000.",options:{pagination:"none",selectable:!0},view:{maxHeight:560}})}const T={name:"Big data: 50 000 rows, virtualized",render:()=>e.jsx(zt,{})},z={name:"Density: regular and compact",render:()=>e.jsxs("div",{className:"sbt-stack",children:[e.jsx(o,{title:"Regular",options:{pageSize:10}}),e.jsx(o,{title:"Compact",options:{pageSize:10,defaultDensity:"compact"}})]})};function Nt(){const t=i({columns:g,rows:u.slice(1),rowKey:b,storage:null});return e.jsx(n,{title:"Ticket types",note:"The best seller stays on top whatever the sort.",children:e.jsx(c,{table:t,label:"Ticket types",pinnedRows:{top:u.slice(0,1)}})})}const N={name:"Pinned rows",render:()=>e.jsx(Nt,{})};function m({title:t,rows:s,view:r}){const a=i({columns:w,rows:s,rowKey:_,storage:null});return e.jsx(n,{title:t,children:e.jsx(c,{table:a,label:t,...r})})}const V={name:"States: loading, empty, error, no access, partial",render:()=>e.jsxs("div",{className:"sbt-stack",children:[e.jsx(m,{title:"Loading",rows:[],view:{loading:!0}}),e.jsx(m,{title:"Empty",rows:[],view:{empty:{title:"No orders yet",description:"Orders appear here as soon as tickets go on sale."}}}),e.jsx(m,{title:"Load error",rows:[],view:{error:{onRetry:()=>{}}}}),e.jsx(m,{title:"Refresh failed, old rows kept",rows:x.slice(0,4),view:{refreshError:{onRetry:()=>{}}}}),e.jsx(m,{title:"No access",rows:x.slice(0,4),view:{noAccess:{description:"Ask the event owner for the Finance role."}}}),e.jsx(m,{title:"Partial data (core BlockState)",rows:x.slice(0,4),view:{state:{status:"partial",reason:"Box office sales sync once an hour."}}}),e.jsx(m,{title:"Loading via core BlockState",rows:[],view:{state:{status:"loading"}}})]})};function Vt(){const t=[{id:"n",kind:"Number / money / percent",cell:e.jsx("span",{className:"vl-table__text",children:"$128,400 · 2,874 · 38.2%"})},{id:"delta",kind:"Delta badge",cell:e.jsx(W,{value:12})},{id:"delta-inv",kind:"Delta, lower is better",cell:e.jsx(W,{value:8,invert:!0})},{id:"spark",kind:"Sparkline",cell:e.jsx(Y,{values:u[0].trend,"aria-label":"Rising over 14 days"})},{id:"spark-gap",kind:"Sparkline with a gap",cell:e.jsx(Y,{values:u[4].trend,tone:"neutral"})},{id:"bar",kind:"Mini bar",cell:e.jsx(yt,{share:.72,children:"$94,686"})},{id:"progress",kind:"Progress",cell:e.jsx(J,{value:212,max:300})},{id:"progress-full",kind:"Progress, full",cell:e.jsx(J,{value:600,max:600,label:"Sold out"})},{id:"status",kind:"Status",cell:e.jsx(Q,{tone:"positive",children:"On sale"})},{id:"status-w",kind:"Status, warning",cell:e.jsx(Q,{tone:"warning",children:"Paused"})},{id:"avatar",kind:"Avatar with second line",cell:e.jsx(X,{name:"Nora Vale",secondary:"nora.vale@example.com"})},{id:"icon",kind:"Icon",cell:e.jsx(X,{name:"Main stage",icon:"♪",secondary:"Capacity 2,400"})},{id:"two",kind:"Two lines",cell:e.jsx(jt,{primary:"Weekend pass",secondary:"Fri–Sun, all stages"})},{id:"dot",kind:"Dot",cell:e.jsx(Rt,{color:"var(--vl-cat-2)",children:"Mobile app"})},{id:"pill",kind:"Pill",cell:e.jsx(Dt,{tone:"accent",children:"SUMMER15"})},{id:"link",kind:"Link",cell:e.jsx(Z,{href:"https://example.com/orders/482000",children:"#482000"})},{id:"unsafe",kind:"Unsafe link → text",cell:e.jsx(Z,{href:"javascript:void(0)",children:"#482001"})},{id:"unknown",kind:"Unknown with a reason",cell:e.jsx(Ct,{reason:"Not on sale last week"})}],s=mt([{id:"kind",title:"Cell",type:"text",value:a=>a.kind,sortable:!1,filter:!1},{id:"cell",title:"Example",type:"text",value:()=>null,render:a=>a.cell,sortable:!1,filter:!1,width:320}]),r=i({columns:s,rows:t,rowKey:a=>a.id,storage:null});return e.jsxs("div",{className:"sbt-stack",children:[e.jsx(n,{title:"All cell types",children:e.jsx(c,{table:r,label:"Cell types"})}),e.jsx(n,{title:"In context",children:e.jsx(Et,{})})]})}const E={name:"Cells gallery",render:()=>e.jsx(Vt,{})};function Et(){const t=i({columns:vt,rows:xt,rowKey:s=>s.id,storage:null});return e.jsx(c,{table:t,label:"Promo codes"})}function At(){const[t,s]=d.useState(u),r=d.useRef(ht(3));d.useEffect(()=>{const v=setInterval(()=>s(p=>wt(p,r.current)),1800);return()=>clearInterval(v)},[]);const a=i({columns:g,rows:t,rowKey:b,storage:null});return e.jsx(n,{title:"Ticket types — live",note:"Changed cells flash green or red with the change for 1.6 s; at most 14 at once. With reduced motion, a quiet tint instead.",children:e.jsx(c,{table:a,label:"Ticket types, live",pulseChanges:!0})})}const A={name:"Live updates with pulse",render:()=>e.jsx(At,{})};function Lt(){const t=d.useMemo(()=>U(4e3,9),[]),[s,r]=d.useState(void 0),[a,v]=d.useState(null),[p,G]=d.useState(!0),h=i({columns:w,rows:(a==null?void 0:a.rows)??[],rowCount:(a==null?void 0:a.total)??0,rowKey:_,storage:null,mode:"server",pagination:"pages",pageSize:25,onStateChange:r}),l=s??h.state;return d.useEffect(()=>{G(!0);const pt=setTimeout(()=>{const q=gt(bt(t,w,l.filters,l.search,h.format),w,l.sort,h.format.locale),$=l.page*l.pageSize;v({rows:q.slice($,$+l.pageSize),total:q.length}),G(!1)},450);return()=>clearTimeout(pt)},[t,l.filters,l.search,l.sort,l.page,l.pageSize,h.format]),e.jsx(n,{title:"Orders from a server",note:"Filters, search, sort and page go to the (fake) backend; rows come back already prepared.",toolbar:e.jsx(k,{table:h,search:!0,filters:!0,settings:!0}),children:e.jsx(c,{table:h,label:"Orders from a server",loading:p})})}const L={name:"Server mode",render:()=>e.jsx(Lt,{})};function Bt(){const[t,s]=d.useState("o3");return e.jsx(o,{options:{pageSize:10},note:"The first cell is a real link (middle click, open in new tab work); the click on the row is intercepted here to mark the active row.",view:{rowHref:r=>`#/orders/${r.id}`,onRowNavigate:(r,a)=>{a.preventDefault(),s(r.split("/").at(-1)??null)},activeRowKey:t}})}const B={name:"Row links and active row",render:()=>e.jsx(Bt,{})},M={name:"Phone 390: cards",parameters:{viewport:{defaultViewport:"phone"}},globals:{viewport:{value:"phone",isRotated:!1}},render:()=>e.jsx(o,{options:{pageSize:10,selectable:!0},note:"Below 640 px each row becomes a card: title, value, meta line and status. Sorting moves to a menu above.",view:{mobileLayout:"cards",rowDetails:!0}})};function Mt(){const t=i({columns:g,rows:u,rowKey:b,storage:null});return e.jsx(n,{title:"Ticket types",note:"Only the first column stays pinned and takes at most 45% of the width; the rest scrolls sideways. Tap a row for details.",children:e.jsx(c,{table:t,label:"Ticket types",mobileLayout:"scroll",rowDetails:!0})})}const K={name:"Phone 390: scroll with the first column pinned",parameters:{viewport:{defaultViewport:"phone"}},globals:{viewport:{value:"phone",isRotated:!1}},render:()=>e.jsx(Mt,{})},I={name:"Dark theme",globals:{theme:"dark"},render:()=>e.jsx(o,{options:{selectable:!0,pageSize:10},view:{maxHeight:420}})};function Kt(){const t=i({columns:g,rows:u,rowKey:b,storage:null,currency:"RUB"});return e.jsx(n,{title:"Типы билетов",toolbar:e.jsx(k,{table:t,search:!0,settings:!0}),children:e.jsx(c,{table:t,label:"Типы билетов"})})}const H={name:"Russian locale",globals:{locale:"ru"},render:()=>e.jsx(Kt,{})};function It(){const t=i({columns:g,rows:u,rowKey:b,storage:null});return e.jsx(n,{title:"useDataTable without DataTable",note:"The hook gives the prepared rows, totals and actions; the markup is yours.",children:e.jsx("div",{className:"sbt-card",children:e.jsxs("table",{className:"sbt-plain",children:[e.jsx("thead",{children:e.jsx("tr",{children:t.visible.slice(0,4).map(s=>{const r=t.state.sort.find(a=>a.columnId===s.id);return e.jsx("th",{"data-align":s.type==="text"?void 0:"end","aria-sort":r===void 0?"none":r.direction==="asc"?"ascending":"descending",children:e.jsxs("button",{type:"button",onClick:()=>t.toggleSort(s.id),children:[s.title,r===void 0?"":r.direction==="asc"?" ↑":" ↓"]})},s.id)})})}),e.jsx("tbody",{children:t.model.items.map(s=>s.kind==="row"?e.jsx("tr",{children:t.visible.slice(0,4).map(r=>e.jsx("td",{"data-align":r.type==="text"?void 0:"end",children:String(r.value(s.row)??"—")},r.id))},s.key):null)})]})})})}const F={name:"Headless: your own markup",render:()=>e.jsx(It,{})};var ee,te,se;S.parameters={...S.parameters,docs:{...(ee=S.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  name: 'Basic: sort, totals, toolbar',
  render: () => <BasicView />
}`,...(se=(te=S.parameters)==null?void 0:te.docs)==null?void 0:se.source}}};var re,ae,oe;f.parameters={...f.parameters,docs:{...(re=f.parameters)==null?void 0:re.docs,source:{originalSource:`{
  name: 'Sorting: multi-sort',
  render: () => <OrdersDemo note="Sorted by status, then by amount. Shift+click a header to add, flip or remove a key; the badge shows the key order." options={{
    defaultSort: [{
      columnId: 'status',
      direction: 'asc'
    }, {
      columnId: 'amount',
      direction: 'desc'
    }]
  }} />
}`,...(oe=(ae=f.parameters)==null?void 0:ae.docs)==null?void 0:oe.source}}};var ne,ie,le;y.parameters={...y.parameters,docs:{...(ne=y.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  name: 'Pinned columns, max height, scroll shadows',
  render: () => <PinnedAndScrollView />
}`,...(le=(ie=y.parameters)==null?void 0:ie.docs)==null?void 0:le.source}}};var de,ce,ue;j.parameters={...j.parameters,docs:{...(de=j.parameters)==null?void 0:de.docs,source:{originalSource:`{
  name: 'Grouping with group totals',
  render: () => <OrdersDemo note="Grouped by ticket type with totals per group. Change grouping in Customize; groups collapse and the group checkbox selects its rows." options={{
    selectable: true,
    groupings: [{
      id: 'ticket',
      label: 'Ticket type',
      key: row => row.ticket
    }, {
      id: 'channel',
      label: 'Channel',
      key: row => row.channel
    }, {
      id: 'status',
      label: 'Status',
      key: row => row.status,
      title: key => key.charAt(0).toUpperCase() + key.slice(1)
    }],
    defaultGroupBy: 'ticket',
    pagination: 'none'
  }} view={{
    maxHeight: 560
  }} />
}`,...(ue=(ce=j.parameters)==null?void 0:ce.docs)==null?void 0:ue.source}}};var pe,me,he;R.parameters={...R.parameters,docs:{...(pe=R.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  name: 'Expandable rows',
  render: () => <OrdersDemo options={{
    expandable: row => row.status !== 'failed',
    pageSize: 10
  }} note="Failed orders have nothing to show and get no toggle." view={{
    renderExpanded: row => <dl className="sbt-detail">
            <div>
              <dt>Email</dt>
              <dd>{row.email}</dd>
            </div>
            <div>
              <dt>Tickets</dt>
              <dd>
                {row.quantity} × {row.ticket}
              </dd>
            </div>
            <div>
              <dt>Checked in</dt>
              <dd>
                {row.checkedIn} of {row.quantity}
              </dd>
            </div>
            <div>
              <dt>Promo code</dt>
              <dd>{row.promo ?? '—'}</dd>
            </div>
          </dl>
  }} />
}`,...(he=(me=R.parameters)==null?void 0:me.docs)==null?void 0:he.source}}};var we,ge,be;D.parameters={...D.parameters,docs:{...(we=D.parameters)==null?void 0:we.docs,source:{originalSource:`{
  name: 'Row selection and bulk actions',
  render: () => <OrdersDemo options={{
    selectable: true
  }} note="Select rows with the checkboxes or Space on a focused row. The bar below offers actions for the selection." view={{
    bulkActions: rows => <>
            <button type="button" className="vl-table-button vl-table-button--secondary vl-table-button--xs">
              Resend tickets ({rows.length})
            </button>
            <button type="button" className="vl-table-button vl-table-button--xs">
              Refund
            </button>
          </>,
    rowMenu: row => [{
      id: 'open',
      label: \`Open \${row.number}\`,
      onSelect: () => undefined
    }, {
      id: 'resend',
      label: 'Resend tickets',
      onSelect: () => undefined
    }, 'separator', {
      id: 'refund',
      label: 'Refund',
      destructive: true,
      disabled: row.status !== 'paid',
      onSelect: () => undefined
    }]
  }} />
}`,...(be=(ge=D.parameters)==null?void 0:ge.docs)==null?void 0:be.source}}};var ve,xe,ke;C.parameters={...C.parameters,docs:{...(ve=C.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  name: 'Column settings: visibility, order, width, pins, density',
  render: () => <OrdersDemo note="Customize: show or hide columns, drag (or use arrow keys on the handle) to reorder, pin to an edge, switch density. Drag a header edge to resize, double-click it to fit. Settings persist under a storage key." options={{
    storageKey: 'vizloom-story-orders',
    storage: undefined
  }} />
}`,...(ke=(xe=C.parameters)==null?void 0:xe.docs)==null?void 0:ke.source}}};var Se,fe,ye;P.parameters={...P.parameters,docs:{...(Se=P.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  name: 'Filters (text, range, select, dates) and search',
  render: () => <OrdersDemo note="Filters: amount is a range, ticket and channel are lists with counts, created is a date range, buyer is text. Active filters show as chips above the table." options={{
    defaultSort: [{
      columnId: 'createdAt',
      direction: 'desc'
    }]
  }} />
}`,...(ye=(fe=P.parameters)==null?void 0:fe.docs)==null?void 0:ye.source}}};var je,Re,De;O.parameters={...O.parameters,docs:{...(je=O.parameters)==null?void 0:je.docs,source:{originalSource:`{
  name: 'Pagination: pages, show more, infinite',
  render: () => <div className="sbt-stack">
      <OrdersDemo title="Pages" options={{
      pagination: 'pages',
      pageSize: 10
    }} />
      <OrdersDemo title="Show more" options={{
      pagination: 'more',
      pageSize: 10
    }} />
      <OrdersDemo title="Infinite scroll" options={{
      pagination: 'infinite',
      pageSize: 30
    }} view={{
      maxHeight: 400
    }} />
    </div>
}`,...(De=(Re=O.parameters)==null?void 0:Re.docs)==null?void 0:De.source}}};var Ce,Pe,Oe;T.parameters={...T.parameters,docs:{...(Ce=T.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  name: 'Big data: 50 000 rows, virtualized',
  render: () => <Virtualized50kView />
}`,...(Oe=(Pe=T.parameters)==null?void 0:Pe.docs)==null?void 0:Oe.source}}};var Te,ze,Ne;z.parameters={...z.parameters,docs:{...(Te=z.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  name: 'Density: regular and compact',
  render: () => <div className="sbt-stack">
      <OrdersDemo title="Regular" options={{
      pageSize: 10
    }} />
      <OrdersDemo title="Compact" options={{
      pageSize: 10,
      defaultDensity: 'compact'
    }} />
    </div>
}`,...(Ne=(ze=z.parameters)==null?void 0:ze.docs)==null?void 0:Ne.source}}};var Ve,Ee,Ae;N.parameters={...N.parameters,docs:{...(Ve=N.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  name: 'Pinned rows',
  render: () => <PinnedRowsView />
}`,...(Ae=(Ee=N.parameters)==null?void 0:Ee.docs)==null?void 0:Ae.source}}};var Le,Be,Me;V.parameters={...V.parameters,docs:{...(Le=V.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  name: 'States: loading, empty, error, no access, partial',
  render: () => <div className="sbt-stack">
      <StatesDemo title="Loading" rows={[]} view={{
      loading: true
    }} />
      <StatesDemo title="Empty" rows={[]} view={{
      empty: {
        title: 'No orders yet',
        description: 'Orders appear here as soon as tickets go on sale.'
      }
    }} />
      <StatesDemo title="Load error" rows={[]} view={{
      error: {
        onRetry: () => undefined
      }
    }} />
      <StatesDemo title="Refresh failed, old rows kept" rows={ORDERS_200.slice(0, 4)} view={{
      refreshError: {
        onRetry: () => undefined
      }
    }} />
      <StatesDemo title="No access" rows={ORDERS_200.slice(0, 4)} view={{
      noAccess: {
        description: 'Ask the event owner for the Finance role.'
      }
    }} />
      <StatesDemo title="Partial data (core BlockState)" rows={ORDERS_200.slice(0, 4)} view={{
      state: {
        status: 'partial',
        reason: 'Box office sales sync once an hour.'
      }
    }} />
      <StatesDemo title="Loading via core BlockState" rows={[]} view={{
      state: {
        status: 'loading'
      }
    }} />
    </div>
}`,...(Me=(Be=V.parameters)==null?void 0:Be.docs)==null?void 0:Me.source}}};var Ke,Ie,He;E.parameters={...E.parameters,docs:{...(Ke=E.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
  name: 'Cells gallery',
  render: () => <CellsView />
}`,...(He=(Ie=E.parameters)==null?void 0:Ie.docs)==null?void 0:He.source}}};var Fe,_e,Ue;A.parameters={...A.parameters,docs:{...(Fe=A.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  name: 'Live updates with pulse',
  render: () => <LiveView />
}`,...(Ue=(_e=A.parameters)==null?void 0:_e.docs)==null?void 0:Ue.source}}};var Ge,qe,$e;L.parameters={...L.parameters,docs:{...(Ge=L.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
  name: 'Server mode',
  render: () => <ServerModeView />
}`,...($e=(qe=L.parameters)==null?void 0:qe.docs)==null?void 0:$e.source}}};var We,Ye,Je;B.parameters={...B.parameters,docs:{...(We=B.parameters)==null?void 0:We.docs,source:{originalSource:`{
  name: 'Row links and active row',
  render: () => <RowNavigationView />
}`,...(Je=(Ye=B.parameters)==null?void 0:Ye.docs)==null?void 0:Je.source}}};var Qe,Xe,Ze;M.parameters={...M.parameters,docs:{...(Qe=M.parameters)==null?void 0:Qe.docs,source:{originalSource:`{
  name: 'Phone 390: cards',
  parameters: {
    viewport: {
      defaultViewport: 'phone'
    }
  },
  globals: {
    viewport: {
      value: 'phone',
      isRotated: false
    }
  },
  render: () => <OrdersDemo options={{
    pageSize: 10,
    selectable: true
  }} note="Below 640 px each row becomes a card: title, value, meta line and status. Sorting moves to a menu above." view={{
    mobileLayout: 'cards',
    rowDetails: true
  }} />
}`,...(Ze=(Xe=M.parameters)==null?void 0:Xe.docs)==null?void 0:Ze.source}}};var et,tt,st;K.parameters={...K.parameters,docs:{...(et=K.parameters)==null?void 0:et.docs,source:{originalSource:`{
  name: 'Phone 390: scroll with the first column pinned',
  parameters: {
    viewport: {
      defaultViewport: 'phone'
    }
  },
  globals: {
    viewport: {
      value: 'phone',
      isRotated: false
    }
  },
  render: () => <PhoneScrollView />
}`,...(st=(tt=K.parameters)==null?void 0:tt.docs)==null?void 0:st.source}}};var rt,at,ot;I.parameters={...I.parameters,docs:{...(rt=I.parameters)==null?void 0:rt.docs,source:{originalSource:`{
  name: 'Dark theme',
  globals: {
    theme: 'dark'
  },
  render: () => <OrdersDemo options={{
    selectable: true,
    pageSize: 10
  }} view={{
    maxHeight: 420
  }} />
}`,...(ot=(at=I.parameters)==null?void 0:at.docs)==null?void 0:ot.source}}};var nt,it,lt;H.parameters={...H.parameters,docs:{...(nt=H.parameters)==null?void 0:nt.docs,source:{originalSource:`{
  name: 'Russian locale',
  globals: {
    locale: 'ru'
  },
  render: () => <RussianView />
}`,...(lt=(it=H.parameters)==null?void 0:it.docs)==null?void 0:lt.source}}};var dt,ct,ut;F.parameters={...F.parameters,docs:{...(dt=F.parameters)==null?void 0:dt.docs,source:{originalSource:`{
  name: 'Headless: your own markup',
  render: () => <HeadlessView />
}`,...(ut=(ct=F.parameters)==null?void 0:ct.docs)==null?void 0:ut.source}}};const ts=["Basic","MultiSort","PinnedAndScroll","Grouping","ExpandableRows","Selection","ColumnSettings","FiltersAndSearch","Pagination","Virtualized50k","Density","PinnedRows","States","Cells","Live","ServerMode","RowNavigation","PhoneCards","PhoneScroll","DarkTheme","Russian","Headless"];export{S as Basic,E as Cells,C as ColumnSettings,I as DarkTheme,z as Density,R as ExpandableRows,P as FiltersAndSearch,j as Grouping,F as Headless,A as Live,f as MultiSort,O as Pagination,M as PhoneCards,K as PhoneScroll,y as PinnedAndScroll,N as PinnedRows,B as RowNavigation,H as Russian,D as Selection,L as ServerMode,V as States,T as Virtualized50k,ts as __namedExportsOrder,es as default};
