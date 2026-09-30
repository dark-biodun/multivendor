import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, Bell, Bike, Box, CheckCircle2, ChevronRight, Clock3,
  CreditCard, LayoutDashboard, LogOut, MapPin, Menu, PackageCheck,
  Plus, Search, Settings, ShoppingBag, Store, Truck, UserRound, Wallet,
  X, Users, BarChart3, ShieldCheck, CircleDollarSign, Star, Filter,
  Navigation, Phone, Eye, MoreHorizontal
} from "lucide-react";
import "./styles.css";

const DEMO_KEY = "flowing_platform_v1";

const seed = {
  user: { id:"u1", name:"Demo Customer", email:"customer@demo.local", role:"customer", phone:"+234 800 000 0000", address:"Lekki Phase 1, Lagos" },
  merchants: [
    {id:"m1", name:"Fresh Basket Market", type:"Supermarket", rating:4.8, delivery:900, eta:"25–35 min", color:"#e8f8ed"},
    {id:"m2", name:"Mama's Kitchen", type:"Restaurant", rating:4.7, delivery:700, eta:"20–30 min", color:"#fff3e8"},
    {id:"m3", name:"TechHub Store", type:"Electronics", rating:4.6, delivery:1200, eta:"35–50 min", color:"#eef2ff"}
  ],
  products: [
    {id:"p1", merchantId:"m1", name:"Premium Rice 5kg", category:"Groceries", price:18500, stock:42, image:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80"},
    {id:"p2", merchantId:"m1", name:"Fresh Eggs — 30 Pack", category:"Groceries", price:7200, stock:25, image:"https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80"},
    {id:"p3", merchantId:"m2", name:"Jollof Rice & Chicken", category:"Meals", price:6500, stock:100, image:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80"},
    {id:"p4", merchantId:"m2", name:"Beef Burger", category:"Meals", price:5500, stock:80, image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80"},
    {id:"p5", merchantId:"m3", name:"Wireless Earbuds", category:"Electronics", price:28500, stock:18, image:"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80"},
    {id:"p6", merchantId:"m3", name:"Fast Charger 33W", category:"Electronics", price:12500, stock:31, image:"https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80"}
  ],
  orders: [
    {id:"ORD-1048", customer:"Demo Customer", merchant:"Fresh Basket Market", rider:"Ibrahim A.", total:27400, status:"Out for delivery", payment:"Paid", time:"Today, 4:15 PM", address:"Lekki Phase 1, Lagos"},
    {id:"ORD-1047", customer:"Ada N.", merchant:"Mama's Kitchen", rider:"—", total:12800, status:"Preparing", payment:"Paid", time:"Today, 4:02 PM", address:"Ikoyi, Lagos"},
    {id:"ORD-1046", customer:"Tunde O.", merchant:"TechHub Store", rider:"David K.", total:28500, status:"Delivered", payment:"Paid", time:"Today, 2:41 PM", address:"Yaba, Lagos"}
  ],
  notifications: [
    {id:1,text:"Your order ORD-1048 is out for delivery.",time:"8 min ago",read:false},
    {id:2,text:"Payment of ₦27,400 was successful.",time:"20 min ago",read:false}
  ]
};

function loadState(){
  try { return JSON.parse(localStorage.getItem(DEMO_KEY)) || seed; } catch { return seed; }
}
function saveState(s){ localStorage.setItem(DEMO_KEY, JSON.stringify(s)); }
function money(n){ return new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(n); }
function uid(prefix="ID"){ return `${prefix}-${Math.floor(1000+Math.random()*9000)}`; }

const navByRole = {
  customer:[["home","Discover",Store],["orders","Orders",PackageCheck],["wallet","Wallet",Wallet]],
  merchant:[["merchant","Overview",LayoutDashboard],["merchant-orders","Orders",Box],["inventory","Inventory",ShoppingBag]],
  rider:[["rider","Dashboard",Bike],["deliveries","Deliveries",Truck],["earnings","Earnings",Wallet]],
  admin:[["admin","Overview",LayoutDashboard],["users","Users",Users],["merchants","Merchants",Store],["admin-orders","Orders",Box],["analytics","Analytics",BarChart3]]
};

function App(){
  const [state,setState] = useState(loadState);
  const [role,setRole] = useState("customer");
  const [page,setPage] = useState("home");
  const [cart,setCart] = useState([]);
  const [toast,setToast] = useState("");
  const [mobileNav,setMobileNav] = useState(false);

  useEffect(()=>saveState(state),[state]);
  useEffect(()=>{ if(toast){const t=setTimeout(()=>setToast(""),2600);return()=>clearTimeout(t)}},[toast]);

  function notify(msg){setToast(msg);}
  function switchRole(r){
    setRole(r);
    const p = navByRole[r][0][0];
    setPage(p);
    setMobileNav(false);
  }
  function addToCart(product){
    setCart(c=>{
      const found=c.find(x=>x.id===product.id);
      return found ? c.map(x=>x.id===product.id?{...x,qty:x.qty+1}:x) : [...c,{...product,qty:1}];
    });
    notify(`${product.name} added to cart`);
  }
  function placeOrder(){
    if(!cart.length) return;
    const subtotal=cart.reduce((a,p)=>a+p.price*p.qty,0);
    const delivery=900;
    const order={id:uid("ORD"),customer:state.user.name,merchant:state.merchants.find(m=>m.id===cart[0].merchantId)?.name||"Merchant",rider:"Awaiting assignment",total:subtotal+delivery,status:"Order placed",payment:"Paid",time:"Just now",address:state.user.address};
    setState(s=>({...s,orders:[order,...s.orders],notifications:[{id:Date.now(),text:`Order ${order.id} has been placed successfully.`,time:"Just now",read:false},...s.notifications]}));
    setCart([]);
    notify(`Order ${order.id} placed successfully`);
    setPage("orders");
  }

  return <div className="app-shell">
    <Header state={state} role={role} cart={cart} onRole={switchRole} onPage={setPage} onMobile={()=>setMobileNav(!mobileNav)} />
    <div className="workspace">
      <Sidebar role={role} page={page} setPage={setPage} mobile={mobileNav} close={()=>setMobileNav(false)} />
      <main className="main">
        {role==="customer" && <Customer page={page} state={state} cart={cart} addToCart={addToCart} setCart={setCart} placeOrder={placeOrder} notify={notify} setPage={setPage}/>}
        {role==="merchant" && <Merchant page={page} state={state} setState={setState} notify={notify}/>}
        {role==="rider" && <Rider page={page} state={state} setState={setState} notify={notify}/>}
        {role==="admin" && <Admin page={page} state={state} setState={setState} notify={notify}/>}
      </main>
    </div>
    {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
  </div>
}

function Header({state,role,cart,onRole,onPage,onMobile}){
  const unread=state.notifications.filter(n=>!n.read).length;
  return <header className="topbar">
    <button className="icon-btn mobile-menu" onClick={onMobile}><Menu/></button>
    <div className="brand" onClick={()=>onPage(navByRole[role][0][0])}><span className="brand-mark">F</span><span>flowing</span></div>
    <div className="top-search"><Search size={18}/><input placeholder={role==="customer"?"Search stores, products, meals...":"Search anything..."}/></div>
    <div className="top-actions">
      <button className="icon-btn notification"><Bell size={19}/>{unread>0&&<b>{unread}</b>}</button>
      {role==="customer" && <button className="cart-button" onClick={()=>onPage("cart")}><ShoppingBag size={18}/><span>{cart.reduce((a,x)=>a+x.qty,0)}</span></button>}
      <select value={role} onChange={e=>onRole(e.target.value)} className="role-switch">
        <option value="customer">Customer</option><option value="merchant">Merchant</option><option value="rider">Rider</option><option value="admin">Admin</option>
      </select>
      <div className="avatar">{state.user.name.slice(0,1)}</div>
    </div>
  </header>
}

function Sidebar({role,page,setPage,mobile,close}){
  return <aside className={`sidebar ${mobile?"open":""}`}>
    <div className="sidebar-head">WORKSPACE <button className="icon-btn close-side" onClick={close}><X size={17}/></button></div>
    {navByRole[role].map(([id,label,Icon])=><button key={id} className={`nav-item ${page===id?"active":""}`} onClick={()=>{setPage(id);close()}}><Icon size={18}/><span>{label}</span></button>)}
    <div className="side-divider"/>
    <button className="nav-item" onClick={()=>setPage("notifications")}><Bell size={18}/><span>Notifications</span></button>
    <button className="nav-item"><Settings size={18}/><span>Settings</span></button>
    <div className="sidebar-bottom"><ShieldCheck size={17}/><span>Secure platform</span></div>
  </aside>
}

function Customer({page,state,cart,addToCart,setCart,placeOrder,notify,setPage}){
  if(page==="orders") return <CustomerOrders state={state} setPage={setPage}/>;
  if(page==="wallet") return <WalletPage state={state}/>;
  if(page==="cart") return <Cart cart={cart} setCart={setCart} placeOrder={placeOrder}/>;
  if(page==="notifications") return <Notifications state={state}/>;
  return <CustomerHome state={state} addToCart={addToCart} setPage={setPage}/>;
}

function CustomerHome({state,addToCart,setPage}){
  const [query,setQuery]=useState("");
  const products=state.products.filter(p=>p.name.toLowerCase().includes(query.toLowerCase())||p.category.toLowerCase().includes(query.toLowerCase()));
  return <div>
    <section className="hero">
      <div><span className="eyebrow">DELIVERY ACROSS NIGERIA</span><h1>Everything you need,<br/><em>flowing to you.</em></h1><p>Shop groceries, meals and everyday essentials from trusted local merchants.</p><button className="primary-btn" onClick={()=>document.getElementById("products")?.scrollIntoView({behavior:"smooth"})}>Start shopping <ArrowRight size={17}/></button></div>
      <div className="hero-art"><div className="hero-circle"><Truck size={86}/></div><span className="float-card one"><Clock3/> 25–35 min</span><span className="float-card two"><ShieldCheck/> Secure payments</span></div>
    </section>
    <div className="section-head"><div><span className="eyebrow">DISCOVER</span><h2>Popular stores</h2></div><button className="text-btn">View all <ChevronRight size={16}/></button></div>
    <div className="merchant-grid">{state.merchants.map(m=><div className="merchant-card" key={m.id} style={{"--merchant-bg":m.color}}><div className="merchant-logo"><Store/></div><div><h3>{m.name}</h3><p>{m.type}</p><div className="meta"><span><Star size={13} fill="currentColor"/> {m.rating}</span><span><Clock3 size={13}/> {m.eta}</span></div></div></div>)}</div>
    <div className="section-head products-head" id="products"><div><span className="eyebrow">SHOP</span><h2>Recommended for you</h2></div><div className="inline-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products"/></div></div>
    <div className="product-grid">{products.map(p=><ProductCard key={p.id} p={p} merchant={state.merchants.find(m=>m.id===p.merchantId)} add={addToCart}/>)}</div>
  </div>
}

function ProductCard({p,merchant,add}){
  return <article className="product-card"><div className="product-image"><img src={p.image} alt=""/><button className="quick-add" onClick={()=>add(p)}><Plus size={18}/></button></div><div className="product-body"><span className="category">{p.category}</span><h3>{p.name}</h3><p className="merchant-name">{merchant?.name}</p><div className="product-bottom"><strong>{money(p.price)}</strong><span className="rating"><Star size={13} fill="currentColor"/> 4.8</span></div></div></article>
}

function Cart({cart,setCart,placeOrder}){
  const subtotal=cart.reduce((a,p)=>a+p.price*p.qty,0), delivery=cart.length?900:0;
  return <div className="page"><PageTitle eyebrow="CHECKOUT" title="Your cart" sub={`${cart.reduce((a,p)=>a+p.qty,0)} item(s) ready for checkout`}/>
    {!cart.length?<Empty icon={ShoppingBag} title="Your cart is empty" text="Add products from the marketplace to get started."/>:
    <div className="checkout-grid"><div className="panel cart-list">{cart.map(p=><div className="cart-row" key={p.id}><img src={p.image}/><div className="grow"><h3>{p.name}</h3><span>{money(p.price)}</span></div><div className="qty"><button onClick={()=>setCart(c=>c.map(x=>x.id===p.id?{...x,qty:Math.max(1,x.qty-1)}:x))}>−</button><b>{p.qty}</b><button onClick={()=>setCart(c=>c.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x))}>+</button></div><button className="icon-btn" onClick={()=>setCart(c=>c.filter(x=>x.id!==p.id))}><X size={17}/></button></div>)}</div>
    <div className="panel summary"><h3>Order summary</h3><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Delivery</span><b>{money(delivery)}</b></div><div className="total"><span>Total</span><strong>{money(subtotal+delivery)}</strong></div><button className="primary-btn full" onClick={placeOrder}>Pay & place order <ArrowRight size={17}/></button><small><ShieldCheck size={14}/> Payments are securely processed.</small></div></div>}
  </div>
}

function CustomerOrders({state,setPage}){
  return <div className="page"><PageTitle eyebrow="CUSTOMER" title="My orders" sub="Track recent purchases and delivery progress."/>
    <div className="order-list">{state.orders.filter(o=>o.customer===state.user.name||o.customer==="Demo Customer").map(o=><div className="panel order-card" key={o.id}><div className="order-main"><div className="order-icon"><PackageCheck/></div><div><span className="muted">{o.id} · {o.time}</span><h3>{o.merchant}</h3><p>{o.address}</p></div></div><div><span className={`status ${statusClass(o.status)}`}>{o.status}</span><strong className="order-total">{money(o.total)}</strong></div><button className="secondary-btn" onClick={()=>setPage("tracking")}>Track <Navigation size={15}/></button></div>)}</div>
  </div>
}

function WalletPage({state}){return <div className="page"><PageTitle eyebrow="FINANCE" title="Wallet" sub="Manage your balance and transaction history."/><div className="stats-grid"><Stat title="Available balance" value="₦85,400" icon={Wallet}/><Stat title="This month" value="₦42,700" icon={CircleDollarSign}/><Stat title="Transactions" value="18" icon={CreditCard}/></div><div className="panel"><div className="panel-title"><h3>Recent transactions</h3><button className="secondary-btn">Add money <Plus size={15}/></button></div>{["Payment · ORD-1048","Wallet top-up","Refund · ORD-1039","Payment · ORD-1034"].map((x,i)=><div className="transaction" key={x}><div className="transaction-icon"><CreditCard/></div><div className="grow"><b>{x}</b><span>Sep {30-i}, 2026</span></div><strong className={i===1||i===2?"positive":""}>{i===1||i===2?"+":"-"}₦{[27400,50000,8200,14600][i].toLocaleString()}</strong></div>)}</div></div>}

function Notifications({state}){return <div className="page"><PageTitle eyebrow="UPDATES" title="Notifications" sub="Your latest platform activity."/><div className="panel notification-list">{state.notifications.map(n=><div className={`notification-row ${n.read?"":"unread"}`} key={n.id}><div className="notification-dot"/><div className="grow"><b>{n.text}</b><span>{n.time}</span></div></div>)}</div></div>}

function Merchant({page,state,setState,notify}){
  if(page==="merchant-orders") return <MerchantOrders state={state} setState={setState} notify={notify}/>;
  if(page==="inventory") return <Inventory state={state} setState={setState} notify={notify}/>;
  return <div className="page"><PageTitle eyebrow="MERCHANT PORTAL" title="Fresh Basket Market" sub="Manage orders, inventory and store performance."/><div className="stats-grid"><Stat title="Today's sales" value="₦284,600" delta="+18.4%" icon={CircleDollarSign}/><Stat title="Orders" value="48" delta="+12.2%" icon={Box}/><Stat title="Avg. order" value="₦7,820" icon={ShoppingBag}/><Stat title="Rating" value="4.8 / 5" icon={Star}/></div><div className="dashboard-grid"><SalesChart/><div className="panel"><div className="panel-title"><h3>Recent orders</h3><button className="text-btn">View all <ChevronRight size={15}/></button></div>{state.orders.slice(0,4).map(o=><div className="mini-order" key={o.id}><span>{o.id}</span><b>{money(o.total)}</b><span className={`status ${statusClass(o.status)}`}>{o.status}</span></div>)}</div></div></div>
}

function MerchantOrders({state,setState,notify}){return <div className="page"><PageTitle eyebrow="MERCHANT" title="Order management" sub="Process incoming orders and prepare them for pickup."/><div className="panel table-panel"><TableHead cols={["Order","Customer","Total","Status","Action"]}/>{state.orders.map(o=><div className="table-row" key={o.id}><div><b>{o.id}</b><span>{o.time}</span></div><span>{o.customer}</span><b>{money(o.total)}</b><span className={`status ${statusClass(o.status)}`}>{o.status}</span><button className="small-btn" onClick={()=>{setState(s=>({...s,orders:s.orders.map(x=>x.id===o.id?{...x,status:"Ready for pickup"}:x)}));notify(`${o.id} marked ready for pickup`)}}>Update</button></div>)}</div></div>}

function Inventory({state,setState,notify}){return <div className="page"><PageTitle eyebrow="MERCHANT" title="Inventory" sub="Monitor stock levels and product availability."/><div className="panel table-panel"><div className="panel-title"><h3>Products</h3><button className="primary-btn small"><Plus size={16}/> Add product</button></div>{state.products.map(p=><div className="table-row" key={p.id}><div className="product-mini"><img src={p.image}/><div><b>{p.name}</b><span>{p.category}</span></div></div><b>{money(p.price)}</b><span>{p.stock} units</span><span className={`status ${p.stock<10?"danger":"success"}`}>{p.stock<10?"Low stock":"In stock"}</span><button className="small-btn" onClick={()=>{setState(s=>({...s,products:s.products.map(x=>x.id===p.id?{...x,stock:x.stock+5}:x)}));notify("Inventory updated")}}>+5 stock</button></div>)}</div></div>}

function Rider({page,state,setState,notify}){if(page==="deliveries")return <RiderDeliveries state={state} setState={setState} notify={notify}/>;if(page==="earnings")return <RiderEarnings/>;return <div className="page"><PageTitle eyebrow="RIDER APP" title="Good evening, Ibrahim" sub="Stay online to receive nearby delivery requests."/><div className="rider-online panel"><div><div className="live-dot"/> <b>You are online</b><p>Accepting delivery requests in Lekki.</p></div><button className="toggle on">ON</button></div><div className="stats-grid"><Stat title="Today's earnings" value="₦18,450" icon={Wallet}/><Stat title="Deliveries" value="9" icon={Truck}/><Stat title="Distance" value="42.6 km" icon={Navigation}/></div><div className="panel request-card"><div className="request-top"><span className="status warning">NEW REQUEST</span><span>1.8 km away</span></div><h2>Fresh Basket Market → Lekki Phase 1</h2><p><MapPin size={16}/> 12 Admiralty Way, Lekki Phase 1</p><div className="request-price"><strong>₦2,200</strong><span>Estimated earnings</span></div><div className="action-row"><button className="secondary-btn">Reject</button><button className="primary-btn" onClick={()=>notify("Delivery accepted")}>Accept delivery <ArrowRight size={16}/></button></div></div></div>}

function RiderDeliveries({state,setState,notify}){return <div className="page"><PageTitle eyebrow="RIDER" title="Deliveries" sub="Your active and completed delivery jobs."/><div className="order-list">{state.orders.map(o=><div className="panel order-card" key={o.id}><div className="order-main"><div className="order-icon"><Truck/></div><div><span className="muted">{o.id}</span><h3>{o.merchant}</h3><p>{o.address}</p></div></div><span className={`status ${statusClass(o.status)}`}>{o.status}</span><button className="small-btn" onClick={()=>{setState(s=>({...s,orders:s.orders.map(x=>x.id===o.id?{...x,status:"Delivered"}:x)}));notify(`${o.id} marked delivered`)}}>Mark delivered</button></div>)}</div>}

function RiderEarnings(){return <div className="page"><PageTitle eyebrow="RIDER" title="Earnings" sub="Track your delivery income and withdrawals."/><div className="stats-grid"><Stat title="Available wallet" value="₦64,850" icon={Wallet}/><Stat title="This week" value="₦92,450" icon={CircleDollarSign}/><Stat title="This month" value="₦284,300" icon={BarChart3}/></div><div className="panel"><div className="panel-title"><h3>Earnings history</h3><button className="secondary-btn">Withdraw <ArrowRight size={15}/></button></div>{["ORD-1048","ORD-1045","ORD-1041","ORD-1038"].map((id,i)=><div className="transaction" key={id}><div className="transaction-icon"><Truck/></div><div className="grow"><b>Delivery {id}</b><span>Sep {30-i}, 2026</span></div><strong className="positive">+₦{[2200,1800,2600,1950][i].toLocaleString()}</strong></div>)}</div></div>}

function Admin({page,state,setState,notify}){if(page==="users")return <AdminUsers state={state}/>;if(page==="merchants")return <AdminMerchants state={state} notify={notify}/>;if(page==="admin-orders")return <AdminOrders state={state}/>;if(page==="analytics")return <Analytics/>;return <div className="page"><PageTitle eyebrow="ADMIN CONTROL CENTER" title="Platform overview" sub="Monitor users, merchants, deliveries and financial performance."/><div className="stats-grid admin-stats"><Stat title="Total users" value="84,291" delta="+9.4%" icon={Users}/><Stat title="Merchants" value="1,284" delta="+4.8%" icon={Store}/><Stat title="Orders today" value="3,842" delta="+16.2%" icon={Box}/><Stat title="Revenue today" value="₦28.4m" delta="+21.8%" icon={CircleDollarSign}/></div><div className="dashboard-grid"><SalesChart title="Platform revenue"/><div className="panel"><div className="panel-title"><h3>Live operations</h3><span className="status success">LIVE</span></div>{[["Active riders","428"],["Pending merchants","37"],["Active deliveries","186"],["Support tickets","24"]].map(([a,b])=><div className="metric-row" key={a}><span>{a}</span><strong>{b}</strong></div>)}</div></div><div className="panel"><div className="panel-title"><h3>Recent platform orders</h3><button className="text-btn">Export CSV</button></div>{state.orders.map(o=><div className="table-row" key={o.id}><b>{o.id}</b><span>{o.merchant}</span><span>{o.customer}</span><b>{money(o.total)}</b><span className={`status ${statusClass(o.status)}`}>{o.status}</span></div>)}</div></div>}

function AdminUsers(){return <div className="page"><PageTitle eyebrow="ADMIN" title="User management" sub="Search, inspect and control customer accounts."/><div className="panel table-panel"><TableHead cols={["User","Email","Role","Status",""]}/>{["Amina Yusuf","Chinedu Okafor","Daniel James","Fatima Bello","Tunde Oladipo"].map((n,i)=><div className="table-row" key={n}><div><b>{n}</b><span>Joined Sep {20-i}, 2026</span></div><span>{n.toLowerCase().replace(" ",".")}@example.com</span><span>Customer</span><span className="status success">Active</span><button className="icon-btn"><MoreHorizontal size={18}/></button></div>)}</div></div>}

function AdminMerchants({state,notify}){return <div className="page"><PageTitle eyebrow="ADMIN" title="Merchant management" sub="Review merchant applications and configure commissions."/><div className="merchant-admin-grid">{state.merchants.map(m=><div className="panel merchant-admin" key={m.id}><div className="merchant-logo"><Store/></div><div className="grow"><h3>{m.name}</h3><p>{m.type} · ★ {m.rating}</p></div><span className="status success">Approved</span><button className="small-btn" onClick={()=>notify(`Opening ${m.name}`)}>Manage</button></div>)}</div></div>}

function AdminOrders({state}){return <div className="page"><PageTitle eyebrow="ADMIN" title="All orders" sub="Monitor order lifecycle and active deliveries."/><div className="panel table-panel"><TableHead cols={["Order","Merchant","Customer","Total","Status"]}/>{state.orders.map(o=><div className="table-row" key={o.id}><b>{o.id}</b><span>{o.merchant}</span><span>{o.customer}</span><b>{money(o.total)}</b><span className={`status ${statusClass(o.status)}`}>{o.status}</span></div>)}</div></div>}

function Analytics(){return <div className="page"><PageTitle eyebrow="ADMIN" title="Analytics & reports" sub="Revenue, order, user and delivery performance."/><div className="stats-grid"><Stat title="GMV this month" value="₦842.6m" delta="+18.9%" icon={CircleDollarSign}/><Stat title="Completed orders" value="94,281" delta="+14.2%" icon={CheckCircle2}/><Stat title="Active customers" value="62,480" delta="+8.1%" icon={Users}/><Stat title="Avg. delivery" value="34 min" delta="-6.4%" icon={Clock3}/></div><SalesChart title="Revenue trend"/><div className="panel"><div className="panel-title"><h3>Performance breakdown</h3><button className="secondary-btn"><Filter size={15}/> Filters</button></div>{["Lagos","Abuja","Port Harcourt","Ibadan","Benin City"].map((x,i)=><div className="metric-row" key={x}><span>{x}</span><div className="bar"><i style={{width:`${92-i*14}%`}}/></div><b>{[38,22,15,11,8][i]}%</b></div>)}</div></div>}

function SalesChart({title="Sales overview"}){const points=[28,45,38,62,55,73,68,86,79,94,82,100];return <div className="panel chart-panel"><div className="panel-title"><div><h3>{title}</h3><span className="muted">Last 30 days</span></div><select><option>Monthly</option><option>Weekly</option></select></div><div className="chart">{points.map((p,i)=><div className="chart-col" key={i}><div className="chart-bar" style={{height:`${p}%`}}/><span>{i+1}</span></div>)}</div></div>}

function Stat({title,value,delta,icon:Icon}){return <div className="panel stat-card"><div className="stat-icon"><Icon size={19}/></div><div><span>{title}</span><strong>{value}</strong>{delta&&<small className={delta.startsWith("-")?"down":""}>{delta} vs last period</small>}</div></div>}
function PageTitle({eyebrow,title,sub}){return <div className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{sub}</p></div>}
function TableHead({cols}){return <div className="table-head">{cols.map(c=><span key={c}>{c}</span>)}</div>}
function Empty({icon:Icon,title,text}){return <div className="empty panel"><Icon size={40}/><h3>{title}</h3><p>{text}</p></div>}
function statusClass(s){return s?.toLowerCase().includes("deliver")?"success":s?.toLowerCase().includes("prepar")||s?.toLowerCase().includes("placed")?"warning":"info";}

createRoot(document.getElementById("root")).render(<App/>);
