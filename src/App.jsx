import { useState, useEffect, useRef } from "react";

const INFO = {
  nom: "Animalons",
  tipus: "Hospital Veterinari",
  adreca: "C. Prat de la Creu 44, baixos, AD500 Andorra la Vella",
  telefon: "+376 845 454",
  whatsapp: "+376 375 454",
  whatsappLink: "https://api.whatsapp.com/send?phone=376375454",
  email: "animalons@animalons.ad",
  instagram: "@animalons_veterinari",
  facebook: "facebook.com/animalonsvet",
  web: "animalons.ad",
  horaris: {
    setmana: "Dilluns a divendres: 10:00 – 13:00 i 16:00 – 20:00",
    dissabte: "Dissabtes: 10:00 – 13:00",
    diumenge: "Diumenges: Només urgències",
    urgencies: "Urgències 24h, els 7 dies de la setmana",
  },
  especialitats: [
    "Especialistes en gats (Cat Friendly)",
    "Consultes de rutina i vacunacions",
    "Cirurgies",
    "Diagnòstic per imatge",
    "Analítiques de laboratori",
    "Hospitalització",
    "Urgències 24h",
  ],
  urgencies: [
    "Pèrdua de consciència, convulsions o no es pot valer per si mateix",
    "Vòmits continus i decaïment",
    "Vòmit o diarrea amb molta sang o de color negre",
    "Sagnats importants, ferides obertes o fractures",
    "Dificultat per respirar o mucoses blanques/morades",
    "Febre de més de 39°C",
    "Cansament exagerat",
    "Pruïja severa fins fer-se ferides",
  ],
};

function responder(texto) {
  const t = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Salutació
  if (/^(hola|buenas|hey|hi|bon dia|bona tarda|bones|hello|buen)/.test(t)) {
    return `Hola! 👋 Sóc l'assistent d'${INFO.nom}, ${INFO.tipus} a Andorra.\n\nEt puc ajudar amb informació sobre horaris, serveis, urgències, la nostra especialitat en gats i com contactar-nos 🐾`;
  }

  // Horaris
  if (/horari|hora|quan|obert|obre|tanca|obrir|open|horario|cuando/.test(t)) {
    return `Els nostres horaris són:\n\n🗓️ ${INFO.horaris.setmana}\n🗓️ ${INFO.horaris.dissabte}\n⚠️ ${INFO.horaris.diumenge}\n\n🚨 ${INFO.horaris.urgencies}\n\nNecessites alguna cosa més? 😊`;
  }

  // Diumenge
  if (/diumenge|domingo|sunday/.test(t)) {
    return `Els diumenges només atenim urgències 🚨\n\nPer urgències truca'ns al ${INFO.telefon} o al ${INFO.whatsapp} (disponible 24h).\n\nEls dies feiners obrim de 10:00 a 13:00 i de 16:00 a 20:00 🐾`;
  }

  // Dissabte
  if (/dissabte|sabado|saturday/.test(t)) {
    return `Els dissabtes obrim de 10:00 a 13:00 🕙\n\nRecorda que per urgències estem disponibles les 24h al ${INFO.whatsapp} 🚨`;
  }

  // Urgències
  if (/urgencia|urgencies|emergencia|emergency|24h|24 h|guardia|nit|noche/.test(t)) {
    return `🚨 Servei d'urgències 24h, 7 dies a la setmana!\n\nTruca'ns al:\n📞 ${INFO.telefon}\n📱 ${INFO.whatsapp} (WhatsApp)\n\nHas de trucar si el teu animal:\n• Perd la consciència o convulsiona\n• Vòmits amb sang o molt decaigut\n• Dificultat per respirar\n• Febre de més de 39°C\n• Ferides obertes o fractures\n\nNo esperis, truca'ns! 🐾`;
  }

  // Simptomes urgents
  if (/vomit|convuls|sang|sagnat|respir|febre|fractura|ferid|conscien|decaigu/.test(t)) {
    return `⚠️ Això pot ser una urgència!\n\nTruca'ns immediatament al:\n📞 ${INFO.telefon}\n📱 ${INFO.whatsapp}\n\nEstem disponibles 24h. Si ens truques abans d'arribar, prepararem el que calgui per atendre't de seguida 🚨`;
  }

  // Gats / especialitat felina
  if (/gat|cat|felino|felin|miau|moix/.test(t)) {
    return `🐱 Som especialistes en gats!\n\nTenim instal·lacions específiques per a felins:\n• Sala d'espera sense contacte visual amb gossos\n• Consulta exclusiva per a gats (Consulta 3)\n• Feromones Feliway per reduir l'estrès\n• Hospitalització individual amb llum natural\n\nEls teus gats estan en bones mans! 🐾`;
  }

  // Gossos
  if (/gos|perro|dog|canino/.test(t)) {
    return `🐶 Sí, també atenem gossos i tota mena d'animals de companyia!\n\nOfferim consultes de rutina, vacunacions, cirurgies, diagnòstics i urgències 24h.\n\nPer demanar cita truca'ns al ${INFO.telefon} 😊`;
  }

  // Serveis / què fan
  if (/servei|servicio|que fan|que ofrecen|que hacen|vacun|cirugi|operaci|analitic|diagnostic|radiograf/.test(t)) {
    return `🏥 A ${INFO.nom} oferim:\n\n${INFO.especialitats.map(s => `• ${s}`).join("\n")}\n\nPer a més informació o per demanar cita truca'ns al ${INFO.telefon} 😊`;
  }

  // Cita / visita
  if (/cita|visita|reserva|demanar|pedir|appoint|hora|consulta/.test(t)) {
    return `Per demanar cita posa't en contacte amb nosaltres:\n\n📞 ${INFO.telefon}\n📱 ${INFO.whatsapp} (WhatsApp)\n📧 ${INFO.email}\n\nHorari d'atenció:\n${INFO.horaris.setmana}\n${INFO.horaris.dissabte} 😊`;
  }

  // Ubicació
  if (/on|adreca|direccio|mapa|arribar|ubicacio|donde|location|andorra la vella/.test(t)) {
    return `📍 Ens trobes a:\n${INFO.adreca}\n\nEstem al centre d'Andorra la Vella. T'esperem! 🐾`;
  }

  // Telèfon / contacte
  if (/telefon|numero|trucar|contacte|phone|whatsapp|email|correu/.test(t)) {
    return `📞 Telèfon: ${INFO.telefon}\n📱 WhatsApp: ${INFO.whatsapp}\n📧 Email: ${INFO.email}\n\nInstagram: ${INFO.instagram}\n\nPer urgències estem disponibles les 24h! 🚨`;
  }

  // Preu / tarifa
  if (/preu|precio|cost|cuanto|quant|tarifa/.test(t)) {
    return `Per consultes sobre preus i tarifes, posa't en contacte amb nosaltres:\n\n📞 ${INFO.telefon}\n📧 ${INFO.email}\n\nT'assessorarem sense compromís 😊`;
  }

  // Instal·lacions
  if (/instal|instalacio|clinica|hospital|centre|infraestructura/.test(t)) {
    return `🏥 Les nostres instal·lacions inclouen:\n\n• Sala d'espera adaptada per a gats i gossos\n• Consultes equipades amb tecnologia avançada\n• Laboratori propi per diagnòstics ràpids\n• Quiròfan\n• Hospitalització individual\n• Box d'urgències\n\nVes a animalons.ad per veure fotos! 😊`;
  }

  // Agraïment / comiat
  if (/gracies|gracias|thank|adeu|hasta|bye|agraimen/.test(t)) {
    return `De res! Ha estat un plaer ajudar-te 😊🐾\n\nRecorda que per urgències estem disponibles les 24h al ${INFO.whatsapp}.\n\nFins aviat!`;
  }

  // Genèric
  return `Gràcies per contactar amb ${INFO.nom} 🐾\n\nEt puc ajudar amb informació sobre horaris, serveis, urgències, especialitat en gats o com arribar.\n\nO si prefereixes, truca'ns directament al ${INFO.telefon} i t'atenem encantats 😊`;
}

function getTime() {
  return new Date().toLocaleTimeString("ca", { hour: "2-digit", minute: "2-digit" });
}

const QR = ["🕐 Horaris", "🚨 Urgències", "🐱 Gats", "🏥 Serveis", "📍 Ubicació"];

export default function App() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const chatRef = useRef(null);
  const greeted = useRef(false);

  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    setTimeout(() => botReply("hola", true), 700);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, loading]);

  function botReply(text) {
    setLoading(true);
    setShowQR(false);
    setTimeout(() => {
      const reply = responder(text);
      setMsgs(prev => [...prev, { role: "bot", text: reply, time: getTime() }]);
      setLoading(false);
      setShowQR(true);
    }, 600 + Math.random() * 500);
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
