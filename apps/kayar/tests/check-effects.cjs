// Fails if any useEffect/useLayoutEffect is async or returns something other than a cleanup function (React would later call it: 'n is not a function').
let bad=0;
const {parse}=require('@babel/parser');const fs=require('fs');const path=require('path');
function walk(d,o=[]){for(const f of fs.readdirSync(d)){const p=path.join(d,f);if(f==='node_modules'||f==='.zite')continue;const s=fs.statSync(p);if(s.isDirectory())walk(p,o);else if(/\.tsx?$/.test(f))o.push(p)}return o}
const files=[...walk(path.join(__dirname,"../src"))];
for(const file of files){const src=fs.readFileSync(file,'utf8');let ast;try{ast=parse(src,{sourceType:'module',plugins:['typescript','jsx']})}catch(e){continue}
 const visit=(n,cb)=>{if(!n||typeof n.type!=='string')return;cb(n);for(const k in n){if(k==='loc')continue;const v=n[k];if(Array.isArray(v))v.forEach(x=>x&&visit(x,cb));else if(v&&typeof v.type==='string')visit(v,cb)}};
 visit(ast,n=>{if(n.type==='CallExpression'&&/^(use(Layout|Insertion)?Effect)$/.test(n.callee.name||n.callee.property?.name)){const fn=n.arguments[0];if(!fn)return;
  if(fn.async)bad++,console.log('ASYNC',file,fn.loc.start.line);
  if(fn.type==='ArrowFunctionExpression'&&fn.body.type!=='BlockStatement')bad++,console.log('EXPR',file,fn.loc.start.line,src.slice(fn.body.start,fn.body.end).slice(0,90));
  if(fn.body.type==='BlockStatement'){const rets=[];const v2=(m)=>{if(!m||typeof m.type!=='string')return;if(m!==fn&&/Function/.test(m.type))return;if(m.type==='ReturnStatement')rets.push(m);for(const k in m){if(k==='loc')continue;const v=m[k];if(Array.isArray(v))v.forEach(v2);else if(v&&typeof v.type==='string')v2(v)}};v2(fn.body);
   for(const r of rets){const a=r.argument;if(a&&!/Function/.test(a.type)&&!(a.type==='Identifier'&&a.name==='undefined'))bad++,console.log('RET',file,r.loc.start.line,src.slice(r.start,r.end).slice(0,100))}}
 }});}
process.exit(bad?1:0);
