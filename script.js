const products = [
  {id:1,name:"Golden Dusk",notes:"Amber, vanilla, sandalwood",price:2499,color:"#ff9a3c"},
  {id:2,name:"Rose Horizon",notes:"Damask rose, peony, musk",price:2799,color:"#e0457b"},
  {id:3,name:"Violet Night",notes:"Lavender, iris, patchouli",price:2999,color:"#8a4fff"},
  {id:4,name:"Ember Sky",notes:"Saffron, oud, cinnamon",price:3499,color:"#d9452b"},
  {id:5,name:"Ocean Twilight",notes:"Sea salt, citrus, cedar",price:2299,color:"#2fa3c7"},
  {id:6,name:"Jasmine Glow",notes:"Jasmine, neroli, white tea",price:2599,color:"#e8c547"}
];
const load = k => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch(e){ return []; } };
const save = (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };
let cart = load("tw_cart"), wish = load("tw_wish");
const $ = id => document.getElementById(id);
const rs = n => "₹" + n.toLocaleString("en-IN");
const bottle = c => `<div class="bottle" style="--liquid:${c}"><i class="cap"></i><i class="neck"></i><div class="body"><b></b></div></div>`;

function show(page){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  $(page).classList.add("active");
  $("nav").classList.toggle("hidden", page === "register");
  window.scrollTo(0,0);
  if(page==="wishlist") renderWish();
  if(page==="cart") renderCart();
}
document.addEventListener("click", e => {
  const t = e.target.closest("[data-page]");
  if(t) show(t.dataset.page);
});

$("regForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("rName").value.trim();
  if(!name || $("rPass").value.length < 6){ $("rMsg").textContent = "Please fill all fields correctly."; return; }
  $("rMsg").textContent = "Welcome, " + name + "!";
  setTimeout(() => show("home"), 700);
});

function counts(){
  $("cCount").textContent = cart.reduce((s,i)=>s+i.qty,0);
  $("wCount").textContent = wish.length;
}
function renderProducts(){
  $("grid").innerHTML = products.map(p => `
    <div class="card product">${bottle(p.color)}
      <h3>${p.name}</h3><p>${p.notes}</p>
      <div class="price">${rs(p.price)}</div>
      <div class="actions">
        <button class="btn" onclick="addCart(${p.id})">Add to Cart</button>
        <button class="btn" onclick="toggleWish(${p.id})">${wish.includes(p.id) ? "♥" : "♡"}</button>
      </div></div>`).join("");
}
function addCart(id){
  const it = cart.find(i => i.id===id);
  it ? it.qty++ : cart.push({id,qty:1});
  save("tw_cart",cart); counts();
}
function toggleWish(id){
  wish = wish.includes(id) ? wish.filter(w=>w!==id) : [...wish,id];
  save("tw_wish",wish); counts(); renderProducts();
  if($("wishlist").classList.contains("active")) renderWish();
}
function renderWish(){
  $("wList").innerHTML = wish.length ? wish.map(id => {
    const p = products.find(x=>x.id===id);
    return `<div class="card item"><span>${p.name} — ${rs(p.price)}</span>
      <span><button class="btn" onclick="addCart(${id})">Add to Cart</button>
      <button class="btn" onclick="toggleWish(${id})">Remove</button></span></div>`;
  }).join("") : `<p class="empty">Your wishlist is empty.</p>`;
}
function changeQty(id,d){
  const it = cart.find(i=>i.id===id); it.qty += d;
  if(it.qty<=0) cart = cart.filter(i=>i.id!==id);
  save("tw_cart",cart); counts(); renderCart();
}
function renderCart(){
  $("cList").innerHTML = cart.length ? cart.map(i => {
    const p = products.find(x=>x.id===i.id);
    return `<div class="card item"><span>${p.name} — ${rs(p.price)}</span>
      <span><button class="btn" onclick="changeQty(${i.id},-1)">−</button> ${i.qty}
      <button class="btn" onclick="changeQty(${i.id},1)">+</button></span>
      <span>${rs(p.price*i.qty)}</span></div>`;
  }).join("") : `<p class="empty">Your cart is empty.</p>`;
  const sum = cart.reduce((s,i)=>s+products.find(x=>x.id===i.id).price*i.qty,0);
  $("total").textContent = cart.length ? "Total: " + rs(sum) : "";
}
renderProducts(); counts();
