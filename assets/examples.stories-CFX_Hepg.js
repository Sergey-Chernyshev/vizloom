import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{r as b}from"./index-G8LIXM5I.js";import{m as C,u as i,D as m,a as p,d as M,t as D,b as K,O as R,P as _,c as A,T as I,e as z}from"./stories-DpxJY8y_.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-CqkleIqs.js";import"./provider-BLSBXahb.js";import"./format-B5KDo3eI.js";import"./cx-BrTOQ2Ro.js";import"./index-BaBTCQBq.js";import"./index-B6ujFmsw.js";import"./sparkline-fcQ60k-9.js";import"./hooks-aQKESm79.js";import"./delta-BOwf6Ond.js";const re={title:"Examples/Tables",parameters:{layout:"padded"}};function E(){const t=b.useMemo(()=>C(1200,21),[]),s=i({columns:R,rows:t,rowKey:r=>r.id,selectable:!0,pagination:"pages",pageSize:25,defaultSort:[{columnId:"createdAt",direction:"desc"}],groupings:[{id:"ticket",label:"Ticket type",key:r=>r.ticket},{id:"channel",label:"Channel",key:r=>r.channel}],viewToggles:[],storageKey:"vizloom-example-orders"});return e.jsxs("section",{className:"sbt-block",children:[e.jsxs("div",{className:"sbt-head",children:[e.jsx("h2",{className:"sbt-title",children:"Orders"}),e.jsx(m,{table:s,search:!0,searchPlaceholder:"Order, buyer or email",filters:!0,settings:!0,exportFormats:["csv"],onExport:()=>M(D(K(s.model.matched,s.visible)),"orders.csv")})]}),e.jsx(p,{table:s,label:"Orders",mobileLayout:"cards",rowHref:r=>`#/orders/${r.id}`,onRowNavigate:(r,a)=>a.preventDefault(),bulkActions:r=>e.jsxs("button",{type:"button",className:"vl-table-button vl-table-button--secondary vl-table-button--xs",children:["Resend ",r.length," tickets"]}),rowMenu:r=>[{id:"resend",label:"Resend tickets",onSelect:()=>{}},{id:"refund",label:"Refund",destructive:!0,disabled:r.status!=="paid",onSelect:()=>{}}]})]})}const o={render:()=>e.jsx(E,{})};function U(){const t=i({columns:_,rows:A,rowKey:s=>s.id,storage:null,defaultSort:[{columnId:"revenue",direction:"desc"}]});return e.jsxs("section",{className:"sbt-block",children:[e.jsxs("div",{className:"sbt-head",children:[e.jsx("h2",{className:"sbt-title",children:"Promo codes"}),e.jsx(m,{table:t,search:!0,settings:!0})]}),e.jsx(p,{table:t,label:"Promo codes",mobileLayout:"cards",totalsLabel:"All codes"})]})}const n={name:"Promo codes",render:()=>e.jsx(U,{})};function H(){const t=i({columns:I,rows:z,rowKey:s=>s.id,storage:null,expandable:s=>s.sold>0});return e.jsxs("section",{className:"sbt-block",children:[e.jsxs("div",{className:"sbt-head",children:[e.jsx("h2",{className:"sbt-title",children:"Ticket types"}),e.jsx(m,{table:t,settings:!0})]}),e.jsx(p,{table:t,label:"Ticket types",renderExpanded:s=>e.jsxs("dl",{className:"sbt-detail",children:[e.jsxs("div",{children:[e.jsx("dt",{children:"Capacity left"}),e.jsx("dd",{children:s.capacity-s.sold})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Average per day"}),e.jsx("dd",{children:Math.round(s.sold/14)})]})]})})]})}const l={name:"Ticket types",render:()=>e.jsx(H,{})};function V(){const t=b.useMemo(()=>C(2e4,33),[]),[s,r]=b.useState(null),a=i({columns:R,rows:t,rowKey:u=>u.id,storage:null,pagination:"none"});return e.jsxs("section",{className:"sbt-block",children:[e.jsxs("div",{className:"sbt-head",children:[e.jsx("h2",{className:"sbt-title",children:"All orders of the season"}),e.jsx(m,{table:a,search:!0,filters:!0,settings:!0})]}),e.jsx("p",{className:"sbt-note",children:"20 000 rows in a 600 px window, virtualized. Click a row to mark it active."}),e.jsx(p,{table:a,label:"All orders",maxHeight:600,onRowClick:u=>r(u.id),activeRowKey:s})]})}const c={name:"Long list",render:()=>e.jsx(V,{})},d={name:"Orders on a phone",parameters:{viewport:{defaultViewport:"phone"}},globals:{viewport:{value:"phone",isRotated:!1}},render:()=>e.jsx(E,{})};var h,x,g;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <OrdersPage />
}`,...(g=(x=o.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};var j,v,k;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'Promo codes',
  render: () => <PromoPage />
}`,...(k=(v=n.parameters)==null?void 0:v.docs)==null?void 0:k.source}}};var y,O,P;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'Ticket types',
  render: () => <TicketsPage />
}`,...(P=(O=l.parameters)==null?void 0:O.docs)==null?void 0:P.source}}};var T,f,w;c.parameters={...c.parameters,docs:{...(T=c.parameters)==null?void 0:T.docs,source:{originalSource:`{
  name: 'Long list',
  render: () => <LongListPage />
}`,...(w=(f=c.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};var N,L,S;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`{
  name: 'Orders on a phone',
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
  render: () => <OrdersPage />
}`,...(S=(L=d.parameters)==null?void 0:L.docs)==null?void 0:S.source}}};const te=["Orders","PromoCodes","TicketTypes","LongList","OrdersPhone"];export{c as LongList,o as Orders,d as OrdersPhone,n as PromoCodes,l as TicketTypes,te as __namedExportsOrder,re as default};
