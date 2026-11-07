import{j as a}from"./jsx-runtime-Cf8x2fCZ.js";import{b as n,c as i,f as p,H as c,e as f,g as U,h as b}from"./format-B5KDo3eI.js";import"./index-yBjzXJbu.js";const j={title:"Core/Formatting"},t=Date.UTC(2026,9,7,14,0),x=[["number(1234567)",e=>e.number(1234567)],["compact(1234)",e=>e.compact(1234)],["compact(48 000)",e=>e.compact(48e3)],["compact(1.5M)",e=>e.compact(15e5)],["currency(248 000, USD)",e=>e.currency(248e3,"USD")],["currency(248 000, RUB)",e=>e.currency(248e3,"RUB")],["value(248 000, EUR, short)",e=>e.value(248e3,i("EUR"))],["value(12.34, percent)",e=>e.value(12.34,p)],["delta(24)",e=>e.delta(24)],["delta(−42)",e=>e.delta(-42)],["day(t)",e=>e.day(t)],["date(t)",e=>e.date(t)],["time(t)",e=>e.time(t)],["bucket(hour)",e=>e.bucket(t,"hour",c)],["bucket(day)",e=>e.bucket(t,"day",24*c)],["range(t, t+44h)",e=>e.range(t,t+44*c)],["span(44h)",e=>e.span(44*c)],["relative(t−3min)",e=>e.relative(t-18e4,t)],["relative(t+2d)",e=>e.relative(t+48*c,t)]],s={name:"en vs ru, UTC vs UTC+3",render:()=>{const e=[["en · UTC",n(f)],["ru · UTC+3",n(b,U(3))]];return a.jsxs("table",{className:"vl-data-table-fallback",children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{children:"Call"}),e.map(([r])=>a.jsx("th",{children:r},r))]})}),a.jsx("tbody",{children:x.map(([r,m])=>a.jsxs("tr",{children:[a.jsx("th",{scope:"row",children:a.jsx("code",{children:r})}),e.map(([u,h])=>a.jsx("td",{children:m(h)},u))]},r))})]})}};var o,d,l;s.parameters={...s.parameters,docs:{...(o=s.parameters)==null?void 0:o.docs,source:{originalSource:`{
  name: 'en vs ru, UTC vs UTC+3',
  render: () => {
    const fmts = [['en · UTC', createFormatter(en)], ['ru · UTC+3', createFormatter(ru, fixedOffsetZone(3))]] as const;
    return <table className="vl-data-table-fallback">
        <thead>
          <tr>
            <th>Call</th>
            {fmts.map(([n]) => <th key={n}>{n}</th>)}
          </tr>
        </thead>
        <tbody>
          {SAMPLES.map(([name, fn]) => <tr key={name}>
              <th scope="row">
                <code>{name}</code>
              </th>
              {fmts.map(([n, f]) => <td key={n}>{fn(f)}</td>)}
            </tr>)}
        </tbody>
      </table>;
  }
}`,...(l=(d=s.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};const T=["Locales"];export{s as Locales,T as __namedExportsOrder,j as default};
