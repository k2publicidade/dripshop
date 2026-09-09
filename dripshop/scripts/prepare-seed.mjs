import fs from 'node:fs';
import ts from 'typescript';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
function readData(path) { const source=fs.readFileSync(path,'utf8'); const out=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText; const result={exports:{}}; new Function('exports','require','module',out)(result.exports,require,result); return result.exports; }
const {products}=readData('src/lib/data/products.ts');
const {categories,collections,creators}=readData('src/lib/data/categories.ts');
const q=s=>s==null?'NULL':"'"+String(s).replaceAll("'","''")+"'";
const arr=a=>'ARRAY['+a.map(q).join(',')+']::text[]';
const imageByCategory={camisetas:'photo-1521572163474-6864f9cf17ab',moletom:'photo-1556821840-3a63f95609a7',caneca:'photo-1514228742587-6b1558fcca3d',ecobag:'photo-1590874103328-eac38a683ce7'};
let sql='begin;\n';
for(const c of categories) sql+=`insert into public.categories(name,slug) values(${q(c.name)},${q(c.slug)}) on conflict(slug) do nothing;\n`;
for(const c of collections) sql+=`insert into public.collections(name,slug) values(${q(c.name.replace('LOLJA','DRIPSHOP'))},${q(c.slug)}) on conflict(slug) do nothing;\n`;
for(const c of creators) sql+=`insert into public.creators(name,slug,verified) values(${q(c.name)},${q(c.slug)},false) on conflict(slug) do nothing;\n`;
for(const p of products) {
 const image='https://images.unsplash.com/'+(imageByCategory[p.category]||'photo-1434389677669-e08b4cac3105')+'?auto=format&fit=crop&w=900&q=85';
 sql+=`insert into public.products(name,slug,description,price,original_price,images,category_id,collection_id,creator_id,sizes,stock,is_new,is_featured,theme) values(${q(p.name)},${q(p.slug)},${q(p.description)},${p.price},${p.originalPrice||'NULL'},${arr([image])},(select id from public.categories where slug=${q(p.category)}),(select id from public.collections where slug=${q(p.collection)}),(select id from public.creators where slug=${q(p.creator)}),${arr(p.sizes)},0,${!!p.isNew},${!!p.isFeatured},${q(p.theme)}) on conflict(slug) do nothing;\n`;
 for(const c of p.colors) sql+=`insert into public.product_colors(product_id,name,hex) select p.id,${q(c.name)},${q(c.hex)} from public.products p where p.slug=${q(p.slug)} and not exists(select 1 from public.product_colors c where c.product_id=p.id and c.name=${q(c.name)});\n`;
 for(const size of p.sizes) for(const c of p.colors) sql+=`insert into public.product_variants(product_id,size,color,stock) select id,${q(size)},${q(c.name)},0 from public.products where slug=${q(p.slug)} on conflict(product_id,size,color) do nothing;\n`;
}
sql+='commit;';fs.writeFileSync('supabase/seed.sql',sql);console.log(`Prepared ${products.length} catalog products with zero inventory and illustrative images.`);

