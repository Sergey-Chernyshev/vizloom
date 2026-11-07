import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{r as p}from"./index-G8LIXM5I.js";import{C as l,e as we,S as Ke,N as ke,m as Ne,P as $e,I as O,d as je,a as Ae,f as Re}from"./demo-data-Cs6fF4T1.js";import{L as R,s as Ie,K as v}from"./live-BwF85EkP.js";import{D as Te,G as Oe}from"./grid-D93VGQ47.js";import{u as Me}from"./provider-BLSBXahb.js";import{A as _e,I as Ge,T as Ee,S as h}from"./feed-kdWXV9_z.js";import{U as A,f as Ue,c as Be}from"./format-B5KDo3eI.js";import{s as De}from"./palette-D2rnmE_p.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-CqkleIqs.js";import"./cx-BrTOQ2Ro.js";import"./hooks-aQKESm79.js";import"./state-BXFRhFLu.js";import"./primitives-CzyPZwcc.js";import"./source-C-kKhT28.js";import"./live-number-BkZ5ByzU.js";import"./delta-BOwf6Ond.js";function m({values:t,color:s="currentColor"}){const r=Math.max(1,...t),n=100/t.length;return e.jsx("svg",{className:"sb-mini-bars",viewBox:"0 0 100 36",preserveAspectRatio:"none","aria-hidden":"true",children:t.map((o,a)=>e.jsx("rect",{x:a*n+n*.15,y:36-o/r*34,width:n*.7,height:o/r*34,rx:1,fill:s,opacity:a===t.length-1?1:.55},a))})}function $({parts:t}){let s=0;return e.jsx("svg",{className:"sb-mini-bars",viewBox:"0 0 100 8",preserveAspectRatio:"none","aria-hidden":"true",children:t.map((r,n)=>{const o=e.jsx("rect",{x:s,y:0,width:Math.max(0,r.share*100-1),height:8,rx:2,fill:r.color},n);return s+=r.share*100,o})})}try{m.displayName="MiniBars",m.__docgenInfo={description:"Tiny SVG visuals for dashboard stories (the real sparkline lives in vizloom/charts).",displayName:"MiniBars",props:{values:{defaultValue:null,description:"",name:"values",required:!0,type:{name:"readonly number[]"}},color:{defaultValue:{value:"currentColor"},description:"",name:"color",required:!1,type:{name:"string | undefined"}}}}}catch{}try{$.displayName="SplitStrip",$.__docgenInfo={description:"",displayName:"SplitStrip",props:{parts:{defaultValue:null,description:"",name:"parts",required:!0,type:{name:"readonly { share: number; color: string; }[]"}}}}}catch{}const it={title:"Dashboard/Blocks"},N=Be("USD"),Pe=e.jsx(Re,{title:"How revenue is calculated",formula:"Turnover − refunds − service fee",lines:[{label:"Turnover",value:"$128,400"},{label:"Refunds",value:"−$3,120"},{label:"Service fee 6%",value:"−$7,517"}],result:{label:"Revenue",value:"$117,763"},note:"Fees are taken when a payout is made.",source:"Orders and refunds, updated every minute."}),i=[{id:"turnover",label:"Turnover",value:128400,unit:N,delta:12,deltaSuffix:"vs last week",sub:"after refunds",info:"All payments for tickets, minus refunds."},{id:"revenue",label:"Revenue",value:117763,unit:N,delta:9,sub:"without service fee",info:Pe},{id:"tickets",label:"Tickets sold",value:2874,unit:A,delta:18,sub:"1,912 orders"},{id:"guests",label:"Guests",value:2611,unit:A,delta:-3,sub:"checked in 0%"},{id:"avg",label:"Average ticket",value:44.7,format:t=>`$${t.toFixed(2)}`,delta:.2},{id:"refunds",label:"Refunds",value:3120,unit:N,delta:27,invert:!0,tone:"negative",sub:"71 tickets"}],b={name:"KPI strip",render:()=>e.jsx(v,{"aria-label":"Key metrics",items:i})},S={name:"KPI grid with sparklines",render:()=>e.jsx(v,{variant:"grid",items:i.slice(0,4).map((t,s)=>({...t,visual:e.jsx(m,{values:je(void 0,14).map((r,n)=>r*(1+(s+n)%3*.1)),color:De(s)})}))})},x={name:"KPI states",render:()=>e.jsx(v,{items:[{...i[0],state:{status:"loading"}},{...i[1],state:{status:"no-access"}},{...i[2],state:{status:"empty",title:"No sales yet",reason:"Starts Oct 12"}},{...i[3],state:{status:"error",onRetry:()=>{}}},{...i[4],state:{status:"partial"}}]})},g={name:"KPI live (count-up, +N bump, pulse)",render:function(){const[s,r]=p.useState(2874),[n,o]=p.useState(ke);return p.useEffect(()=>Ie((a,d)=>{r(c=>c+a),o(d)}),[]),e.jsxs("div",{className:"sb-stack",children:[e.jsx(R,{updatedAt:n}),e.jsx(v,{items:[{...i[0],value:128400+(s-2874)*45},{...i[2],value:s},{...i[4],value:(128400+(s-2874)*45)/s,format:a=>`$${a.toFixed(2)}`}]})]})}},C={name:"KPI strip — phone (scroll-snap)",parameters:{viewport:{defaultViewport:"phone"}},render:()=>e.jsx(v,{items:i})};function u({label:t="chart"}){return e.jsx("div",{className:"sb-box sb-box--tall sb-placeholder",children:t})}const k={name:"Chart card — header, ?, actions, tabs, segments",render:function(){const[s,r]=p.useState("day"),[n,o]=p.useState("tickets");return e.jsx(l,{title:"Sales by day",info:"Tickets sold per day, stacked by ticket type. Drag to pan, pinch or scroll to zoom.",description:"Aug 17 – Oct 9 · all ticket types",status:e.jsx(R,{updatedAt:ke}),actions:e.jsx(Ke,{"aria-label":"Metric",size:"s",value:n,onChange:o,options:[{value:"tickets",label:"Tickets"},{value:"turnover",label:"Turnover"}]}),tabs:e.jsx(we,{"aria-label":"View",value:s,onChange:r,tabs:[{value:"day",label:"By day"},{value:"hour",label:"By hour"},{value:"type",label:"By type"}]}),footer:"Times in UTC",children:e.jsx(u,{label:`${n} · ${s}`})})}},j={name:"Chart card — five states",render:()=>e.jsx(Te,{children:[{status:"loading"},{status:"empty",reason:"No promo codes were used in this period."},{status:"no-access",reason:"Finance data is visible to owners only."},{status:"error",onRetry:()=>{}},{status:"partial",reason:"Last 2 hours are still being collected."}].map((t,s)=>e.jsx(l,{title:`State: ${t.status}`,span:s<3?4:6,state:t,skeleton:s%2?"bars":"chart",bodyHeight:180,children:e.jsx(u,{})},t.status))})},f={name:"Grid — 12 columns, container queries",render:()=>e.jsxs(Te,{children:[e.jsx(Oe,{span:12,children:e.jsx(v,{items:i})}),e.jsx(l,{title:"span 8",span:8,children:e.jsx(u,{})}),e.jsx(l,{title:"span 4",span:4,children:e.jsx(u,{})}),[1,2,3].map(t=>e.jsx(l,{title:`span 4 · ${t}`,span:4,children:e.jsx(u,{})},t)),e.jsx(l,{title:"span 6",span:6,children:e.jsx(u,{})}),e.jsx(l,{title:"span 6",span:6,children:e.jsx(u,{})})]})},I={...f,name:"Grid — phone",parameters:{viewport:{defaultViewport:"phone"}}},T={name:"Info hint — text and calculation card",render:()=>e.jsxs("div",{className:"sb-row",children:[e.jsx("span",{children:"Turnover"}),e.jsx(O,{children:"All payments for tickets, minus refunds. Updated every minute."}),e.jsx("span",{children:"Revenue"}),e.jsx(O,{label:"How revenue is calculated",children:Pe})]})},y={name:"Section tiles",render:()=>{const t=je(void 0,14);return e.jsxs(Ee,{"aria-label":"Sections",children:[e.jsx(h,{label:"Sales",value:2874,unit:A,delta:18,tone:0,onOpen:()=>{},visual:e.jsx(m,{values:t})}),e.jsx(h,{label:"Audience",value:3.8,unit:Ue,delta:-.4,sub:"conversion",tone:4,onOpen:()=>{},visual:e.jsx(m,{values:t.map(s=>s*.7)})}),e.jsx(h,{label:"Money",value:117763,unit:N,delta:9,tone:5,onOpen:()=>{},visual:e.jsx($,{parts:[{share:.5,color:"var(--vl-cat-6)"},{share:.3,color:"var(--vl-cat-2)"},{share:.2,color:"var(--vl-cat-other)"}]})}),e.jsx(h,{label:"Check-in",value:0,empty:!0,emptyText:"Opens on event day",tone:2,visual:e.jsx(m,{values:t})}),e.jsx(h,{label:"Marketing",value:0,loading:!0,tone:3})]})}},P={...y,name:"Section tiles — phone",parameters:{viewport:{defaultViewport:"phone"}}},w={name:"Needs attention",render:()=>e.jsx(Ge,{title:"Needs attention",collapseAfter:3,items:[{id:"1",tone:"warn",title:"Dance floor: 84 left",detail:"At the current pace sells out in ~4 days",visual:e.jsx($,{parts:[{share:.92,color:"var(--vl-warning)"},{share:.08,color:"var(--vl-neutral-soft)"}]})},{id:"2",tone:"risk",title:"86% drop off at payment",detail:"Usual is 40%",action:{label:"Open funnel",onClick:()=>{}}},{id:"3",tone:"risk",title:"Partner link: 0 purchases",detail:"214 visits in 7 days"},{id:"4",tone:"info",title:"VIP ends in ~2 days",detail:"12 of 150 left"},{id:"5",tone:"warn",title:"Sales this week −14%",detail:"vs previous week"}]})},K={name:"Activity feed — live",render:function(){const s=Me(),[r,n]=p.useState(()=>Ne(24));p.useEffect(()=>Ie((a,d)=>{n(c=>[{...c[Math.floor(Math.random()*c.length)],id:`live-${d}`,at:d,qty:a},...c].slice(0,60))}),[]);const o=a=>{var d;return((d=Ae.find(c=>c.id===a))==null?void 0:d.label)??a};return e.jsx(l,{title:"Purchases",status:e.jsx(R,{updatedAt:r[0].at}),variant:"card",children:e.jsx(_e,{"aria-label":"Purchases",maxHeight:360,items:r.map(a=>({id:a.id,at:a.at,title:`${o(a.type)} × ${a.qty}`,sub:`${a.buyer} · ${a.channel}`,amount:`${a.refund?"−":"+"}${s.currency(a.qty*$e[a.type],"USD")}`,tone:a.refund?"negative":"positive"}))})})}};var M,_,G;b.parameters={...b.parameters,docs:{...(M=b.parameters)==null?void 0:M.docs,source:{originalSource:`{
  name: 'KPI strip',
  render: () => <KpiStrip aria-label="Key metrics" items={KPIS} />
}`,...(G=(_=b.parameters)==null?void 0:_.docs)==null?void 0:G.source}}};var E,U,B;S.parameters={...S.parameters,docs:{...(E=S.parameters)==null?void 0:E.docs,source:{originalSource:`{
  name: 'KPI grid with sparklines',
  render: () => <KpiStrip variant="grid" items={KPIS.slice(0, 4).map((k, i) => ({
    ...k,
    visual: <MiniBars values={dailyTotals(undefined, 14).map((v, j) => v * (1 + (i + j) % 3 * 0.1))} color={seriesColor(i)} />
  }))} />
}`,...(B=(U=S.parameters)==null?void 0:U.docs)==null?void 0:B.source}}};var D,H,L;x.parameters={...x.parameters,docs:{...(D=x.parameters)==null?void 0:D.docs,source:{originalSource:`{
  name: 'KPI states',
  render: () => <KpiStrip items={[{
    ...KPIS[0],
    state: {
      status: 'loading'
    }
  }, {
    ...KPIS[1],
    state: {
      status: 'no-access'
    }
  }, {
    ...KPIS[2],
    state: {
      status: 'empty',
      title: 'No sales yet',
      reason: 'Starts Oct 12'
    }
  }, {
    ...KPIS[3],
    state: {
      status: 'error',
      onRetry: () => undefined
    }
  }, {
    ...KPIS[4],
    state: {
      status: 'partial'
    }
  }]} />
}`,...(L=(H=x.parameters)==null?void 0:H.docs)==null?void 0:L.source}}};var V,F,q;g.parameters={...g.parameters,docs:{...(V=g.parameters)==null?void 0:V.docs,source:{originalSource:`{
  name: 'KPI live (count-up, +N bump, pulse)',
  render: function Render() {
    const [tickets, setTickets] = useState(2874);
    const [at, setAt] = useState(NOW);
    useEffect(() => startLiveSimulation((n, t) => {
      setTickets(v => v + n);
      setAt(t);
    }), []);
    return <div className="sb-stack">
        <LiveIndicator updatedAt={at} />
        <KpiStrip items={[{
        ...KPIS[0],
        value: 128400 + (tickets - 2874) * 45
      }, {
        ...KPIS[2],
        value: tickets
      }, {
        ...KPIS[4],
        value: (128400 + (tickets - 2874) * 45) / tickets,
        format: v => \`$\${v.toFixed(2)}\`
      }]} />
      </div>;
  }
}`,...(q=(F=g.parameters)==null?void 0:F.docs)==null?void 0:q.source}}};var z,W,J;C.parameters={...C.parameters,docs:{...(z=C.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'KPI strip — phone (scroll-snap)',
  parameters: {
    viewport: {
      defaultViewport: 'phone'
    }
  },
  render: () => <KpiStrip items={KPIS} />
}`,...(J=(W=C.parameters)==null?void 0:W.docs)==null?void 0:J.source}}};var Q,X,Y;k.parameters={...k.parameters,docs:{...(Q=k.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  name: 'Chart card — header, ?, actions, tabs, segments',
  render: function Render() {
    const [mode, setMode] = useState<'day' | 'hour' | 'type'>('day');
    const [metric, setMetric] = useState<'tickets' | 'turnover'>('tickets');
    return <ChartCard title="Sales by day" info="Tickets sold per day, stacked by ticket type. Drag to pan, pinch or scroll to zoom." description="Aug 17 – Oct 9 · all ticket types" status={<LiveIndicator updatedAt={NOW} />} actions={<Segmented aria-label="Metric" size="s" value={metric} onChange={setMetric} options={[{
      value: 'tickets',
      label: 'Tickets'
    }, {
      value: 'turnover',
      label: 'Turnover'
    }]} />} tabs={<Tabs aria-label="View" value={mode} onChange={setMode} tabs={[{
      value: 'day',
      label: 'By day'
    }, {
      value: 'hour',
      label: 'By hour'
    }, {
      value: 'type',
      label: 'By type'
    }]} />} footer="Times in UTC">
        <Placeholder label={\`\${metric} · \${mode}\`} />
      </ChartCard>;
  }
}`,...(Y=(X=k.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,te;j.parameters={...j.parameters,docs:{...(Z=j.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  name: 'Chart card — five states',
  render: () => <DashboardGrid>
      {([{
      status: 'loading'
    }, {
      status: 'empty',
      reason: 'No promo codes were used in this period.'
    }, {
      status: 'no-access',
      reason: 'Finance data is visible to owners only.'
    }, {
      status: 'error',
      onRetry: () => undefined
    }, {
      status: 'partial',
      reason: 'Last 2 hours are still being collected.'
    }] as const).map((state, i) => <ChartCard key={state.status} title={\`State: \${state.status}\`} span={i < 3 ? 4 : 6} state={state} skeleton={i % 2 ? 'bars' : 'chart'} bodyHeight={180}>
          <Placeholder />
        </ChartCard>)}
    </DashboardGrid>
}`,...(te=(ee=j.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};var ae,se,re;f.parameters={...f.parameters,docs:{...(ae=f.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  name: 'Grid — 12 columns, container queries',
  render: () => <DashboardGrid>
      <GridItem span={12}>
        <KpiStrip items={KPIS} />
      </GridItem>
      <ChartCard title="span 8" span={8}>
        <Placeholder />
      </ChartCard>
      <ChartCard title="span 4" span={4}>
        <Placeholder />
      </ChartCard>
      {[1, 2, 3].map(i => <ChartCard key={i} title={\`span 4 · \${i}\`} span={4}>
          <Placeholder />
        </ChartCard>)}
      <ChartCard title="span 6" span={6}>
        <Placeholder />
      </ChartCard>
      <ChartCard title="span 6" span={6}>
        <Placeholder />
      </ChartCard>
    </DashboardGrid>
}`,...(re=(se=f.parameters)==null?void 0:se.docs)==null?void 0:re.source}}};var ne,ie,oe;I.parameters={...I.parameters,docs:{...(ne=I.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  ...Grid,
  name: 'Grid — phone',
  parameters: {
    viewport: {
      defaultViewport: 'phone'
    }
  }
}`,...(oe=(ie=I.parameters)==null?void 0:ie.docs)==null?void 0:oe.source}}};var le,de,ce;T.parameters={...T.parameters,docs:{...(le=T.parameters)==null?void 0:le.docs,source:{originalSource:`{
  name: 'Info hint — text and calculation card',
  render: () => <div className="sb-row">
      <span>Turnover</span>
      <InfoHint>All payments for tickets, minus refunds. Updated every minute.</InfoHint>
      <span>Revenue</span>
      <InfoHint label="How revenue is calculated">{revenueCalc}</InfoHint>
    </div>
}`,...(ce=(de=T.parameters)==null?void 0:de.docs)==null?void 0:ce.source}}};var ue,pe,me;y.parameters={...y.parameters,docs:{...(ue=y.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  name: 'Section tiles',
  render: () => {
    const days = dailyTotals(undefined, 14);
    return <TileRow aria-label="Sections">
        <StatTile label="Sales" value={2874} unit={UNIT_COUNT} delta={18} tone={0} onOpen={() => undefined} visual={<MiniBars values={days} />} />
        <StatTile label="Audience" value={3.8} unit={UNIT_PERCENT} delta={-0.4} sub="conversion" tone={4} onOpen={() => undefined} visual={<MiniBars values={days.map(v => v * 0.7)} />} />
        <StatTile label="Money" value={117763} unit={USD} delta={9} tone={5} onOpen={() => undefined} visual={<SplitStrip parts={[{
        share: 0.5,
        color: 'var(--vl-cat-6)'
      }, {
        share: 0.3,
        color: 'var(--vl-cat-2)'
      }, {
        share: 0.2,
        color: 'var(--vl-cat-other)'
      }]} />} />
        <StatTile label="Check-in" value={0} empty emptyText="Opens on event day" tone={2} visual={<MiniBars values={days} />} />
        <StatTile label="Marketing" value={0} loading tone={3} />
      </TileRow>;
  }
}`,...(me=(pe=y.parameters)==null?void 0:pe.docs)==null?void 0:me.source}}};var ve,he,fe;P.parameters={...P.parameters,docs:{...(ve=P.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  ...Tiles,
  name: 'Section tiles — phone',
  parameters: {
    viewport: {
      defaultViewport: 'phone'
    }
  }
}`,...(fe=(he=P.parameters)==null?void 0:he.docs)==null?void 0:fe.source}}};var ye,be,Se;w.parameters={...w.parameters,docs:{...(ye=w.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  name: 'Needs attention',
  render: () => <InsightList title="Needs attention" collapseAfter={3} items={[{
    id: '1',
    tone: 'warn',
    title: 'Dance floor: 84 left',
    detail: 'At the current pace sells out in ~4 days',
    visual: <SplitStrip parts={[{
      share: 0.92,
      color: 'var(--vl-warning)'
    }, {
      share: 0.08,
      color: 'var(--vl-neutral-soft)'
    }]} />
  }, {
    id: '2',
    tone: 'risk',
    title: '86% drop off at payment',
    detail: 'Usual is 40%',
    action: {
      label: 'Open funnel',
      onClick: () => undefined
    }
  }, {
    id: '3',
    tone: 'risk',
    title: 'Partner link: 0 purchases',
    detail: '214 visits in 7 days'
  }, {
    id: '4',
    tone: 'info',
    title: 'VIP ends in ~2 days',
    detail: '12 of 150 left'
  }, {
    id: '5',
    tone: 'warn',
    title: 'Sales this week −14%',
    detail: 'vs previous week'
  }]} />
}`,...(Se=(be=w.parameters)==null?void 0:be.docs)==null?void 0:Se.source}}};var xe,ge,Ce;K.parameters={...K.parameters,docs:{...(xe=K.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  name: 'Activity feed — live',
  render: function Render() {
    const format = useFormat();
    const [orders, setOrders] = useState(() => makeOrders(24));
    useEffect(() => startLiveSimulation((n, at) => {
      setOrders(o => [{
        ...o[Math.floor(Math.random() * o.length)],
        id: \`live-\${at}\`,
        at,
        qty: n
      }, ...o].slice(0, 60));
    }), []);
    const label = (t: string) => TICKET_SERIES.find(s => s.id === t)?.label ?? t;
    return <ChartCard title="Purchases" status={<LiveIndicator updatedAt={orders[0].at} />} variant="card">
        <ActivityFeed aria-label="Purchases" maxHeight={360} items={orders.map(o => ({
        id: o.id,
        at: o.at,
        title: \`\${label(o.type)} × \${o.qty}\`,
        sub: \`\${o.buyer} · \${o.channel}\`,
        amount: \`\${o.refund ? '−' : '+'}\${format.currency(o.qty * PRICES[o.type], 'USD')}\`,
        tone: o.refund ? 'negative' : 'positive'
      }))} />
      </ChartCard>;
  }
}`,...(Ce=(ge=K.parameters)==null?void 0:ge.docs)==null?void 0:Ce.source}}};const ot=["KpiStripStory","KpiGrid","KpiStates","KpiLive","KpiPhone","Card","CardStates","Grid","GridPhone","Hints","Tiles","TilesPhone","Insights","Feed"];export{k as Card,j as CardStates,K as Feed,f as Grid,I as GridPhone,T as Hints,w as Insights,S as KpiGrid,g as KpiLive,C as KpiPhone,x as KpiStates,b as KpiStripStory,y as Tiles,P as TilesPhone,ot as __namedExportsOrder,it as default};
