import { useState, useEffect, useRef, useCallback, memo } from "react";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════ */
const T = {
  green:"#3a9e3f", greenDark:"#2d7d32", greenLight:"#e8f5e9",
  amber:"#f59e0b", navy:"#0f172a", navyMid:"#1e293b",
  white:"#ffffff", gray50:"#f8fafc", gray100:"#f1f5f9", gray200:"#e2e8f0",
  gray300:"#cbd5e1", gray400:"#94a3b8", gray500:"#64748b", gray700:"#334155",
  pink:"#ec4899", red:"#ef4444", purple:"#7c3aed", purpleDark:"#6d28d9",
};
const shadow = {
  xs:"0 1px 4px rgba(0,0,0,0.06)", sm:"0 2px 10px rgba(0,0,0,0.07)",
  md:"0 4px 20px rgba(0,0,0,0.10)", lg:"0 8px 32px rgba(0,0,0,0.13)",
  xl:"0 16px 48px rgba(0,0,0,0.16)", green:"0 4px 16px rgba(58,158,63,0.38)",
  purple:"0 4px 20px rgba(124,58,237,0.42)",
};

/* ═══════════════════════════════════════════════════════════
   REAL FOOD IMAGES  — direct Wikimedia/public domain URLs
   All serve over HTTPS with permissive CORS headers
═══════════════════════════════════════════════════════════ */
const IMG = {
  hero:       "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1280px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
  chowder:    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Creamy_corn_chowder.jpg/640px-Creamy_corn_chowder.jpg",
  suyaRibs:   "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Suya_on_skewers.jpg/640px-Suya_on_skewers.jpg",
  burger:     "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/240px-PNG_transparency_demonstration_1.png",
  adalu:      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Baked_beans_in_tomato_sauce_-_stonesoup.jpg/640px-Baked_beans_in_tomato_sauce_-_stonesoup.jpg",
  plantain:   "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Platano_maduro_frito.jpg/640px-Platano_maduro_frito.jpg",
  papAkara:   "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Akara_balls.jpg/640px-Akara_balls.jpg",
  iceCream:   "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ice_cream_with_whipped_cream%2C_chocolate_syrup%2C_and_a_wafer_%28cropped%29.jpg/640px-Ice_cream_with_whipped_cream%2C_chocolate_syrup%2C_and_a_wafer_%28cropped%29.jpg",
  sundae:     "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Banana_Split.jpg/640px-Banana_Split.jpg",
  lemonade:   "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Lemonade_and_slice_of_lemon.jpg/640px-Lemonade_and_slice_of_lemon.jpg",
  cocktail:   "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Cocktail_of_the_restaurant_%22Em_Chhung%22_Kampot%2C_Cambodia.jpg/640px-Cocktail_of_the_restaurant_%22Em_Chhung%22_Kampot%2C_Cambodia.jpg",
  shrimp:     "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Roasted_shrimp.jpg/640px-Roasted_shrimp.jpg",
  tacos:      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg/640px-001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg",
  catStarters:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat_03.jpg/640px-Cat_03.jpg",
  catMains:   "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/640px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
  catDessert: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Banana_Split.jpg/640px-Banana_Split.jpg",
  catDrinks:  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Lemonade_and_slice_of_lemon.jpg/640px-Lemonade_and_slice_of_lemon.jpg",
  avatar:     "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Gatto_europeo4.jpg/640px-Gatto_europeo4.jpg",
  restaurant: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Restaurant_2014_ubt.JPG/640px-Restaurant_2014_ubt.JPG",
  invite:     "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/640px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
};

// We'll use the TheMealDB free API to get real food images dynamically
// and fall back to curated direct-link images from imgix/foodish

const FOOD_IMAGES = {
  chowder:  "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  suyaRibs: "https://www.themealdb.com/images/media/meals/utxryw1511721587.jpg",
  burger:   "https://www.themealdb.com/images/media/meals/n3xxd91598732796.jpg",
  adalu:    "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  plantain: "https://www.themealdb.com/images/media/meals/1550441882.jpg",
  papAkara: "https://www.themealdb.com/images/media/meals/sxysrt1468240488.jpg",
  iceCream: "https://www.themealdb.com/images/media/meals/tqtywx1468312429.jpg",
  sundae:   "https://www.themealdb.com/images/media/meals/1548772327.jpg",
  lemonade: "https://www.themealdb.com/images/media/meals/uuuspp1511297945.jpg",
  cocktail: "https://www.themealdb.com/images/media/meals/1550441882.jpg",
  shrimp:   "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  tacos:    "https://www.themealdb.com/images/media/meals/n3xxd91598732796.jpg",
  hero:     "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg",
  restaurant:"https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  catStarters:"https://www.themealdb.com/images/media/meals/sxysrt1468240488.jpg",
  catMains:   "https://www.themealdb.com/images/media/meals/n3xxd91598732796.jpg",
  catDessert: "https://www.themealdb.com/images/media/meals/tqtywx1468312429.jpg",
  catDrinks:  "https://www.themealdb.com/images/media/meals/uuuspp1511297945.jpg",
  avatar:     "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg",
  invite:     "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
};

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const MENU = [
  { id:1,  name:"Golden Corn Chowder",          price:4500, desc:"Creamy sweet corn soup with russet potatoes, smoked paprika & fresh herbs.", tags:["Vegetarian","Comfort"],     cat:"starters", rating:4.7, reviews:89,  img:FOOD_IMAGES.chowder  },
  { id:2,  name:"Spicy Suya Corn Ribs",          price:3500, desc:"Fried corn ribs dusted with yaji suya spice & served with chilli dip.",      tags:["Vegan","Spicy"],           cat:"starters", rating:4.9, reviews:214, img:FOOD_IMAGES.suyaRibs },
  { id:3,  name:"Maize‑in‑the‑Corn Burger",      price:8500, desc:"Juicy beef patty topped with a crispy corn bun, jalapeño aioli & onion.",    tags:["Meat","Hearty"],           cat:"mains",    rating:4.8, reviews:176, img:FOOD_IMAGES.burger   },
  { id:4,  name:"Adalu Special (Corn & Beans)",  price:5000, desc:"A rich, savory pottage of sweet corn and black‑eyed beans in palm oil.",      tags:["Traditional","Vegetarian"],cat:"mains",    rating:4.6, reviews:132, img:FOOD_IMAGES.adalu    },
  { id:5,  name:"Lagos Roasted Plantain & Corn", price:4000, desc:"Classic roadside bole (roasted plantain) paired with spiced corn.",           tags:["Street Food","Vegan"],     cat:"mains",    rating:4.8, reviews:298, img:FOOD_IMAGES.plantain },
  { id:6,  name:"Pap & Akara Combo",             price:3000, desc:"Smooth corn pudding (Ogi) served with fluffy golden bean cakes.",             tags:["Breakfast","Traditional"], cat:"starters", rating:4.8, reviews:120, img:FOOD_IMAGES.papAkara },
  { id:7,  name:"Sweet Corn Ice Cream",          price:4000, desc:"Homemade sweet corn ice cream with caramel ribbons & crushed waffle cone.",   tags:["Sweet","Cold"],            cat:"dessert",  rating:4.9, reviews:203, img:FOOD_IMAGES.iceCream },
  { id:8,  name:"Cornfusion Sundae",             price:3500, desc:"Creamy vanilla gelato swirled with roasted corn caramel & chocolate drizzle.",tags:["Dessert","Rich"],          cat:"dessert",  rating:4.7, reviews:88,  img:FOOD_IMAGES.sundae   },
  { id:9,  name:"Corn Silk Lemonade",            price:1800, desc:"Refreshing lemonade brewed with corn silk, ginger & fresh citrus.",           tags:["Cold","Herbal"],           cat:"drinks",   rating:4.5, reviews:67,  img:FOOD_IMAGES.lemonade },
  { id:10, name:"Smoky Corn Cocktail",           price:2500, desc:"Artisan smoked corn‑infused spirit with muddled mint & citrus bitters.",      tags:["Cocktail","Smoky"],        cat:"drinks",   rating:4.6, reviews:91,  img:FOOD_IMAGES.cocktail },
  { id:11, name:"Shrimp Corn Suya",              price:7500, desc:"Grilled tiger shrimps on corn skewers with suya spice & mango salsa.",        tags:["Seafood","Spicy"],         cat:"mains",    rating:4.9, reviews:154, img:FOOD_IMAGES.shrimp   },
  { id:12, name:"Spicy Corn Tacos",              price:3200, desc:"Street‑style tacos with crispy corn tortilla, guac, pico de gallo & jalapeños.",tags:["New","Spicy"],           cat:"starters", rating:4.8, reviews:42,  img:FOOD_IMAGES.tacos    },
];

const TAG_PALETTE = {
  Vegetarian:"#16a34a",Vegan:"#15803d",Comfort:"#d97706",Spicy:"#dc2626",
  Meat:"#9f1239",Hearty:"#92400e",Traditional:"#7c3aed",Breakfast:"#0369a1",
  Sweet:"#db2777",Cold:"#0891b2",Seafood:"#0e7490","Street Food":"#b45309",
  New:"#dc2626",Cocktail:"#6d28d9",Smoky:"#374151",Herbal:"#166534",
  Rich:"#92400e",Dessert:"#be185d",
};
const CATS = ["all","starters","mains","dessert","drinks"];

/* ═══════════════════════════════════════════════════════════
   MEAL DB HOOK — fetches real meal images from TheMealDB
═══════════════════════════════════════════════════════════ */
const useMealImages = () => {
  const [meals, setMeals] = useState({});
  useEffect(() => {
    const queries = [
      {key:"hero",    q:"Beef"},
      {key:"burger",  q:"Big Mac"},
      {key:"tacos",   q:"Tacos"},
      {key:"shrimp",  q:"Prawn"},
      {key:"iceCream",q:"Ice Cream"},
      {key:"lemonade",q:"Lemonade"},
      {key:"cocktail",q:"Mojito"},
      {key:"chowder", q:"Chowder"},
      {key:"plantain",q:"Plantain"},
      {key:"sundae",  q:"Pancakes"},
    ];
    queries.forEach(async ({key, q}) => {
      try {
        const r = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`);
        const d = await r.json();
        if (d.meals?.[0]?.strMealThumb) {
          setMeals(p => ({...p, [key]: d.meals[0].strMealThumb}));
        }
      } catch {}
    });
  }, []);
  return meals;
};

/* ═══════════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  input,select,button,textarea{font-family:inherit;}
  ::-webkit-scrollbar{display:none;}
  @keyframes slideUp   {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes toastIn   {from{opacity:0;transform:translateX(-50%) translateY(-14px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes spin      {to{transform:rotate(360deg)}}
  @keyframes pulse     {0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
  @keyframes chatSlide {from{opacity:0;transform:translateY(20px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes badgePop  {0%{transform:scale(0.5)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
  @keyframes shimmer   {from{background-position:-600px 0}to{background-position:600px 0}}
  .lift{transition:transform .18s ease,box-shadow .18s ease;}
  .lift:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,0.14);}
`;

/* ═══════════════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════════════ */
const Tag = memo(({label}) => {
  const c = TAG_PALETTE[label]||T.gray500;
  return <span style={{background:c+"1a",color:c,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,whiteSpace:"nowrap",letterSpacing:"0.04em",border:`1px solid ${c}28`}}>{label}</span>;
});

const Stars = ({rating,reviews,size=11}) => (
  <div style={{display:"flex",alignItems:"center",gap:3}}>
    {[1,2,3,4,5].map(i=><span key={i} style={{fontSize:size-1,color:i<=Math.round(rating)?T.amber:T.gray200}}>★</span>)}
    <span style={{fontSize:size,fontWeight:700,color:T.gray700,marginLeft:3}}>{rating}</span>
    <span style={{fontSize:size,color:T.gray400}}>({reviews}+)</span>
  </div>
);

const Pill = memo(({label,active,onClick}) => (
  <button onClick={onClick} style={{padding:"9px 20px",borderRadius:40,fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",outline:"none",background:active?`linear-gradient(135deg,${T.green},${T.greenDark})`:T.white,color:active?T.white:T.gray500,boxShadow:active?shadow.green:shadow.xs,border:active?"none":`1.5px solid ${T.gray200}`,transform:active?"scale(1.04)":"scale(1)",transition:"all .18s ease"}}>{label.charAt(0).toUpperCase()+label.slice(1)}</button>
));

const Spinner = ({size=28,color=T.green}) => (
  <div style={{width:size,height:size,border:`3px solid ${color}28`,borderTop:`3px solid ${color}`,borderRadius:"50%",animation:"spin .75s linear infinite"}}/>
);

/* Smart image component — loads real photo, shows shimmer while loading */
const FoodImg = ({src, alt, style={}}) => {
  const [status, setStatus] = useState("loading"); // loading | loaded | error
  return (
    <div style={{position:"relative",width:"100%",height:"100%",...style}}>
      {status === "loading" && (
        <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"600px 100%",animation:"shimmer 1.4s infinite"}}/>
      )}
      {status === "error" ? (
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#1b5e20,#2d7d32)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
          <span style={{fontSize:36}}>🌽</span>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:600}}>{alt}</span>
        </div>
      ) : (
        <img
          src={src} alt={alt}
          onLoad={()=>setStatus("loaded")}
          onError={()=>setStatus("error")}
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:status==="loaded"?1:0,transition:"opacity .3s ease"}}
        />
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE HEADER
═══════════════════════════════════════════════════════════ */
const PageHeader = ({title,onBack,right,subtitle}) => (
  <div style={{background:`linear-gradient(135deg,${T.green},${T.greenDark})`,padding:"16px 20px 18px",display:"flex",alignItems:"center",gap:12,minHeight:64,boxShadow:shadow.sm,position:"sticky",top:0,zIndex:100}}>
    {onBack
      ? <button onClick={onBack} style={{background:"rgba(255,255,255,0.18)",border:"none",borderRadius:12,width:38,height:38,color:T.white,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",flexShrink:0}}>←</button>
      : <div style={{width:38}}/>}
    <div style={{flex:1,textAlign:"center"}}>
      <div style={{color:T.white,fontWeight:900,fontSize:17,letterSpacing:"-0.3px"}}>{title}</div>
      {subtitle&&<div style={{color:"rgba(255,255,255,0.65)",fontSize:11,marginTop:2}}>{subtitle}</div>}
    </div>
    {right||<div style={{width:38}}/>}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MENU CARD
═══════════════════════════════════════════════════════════ */
const MenuCard = memo(({item,onAdd,liked,onLike,liveImg}) => {
  const [pressed,setPressed]=useState(false);
  const src = liveImg || item.img;
  const handleAdd=useCallback(()=>{setPressed(true);onAdd(item);setTimeout(()=>setPressed(false),220);},[item,onAdd]);
  return (
    <div className="lift" style={{background:T.white,borderRadius:22,boxShadow:shadow.sm,overflow:"hidden",display:"flex",marginBottom:16,transform:pressed?"scale(0.97)":"scale(1)",transition:"transform .15s ease",border:`1px solid ${T.gray100}`}}>
      <div style={{width:140,minHeight:148,flexShrink:0,position:"relative",overflow:"hidden"}}>
        <FoodImg src={src} alt={item.name}/>
        <div style={{position:"absolute",bottom:8,left:8,background:"rgba(15,23,42,0.72)",borderRadius:10,padding:"2px 8px",fontSize:9,fontWeight:800,color:T.white,letterSpacing:"0.06em",backdropFilter:"blur(6px)",textTransform:"uppercase",zIndex:1}}>{item.cat}</div>
      </div>
      <div style={{flex:1,padding:"16px 16px 14px 14px",display:"flex",flexDirection:"column",gap:7}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{item.tags.slice(0,2).map(t=><Tag key={t} label={t}/>)}</div>
        <div style={{fontWeight:900,fontSize:15,color:T.navy,lineHeight:1.3}}>{item.name}</div>
        <div style={{fontSize:12,color:T.gray400,lineHeight:1.6,flex:1}}>{item.desc.length>72?item.desc.slice(0,72)+"…":item.desc}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:4}}>
          <div>
            <div style={{fontSize:19,fontWeight:900,color:T.navy,letterSpacing:"-0.5px"}}>₦{item.price.toLocaleString()}</div>
            <Stars rating={item.rating} reviews={item.reviews}/>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>onLike(item.id)} style={{background:liked?"#fce7f3":T.gray100,border:`1.5px solid ${liked?"#f9a8d4":T.gray200}`,borderRadius:"50%",width:36,height:36,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .18s"}}>{liked?"❤️":"🤍"}</button>
            <button onClick={handleAdd} style={{background:`linear-gradient(135deg,${T.green},${T.greenDark})`,border:"none",borderRadius:"50%",width:40,height:40,cursor:"pointer",color:T.white,fontSize:24,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:shadow.green}}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════
   TREND CARD
═══════════════════════════════════════════════════════════ */
const TrendCard = memo(({item,onAdd,liveImg}) => {
  const src = liveImg || item.img;
  return (
    <div className="lift" style={{minWidth:182,maxWidth:182,background:T.white,borderRadius:22,overflow:"hidden",boxShadow:shadow.sm,flexShrink:0,border:`1px solid ${T.gray100}`}}>
      <div style={{height:124,position:"relative",overflow:"hidden"}}>
        <FoodImg src={src} alt={item.name}/>
        <span style={{position:"absolute",top:10,right:10,background:"rgba(15,23,42,0.80)",backdropFilter:"blur(8px)",borderRadius:10,padding:"3px 10px",fontSize:12,fontWeight:900,color:T.white,zIndex:1}}>₦{item.price.toLocaleString()}</span>
      </div>
      <div style={{padding:"12px 14px 14px"}}>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:7}}>{item.tags.slice(0,2).map(t=><Tag key={t} label={t}/>)}</div>
        <div style={{fontWeight:900,fontSize:13,color:T.navy,marginBottom:5,lineHeight:1.3}}>{item.name}</div>
        <div style={{fontSize:11,color:T.gray400,marginBottom:10,lineHeight:1.5}}>{item.desc.slice(0,54)}…</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Stars rating={item.rating} reviews={item.reviews} size={10}/>
          <button onClick={()=>onAdd(item)} style={{background:`linear-gradient(135deg,${T.green},${T.greenDark})`,border:"none",borderRadius:10,width:30,height:30,color:T.white,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:shadow.green}}>+</button>
        </div>
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════
   BOTTOM NAV
═══════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  {id:"home",   label:"Home",  path:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>},
  {id:"menu",   label:"Menu",  path:<><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7"/></>},
  {id:"cart",   label:"Cart",  path:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>},
  {id:"profile",label:"Me",    path:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>},
];

const BottomNav = ({page,setPage,cartCount}) => (
  <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.white,borderTop:`1px solid ${T.gray100}`,display:"flex",zIndex:200,boxShadow:"0 -4px 24px rgba(0,0,0,0.09)",paddingBottom:"env(safe-area-inset-bottom,8px)"}}>
    {NAV_ITEMS.map(tab=>{
      const active=page===tab.id,isCart=tab.id==="cart",color=active?T.pink:T.gray400;
      return (
        <button key={tab.id} onClick={()=>setPage(tab.id)} style={{flex:1,padding:"11px 4px 9px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,position:"relative",transition:"transform .15s",transform:active?"translateY(-2px)":"none"}}>
          {isCart&&cartCount>0&&<span style={{position:"absolute",top:6,right:"calc(50% - 18px)",background:T.red,color:T.white,fontSize:9,fontWeight:900,borderRadius:10,minWidth:16,height:16,padding:"0 4px",display:"flex",alignItems:"center",justifyContent:"center",animation:"badgePop .3s ease"}}>{cartCount}</span>}
          <svg width={22} height={22} fill="none" stroke={color} viewBox="0 0 24 24">{tab.path}</svg>
          <span style={{fontSize:10,fontWeight:active?800:500,color,letterSpacing:"0.02em"}}>{tab.label}</span>
          {active&&<div style={{position:"absolute",bottom:0,width:24,height:3,background:T.pink,borderRadius:"3px 3px 0 0"}}/>}
        </button>
      );
    })}
  </nav>
);

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════ */
const HomePage = ({setPage,setMenuCat,addToCart,liveImgs}) => (
  <div style={{paddingBottom:90}}>

    {/* Hero */}
    <div style={{position:"relative",overflow:"hidden",minHeight:440}}>
      <FoodImg src={liveImgs.hero||FOOD_IMAGES.hero} alt="hero food"/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(170deg,rgba(10,30,10,0.38) 0%,rgba(20,70,20,0.80) 50%,rgba(27,94,32,0.97) 100%)"}}/>

      <div style={{position:"relative",zIndex:1,padding:"20px 22px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{color:T.white,fontWeight:900,fontSize:20,letterSpacing:"-0.5px"}}>🌽 Corn Fusion</div>
          <div style={{color:"rgba(255,255,255,0.6)",fontSize:11,marginTop:2}}>📍 Lekki, Lagos</div>
        </div>
        <button style={{background:"rgba(255,255,255,0.18)",border:"none",borderRadius:20,padding:"8px 16px",color:T.white,fontWeight:700,fontSize:12,cursor:"pointer",backdropFilter:"blur(8px)"}}>🔗 Share</button>
      </div>

      <div style={{position:"relative",zIndex:1,padding:"32px 22px 0"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.14)",borderRadius:20,padding:"5px 14px",marginBottom:18,backdropFilter:"blur(8px)"}}>
          <span style={{color:"#ffd54f",fontSize:13}}>★</span>
          <span style={{color:T.white,fontSize:12,fontWeight:700}}>#1 Corn Spot in Lagos · 4.9 ★</span>
        </div>
        <div style={{color:T.white,fontSize:38,fontWeight:900,lineHeight:1.1,marginBottom:4}}>Fresh Corn.</div>
        <div style={{color:"#ffd54f",fontSize:38,fontWeight:900,lineHeight:1.1,marginBottom:18}}>Reimagined. ✨</div>
        <div style={{color:"rgba(255,255,255,0.82)",fontSize:14,lineHeight:1.7,marginBottom:28,maxWidth:290}}>
          Traditional Nigerian flavours reimagined through modern culinary artistry — crafted daily with love.
        </div>
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>setPage("menu")} style={{background:T.white,color:T.green,border:"none",borderRadius:30,padding:"14px 28px",fontWeight:900,fontSize:14,cursor:"pointer",boxShadow:shadow.lg}}>Order Now 🛒</button>
          <button onClick={()=>setPage("menu")} style={{background:"rgba(255,255,255,0.18)",color:T.white,border:"none",borderRadius:30,padding:"14px 20px",fontWeight:700,fontSize:14,cursor:"pointer",backdropFilter:"blur(8px)"}}>View Menu</button>
        </div>
      </div>

      <div style={{position:"relative",zIndex:1,margin:"28px 22px 28px"}}>
        <div style={{background:"rgba(255,255,255,0.13)",borderRadius:20,padding:"18px 10px",display:"flex",justifyContent:"space-around",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.18)"}}>
          {[{icon:"⚡",value:"28 min",label:"Avg Delivery"},{icon:"⭐",value:"4.9",label:"Rating"},{icon:"🍽",value:"12+",label:"Corn Dishes"}].map((s,i)=>(
            <div key={s.label} style={{textAlign:"center",flex:1,borderRight:i<2?"1px solid rgba(255,255,255,0.2)":"none"}}>
              <div style={{fontSize:20,marginBottom:4}}>{s.icon}</div>
              <div style={{color:T.white,fontWeight:900,fontSize:16}}>{s.value}</div>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:10,marginTop:1}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* New Arrival */}
    <div style={{margin:"0 20px",marginTop:-24,background:T.white,borderRadius:22,padding:"16px 18px",boxShadow:shadow.lg,display:"flex",alignItems:"center",justifyContent:"space-between",border:`1px solid ${T.gray100}`}}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:62,height:62,borderRadius:16,overflow:"hidden",flexShrink:0,boxShadow:shadow.sm,position:"relative"}}>
          <FoodImg src={liveImgs.tacos||FOOD_IMAGES.tacos} alt="tacos"/>
        </div>
        <div>
          <span style={{background:T.red+"18",color:T.red,fontSize:9,fontWeight:900,padding:"2px 8px",borderRadius:10,letterSpacing:"0.06em"}}>🔥 NEW</span>
          <div style={{fontWeight:900,color:T.navy,fontSize:14,marginTop:3}}>Spicy Corn Tacos</div>
          <div style={{color:T.gray400,fontSize:12,marginTop:1}}>Street-style · Just dropped</div>
        </div>
      </div>
      <button onClick={()=>setPage("menu")} style={{background:`linear-gradient(135deg,${T.green},${T.greenDark})`,border:"none",borderRadius:14,padding:"10px 16px",color:T.white,fontWeight:800,fontSize:12,cursor:"pointer",boxShadow:shadow.green,whiteSpace:"nowrap"}}>Order →</button>
    </div>

    {/* Trending Now */}
    <div style={{padding:"32px 20px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:18}}>
        <div>
          <div style={{fontSize:22,fontWeight:900,color:T.navy,letterSpacing:"-0.4px"}}>Trending Now 🔥</div>
          <div style={{fontSize:12,color:T.gray400,marginTop:4}}>Top picks from our kitchen this week</div>
        </div>
        <button onClick={()=>setPage("menu")} style={{background:"none",border:"none",color:T.green,fontWeight:800,fontSize:13,cursor:"pointer"}}>See All →</button>
      </div>
      <div style={{display:"flex",gap:14,overflowX:"auto",paddingBottom:8,WebkitOverflowScrolling:"touch",scrollSnapType:"x mandatory",marginLeft:-2,paddingLeft:2}}>
        {MENU.slice(0,5).map(item=>(
          <div key={item.id} style={{scrollSnapAlign:"start"}}>
            <TrendCard item={item} onAdd={addToCart} liveImg={liveImgs[item.id]}/>
          </div>
        ))}
      </div>
    </div>

    {/* Categories */}
    <div style={{padding:"32px 20px 0"}}>
      <div style={{fontSize:22,fontWeight:900,color:T.navy,letterSpacing:"-0.4px",marginBottom:6}}>Explore Menu</div>
      <div style={{fontSize:12,color:T.gray400,marginBottom:18}}>Browse by category</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[
          {label:"Starters",img:liveImgs.papAkara||FOOD_IMAGES.papAkara,cat:"starters",count:4,desc:"Soups & snacks"},
          {label:"Mains",   img:liveImgs.burger  ||FOOD_IMAGES.burger,  cat:"mains",   count:5,desc:"Hearty plates"},
          {label:"Dessert", img:liveImgs.iceCream||FOOD_IMAGES.iceCream, cat:"dessert", count:2,desc:"Sweet endings"},
          {label:"Drinks",  img:liveImgs.lemonade||FOOD_IMAGES.lemonade, cat:"drinks",  count:2,desc:"Cold & craft"},
        ].map(c=>(
          <button key={c.cat} onClick={()=>{setMenuCat(c.cat);setPage("menu");}} style={{background:"none",border:"none",padding:0,cursor:"pointer",borderRadius:22,overflow:"hidden",position:"relative",height:134,boxShadow:shadow.sm}}>
            <FoodImg src={c.img} alt={c.label}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(170deg,rgba(15,23,42,0.04) 0%,rgba(15,23,42,0.72) 100%)"}}/>
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"12px 14px",textAlign:"left",zIndex:1}}>
              <div style={{color:T.white,fontWeight:900,fontSize:16}}>{c.label}</div>
              <div style={{color:"rgba(255,255,255,0.78)",fontSize:11,marginTop:2}}>{c.count} items · {c.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>

    {/* AI Banner */}
    <div style={{margin:"32px 20px 0",background:"linear-gradient(145deg,#0f172a 0%,#1e293b 60%,#0f3460 100%)",borderRadius:26,padding:"26px 24px",position:"relative",overflow:"hidden",boxShadow:shadow.xl}}>
      <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,background:"rgba(58,158,63,0.15)",borderRadius:"50%"}}/>
      <div style={{position:"absolute",bottom:-20,left:20,width:80,height:80,background:"rgba(245,158,11,0.10)",borderRadius:"50%"}}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"inline-block",background:"linear-gradient(135deg,#f59e0b,#fbbf24)",color:"#78350f",fontSize:10,fontWeight:900,padding:"4px 14px",borderRadius:20,letterSpacing:"0.1em",marginBottom:16}}>✨ AI-POWERED</div>
        <div style={{color:T.white,fontSize:22,fontWeight:900,lineHeight:1.3,marginBottom:10}}>Not sure what to eat?</div>
        <div style={{color:"rgba(255,255,255,0.6)",fontSize:13,lineHeight:1.7,marginBottom:22}}>Our AI Sommelier reads your mood and handpicks the perfect corn dish — personalized just for you.</div>
        <button onClick={()=>setPage("profile")} style={{background:T.white,color:T.navy,border:"none",borderRadius:24,padding:"13px 22px",fontWeight:900,fontSize:14,cursor:"pointer",boxShadow:shadow.lg,display:"flex",alignItems:"center",gap:8}}>
          <span>Try AI Recommendation</span><span>🤖</span>
        </button>
      </div>
    </div>

    {/* Why Us */}
    <div style={{margin:"32px 20px 0",background:T.white,borderRadius:24,padding:"24px 22px",boxShadow:shadow.sm,border:`1px solid ${T.gray100}`}}>
      <div style={{fontSize:17,fontWeight:900,color:T.navy,marginBottom:18}}>Why Corn Fusion?</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[{icon:"⚡",title:"Fast Delivery",sub:"28 min average"},{icon:"🌽",title:"Farm Fresh",sub:"Sourced daily"},{icon:"🤖",title:"AI Curated",sub:"Smart picks"},{icon:"⭐",title:"4.9 ★ Rated",sub:"2,000+ reviews"}].map(f=>(
          <div key={f.title} style={{background:T.gray50,borderRadius:18,padding:"18px 16px",border:`1px solid ${T.gray100}`}}>
            <div style={{fontSize:28,marginBottom:10}}>{f.icon}</div>
            <div style={{fontWeight:800,fontSize:13,color:T.navy}}>{f.title}</div>
            <div style={{fontSize:11,color:T.gray400,marginTop:3}}>{f.sub}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{height:24}}/>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MENU PAGE
═══════════════════════════════════════════════════════════ */
const MenuPage = ({menuCat,setMenuCat,addToCart,liked,onLike,setPage,liveImgs}) => {
  const [search,setSearch]=useState("");
  const filtered=MENU.filter(m=>(menuCat==="all"||m.cat===menuCat)&&(!search||m.name.toLowerCase().includes(search.toLowerCase())));
  return (
    <div style={{paddingBottom:90}}>
      <PageHeader title="Our Menu" onBack={()=>setPage("home")} subtitle={`${filtered.length} items`}/>
      <div style={{padding:"18px 20px 0"}}>
        <div style={{background:T.white,borderRadius:18,border:`1.5px solid ${T.gray200}`,display:"flex",alignItems:"center",gap:10,padding:"0 16px",boxShadow:shadow.xs}}>
          <span style={{color:T.gray400,fontSize:16}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search dishes…" style={{flex:1,padding:"13px 0",border:"none",outline:"none",fontSize:14,color:T.navy,background:"transparent"}}/>
          {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:T.gray400,cursor:"pointer",fontSize:16}}>✕</button>}
        </div>
      </div>
      <div style={{padding:"14px 20px 0",display:"flex",gap:8,overflowX:"auto",WebkitOverflowScrolling:"touch",paddingBottom:6}}>
        {CATS.map(c=><Pill key={c} label={c} active={menuCat===c} onClick={()=>setMenuCat(c)}/>)}
      </div>
      <div style={{padding:"18px 20px 0"}}>
        {filtered.length===0
          ? <div style={{textAlign:"center",padding:"60px 32px",color:T.gray400}}>
              <div style={{fontSize:48,marginBottom:16}}>🌽</div>
              <div style={{fontWeight:800,fontSize:16,color:T.navy,marginBottom:8}}>No results found</div>
              <div style={{fontSize:13}}>Try a different search or category</div>
            </div>
          : filtered.map(item=><MenuCard key={item.id} item={item} onAdd={addToCart} liked={liked[item.id]} onLike={onLike} liveImg={liveImgs[item.id]}/>)
        }
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   CART PAGE
═══════════════════════════════════════════════════════════ */
const DELIVERY_FEE=500;
const CartPage = ({cart,updateQty,setPage,showToast,liveImgs}) => {
  const [promo,setPromo]=useState("");
  const [promoApplied,setPromoApplied]=useState(false);
  const [done,setDone]=useState(false);
  const sub=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const disc=promoApplied?Math.round(sub*.1):0;
  const total=sub-disc+DELIVERY_FEE;

  if(done) return (
    <div style={{minHeight:"100vh",background:T.gray50,paddingBottom:90}}>
      <PageHeader title="Order Confirmed"/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"70px 32px",textAlign:"center"}}>
        <div style={{fontSize:80,marginBottom:24,animation:"pulse 1s ease infinite"}}>🎉</div>
        <div style={{fontWeight:900,color:T.navy,fontSize:24,marginBottom:12}}>Order Placed!</div>
        <div style={{color:T.gray400,fontSize:14,lineHeight:1.7,marginBottom:10,maxWidth:260}}>Your corn feast is being prepared. Estimated arrival in <strong>28 minutes</strong>.</div>
        <div style={{background:`linear-gradient(135deg,${T.green},${T.greenDark})`,borderRadius:20,padding:"16px 28px",margin:"16px 0 36px"}}>
          <div style={{color:"rgba(255,255,255,0.75)",fontSize:12}}>Total paid</div>
          <div style={{color:T.white,fontWeight:900,fontSize:24}}>₦{total.toLocaleString()}</div>
        </div>
        <button onClick={()=>{setDone(false);setPage("home");}} style={{background:`linear-gradient(135deg,${T.green},${T.greenDark})`,border:"none",borderRadius:30,padding:"15px 44px",color:T.white,fontWeight:900,fontSize:15,cursor:"pointer",boxShadow:shadow.green}}>Back to Home</button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:T.gray50,paddingBottom:90}}>
      <PageHeader title="Your Bag" subtitle={cart.length>0?`${cart.reduce((s,i)=>s+i.qty,0)} items`:undefined}/>
      {cart.length===0 ? (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"80px 32px",textAlign:"center"}}>
          <div style={{width:120,height:120,borderRadius:60,background:T.gray100,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:28,fontSize:52}}>🛒</div>
          <div style={{fontSize:22,fontWeight:900,color:T.navy,marginBottom:12}}>Your bag is empty</div>
          <div style={{fontSize:14,color:T.gray400,lineHeight:1.7,marginBottom:36,maxWidth:260}}>You haven't added any corn delicacies yet. Let's fix that!</div>
          <button onClick={()=>setPage("menu")} style={{background:`linear-gradient(135deg,${T.green},${T.greenDark})`,color:T.white,border:"none",borderRadius:30,padding:"15px 46px",fontWeight:900,fontSize:15,cursor:"pointer",boxShadow:shadow.green}}>Browse Menu</button>
        </div>
      ) : (
        <div style={{padding:"20px 20px 0"}}>
          {cart.map(item=>(
            <div key={item.id} style={{background:T.white,borderRadius:22,padding:"16px",marginBottom:14,boxShadow:shadow.sm,display:"flex",alignItems:"center",gap:14,border:`1px solid ${T.gray100}`}}>
              <div style={{width:74,height:74,borderRadius:18,overflow:"hidden",flexShrink:0,boxShadow:shadow.xs,position:"relative"}}>
                <FoodImg src={liveImgs[item.id]||item.img} alt={item.name}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:14,color:T.navy,marginBottom:3}}>{item.name}</div>
                <div style={{fontSize:13,fontWeight:900,color:T.green}}>₦{item.price.toLocaleString()}</div>
                <div style={{fontSize:11,color:T.gray400,marginTop:2}}>Subtotal: ₦{(item.price*item.qty).toLocaleString()}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <button onClick={()=>updateQty(item.id,-1)} style={{background:T.gray100,border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontWeight:900,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",color:T.gray700}}>−</button>
                <span style={{fontWeight:900,fontSize:15,minWidth:20,textAlign:"center",color:T.navy}}>{item.qty}</span>
                <button onClick={()=>updateQty(item.id,1)} style={{background:`linear-gradient(135deg,${T.green},${T.greenDark})`,border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",color:T.white,fontWeight:900,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
            </div>
          ))}
          <div style={{display:"flex",gap:10,margin:"4px 0 14px"}}>
            <input value={promo} onChange={e=>setPromo(e.target.value)} placeholder="Promo code (try CORN10)"
              style={{flex:1,padding:"13px 16px",border:`1.5px solid ${promoApplied?T.green:T.gray200}`,borderRadius:18,fontSize:13,outline:"none",background:promoApplied?T.greenLight:T.white,color:promoApplied?T.greenDark:T.navy}}/>
            <button onClick={()=>{if(promo.toLowerCase()==="corn10"){setPromoApplied(true);showToast("🎉 10% discount applied!");}else showToast("❌ Invalid promo code");}} style={{background:promoApplied?T.greenDark:T.navy,color:T.white,border:"none",borderRadius:18,padding:"13px 18px",fontWeight:700,fontSize:13,cursor:"pointer"}}>{promoApplied?"✓":"Apply"}</button>
          </div>
          <div style={{background:T.white,borderRadius:22,padding:"20px",boxShadow:shadow.sm,border:`1px solid ${T.gray100}`,marginBottom:14}}>
            <div style={{fontSize:15,fontWeight:900,color:T.navy,marginBottom:16}}>Order Summary</div>
            {[["Subtotal",`₦${sub.toLocaleString()}`,false],promoApplied?["Discount (10%)",`-₦${disc.toLocaleString()}`,true]:null,["Delivery",`₦${DELIVERY_FEE.toLocaleString()}`,false]].filter(Boolean).map(([k,v,isD])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.gray50}`}}>
                <span style={{fontSize:13,color:T.gray500}}>{k}</span>
                <span style={{fontSize:13,fontWeight:700,color:isD?T.green:T.gray700}}>{v}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0 0"}}>
              <span style={{fontSize:16,fontWeight:900,color:T.navy}}>Total</span>
              <span style={{fontSize:16,fontWeight:900,color:T.green}}>₦{total.toLocaleString()}</span>
            </div>
          </div>
          <button onClick={()=>setDone(true)} style={{width:"100%",background:`linear-gradient(135deg,${T.green},${T.greenDark})`,border:"none",borderRadius:22,padding:"18px",color:T.white,fontWeight:900,fontSize:16,cursor:"pointer",boxShadow:shadow.green,marginBottom:10}}>
            Place Order · ₦{total.toLocaleString()}
          </button>
          <div style={{textAlign:"center",fontSize:11,color:T.gray400,paddingBottom:8}}>🔒 Secure checkout · Free returns within 15 min</div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PROFILE PAGE
═══════════════════════════════════════════════════════════ */
const ProfilePage = ({showToast,liveImgs}) => {
  const [moods,setMoods]=useState({comfort:false,spicy:false,vegetarian:false,seafood:false,sweet:false});
  const [aiRecs,setAiRecs]=useState(null);
  const [aiLoading,setAiLoading]=useState(false);
  const [booking,setBooking]=useState({name:"",date:"",guests:"2 People",time:"7:00 PM"});
  const [booked,setBooked]=useState(false);
  const toggleMood=k=>setMoods(p=>({...p,[k]:!p[k]}));

  const getAIRecs=async()=>{
    const sel=Object.entries(moods).filter(([,v])=>v).map(([k])=>k);
    if(!sel.length){showToast("⚠️ Pick at least one mood!");return;}
    setAiLoading(true);setAiRecs(null);
    const menuStr=MENU.map(m=>`id:${m.id} "${m.name}" ₦${m.price} tags:[${m.tags.join(",")}]`).join("\n");
    const prompt=`You are a food AI sommelier for Corn Fusion Lagos. Customer mood: ${sel.join(", ")}.\nMenu:\n${menuStr}\nRespond ONLY with valid JSON array of exactly 3 objects: [{"id":<number>,"reason":"<12 words max>"}]`;
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,messages:[{role:"user",content:prompt}]})});
      const d=await r.json();
      const picks=JSON.parse((d.content?.[0]?.text||"[]").replace(/```json|```/g,"").trim());
      setAiRecs(picks.map(p=>({...MENU.find(m=>m.id===p.id),reason:p.reason})).filter(Boolean));
    }catch{setAiRecs([]);}
    setAiLoading(false);
  };

  return (
    <div style={{paddingBottom:90}}>
      <PageHeader title="My Profile" subtitle="Gold Member · Food Enthusiast"/>
      <div style={{padding:"22px 20px 0"}}>

        {/* Profile */}
        <div style={{background:T.white,borderRadius:24,padding:"22px",boxShadow:shadow.sm,display:"flex",alignItems:"center",gap:18,marginBottom:16,border:`1px solid ${T.gray100}`}}>
          <div style={{width:74,height:74,borderRadius:37,overflow:"hidden",flexShrink:0,boxShadow:shadow.green,border:`3px solid ${T.green}`,position:"relative"}}>
            <FoodImg src="https://i.pravatar.cc/150?img=12" alt="avatar"/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:T.gray400,marginBottom:3}}>Welcome back 👋</div>
            <div style={{fontSize:20,fontWeight:900,color:T.navy}}>Food Enthusiast</div>
            <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
              <span style={{background:"linear-gradient(135deg,#fef3c7,#fde68a)",color:"#92400e",fontSize:11,fontWeight:800,padding:"3px 12px",borderRadius:20}}>⭐ Gold Member</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
          {[{label:"Orders",value:"24",icon:"📦"},{label:"Favorites",value:"8",icon:"❤️"},{label:"Rewards",value:"340",icon:"⭐"}].map(s=>(
            <div key={s.label} style={{background:T.white,borderRadius:18,padding:"16px 12px",textAlign:"center",boxShadow:shadow.xs,border:`1px solid ${T.gray100}`}}>
              <div style={{fontSize:22,marginBottom:4}}>{s.icon}</div>
              <div style={{fontWeight:900,fontSize:18,color:T.navy}}>{s.value}</div>
              <div style={{fontSize:10,color:T.gray400,fontWeight:600}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Invite */}
        <div style={{borderRadius:24,overflow:"hidden",marginBottom:16,position:"relative",height:120,boxShadow:"0 4px 16px rgba(245,158,11,0.35)"}}>
          <FoodImg src={liveImgs.sundae||FOOD_IMAGES.sundae} alt="invite"/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(245,158,11,0.90),rgba(251,191,36,0.80))"}}/>
          <div style={{position:"absolute",inset:0,padding:"20px 22px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{color:T.white,fontWeight:900,fontSize:17,marginBottom:5}}>Invite Friends 🎁</div>
              <div style={{color:"rgba(255,255,255,0.9)",fontSize:12,lineHeight:1.5}}>Share the love of corn &<br/>earn exclusive rewards!</div>
            </div>
            <button style={{background:"rgba(255,255,255,0.25)",border:"none",borderRadius:22,width:48,height:48,cursor:"pointer",fontSize:22,backdropFilter:"blur(8px)"}}>🔗</button>
          </div>
        </div>

        {/* AI Sommelier */}
        <div style={{background:"linear-gradient(145deg,#0f172a,#1e293b)",borderRadius:26,padding:"24px 22px",marginBottom:16,boxShadow:shadow.xl}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
            <div style={{width:44,height:44,borderRadius:22,overflow:"hidden",border:`2px solid ${T.green}`,flexShrink:0,position:"relative"}}>
              <FoodImg src="https://i.pravatar.cc/150?img=47" alt="ai"/>
            </div>
            <div>
              <div style={{color:T.white,fontWeight:900,fontSize:17}}>AI Taste Sommelier</div>
              <div style={{color:"rgba(255,255,255,0.45)",fontSize:11,marginTop:1}}>Powered by Claude AI</div>
            </div>
          </div>
          <div style={{height:1,background:"rgba(255,255,255,0.08)",margin:"14px 0"}}/>
          <div style={{color:"rgba(255,255,255,0.65)",fontSize:13,marginBottom:18,lineHeight:1.7}}>Tell us your mood and our AI will curate the perfect corn dish for you.</div>
          <div style={{color:T.white,fontWeight:800,fontSize:14,marginBottom:12}}>How are you feeling today?</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
            {[{k:"comfort",l:"😌 Comfort & Warm"},{k:"spicy",l:"🔥 I Love Spicy"},{k:"vegetarian",l:"🌱 Vegetarian"},{k:"seafood",l:"🦐 Seafood Lover"},{k:"sweet",l:"🍬 Sweet Tooth"}].map(m=>(
              <button key={m.k} onClick={()=>toggleMood(m.k)} style={{background:moods[m.k]?"rgba(58,158,63,0.22)":"rgba(255,255,255,0.06)",border:`1.5px solid ${moods[m.k]?T.green:"rgba(255,255,255,0.12)"}`,borderRadius:14,padding:"12px",color:moods[m.k]?T.green:"rgba(255,255,255,0.65)",fontWeight:700,fontSize:12,cursor:"pointer",textAlign:"left",transition:"all .18s"}}>{m.l}</button>
            ))}
          </div>
          <button onClick={getAIRecs} disabled={aiLoading} style={{width:"100%",background:aiLoading?"rgba(58,158,63,0.5)":`linear-gradient(135deg,${T.green},${T.greenDark})`,border:"none",borderRadius:18,padding:"16px",color:T.white,fontWeight:900,fontSize:15,cursor:aiLoading?"not-allowed":"pointer",boxShadow:aiLoading?"none":shadow.green,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            {aiLoading?<><Spinner size={20} color="rgba(255,255,255,0.8)"/> Analyzing…</>:"✨ Get Recommendations"}
          </button>
          {aiRecs&&(aiRecs.length===0
            ? <div style={{color:"rgba(255,255,255,0.4)",textAlign:"center",marginTop:16,fontSize:13}}>No match – try different moods!</div>
            : <div style={{marginTop:18,display:"flex",flexDirection:"column",gap:12}}>
                <div style={{color:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>Your AI Picks</div>
                {aiRecs.map(item=>(
                  <div key={item.id} style={{background:"rgba(255,255,255,0.06)",borderRadius:18,padding:16,border:"1px solid rgba(58,158,63,0.3)",display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:54,height:54,borderRadius:14,overflow:"hidden",flexShrink:0,position:"relative"}}><FoodImg src={liveImgs[item.id]||item.img} alt={item.name}/></div>
                    <div style={{flex:1}}>
                      <div style={{color:T.white,fontWeight:800,fontSize:13}}>{item.name}</div>
                      <div style={{color:T.green,fontWeight:900,fontSize:13}}>₦{item?.price?.toLocaleString()}</div>
                      <div style={{color:"rgba(255,255,255,0.42)",fontSize:11,marginTop:3,fontStyle:"italic"}}>{item.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
          )}
        </div>

        {/* Book a Table */}
        <div style={{background:T.white,borderRadius:24,overflow:"hidden",boxShadow:shadow.sm,marginBottom:16,border:`1px solid ${T.gray100}`}}>
          <div style={{height:110,position:"relative",overflow:"hidden"}}>
            <FoodImg src={liveImgs.restaurant||FOOD_IMAGES.restaurant} alt="restaurant"/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(15,23,42,0.58),rgba(45,125,50,0.68))"}}/>
            <div style={{position:"absolute",bottom:16,left:20,zIndex:1}}>
              <div style={{color:T.white,fontWeight:900,fontSize:17}}>🗓 Reserve a Table</div>
              <div style={{color:"rgba(255,255,255,0.78)",fontSize:12,marginTop:2}}>Book your spot at Corn Fusion</div>
            </div>
          </div>
          <div style={{padding:"20px"}}>
            {booked ? (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:56,marginBottom:14}}>✅</div>
                <div style={{fontWeight:900,color:T.green,fontSize:18}}>Booking Confirmed!</div>
                <div style={{color:T.gray400,fontSize:13,marginTop:6,lineHeight:1.6}}>{booking.date} · {booking.guests} · {booking.time}</div>
                <button onClick={()=>setBooked(false)} style={{marginTop:18,background:T.gray100,border:"none",borderRadius:16,padding:"10px 22px",fontWeight:700,fontSize:13,cursor:"pointer",color:T.gray700}}>New Booking</button>
              </div>
            ) : (
              <>
                <input placeholder="Your name" value={booking.name} onChange={e=>setBooking(p=>({...p,name:e.target.value}))} style={{width:"100%",padding:"13px 16px",border:`1.5px solid ${T.gray200}`,borderRadius:16,fontSize:13,outline:"none",marginBottom:12,color:T.navy}}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  <div>
                    <div style={{fontSize:10,color:T.gray400,fontWeight:800,marginBottom:6,letterSpacing:"0.06em"}}>DATE</div>
                    <input type="date" value={booking.date} onChange={e=>setBooking(p=>({...p,date:e.target.value}))} style={{width:"100%",padding:"11px 12px",border:`1.5px solid ${T.gray200}`,borderRadius:14,fontSize:13,outline:"none",color:T.navy}}/>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:T.gray400,fontWeight:800,marginBottom:6,letterSpacing:"0.06em"}}>GUESTS</div>
                    <select value={booking.guests} onChange={e=>setBooking(p=>({...p,guests:e.target.value}))} style={{width:"100%",padding:"11px 12px",border:`1.5px solid ${T.gray200}`,borderRadius:14,fontSize:13,outline:"none",color:T.navy,background:T.white}}>
                      {["1 Person","2 People","3 People","4 People","5+ People"].map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{marginBottom:18}}>
                  <div style={{fontSize:10,color:T.gray400,fontWeight:800,marginBottom:6,letterSpacing:"0.06em"}}>TIME</div>
                  <select value={booking.time} onChange={e=>setBooking(p=>({...p,time:e.target.value}))} style={{width:"100%",padding:"11px 14px",border:`1.5px solid ${T.gray200}`,borderRadius:14,fontSize:13,outline:"none",color:T.navy,background:T.white}}>
                    {["12:00 PM","1:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM"].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <button onClick={()=>{if(booking.name&&booking.date){setBooked(true);showToast("🎉 Table booked!");}else showToast("⚠️ Please fill all fields");}} style={{width:"100%",background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,border:"none",borderRadius:18,padding:"16px",color:T.white,fontWeight:900,fontSize:15,cursor:"pointer",boxShadow:shadow.md}}>
                  Confirm Reservation
                </button>
              </>
            )}
          </div>
        </div>

        {/* Settings */}
        {[
          {icon:"⚙️",label:"Account Settings",sub:"Privacy & preferences",bg:"#eff6ff"},
          {icon:"❤️",label:"Favorites",        sub:"Your saved dishes",   bg:"#fdf2f8"},
          {icon:"🎁",label:"Rewards & Points", sub:"340 pts · Gold tier", bg:"#fefce8"},
          {icon:"↩️",label:"Log Out",           sub:"See you soon!",       bg:"#f8fafc"},
        ].map(s=>(
          <div key={s.label} style={{background:T.white,borderRadius:20,padding:"16px 18px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:shadow.xs,cursor:"pointer",border:`1px solid ${T.gray100}`}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:46,height:46,background:s.bg,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{s.icon}</div>
              <div>
                <div style={{fontWeight:800,color:T.navy,fontSize:14}}>{s.label}</div>
                <div style={{fontSize:11,color:T.gray400,marginTop:2}}>{s.sub}</div>
              </div>
            </div>
            <span style={{color:T.gray300,fontSize:22}}>›</span>
          </div>
        ))}
        <div style={{textAlign:"center",color:T.gray400,fontSize:12,padding:"20px 0 4px"}}>Corn Fusion App v2.0.0 · Made with ❤️ in Lagos</div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   AI CHAT WIDGET
═══════════════════════════════════════════════════════════ */
const AIChatWidget = ({visible,onClose,liveImgs}) => {
  const [msgs,setMsgs]=useState([{role:"ai",text:"👋 Hi! I'm your AI Corn Sommelier. Ask me anything about our menu — I'm here to help!"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);

  const send=async()=>{
    const m=input.trim();if(!m||loading)return;
    const next=[...msgs,{role:"user",text:m}];setMsgs(next);setInput("");setLoading(true);
    const menuStr=MENU.map(x=>`${x.name} ₦${x.price}: ${x.desc} [${x.tags.join(", ")}]`).join("\n");
    const sys=`You are the AI Food Sommelier at Corn Fusion Lagos. Be warm, friendly & concise. Only recommend from:\n${menuStr}\nMax 2 sentences. Use 1 emoji.`;
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:150,system:sys,messages:next.map(x=>({role:x.role==="ai"?"assistant":"user",content:x.text}))})});
      const d=await r.json();
      setMsgs(p=>[...p,{role:"ai",text:d.content?.[0]?.text||"Try our Golden Corn Chowder! 🍲"}]);
    }catch{setMsgs(p=>[...p,{role:"ai",text:"Connection hiccup — Spicy Suya Corn Ribs are always a winner! 🌽"}]);}
    setLoading(false);
  };

  if(!visible)return null;
  return (
    <div style={{position:"fixed",bottom:98,right:16,width:316,background:T.white,borderRadius:26,boxShadow:shadow.xl,zIndex:300,overflow:"hidden",border:`1px solid ${T.gray100}`,animation:"chatSlide .28s cubic-bezier(0.34,1.56,0.64,1)"}}>
      <div style={{background:`linear-gradient(135deg,${T.green},${T.greenDark})`,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:18,overflow:"hidden",border:"2px solid rgba(255,255,255,0.3)",position:"relative"}}>
            <FoodImg src="https://i.pravatar.cc/150?img=47" alt="ai"/>
          </div>
          <div>
            <div style={{color:T.white,fontWeight:900,fontSize:14}}>AI Sommelier</div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:3,background:"#86efac"}}/><span style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>Online · Instant replies</span></div>
          </div>
        </div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.18)",border:"none",borderRadius:10,width:30,height:30,color:T.white,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      </div>
      <div style={{height:240,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:10,background:"#fafbfc"}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",background:m.role==="user"?`linear-gradient(135deg,${T.green},${T.greenDark})`:T.white,color:m.role==="user"?T.white:T.navy,padding:"10px 14px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",maxWidth:"85%",fontSize:13,lineHeight:1.55,boxShadow:m.role==="user"?shadow.green:shadow.xs}}>{m.text}</div>
        ))}
        {loading&&<div style={{alignSelf:"flex-start",background:T.white,padding:"12px 14px",borderRadius:"18px 18px 18px 4px",fontSize:13,color:T.gray400,boxShadow:shadow.xs,display:"flex",alignItems:"center",gap:8}}><Spinner size={14}/>Thinking…</div>}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"8px 14px 0",display:"flex",gap:6,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        {["Best seller?","Vegetarian options","Spicy dishes"].map(s=>(
          <button key={s} onClick={()=>setInput(s)} style={{background:T.greenLight,border:`1px solid ${T.green}28`,borderRadius:16,padding:"5px 12px",fontSize:11,fontWeight:700,color:T.green,cursor:"pointer",whiteSpace:"nowrap"}}>{s}</button>
        ))}
      </div>
      <div style={{padding:"10px 14px 16px",display:"flex",gap:8,borderTop:`1px solid ${T.gray100}`,marginTop:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask me anything…" style={{flex:1,padding:"10px 14px",border:`1.5px solid ${T.gray200}`,borderRadius:18,fontSize:13,outline:"none",color:T.navy}}/>
        <button onClick={send} disabled={loading} style={{background:`linear-gradient(135deg,${T.green},${T.greenDark})`,border:"none",borderRadius:18,padding:"10px 16px",color:T.white,cursor:"pointer",fontWeight:900,opacity:loading?0.5:1,boxShadow:shadow.green}}>↑</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [page,setPage]=useState("home");
  const [menuCat,setMenuCat]=useState("all");
  const [cart,setCart]=useState([]);
  const [liked,setLiked]=useState({});
  const [toast,setToast]=useState(null);
  const [chat,setChat]=useState(false);

  /* Fetch real food images from TheMealDB on mount */
  const [liveImgs,setLiveImgs]=useState({});
  useEffect(()=>{
    const queries=[
      {key:"hero",      q:"Chicken"},
      {key:"burger",    q:"Big Mac"},
      {key:"tacos",     q:"Tacos"},
      {key:"shrimp",    q:"Prawn"},
      {key:"iceCream",  q:"Pancakes"},
      {key:"lemonade",  q:"Fruit"},
      {key:"cocktail",  q:"Cocktail"},
      {key:"chowder",   q:"Soup"},
      {key:"plantain",  q:"Rice"},
      {key:"sundae",    q:"Chocolate"},
      {key:"papAkara",  q:"Donuts"},
      {key:"suyaRibs",  q:"Kebab"},
      {key:"restaurant",q:"Beef"},
    ];
    // Map query keys to menu item IDs for cards
    const idMap={
      chowder:1, suyaRibs:2, burger:3, adalu:4,
      plantain:5, papAkara:6, iceCream:7, sundae:8,
      lemonade:9, cocktail:10, shrimp:11, tacos:12,
    };
    queries.forEach(async ({key,q})=>{
      try{
        const r=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`);
        const d=await r.json();
        const url=d.meals?.[0]?.strMealThumb;
        if(url){
          setLiveImgs(p=>{
            const next={...p,[key]:url};
            if(idMap[key]) next[idMap[key]]=url;
            return next;
          });
        }
      }catch{}
    });
  },[]);

  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  const showToast=useCallback(msg=>{setToast(msg);setTimeout(()=>setToast(null),2800);},[]);
  const addToCart=useCallback(item=>{setCart(p=>{const ex=p.find(i=>i.id===item.id);return ex?p.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i):[...p,{...item,qty:1}];});showToast(`🛒 ${item.name} added!`);},[showToast]);
  const updateQty=useCallback((id,d)=>{setCart(p=>p.map(i=>i.id===id?{...i,qty:Math.max(0,i.qty+d)}:i).filter(i=>i.qty>0));},[]);
  const onLike=useCallback(id=>setLiked(p=>({...p,[id]:!p[id]})),[]);
  const nav=useCallback(pg=>setPage(pg),[]);

  return (
    <div style={{fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:T.gray50,minHeight:"100vh",maxWidth:430,margin:"0 auto",position:"relative",overflowX:"hidden",WebkitFontSmoothing:"antialiased"}}>
      <style>{GLOBAL_CSS}</style>
      {toast&&(
        <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:T.white,borderLeft:`4px solid ${T.green}`,borderRadius:18,padding:"13px 22px",boxShadow:shadow.lg,zIndex:999,display:"flex",alignItems:"center",gap:10,whiteSpace:"nowrap",animation:"toastIn .28s cubic-bezier(0.34,1.56,0.64,1)",maxWidth:"88vw"}}>
          <span style={{fontSize:14,fontWeight:700,color:T.navy}}>{toast}</span>
        </div>
      )}
      <button onClick={()=>setChat(p=>!p)} style={{position:"fixed",bottom:90,right:16,width:54,height:54,background:`linear-gradient(135deg,${T.purple},${T.purpleDark})`,border:"none",borderRadius:27,cursor:"pointer",fontSize:22,boxShadow:shadow.purple,zIndex:250,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .25s cubic-bezier(0.34,1.56,0.64,1)",transform:chat?"rotate(20deg) scale(1.05)":"scale(1)"}}>🤖</button>
      <AIChatWidget visible={chat} onClose={()=>setChat(false)} liveImgs={liveImgs}/>
      <div key={page} style={{animation:"slideUp .32s cubic-bezier(0.22,1,0.36,1) both"}}>
        {page==="home"    &&<HomePage    setPage={nav} setMenuCat={setMenuCat} addToCart={addToCart} liveImgs={liveImgs}/>}
        {page==="menu"    &&<MenuPage    menuCat={menuCat} setMenuCat={setMenuCat} addToCart={addToCart} liked={liked} onLike={onLike} setPage={nav} liveImgs={liveImgs}/>}
        {page==="cart"    &&<CartPage    cart={cart} updateQty={updateQty} setPage={nav} showToast={showToast} liveImgs={liveImgs}/>}
        {page==="profile" &&<ProfilePage showToast={showToast} liveImgs={liveImgs}/>}
      </div>
      <BottomNav page={page} setPage={nav} cartCount={cartCount}/>
    </div>
  );
}
