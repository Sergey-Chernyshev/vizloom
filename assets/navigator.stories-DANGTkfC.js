import{j as o}from"./jsx-runtime-Cf8x2fCZ.js";import{d as N,a as O,b as Z,c as L,D as y}from"./demo-data-r2EZ3FY7.js";import{N as E}from"./navigator-Bi4TuIt5.js";import{Z as z}from"./zoom-controls-D7tobNcm.js";import{a as A,b as C}from"./hooks-aQKESm79.js";import{D as M}from"./format-B5KDo3eI.js";import"./index-yBjzXJbu.js";import"./source-C-kKhT28.js";import"./index-G8LIXM5I.js";import"./_commonjsHelpers-CqkleIqs.js";import"./colors-byAFwtRc.js";import"./palette-D2rnmE_p.js";import"./curve-BD7CZoyo.js";import"./provider-BLSBXahb.js";import"./tooltip-BMOcmBfF.js";import"./cx-BrTOQ2Ro.js";import"./primitives-CzyPZwcc.js";const e=Z(),m=L(e),I=y.map((r,a)=>({id:r.id,label:r.label,color:`var(--vl-cat-${a+1})`})),V={zoomIn:"Zoom in",zoomOut:"Zoom out",resetZoom:"Whole period"},_={start:m.start,end:m.start+m.length*M};function W({withMarkers:r=!1,ready:a=!0}){const p=A({extent:_,initial:{start:e.now-14*M,end:e.now}}),c=C(p);return o.jsxs("div",{className:"sb-stack",children:[o.jsx(z,{viewport:p,labels:V}),o.jsx(E,{viewport:p,series:I,frame:a?m:null,ready:a,zones:O(e),now:e.now,eventAt:e.event,eventLabel:"Concert",markers:r?N(e):void 0,renderMarkerIcon:r?()=>o.jsx("span",{"aria-hidden":"true",children:"•"}):void 0}),o.jsx("output",{children:`${new Date(c.start).toISOString().slice(0,10)} → ${new Date(c.end).toISOString().slice(0,10)}`})]})}const oe={title:"Charts/Time/Navigator",component:W,parameters:{layout:"padded"}},t={},s={args:{withMarkers:!0}},n={args:{ready:!1}},i={parameters:{viewport:{defaultViewport:"phone"}}};var d,l,u,g,w;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:"{}",...(u=(l=t.parameters)==null?void 0:l.docs)==null?void 0:u.source},description:{story:"Drag the window, drag its edges, click outside to jump, wheel to zoom; arrows, +/−, Home on the keyboard.",...(w=(g=t.parameters)==null?void 0:g.docs)==null?void 0:w.description}}};var f,h,v;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    withMarkers: true
  }
}`,...(v=(h=s.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};var S,x,D;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    ready: false
  }
}`,...(D=(x=n.parameters)==null?void 0:x.docs)==null?void 0:D.source}}};var k,b,j;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: 'phone'
    }
  }
}`,...(j=(b=i.parameters)==null?void 0:b.docs)==null?void 0:j.source}}};const te=["Default","WithMarkers","Loading","Phone"];export{t as Default,n as Loading,i as Phone,s as WithMarkers,te as __namedExportsOrder,oe as default};
