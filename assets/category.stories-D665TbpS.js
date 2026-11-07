import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{r as d}from"./index-G8LIXM5I.js";import{C as L,S as Me,d as I}from"./demo-data-Cs6fF4T1.js";import{B as V,a as l,G as P,S as U}from"./gauge-1OvoBuVV.js";import{S as i}from"./sparkline-fcQ60k-9.js";import{D as De}from"./grid-D93VGQ47.js";import{c as Ge,U as ze}from"./format-B5KDo3eI.js";import{s as R}from"./palette-D2rnmE_p.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-CqkleIqs.js";import"./cx-BrTOQ2Ro.js";import"./hooks-aQKESm79.js";import"./provider-BLSBXahb.js";import"./state-BXFRhFLu.js";import"./primitives-CzyPZwcc.js";import"./source-C-kKhT28.js";import"./scale-CSJBkx9O.js";import"./tooltip-BMOcmBfF.js";import"./legend-BxY2FnMB.js";import"./data-table-fallback-Bhe1RDYK.js";const na={title:"Charts/Category"},n=[{key:"floor",label:"Dance floor"},{key:"balcony",label:"Balcony"},{key:"vip",label:"VIP lounge"},{key:"early",label:"Early bird"},{key:"student",label:"Student ticket (ID required at the entrance)"}],u=[{id:"w1",label:"Week 1"},{id:"w2",label:"Week 2"},{id:"w3",label:"Week 3"}],r={w1:[420,210,48,380,60],w2:[510,260,61,0,82],w3:[640,330,30,0,95]},p={render:()=>{const a=I(void 0,30);return e.jsxs("div",{className:"sb-grid-3",children:[e.jsxs("div",{className:"sb-box sb-stack",children:["line ",e.jsx(i,{values:a})]}),e.jsxs("div",{className:"sb-box sb-stack",children:["area + peak ",e.jsx(i,{values:a,kind:"area",showPeak:!0,color:R(2),height:48})]}),e.jsxs("div",{className:"sb-box sb-stack",children:["bars ",e.jsx(i,{values:a.slice(-14),kind:"bars",color:R(1)})]}),e.jsxs("div",{className:"sb-box sb-stack",children:["baseline (average) ",e.jsx(i,{values:a,baseline:a.reduce((s,t)=>s+t,0)/a.length})]}),e.jsxs("div",{className:"sb-box sb-stack",children:["gaps ",e.jsx(i,{values:a.map((s,t)=>t%7===3?Number.NaN:s)})]}),e.jsxs("div",{className:"sb-box sb-stack",children:["ghost (empty) ",e.jsx(i,{values:a,ghost:!0,kind:"bars"})]}),e.jsxs("div",{className:"sb-box sb-stack",children:["fixed 80×20 inline"," ",e.jsxs("span",{children:["Trend ",e.jsx(i,{values:a,width:80,height:20})]})]})]})}},b={name:"Sparkline — selectable bars",render:function(){const s=I(void 0,14),[t,o]=d.useState(13);return e.jsxs("div",{className:"sb-box sb-stack",children:[e.jsx(i,{values:s,kind:"bars",height:56,activeIndex:t,onSelect:o}),e.jsxs("span",{className:"sb-note",children:["Selected day: ",t===null?"—":`${t+1} · ${s[t]} tickets`]})]})}},v={name:"Bars — vertical, single series, value labels",render:()=>e.jsx(l,{title:"Tickets by type",data:n.map((a,s)=>({key:a.key,label:a.label,value:r.w3[s]+r.w2[s]})),valueLabels:!0,unit:ze,colorByCategory:!0})},m={name:"Bars — grouped",render:()=>e.jsx(l,{title:"Tickets by type and week",categories:n,series:u,values:r})},h={name:"Bars — stacked with totals",render:()=>e.jsx(l,{title:"Tickets by type and week",categories:n,series:u,values:r,mode:"stack",valueLabels:!0})},k={name:"Bars — percent of total",render:()=>e.jsx(l,{title:"Share by week",categories:n,series:u,values:r,mode:"percent"})},g={name:"Bars — horizontal, sorted, long labels",render:()=>e.jsx(l,{title:"Revenue by type",orientation:"horizontal",sort:"desc",valueLabels:!0,unit:Ge("USD"),data:n.map((a,s)=>({key:a.key,label:a.label,value:(r.w1[s]+r.w2[s]+r.w3[s])*[45,35,120,29,20][s]}))})},S={name:"Bars — horizontal stacked, legend bottom",render:()=>e.jsx(l,{title:"Tickets by type and week",orientation:"horizontal",categories:n,series:u,values:r,mode:"stack",legend:"bottom"})},y={name:"Bars — negative values (net change)",render:()=>e.jsx(l,{title:"Net change by day",data:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((a,s)=>({key:a,label:a,value:[120,-40,60,-15,210,340,-80][s]})),valueLabels:!0})},x={name:"Bars — highlight one category",render:()=>e.jsx(l,{title:"Tickets by type",categories:n,series:u,values:r,highlight:"vip"})},B={name:"Bars — 60 categories (labels thin out)",render:()=>e.jsx(l,{title:"Tickets per day",data:I(void 0,60).map((a,s)=>({key:`d${s}`,label:`Day ${s+1}`,value:a}))})},f={name:"Bars — live data morphs",render:function(){const[s,t]=d.useState(r);return d.useEffect(()=>{const o=setInterval(()=>t(c=>({...c,w3:c.w3.map(Ae=>Math.max(0,Ae+Math.round(Math.random()*60-20)))})),1500);return()=>clearInterval(o)},[]),e.jsx(l,{title:"Tickets by type and week",categories:n,series:u,values:s,mode:"stack",valueLabels:!0})}},j={name:"Bars — states",render:()=>e.jsx(De,{children:["loading","empty","error","no-access"].map(a=>e.jsx(L,{title:a,span:6,children:e.jsx(l,{title:a,data:[],state:{status:a},height:180})},a))})},C={...m,name:"Bars — phone",parameters:{viewport:{defaultViewport:"phone"}}},$e=[{key:"friends10",label:"FRIENDS10",value:4280,sub:"142 of 200 · −10%"},{key:"summer",label:"SUMMERNIGHTS",value:2910,sub:"97 of ∞ · −15%"},{key:"press",label:"PRESS",value:0,sub:"0 of 20 · free",tone:"negative"},{key:"staff",label:"STAFF-2026",value:640,sub:"32 of 50 · −50%"},{key:"radio",label:"RADIO-WAVE",value:1820,sub:"61 of 100 · −20%"},{key:"student",label:"STUDENT",value:1210,sub:"81 of ∞ · −25%"},{key:"late",label:"LATEBIRD",value:380,sub:"11 of 30 · −5%"}],E={name:"Bar list — promo codes, selectable, collapsible",render:function(){const[s,t]=d.useState(null),[o,c]=d.useState("max");return e.jsx(L,{title:"Promo codes",actions:e.jsx(Me,{"aria-label":"Scale",size:"s",value:o,onChange:c,options:[{value:"max",label:"vs top"},{value:"sum",label:"share"}]}),children:e.jsx(V,{title:"Promo codes",items:$e,unit:Ge("USD"),limit:5,selected:s,onSelect:t,scale:o,showShare:o==="sum"})})}},N={name:"Bar list — loading and empty",render:()=>e.jsxs(De,{children:[e.jsx(L,{title:"Loading",span:6,children:e.jsx(V,{title:"Links",items:[],state:{status:"loading"}})}),e.jsx(L,{title:"Empty",span:6,children:e.jsx(V,{title:"Links",items:[],state:{status:"empty",reason:"Create a tracking link to see where buyers come from."}})})]})},w={name:"Split bar — full and mini",render:()=>e.jsxs("div",{className:"sb-stack",children:[e.jsx(U,{title:"Payouts",formatValue:a=>`$${a.toLocaleString("en-US")}`,parts:[{key:"paid",label:"Paid out",value:58800},{key:"pending",label:"Pending",value:41200},{key:"refund",label:"Refunded",value:3120,color:"var(--vl-negative)"},{key:"fee",label:"Fees",value:7517,tone:"muted"}]}),e.jsx(U,{title:"Check-in",parts:[{key:"in",label:"Came",value:1984,color:"var(--vl-positive)"},{key:"no",label:"Not yet",value:627,tone:"muted"}],height:20}),e.jsx("div",{className:"sb-narrow",children:e.jsx(U,{mini:!0,title:"Ticket types",parts:[{key:"a",label:"Floor",value:48},{key:"b",label:"Balcony",value:31},{key:"c",label:"VIP",value:12},{key:"d",label:"Other",value:9,tone:"muted"}]})})]})},T={name:"Gauge — sell-out, target, bands, arc",render:function(){const[s,t]=d.useState(1840);return d.useEffect(()=>{const o=setInterval(()=>t(c=>c>=2400?1200:c+60),1200);return()=>clearInterval(o)},[]),e.jsxs("div",{className:"sb-grid-3",children:[e.jsx("div",{className:"sb-box",children:e.jsx(P,{title:"Sold",value:s,max:2500,target:2100,targetLabel:"Usual by now: 2,100"})}),e.jsx("div",{className:"sb-box",children:e.jsx(P,{title:"Hall load",value:s,max:2500,thresholds:[{to:1500,tone:"positive"},{to:2200,tone:"warning"},{to:2500,tone:"negative"}],sublabel:"people inside"})}),e.jsx("div",{className:"sb-box",children:e.jsx(P,{title:"Check-in",value:s*.3,max:2500,shape:"arc",label:`${Math.round(s*.3)}`,sublabel:"checked in"})})]})}};var D,G,A;p.parameters={...p.parameters,docs:{...(D=p.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => {
    const v = dailyTotals(undefined, 30);
    return <div className="sb-grid-3">
        <div className="sb-box sb-stack">
          line <Sparkline values={v} />
        </div>
        <div className="sb-box sb-stack">
          area + peak <Sparkline values={v} kind="area" showPeak color={seriesColor(2)} height={48} />
        </div>
        <div className="sb-box sb-stack">
          bars <Sparkline values={v.slice(-14)} kind="bars" color={seriesColor(1)} />
        </div>
        <div className="sb-box sb-stack">
          baseline (average) <Sparkline values={v} baseline={v.reduce((a, b) => a + b, 0) / v.length} />
        </div>
        <div className="sb-box sb-stack">
          gaps <Sparkline values={v.map((x, i) => i % 7 === 3 ? Number.NaN : x)} />
        </div>
        <div className="sb-box sb-stack">
          ghost (empty) <Sparkline values={v} ghost kind="bars" />
        </div>
        <div className="sb-box sb-stack">
          fixed 80×20 inline{' '}
          <span>
            Trend <Sparkline values={v} width={80} height={20} />
          </span>
        </div>
      </div>;
  }
}`,...(A=(G=p.parameters)==null?void 0:G.docs)==null?void 0:A.source}}};var M,z,$;b.parameters={...b.parameters,docs:{...(M=b.parameters)==null?void 0:M.docs,source:{originalSource:`{
  name: 'Sparkline — selectable bars',
  render: function Render() {
    const v = dailyTotals(undefined, 14);
    const [i, setI] = useState<number | null>(13);
    return <div className="sb-box sb-stack">
        <Sparkline values={v} kind="bars" height={56} activeIndex={i} onSelect={setI} />
        <span className="sb-note">Selected day: {i === null ? '—' : \`\${i + 1} · \${v[i]} tickets\`}</span>
      </div>;
  }
}`,...($=(z=b.parameters)==null?void 0:z.docs)==null?void 0:$.source}}};var W,O,F;v.parameters={...v.parameters,docs:{...(W=v.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'Bars — vertical, single series, value labels',
  render: () => <BarChart title="Tickets by type" data={TYPES.map((t, i) => ({
    key: t.key,
    label: t.label,
    value: VALUES.w3[i] + VALUES.w2[i]
  }))} valueLabels unit={UNIT_COUNT} colorByCategory />
}`,...(F=(O=v.parameters)==null?void 0:O.docs)==null?void 0:F.source}}};var H,Y,K;m.parameters={...m.parameters,docs:{...(H=m.parameters)==null?void 0:H.docs,source:{originalSource:`{
  name: 'Bars — grouped',
  render: () => <BarChart title="Tickets by type and week" categories={TYPES} series={WEEKS} values={VALUES} />
}`,...(K=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:K.source}}};var _,q,J;h.parameters={...h.parameters,docs:{...(_=h.parameters)==null?void 0:_.docs,source:{originalSource:`{
  name: 'Bars — stacked with totals',
  render: () => <BarChart title="Tickets by type and week" categories={TYPES} series={WEEKS} values={VALUES} mode="stack" valueLabels />
}`,...(J=(q=h.parameters)==null?void 0:q.docs)==null?void 0:J.source}}};var Q,X,Z;k.parameters={...k.parameters,docs:{...(Q=k.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  name: 'Bars — percent of total',
  render: () => <BarChart title="Share by week" categories={TYPES} series={WEEKS} values={VALUES} mode="percent" />
}`,...(Z=(X=k.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var ee,ae,se;g.parameters={...g.parameters,docs:{...(ee=g.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  name: 'Bars — horizontal, sorted, long labels',
  render: () => <BarChart title="Revenue by type" orientation="horizontal" sort="desc" valueLabels unit={currencyUnit('USD')} data={TYPES.map((t, i) => ({
    key: t.key,
    label: t.label,
    value: (VALUES.w1[i] + VALUES.w2[i] + VALUES.w3[i]) * [45, 35, 120, 29, 20][i]
  }))} />
}`,...(se=(ae=g.parameters)==null?void 0:ae.docs)==null?void 0:se.source}}};var te,re,le;S.parameters={...S.parameters,docs:{...(te=S.parameters)==null?void 0:te.docs,source:{originalSource:`{
  name: 'Bars — horizontal stacked, legend bottom',
  render: () => <BarChart title="Tickets by type and week" orientation="horizontal" categories={TYPES} series={WEEKS} values={VALUES} mode="stack" legend="bottom" />
}`,...(le=(re=S.parameters)==null?void 0:re.docs)==null?void 0:le.source}}};var oe,ie,ne;y.parameters={...y.parameters,docs:{...(oe=y.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  name: 'Bars — negative values (net change)',
  render: () => <BarChart title="Net change by day" data={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({
    key: d,
    label: d,
    value: [120, -40, 60, -15, 210, 340, -80][i]
  }))} valueLabels />
}`,...(ne=(ie=y.parameters)==null?void 0:ie.docs)==null?void 0:ne.source}}};var ce,de,ue;x.parameters={...x.parameters,docs:{...(ce=x.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  name: 'Bars — highlight one category',
  render: () => <BarChart title="Tickets by type" categories={TYPES} series={WEEKS} values={VALUES} highlight="vip" />
}`,...(ue=(de=x.parameters)==null?void 0:de.docs)==null?void 0:ue.source}}};var me,pe,be;B.parameters={...B.parameters,docs:{...(me=B.parameters)==null?void 0:me.docs,source:{originalSource:`{
  name: 'Bars — 60 categories (labels thin out)',
  render: () => <BarChart title="Tickets per day" data={dailyTotals(undefined, 60).map((v, i) => ({
    key: \`d\${i}\`,
    label: \`Day \${i + 1}\`,
    value: v
  }))} />
}`,...(be=(pe=B.parameters)==null?void 0:pe.docs)==null?void 0:be.source}}};var ve,he,ke;f.parameters={...f.parameters,docs:{...(ve=f.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  name: 'Bars — live data morphs',
  render: function Render() {
    const [vals, setVals] = useState(VALUES);
    useEffect(() => {
      const t = setInterval(() => setVals(v => ({
        ...v,
        w3: v.w3.map(x => Math.max(0, x + Math.round(Math.random() * 60 - 20)))
      })), 1500);
      return () => clearInterval(t);
    }, []);
    return <BarChart title="Tickets by type and week" categories={TYPES} series={WEEKS} values={vals} mode="stack" valueLabels />;
  }
}`,...(ke=(he=f.parameters)==null?void 0:he.docs)==null?void 0:ke.source}}};var ge,Se,ye;j.parameters={...j.parameters,docs:{...(ge=j.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  name: 'Bars — states',
  render: () => <DashboardGrid>
      {(['loading', 'empty', 'error', 'no-access'] as const).map(s => <ChartCard key={s} title={s} span={6}>
          <BarChart title={s} data={[]} state={{
        status: s
      }} height={180} />
        </ChartCard>)}
    </DashboardGrid>
}`,...(ye=(Se=j.parameters)==null?void 0:Se.docs)==null?void 0:ye.source}}};var xe,Be,fe;C.parameters={...C.parameters,docs:{...(xe=C.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  ...Grouped,
  name: 'Bars — phone',
  parameters: {
    viewport: {
      defaultViewport: 'phone'
    }
  }
}`,...(fe=(Be=C.parameters)==null?void 0:Be.docs)==null?void 0:fe.source}}};var je,Ce,Ee;E.parameters={...E.parameters,docs:{...(je=E.parameters)==null?void 0:je.docs,source:{originalSource:`{
  name: 'Bar list — promo codes, selectable, collapsible',
  render: function Render() {
    const [sel, setSel] = useState<string | null>(null);
    const [scale, setScale] = useState<'max' | 'sum'>('max');
    return <ChartCard title="Promo codes" actions={<Segmented aria-label="Scale" size="s" value={scale} onChange={setScale} options={[{
      value: 'max',
      label: 'vs top'
    }, {
      value: 'sum',
      label: 'share'
    }]} />}>
        <BarList title="Promo codes" items={PROMOS} unit={currencyUnit('USD')} limit={5} selected={sel} onSelect={setSel} scale={scale} showShare={scale === 'sum'} />
      </ChartCard>;
  }
}`,...(Ee=(Ce=E.parameters)==null?void 0:Ce.docs)==null?void 0:Ee.source}}};var Ne,we,Te;N.parameters={...N.parameters,docs:{...(Ne=N.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  name: 'Bar list — loading and empty',
  render: () => <DashboardGrid>
      <ChartCard title="Loading" span={6}>
        <BarList title="Links" items={[]} state={{
        status: 'loading'
      }} />
      </ChartCard>
      <ChartCard title="Empty" span={6}>
        <BarList title="Links" items={[]} state={{
        status: 'empty',
        reason: 'Create a tracking link to see where buyers come from.'
      }} />
      </ChartCard>
    </DashboardGrid>
}`,...(Te=(we=N.parameters)==null?void 0:we.docs)==null?void 0:Te.source}}};var Le,Pe,Ue;w.parameters={...w.parameters,docs:{...(Le=w.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  name: 'Split bar — full and mini',
  render: () => <div className="sb-stack">
      <SplitBar title="Payouts" formatValue={v => \`$\${v.toLocaleString('en-US')}\`} parts={[{
      key: 'paid',
      label: 'Paid out',
      value: 58800
    }, {
      key: 'pending',
      label: 'Pending',
      value: 41200
    }, {
      key: 'refund',
      label: 'Refunded',
      value: 3120,
      color: 'var(--vl-negative)'
    }, {
      key: 'fee',
      label: 'Fees',
      value: 7517,
      tone: 'muted'
    }]} />
      <SplitBar title="Check-in" parts={[{
      key: 'in',
      label: 'Came',
      value: 1984,
      color: 'var(--vl-positive)'
    }, {
      key: 'no',
      label: 'Not yet',
      value: 627,
      tone: 'muted'
    }]} height={20} />
      <div className="sb-narrow">
        <SplitBar mini title="Ticket types" parts={[{
        key: 'a',
        label: 'Floor',
        value: 48
      }, {
        key: 'b',
        label: 'Balcony',
        value: 31
      }, {
        key: 'c',
        label: 'VIP',
        value: 12
      }, {
        key: 'd',
        label: 'Other',
        value: 9,
        tone: 'muted'
      }]} />
      </div>
    </div>
}`,...(Ue=(Pe=w.parameters)==null?void 0:Pe.docs)==null?void 0:Ue.source}}};var Ve,Ie,Re;T.parameters={...T.parameters,docs:{...(Ve=T.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  name: 'Gauge — sell-out, target, bands, arc',
  render: function Render() {
    const [v, setV] = useState(1840);
    useEffect(() => {
      const t = setInterval(() => setV(x => x >= 2400 ? 1200 : x + 60), 1200);
      return () => clearInterval(t);
    }, []);
    return <div className="sb-grid-3">
        <div className="sb-box">
          <Gauge title="Sold" value={v} max={2500} target={2100} targetLabel="Usual by now: 2,100" />
        </div>
        <div className="sb-box">
          <Gauge title="Hall load" value={v} max={2500} thresholds={[{
          to: 1500,
          tone: 'positive'
        }, {
          to: 2200,
          tone: 'warning'
        }, {
          to: 2500,
          tone: 'negative'
        }]} sublabel="people inside" />
        </div>
        <div className="sb-box">
          <Gauge title="Check-in" value={v * 0.3} max={2500} shape="arc" label={\`\${Math.round(v * 0.3)}\`} sublabel="checked in" />
        </div>
      </div>;
  }
}`,...(Re=(Ie=T.parameters)==null?void 0:Ie.docs)==null?void 0:Re.source}}};const ca=["Sparklines","SparklineSelectable","VerticalSingle","Grouped","Stacked","Percent","Horizontal","HorizontalStacked","Negative","Highlight","ManyCategories","Live","BarStates","BarPhone","BarLists","BarListStates","SplitBars","Gauges"];export{N as BarListStates,E as BarLists,C as BarPhone,j as BarStates,T as Gauges,m as Grouped,x as Highlight,g as Horizontal,S as HorizontalStacked,f as Live,B as ManyCategories,y as Negative,k as Percent,b as SparklineSelectable,p as Sparklines,w as SplitBars,h as Stacked,v as VerticalSingle,ca as __namedExportsOrder,na as default};
