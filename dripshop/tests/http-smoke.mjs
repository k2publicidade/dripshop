import assert from 'node:assert/strict';
const root=process.env.TEST_APP_URL||'http://localhost:3000';
for (const path of ['/api/account','/api/addresses','/api/favorites','/api/orders','/api/cart','/api/admin/products','/api/admin/profiles']) {
 const response=await fetch(root+path);assert.equal(response.status,401,path+' must require authentication');
}
const uploadGuard = await fetch(root+'/api/admin/upload', { method: 'POST', body: new FormData() });
assert.equal(uploadGuard.status, 401, '/api/admin/upload must require authentication');
for (const path of ['/admin','/conta','/conta/pedidos']) {
 const response=await fetch(root+path,{redirect:'manual'});assert.equal(response.status,307);assert.ok(response.headers.get('location').includes('/login'));
}
const products=await fetch(root+'/api/products').then(r=>r.json());assert.ok(products.data.products.length>0);assert.ok(products.data.products.every(p=>p.variants?.length));
for(const path of ['/','/busca','/categoria/camisetas','/colecoes','/produto/'+products.data.products[0].slug,'/carrinho','/checkout']){const r=await fetch(root+path);assert.equal(r.status,200,path);}
console.log('PASS: 8 private API guards, 3 private page redirects, catalog variants and 7 public pages.');
