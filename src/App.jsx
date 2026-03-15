import { useState, useEffect, createContext, useContext } from "react";
import "./styles/global.css";

const AppContext = createContext();
const useApp = () => useContext(AppContext);

const MENTORS = [
  { id:1, name:"Priya Sharma", handle:"priya.sharma_tech", role:"Senior SWE", company:"Google", avatar:"PS", color:"#7c3aed", bg:"#ede9fe", field:"Tech", rating:4.9, price:1499, sessions:312, followers:"24.8K", bio:"10 saal ka experience system design mein. 500+ engineers coach ki hain.", tags:["System Design","Python","DSA"], verified:true },
  { id:2, name:"Arjun Mehta", handle:"arjun_builds", role:"Startup Founder", company:"Ex-Flipkart", avatar:"AM", color:"#d97706", bg:"#fef3c7", field:"Business", rating:4.8, price:2999, sessions:189, followers:"18.2K", bio:"3 successful startups. Fundraising, PMF, scaling mein expert.", tags:["Startup","Fundraising","GTM"], verified:true },
  { id:3, name:"Neha Gupta", handle:"neha.designs", role:"UX Lead", company:"Microsoft", avatar:"NG", color:"#db2777", bg:"#fce7f3", field:"Design", rating:5.0, price:1299, sessions:428, followers:"31.4K", bio:"Human-centered design ka 8 saal ka journey.", tags:["UX","Figma","Design Thinking"], verified:true },
  { id:4, name:"Vikram Joshi", handle:"vikram_cfo", role:"CFO", company:"HDFC Startup Cell", avatar:"VJ", color:"#059669", bg:"#d1fae5", field:"Finance", rating:4.7, price:2499, sessions:97, followers:"12.1K", bio:"Startup finance, valuation, angel investment specialist.", tags:["Finance","Valuation","VC"], verified:true },
  { id:5, name:"Rohit Agarwal", handle:"rohit.growth", role:"Growth Marketer", company:"Ex-Zomato", avatar:"RA", color:"#2563eb", bg:"#dbeafe", field:"Marketing", rating:4.8, price:1199, sessions:256, followers:"19.3K", bio:"0 se 10M users tak le gaya. Performance marketing master.", tags:["Growth","SEO","Ads"], verified:true },
  { id:6, name:"Sunita Rao", handle:"dr.sunita_rao", role:"Oncologist & Coach", company:"AIIMS Delhi", avatar:"SR", color:"#7c3aed", bg:"#f3f0ff", field:"Health", rating:4.9, price:1799, sessions:143, followers:"8.7K", bio:"Healthcare career guidance aur MedTech startup mentoring.", tags:["MedTech","Healthcare","Wellness"], verified:true },
];

const POSTS = [
  { id:1, mentorId:1, emoji:"💻", bg:"linear-gradient(135deg,#dbeafe,#e0e7ff)", title:"System Design in 5 Steps", caption:"Scale karo apna system — Netflix se seekho! Mistake #1: premature optimization 🧵", likes:24891, comments:412, time:"2h", type:"post", tags:["#SystemDesign","#TechTips"] },
  { id:2, mentorId:2, emoji:"🚀", bg:"linear-gradient(135deg,#fef3c7,#fed7aa)", title:"How I Raised ₹2Cr Seed Round", caption:"Investors bet karte hain tumpe, idea pe nahi. Fundraising ka sabse bada lesson 💡", likes:18203, comments:880, time:"5h", type:"post", tags:["#Startup","#Fundraising"] },
  { id:3, mentorId:3, emoji:"🎨", bg:"linear-gradient(135deg,#fce7f3,#ede9fe)", title:"UX Portfolio Review — LIVE", caption:"LIVE portfolio roast 🔥 Submit yours in comments. Brutal feedback = best feedback.", likes:31400, comments:1560, time:"LIVE", type:"live", viewers:234, tags:["#UXDesign","#Portfolio"] },
  { id:4, mentorId:4, emoji:"💰", bg:"linear-gradient(135deg,#d1fae5,#a7f3d0)", title:"3 Term Sheet Clauses That Kill Startups", caption:"Anti-dilution, liquidation preference — samjho pehle sign karo ✍️", likes:9821, comments:203, time:"1d", type:"post", tags:["#Finance","#VC"] },
  { id:5, mentorId:5, emoji:"📈", bg:"linear-gradient(135deg,#dbeafe,#cffafe)", title:"Growth Hack: Referral Loop Formula", caption:"Ek referral loop se 0 to 500K users in 3 months. Full breakdown 👇", likes:15600, comments:670, time:"2d", type:"post", tags:["#Growth","#Marketing"] },
];

const WEBINARS = [
  { id:1, mentorId:2, title:"AI Tools se Startup Kaise Banayein", date:"LIVE NOW", attendees:234, price:0, live:true, emoji:"🚀", bg:"linear-gradient(135deg,#fef3c7,#fed7aa)" },
  { id:2, mentorId:1, title:"System Design Interview Masterclass", date:"Kal, 7:00 PM", attendees:180, price:499, live:false, emoji:"💻", bg:"linear-gradient(135deg,#dbeafe,#e0e7ff)" },
  { id:3, mentorId:3, title:"UX Portfolio Review — Live Roast", date:"17 March, 5:30 PM", attendees:95, price:299, live:false, emoji:"🎨", bg:"linear-gradient(135deg,#fce7f3,#ede9fe)" },
  { id:4, mentorId:4, title:"Startup Funding & Term Sheets 101", date:"18 March, 3:00 PM", attendees:312, price:599, live:false, emoji:"💰", bg:"linear-gradient(135deg,#d1fae5,#a7f3d0)" },
  { id:5, mentorId:5, title:"Growth Hacking: 0 to 1M Users", date:"20 March, 6:00 PM", attendees:420, price:399, live:false, emoji:"📈", bg:"linear-gradient(135deg,#dbeafe,#cffafe)" },
];

export default function App() {
  const [page, setPage] = useState("feed");
  const [bookMentor, setBookMentor] = useState(null);
  const [toast, setToast] = useState("");
  const [liked, setLiked] = useState(new Set());
  const [saved, setSaved] = useState(new Set());
  const [following, setFollowing] = useState(new Set([1]));
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };
  const toggleLike = (id) => setLiked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSave = (id) => { setSaved(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); showToast(n.has(id) ? "Saved! 🔖" : "Removed from saved"); return n; }); };
  const toggleFollow = (id) => { setFollowing(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); showToast(n.has(id) ? `Following ${MENTORS.find(m=>m.id===id)?.name}! ✓` : "Unfollowed"); return n; }); };

  const ctx = { MENTORS, POSTS, WEBINARS, page, setPage, bookMentor, setBookMentor, showToast, liked, toggleLike, saved, toggleSave, following, toggleFollow, chatOpen, setChatOpen, selectedMentor, setSelectedMentor };

  return (
    <AppContext.Provider value={ctx}>
      <div className="shell">
        <div className="phone">
          <StatusBar />
          <div className="pagearea">
            {page==="feed"     && <FeedPage />}
            {page==="explore"  && <ExplorePage />}
            {page==="reels"    && <ReelsPage />}
            {page==="webinars" && <WebinarsPage />}
            {page==="notif"    && <NotifPage />}
            {page==="profile"  && <ProfilePage />}
            {page==="mentor"   && <MentorProfilePage />}
          </div>
          <BottomNav />
          {bookMentor && <BookingModal />}
          {chatOpen   && <AIChatModal />}
          {toast      && <Toast msg={toast} />}
        </div>
      </div>
    </AppContext.Provider>
  );
}

function StatusBar() {
  const [t, setT] = useState("");
  useEffect(() => { const tick = () => setT(new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:false})); tick(); const i = setInterval(tick,10000); return ()=>clearInterval(i); }, []);
  return <div className="sbar"><span>{t}</span><div className="sicons"><span>▪▪▪</span><span>WiFi</span><span>🔋</span></div></div>;
}

function FeedPage() {
  const { MENTORS, POSTS, setPage, setBookMentor, showToast, liked, toggleLike, saved, toggleSave, setChatOpen, setSelectedMentor } = useApp();
  return (
    <div className="page">
      <div className="topbar">
        <div className="logo">MentorHub</div>
        <div className="topicons">
          <button className="ibt" onClick={() => setPage("webinars")}>🔴</button>
          <button className="ibt" onClick={() => setPage("notif")}>🔔</button>
          <button className="ibt" onClick={() => setChatOpen(true)}>🤖</button>
        </div>
      </div>
      <div className="storiesrow">
        <StoryItem name="Add Story" emoji="＋" add onClick={() => showToast("Story upload — coming soon!")} />
        {MENTORS.map(m => <StoryItem key={m.id} name={m.handle.split(".")[0]} emoji={m.avatar[0]} color={m.color} bg={m.bg} onClick={() => showToast(`${m.name} ki story: ${m.tags[0]} tips 🔥`)} />)}
      </div>
      <div className="feedscroll">
        {POSTS.map(post => {
          const mentor = MENTORS.find(m => m.id === post.mentorId);
          return (
            <div key={post.id} className="postcard">
              <div className="postheader">
                <div className="postuser" onClick={() => { setSelectedMentor(mentor); setPage("mentor"); }}>
                  <Av name={mentor.avatar} color={mentor.color} bg={mentor.bg} size={34} />
                  <div><div className="posthandle">{mentor.handle} {mentor.verified && "✦"}</div><div className="postmeta">{mentor.role} · {post.time}</div></div>
                </div>
                <button className="ibt">⋯</button>
              </div>
              <div className="postimg" style={{background:post.bg}}>
                <div className="postimginner"><div className="postemoji">{post.emoji}</div><div className="posttitle">{post.title}</div></div>
                {post.type==="live" && <div className="livebadge">● LIVE · {post.viewers} watching</div>}
                <button className="bookfloat" onClick={() => setBookMentor(mentor)}>Book 1:1</button>
              </div>
              <div className="postacts">
                <button className="abt" onClick={() => toggleLike(post.id)}>{liked.has(post.id)?"❤️":"🤍"}</button>
                <button className="abt" onClick={() => showToast(`${post.comments} comments`)}>💬</button>
                <button className="abt" onClick={() => showToast("Shared!")}>📤</button>
                <button className="abt savebt" onClick={() => toggleSave(post.id)}>{saved.has(post.id)?"🔖":"🏷️"}</button>
              </div>
              <div className="postlikes">{(post.likes+(liked.has(post.id)?1:0)).toLocaleString("en-IN")} likes</div>
              <div className="postcap"><strong>{mentor.handle}</strong> {post.caption}</div>
              <div className="posttags">{post.tags.join("  ")}</div>
            </div>
          );
        })}
        <div style={{height:20}}/>
      </div>
    </div>
  );
}

function ExplorePage() {
  const { MENTORS, setSelectedMentor, setPage, setBookMentor, following, toggleFollow, showToast } = useApp();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");
  const TABS = ["All","Tech","Business","Design","Finance","Marketing","Health"];
  const filtered = MENTORS.filter(m => (tab==="All"||m.field===tab) && (m.name.toLowerCase().includes(search.toLowerCase()) || m.tags.some(t=>t.toLowerCase().includes(search.toLowerCase()))));
  return (
    <div className="page">
      <div className="pagetitle">Explore</div>
      <div className="searchbox"><div className="sboxinner"><span>🔍</span><input placeholder="Mentors, topics, fields..." value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
      <div className="tabsrow">{TABS.map(t=><button key={t} className={`tabpill${tab===t?" on":""}`} onClick={()=>setTab(t)}>{t}</button>)}</div>
      <div className="mentorlist">
        {filtered.map(m => (
          <div key={m.id} className="mentorcard">
            <div className="mcardleft" onClick={() => {setSelectedMentor(m);setPage("mentor");}}>
              <Av name={m.avatar} color={m.color} bg={m.bg} size={50} />
              <div className="mcardinfo">
                <div className="mcardname">{m.name} {m.verified&&"✦"}</div>
                <div className="mcardrole">{m.role} @ {m.company}</div>
                <div className="mcardtags">{m.tags.slice(0,2).map(t=><span key={t} className="minitag">{t}</span>)}</div>
                <div className="mcardstats"><span>⭐ {m.rating}</span><span>👥 {m.followers}</span><span>📅 {m.sessions}</span></div>
              </div>
            </div>
            <div className="mcardright">
              <div className="mprice">₹{m.price.toLocaleString("en-IN")}/hr</div>
              <button className={`followpill${following.has(m.id)?" fw":""}`} onClick={()=>toggleFollow(m.id)}>{following.has(m.id)?"Following":"Follow"}</button>
              <button className="bookpill" onClick={()=>setBookMentor(m)}>Book</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReelsPage() {
  const { MENTORS, setBookMentor, showToast, following, toggleFollow } = useApp();
  const [cur, setCur] = useState(0);
  const [rliked, setRliked] = useState(new Set());
  const REELS = [
    { mentorId:1, title:"Top 5 System Design\nMistakes You're Making", desc:"Mistake #1: Over-engineering from day 1. Build simple, then scale 🔥", bg:"linear-gradient(160deg,#312e81,#4c1d95)", tags:["#SystemDesign","#TechTips"], views:"24.8K", comments:"412" },
    { mentorId:2, title:"Pitched 50 VCs —\n3 Said Yes. Here's How.", desc:"First 10 seconds of your pitch = 80% of the decision 🎯", bg:"linear-gradient(160deg,#78350f,#92400e)", tags:["#Startup","#Fundraising"], views:"18.2K", comments:"880" },
    { mentorId:3, title:"UX Portfolio Mistakes\nFix These NOW", desc:"Your portfolio is not a resume — it's a story 🎯", bg:"linear-gradient(160deg,#831843,#9d174d)", tags:["#UXDesign","#Portfolio"], views:"31.4K", comments:"1.5K" },
    { mentorId:4, title:"3 Term Sheet Clauses\nThat Kill Startups", desc:"Anti-dilution, liquidation preference — samjho pehle sign karo ✍️", bg:"linear-gradient(160deg,#064e3b,#065f46)", tags:["#Finance","#VC"], views:"9.8K", comments:"203" },
    { mentorId:5, title:"Growth Hack: 0 to 500K\nUsers in 3 Months", desc:"Ek referral loop se 0 to 500K users. Full breakdown 👇", bg:"linear-gradient(160deg,#1e3a5f,#1e40af)", tags:["#Growth","#Marketing"], views:"15.6K", comments:"670" },
  ];
  const EMOJIS = ["💻","🚀","🎨","💰","📈"];
  let touchY = 0;
  const swipe = (dir) => { if(dir==="up"&&cur<REELS.length-1) setCur(c=>c+1); if(dir==="down"&&cur>0) setCur(c=>c-1); };
  return (
    <div className="page reelspage"
      onTouchStart={e=>touchY=e.touches[0].clientY}
      onTouchEnd={e=>{const d=touchY-e.changedTouches[0].clientY; if(d>50)swipe("up"); if(d<-50)swipe("down");}}
      onWheel={e=>{if(e.deltaY>30)swipe("up"); if(e.deltaY<-30)swipe("down");}}>
      {REELS.map((r,i) => {
        const mentor = MENTORS.find(m=>m.id===r.mentorId);
        const cls = i===cur?"reel curreel":i<cur?"reel abovereel":"reel belowreel";
        return (
          <div key={i} className={cls} style={{background:r.bg}}>
            <div className="reelbars">{REELS.map((_,bi)=><div key={bi} className={`reelbar${bi<=i?" reeldone":""}`}/>)}</div>
            <div className="reelcenter"><div className="reelemoji">{EMOJIS[i]}</div><div className="reeltitle">{r.title.split('\n').map((l,j)=><span key={j}>{l}<br/></span>)}</div></div>
            <div className="reelright">
              <div className="reelmentorav"><Av name={mentor.avatar} color="#fff" bg="rgba(255,255,255,0.2)" size={38}/><button className="reelfollow" onClick={()=>toggleFollow(mentor.id)}>{following.has(mentor.id)?"✓":"+"}</button></div>
              <button className="reelact" onClick={()=>setRliked(p=>{const n=new Set(p);n.has(i)?n.delete(i):n.add(i);return n;})}><span className="reelacticon">{rliked.has(i)?"❤️":"🤍"}</span><span className="reelactlabel">{r.views}</span></button>
              <button className="reelact" onClick={()=>showToast(`${r.comments} comments`)}><span className="reelacticon">💬</span><span className="reelactlabel">{r.comments}</span></button>
              <button className="reelact" onClick={()=>showToast("Shared!")}><span className="reelacticon">📤</span><span className="reelactlabel">Share</span></button>
              <button className="reelact" onClick={()=>setBookMentor(mentor)}><span className="reelacticon">📅</span><span className="reelactlabel">Book</span></button>
            </div>
            <div className="reelbottom">
              <div className="reelhandle">{mentor.handle} ✦</div>
              <div className="reeldesc">{r.desc}</div>
              <div className="reeltags">{r.tags.join("  ")}</div>
            </div>
            {i===cur&&cur<REELS.length-1&&<div className="swipehint" onClick={()=>swipe("up")}>↑ swipe for next</div>}
          </div>
        );
      })}
    </div>
  );
}

function WebinarsPage() {
  const { WEBINARS, MENTORS, showToast } = useApp();
  return (
    <div className="page">
      <div className="pagetitle">Live & Upcoming Webinars</div>
      <div className="wlist">
        {WEBINARS.map(w => {
          const mentor = MENTORS.find(m=>m.id===w.mentorId);
          return (
            <div key={w.id} className="wcard" onClick={()=>showToast(w.live?`Joining: ${w.title}!`:`Registered: ${w.title}!`)}>
              <div className="wthumb" style={{background:w.bg}}><span className="wemoji">{w.emoji}</span></div>
              <div className="wbody">
                <div className={w.live?"badgelive":"badgeup"}>{w.live?"● LIVE NOW":"📅 Upcoming"}</div>
                <div className="wtitle">{w.title}</div>
                <div className="wmeta">By {mentor.name} · {w.date}</div>
                <div className="wfooter"><span className="watt">👥 {w.attendees} {w.live?"watching":"registered"}</span><button className={`wbtn${w.live?" wlive":""}`}>{w.live?"Join Free":w.price===0?"Register Free":`Join ₹${w.price}`}</button></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotifPage() {
  const { MENTORS, following, toggleFollow } = useApp();
  const notifs = [
    { mentorId:1, text:"started following you", time:"2m", follow:true },
    { mentorId:2, text:'liked your comment: "This is gold 🔥"', time:"8m" },
    { special:"📅", text:"Session Reminder: 1:1 with Priya Sharma — Aaj 5:00 PM", time:"47m", alert:true },
    { mentorId:3, text:"liked your saved post", time:"2h" },
    { mentorId:4, text:"started following you", time:"5h", follow:true },
    { special:"🏆", text:"Achievement: Early Learner — 3 sessions complete!", time:"1d" },
    { mentorId:5, text:"commented on your question", time:"2d" },
  ];
  return (
    <div className="page">
      <div className="pagetitle">Activity</div>
      <div className="notifscroll">
        <div className="notifsec">New</div>
        {notifs.map((n,i) => {
          const mentor = n.mentorId ? MENTORS.find(m=>m.id===n.mentorId) : null;
          return (
            <div key={i} className={`notifrow${n.alert?" notifalert":""}`}>
              {mentor ? <Av name={mentor.avatar} color={mentor.color} bg={mentor.bg} size={40}/> : <div className="notifspecial">{n.special}</div>}
              <div className="notiftext">{mentor&&<strong>{mentor.handle} </strong>}{n.text}<span className="notiftime"> · {n.time}</span></div>
              {n.follow&&mentor&&<button className={`followpill small${following.has(mentor.id)?" fw":""}`} onClick={()=>toggleFollow(mentor.id)}>{following.has(mentor.id)?"Following":"Follow"}</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfilePage() {
  const { showToast } = useApp();
  const [gtab, setGtab] = useState("posts");
  const HIGHLIGHTS = [{icon:"📅",name:"Sessions"},{icon:"🔖",name:"Saved"},{icon:"🎓",name:"Webinars"},{icon:"🏆",name:"Awards"},{icon:"📝",name:"Notes"}];
  const EMOJIS = ["💻","🚀","🎨","💰","📈","🤖","👥","📱","🎯","📊","⚖️","🏥"];
  const BGS = ["linear-gradient(135deg,#dbeafe,#e0e7ff)","linear-gradient(135deg,#fef3c7,#fed7aa)","linear-gradient(135deg,#fce7f3,#ede9fe)","linear-gradient(135deg,#d1fae5,#a7f3d0)","linear-gradient(135deg,#dbeafe,#cffafe)","linear-gradient(135deg,#f3f0ff,#fce7f3)","linear-gradient(135deg,#fef9c3,#fef3c7)","linear-gradient(135deg,#dbeafe,#e0e7ff)","linear-gradient(135deg,#ede9fe,#fce7f3)","linear-gradient(135deg,#d1fae5,#cffafe)","linear-gradient(135deg,#fef3c7,#fff7ed)","linear-gradient(135deg,#fce7f3,#fef9c3)"];
  return (
    <div className="page">
      <div className="profiletop">
        <div className="profileurow"><span className="profileun">rahul_learns</span><div style={{display:"flex",gap:14}}><button className="ibt" onClick={()=>showToast("New post coming soon!")}>＋</button><button className="ibt" onClick={()=>showToast("Settings")}>☰</button></div></div>
        <div className="profileirow">
          <div className="profilebigav">R</div>
          <div className="profilestats">{[["12","Posts"],["1.2K","Followers"],["340","Following"]].map(([n,l])=><div key={l} className="pstat"><div className="pstatn">{n}</div><div className="pstatl">{l}</div></div>)}</div>
        </div>
        <div className="profilename">Rahul Kumar 🚀</div>
        <div className="profilebio">Aspiring founder · Building in public<br/>Learning from India's best mentors ✦</div>
        <div className="profilelink">mentorhub.in/rahul</div>
        <div className="profilebtns"><button className="editbtn" onClick={()=>showToast("Edit profile coming soon!")}>Edit Profile</button><button className="sharebtn" onClick={()=>showToast("Profile link copied! 📋")}>📤</button></div>
        <div className="hlscroll">{HIGHLIGHTS.map(h=><div key={h.name} className="hlitem" onClick={()=>showToast(`${h.name} coming soon!`)}><div className="hlring">{h.icon}</div><div className="hlname">{h.name}</div></div>)}</div>
      </div>
      <div className="gridtabs">{[["posts","⊞"],["reels","▦"],["saved","🔖"]].map(([k,icon])=><button key={k} className={`gridtab${gtab===k?" on":""}`} onClick={()=>setGtab(k)}>{icon}</button>)}</div>
      <div className="pgrid">{EMOJIS.map((e,i)=><div key={i} className="gitem" style={{background:BGS[i]}} onClick={()=>showToast("Post detail coming soon!")}><span className="gemoji">{e}</span></div>)}</div>
    </div>
  );
}

function MentorProfilePage() {
  const { selectedMentor:m, setPage, setBookMentor, following, toggleFollow, showToast } = useApp();
  if(!m) return null;
  const EMOJIS=["💻","🚀","🎨","💰","📈","🤖"];
  const BGS=["linear-gradient(135deg,#dbeafe,#e0e7ff)","linear-gradient(135deg,#fef3c7,#fed7aa)","linear-gradient(135deg,#fce7f3,#ede9fe)","linear-gradient(135deg,#d1fae5,#a7f3d0)","linear-gradient(135deg,#dbeafe,#cffafe)","linear-gradient(135deg,#f3f0ff,#fce7f3)"];
  return (
    <div className="page">
      <div className="backbar"><button className="backbtn" onClick={()=>setPage("explore")}>← Back</button><button className="ibt" onClick={()=>showToast("Shared!")}>📤</button></div>
      <div className="mentorhero" style={{background:`linear-gradient(160deg,${m.bg},#fff)`}}>
        <Av name={m.avatar} color={m.color} bg={m.bg} size={80}/>
        <div className="mentorpname">{m.name} {m.verified&&"✦"}</div>
        <div className="mentorprole">{m.role} @ {m.company}</div>
        <div className="mentorpstats">
          <div className="mpstat"><span>{m.followers}</span><small>Followers</small></div>
          <div className="mpstat"><span>{m.sessions}</span><small>Sessions</small></div>
          <div className="mpstat"><span>⭐ {m.rating}</span><small>Rating</small></div>
        </div>
        <div className="mentorpacts">
          <button className={`followpill lg${following.has(m.id)?" fw":""}`} onClick={()=>toggleFollow(m.id)}>{following.has(m.id)?"✓ Following":"+ Follow"}</button>
          <button className="bookpill lg" onClick={()=>setBookMentor(m)}>Book Session</button>
          <button className="iconpill" onClick={()=>showToast("DM coming soon!")}>💬</button>
        </div>
      </div>
      <div className="mentorpbio">{m.bio}</div>
      <div className="mentorptags">{m.tags.map(t=><span key={t} className="mentortagchip">{t}</span>)}</div>
      <div className="divider"/>
      <div className="gridtabs"><button className="gridtab on">⊞</button><button className="gridtab" onClick={()=>showToast("Webinars tab")}>🎓</button></div>
      <div className="pgrid">{EMOJIS.map((e,i)=><div key={i} className="gitem" style={{background:BGS[i]}} onClick={()=>showToast("Post detail")}><span className="gemoji">{e}</span></div>)}</div>
    </div>
  );
}

function BookingModal() {
  const { bookMentor:m, setBookMentor, showToast } = useApp();
  const [sel, setSel] = useState("5:00 PM");
  const SLOTS = ["3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"];
  const BLOCKED = ["8:00 PM"];
  return (
    <div className="modaloverlay" onClick={e=>e.target.classList.contains("modaloverlay")&&setBookMentor(null)}>
      <div className="modalsheet">
        <div className="modalhandle"/>
        <div className="modalmentorrow"><Av name={m.avatar} color={m.color} bg={m.bg} size={48}/><div><div className="modalmentorname">{m.name}</div><div className="modalmentorsub">{m.role} · ₹{m.price.toLocaleString("en-IN")}/hr</div></div></div>
        <div className="modalsectitle">Aaj ka slot chunein</div>
        <div className="slotgrid">
          {SLOTS.map(s=><button key={s} disabled={BLOCKED.includes(s)} className={`slotbtn${sel===s?" sel":""}${BLOCKED.includes(s)?" blk":""}`} onClick={()=>!BLOCKED.includes(s)&&setSel(s)}>{s}{BLOCKED.includes(s)?" ✕":""}</button>)}
        </div>
        <div className="modaltotal">Total: ₹{m.price.toLocaleString("en-IN")} · 1 hour · Google Meet</div>
        <button className="confirmbtn" onClick={()=>{setBookMentor(null);showToast(`🎉 Session booked with ${m.name} at ${sel}!`);}}>Confirm & Pay ₹{m.price.toLocaleString("en-IN")} →</button>
      </div>
    </div>
  );
}

// ── AI Chat — uses /api/chat proxy (safe, no API key in frontend) ──────────────
function AIChatModal() {
  const { setChatOpen } = useApp();
  const [msgs, setMsgs] = useState([{ role:"ai", text:"Namaste! Main aapka AI Career Guide hoon 🤖\nKisi bhi field mein guidance chahiye? Mentor dhundna ho, career path samajhna ho — sab puchho!" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const QUICK = ["Tech mein career guide karo","Best mentor kaise chunein?","Startup ke liye kya seekhun?","Salary negotiate karna sikhao"];

  const send = async () => {
    if(!input.trim()||loading) return;
    const text = input.trim(); setInput("");
    setMsgs(p=>[...p,{role:"user",text}]); setLoading(true);
    try {
      // ✅ Calling /api/chat — API key stays safe on Vercel server
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          system:"Aap MentorHub platform ke AI Career Guide hain. Hinglish mein jawab dein (Hindi + English mix). Friendly, helpful, 3-4 sentences max. Mentor suggestions, career advice dein.",
          messages: msgs.filter(m=>m.role!=="ai").concat({role:"user",text}).map(m=>({role:m.role==="user"?"user":"assistant",content:m.text}))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Ek baar phir try karein!";
      setMsgs(p=>[...p,{role:"ai",text:reply}]);
    } catch {
      setMsgs(p=>[...p,{role:"ai",text:"Network issue hai, thodi der baad try karein 🙏"}]);
    }
    setLoading(false);
  };

  return (
    <div className="modaloverlay" onClick={e=>e.target.classList.contains("modaloverlay")&&setChatOpen(false)}>
      <div className="modalsheet aimodal">
        <div className="modalhandle"/>
        <div className="aimodalhead"><span className="aimodaltitle">🤖 AI Career Guide</span><button className="closebtn" onClick={()=>setChatOpen(false)}>✕</button></div>
        <div className="quickasks">{QUICK.map(q=><button key={q} className="quickask" onClick={()=>setInput(q)}>{q}</button>)}</div>
        <div className="chatbox">
          {msgs.map((m,i)=>(
            <div key={i} className={`chatmsg ${m.role}`}>
              {m.role==="ai"&&<span className="chatav">🤖</span>}
              <div className={`chatbubble ${m.role}`}>{m.text}</div>
              {m.role==="user"&&<span className="chatav">👤</span>}
            </div>
          ))}
          {loading&&<div className="chatmsg ai"><span className="chatav">🤖</span><div className="chatbubble ai"><div className="typingdots"><span/><span/><span/></div></div></div>}
        </div>
        <div className="aiinputrow">
          <input className="aiinput" placeholder="Apna sawaal puchho..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
          <button className="aisendbtn" onClick={send} disabled={loading}>↑</button>
        </div>
      </div>
    </div>
  );
}

function BottomNav() {
  const { page, setPage } = useApp();
  const items = [["feed","🏠"],["explore","🔍"],["reels","▶️"],["notif","🔔"],["profile","👤"]];
  return (
    <div className="bottomnav">
      {items.map(([id,icon])=>(
        <button key={id} className={`navitem${page===id||(page==="mentor"&&id==="explore")?" on":""}`} onClick={()=>setPage(id)}>
          <span className="navicon">{icon}</span>
          {(page===id||(page==="mentor"&&id==="explore"))&&<div className="navdot"/>}
        </button>
      ))}
    </div>
  );
}

function Av({name,color,bg,size}) {
  return <div style={{width:size,height:size,background:bg,color,fontSize:size*.35,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0}}>{name}</div>;
}
function StoryItem({name,emoji,add,color,bg,onClick}) {
  return (
    <div className="storyitem" onClick={onClick}>
      <div className={`storyring${add?" storyadd":""}`}><div className="storyinner" style={bg?{background:bg,color}:{}}>{add?<span style={{fontSize:18,color:"#8b5cf6"}}>＋</span>:<span style={{fontSize:20}}>{emoji}</span>}</div></div>
      <div className="storyname">{name}</div>
    </div>
  );
}
function Toast({msg}) { return <div className="toast show">{msg}</div>; }
