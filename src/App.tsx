import { useState } from "react";

const temas = [
  { icono: "📋", titulo: "Trámites", descripcion: "DNI, empadronamiento, NIE, Seguridad Social" },
  { icono: "💰", titulo: "Finanzas", descripcion: "Presupuesto, ahorro, cuentas bancarias" },
  { icono: "🏠", titulo: "Vivienda", descripcion: "Alquiler, contratos, derechos del inquilino" },
  { icono: "✈️", titulo: "Viajes", descripcion: "Documentación, seguros, presupuesto" },
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

const ultimos5 = historialActualizado.slice(-5);
const historial = ultimos5
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
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ background: "#1a1a2e", padding: "20px 40px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 32 }}>🤖</div>
        <div>
          <div style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>ALFRED</div>
          <div style={{ color: "#aaa", fontSize: 14 }}>Tu guía para la vida adulta</div>
        </div>
      </div>

      <div style={{ background: "#16213e", padding: "40px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: 32, marginBottom: 8 }}>¿Listo para conquistar la vida adulta? 💪</h1>
        <p style={{ color: "#aaa", fontSize: 18 }}>Pregúntame cualquier duda sobre trámites, finanzas, vivienda o viajes</p>
      </div>

      <div style={{ padding: "40px", maxWidth: 900, margin: "0 auto" }}>
        
        <h2 style={{ textAlign: "center", marginBottom: 24, color: "#1a1a2e" }}>¿En qué puedo ayudarte?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
          {temas.map((t) => (
            <div key={t.titulo} style={{ background: "#fff", borderRadius: 12, padding: 20, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", cursor: "pointer" }}
              onClick={() => preguntaRapida(`¿Puedes ayudarme con ${t.titulo.toLowerCase()}?`)}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{t.icono}</div>
              <div style={{ fontWeight: "bold", marginBottom: 4, color: "#1a1a2e" }}>{t.titulo}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{t.descripcion}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 32 }}>
          <p style={{ color: "#666", marginBottom: 12 }}>Preguntas frecuentes:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["¿Cómo me empadrono en Madrid?", "¿Cuánto debería ahorrar cada mes?", "¿Qué revisar antes de firmar un alquiler?", "¿Qué necesito para viajar a UK?"].map((q) => (
              <button key={q} onClick={() => preguntaRapida(q)}
                style={{ background: "#e8f4fd", border: "1px solid #b3d9f7", borderRadius: 20, padding: "8px 16px", fontSize: 13, cursor: "pointer", color: "#1a6ea8" }}>
                {q}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 16 }}>
          {mensajes.length === 0 && (
            <div style={{ textAlign: "center", color: "#aaa", padding: 20 }}>🤖 ¡Hola! Soy ALFRED. ¿En qué puedo ayudarte hoy?</div>
          )}
          {mensajes.map((m, i) => (
            <div key={i} style={{ marginBottom: 16, display: "flex", justifyContent: m.rol === "usuario" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: m.rol === "usuario" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.rol === "usuario" ? "#1a1a2e" : "#f0f4ff", color: m.rol === "usuario" ? "#fff" : "#333", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {m.rol === "alfred" && <div style={{ fontWeight: "bold", marginBottom: 4, color: "#1a1a2e" }}>🤖 ALFRED</div>}
                {m.texto}
              </div>
            </div>
          ))}
          {cargando && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
              <div style={{ background: "#f0f4ff", borderRadius: "16px 16px 16px 4px", padding: "12px 16px", color: "#666" }}>🤖 ALFRED está pensando...</div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input value={pregunta} onChange={(e) => setPregunta(e.target.value)} onKeyDown={(e) => e.key === "Enter" && preguntar()}
            placeholder="Escribe tu pregunta aquí..."
            style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "1px solid #ddd", fontSize: 15 }} />
          <button onClick={preguntar} disabled={cargando}
            style={{ background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 15, cursor: "pointer" }}>
            {cargando ? "⏳" : "Enviar →"}
          </button>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: 24, color: "#999", fontSize: 13 }}>
        ALFRED · Tu asistente para la vida adulta · Proyecto ISDI AIEx 2025
      </div>
    </div>
  );
}

export default App;
