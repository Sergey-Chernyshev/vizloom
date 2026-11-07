import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{r as m}from"./index-G8LIXM5I.js";import{S as ae}from"./state-BXFRhFLu.js";import{D as o}from"./delta-BOwf6Ond.js";import{g as te,c as re}from"./hooks-aQKESm79.js";import{L as u}from"./legend-BxY2FnMB.js";import{s as t}from"./palette-D2rnmE_p.js";import{u as oe}from"./provider-BLSBXahb.js";import{L as le,P as y}from"./live-number-BkZ5ByzU.js";import{C as ne}from"./data-table-fallback-Bhe1RDYK.js";import{S as d,a as p}from"./primitives-CzyPZwcc.js";import{C as ie,a as ce,T as de}from"./tooltip-BMOcmBfF.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-CqkleIqs.js";import"./cx-BrTOQ2Ro.js";import"./format-B5KDo3eI.js";const De={title:"Core/Shared UI",parameters:{docs:{description:{component:"Building blocks every chart, table and dashboard block shares."}}}},v=[{id:"floor",label:"Dance floor"},{id:"balcony",label:"Balcony"},{id:"vip",label:"VIP lounge"},{id:"early",label:"Early bird"},{id:"student",label:"Student ticket with a very long name that wraps"}],h={name:"Legend — toggle, solo, focus",render:function(){const s=te(v.map(r=>r.id));return e.jsxs("div",{className:"sb-stack",children:[e.jsx(u,{items:v.map((r,l)=>({id:r.id,label:r.label,color:t(l)})),hidden:s.hidden,focus:s.focus,onToggle:s.toggle,onSolo:s.solo,onFocus:s.setFocus}),e.jsx("p",{className:"sb-note",children:"Click hides, double click (or Alt+Enter) keeps only one, hover highlights. The last visible series never hides."}),e.jsxs("p",{className:"sb-note",children:["Hidden: ",[...s.hidden].join(", ")||"none"," · focus: ",s.focus??"none"]})]})}},b={name:"Legend — shapes, values, layouts",render:()=>e.jsxs("div",{className:"sb-stack",children:[e.jsx(u,{shape:"line",items:v.slice(0,3).map((a,s)=>({id:a.id,label:a.label,color:t(s)}))}),e.jsx(u,{shape:"square",items:v.slice(0,3).map((a,s)=>({id:a.id,label:a.label,color:t(s),value:`${[48,31,21][s]}%`}))}),e.jsx(u,{items:[{id:"this",label:"This year",color:t(0),shape:"line"},{id:"last",label:"Last year",color:"var(--vl-compare-1)",shape:"dashed"}]}),e.jsx("div",{className:"sb-narrow",children:e.jsx(u,{layout:"scroll",items:v.map((a,s)=>({id:a.id,label:a.label,color:t(s)}))})}),e.jsx(u,{loading:!0,items:[]})]})},x={render:()=>e.jsxs("div",{className:"sb-row",children:[Array.from({length:8},(a,s)=>e.jsx(p,{color:t(s)},s)),e.jsx(p,{color:t(0),shape:"line"}),e.jsx(p,{color:t(1),shape:"square"}),e.jsx(p,{color:"var(--vl-compare-1)",shape:"dashed"}),e.jsx(p,{color:t(2),off:!0})]})},g={name:"DeltaBadge — all tones and variants",render:()=>e.jsxs("div",{className:"sb-stack",children:[e.jsxs("div",{className:"sb-row",children:[e.jsx(o,{value:24}),e.jsx(o,{value:-12}),e.jsx(o,{value:.2}),e.jsx(o,{value:Number.NaN}),e.jsx(o,{value:18,invert:!0}),e.jsx(o,{value:-7,invert:!0})]}),e.jsxs("div",{className:"sb-row",children:[e.jsx(o,{value:24,variant:"text"}),e.jsx(o,{value:-12,variant:"text"}),e.jsx(o,{value:3.46,fractionDigits:1,size:"s"}),e.jsx(o,{value:12,suffix:"vs last week"}),e.jsx(o,{value:5,label:"+1,240"})]})]})},f={name:"LiveNumber and Pulse — live updates",render:function(){const s=oe(),[r,l]=m.useState(12840);return m.useEffect(()=>{const i=setInterval(()=>l(c=>c+Math.round(Math.random()*400-120)),1800);return()=>clearInterval(i)},[]),e.jsxs("div",{className:"sb-stack",children:[e.jsx("div",{className:"sb-kpi-demo",children:e.jsx(le,{value:r,pulse:!0,format:i=>s.currency(i,"USD")})}),e.jsxs("div",{className:"sb-row",children:[e.jsx(y,{trigger:r})," ",e.jsx(y,{trigger:r,tone:"positive"})," ",e.jsx(y,{trigger:r,tone:"negative"}),e.jsx("span",{className:"sb-note",children:"Pulses fire on every change; reduced motion turns animations off."})]})]})}},S={render:()=>e.jsxs("div",{className:"sb-grid-3",children:[e.jsx("div",{className:"sb-box",children:e.jsx(d,{shape:"chart"})}),e.jsx("div",{className:"sb-box",children:e.jsx(d,{shape:"bars"})}),e.jsx("div",{className:"sb-box",children:e.jsx(d,{shape:"circle"})}),e.jsxs("div",{className:"sb-box sb-stack",children:[e.jsx(d,{shape:"text",size:"xl"}),e.jsx(d,{shape:"text",size:"l"}),e.jsx(d,{shape:"text",size:"s"})]})]})},ue=[{status:"loading"},{status:"empty",reason:"Sales start on Oct 12 — the chart fills in with the first ticket."},{status:"no-access"},{status:"error",onRetry:()=>{}},{status:"partial",reason:"Data for the last 2 hours is still being collected."}],j={name:"StateView — five block states",render:()=>e.jsx("div",{className:"sb-grid-3",children:ue.map(a=>e.jsx("div",{className:"sb-box sb-box--tall",children:e.jsx(ae,{state:a,skeleton:"chart",children:e.jsx("div",{className:"sb-placeholder",children:"content"})})},a.status))})},N={name:"ChartTooltip — follow, flip, pin, phone dock",render:function(){const[s,r]=re(),[l,i]=m.useState(null),[c,w]=m.useState(!1),ee=m.useRef(null),se=m.useMemo(()=>[{id:"floor",label:"Dance floor",value:"124",color:t(0)},{id:"balcony",label:"Balcony",value:"58",color:t(1)},{id:"vip",label:"VIP lounge",value:"12",color:t(2),note:"$120"}],[]);return e.jsx("div",{className:"sb-stack",children:e.jsxs("div",{ref:n=>{ee.current=n,s(n)},className:"sb-surface",onPointerMove:n=>{if(c)return;const C=n.currentTarget.getBoundingClientRect();i({x:n.clientX-C.left,y:n.clientY-C.top})},onPointerLeave:()=>!c&&i(null),onClick:()=>w(n=>!n),children:[e.jsx(ie,{x:(l==null?void 0:l.x)??null}),e.jsx(ce,{open:!!l,anchor:l,bounds:r,pinned:c,onUnpin:()=>w(!1),children:e.jsx(de,{title:"Oct 7, Tue · 14:00–15:00",rows:se,footer:c?"Pinned":"Click to pin"})}),e.jsx("span",{className:"sb-note sb-center",children:"Move the pointer; click to pin. Narrow the viewport to see the phone dock."})]})})}},k={name:"ChartDataTable — visible variant",render:()=>e.jsx(ne,{visible:!0,caption:"Tickets sold by type",columns:["Type","Tickets","Share"],rows:[["Dance floor",1240,"48%"],["Balcony",801,"31%"],["VIP lounge",312,"12%"]]})};var T,D,L;h.parameters={...h.parameters,docs:{...(T=h.parameters)==null?void 0:T.docs,source:{originalSource:`{
  name: 'Legend — toggle, solo, focus',
  render: function Render() {
    const state = useSeriesState(SERIES.map(s => s.id));
    return <div className="sb-stack">
        <Legend items={SERIES.map((s, i) => ({
        id: s.id,
        label: s.label,
        color: seriesColor(i)
      }))} hidden={state.hidden} focus={state.focus} onToggle={state.toggle} onSolo={state.solo} onFocus={state.setFocus} />
        <p className="sb-note">
          Click hides, double click (or Alt+Enter) keeps only one, hover highlights. The last visible series never hides.
        </p>
        <p className="sb-note">
          Hidden: {[...state.hidden].join(', ') || 'none'} · focus: {state.focus ?? 'none'}
        </p>
      </div>;
  }
}`,...(L=(D=h.parameters)==null?void 0:D.docs)==null?void 0:L.source}}};var P,E,B;b.parameters={...b.parameters,docs:{...(P=b.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'Legend — shapes, values, layouts',
  render: () => <div className="sb-stack">
      <Legend shape="line" items={SERIES.slice(0, 3).map((s, i) => ({
      id: s.id,
      label: s.label,
      color: seriesColor(i)
    }))} />
      <Legend shape="square" items={SERIES.slice(0, 3).map((s, i) => ({
      id: s.id,
      label: s.label,
      color: seriesColor(i),
      value: \`\${[48, 31, 21][i]}%\`
    }))} />
      <Legend items={[{
      id: 'this',
      label: 'This year',
      color: seriesColor(0),
      shape: 'line'
    }, {
      id: 'last',
      label: 'Last year',
      color: 'var(--vl-compare-1)',
      shape: 'dashed'
    }]} />
      <div className="sb-narrow">
        <Legend layout="scroll" items={SERIES.map((s, i) => ({
        id: s.id,
        label: s.label,
        color: seriesColor(i)
      }))} />
      </div>
      <Legend loading items={[]} />
    </div>
}`,...(B=(E=b.parameters)==null?void 0:E.docs)==null?void 0:B.source}}};var R,I,z;x.parameters={...x.parameters,docs:{...(R=x.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <div className="sb-row">
      {Array.from({
      length: 8
    }, (_, i) => <Swatch key={i} color={seriesColor(i)} />)}
      <Swatch color={seriesColor(0)} shape="line" />
      <Swatch color={seriesColor(1)} shape="square" />
      <Swatch color="var(--vl-compare-1)" shape="dashed" />
      <Swatch color={seriesColor(2)} off />
    </div>
}`,...(z=(I=x.parameters)==null?void 0:I.docs)==null?void 0:z.source}}};var V,M,A;g.parameters={...g.parameters,docs:{...(V=g.parameters)==null?void 0:V.docs,source:{originalSource:`{
  name: 'DeltaBadge — all tones and variants',
  render: () => <div className="sb-stack">
      <div className="sb-row">
        <DeltaBadge value={24} />
        <DeltaBadge value={-12} />
        <DeltaBadge value={0.2} />
        <DeltaBadge value={Number.NaN} />
        <DeltaBadge value={18} invert />
        <DeltaBadge value={-7} invert />
      </div>
      <div className="sb-row">
        <DeltaBadge value={24} variant="text" />
        <DeltaBadge value={-12} variant="text" />
        <DeltaBadge value={3.46} fractionDigits={1} size="s" />
        <DeltaBadge value={12} suffix="vs last week" />
        <DeltaBadge value={5} label="+1,240" />
      </div>
    </div>
}`,...(A=(M=g.parameters)==null?void 0:M.docs)==null?void 0:A.source}}};var F,U,q;f.parameters={...f.parameters,docs:{...(F=f.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'LiveNumber and Pulse — live updates',
  render: function Render() {
    const format = useFormat();
    const [value, setValue] = useState(12840);
    useEffect(() => {
      const t = setInterval(() => setValue(v => v + Math.round(Math.random() * 400 - 120)), 1800);
      return () => clearInterval(t);
    }, []);
    return <div className="sb-stack">
        <div className="sb-kpi-demo">
          <LiveNumber value={value} pulse format={v => format.currency(v, 'USD')} />
        </div>
        <div className="sb-row">
          <Pulse trigger={value} /> <Pulse trigger={value} tone="positive" /> <Pulse trigger={value} tone="negative" />
          <span className="sb-note">Pulses fire on every change; reduced motion turns animations off.</span>
        </div>
      </div>;
  }
}`,...(q=(U=f.parameters)==null?void 0:U.docs)==null?void 0:q.source}}};var H,O,_;S.parameters={...S.parameters,docs:{...(H=S.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div className="sb-grid-3">
      <div className="sb-box">
        <Skeleton shape="chart" />
      </div>
      <div className="sb-box">
        <Skeleton shape="bars" />
      </div>
      <div className="sb-box">
        <Skeleton shape="circle" />
      </div>
      <div className="sb-box sb-stack">
        <Skeleton shape="text" size="xl" />
        <Skeleton shape="text" size="l" />
        <Skeleton shape="text" size="s" />
      </div>
    </div>
}`,...(_=(O=S.parameters)==null?void 0:O.docs)==null?void 0:_.source}}};var $,X,Y;j.parameters={...j.parameters,docs:{...($=j.parameters)==null?void 0:$.docs,source:{originalSource:`{
  name: 'StateView — five block states',
  render: () => <div className="sb-grid-3">
      {STATES.map(s => <div key={s.status} className="sb-box sb-box--tall">
          <StateView state={s} skeleton="chart">
            <div className="sb-placeholder">content</div>
          </StateView>
        </div>)}
    </div>
}`,...(Y=(X=j.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var G,J,K;N.parameters={...N.parameters,docs:{...(G=N.parameters)==null?void 0:G.docs,source:{originalSource:`{
  name: 'ChartTooltip — follow, flip, pin, phone dock',
  render: function Render() {
    const [setRef, size] = useElementSize<HTMLDivElement>();
    const [pt, setPt] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const [pinned, setPinned] = useState(false);
    const host = useRef<HTMLDivElement | null>(null);
    const rows = useMemo(() => [{
      id: 'floor',
      label: 'Dance floor',
      value: '124',
      color: seriesColor(0)
    }, {
      id: 'balcony',
      label: 'Balcony',
      value: '58',
      color: seriesColor(1)
    }, {
      id: 'vip',
      label: 'VIP lounge',
      value: '12',
      color: seriesColor(2),
      note: '$120'
    }], []);
    return <div className="sb-stack">
        <div ref={n => {
        host.current = n;
        setRef(n);
      }} className="sb-surface" onPointerMove={e => {
        if (pinned) return;
        const r = e.currentTarget.getBoundingClientRect();
        setPt({
          x: e.clientX - r.left,
          y: e.clientY - r.top
        });
      }} onPointerLeave={() => !pinned && setPt(null)} onClick={() => setPinned(p => !p)}>
          <Crosshair x={pt?.x ?? null} />
          <ChartTooltip open={!!pt} anchor={pt} bounds={size} pinned={pinned} onUnpin={() => setPinned(false)}>
            <TooltipContent title="Oct 7, Tue · 14:00–15:00" rows={rows} footer={pinned ? 'Pinned' : 'Click to pin'} />
          </ChartTooltip>
          <span className="sb-note sb-center">Move the pointer; click to pin. Narrow the viewport to see the phone dock.</span>
        </div>
      </div>;
  }
}`,...(K=(J=N.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,W,Z;k.parameters={...k.parameters,docs:{...(Q=k.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  name: 'ChartDataTable — visible variant',
  render: () => <ChartDataTable visible caption="Tickets sold by type" columns={['Type', 'Tickets', 'Share']} rows={[['Dance floor', 1240, '48%'], ['Balcony', 801, '31%'], ['VIP lounge', 312, '12%']]} />
}`,...(Z=(W=k.parameters)==null?void 0:W.docs)==null?void 0:Z.source}}};const Le=["LegendInteractive","LegendShapes","Swatches","Deltas","LiveNumbers","Skeletons","BlockStates","TooltipAndCrosshair","ScreenReaderTable"];export{j as BlockStates,g as Deltas,h as LegendInteractive,b as LegendShapes,f as LiveNumbers,k as ScreenReaderTable,S as Skeletons,x as Swatches,N as TooltipAndCrosshair,Le as __namedExportsOrder,De as default};
