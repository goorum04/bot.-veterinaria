import { useState, useEffect, useRef } from "react";

function getTime() {
  return new Date().toLocaleTimeString("ca", { hour: "2-digit", minute: "2-digit" });
}

const QR = ["🕐 Horaris", "🚨 Urgències", "🐱 Gats", "🏥 Serveis", "📍 Ubicació"];

export default function App() {
  const [msgs, setMsgs] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const chatRef = useRef(null);
  const greeted = useRef(false);

  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    setTimeout(() => botReply("hola"), 700);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, loading]);

  async function botReply(text) {
    setLoading(true);
    setShowQR(false);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      const reply = data.reply || "Ho sento, hi ha hagut un error. Truca'ns al +376 845 454.";
      setHistory(prev => [...prev, { role: "user", content: text }, { role: "assistant", content: reply }]);
      setMsgs(prev => [...prev, { role: "bot", text: reply, time: getTime() }]);
    } catch {
      setMsgs(prev => [...prev, { role: "bot", text: "Ho sento, hi ha hagut un error tècnic. Truca'ns al +376 845 454. 📞", time: getTime() }]);
    } finally {
      setLoading(false);
      setShowQR(true);
    }
  }

  function send(text) {
    const t = (text !== undefined ? text : input).trim();
    if (!t || loading) return;
    setInput("");
    setMsgs(prev => [...prev, { role: "user", text: t, time: getTime() }]);
    botReply(t);
  }

  return (
    <div style={c.page}>
      <div style={c.phone}>
        <div style={c.header}>
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 24 }}>‹</span>
          <div style={c.avatar}>🏥</div>
          <div style={{ flex: 1 }}>
            <div style={c.hName}>Animalons</div>
            <div style={c.hSub}>{loading ? "escrivint…" : "en línia"}</div>
          </div>
          <div style={{ display: "flex", gap: 18, color: "rgba(255,255,255,0.8)", fontSize: 18 }}>
            <span>📞</span><span>⋮</span>
          </div>
        </div>

        <div ref={chatRef} style={c.chat}>
          <div style={c.chip}>Avui</div>
          <div style={c.banner}>🤖 Demo bot WhatsApp · <strong>Animalons</strong> · Hospital Veterinari · Andorra la Vella</div>

          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", maxWidth: "78%", alignSelf: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={m.role === "user" ? c.bUser : c.bBot}>
                {m.text.split("\n").map((l, j, a) => <span key={j}>{l}{j < a.length - 1 && <br />}</span>)}
              </div>
              <div style={{ fontSize: 10.5, color: "#8696A0", marginTop: 2, textAlign: m.role === "user" ? "right" : "left" }}>
                {m.time}{m.role === "user" && <span style={{ color: "#53BDEB" }}> ✓✓</span>}
              </div>
            </div>
          ))}

          {loading && (
            <div style={c.typing}>
              <style>{`@keyframes ani{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}`}</style>
              {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:"#8696A0", animation:`ani 1.2s ${i*0.2}s infinite` }} />)}
            </div>
          )}

          {showQR && !loading && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, padding:"2px 0 6px", maxWidth:"92%", alignSelf:"flex-start" }}>
              {QR.map(q => (
                <button key={q} style={c.qr}
                  onClick={() => send(q)}
                  onMouseEnter={e => { e.currentTarget.style.background="#1a6b8a"; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.color="#1a6b8a"; }}>
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={c.bar}>
          <div style={c.box}>
            <span style={{ fontSize:22 }}>😊</span>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); }}}
              placeholder="Escriu un missatge…"
              rows={1}
              style={c.ta}
            />
            <span style={{ fontSize:20 }}>📎</span>
          </div>
          <button style={{ ...c.send, opacity: loading ? 0.5 : 1 }} onClick={() => send()} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const c = {
  page:   { minHeight:"100vh", background:"#e8f0f5", display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:"system-ui,sans-serif" },
  phone:  { width:"100%", maxWidth:420, height:"92vh", maxHeight:820, background:"#fff", borderRadius:24, overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 8px 40px rgba(0,0,0,0.18)" },
  header: { background:"#1a6b8a", padding:"14px 16px", display:"flex", alignItems:"center", gap:12, flexShrink:0 },
  avatar: { width:40, height:40, borderRadius:"50%", background:"#e8a020", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 },
  hName:  { color:"#fff", fontSize:16, fontWeight:600 },
  hSub:   { color:"rgba(255,255,255,0.7)", fontSize:12, marginTop:1 },
  chat:   { flex:1, overflowY:"auto", background:"#ECE5DD", padding:"12px 10px", display:"flex", flexDirection:"column", gap:4 },
  chip:   { alignSelf:"center", background:"rgba(255,255,255,0.85)", color:"#8696A0", fontSize:11.5, padding:"4px 10px", borderRadius:8, margin:"6px 0" },
  banner: { background:"#e8f4f8", borderLeft:"3px solid #1a6b8a", margin:"4px 0 8px", padding:"8px 12px", borderRadius:"0 8px 8px 0", fontSize:12, color:"#1a4a5e" },
  bBot:   { background:"#fff", color:"#111B21", borderRadius:8, borderTopLeftRadius:2, padding:"8px 12px 6px", fontSize:14.5, lineHeight:1.45, boxShadow:"0 1px 2px rgba(0,0,0,0.1)", wordBreak:"break-word" },
  bUser:  { background:"#DCF8C6", color:"#111B21", borderRadius:8, borderTopRightRadius:2, padding:"8px 12px 6px", fontSize:14.5, lineHeight:1.45, boxShadow:"0 1px 2px rgba(0,0,0,0.1)", wordBreak:"break-word" },
  typing: { background:"#fff", borderRadius:8, borderTopLeftRadius:2, padding:"12px 16px", display:"flex", gap:5, alignItems:"center", alignSelf:"flex-start", boxShadow:"0 1px 2px rgba(0,0,0,0.1)" },
  qr:     { background:"#fff", border:"1.5px solid #1a6b8a", color:"#1a6b8a", borderRadius:18, padding:"5px 12px", fontSize:13, cursor:"pointer", transition:"all 0.15s" },
  bar:    { background:"#F0F2F5", padding:"8px 10px", display:"flex", alignItems:"flex-end", gap:8, flexShrink:0, borderTop:"1px solid #E9EDEF" },
  box:    { flex:1, background:"#fff", borderRadius:22, display:"flex", alignItems:"flex-end", padding:"8px 14px", gap:8, boxShadow:"0 1px 2px rgba(0,0,0,0.1)" },
  ta:     { flex:1, border:"none", outline:"none", fontSize:15, color:"#111B21", resize:"none", maxHeight:100, lineHeight:1.4, background:"transparent", fontFamily:"inherit" },
  send:   { width:46, height:46, borderRadius:"50%", background:"#1a6b8a", border:"none", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer" },
};
