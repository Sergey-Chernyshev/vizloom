import{j as s}from"./jsx-runtime-Cf8x2fCZ.js";import{r as C}from"./index-G8LIXM5I.js";import{u as ds}from"./hooks-Bwsyy9Sg.js";import{V as ue,b as ms,f as N,c as ps,i as Za,m as Ja}from"./common-B6gEIsho.js";import{S as fs}from"./state-BXFRhFLu.js";import{c as hs}from"./cx-BrTOQ2Ro.js";import{S as ke,V as vs}from"./primitives-CzyPZwcc.js";import{u as gs}from"./provider-BLSBXahb.js";import{k as $e,c as xs,D as Ce}from"./hooks-aQKESm79.js";import{T as _s,a as ws}from"./tooltip-BMOcmBfF.js";import{C as bs}from"./data-table-fallback-Bhe1RDYK.js";import{U as ys}from"./format-B5KDo3eI.js";import{s as Ns}from"./palette-D2rnmE_p.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-CqkleIqs.js";function Ss(e,a={}){const t=a.zeroIsGap??!0,o=e.map((f,p)=>!Number.isFinite(f.value)||f.value<0?!1:f.value===0&&t&&p>0?!e.slice(p+1).some(w=>w.value>0):!0),r=o.indexOf(!0),l=r>=0?e[r].value:Number.NaN;let u=-1,d=-1,c=0,i=0;const x=e.map((f,p)=>{const w=o[p],j=u,m=j>=0?e[j].value:Number.NaN;let _=Number.NaN,k=Number.NaN,y=!1;if(w&&j>=0)if(f.value>m)y=!0;else{k=m-f.value,_=m>0?f.value/m:Number.NaN;const T=m>0?k/m:0;T>c&&(c=T,d=p)}return w&&(u=p,f.value>i&&(i=f.value)),{...f,index:p,known:w,fromStart:w&&l>0?f.value/l:Number.NaN,fromPrevious:_,lost:k,skipped:y,previous:j}}),h=u;return{rows:x,start:r,end:h,total:r>=0&&h>r&&l>0?e[h].value/l:Number.NaN,worstDrop:d,max:i}}const js={reached:"Reached",fromStart:"of start",fromPrevious:"of previous step",lost:"Lost",untracked:"No data",skipped:"More than the previous step",summary:e=>`reached “${e}”`,summaryOf:(e,a)=>`${e} of ${a}`,worst:(e,a)=>`Biggest drop before “${e}”: −${a}`,step:"Step"},Le=[0,4,2,5,1,3],ks=280,$s=72,Cs=[100,62,38,22],Ls=(e,a)=>Ns(e??Le[a%Le.length]),Ms=(e,a,t=6.6)=>e.length*t<=a?e:`${e.slice(0,Math.max(1,Math.floor(a/t)-1))}…`;function fe(e,a){for(let t=a+1;t<e.length;t++)if(e[t].known)return t;return-1}function ce(e){const{steps:a,statsOptions:t,state:o,className:r,variant:l="funnel"}=e,u=C.useMemo(()=>Ss(a,t),[a,t]);let d=o??{status:"ready"};d.status==="ready"&&(u.start<0||u.max<=0)&&(d={status:"empty"});const c=l==="columns"||l==="flow"?s.jsx(ke,{shape:"bars"}):s.jsx("div",{className:"vl-funnel__skeleton",children:Cs.map(i=>s.jsx(ue,{vars:{"--vl-w":`${i}%`},className:"vl-funnel__skeleton-bar",children:s.jsx(ke,{shape:"rect"})},i))});return s.jsx("div",{className:hs("vl-funnel",`vl-funnel--${l}`,r),"data-testid":e["data-testid"],children:s.jsx(fs,{state:d,skeleton:c,children:s.jsx(Ds,{...e,stats:u})})})}function Ds({stats:e,title:a,description:t,variant:o="funnel",unit:r=ys,formatValue:l,animate:u=!0,tooltip:d=!0,height:c,summary:i=!0,labels:x,onHover:h,onSelect:f}){const p=gs(),w=ds(),j=ms(),m={...js,...x},{rows:_}=e,k=n=>l?l(n):p.value(n,r,!0),y=n=>l?l(n):Math.abs(n)>=1e6?p.value(n,r):p.number(Math.round(n)),T=$e(_.map(n=>n.known?n.value:0),{duration:Ce.data}),ss=$e([e.max],{duration:Ce.data,initial:[e.max]}),ns=u?T:_.map(n=>n.known?n.value:0),ts=(u?ss[0]:e.max)||1,ge=_.map((n,v)=>Ls(n.slot,v)),[V,xe]=C.useState(null),[_e,we]=C.useState(null),[rs,P,M]=xs(),F=V===null?null:_[V],be=C.useRef(null);F&&(be.current=F);function ye(n,v){xe(n),h==null||h(n,null);const g=v.matches("[data-anchor]")?v:v.querySelector("[data-anchor]")??v;M&&we(ps(g,M))}function ie(){xe(null),we(null),h==null||h(null)}function os(n,v){var je;if(n.key==="Enter"||n.key===" "){n.preventDefault(),f==null||f(v,null);return}if(n.key==="Escape"){n.currentTarget.blur();return}let g=null;n.key==="ArrowDown"||n.key==="ArrowRight"?g=v+1:n.key==="ArrowUp"||n.key==="ArrowLeft"?g=v-1:n.key==="Home"?g=0:n.key==="End"&&(g=_.length-1),!(g===null||g<0||g>=_.length)&&(n.preventDefault(),(je=M==null?void 0:M.querySelectorAll("[data-step]")[g])==null||je.focus())}function ls(n){if(!n.known)return`${n.label}: ${m.untracked}`;const v=[`${n.label}: ${y(n.value)}`,`${N(p,n.fromStart)} ${m.fromStart}`];return n.previous>=0&&!n.skipped&&v.push(`${N(p,n.fromPrevious)} ${m.fromPrevious}`),v.join(", ")}function us(n){const v=ge[n.index],g=[];return n.known?(g.push({id:"reached",label:m.reached,value:k(n.value),color:v,strong:!0}),g.push({id:"start",label:m.fromStart,value:N(p,n.fromStart)}),n.previous>=0&&n.skipped&&g.push({id:"skipped",label:m.skipped,value:"—",muted:!0}),n.previous>=0&&!n.skipped&&(g.push({id:"prev",label:m.fromPrevious,value:N(p,n.fromPrevious)}),g.push({id:"lost",label:m.lost,value:k(n.lost),muted:!0}))):g.push({id:"none",label:m.untracked,value:"—",color:v}),{title:n.label,rows:g,index:n.index,values:{[n.id]:n.value}}}const E={rows:_,shown:ns,scale:ts,colors:ge,active:V,worst:e.worstDrop,labels:m,fmt:{exact:y,share:n=>N(p,n)},describe:ls,enter:ye,leave:ie,onKey:os,tap:(n,v)=>{w&&(V===n?ie():ye(n,v)),f==null||f(n,null)}};let I=null;if(o==="funnel")I=s.jsx(Vs,{...E});else if(o==="dropoff")I=s.jsx(Ps,{...E});else if(j&&P.width>0){const n=c??ks;I=o==="columns"?s.jsx(Es,{...E,width:P.width,height:n}):s.jsx(Is,{...E,width:P.width,height:n})}const cs=d!==!1,Ne=F??be.current;let Se=null;if(Ne){const n=us(Ne);Se=typeof d=="function"?d(n):s.jsx(_s,{title:n.title,rows:n.rows})}const de=e.start>=0?_[e.start]:null,A=e.end>=0?_[e.end]:null,me=e.worstDrop>=0?_[e.worstDrop]:null,is=i&&de!==null&&A!==null&&e.end>e.start&&Number.isFinite(e.total);return s.jsxs("div",{className:"vl-funnel__body",onPointerLeave:ie,children:[is&&de&&A?s.jsxs("div",{className:"vl-funnel__summary",children:[s.jsxs("div",{className:"vl-funnel__headline",children:[s.jsx("b",{className:"vl-funnel__total",children:N(p,e.total)}),s.jsxs("span",{children:[m.summary(A.label),s.jsx("span",{className:"vl-funnel__of",children:` · ${m.summaryOf(y(A.value),y(de.value))}`})]})]}),me?s.jsx("div",{className:"vl-funnel__worst",children:m.worst(me.label,N(p,1-me.fromPrevious))}):null]}):null,s.jsxs("div",{ref:rs,className:"vl-funnel__plot",role:"group","aria-label":a,children:[I,cs?s.jsx(ws,{open:F!==null&&_e!==null,anchor:_e,bounds:P,prefer:"top","aria-label":a,children:Se}):null]}),t?s.jsx(vs,{children:t}):null,s.jsx(bs,{caption:a,columns:[m.step,m.reached,m.fromStart,m.fromPrevious,m.lost],rows:_.map(n=>[n.label,n.known?y(n.value):m.untracked,N(p,n.fromStart),n.skipped?m.skipped:N(p,n.fromPrevious),Number.isFinite(n.lost)?y(n.lost):"—"])})]})}const L=(e,a)=>a>0?Math.max(0,Math.min(100,e/a*100)):0,pe=(e,a)=>a>0?Math.max(e,1.5):0;function Ts({row:e,labels:a,fmt:t,worst:o}){return e.known?s.jsxs("span",{className:"vl-funnel__nums",children:[s.jsx("b",{className:"vl-funnel__value",children:t.exact(e.value)}),s.jsx("span",{className:"vl-funnel__sub",children:`${t.share(e.fromStart)} ${a.fromStart}`}),e.previous>=0?s.jsx("span",{className:"vl-funnel__step-conv","data-worst":o||void 0,"data-skipped":e.skipped||void 0,children:e.skipped?a.skipped:`↓ ${t.share(e.fromPrevious)}`}):null]}):s.jsx("span",{className:"vl-funnel__nums vl-funnel__nums--muted",children:a.untracked})}function Qa({p:e,i:a,children:t}){const o=e.rows[a];return s.jsxs("li",{className:"vl-funnel__step","data-step":a,"data-state":Ja(e.active,a),"data-worst":e.worst===a||void 0,"data-known":o.known,tabIndex:0,"aria-label":e.describe(o),onPointerEnter:r=>Za(r)&&e.enter(a,r.currentTarget),onFocus:r=>e.enter(a,r.currentTarget),onBlur:e.leave,onKeyDown:r=>e.onKey(r,a),onClick:r=>e.tap(a,r.currentTarget),children:[s.jsx("span",{className:"vl-funnel__name",title:o.label,children:o.label}),t,s.jsx(Ts,{row:o,labels:e.labels,fmt:e.fmt,worst:e.worst===a})]})}function Vs(e){return s.jsx("ol",{className:"vl-funnel__rows vl-funnel__rows--taper",children:e.rows.map((a,t)=>{const o=pe(L(e.shown[t],e.scale),e.shown[t]),r=fe(e.rows,t),l=r>=0?pe(L(e.shown[r],e.scale),e.shown[r]):o;return s.jsx(Qa,{p:e,i:t,children:s.jsx("span",{className:"vl-funnel__graphic","data-anchor":"",children:a.known?s.jsx(ue,{as:"span",className:"vl-funnel__shape",vars:{"--vl-a":`${o}%`,"--vl-b":`${Math.min(o,l)}%`,"--vl-step-color":e.colors[t]}}):null})},a.id)})})}function Ps(e){return s.jsx("ol",{className:"vl-funnel__rows vl-funnel__rows--dropoff",children:e.rows.map((a,t)=>{const o=pe(L(e.shown[t],e.scale),e.shown[t]),r=a.previous>=0?e.shown[a.previous]:0,l=a.known&&!a.skipped&&r>e.shown[t]?L(r-e.shown[t],e.scale):0;return s.jsx(Qa,{p:e,i:t,children:s.jsx("span",{className:"vl-funnel__graphic","data-anchor":"",children:a.known?s.jsxs(s.Fragment,{children:[s.jsx(ue,{as:"span",className:"vl-funnel__reached",vars:{"--vl-w":`${o}%`,"--vl-step-color":e.colors[t]}}),l>0?s.jsx(ue,{as:"span",className:"vl-funnel__lost",vars:{"--vl-x":`${o}%`,"--vl-w":`${l}%`}}):null]}):null})},a.id)})})}const S=30,Xa=46;function he(e){const a=e.rows.length,t=Math.max(e.width,a*$s),o=t/a,r=Math.max(40,e.height-S-Xa),l=S+r;return{n:a,width:t,slot:o,plotH:r,base:l}}function Ya({p:e,i:a,slot:t,cx:o,baseline:r}){const l=e.rows[a];return s.jsxs("g",{className:"vl-funnel__labels","aria-hidden":"true",children:[s.jsx("text",{x:o,y:r+18,textAnchor:"middle",className:"vl-funnel__svg-name",children:Ms(l.label,t-8)}),s.jsx("text",{x:o,y:r+34,textAnchor:"middle",className:"vl-funnel__svg-sub",children:l.known?e.fmt.share(l.fromStart):e.labels.untracked})]})}function es({p:e,i:a,x:t,w:o,children:r}){const{base:l}=he(e);return s.jsxs("g",{className:"vl-funnel__svg-step","data-step":a,"data-state":Ja(e.active,a),"data-worst":e.worst===a||void 0,tabIndex:0,role:"img","aria-label":e.describe(e.rows[a]),onPointerEnter:u=>Za(u)&&e.enter(a,u.currentTarget),onFocus:u=>e.enter(a,u.currentTarget),onBlur:e.leave,onKeyDown:u=>e.onKey(u,a),onClick:u=>e.tap(a,u.currentTarget),children:[s.jsx("rect",{x:t-o/2,y:0,width:o,height:l+Xa,className:"vl-funnel__hit","data-anchor":""}),r]})}const Fs=(e,a,t,o,r)=>`M ${e} ${a} L ${t} ${o} L ${t} ${r} L ${e} ${r} Z`;function Es(e){const{width:a,slot:t,plotH:o,base:r}=he(e),l=Math.min(t*.5,96),u=c=>c*t+t/2,d=c=>r-L(e.shown[c],e.scale)/100*o;return s.jsx("div",{className:"vl-funnel__scroll",children:s.jsxs("svg",{className:"vl-funnel__svg",width:a,height:e.height,viewBox:`0 0 ${a} ${e.height}`,children:[s.jsx("line",{x1:0,x2:a,y1:r,y2:r,className:"vl-funnel__axis"}),e.rows.map((c,i)=>{const x=fe(e.rows,i);if(!c.known||x<0)return null;const h=e.worst===x;return s.jsxs("g",{"aria-hidden":"true",children:[s.jsx("path",{d:Fs(u(i)+l/2,d(i),u(x)-l/2,d(x),r),className:"vl-funnel__wedge","data-worst":h||void 0,fill:e.colors[x]}),s.jsx("text",{x:(u(i)+u(x))/2,y:Math.min(d(i),d(x))-8,textAnchor:"middle",className:"vl-funnel__pill","data-worst":h||void 0,children:e.rows[x].skipped?"…":e.fmt.share(e.rows[x].fromPrevious)})]},`w${c.id}`)}),e.rows.map((c,i)=>s.jsxs(es,{p:e,i,x:u(i),w:Math.min(t-4,l+28),children:[c.known?s.jsxs(s.Fragment,{children:[s.jsx("rect",{x:u(i)-l/2,y:d(i),width:l,height:r-d(i),rx:6,fill:e.colors[i],className:"vl-funnel__column"}),s.jsx("text",{x:u(i),y:d(i)-8,textAnchor:"middle",className:"vl-funnel__svg-value","aria-hidden":"true",children:e.fmt.exact(c.value)})]}):null,s.jsx(Ya,{p:e,i,slot:t,cx:u(i),baseline:r})]},c.id))]})})}const q=14;function Me(e,a,t,o,r,l){const u=(e+o)/2;return`M ${e} ${a} C ${u} ${a}, ${u} ${r}, ${o} ${r} L ${o} ${r+l} C ${u} ${r+l}, ${u} ${a+t}, ${e} ${a+t} Z`}function Is(e){const{width:a,slot:t,plotH:o,base:r}=he(e),l=d=>d*t+t/2,u=d=>L(e.shown[d],e.scale)/100*o;return s.jsx("div",{className:"vl-funnel__scroll",children:s.jsxs("svg",{className:"vl-funnel__svg",width:a,height:e.height,viewBox:`0 0 ${a} ${e.height}`,children:[e.rows.map((d,c)=>{const i=fe(e.rows,c);if(!d.known||i<0)return null;const x=u(c),h=Math.min(u(i),x),f=e.worst===i,p=l(c)+q/2,w=l(i)-q/2;return s.jsxs("g",{"aria-hidden":"true",children:[s.jsx("path",{d:Me(p,S,h,w,S,h),fill:e.colors[i],className:"vl-funnel__ribbon"}),x-h>.5?s.jsx("path",{d:Me(p,S+h,x-h,w-(w-p)*.15,r-2,2),className:"vl-funnel__lost-ribbon","data-worst":f||void 0}):null,s.jsx("text",{x:(p+w)/2,y:S-10,textAnchor:"middle",className:"vl-funnel__pill","data-worst":f||void 0,children:e.rows[i].skipped?"…":e.fmt.share(e.rows[i].fromPrevious)})]},`r${d.id}`)}),e.rows.map((d,c)=>s.jsxs(es,{p:e,i:c,x:l(c),w:Math.min(t-4,72),children:[d.known?s.jsxs(s.Fragment,{children:[s.jsx("rect",{x:l(c)-q/2,y:S,width:q,height:Math.max(2,u(c)),rx:4,fill:e.colors[c],className:"vl-funnel__column"}),s.jsx("text",{x:l(c),y:S+Math.max(2,u(c))+16,textAnchor:"middle",className:"vl-funnel__svg-value","aria-hidden":"true",children:e.fmt.exact(d.value)})]}):null,s.jsx(Ya,{p:e,i:c,slot:t,cx:l(c),baseline:r})]},d.id))]})})}try{ce.displayName="FunnelChart",ce.__docgenInfo={description:`Sales funnel in four looks. It is honest about data: a step without data is "No data", not zero;
percentages go from the last known step; a step bigger than the previous one is flagged instead of
becoming "100%".`,displayName:"FunnelChart",props:{steps:{defaultValue:null,description:"",name:"steps",required:!0,type:{name:"readonly FunnelStep<Id>[]"}},variant:{defaultValue:null,description:"Default `funnel`.",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"funnel"'},{value:'"columns"'},{value:'"dropoff"'},{value:'"flow"'}]}},statsOptions:{defaultValue:null,description:'`zeroIsGap`: a zero in the middle of the funnel is a collection gap, not "nobody". Default true.',name:"statsOptions",required:!1,type:{name:"FunnelStatsOptions | undefined"}},summary:{defaultValue:null,description:"Headline above the drawing: total conversion and the biggest drop. Default true.",name:"summary",required:!1,type:{name:"boolean | undefined"}},labels:{defaultValue:null,description:"",name:"labels",required:!1,type:{name:"Partial<FunnelLabels> | undefined"}},title:{defaultValue:null,description:"Accessible name; also the caption of the screen-reader data table. Required.",name:"title",required:!0,type:{name:"string"}},description:{defaultValue:null,description:"Longer description for assistive tech.",name:"description",required:!1,type:{name:"string | undefined"}},height:{defaultValue:null,description:"Height in px; width always follows the container (responsive). Default per chart.",name:"height",required:!1,type:{name:"number | undefined"}},state:{defaultValue:null,description:"Loading / empty / error / no-access / partial. Default `ready`.",name:"state",required:!1,type:{name:"BlockState | undefined"}},unit:{defaultValue:null,description:"Value unit for axes and tooltips (`UNIT_COUNT`, `currencyUnit('USD')`, …).",name:"unit",required:!1,type:{name:"ValueUnit | undefined"}},formatValue:{defaultValue:null,description:"Custom value formatter; wins over `unit`.",name:"formatValue",required:!1,type:{name:"((value: number) => string) | undefined"}},animate:{defaultValue:null,description:"Animate data changes (on top of reduced-motion and `VizProvider animate`). Default true.",name:"animate",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},"data-testid":{defaultValue:null,description:"Test id on the root.",name:"data-testid",required:!1,type:{name:"string | undefined"}},tooltip:{defaultValue:null,description:"`false` disables; a function replaces the body (`TooltipContent` is the default).",name:"tooltip",required:!1,type:{name:"boolean | ((context: TooltipContext<Id>) => ReactNode) | undefined"}},pinnable:{defaultValue:null,description:"Click/tap pins the tooltip; Escape or the close button unpins. Default true.",name:"pinnable",required:!1,type:{name:"boolean | undefined"}},crosshair:{defaultValue:null,description:"Vertical crosshair on time charts. Default true.",name:"crosshair",required:!1,type:{name:"boolean | undefined"}},onHover:{defaultValue:null,description:"Hovered bucket/datum index (or null) — sync several charts on one dashboard.",name:"onHover",required:!1,type:{name:"((index: number | null, series?: Id | null | undefined) => void) | undefined"}},onSelect:{defaultValue:null,description:"Click on a bucket/datum (drill-down).",name:"onSelect",required:!1,type:{name:"((index: number, series?: Id | null | undefined) => void) | undefined"}}}}}catch{}try{funnel.displayName="funnel",funnel.__docgenInfo={description:"Tapered bands, narrowing top to bottom; numbers on the right.",displayName:"funnel",props:{}}}catch{}try{columns.displayName="columns",columns.__docgenInfo={description:"Columns per step; between them a wedge of the people who left.",displayName:"columns",props:{}}}catch{}try{dropoff.displayName="dropoff",dropoff.__docgenInfo={description:"Full-width rows: reached in colour, lost hatched.",displayName:"dropoff",props:{}}}catch{}try{flow.displayName="flow",flow.__docgenInfo={description:"Ribbons of people from step to step; the lost ones stream down.",displayName:"flow",props:{}}}catch{}const b=[{id:"visit",label:"Event page",value:10641},{id:"select",label:"Choose tickets",value:3090},{id:"cart",label:"Cart",value:1710},{id:"checkout",label:"Checkout",value:940},{id:"paid",label:"Paid",value:499}],as=[{id:"a",label:"Landing page of the summer open-air festival",value:8200},{id:"b",label:"Seat map and ticket category selection",value:2400},{id:"c",label:"Attendee details and delivery method",value:1500},{id:"d",label:"Payment confirmation by the bank",value:900}],ve=Array.from({length:9},(e,a)=>({id:`s${a}`,label:`Step ${a+1}`,value:Math.round(12e3*.72**a)})),en={title:"Charts/Shapes/Funnel",component:ce,args:{title:"Ticket purchase funnel",steps:b},argTypes:{variant:{control:"inline-radio",options:["funnel","columns","dropoff","flow"]}},decorators:[e=>s.jsx("div",{style:{maxWidth:720},children:s.jsx(e,{})})]},O={args:{variant:"funnel"}},R={args:{variant:"columns"}},U={args:{variant:"dropoff"}},W={args:{variant:"flow"}},B={args:{summary:!1}},D={decorators:[e=>s.jsx("div",{style:{maxWidth:320},children:s.jsx(e,{})})]},z={...D,args:{variant:"columns"}},K={decorators:[e=>s.jsx("div",{style:{maxWidth:1100},children:s.jsx(e,{})})],args:{variant:"flow",height:340}},G={args:{steps:as}},H={args:{steps:as,variant:"columns"}},Z={args:{steps:ve}},J={args:{steps:ve,variant:"flow"}},Q={args:{steps:[b[0],{...b[1],value:Number.NaN},b[2],b[3],b[4]],title:"Funnel with an untracked step"}},X={args:{steps:[b[0],b[1],{id:"direct",label:"Direct link to cart",value:3400},b[3],b[4]],variant:"dropoff"}},Y={args:{steps:[]}},ee={args:{state:{status:"loading"}}},ae={args:{state:{status:"loading"},variant:"columns"}},se={args:{state:{status:"error",onRetry:()=>{}}}},ne={args:{state:{status:"no-access"}}},te={args:{state:{status:"partial",reason:"Checkout events are still being collected."}}},$={parameters:{viewport:{defaultViewport:"phone"}},decorators:[e=>s.jsx("div",{style:{maxWidth:358},children:s.jsx(e,{})})]},re={...$,args:{variant:"columns"}},oe={...$,args:{variant:"flow",steps:ve}};function As(e){const[a,t]=C.useState(b.map(o=>o.value));return C.useEffect(()=>{const o=setInterval(()=>{t(r=>{const l=Math.max(2e3,Math.round(r[0]+(Math.random()-.4)*1500)),u=[.29,.55,.55,.53].map(c=>c+(Math.random()-.5)*.12),d=[l];return u.forEach((c,i)=>d.push(Math.round(d[i]*c))),d})},2200);return()=>clearInterval(o)},[]),s.jsx(ce,{...e,steps:b.map((o,r)=>({...o,value:a[r]}))})}const le={render:e=>s.jsx(As,{...e}),args:{variant:"dropoff"}};var De,Te,Ve;O.parameters={...O.parameters,docs:{...(De=O.parameters)==null?void 0:De.docs,source:{originalSource:`{
  args: {
    variant: 'funnel'
  }
}`,...(Ve=(Te=O.parameters)==null?void 0:Te.docs)==null?void 0:Ve.source}}};var Pe,Fe,Ee;R.parameters={...R.parameters,docs:{...(Pe=R.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  args: {
    variant: 'columns'
  }
}`,...(Ee=(Fe=R.parameters)==null?void 0:Fe.docs)==null?void 0:Ee.source}}};var Ie,Ae,qe;U.parameters={...U.parameters,docs:{...(Ie=U.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    variant: 'dropoff'
  }
}`,...(qe=(Ae=U.parameters)==null?void 0:Ae.docs)==null?void 0:qe.source}}};var Oe,Re,Ue;W.parameters={...W.parameters,docs:{...(Oe=W.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  args: {
    variant: 'flow'
  }
}`,...(Ue=(Re=W.parameters)==null?void 0:Re.docs)==null?void 0:Ue.source}}};var We,Be,ze;B.parameters={...B.parameters,docs:{...(We=B.parameters)==null?void 0:We.docs,source:{originalSource:`{
  args: {
    summary: false
  }
}`,...(ze=(Be=B.parameters)==null?void 0:Be.docs)==null?void 0:ze.source}}};var Ke,Ge,He;D.parameters={...D.parameters,docs:{...(Ke=D.parameters)==null?void 0:Ke.docs,source:{originalSource:`{
  decorators: [Story => <div style={{
    maxWidth: 320
  }}>
        <Story />
      </div>]
}`,...(He=(Ge=D.parameters)==null?void 0:Ge.docs)==null?void 0:He.source}}};var Ze,Je,Qe;z.parameters={...z.parameters,docs:{...(Ze=z.parameters)==null?void 0:Ze.docs,source:{originalSource:`{
  ...SmallCard,
  args: {
    variant: 'columns'
  }
}`,...(Qe=(Je=z.parameters)==null?void 0:Je.docs)==null?void 0:Qe.source}}};var Xe,Ye,ea;K.parameters={...K.parameters,docs:{...(Xe=K.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  decorators: [Story => <div style={{
    maxWidth: 1100
  }}>
        <Story />
      </div>],
  args: {
    variant: 'flow',
    height: 340
  }
}`,...(ea=(Ye=K.parameters)==null?void 0:Ye.docs)==null?void 0:ea.source}}};var aa,sa,na;G.parameters={...G.parameters,docs:{...(aa=G.parameters)==null?void 0:aa.docs,source:{originalSource:`{
  args: {
    steps: longLabels
  }
}`,...(na=(sa=G.parameters)==null?void 0:sa.docs)==null?void 0:na.source}}};var ta,ra,oa;H.parameters={...H.parameters,docs:{...(ta=H.parameters)==null?void 0:ta.docs,source:{originalSource:`{
  args: {
    steps: longLabels,
    variant: 'columns'
  }
}`,...(oa=(ra=H.parameters)==null?void 0:ra.docs)==null?void 0:oa.source}}};var la,ua,ca;Z.parameters={...Z.parameters,docs:{...(la=Z.parameters)==null?void 0:la.docs,source:{originalSource:`{
  args: {
    steps: many
  }
}`,...(ca=(ua=Z.parameters)==null?void 0:ua.docs)==null?void 0:ca.source}}};var ia,da,ma;J.parameters={...J.parameters,docs:{...(ia=J.parameters)==null?void 0:ia.docs,source:{originalSource:`{
  args: {
    steps: many,
    variant: 'flow'
  }
}`,...(ma=(da=J.parameters)==null?void 0:da.docs)==null?void 0:ma.source}}};var pa,fa,ha;Q.parameters={...Q.parameters,docs:{...(pa=Q.parameters)==null?void 0:pa.docs,source:{originalSource:`{
  args: {
    steps: [steps[0], {
      ...steps[1],
      value: Number.NaN
    }, steps[2], steps[3], steps[4]],
    title: 'Funnel with an untracked step'
  }
}`,...(ha=(fa=Q.parameters)==null?void 0:fa.docs)==null?void 0:ha.source}}};var va,ga,xa;X.parameters={...X.parameters,docs:{...(va=X.parameters)==null?void 0:va.docs,source:{originalSource:`{
  args: {
    steps: [steps[0], steps[1], {
      id: 'direct',
      label: 'Direct link to cart',
      value: 3400
    }, steps[3], steps[4]],
    variant: 'dropoff'
  }
}`,...(xa=(ga=X.parameters)==null?void 0:ga.docs)==null?void 0:xa.source}}};var _a,wa,ba;Y.parameters={...Y.parameters,docs:{...(_a=Y.parameters)==null?void 0:_a.docs,source:{originalSource:`{
  args: {
    steps: []
  }
}`,...(ba=(wa=Y.parameters)==null?void 0:wa.docs)==null?void 0:ba.source}}};var ya,Na,Sa;ee.parameters={...ee.parameters,docs:{...(ya=ee.parameters)==null?void 0:ya.docs,source:{originalSource:`{
  args: {
    state: {
      status: 'loading'
    }
  }
}`,...(Sa=(Na=ee.parameters)==null?void 0:Na.docs)==null?void 0:Sa.source}}};var ja,ka,$a;ae.parameters={...ae.parameters,docs:{...(ja=ae.parameters)==null?void 0:ja.docs,source:{originalSource:`{
  args: {
    state: {
      status: 'loading'
    },
    variant: 'columns'
  }
}`,...($a=(ka=ae.parameters)==null?void 0:ka.docs)==null?void 0:$a.source}}};var Ca,La,Ma;se.parameters={...se.parameters,docs:{...(Ca=se.parameters)==null?void 0:Ca.docs,source:{originalSource:`{
  args: {
    state: {
      status: 'error',
      onRetry: () => undefined
    }
  }
}`,...(Ma=(La=se.parameters)==null?void 0:La.docs)==null?void 0:Ma.source}}};var Da,Ta,Va;ne.parameters={...ne.parameters,docs:{...(Da=ne.parameters)==null?void 0:Da.docs,source:{originalSource:`{
  args: {
    state: {
      status: 'no-access'
    }
  }
}`,...(Va=(Ta=ne.parameters)==null?void 0:Ta.docs)==null?void 0:Va.source}}};var Pa,Fa,Ea;te.parameters={...te.parameters,docs:{...(Pa=te.parameters)==null?void 0:Pa.docs,source:{originalSource:`{
  args: {
    state: {
      status: 'partial',
      reason: 'Checkout events are still being collected.'
    }
  }
}`,...(Ea=(Fa=te.parameters)==null?void 0:Fa.docs)==null?void 0:Ea.source}}};var Ia,Aa,qa;$.parameters={...$.parameters,docs:{...(Ia=$.parameters)==null?void 0:Ia.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: 'phone'
    }
  },
  decorators: [Story => <div style={{
    maxWidth: 358
  }}>
        <Story />
      </div>]
}`,...(qa=(Aa=$.parameters)==null?void 0:Aa.docs)==null?void 0:qa.source}}};var Oa,Ra,Ua;re.parameters={...re.parameters,docs:{...(Oa=re.parameters)==null?void 0:Oa.docs,source:{originalSource:`{
  ...Phone,
  args: {
    variant: 'columns'
  }
}`,...(Ua=(Ra=re.parameters)==null?void 0:Ra.docs)==null?void 0:Ua.source}}};var Wa,Ba,za;oe.parameters={...oe.parameters,docs:{...(Wa=oe.parameters)==null?void 0:Wa.docs,source:{originalSource:`{
  ...Phone,
  args: {
    variant: 'flow',
    steps: many
  }
}`,...(za=(Ba=oe.parameters)==null?void 0:Ba.docs)==null?void 0:za.source}}};var Ka,Ga,Ha;le.parameters={...le.parameters,docs:{...(Ka=le.parameters)==null?void 0:Ka.docs,source:{originalSource:`{
  render: args => <LiveDemo {...args} />,
  args: {
    variant: 'dropoff'
  }
}`,...(Ha=(Ga=le.parameters)==null?void 0:Ga.docs)==null?void 0:Ha.source}}};const an=["Funnel","Columns","Dropoff","Flow","NoSummary","SmallCard","SmallCardColumns","Wide","LongLabels","LongLabelsColumns","ManySteps","ManyStepsFlow","GapInData","SkippedStep","Empty","Loading","LoadingColumns","ErrorState","NoAccess","Partial","Phone","PhoneColumns","PhoneFlowManySteps","LiveUpdates"];export{R as Columns,U as Dropoff,Y as Empty,se as ErrorState,W as Flow,O as Funnel,Q as GapInData,le as LiveUpdates,ee as Loading,ae as LoadingColumns,G as LongLabels,H as LongLabelsColumns,Z as ManySteps,J as ManyStepsFlow,ne as NoAccess,B as NoSummary,te as Partial,$ as Phone,re as PhoneColumns,oe as PhoneFlowManySteps,X as SkippedStep,D as SmallCard,z as SmallCardColumns,K as Wide,an as __namedExportsOrder,en as default};
