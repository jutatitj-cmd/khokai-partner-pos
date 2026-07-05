const App = { page:'quick', selectedOrder:null, draftUnit:'bag', draftQty:1, syncing:false };
const LS = 'khokai_partner_pos_v217';
const OLD_LS = 'khokai_partner_pos_v216';
const CFG = 'khokai_partner_cfg_v217';
const OLD_CFG = 'khokai_partner_cfg_v216';
const fmt = n => '₩ ' + Number(n||0).toLocaleString('ko-KR');
const today = () => new Date().toISOString().slice(0,10);
const uid = p => p + '-' + Math.random().toString(36).slice(2,8);
const seed = {
  tiers:[{id:'retail',name:'Retail'},{id:'restaurant',name:'Restaurant'},{id:'mart',name:'Mart'},{id:'wholesale',name:'Wholesale'},{id:'vip',name:'VIP'}],
  partners:[
    {id:'pt1',name:'아이비',tier:'restaurant',phone:'010-7633-2000',address:'경기도 안산시 단원구 다문화1길 68, 1층',credit_days:7,balance:8550000,biz_no:'684-86-02697'},
    {id:'pt2',name:'Thai Mart Seoul',tier:'mart',phone:'010-1111-2222',address:'서울',credit_days:3,balance:0,biz_no:''}
  ],
  products:[
    {id:'pork1',sku:'KH-PORK-1KG',option_id:'PO-KH-PORK-1KG',display_product_id:'DP-KH-PORK',name_th:'ลูกชิ้นหมูพรีเมียม 1kg',name_ko:'돼지볼 커카이 1kg',box_qty:15,weight_kg:1,prices:{retail:14900,restaurant:13500,mart:13200,wholesale:12800,vip:12500}},
    {id:'mix1',sku:'KH-MIX-1KG',option_id:'PO-KH-MIX-1KG',display_product_id:'DP-KH-MIX',name_th:'ลูกชิ้นหมู+ไก่ 1kg',name_ko:'미트볼 커카이 2호 1kg',box_qty:15,weight_kg:1,prices:{retail:12000,restaurant:10800,mart:10500,wholesale:10200,vip:10000}},
    {id:'cart1',sku:'KH-CART-1KG',option_id:'PO-KH-CART-1KG',display_product_id:'DP-KH-CART',name_th:'ลูกชิ้นเอ็นไก่ 1kg',name_ko:'미트볼 커카이 3호 1kg',box_qty:15,weight_kg:1,prices:{retail:12000,restaurant:10800,mart:10500,wholesale:10200,vip:10000}},
    {id:'muyo700',sku:'KH-MUYO-700G',option_id:'PO-KH-MUYO-700G',display_product_id:'DP-KH-MUYO',name_th:'หมูยอ 700g',name_ko:'여우본 700g',box_qty:20,weight_kg:.7,prices:{retail:10000,restaurant:9000,mart:8700,wholesale:8500,vip:8200}}
  ],
  box_rules:[],
  orders:[]
};
let db = load();
function load(){ try{ return JSON.parse(localStorage.getItem(LS)) || JSON.parse(localStorage.getItem(OLD_LS)) || structuredClone(seed); }catch(e){ return JSON.parse(JSON.stringify(seed)); } }
function save(){ localStorage.setItem(LS, JSON.stringify(db)); }
function cfg(){ try{return JSON.parse(localStorage.getItem(CFG))||JSON.parse(localStorage.getItem(OLD_CFG))||{tracking_base:'', customer_box_fee:0}}catch(e){return{tracking_base:'', customer_box_fee:0}} }
function saveCfg(c){ localStorage.setItem(CFG, JSON.stringify(c)); }
const partner = id => db.partners.find(x=>x.id===id);
const product = id => db.products.find(x=>x.id===id);
const defaultTier = o => partner(o.partner_id)?.tier || 'restaurant';
const priceOf = (pr,tier) => Number(pr?.prices?.[tier] || pr?.prices?.restaurant || pr?.prices?.retail || 0);
const boxQty = pr => Number(pr?.box_qty || pr?.pack_per_box || 1);
const itemWeight = it => (Number(product(it.product_id)?.weight_kg||0) * Number(it.pack_qty||0));
function calc(o){
  o.subtotal = (o.items||[]).reduce((a,it)=>a+Number(it.line_total||0),0);
  o.weight_kg = (o.items||[]).reduce((a,it)=>a+itemWeight(it),0);
  if(o.shipping_mode==='free') o.shipping_fee = 0;
  else if(o.shipping_mode==='fee') o.shipping_fee = Number(o.shipping_boxes||0) * Number(o.customer_box_fee||cfg().customer_box_fee||0);
  else o.shipping_fee = Number(o.shipping_fee||0);
  o.total = o.subtotal + Number(o.shipping_fee||0);
}
function boxFee(method){ return Number(cfg().customer_box_fee||0); }
function calcShipping(order){ return 0; }
function safeOrder(){
  let draft = db.orders.find(x=>x.status==='draft');
  if(!draft){ draft={id:uid('ord'),no:'B2B-'+Date.now().toString().slice(-8),date:today(),status:'draft',payment_status:'pending',partner_id:'',delivery_date:'',delivery_method:'parcel',shipping_mode:'free',shipping_boxes:0,customer_box_fee:Number(cfg().customer_box_fee||0),items:[],subtotal:0,shipping_fee:0,total:0,weight_kg:0}; db.orders.unshift(draft); save(); }
  return draft;
}
function nav(){ return [['quick','ด่วน'],['history','ประวัติ'],['ship','รวม/OMS'],['orders','Order'],['partners','Partner'],['products','Product'],['settings','ตั้งค่า']].map(([p,t])=>`<button class="${App.page===p?'active':''}" onclick="go('${p}')">${t}</button>`).join(''); }
function header(){ return `<div class="top"><div class="top-inner compact-head"><div><div class="brand small-brand">KHOKAI ERP Lite · เปิดออเดอร์ด่วน</div><div class="tag small-tag">V2.1.7</div></div></div><div class="nav no-print">${nav()}</div></div>`; }
function bottom(){ return `<div class="bottom-bar no-print">${nav()}</div>`; }
function go(p){ App.page=p; App.selectedOrder=null; render(); }
function render(){ document.body.innerHTML = header()+`<main class="app">${pages[App.page]()}</main>`+bottom(); }
const pages = {quick, history, ship, orders, partners, products, settings};
function productOptions(){ return db.products.map(p=>`<option value="${p.id}">${p.name_th||p.name_ko||p.sku}</option>`).join(''); }
function unitButtons(){ return `<div class="seg unit-mini"><button type="button" class="${App.draftUnit==='bag'?'on':''}" onclick="setUnit('bag')">ถุง</button><button type="button" class="${App.draftUnit==='box'?'on':''}" onclick="setUnit('box')">ลัง</button></div>`; }
function qtyControl(){ return `<div class="qtybox qty-inline"><button type="button" class="qtybtn" onclick="setQty(App.draftQty-1)">−</button><input class="input qty-input compact-qty" id="qty" type="number" min="1" value="${App.draftQty}" onchange="setQty(this.value)"><button type="button" class="qtybtn" onclick="setQty(App.draftQty+1)">+</button><button type="button" class="plus-chip" onclick="addQty(5)">+5</button><button type="button" class="plus-chip" onclick="addQty(10)">+10</button></div>`; }
function addProductBlock(oid){ return `<div class="addbox"><div class="form-grid v214-grid"><div><label>สินค้า</label><select id="pselect">${productOptions()}</select></div><div><label>หน่วย</label>${unitButtons()}</div><div><label>จำนวน</label>${qtyControl()}</div><div class="end"><button class="small-action" onclick="addItem('${oid}')">+ เพิ่มสินค้า</button></div></div></div>`; }
function setUnit(v){ App.draftUnit=v; render(); }
function setQty(v){ App.draftQty=Math.max(1, Number(v||1)); render(); }
function addQty(n){ App.draftQty=Math.max(1, Number(App.draftQty||1)+Number(n||0)); render(); }
function addItem(oid){
  const order = db.orders.find(x=>x.id===oid); const pr=product(document.getElementById('pselect').value); if(!order||!pr) return;
  const sell_unit=App.draftUnit || 'bag'; const qty=Number(App.draftQty||1); const pack_qty=sell_unit==='box' ? qty*boxQty(pr) : qty; const unit_price=priceOf(pr, defaultTier(order));
  order.items.push({product_id:pr.id,sell_unit,box_qty_used:sell_unit==='box'?boxQty(pr):1,qty,pack_qty,unit_price,line_total:pack_qty*unit_price});
  calc(order); App.draftQty=1; save(); render();
}
function removeItem(oid,i){ const order=db.orders.find(x=>x.id===oid); order.items.splice(i,1); calc(order); save(); render(); }
function itemsHtml(order, editable=true){ if(!order.items.length) return '<div class="sub center-pad">ยังไม่มีสินค้า</div>'; return `<div class="list compact-list">${order.items.map((it,i)=>{const pr=product(it.product_id)||{};return `<div class="list-item compact-item"><div style="flex:1"><b>${pr.name_th||pr.name_ko||''}</b><div class="sub">${it.sell_unit==='box'?'ลัง':'ถุง'} x ${it.qty} · รวม ${it.pack_qty} ถุง${it.sell_unit==='box'?` · ${it.box_qty_used}/ลัง`:''}</div></div><b>${fmt(it.line_total)}</b>${editable?`<button class="btn-danger tiny" onclick="removeItem('${order.id}',${i})">ลบ</button>`:''}</div>`}).join('')}</div>`; }
function quick(){ const order=safeOrder(); return `<div class="sub quick-note">เลือกสินค้าให้จบก่อน ลูกค้าโอนแล้วค่อยมากรอก Partner / วันส่ง / วิธีส่ง / ข้อมูลโอน</div><div class="card clean-card">${addProductBlock(order.id)}<div style="margin-top:10px">${itemsHtml(order,true)}</div>${shippingControl(order)}${totalBox(order)}<div class="row total-row quick-actions"><button class="icon-btn" title="บันทึกออเดอร์" onclick="saveDraftToSupabase('${order.id}')">💾</button><button class="icon-btn" title="ประวัติออเดอร์ชั่วคราว" onclick="go('history')">🕘</button><button class="flag-btn" onclick="copyText(closeMsg('${order.id}','th'))">🇹🇭</button><button class="flag-btn" onclick="copyText(closeMsg('${order.id}','ko'))">🇰🇷</button></div></div>`; }
function totalBox(order){ return `<div class="total-mini total-clean"><div>ค่าส่ง <b>${fmt(order.shipping_fee||0)}</b></div><div class="grand">รวม ${fmt(order.total||0)}</div></div>`; }
function shippingControl(order){
  const mode = order.shipping_mode || 'free';
  const boxes = Number(order.shipping_boxes||0);
  const fee = Number(order.customer_box_fee || cfg().customer_box_fee || 0);
  return `<div class="ship-control"><div class="seg ship-seg"><button type="button" class="${mode==='free'?'on':''}" onclick="setShipping('${order.id}','free')">ส่งฟรี</button><button type="button" class="${mode==='fee'?'on':''}" onclick="setShipping('${order.id}','fee')">ค่าส่ง</button></div><div class="ship-inline"><span>ลัง</span><button type="button" class="qtybtn" onclick="setShippingBoxes('${order.id}',${boxes-1})">−</button><input class="input ship-box-input" type="number" min="0" value="${boxes}" onchange="setShippingBoxes('${order.id}',this.value)"><button type="button" class="qtybtn" onclick="setShippingBoxes('${order.id}',${boxes+1})">+</button><span>${fmt(fee)}/ลัง</span></div></div>`;
}
function setShipping(id,mode){ const order=db.orders.find(x=>x.id===id); if(!order)return; order.shipping_mode=mode; if(mode==='free') order.shipping_boxes=0; if(mode==='fee' && !order.shipping_boxes) order.shipping_boxes=1; order.customer_box_fee=Number(cfg().customer_box_fee||0); calc(order); save(); render(); }
function setShippingBoxes(id,v){ const order=db.orders.find(x=>x.id===id); if(!order)return; order.shipping_boxes=Math.max(0,Number(v||0)); order.shipping_mode=order.shipping_boxes>0?'fee':'free'; order.customer_box_fee=Number(cfg().customer_box_fee||0); calc(order); save(); render(); }
function openOrderDetail(id){ App.selectedOrder=id; App.page='orders'; render(); }
function closeMsg(orderId,lang){
  const order=db.orders.find(x=>x.id===orderId) || safeOrder();
  const lines=(order.items||[]).map(it=>{const pr=product(it.product_id)||{};const name=lang==='ko'?(pr.name_ko||pr.name_th):(pr.name_th||pr.name_ko); const unit=lang==='ko'?(it.sell_unit==='box'?'박스':'봉'):(it.sell_unit==='box'?'ลัง':'ถุง'); return `- ${name} x ${it.qty} ${unit}`;}).join('\n');
  const track=trackingLink(order);
  if(lang==='ko') return [`주문 확인드립니다.`,``,lines||'- 상품 선택 전',``, `배송비: ${fmt(order.shipping_fee||0)}`, `총 결제금액: ${fmt(order.total||0)}`, ``, `입금계좌: 신한 140-013-678642 메콩푸드(주)`, `배송예정일: 입금 확인 후 안내`, ``, `주문상태 확인`, `${track}`, ``, `감사합니다.`].join('\n');
  return [`สรุปออเดอร์ครับ`, ``, lines||'- ยังไม่ได้เลือกสินค้า', ``, `ค่าส่ง: ${fmt(order.shipping_fee||0)}`, `ยอดโอนรวม: ${fmt(order.total||0)}`, ``, `บัญชีโอน: 신한 140-013-678642 메콩푸드(주)`, `วันจัดส่ง: แจ้งหลังยืนยันโอน`, ``, `ลิงก์ติดตามสถานะ`, `${track}`, ``, `ขอบคุณครับ 🙏`].join('\n');
}
function trackingLink(order){ const base=(cfg().tracking_base||'').replace(/\/$/,''); return base ? `${base}/t/${order.no}` : `(ยังไม่ได้ตั้งค่า Tracking URL) /t/${order.no}`; }
function copyText(t){ navigator.clipboard?.writeText(t).then(()=>alert('คัดลอกแล้ว')).catch(()=>{ const ta=document.createElement('textarea'); ta.value=t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); alert('คัดลอกแล้ว'); }); }

function history(){ const os=db.orders.filter(o=>o.status==='draft'||o.status==='saved'||o.payment_status==='pending').sort((a,b)=>String(b.no).localeCompare(String(a.no))); return `<div class="title">ประวัติออเดอร์ชั่วคราว</div><div class="list">${os.map(order=>`<div class="list-item"><div style="flex:1"><b>${order.no}</b><div class="sub">${order.date||''} · ${partner(order.partner_id)?.name||'ยังไม่เลือก Partner'} · ${fmt(order.total)} · ${order.items?.length||0} รายการ</div></div><button class="tiny" onclick="openOrderDetail('${order.id}')">เปิด/แก้</button></div>`).join('')||'<div class="card clean-card sub">ยังไม่มีออเดอร์ชั่วคราว</div>'}</div>`; }

function orders(){ if(App.selectedOrder) return orderDetail(App.selectedOrder); return `<div class="title">Order</div><div class="list">${db.orders.map(order=>`<div class="list-item"><div style="flex:1"><b>${order.no}</b><div class="sub">${order.status} · ${partner(order.partner_id)?.name||'ยังไม่เลือก Partner'} · ${fmt(order.total)}</div></div><button onclick="openOrderDetail('${order.id}')">เปิด</button></div>`).join('')}</div>`; }
function partnerOptions(id){ return `<option value="">ยังไม่เลือก Partner</option>`+db.partners.map(p=>`<option value="${p.id}" ${id===p.id?'selected':''}>${p.name} (${p.tier})</option>`).join(''); }
function orderDetail(id){ const order=db.orders.find(x=>x.id===id); if(!order) return '<div class="card">ไม่พบออเดอร์</div>'; return `<button class="btn3 tiny" onclick="App.selectedOrder=null;render()">← กลับ</button><div class="card clean-card"><div class="title">${order.no}</div><div class="form-grid"><div><label>Partner หลังโอน</label><select onchange="updateOrderField('${id}','partner_id',this.value,true)">${partnerOptions(order.partner_id)}</select></div><div><label>วันจัดส่ง หลังโอน</label><input class="input" type="date" value="${order.delivery_date||''}" onchange="updateOrderField('${id}','delivery_date',this.value)"></div><div><label>ช่องทางส่ง หลังโอน</label><select onchange="updateOrderField('${id}','delivery_method',this.value,true)"><option value="parcel" ${order.delivery_method!=='truck'?'selected':''}>พัสดุ / 택배</option><option value="truck" ${order.delivery_method==='truck'?'selected':''}>รถส่งถึงที่ / 직접배송</option></select></div><div><label>สถานะเงิน</label><select onchange="updateOrderField('${id}','payment_status',this.value)"><option value="pending" ${order.payment_status==='pending'?'selected':''}>รอโอน</option><option value="paid" ${order.payment_status==='paid'?'selected':''}>โอนแล้ว</option><option value="unpaid" ${order.payment_status==='unpaid'?'selected':''}>เครดิต/ยังไม่จ่าย</option></select></div><div><label>ชื่อผู้โอน</label><input class="input" value="${order.payment_name||''}" onchange="updateOrderField('${id}','payment_name',this.value)"></div><div><label>วัน-เวลาที่โอน</label><input class="input" type="datetime-local" value="${order.payment_datetime||''}" onchange="updateOrderField('${id}','payment_datetime',this.value)"></div><div><label>ยอดโอน</label><input class="input" type="number" value="${order.payment_amount||''}" onchange="updateOrderField('${id}','payment_amount',Number(this.value||0))"></div></div></div><div class="card clean-card" style="margin-top:10px"><div class="title small-title">เพิ่ม/แก้สินค้า</div>${addProductBlock(order.id)}${itemsHtml(order,true)}${shippingControl(order)}${totalBox(order)}</div><div class="card clean-card" style="margin-top:10px"><div class="row mobile-stack"><button class="flag-btn" onclick="copyText(closeMsg('${id}','th'))">🇹🇭</button><button class="flag-btn" onclick="copyText(closeMsg('${id}','ko'))">🇰🇷</button><button class="icon-btn" onclick="saveDraftToSupabase('${id}')">💾</button><button class="tiny" onclick="exportOMS('${id}')">Export OMS</button><button class="btn3 tiny" onclick="printTrade('${id}')">거래명세서</button></div></div>`; }
function updateOrderField(id, field, value, recalc=false){ const order=db.orders.find(x=>x.id===id); if(!order) return; order[field]=value; if(recalc){ reprice(order); } else { calc(order); } save(); render(); }
function reprice(order){ order.items.forEach(it=>{const pr=product(it.product_id); it.unit_price=priceOf(pr,defaultTier(order)); it.line_total=it.unit_price*it.pack_qty;}); calc(order); }
function ship(){ const d=today(); const os=db.orders.filter(o=>o.date===d||o.delivery_date===d); const sum={}; os.forEach(o=>o.items.forEach(it=>{const pr=product(it.product_id)||{}; const k=pr.id; if(!sum[k])sum[k]={name:pr.name_th||pr.name_ko,pack:0,total:0}; sum[k].pack+=it.pack_qty; sum[k].total+=it.line_total;})); return `<div class="title">รวมยอด / OMS</div><div class="card clean-card"><div class="sub">วันนี้ ${d}</div>${Object.values(sum).map(x=>`<div class="list-item"><div style="flex:1"><b>${x.name}</b><div class="sub">${x.pack} ถุง</div></div><b>${fmt(x.total)}</b></div>`).join('')||'<div class="sub">ยังไม่มีออเดอร์วันนี้</div>'}<button class="tiny" onclick="exportOMSAll()">Export OMS ทั้งวัน</button></div>`; }
function partners(){ return `<div class="title">Partner</div><div class="card clean-card"><div class="form-grid"><div><label>ชื่อร้าน</label><input class="input" id="newPartnerName" placeholder="ชื่อร้าน / 상호"></div><div><label>Tier</label><select id="newPartnerTier">${db.tiers.map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</select></div><div><label>โทร</label><input class="input" id="newPartnerPhone"></div><div><label>ช่องทาง</label><select id="newPartnerChannel"><option value="page">Page</option><option value="kakao">Kakao</option><option value="phone">Phone</option><option value="visit">Visit</option></select></div><div><label>ที่อยู่</label><input class="input" id="newPartnerAddress"></div><div class="end"><button class="small-action" onclick="addPartner()">+ เพิ่ม Partner</button></div></div></div><div class="list" style="margin-top:10px">${db.partners.map(p=>`<div class="list-item"><div><b>${p.name}</b><div class="sub">${p.tier} · ${p.channel||'-'} · ${p.phone||''}<br>${p.address||''}</div></div></div>`).join('')}</div>`; }
function addPartner(){
  const name=document.getElementById('newPartnerName')?.value.trim(); if(!name){alert('ใส่ชื่อร้านก่อน');return;}
  const p={id:uid('pt'),name,tier:document.getElementById('newPartnerTier').value,phone:document.getElementById('newPartnerPhone').value.trim(),channel:document.getElementById('newPartnerChannel').value,address:document.getElementById('newPartnerAddress').value.trim(),credit_days:0,balance:0,biz_no:''};
  db.partners.unshift(p); save(); render();
}
function products(){ return `<div class="title">Product Master</div><div class="card clean-card"><div class="sub">สินค้า Sync อัตโนมัติจาก Supabase เมื่อเปิดระบบ</div><div class="list" style="margin-top:10px">${db.products.map(p=>`<div class="list-item"><div style="flex:1"><b>${p.name_th||p.name_ko}</b><div class="sub">${p.name_ko||''} · SKU ${p.sku||''}<br>옵션ID ${p.option_id||''} · 노출상품ID ${p.display_product_id||''}<br>${p.box_qty}/ลัง</div></div></div>`).join('')}</div></div>`; }
function settings(){ const c=cfg(); return `<div class="title">ตั้งค่า</div><div class="card clean-card"><div class="form-grid"><div><label>Supabase URL</label><input class="input" id="supUrl" value="${c.url||''}"></div><div><label>Supabase anon key</label><input class="input" id="supKey" value="${c.key||''}"></div><div><label>Tracking base URL</label><input class="input" id="trackBase" value="${c.tracking_base||''}" placeholder="https://xxxx.netlify.app"></div><div><label>ค่าส่งที่เก็บลูกค้าต่อ 1 ลัง</label><input class="input" id="custBoxFee" type="number" value="${c.customer_box_fee||0}"></div><div class="end"><button onclick="saveSettings()">บันทึกตั้งค่า</button></div></div><div class="row" style="margin-top:10px"><button class="btn-danger tiny" onclick="localStorage.removeItem(LS);location.reload()">Reset ข้อมูลทดลอง</button></div><div class="sub" style="margin-top:10px">สินค้าและ box rules จะ Sync อัตโนมัติจาก Supabase เมื่อเปิดระบบ ไม่ต้องกด Sync ทีละเครื่อง</div></div>`; }
function saveSettings(){ saveCfg({url:document.getElementById('supUrl').value.trim(),key:document.getElementById('supKey').value.trim(),tracking_base:document.getElementById('trackBase').value.trim(),customer_box_fee:Number(document.getElementById('custBoxFee').value||0)}); db.orders.forEach(o=>{o.customer_box_fee=Number(cfg().customer_box_fee||0); calc(o)}); save(); alert('บันทึกแล้ว'); autoSyncAll(true); render(); }
function supa(){ const c=cfg(); if(!c.url||!c.key) return null; return supabase.createClient(c.url,c.key); }
async function syncProductOption(silent=false){ const client=supa(); if(!client){ if(!silent) alert('ใส่ Supabase URL และ anon key ในตั้งค่าก่อน'); return; } let res=await client.from('v_product_options').select('*').limit(500); if(res.error){ res=await client.from('product_option').select('*').eq('active',true).limit(500); }
  if(res.error){ if(!silent) alert('Sync สินค้าไม่ได้: '+res.error.message); return; } db.products=(res.data||[]).map(normProduct); save(); if(!silent) alert('Sync สินค้าแล้ว '+db.products.length+' รายการ'); if(!silent) render(); }
async function syncBoxRules(silent=false){ const client=supa(); if(!client){ if(!silent) alert('ใส่ Supabase URL และ anon key ในตั้งค่าก่อน'); return; } const {data,error}=await client.from('v_box_rules').select('*').limit(500); if(error){ if(!silent) alert('Sync v_box_rules ไม่ได้: '+error.message); return; } db.box_rules=(data||[]).map(r=>({method:r.method||r.delivery_method||'',max_weight_kg:Number(r.max_weight_kg||r.to_weight_kg||r.weight_to||9999),shipping_fee:Number(r.shipping_fee||r.fee||r.price||r.per_box_fee||0)})); save(); if(!silent) alert('Sync v_box_rules แล้ว '+db.box_rules.length+' rule'); if(!silent) render(); }
function thaiNameFromRow(r){
  const raw=[r.product_name_th,r.name_th,r.thai_name].find(Boolean); if(raw) return raw;
  const hay=String([r.sku,r.option_id,r.product_name,r.product_name_ko,r.name_ko,r.product_name_kr].filter(Boolean).join(' ')).toLowerCase();
  if(hay.includes('muyo')||hay.includes('여우')||hay.includes('หมูยอ')) return 'หมูยอ 700g';
  if(hay.includes('cart')||hay.includes('3호')||hay.includes('เอ็น')) return 'ลูกชิ้นเอ็นไก่ 1kg';
  if(hay.includes('mix')||hay.includes('2호')||hay.includes('หมู+ไก')) return 'ลูกชิ้นหมู+ไก่ 1kg';
  if(hay.includes('700')) return 'ลูกชิ้นหมูพรีเมียม 700g';
  if(hay.includes('280')) return 'ลูกชิ้นหมูพรีเมียม 280g';
  if(hay.includes('pork')||hay.includes('돼지')||hay.includes('pig')) return 'ลูกชิ้นหมูพรีเมียม 1kg';
  return r.product_name||r.name||r.sku||'';
}
function normProduct(r){ const base=Number(r.box_qty||r.pack_per_box||r.packs_per_box||1)||1; const retail=Number(r.tier_retail||r.retail_price||r.retail||r.price||0)||0; const restaurant=Number(r.tier_restaurant||r.restaurant_price||r.restaurant||r.partner_price||retail)||retail; const mart=Number(r.tier_mart||r.mart_price||r.mart||restaurant)||restaurant; const wholesale=Number(r.tier_wholesale||r.wholesale_price||r.wholesale||mart)||mart; const vip=Number(r.tier_vip||r.vip_price||r.vip||wholesale)||wholesale; return {id:String(r.id||r.option_id||r.sku),sku:r.sku||r.product_sku||'',option_id:r.option_id||r.coupang_option_id||'',display_product_id:r.display_product_id||r.exposed_product_id||r.nochul_product_id||'',name_th:thaiNameFromRow(r),name_ko:r.product_name_ko||r.name_ko||r.product_name_kr||r.product_name||r.sku||'',box_qty:base,weight_kg:Number(r.weight_kg||r.weight||r.unit_weight_kg||0)||0,prices:{retail,restaurant,mart,wholesale,vip},raw:r}; }
async function saveDraftToSupabase(id){ const order=db.orders.find(x=>x.id===id); const client=supa(); if(!client){ alert('ยังไม่ได้ตั้งค่า Supabase'); return; } calc(order); const payload={local_id:order.id,order_no:order.no,order_date:order.date,status:order.status,partner_id:order.partner_id||null,payment_status:order.payment_status,delivery_date:order.delivery_date||null,delivery_method:order.delivery_method||'parcel',subtotal:order.subtotal||0,shipping_fee:order.shipping_fee||0,total:order.total||0,weight_kg:order.weight_kg||0,shipping_mode:order.shipping_mode||'free',shipping_boxes:order.shipping_boxes||0,customer_box_fee:order.customer_box_fee||0,payment_name:order.payment_name||null,payment_datetime:order.payment_datetime||null,payment_amount:order.payment_amount||0,items:order.items}; const {error}=await client.from('khokai_partner_orders').upsert(payload,{onConflict:'order_no'}); if(error){ alert('บันทึก Supabase ไม่ได้: '+error.message+'\nให้รัน supabase/schema.sql เวอร์ชันใหม่ก่อน'); return; } alert('บันทึกออเดอร์ชั่วคราวแล้ว'); }
function csvCell(v){ return '"'+String(v??'').replace(/"/g,'""')+'"'; }
function download(name,rows){ const csv=rows.map(r=>r.map(csvCell).join(',')).join('\n'); const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); }
function omsRows(os){ const rows=[['order_no','partner','delivery_date','sku','option_id','display_product_id','product_name','sell_unit','qty','pack_qty','unit_price','amount','shipping_fee','delivery_method','tracking_url']]; os.forEach(order=>order.items.forEach(it=>{const pr=product(it.product_id)||{}; rows.push([order.no,partner(order.partner_id)?.name||'',order.delivery_date||'',pr.sku||'',pr.option_id||'',pr.display_product_id||'',pr.name_ko||pr.name_th,it.sell_unit,it.qty,it.pack_qty,it.unit_price,it.line_total,order.shipping_fee||0,order.delivery_method||'parcel',trackingLink(order)]);})); return rows; }
function exportOMS(id){ const order=db.orders.find(x=>x.id===id); download(order.no+'_OMS.csv', omsRows([order])); }
function exportOMSAll(){ download('OMS_'+today()+'.csv', omsRows(db.orders.filter(o=>o.date===today()||o.delivery_date===today()))); }
function printTrade(id){ alert('거래명세서 print จะใส่ต่อหลัง OMS stable'); }
async function autoSyncAll(force=false){ if(App.syncing) return; const c=cfg(); if(!c.url||!c.key) return; const last=Number(localStorage.getItem('khokai_partner_last_sync')||0); if(!force && Date.now()-last<1000*60*10) return; App.syncing=true; try{ await syncProductOption(true); await syncBoxRules(true); localStorage.setItem('khokai_partner_last_sync', String(Date.now())); }catch(e){ console.warn(e); } App.syncing=false; }
autoSyncAll(false).then(()=>render());
render();
