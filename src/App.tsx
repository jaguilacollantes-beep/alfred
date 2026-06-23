import { useState } from "react";

const temas = [
  { icono: "📋", titulo: "Trámites", descripcion: "DNI, empadronamiento, NIE", color: "#FF6B6B" },
  { icono: "💰", titulo: "Finanzas", descripcion: "Presupuesto, ahorro, impuestos", color: "#4ECDC4" },
  { icono: "🏠", titulo: "Vivienda", descripcion: "Alquiler, contratos, fianza", color: "#FFE66D" },
  { icono: "✈️", titulo: "Viajes", descripcion: "Documentación, seguros", color: "#A29BFE" },
];

type Mensaje = {
  rol: "usuario" | "alfred";
  texto: string;
};

function App() {
  const [pregunta, setPregunta] = useState("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(false);

  async function preguntar() {
    if (!pregunta.trim()) return;
    const nuevaMensaje: Mensaje = { rol: "usuario", texto: pregunta };
    const historialActualizado = [...mensajes, nuevaMensaje];
    setMensajes(historialActualizado);
    setPregunta("");
    setCargando(true);

    const historial = historialActualizado
      .slice(-5)
      .map((m) => `${m.rol === "usuario" ? "Usuario" : "ALFRED"}: ${m.texto}`)
      .join("\n");

    const response = await fetch("https://alfrediaactivo1.app.n8n.cloud/webhook/Chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: historial }),
    });

    const data = await response.json();
    const respuesta = data.text || data.answer || JSON.stringify(data);
    setMensajes([...historialActualizado, { rol: "alfred", texto: respuesta }]);
    setCargando(false);
  }

  function preguntaRapida(texto: string) {
    setPregunta(texto);
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#fff" }}>

      {/* HEADER */}
      <div style={{ padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 28 }}>🤖</div>
          <div style={{ fontSize: 22, fontWeight: "800", color: "#2D3436" }}>ALFRED</div>
        </div>
        <div style={{ background: "#FF6B6B", color: "#fff", borderRadius: 24, padding: "8px 20px", fontSize: 13, fontWeight: "700" }}>
          Beta gratuita ✨
        </div>
      </div>

      {/* HERO */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, padding: "60px 40px", maxWidth: 1100, margin: "0 auto", alignItems: "center" }}>
        <div>
          <div style={{ background: "#FF6B6B22", color: "#FF6B6B", borderRadius: 24, padding: "6px 16px", fontSize: 12, fontWeight: "700", display: "inline-block", marginBottom: 24, letterSpacing: 1 }}>
            VERSIÓN 1.0 YA DISPONIBLE
          </div>
          <h1 style={{ fontSize: 56, fontWeight: "900", lineHeight: 1.1, marginBottom: 20, color: "#2D3436" }}>
            La vida adulta<br />
            <span style={{ color: "#FF6B6B" }}>por fin tiene</span><br />
            manual.
          </h1>
          <p style={{ fontSize: 18, color: "#636e72", lineHeight: 1.6, marginBottom: 32, maxWidth: 420 }}>
            La guía definitiva para jóvenes de 18 a 25 años. Trámites, finanzas, vivienda y viajes bajo control.
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={() => document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "#FF6B6B", color: "#fff", border: "none", borderRadius: 32, padding: "16px 32px", fontSize: 16, fontWeight: "700", cursor: "pointer", boxShadow: "0 8px 24px rgba(255,107,107,0.4)" }}>
              Empieza gratis →
            </button>
          </div>
          <div style={{ marginTop: 24, color: "#aaa", fontSize: 13 }}>
            🎓 Proyecto ISDI AIEx 2025
          </div>
        </div>

        {/* PREVIEW CHAT */}
        <div style={{ background: "#FFF5F5", borderRadius: 24, padding: 28, boxShadow: "0 20px 60px rgba(255,107,107,0.15)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: "700", color: "#FF6B6B", fontSize: 13, marginBottom: 6 }}>🤖 ALFRED</div>
            <div style={{ color: "#2D3436", fontSize: 14, lineHeight: 1.5 }}>¡Hola! Soy tu guía para la vida adulta. ¿En qué puedo ayudarte hoy? 👋</div>
          </div>
          <div style={{ background: "#FF6B6B", borderRadius: 16, padding: 16, marginBottom: 12, marginLeft: 40 }}>
            <div style={{ color: "#fff", fontSize: 14 }}>¿Cómo me empadrono en Madrid?</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: "700", color: "#FF6B6B", fontSize: 13, marginBottom: 6 }}>🤖 ALFRED</div>
            <div style={{ color: "#2D3436", fontSize: 14, lineHeight: 1.5 }}>¡Claro! Para empadronarte necesitas: DNI en vigor, contrato de alquiler y pedir cita en tu ayuntamiento. Es gratis y tarda 15 minutos 🏛️</div>
          </div>
        </div>
      </div>

      {/* TEMAS */}
      <div style={{ background: "#FAFAFA", padding: "60px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: "800", marginBottom: 8, color: "#2D3436" }}>¿En qué puedo ayudarte?</h2>
          <p style={{ textAlign: "center", color: "#888", marginBottom: 40 }}>Haz clic en cualquier área para empezar</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {temas.map((t) => (
              <div key={t.titulo}
                onClick={() => { preguntaRapida(`¿Puedes ayudarme con ${t.titulo.toLowerCase()}?`); document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ background: "#fff", borderRadius: 20, padding: 28, textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer", borderTop: `4px solid ${t.color}` }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>{t.icono}</div>
                <div style={{ fontWeight: "700", marginBottom: 6, color: "#2D3436", fontSize: 16 }}>{t.titulo}</div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>{t.descripcion}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHAT */}
      <div id="chat" style={{ padding: "60px 40px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: "800", marginBottom: 8, color: "#2D3436" }}>Pregúntame lo que quieras</h2>
        <p style={{ textAlign: "center", color: "#888", marginBottom: 32 }}>Respondo en segundos, sin juicios y con fuentes oficiales</p>

        <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {["¿Cómo me empadrono?", "¿Cuánto debo ahorrar?", "¿Qué revisar en un alquiler?", "¿Pasaporte para Francia?"].map((q) => (
            <button key={q} onClick={() => preguntaRapida(q)}
              style={{ background: "#fff", border: "2px solid #FF6B6B", borderRadius: 24, padding: "8px 16px", fontSize: 13, cursor: "pointer", color: "#FF6B6B", fontWeight: "600" }}>
              {q}
            </button>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 24, padding: 28, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", marginBottom: 16, minHeight: 200 }}>
          {mensajes.length === 0 && (
            <div style={{ textAlign: "center", color: "#aaa", padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
              <div style={{ fontSize: 15, color: "#636e72" }}>Escribe tu primera pregunta o elige un tema arriba</div>
            </div>
          )}
          {mensajes.map((m, i) => (
            <div key={i} style={{ marginBottom: 16, display: "flex", justifyContent: m.rol === "usuario" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "75%", padding: "14px 18px", borderRadius: m.rol === "usuario" ? "20px 20px 4px 20px" : "20px 20px 20px 4px", background: m.rol === "usuario" ? "#FF6B6B" : "#F8F9FA", color: m.rol === "usuario" ? "#fff" : "#2D3436", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {m.rol === "alfred" && <div style={{ fontWeight: "700", marginBottom: 6, color: "#FF6B6B", fontSize: 12 }}>🤖 ALFRED</div>}
                {m.texto}
              </div>
            </div>
          ))}
          {cargando && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ background: "#F8F9FA", borderRadius: "20px 20px 20px 4px", padding: "14px 18px", color: "#888" }}>
                🤖 ALFRED está pensando...
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <input value={pregunta} onChange={(e) => setPregunta(e.target.value)} onKeyDown={(e) => e.key === "Enter" && preguntar()}
            placeholder="Escribe tu pregunta aquí..."
            style={{ flex: 1, padding: "16px 20px", borderRadius: 16, border: "2px solid #eee", fontSize: 15, outline: "none" }}
            onFocus={e => e.target.style.border = "2px solid #FF6B6B"}
            onBlur={e => e.target.style.border = "2px solid #eee"} />
          <button onClick={preguntar} disabled={cargando}
            style={{ background: "#FF6B6B", color: "#fff", border: "none", borderRadius: 16, padding: "16px 28px", fontSize: 15, cursor: "pointer", fontWeight: "700", boxShadow: "0 4px 16px rgba(255,107,107,0.4)" }}>
            {cargando ? "⏳" : "Enviar →"}
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "32px", color: "#aaa", fontSize: 12, borderTop: "1px solid #f0f0f0" }}>
        ALFRED · La vida adulta por fin tiene manual · Proyecto ISDI AIEx 2025
      </div>

    </div>
  );
}

export default App;
