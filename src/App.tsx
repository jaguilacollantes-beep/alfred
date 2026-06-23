import { useState } from "react";

const temas = [
  { icono: "📋", titulo: "Trámites", descripcion: "DNI, empadronamiento, NIE", color: "#FF6B6B" },
  { icono: "💰", titulo: "Finanzas", descripcion: "Presupuesto, ahorro, impuestos", color: "#4ECDC4" },
  { icono: "🏠", titulo: "Vivienda", descripcion: "Alquiler, contratos, fianza", color: "#FFE66D" },
  { icono: "✈️", titulo: "Viajes", descripcion: "Documentación, seguros", color: "#A29BFE" },
];

const itinerarios = [
  {
    icono: "🎓",
    titulo: "Llego a la Universidad",
    color: "#FF6B6B",
    pasos: [
      { fase: "Antes de empezar", items: ["Matriculación oficial y pago de tasas", "Solicitar beca MEC en becas.educacion.gob.es", "Abrir cuenta bancaria sin comisiones", "Tramitar tarjeta de transporte joven", "Conseguir el carné de estudiante"] },
      { fase: "Primeras semanas", items: ["Empadronarte si te mudas de ciudad", "Solicitar tarjeta sanitaria", "Activar correo universitario y plataformas", "Conocer servicios de la universidad", "Solicitar el Bono Cultural si eres menor de 23"] },
      { fase: "Durante el curso", items: ["Declaración de la renta si trabajas", "Renovar la beca cada año", "Solicitar Erasmus si quieres estudiar en el extranjero"] },
    ],
    pregunta: "Voy a empezar la universidad, ¿cuáles son los pasos más importantes que debo seguir?",
  },
  {
    icono: "🏙️",
    titulo: "Me mudo a una nueva ciudad",
    color: "#4ECDC4",
    pasos: [
      { fase: "Antes de mudarte", items: ["Buscar piso en Idealista o Fotocasa", "Revisar el contrato de alquiler", "Comprobar estado del piso con fotos", "Calcular gastos: alquiler + suministros + comunidad"] },
      { fase: "Primera semana", items: ["Empadronarte en el ayuntamiento", "Cambiar domicilio en banco y Hacienda", "Buscar centro de salud y médico de cabecera", "Dar de alta suministros si no están incluidos"] },
      { fase: "Primer mes", items: ["Sacar abono de transporte mensual", "Revisar primera factura de suministros", "Conocer el barrio y servicios cercanos"] },
    ],
    pregunta: "Me mudo a una nueva ciudad, ¿qué pasos debo seguir para instalarse correctamente?",
  },
  {
    icono: "🎨",
    titulo: "Quiero el Bono Cultural",
    color: "#A29BFE",
    pasos: [
      { fase: "Requisitos", items: ["Tener entre 18 y 23 años", "Ser ciudadano español o residente legal", "No haber disfrutado del bono anteriormente"] },
      { fase: "Pasos para solicitarlo", items: ["Accede a boncultura.gob.es", "Regístrate con tu DNI y datos bancarios", "Verifica tu identidad con Cl@ve", "Recibes 400€ en tu cuenta virtual en 24-48h"] },
      { fase: "Cómo usarlo", items: ["Libros, música, cine, teatro, videojuegos", "Válido en Amazon, Fnac, El Corte Inglés", "No es transferible ni canjeable en efectivo", "Úsalo antes de que caduque"] },
    ],
    pregunta: "¿Cómo puedo solicitar el Bono Cultural Joven y cómo funciona?",
  },
  {
    icono: "🏠",
    titulo: "Voy a alquilar un piso",
    color: "#FFE66D",
    pasos: [
      { fase: "Antes de firmar", items: ["Pedir el certificado energético", "Verificar que el casero es el propietario", "Revisar cláusulas abusivas", "Calcular: fianza + agencia + primer mes"] },
      { fase: "Al firmar", items: ["Hacer inventario fotográfico del piso", "Registrar el contrato en la Comunidad Autónoma", "Guardar copia del contrato firmado"] },
      { fase: "Tus derechos", items: ["El casero no puede subir más del IPC anual", "Tienes derecho a renovación hasta 5 años", "Si vende el piso tienes derecho de tanteo", "Servicio de Arbitraje gratuito si hay problemas"] },
    ],
    pregunta: "Voy a alquilar mi primer piso, ¿qué debo revisar y cuáles son mis derechos?",
  },
  {
    icono: "✈️",
    titulo: "Voy a viajar al extranjero",
    color: "#55EFC4",
    pasos: [
      { fase: "Dentro de la UE", items: ["Solo necesitas el DNI en vigor", "Tarjeta Sanitaria Europea — gratis en seg-social.es", "Avisa a tu banco para evitar bloqueos", "Descarga apps de transporte del destino"] },
      { fase: "Fuera de la UE", items: ["Pasaporte con mínimo 6 meses de validez", "Visado si es necesario — consulta exteriores.gob.es", "Seguro de viaje recomendado", "Regístrate en el MAEC si el destino tiene riesgo"] },
      { fase: "Siempre", items: ["Fotocopia del pasaporte guardada aparte", "Número de emergencias del país", "Contacto de la embajada española", "Seguro médico internacional recomendado"] },
    ],
    pregunta: "Voy a viajar al extranjero por primera vez, ¿qué documentación y pasos necesito?",
  },
];

type Mensaje = {
  rol: "usuario" | "alfred";
  texto: string;
};

function App() {
  const [pregunta, setPregunta] = useState("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(false);
  const [aceptado, setAceptado] = useState(false);
  const [itinerarioActivo, setItinerarioActivo] = useState<number | null>(null);

  async function preguntar(textoPregunta?: string) {
    const texto = textoPregunta || pregunta;
    if (!texto.trim()) return;
    const nuevaMensaje: Mensaje = { rol: "usuario", texto };
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

  function abrirItinerario(index: number) {
    setItinerarioActivo(index);
    const it = itinerarios[index];
    document.getElementById("itinerario-panel")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      preguntar(it.pregunta);
      document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" });
    }, 800);
  }

  function preguntaRapida(texto: string) {
    setPregunta(texto);
    document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" });
  }

  if (!aceptado) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", padding: 20 }}>
        <div style={{ maxWidth: 480, textAlign: "center", padding: 40, borderRadius: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🤖</div>
          <h2 style={{ fontSize: 26, fontWeight: "800", color: "#2D3436", marginBottom: 12 }}>Bienvenido a ALFRED</h2>
          <p style={{ color: "#636e72", lineHeight: 1.6, marginBottom: 24, fontSize: 15 }}>
            Soy un asistente basado en <strong>Inteligencia Artificial</strong>. La información que proporciono es <strong>orientativa</strong> y no sustituye asesoramiento profesional ni información oficial.
          </p>
          <div style={{ background: "#FFF5F5", borderRadius: 16, padding: 20, marginBottom: 24, textAlign: "left", fontSize: 14, color: "#636e72", lineHeight: 1.8 }}>
            <div>✅ Te ayudo con trámites, finanzas, vivienda y viajes</div>
            <div>⚠️ No soy abogado, asesor financiero ni funcionario</div>
            <div>📋 Consulta siempre las fuentes oficiales para decisiones importantes</div>
            <div>🔒 Tus conversaciones se guardan para mejorar el servicio</div>
          </div>
          <button onClick={() => setAceptado(true)}
            style={{ background: "#FF6B6B", color: "#fff", border: "none", borderRadius: 32, padding: "16px 40px", fontSize: 16, fontWeight: "700", cursor: "pointer", width: "100%", boxShadow: "0 8px 24px rgba(255,107,107,0.4)" }}>
            Entendido, empezar →
          </button>
          <div style={{ marginTop: 16, fontSize: 11, color: "#aaa" }}>Solo para mayores de 18 años · Proyecto ISDI AIEx 2026</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#fff" }}>
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-preview { display: none !important; }
          .hero-title { font-size: 36px !important; }
          .temas-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .itinerarios-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-padding { padding: 32px 20px !important; }
          .section-padding { padding: 40px 20px !important; }
          .chat-padding { padding: 40px 20px !important; }
          .header-padding { padding: 16px 20px !important; }
          .itinerario-fases { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* HEADER */}
      <div className="header-padding" style={{ padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 28 }}>🤖</div>
          <div style={{ fontSize: 22, fontWeight: "800", color: "#2D3436" }}>ALFRED</div>
        </div>
        <div style={{ background: "#FF6B6B", color: "#fff", borderRadius: 24, padding: "8px 16px", fontSize: 12, fontWeight: "700" }}>
          🤖 Asistente de IA · Beta gratuita
        </div>
      </div>

      {/* HERO */}
      <div className="hero-grid hero-padding" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, padding: "60px 40px", maxWidth: 1100, margin: "0 auto", alignItems: "center" }}>
        <div>
          <div style={{ background: "#FF6B6B22", color: "#FF6B6B", borderRadius: 24, padding: "6px 16px", fontSize: 12, fontWeight: "700", display: "inline-block", marginBottom: 24, letterSpacing: 1 }}>
            VERSIÓN 1.0 YA DISPONIBLE
          </div>
          <h1 className="hero-title" style={{ fontSize: 52, fontWeight: "900", lineHeight: 1.1, marginBottom: 20, color: "#2D3436" }}>
            La vida adulta<br />
            <span style={{ color: "#FF6B6B" }}>por fin tiene</span><br />
            manual.
          </h1>
          <p style={{ fontSize: 17, color: "#636e72", lineHeight: 1.6, marginBottom: 32 }}>
            La guía definitiva para jóvenes de 18 a 25 años. Trámites, finanzas, vivienda y viajes bajo control.
          </p>
          <button onClick={() => document.getElementById("itinerarios")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "#FF6B6B", color: "#fff", border: "none", borderRadius: 32, padding: "16px 32px", fontSize: 16, fontWeight: "700", cursor: "pointer", boxShadow: "0 8px 24px rgba(255,107,107,0.4)", width: "100%", maxWidth: 280 }}>
            Empieza gratis →
          </button>
          <div style={{ marginTop: 20, color: "#aaa", fontSize: 13 }}>🎓 Proyecto ISDI AIEx 2026</div>
        </div>
        <div className="hero-preview" style={{ background: "#FFF5F5", borderRadius: 24, padding: 28, boxShadow: "0 20px 60px rgba(255,107,107,0.15)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: "700", color: "#FF6B6B", fontSize: 13, marginBottom: 6 }}>🤖 ALFRED · Asistente IA</div>
            <div style={{ color: "#2D3436", fontSize: 14, lineHeight: 1.5 }}>¡Hola! Soy ALFRED, un asistente basado en IA. ¿En qué puedo ayudarte? 👋</div>
          </div>
          <div style={{ background: "#FF6B6B", borderRadius: 16, padding: 16, marginBottom: 12, marginLeft: 40 }}>
            <div style={{ color: "#fff", fontSize: 14 }}>¿Cómo me empadrono en Madrid?</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: "700", color: "#FF6B6B", fontSize: 13, marginBottom: 6 }}>🤖 ALFRED · Asistente IA</div>
            <div style={{ color: "#2D3436", fontSize: 14, lineHeight: 1.5 }}>¡Claro! Necesitas DNI en vigor y contrato de alquiler. Es gratis 🏛️ ⚠️ Consulta tu ayuntamiento para información oficial.</div>
          </div>
        </div>
      </div>

      {/* TEMAS */}
      <div className="section-padding" style={{ background: "#FAFAFA", padding: "60px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: "800", marginBottom: 8, color: "#2D3436" }}>¿En qué puedo ayudarte?</h2>
          <p style={{ textAlign: "center", color: "#888", marginBottom: 32, fontSize: 15 }}>Toca cualquier área para empezar</p>
          <div className="temas-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {temas.map((t) => (
              <div key={t.titulo} onClick={() => preguntaRapida(`¿Puedes ayudarme con ${t.titulo.toLowerCase()}?`)}
                style={{ background: "#fff", borderRadius: 20, padding: 24, textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer", borderTop: `4px solid ${t.color}` }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{t.icono}</div>
                <div style={{ fontWeight: "700", marginBottom: 6, color: "#2D3436", fontSize: 15 }}>{t.titulo}</div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>{t.descripcion}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ITINERARIOS */}
      <div id="itinerarios" className="section-padding" style={{ padding: "60px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: "800", marginBottom: 8, color: "#2D3436" }}>🗺️ Itinerarios de vida adulta</h2>
          <p style={{ textAlign: "center", color: "#888", marginBottom: 32, fontSize: 15 }}>Elige tu momento vital y te guío paso a paso</p>
          <div className="itinerarios-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
            {itinerarios.map((it, i) => (
              <div key={it.titulo} onClick={() => abrirItinerario(i)}
                style={{ background: "#fff", borderRadius: 20, padding: 24, cursor: "pointer", boxShadow: itinerarioActivo === i ? `0 8px 32px ${it.color}44` : "0 4px 16px rgba(0,0,0,0.06)", border: itinerarioActivo === i ? `2px solid ${it.color}` : "2px solid transparent", transition: "all 0.2s" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{it.icono}</div>
                <div style={{ fontWeight: "700", color: "#2D3436", fontSize: 15, marginBottom: 6 }}>{it.titulo}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{it.pasos.length} fases · {it.pasos.reduce((a, f) => a + f.items.length, 0)} pasos</div>
                {itinerarioActivo === i && (
                  <div style={{ marginTop: 8, background: it.color, color: "#fff", borderRadius: 12, padding: "4px 10px", fontSize: 11, fontWeight: "700", display: "inline-block" }}>
                    ✓ Activo
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* PANEL DEL ITINERARIO ACTIVO */}
          {itinerarioActivo !== null && (
            <div id="itinerario-panel" style={{ background: "#FAFAFA", borderRadius: 24, padding: 32, border: `2px solid ${itinerarios[itinerarioActivo].color}22` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ fontSize: 40 }}>{itinerarios[itinerarioActivo].icono}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: "800", color: "#2D3436" }}>{itinerarios[itinerarioActivo].titulo}</div>
                  <div style={{ fontSize: 14, color: "#888" }}>Guía paso a paso · ALFRED te ayuda en el chat</div>
                </div>
              </div>
              <div className="itinerario-fases" style={{ display: "grid", gridTemplateColumns: `repeat(${itinerarios[itinerarioActivo].pasos.length}, 1fr)`, gap: 16 }}>
                {itinerarios[itinerarioActivo].pasos.map((fase, fi) => (
                  <div key={fi} style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontWeight: "700", color: itinerarios[itinerarioActivo].color, fontSize: 13, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {fi + 1}. {fase.fase}
                    </div>
                    {fase.items.map((item, ii) => (
                      <div key={ii} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: "#636e72", lineHeight: 1.4 }}>
                        <span style={{ color: itinerarios[itinerarioActivo].color, flexShrink: 0 }}>✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <button onClick={() => { preguntar(itinerarios[itinerarioActivo].pregunta); document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" }); }}
                  style={{ background: itinerarios[itinerarioActivo].color, color: "#fff", border: "none", borderRadius: 24, padding: "12px 28px", fontSize: 14, fontWeight: "700", cursor: "pointer" }}>
                  💬 Preguntarle más a ALFRED sobre esto →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CHAT */}
      <div id="chat" className="chat-padding" style={{ padding: "60px 40px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: "800", marginBottom: 8, color: "#2D3436" }}>Pregúntame lo que quieras</h2>
        <p style={{ textAlign: "center", color: "#888", marginBottom: 28, fontSize: 15 }}>Respondo en segundos, con fuentes oficiales</p>

        <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {["¿Cómo me empadrono?", "¿Cuánto debo ahorrar?", "¿Qué revisar en un alquiler?", "¿Pasaporte para Francia?"].map((q) => (
            <button key={q} onClick={() => preguntaRapida(q)}
              style={{ background: "#fff", border: "2px solid #FF6B6B", borderRadius: 24, padding: "8px 16px", fontSize: 13, cursor: "pointer", color: "#FF6B6B", fontWeight: "600" }}>
              {q}
            </button>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 24, padding: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", marginBottom: 16, minHeight: 180 }}>
          {mensajes.length === 0 && (
            <div style={{ textAlign: "center", color: "#aaa", padding: 32 }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>💬</div>
              <div style={{ fontSize: 15, color: "#636e72" }}>Elige un itinerario arriba o escribe tu pregunta</div>
            </div>
          )}
          {mensajes.map((m, i) => (
            <div key={i} style={{ marginBottom: 16, display: "flex", justifyContent: m.rol === "usuario" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "80%", padding: "14px 18px", borderRadius: m.rol === "usuario" ? "20px 20px 4px 20px" : "20px 20px 20px 4px", background: m.rol === "usuario" ? "#FF6B6B" : "#F8F9FA", color: m.rol === "usuario" ? "#fff" : "#2D3436", lineHeight: 1.6, whiteSpace: "pre-wrap", fontSize: 15 }}>
                {m.rol === "alfred" && <div style={{ fontWeight: "700", marginBottom: 6, color: "#FF6B6B", fontSize: 12 }}>🤖 ALFRED · Asistente IA</div>}
                {m.texto}
              </div>
            </div>
          ))}
          {cargando && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ background: "#F8F9FA", borderRadius: "20px 20px 20px 4px", padding: "14px 18px", color: "#888", fontSize: 15 }}>
                🤖 ALFRED está pensando...
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <input value={pregunta} onChange={(e) => setPregunta(e.target.value)} onKeyDown={(e) => e.key === "Enter" && preguntar()}
            placeholder="Escribe tu pregunta..."
            style={{ flex: 1, padding: "14px 18px", borderRadius: 16, border: "2px solid #eee", fontSize: 15, outline: "none" }}
            onFocus={e => e.target.style.border = "2px solid #FF6B6B"}
            onBlur={e => e.target.style.border = "2px solid #eee"} />
          <button onClick={() => preguntar()} disabled={cargando}
            style={{ background: "#FF6B6B", color: "#fff", border: "none", borderRadius: 16, padding: "14px 22px", fontSize: 15, cursor: "pointer", fontWeight: "700", boxShadow: "0 4px 16px rgba(255,107,107,0.4)" }}>
            {cargando ? "⏳" : "→"}
          </button>
        </div>

        <div style={{ marginTop: 16, padding: 16, background: "#FFF5F5", borderRadius: 12, fontSize: 12, color: "#aaa", textAlign: "center", lineHeight: 1.6 }}>
          ⚠️ La información proporcionada por ALFRED es orientativa y no sustituye asesoramiento profesional ni información oficial.
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "24px", color: "#aaa", fontSize: 12, borderTop: "1px solid #f0f0f0" }}>
        <div style={{ marginBottom: 6 }}>🤖 ALFRED es un asistente de Inteligencia Artificial. La información proporcionada es orientativa y no sustituye asesoramiento profesional.</div>
        <div>ALFRED · La vida adulta por fin tiene manual · Proyecto ISDI AIEx 2026</div>
      </div>

    </div>
  );
}

export default App;
