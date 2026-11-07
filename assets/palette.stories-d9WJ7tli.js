import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{r as v}from"./index-G8LIXM5I.js";import{h as p}from"./hooks-aQKESm79.js";import{r as x}from"./colors-byAFwtRc.js";import{a as o,d as u,t as r,c as f,b as j}from"./palette-D2rnmE_p.js";import"./index-yBjzXJbu.js";import"./_commonjsHelpers-CqkleIqs.js";import"./format-B5KDo3eI.js";import"./provider-BLSBXahb.js";const H={title:"Core/Palette and tokens"},t={name:"Categorical, comparison, sequential, diverging",render:function(){const[d,h]=v.useState(null);p();const i=x(d),m=o(j(i.sequential[0],i.sequential[1]),9),g=o(u(i.diverging[0],i.diverging[1],i.diverging[2]),9);return e.jsxs("div",{ref:h,className:"sb-stack",children:[e.jsx("h4",{children:"Categorical (contrast vs surface)"}),e.jsx("div",{className:"sb-row",children:i.categorical.map((s,a)=>e.jsxs("figure",{className:"sb-chip-swatch",children:[e.jsx("svg",{viewBox:"0 0 40 40","aria-hidden":"true",children:e.jsx("rect",{width:"40",height:"40",rx:"8",fill:r(s)})}),e.jsxs("figcaption",{children:["--vl-cat-",a+1,e.jsx("br",{}),f(s,i.surface).toFixed(1),":1"]})]},a))}),e.jsx("h4",{children:"Comparison"}),e.jsx("div",{className:"sb-row",children:i.compare.map((s,a)=>e.jsx("svg",{viewBox:"0 0 40 8",width:"80","aria-hidden":"true",children:e.jsx("line",{x1:"0",y1:"4",x2:"40",y2:"4",stroke:r(s),strokeWidth:"2",strokeDasharray:"4 3"})},a))}),e.jsx("h4",{children:"Sequential"}),e.jsx("div",{className:"sb-ramp",children:m.map((s,a)=>e.jsx("svg",{viewBox:"0 0 10 10","aria-hidden":"true",children:e.jsx("rect",{width:"10",height:"10",fill:r(s)})},a))}),e.jsx("h4",{children:"Diverging"}),e.jsx("div",{className:"sb-ramp",children:g.map((s,a)=>e.jsx("svg",{viewBox:"0 0 10 10","aria-hidden":"true",children:e.jsx("rect",{width:"10",height:"10",fill:r(s)})},a))})]})}};var c,n,l;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  name: 'Categorical, comparison, sequential, diverging',
  render: function Render() {
    const [el, setEl] = useState<HTMLDivElement | null>(null);
    useThemeVersion();
    const c = readThemeColors(el);
    const seq = sampleRamp(sequentialRamp(c.sequential[0], c.sequential[1]), 9);
    const div = sampleRamp(divergingRamp(c.diverging[0], c.diverging[1], c.diverging[2]), 9);
    return <div ref={setEl} className="sb-stack">
        <h4>Categorical (contrast vs surface)</h4>
        <div className="sb-row">
          {c.categorical.map((col, i) => <figure key={i} className="sb-chip-swatch">
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <rect width="40" height="40" rx="8" fill={toHex(col)} />
              </svg>
              <figcaption>
                --vl-cat-{i + 1}
                <br />
                {contrastRatio(col, c.surface).toFixed(1)}:1
              </figcaption>
            </figure>)}
        </div>
        <h4>Comparison</h4>
        <div className="sb-row">
          {c.compare.map((col, i) => <svg key={i} viewBox="0 0 40 8" width="80" aria-hidden="true">
              <line x1="0" y1="4" x2="40" y2="4" stroke={toHex(col)} strokeWidth="2" strokeDasharray="4 3" />
            </svg>)}
        </div>
        <h4>Sequential</h4>
        <div className="sb-ramp">
          {seq.map((col, i) => <svg key={i} viewBox="0 0 10 10" aria-hidden="true">
              <rect width="10" height="10" fill={toHex(col)} />
            </svg>)}
        </div>
        <h4>Diverging</h4>
        <div className="sb-ramp">
          {div.map((col, i) => <svg key={i} viewBox="0 0 10 10" aria-hidden="true">
              <rect width="10" height="10" fill={toHex(col)} />
            </svg>)}
        </div>
      </div>;
  }
}`,...(l=(n=t.parameters)==null?void 0:n.docs)==null?void 0:l.source}}};const D=["Palettes"];export{t as Palettes,D as __namedExportsOrder,H as default};
