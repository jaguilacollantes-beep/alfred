import { useState, useRef, useEffect } from "react";

// ─── Datos ───────────────────────────────────────────────────────────────────

const itinerarios = [
  {
    icono: "🎂", titulo: "Acabo de cumplir 18 años", color: "#FF6B6B",
    descripcion: "Tu hoja de ruta al llegar a la mayoría de edad",
    preguntas: [
      { texto: "¿Ya tienes DNI de adulto o el de menor?", opciones: ["Tengo el de adulto", "Tengo el de menor", "No lo sé"] },
      { texto: "¿Estudias, trabajas o ninguna de las dos?", opciones: ["Estudio", "Trabajo", "Las dos", "Por ahora ninguna"] },
    ],
    pasos: [
      { fase: "Documentación obligatoria", items: ["Renueva el DNI de adulto — cita en interior.gob.es", "Saca el pasaporte si no tienes — 30€ y 10 años de vigencia", "Considera sacarte el carné de conducir (B)", "Crea tu cuenta en importass.gob.es"] },
      { fase: "Finanzas personales", items: ["Abre una cuenta bancaria de adulto sin comisiones", "Aprende la regla 50/30/20: necesidades/ocio/ahorro", "Descarga una app de control de gastos", "Si trabajas: guarda tus nóminas y entiende tu nómina"] },
      { fase: "Salud y derechos", items: ["Solicita tu tarjeta sanitaria propia en tu centro de salud", "Pide el Bono Cultural Joven — 400€ en boncultura.gob.es (plazo: 22 jun - 31 oct)", "Novedad 2026: el bono también vale para instrumentos, material artístico y formación cultural", "Eres penalmente responsable como adulto — conoce tus derechos"] },
      { fase: "Educación y futuro", items: ["Solicita beca MEC si vas a la universidad", "Investiga el Carné Joven Europeo para descuentos", "Considera FP si no vas a la universidad", "Aprende habilidades básicas del hogar"] },
    ],
  },
  {
    icono: "🎓", titulo: "Llego a la Universidad", color: "#4ECDC4",
    descripcion: "Todo lo que necesitas al empezar tus estudios",
    preguntas: [
      { texto: "¿Te mudas de ciudad para estudiar?", opciones: ["Sí, me mudo", "No, sigo en casa", "No lo sé aún"] },
      { texto: "¿Ya solicitaste la beca MEC?", opciones: ["Sí, ya la pedí", "No, no sé cómo", "No me corresponde"] },
    ],
    pasos: [
      { fase: "Antes de empezar", items: ["Matriculación oficial y pago de tasas", "Solicitar beca MEC en becas.educacion.gob.es", "Abrir cuenta bancaria sin comisiones", "Tramitar tarjeta de transporte joven"] },
      { fase: "Primeras semanas", items: ["Empadronarte si te mudas de ciudad", "Solicitar tarjeta sanitaria", "Activar correo universitario y plataformas", "Solicitar el Bono Cultural si cumples 18 años este año"] },
      { fase: "Durante el curso", items: ["Declaración de la renta si trabajas", "Renovar la beca cada año", "Solicitar Erasmus si quieres estudiar fuera"] },
    ],
  },
  {
    icono: "🏙️", titulo: "Me mudo a una nueva ciudad", color: "#A29BFE",
    descripcion: "Pasos esenciales para instalarte en tu nuevo hogar",
    preguntas: [
      { texto: "¿Ya tienes piso o estás buscando?", opciones: ["Ya tengo piso", "Todavía buscando", "No sé por dónde empezar"] },
      { texto: "¿Sabes qué es el empadronamiento?", opciones: ["Sí, lo tengo claro", "No muy bien", "Para nada"] },
    ],
    pasos: [
      { fase: "Antes de mudarte", items: ["Buscar piso en Idealista o Fotocasa", "Revisar el contrato de alquiler", "Comprobar estado del piso con fotos", "Calcular gastos: alquiler + suministros + comunidad"] },
      { fase: "Primera semana", items: ["Empadronarte en el ayuntamiento", "Cambiar domicilio en banco y Hacienda", "Buscar centro de salud y médico de cabecera", "Dar de alta suministros si no están incluidos"] },
      { fase: "Primer mes", items: ["Sacar abono de transporte mensual", "Revisar primera factura de suministros", "Conocer el barrio y servicios cercanos"] },
    ],
  },
  {
    icono: "🎨", titulo: "Quiero el Bono Cultural", color: "#55EFC4",
    descripcion: "400€ gratuitos — SOLO para quienes cumplen 18 años en 2026 (nacidos en 2008)",
    preguntas: [
      { texto: "¿Cumples exactamente 18 años este año 2026?", opciones: ["Sí, nazco en 2008", "No, soy de otro año", "No estoy seguro"] },
    ],
    pasos: [
      { fase: "Requisitos", items: ["Cumplir exactamente 18 años en 2026 (nacidos en 2008)", "Ser ciudadano español o residente legal", "No haber disfrutado del bono anteriormente", "Plazo 2026: solicitar entre el 22 de junio y el 31 de octubre"] },
      { fase: "Cómo solicitarlo", items: ["Accede a boncultura.gob.es", "Regístrate con tu DNI y verificación Cl@ve", "Recibes 400€ en tarjeta prepago virtual en 24-48h", "Tienes 1 año desde la concesión para gastarlo"] },
      { fase: "Cómo usarlo en 2026", items: ["Libros, música, cine, teatro, videojuegos, podcasts", "NOVEDAD: instrumentos musicales y material artístico", "NOVEDAD: cursos y talleres culturales presenciales u online", "Válido en Amazon, Fnac, El Corte Inglés y ~4.000 comercios"] },
    ],
  },
  {
    icono: "🏠", titulo: "Voy a alquilar un piso", color: "#FFE66D",
    descripcion: "Tus derechos y pasos para alquilar con seguridad",
    preguntas: [
      { texto: "¿Ya encontraste el piso o estás buscando?", opciones: ["Ya lo encontré", "Todavía buscando", "Empezando a buscar"] },
      { texto: "¿Conoces tus derechos como inquilino?", opciones: ["Sí, los conozco", "Algo, pero no todo", "No tengo ni idea"] },
    ],
    pasos: [
      { fase: "Antes de firmar", items: ["Pedir el certificado energético", "Verificar que el casero es el propietario", "Revisar cláusulas abusivas", "Calcular: fianza + agencia + primer mes"] },
      { fase: "Al firmar", items: ["Hacer inventario fotográfico del piso", "Registrar el contrato en la Comunidad Autónoma", "Guardar copia del contrato firmado"] },
      { fase: "Tus derechos", items: ["El casero no puede subir más del IPC anual", "Tienes derecho a renovación hasta 5 años", "Si vende el piso tienes derecho de tanteo", "Arbitraje gratuito si hay problemas"] },
    ],
  },
  {
    icono: "✈️", titulo: "Voy a viajar al extranjero", color: "#FDCB6E",
    descripcion: "Documentación y consejos para viajar sin problemas",
    preguntas: [
      { texto: "¿A dónde vas? ¿Dentro o fuera de la UE?", opciones: ["Dentro de la UE", "Fuera de la UE", "Aún no lo sé"] },
    ],
    pasos: [
      { fase: "Dentro de la UE", items: ["Solo necesitas el DNI en vigor", "Tarjeta Sanitaria Europea — gratis en seg-social.es", "Avisa a tu banco para evitar bloqueos", "Descarga apps de transporte del destino"] },
      { fase: "Fuera de la UE", items: ["Pasaporte con mínimo 6 meses de validez", "Visado si es necesario — exteriores.gob.es", "Seguro de viaje recomendado", "Regístrate en el MAEC si hay riesgo"] },
      { fase: "Siempre", items: ["Fotocopia del pasaporte guardada aparte", "Número de emergencias del país", "Contacto de la embajada española", "Seguro médico internacional recomendado"] },
    ],
  },
  {
    icono: "💼", titulo: "Busco mi primer empleo", color: "#74B9FF",
    descripcion: "Cómo encontrar trabajo y conocer tus derechos laborales",
    preguntas: [
      { texto: "¿Tienes ya el CV hecho?", opciones: ["Sí, está listo", "Tengo algo pero mejorable", "No, empezando desde cero"] },
      { texto: "¿Sabes cuál es el SMI en 2026?", opciones: ["Sí, 1.221€/mes", "No lo sé", "Tengo dudas"] },
    ],
    pasos: [
      { fase: "Antes de empezar", items: ["Crea tu CV actualizado y perfil en LinkedIn", "Regístrate como demandante de empleo en sepe.es", "Obtén tu número de afiliación a la Seguridad Social", "Investiga empresas y sectores que te interesan"] },
      { fase: "El contrato", items: ["Firma el contrato ANTES de empezar a trabajar", "Verifica que el contrato es indefinido o temporal con fecha", "Comprueba que el salario es igual o mayor al SMI (1.221€/mes en 2026)", "Asegúrate de que te dan de alta en la Seguridad Social"] },
      { fase: "Tus derechos", items: ["30 días de vacaciones anuales mínimo", "Las horas extra deben pagarse o compensarse", "Tienes derecho a nómina mensual detallada", "Puedes reclamar al SEPE si hay irregularidades"] },
    ],
  },
  {
    icono: "🏥", titulo: "Necesito atención médica", color: "#FD79A8",
    descripcion: "Cómo acceder al sistema sanitario público",
    preguntas: [
      { texto: "¿Tienes tarjeta sanitaria propia?", opciones: ["Sí la tengo", "No, uso la de mis padres", "No tengo"] },
    ],
    pasos: [
      { fase: "Lo primero", items: ["Solicita tu tarjeta sanitaria en tu centro de salud con el DNI", "Asegúrate de estar empadronado en tu municipio", "Identifica tu centro de salud y médico de cabecera asignado", "Guarda el teléfono de urgencias: 112"] },
      { fase: "Atención primaria", items: ["Pide cita con tu médico de cabecera por teléfono o app", "Para urgencias no graves: ve al centro de salud", "Para urgencias graves: urgencias del hospital o llama al 112", "Puedes pedir cita con especialista a través de tu médico"] },
      { fase: "Salud mental", items: ["Pide derivación a psicólogo a través de tu médico de cabecera", "Desde los 18 años puedes pedir cita sin consentimiento parental", "Muchas universidades tienen psicología gratuita", "Si es urgente llama al 024 (línea de atención a conducta suicida)"] },
    ],
  },
  {
    icono: "💰", titulo: "Quiero empezar a ahorrar", color: "#00CEC9",
    descripcion: "Hábitos y estrategias para gestionar tu dinero",
    preguntas: [
      { texto: "¿Tienes ingresos propios ahora mismo?", opciones: ["Sí, trabajo", "Solo beca o ayuda familiar", "No tengo ingresos"] },
    ],
    pasos: [
      { fase: "Organiza tus finanzas", items: ["Calcula tus ingresos y gastos mensuales reales", "Aplica la regla 50/30/20: necesidades/ocio/ahorro", "Abre una cuenta de ahorro separada de la de gastos", "Usa una app de control de gastos (Fintonic, Money Manager)"] },
      { fase: "Reduce gastos", items: ["Revisa suscripciones activas y elimina las que no uses", "Cocina en casa más que comer fuera", "Usa transporte público o bicicleta", "Compara precios antes de compras grandes"] },
      { fase: "Empieza a invertir", items: ["Crea un fondo de emergencia de 3-6 meses de gastos", "Infórmate sobre fondos indexados para largo plazo", "Consulta con un asesor financiero antes de invertir", "Nunca inviertas dinero que no puedas permitirte perder"] },
    ],
  },
  {
    icono: "🚗", titulo: "Quiero sacarme el carné", color: "#E17055",
    descripcion: "Pasos para obtener el permiso de conducir en España",
    preguntas: [
      { texto: "¿Ya tienes los 18 años cumplidos?", opciones: ["Sí", "No, todavía no", "Los cumplo pronto"] },
    ],
    pasos: [
      { fase: "Requisitos previos", items: ["Tener 18 años cumplidos (B)", "DNI o NIE en vigor", "Reconocimiento médico en centro autorizado (~25€)", "Foto reciente tamaño carné"] },
      { fase: "Examen teórico", items: ["Regístrate en la DGT en sede.dgt.gob.es", "Estudia el temario oficial — hay apps gratuitas", "Paga las tasas del examen (~94€)", "El examen tiene 30 preguntas — necesitas 27 correctas"] },
      { fase: "Examen práctico", items: ["Apúntate a una autoescuela para las clases prácticas", "Mínimo 3 meses tras aprobar el teórico para presentarte", "El examen dura unos 25 minutos en circuito urbano", "Si suspendes puedes repetir pagando nuevas tasas"] },
    ],
  },
];

const SITUACIONES = [
  { emoji: "🎂", label: "Acabo de cumplir 18", itinerario: 0 },
  { emoji: "🎓", label: "Empiezo la uni", itinerario: 1 },
  { emoji: "🏠", label: "Me voy a vivir solo", itinerario: 2 },
  { emoji: "💼", label: "Busco trabajo", itinerario: 6 },
  { emoji: "✈️", label: "Voy a viajar", itinerario: 5 },
  { emoji: "💰", label: "Quiero ahorrar", itinerario: 8 },
];

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Pantalla = "terminos" | "hero" | "preguntas" | "app";
type TabApp = "itinerario" | "chat" | "temas";
type Mensaje = { rol: "usuario" | "alfred"; texto: string };
type Intercambio = { pregunta: string; respuesta: string };
type Recordatorio = { titulo: string; fecha: string; descripcion: string };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generarICS(r: Recordatorio): void {
  const fecha = r.fecha.replace(/-/g, "");
  const ahora = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ALFRED//ES", "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${fecha}`, `DTEND;VALUE=DATE:${fecha}`, `DTSTAMP:${ahora}`,
    `SUMMARY:${r.titulo}`,
    `DESCRIPTION:${r.descripcion} — Recordatorio creado por ALFRED`,
    "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY",
    `DESCRIPTION:Recordatorio: ${r.titulo}`, "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${r.titulo.replace(/\s+/g, "_")}.ics`; a.click();
  URL.revokeObjectURL(url);
}

function limpiarInline(texto: string): React.ReactNode {
  const resultado: React.ReactNode[] = [];
  const fullRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s),]+)/g;
  let lastIndex = 0; let match; let i = 0;
  fullRegex.lastIndex = 0;
  while ((match = fullRegex.exec(texto)) !== null) {
    if (match.index > lastIndex) resultado.push(texto.slice(lastIndex, match.index));
    if (match[1] && match[2]) {
      resultado.push(<a key={i++} href={match[2]} target="_blank" rel="noopener noreferrer" className="alfred-link">🔗 {match[1].replace(/🔗\s?/, "")}</a>);
    } else if (match[3]) {
      resultado.push(<strong key={i++} style={{ color: "#2D3436" }}>{match[3]}</strong>);
    } else if (match[4]) {
      const dominio = match[4].replace(/https?:\/\//, "").replace(/\/.*/, "");
      resultado.push(<a key={i++} href={match[4]} target="_blank" rel="noopener noreferrer" className="alfred-link">🔗 {dominio}</a>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < texto.length) resultado.push(texto.slice(lastIndex));
  return resultado.length === 1 ? resultado[0] : <>{resultado}</>;
}

function RespuestaFormateada({ texto }: { texto: string }) {
  const lineas = texto.split("\n").filter(l => l.trim() !== "");
  const elementos: React.ReactNode[] = [];
  let listaActual: string[] = [];
  let listaOrdenada: string[] = [];

  function flushLista() {
    if (listaActual.length > 0) {
      const items = [...listaActual];
      elementos.push(<ul key={`ul-${elementos.length}`} style={{ margin: "8px 0", paddingLeft: 20 }}>{items.map((item, i) => <li key={i} style={{ marginBottom: 6, fontSize: 14, color: "#2D3436", lineHeight: 1.55 }}>{limpiarInline(item)}</li>)}</ul>);
      listaActual = [];
    }
    if (listaOrdenada.length > 0) {
      const items = [...listaOrdenada];
      elementos.push(<ol key={`ol-${elementos.length}`} style={{ margin: "8px 0", paddingLeft: 22 }}>{items.map((item, i) => <li key={i} style={{ marginBottom: 6, fontSize: 14, color: "#2D3436", lineHeight: 1.55 }}>{limpiarInline(item)}</li>)}</ol>);
      listaOrdenada = [];
    }
  }

  lineas.forEach((linea, idx) => {
    const t = linea.trim();
    if (t.startsWith("📌 FUENTE OFICIAL") || t.startsWith("✅ Información obtenida") || t.startsWith("🔗 Tramitar en:")) {
      flushLista();
      if (t.startsWith("🔗")) {
        const urlMatch = t.match(/https?:\/\/[^\s)\]]+/);
        const url = urlMatch ? urlMatch[0] : null;
        const dominio = url ? url.replace(/https?:\/\//, "").replace(/\/.*/, "") : "";
        elementos.push(
          <div key={idx} style={{ marginTop: 4, fontSize: 12, color: "#FF6B6B", fontWeight: "600" }}>
            {url ? <span>🔗 Tramitar en: <a href={url} target="_blank" rel="noopener noreferrer" className="alfred-link">{dominio}</a></span> : t}
          </div>
        );
      } else {
        elementos.push(<div key={idx} style={{ marginTop: 14, fontSize: 12, color: "#2D6A4F", fontWeight: "700" }}>{t}</div>);
      }
      return;
    }
    if (t.startsWith("⚠️")) { flushLista(); elementos.push(<div key={idx} style={{ marginTop: 14, padding: "10px 14px", background: "#FFF8E1", borderRadius: 10, fontSize: 12, color: "#888", lineHeight: 1.5 }}>{t}</div>); return; }
    if (t.startsWith("[RECORDATORIO")) { flushLista(); elementos.push(<div key={idx} style={{ marginTop: 10, padding: "8px 14px", background: "#FFF0F0", borderRadius: 10, fontSize: 12, color: "#FF6B6B", fontWeight: 600 }}>📅 {t.replace(/\[RECORDATORIO:?\s*/i, "").replace("]", "")}</div>); return; }
    if (/^\*\*[^*]+\*\*[:\s]*$/.test(t) || /^#{1,3}\s/.test(t)) { flushLista(); const tx = t.replace(/\*\*/g, "").replace(/^#{1,3}\s/, "").replace(/:$/, ""); elementos.push(<div key={idx} style={{ marginTop: 16, marginBottom: 4, fontWeight: "700", fontSize: 14, color: "#FF6B6B", borderLeft: "3px solid #FF6B6B", paddingLeft: 10 }}>{tx}</div>); return; }
    if (/^[-•]\s/.test(t)) { listaActual.push(t.replace(/^[-•]\s/, "")); return; }
    if (/^\d+[.)]\s/.test(t)) { listaOrdenada.push(t.replace(/^\d+[.)]\s/, "")); return; }
    flushLista();
    if (t) elementos.push(<p key={idx} style={{ margin: "6px 0", fontSize: 14, color: "#2D3436", lineHeight: 1.65 }}>{limpiarInline(t)}</p>);
  });
  flushLista();
  return <div style={{ paddingTop: 2 }}>{elementos}</div>;
}

function IntercambioColapsado({ intercambio, index, formRec, setFormRec }: { intercambio: Intercambio; index: number; formRec: Recordatorio; setFormRec: (r: Recordatorio) => void }) {
  const [expandido, setExpandido] = useState(false);
  const [mostrarRec, setMostrarRec] = useState(false);
  return (
    <div style={{ marginBottom: 10 }}>
      <div onClick={() => setExpandido(!expandido)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: expandido ? "#FFF5F5" : "#f8f9fa", border: expandido ? "1.5px solid #FF6B6B44" : "1.5px solid #eee", borderRadius: expandido ? "16px 16px 0 0" : 16, padding: "10px 16px", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#FF6B6B", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: "700", flexShrink: 0 }}>{index + 1}</div>
          <span style={{ fontSize: 13, color: "#2D3436", fontWeight: "600" }}>{intercambio.pregunta.length > 80 ? intercambio.pregunta.slice(0, 80) + "…" : intercambio.pregunta}</span>
        </div>
        <span style={{ fontSize: 12, color: "#aaa", flexShrink: 0, marginLeft: 8 }}>{expandido ? "▲ cerrar" : "▼ ver respuesta"}</span>
      </div>
      {expandido && (
        <div style={{ border: "1.5px solid #FF6B6B44", borderTop: "none", borderRadius: "0 0 16px 16px", background: "#fff", padding: "16px 18px" }}>
          <div style={{ fontWeight: "700", color: "#FF6B6B", fontSize: 11, marginBottom: 10 }}>🤖 ALFRED · Asistente IA</div>
          <RespuestaFormateada texto={intercambio.respuesta} />
          <div style={{ marginTop: 12, borderTop: "1px solid #f0f0f0", paddingTop: 10 }}>
            {!mostrarRec ? (
              <button onClick={() => setMostrarRec(true)} style={{ background: "none", border: "1px solid #FF6B6B44", borderRadius: 8, padding: "5px 12px", fontSize: 11, color: "#FF6B6B", cursor: "pointer" }}>📅 Añadir recordatorio</button>
            ) : (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <input placeholder="Título" value={formRec.titulo} onChange={e => setFormRec({ ...formRec, titulo: e.target.value })} style={{ flex: 1, minWidth: 120, padding: "6px 10px", borderRadius: 8, border: "1px solid #eee", fontSize: 12 }} />
                <input type="date" value={formRec.fecha} onChange={e => setFormRec({ ...formRec, fecha: e.target.value })} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #eee", fontSize: 12 }} />
                <button onClick={() => { if (!formRec.titulo || !formRec.fecha) return; generarICS(formRec); setMostrarRec(false); }} style={{ background: "#FF6B6B", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: "700", cursor: "pointer" }}>📥 Descargar</button>
                <button onClick={() => setMostrarRec(false)} style={{ background: "#f0f0f0", color: "#888", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>✕</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── App principal ────────────────────────────────────────────────────────────

function App() {
  const [pantalla, setPantalla] = useState<Pantalla>("terminos");
  const [tabApp, setTabApp] = useState<TabApp>("itinerario");
  const [situacionElegida, setSituacionElegida] = useState<string>("");
  const [itinerarioActivo, setItinerarioActivo] = useState<number>(0);
  const [itinerarioProgreso, setItinerarioProgreso] = useState<Record<string, boolean>>(() => {
    try { const saved = localStorage.getItem('alfred_progreso'); return saved ? JSON.parse(saved) : {}; } catch(e) { return {}; }
  });
  const [descartadas, setDescartadas] = useState<Set<string>>(new Set());

  function descartarTarjeta(id: string) {
    setDescartadas(prev => new Set([...prev, id]));
  }

  function generarAcciones(): { id: string; urgencia: string; titulo: string; desc: string; color: string; url: string; secundaria?: boolean }[] {
    const mes = new Date().getMonth() + 1;
    const acciones = [];
    const sit = situacionElegida.toLowerCase();

    // Bono Cultural — SOLO si el usuario eligió explícitamente 18 años o bono cultural
    const eligio18 = sit.includes("18") || sit.includes("bono") || sit.includes("cumpl");
    if (mes >= 6 && mes <= 10 && eligio18) {
      acciones.push({ id: "bono", urgencia: "Caduca el 31 de octubre · Solo nacidos en 2008", titulo: "Bono Cultural 2026 — 400€ gratis", desc: "⚠️ Exclusivo para quienes cumplen exactamente 18 años en 2026 (nacidos en 2008).", color: "#FF6B6B", url: "https://www.boncultura.gob.es/inicio" });
    }
    // Renta — abril a junio
    if (mes >= 4 && mes <= 6) {
      acciones.push({ id: "renta", urgencia: "Plazo hasta el 30 de junio", titulo: "Declaración de la renta 2025", desc: "Si trabajaste en 2025 puede que debas presentarla.", color: "#4ECDC4", url: "https://www.agenciatributaria.gob.es", secundaria: true });
    }
    // Becas MEC — agosto y septiembre
    if (mes >= 8 && mes <= 9) {
      acciones.push({ id: "beca", urgencia: "Plazo abierto en septiembre", titulo: "Becas MEC — solicítalas ya", desc: "Si estudias en universidad, prepara la documentación.", color: "#4ECDC4", url: "https://www.becas.educacion.gob.es" });
    }
    // Siempre: según situación
    if (sit.includes("18") || sit.includes("cumpl")) {
      acciones.push({ id: "dni", urgencia: "Trámite prioritario", titulo: "Renueva tu DNI de adulto", desc: "Necesario para todos los trámites. Cita en interior.gob.es.", color: "#A29BFE", url: "https://www.interior.gob.es", secundaria: acciones.length > 0 });
    }
    if (sit.includes("uni") || sit.includes("estudi")) {
      acciones.push({ id: "empad", urgencia: "Obligatorio si te mudas", titulo: "Empadronarte en tu nuevo municipio", desc: "Necesario para la tarjeta sanitaria y ayudas locales.", color: "#55EFC4", url: "https://mptmd.sede.gob.es", secundaria: acciones.length > 0 });
    }
    if (sit.includes("trabajo") || sit.includes("emple")) {
      acciones.push({ id: "ss", urgencia: "Antes de empezar a trabajar", titulo: "Comprueba tu alta en la Seguridad Social", desc: "Tu empresa debe darte de alta el primer día.", color: "#74B9FF", url: "https://www.seg-social.es", secundaria: acciones.length > 0 });
    }
    // Fallback si no hay nada específico
    if (acciones.length === 0) {
      acciones.push({ id: "tarjeta", urgencia: "Trámite básico", titulo: "Solicita tu tarjeta sanitaria", desc: "Gratuita. Solo necesitas el DNI y el empadronamiento.", color: "#FD79A8", url: "https://www.seg-social.es" });
      acciones.push({ id: "clave", urgencia: "Te abre todos los trámites online", titulo: "Activa tu Cl@ve", desc: "Con ella puedes hacer todos los trámites desde casa.", color: "#FFE66D", url: "https://sede.gob.es", secundaria: true });
    }

    return acciones.filter(a => !descartadas.has(a.id)).slice(0, 3);
  }
  const [preguntaContextoIdx, setPreguntaContextoIdx] = useState(0);
  const [respuestasContexto, setRespuestasContexto] = useState<string[]>([]);
  const [itinerarioPersonalizado, setItinerarioPersonalizado] = useState<{titulo:string; descripcion:string; pasos:{fase:string;items:string[]}[]} | null>(null);
  const [cargandoItinerario, setCargandoItinerario] = useState(false);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [ultimoMarcado, setUltimoMarcado] = useState<{key: string; item: string; siguienteItem: string | null; faseCompleta: boolean; tituloFase: string} | null>(null);
  const [celebracion, setCelebracion] = useState<string | null>(null);
  const [temaActivo, setTemaActivo] = useState<string | null>(null);

  // Chat
  const [pregunta, setPregunta] = useState("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [intercambios, setIntercambios] = useState<Intercambio[]>([]);
  const [respuestaActual, setRespuestaActual] = useState<string | null>(null);
  const [preguntaActual, setPreguntaActual] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [formRec, setFormRec] = useState<Recordatorio>({ titulo: "", fecha: "", descripcion: "" });
  const [, setMostrarRecActual] = useState(false);

  // Voz
  const [escuchando, setEscuchando] = useState(false);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const r = new SpeechRecognition();
      r.lang = "es-ES"; r.continuous = false; r.interimResults = false;
      r.onresult = (e: any) => { setPregunta(e.results[0][0].transcript); setEscuchando(false); };
      r.onerror = () => setEscuchando(false);
      r.onend = () => setEscuchando(false);
      recognitionRef.current = r;
    }
  }, []);

  function toggleVoz() {
    if (!recognitionRef.current) { alert("Tu navegador no soporta reconocimiento de voz. Prueba con Chrome."); return; }
    if (escuchando) { recognitionRef.current.stop(); setEscuchando(false); }
    else { recognitionRef.current.start(); setEscuchando(true); }
  }

  function elegirSituacion(label: string, itIdx: number) {
    setSituacionElegida(label);
    setItinerarioActivo(itIdx);
    setPreguntaContextoIdx(0);
    setRespuestasContexto([]);
    setPantalla("preguntas");
  }

  function irDirecto() {
    setPantalla("app");
    setTabApp("chat");
  }

  function responderContexto(opcion: string) {
    const nuevas = [...respuestasContexto, opcion];
    setRespuestasContexto(nuevas);
    const it = itinerarios[itinerarioActivo];
    if (preguntaContextoIdx < it.preguntas.length - 1) {
      setPreguntaContextoIdx(preguntaContextoIdx + 1);
    } else {
      setPantalla("app");
      setTabApp("itinerario");
      // Generate personalised itinerary
      const it = itinerarios[itinerarioActivo];
      generarItinerarioPersonalizado(situacionElegida, [...nuevas], it?.titulo || '');
    }
  }

  function actualizarProgreso(key: string, valor: boolean, item: string = '', fi: number = -1, ii: number = -1) {
    setItinerarioProgreso(prev => {
      const next = { ...prev, [key]: valor };
      try { localStorage.setItem('alfred_progreso', JSON.stringify(next)); } catch(e) {}

      if (valor) {
        const it = itinerarios[itinerarioActivo];
        const fase = it.pasos[fi];
        const siguienteItem = fase.items[ii + 1] || (it.pasos[fi + 1]?.items[0]) || null;
        const faseDone = fase.items.filter((_, idx) => idx === ii ? true : !!next[`${itinerarioActivo}-${fi}-${idx}`]).length;
        const faseCompleta = faseDone === fase.items.length;

        setUltimoMarcado({ key, item, siguienteItem, faseCompleta, tituloFase: fase.fase });

        // Celebración si fase completa
        if (faseCompleta) {
          setCelebracion(fase.fase);
          setTimeout(() => setCelebracion(null), 3500);
        }
      } else {
        setUltimoMarcado(null);
      }
      return next;
    });
  }

  function limpiarChat() {
    setMensajes([]); setIntercambios([]); setRespuestaActual(null);
    setPreguntaActual(null); setMostrarRecActual(false);
    setFormRec({ titulo: "", fecha: "", descripcion: "" });
  }

  async function generarItinerarioPersonalizado(sit: string, resp: string[], itBase: string) {
    setCargandoItinerario(true);
    try {
      const response = await fetch("https://alfrediaactivo1.app.n8n.cloud/webhook/itinerario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situacion: sit, respuestas: resp, itinerarioActivo: itBase }),
      });
      const data = await response.json();
      if (data && data.titulo && data.pasos) {
        setItinerarioPersonalizado(data);
      }
    } catch (e) {
      console.error("Error generando itinerario:", e);
    } finally {
      setCargandoItinerario(false);
    }
  }

  function preguntaRapida(texto: string) {
    setPregunta(texto);
    setTabApp("chat");
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function preguntar() {
    if (!pregunta.trim()) return;
    if (preguntaActual && respuestaActual) {
      setIntercambios(prev => [...prev, { pregunta: preguntaActual, respuesta: respuestaActual }]);
    }
    const nuevaMensaje: Mensaje = { rol: "usuario", texto: pregunta };
    const historialActualizado = [...mensajes, nuevaMensaje];
    setMensajes(historialActualizado);
    setPreguntaActual(pregunta);
    setRespuestaActual(null);
    setPregunta("");
    setCargando(true);
    setMostrarRecActual(false);

    const sessionId = sessionStorage.getItem('alfred_session') || (() => {
      const id = 'sess-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
      sessionStorage.setItem('alfred_session', id);
      return id;
    })();

    const contextoUsuario = `[Situación: ${situacionElegida}. Respuestas onboarding: ${respuestasContexto.join(", ")}. Itinerario activo: ${itinerarios[itinerarioActivo]?.titulo}]`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch("https://alfrediaactivo1.app.n8n.cloud/webhook/Chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: historialActualizado.slice(-5).map(m => ({ rol: m.rol, texto: m.texto })), contextoUsuario, sessionId }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      const respuesta = data.text || data.answer || JSON.stringify(data);
      setMensajes([...historialActualizado, { rol: "alfred", texto: respuesta }]);
      setRespuestaActual(respuesta);
      setFormRec({ titulo: "", fecha: "", descripcion: pregunta });
      setMostrarRecActual(true);
      setTimeout(() => document.getElementById("respuesta-actual")?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
    } catch (error: unknown) {
      const msg = error instanceof Error && error.name === "AbortError"
        ? "⏱️ ALFRED está tardando más de lo habitual. Por favor inténtalo de nuevo en unos segundos."
        : "❌ Ha ocurrido un error al conectar con ALFRED. Comprueba tu conexión e inténtalo de nuevo.";
      setRespuestaActual(msg);
      setMostrarRecActual(false);
    } finally {
      setCargando(false);
    }
  }

  // ── PANTALLA 0: Términos + primera pregunta fusionados ─────────────────────
  if (pantalla === "terminos") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", padding: 20 }}>
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
          .sit-btn-t { background:#fff; border:1.5px solid #eee; border-radius:14px; padding:12px 16px; font-size:14px; font-weight:600; cursor:pointer; color:#2D3436; text-align:left; transition:all 0.15s; display:flex; align-items:center; gap:10px; width:100%; }
          .sit-btn-t:hover { border-color:#FF6B6B; background:#FFF5F5; }
        `}</style>
        <div style={{ maxWidth: 460, width: "100%", animation: "fadeUp 0.4s ease" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🤖</div>
            <h2 style={{ fontSize: 24, fontWeight: "800", color: "#2D3436", marginBottom: 6 }}>Bienvenido a ALFRED</h2>
            <p style={{ color: "#888", fontSize: 13, lineHeight: 1.5 }}>
              Asistente de <strong>Inteligencia Artificial</strong> · Información orientativa · No sustituye asesoramiento profesional
            </p>
          </div>

          {/* Aviso edad prominente */}
          <div style={{ background: "#FFF3CD", border: "1.5px solid #FFB300", borderRadius: 14, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#856404", fontWeight: "600", display: "flex", alignItems: "center", gap: 8 }}>
            🔞 Solo para mayores de 18 años · Cumple RGPD y AI Act
          </div>

          {/* Avisos compactos */}
          <div style={{ background: "#FAFAFA", borderRadius: 14, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#636e72", lineHeight: 1.7 }}>
            <div>✅ Trámites, finanzas, vivienda, viajes y salud</div>
            <div>⚠️ No soy abogado, médico ni funcionario</div>
            <div>🔒 Conversaciones guardadas para mejorar el servicio</div>
          </div>

          {/* Primera pregunta integrada */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: "#FF6B6B", fontWeight: "600", marginBottom: 8, letterSpacing: 0.3 }}>🤖 ALFRED · Asistente IA</div>
            <div style={{ background: "#FFF5F5", borderRadius: "4px 16px 16px 16px", padding: "14px 16px", fontSize: 15, fontWeight: "700", color: "#2D3436", lineHeight: 1.4, marginBottom: 14 }}>
              ¿Qué está pasando en tu vida ahora mismo?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SITUACIONES.map(s => (
                <button key={s.label} className="sit-btn-t" onClick={() => elegirSituacion(s.label, s.itinerario)}>
                  <span style={{ fontSize: 20 }}>{s.emoji}</span>
                  <span>{s.label}</span>
                  <span style={{ marginLeft: "auto", color: "#aaa" }}>→</span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setPantalla("hero")}
            style={{ marginTop: 12, background: "none", border: "none", color: "#aaa", fontSize: 12, cursor: "pointer", width: "100%", textAlign: "center" }}>
            Explorar sin elegir situación →
          </button>
          <div style={{ marginTop: 10, fontSize: 10, color: "#ccc", textAlign: "center" }}>Solo para mayores de 18 años · ISDI AIEx 2026</div>
        </div>
      </div>
    );
  }

  // ── PANTALLA 1: Hero conversacional ────────────────────────────────────────
  if (pantalla === "hero") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#fff", padding: "20px" }}>
        <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%,80%,100% { opacity:0.2; transform:scale(0.8);} 40% { opacity:1; transform:scale(1.2);} }
          .alfred-link { color:#FF6B6B; font-weight:600; text-decoration:none; border-bottom:1px solid #FF6B6B44; }
          .alfred-link:hover { background:#FFF5F5; border-radius:3px; }
          .sit-btn { background:#fff; border:1.5px solid #eee; border-radius:16px; padding:14px 16px; font-size:14px; font-weight:600; cursor:pointer; color:#2D3436; text-align:left; transition:all 0.15s; display:flex; align-items:center; gap:10px; }
          .sit-btn:hover { border-color:#FF6B6B; background:#FFF5F5; transform:translateX(2px); }
        `}</style>

        <div style={{ maxWidth: 440, width: "100%", animation: "fadeUp 0.5s ease" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div style={{ fontSize: 30 }}>🤖</div>
            <div style={{ fontSize: 22, fontWeight: "800", color: "#2D3436" }}>ALFRED</div>
            <div style={{ marginLeft: "auto", background: "#FF6B6B22", color: "#FF6B6B", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: "700" }}>IA · Beta</div>
          </div>

          {/* Burbuja ALFRED */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "#FF6B6B", fontWeight: "600", marginBottom: 6, letterSpacing: 0.3 }}>🤖 ALFRED · Asistente IA</div>
            <div style={{ background: "#FFF5F5", borderRadius: "4px 20px 20px 20px", padding: "16px 18px" }}>
              <div style={{ fontSize: 18, fontWeight: "800", color: "#2D3436", lineHeight: 1.3, marginBottom: 6 }}>
                La vida adulta<br /><span style={{ color: "#FF6B6B" }}>por fin tiene manual.</span>
              </div>
              <div style={{ fontSize: 14, color: "#636e72", lineHeight: 1.5 }}>
                Hola 👋 Soy ALFRED. Para ayudarte bien, <strong>¿qué está pasando en tu vida ahora mismo?</strong>
              </div>
            </div>
          </div>

          {/* Chips de situación */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {SITUACIONES.map(s => (
              <button key={s.label} className="sit-btn" onClick={() => elegirSituacion(s.label, s.itinerario)}>
                <span style={{ fontSize: 22 }}>{s.emoji}</span>
                <span>{s.label}</span>
                <span style={{ marginLeft: "auto", color: "#aaa", fontSize: 16 }}>→</span>
              </button>
            ))}
          </div>

          {/* Separador */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
            <div style={{ fontSize: 12, color: "#aaa" }}>o cuéntame tú</div>
            <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
          </div>

          {/* Input + voz + enviar */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              ref={inputRef}
              value={pregunta}
              onChange={e => setPregunta(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && pregunta.trim()) { setSituacionElegida(pregunta); setPantalla("app"); setTabApp("chat"); preguntar(); } }}
              placeholder="Di tu situación o escríbela..."
              style={{ flex: 1, padding: "13px 16px", borderRadius: 16, border: "2px solid #eee", fontSize: 15, outline: "none" }}
              onFocus={e => e.target.style.border = "2px solid #FF6B6B"}
              onBlur={e => e.target.style.border = "2px solid #eee"}
            />
            <button
              onClick={toggleVoz}
              title={escuchando ? "Parar de escuchar" : "Di tu situación"}
              style={{ width: 46, height: 46, borderRadius: "50%", background: escuchando ? "#FF6B6B" : "#FFF5F5", border: escuchando ? "none" : "2px solid #FF6B6B33", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, transition: "all 0.2s" }}>
              {escuchando ? "🔴" : "🎤"}
            </button>
            <button
              onClick={() => { if (pregunta.trim()) { setSituacionElegida(pregunta); setPantalla("app"); setTabApp("chat"); preguntar(); } }}
              disabled={!pregunta.trim()}
              style={{ width: 46, height: 46, borderRadius: 14, background: pregunta.trim() ? "#FF6B6B" : "#eee", color: pregunta.trim() ? "#fff" : "#aaa", border: "none", cursor: pregunta.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, fontWeight: "700", boxShadow: pregunta.trim() ? "0 4px 14px rgba(255,107,107,0.4)" : "none", transition: "all 0.2s" }}>
              →
            </button>
          </div>
          {escuchando && <div style={{ textAlign: "center", fontSize: 12, color: "#FF6B6B", marginTop: 8, animation: "pulse 1.2s infinite" }}>Escuchando... habla ahora</div>}

          <button onClick={irDirecto} style={{ marginTop: 16, background: "none", border: "none", color: "#aaa", fontSize: 12, cursor: "pointer", width: "100%", textAlign: "center" }}>
            Explorar sin elegir situación →
          </button>
        </div>
      </div>
    );
  }

  // ── PANTALLA 2: Preguntas de contexto ──────────────────────────────────────
  if (pantalla === "preguntas") {
    const it = itinerarios[itinerarioActivo];
    const pregObj = it.preguntas[preguntaContextoIdx];
    const progreso = ((preguntaContextoIdx) / it.preguntas.length) * 100;

    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", padding: 20 }}>
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
          .ctx-btn { background:#fff; border:2px solid #eee; border-radius:14px; padding:13px 18px; font-size:14px; font-weight:600; cursor:pointer; color:#2D3436; text-align:left; transition:all 0.15s; width:100%; }
          .ctx-btn:hover { border-color:#FF6B6B; background:#FFF5F5; }
        `}</style>
        <div style={{ maxWidth: 440, width: "100%", animation: "fadeUp 0.3s ease" }}>
          {/* Progreso */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#aaa", marginBottom: 8 }}>
              <span>Pregunta {preguntaContextoIdx + 1} de {it.preguntas.length}</span>
              <span>{Math.round(progreso + (100 / it.preguntas.length))}% completado</span>
            </div>
            <div style={{ background: "#f0f0f0", borderRadius: 8, height: 5 }}>
              <div style={{ background: it.color, borderRadius: 8, height: 5, width: `${progreso + (100 / it.preguntas.length)}%`, transition: "width 0.3s" }} />
            </div>
          </div>

          {/* Emoji + burbuja */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${it.color}22`, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{it.icono}</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "#FF6B6B", fontWeight: "600", marginBottom: 6 }}>🤖 ALFRED · Asistente IA</div>
            <div style={{ background: "#FFF5F5", borderRadius: "4px 20px 20px 20px", padding: "14px 18px", fontSize: 15, fontWeight: "700", color: "#2D3436", lineHeight: 1.4 }}>
              {pregObj.texto}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {pregObj.opciones.map(op => (
              <button key={op} className="ctx-btn" onClick={() => responderContexto(op)}>
                {op} <span style={{ float: "right", color: "#aaa" }}>→</span>
              </button>
            ))}
          </div>

          <button onClick={() => { setPantalla("app"); setTabApp("itinerario"); }} style={{ background: "none", border: "none", color: "#aaa", fontSize: 12, cursor: "pointer", width: "100%", textAlign: "center" }}>
            Saltar y ver el itinerario directamente
          </button>
        </div>
      </div>
    );
  }

  // ── PANTALLA 3: App principal con tabs ─────────────────────────────────────
  const it = itinerarios[itinerarioActivo];
  const totalPasos = it.pasos.reduce((a, f) => a + f.items.length, 0);
  const completados = it.pasos.reduce((a, f, fi) => a + f.items.filter((_, ii) => itinerarioProgreso[`${itinerarioActivo}-${fi}-${ii}`]).length, 0);
  const pct = Math.round((completados / totalPasos) * 100);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes pulse { 0%,80%,100%{opacity:0.2;transform:scale(0.8);}40%{opacity:1;transform:scale(1.2);} }
        @keyframes fadeIn { from{opacity:0.2;transform:translateX(-4px);}to{opacity:1;transform:translateX(0);} }
        .alfred-link{color:#FF6B6B;font-weight:600;text-decoration:none;border-bottom:1px solid #FF6B6B44;padding-bottom:1px;}
        .alfred-link:hover{border-bottom-color:#FF6B6B;background:#FFF5F5;border-radius:3px;}
        @media(max-width:768px){
          .fases-grid{grid-template-columns:1fr!important;}
          .chat-input-row{gap:6px!important;}
          .chat-input-row input{font-size:16px!important;}
          .tabs-bar{padding:0 8px!important;}
          .tab-content{padding:16px!important;}
          .recordatorio-form{flex-direction:column!important;}
          .recordatorio-form input,.recordatorio-form button{width:100%!important;box-sizing:border-box!important;}
        }
      `}</style>

      {/* HEADER */}
      <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setPantalla("hero")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 0, marginRight: 4 }}>←</button>
          <div style={{ fontSize: 20 }}>🤖</div>
          <div style={{ fontSize: 18, fontWeight: "800", color: "#2D3436" }}>ALFRED</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {situacionElegida && (
            <div style={{ background: "#FFF5F5", border: "1px solid #FF6B6B33", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#FF6B6B", fontWeight: "600" }}>
              {it.icono} {situacionElegida}
            </div>
          )}
          <div style={{ background: "#FF6B6B22", color: "#FF6B6B", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: "700", border: "1px solid #FF6B6B33" }}>
            ⚡ {Object.values(itinerarioProgreso).filter(Boolean).length * 10} XP
          </div>
          <div style={{ background: "#FF6B6B", color: "#fff", borderRadius: 20, padding: "6px 14px", fontSize: 11, fontWeight: "700" }}>
            IA · Beta gratuita
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs-bar" style={{ display: "flex", borderBottom: "1px solid #f0f0f0", padding: "0 20px", flexShrink: 0 }}>
        {([
          { id: "itinerario", label: "🗺️ Mi viaje", },
          { id: "chat", label: "💬 Chat", },
          { id: "temas", label: "📋 Temas", },
        ] as { id: TabApp; label: string }[]).map(tab => (
          <button key={tab.id} onClick={() => setTabApp(tab.id)}
            style={{ flex: 1, padding: "13px 8px", fontSize: 13, fontWeight: tabApp === tab.id ? "700" : "400", color: tabApp === tab.id ? "#FF6B6B" : "#888", background: "none", border: "none", borderBottom: tabApp === tab.id ? "2px solid #FF6B6B" : "2px solid transparent", cursor: "pointer", transition: "all 0.15s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENIDO TABS */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* ── TAB: ITINERARIO ── */}
        {tabApp === "itinerario" && (
          <div className="tab-content" style={{ padding: "20px", maxWidth: 960, margin: "0 auto" }}>

            {/* DASHBOARD PROACTIVO */}
            {(() => {
              const acciones = generarAcciones();
              if (acciones.length === 0) return null;
              const principal = acciones.find(a => !a.secundaria) || acciones[0];
              const secundarias = acciones.filter(a => a !== principal).slice(0, 2);
              return (
                <div style={{ marginBottom: 24 }}>
                  {/* Cabecera con aviso IA */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: "700", color: "#2D3436" }}>Para ti ahora mismo</span>
                    <span style={{ fontSize: 10, color: "#aaa" }}>· 🤖 Sugerencias generadas por IA · basadas en tu situación y la fecha actual</span>
                  </div>

                  {/* Tarjeta principal */}
                  <div style={{ background: "#fff", borderRadius: 16, border: `0.5px solid ${principal.color}44`, borderLeft: `3px solid ${principal.color}`, padding: "16px 16px 16px 18px", marginBottom: secundarias.length > 0 ? 10 : 0, display: "flex", alignItems: "flex-start", gap: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ background: `${principal.color}22`, color: principal.color === "#FFE66D" ? "#854F0B" : principal.color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: "700", display: "inline-block", marginBottom: 8 }}>
                        ⏰ {principal.urgencia}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: "700", color: "#2D3436", marginBottom: 5, lineHeight: 1.3 }}>{principal.titulo}</div>
                      <div style={{ fontSize: 13, color: "#636e72", marginBottom: 12, lineHeight: 1.5 }}>{principal.desc}</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <a href={principal.url} target="_blank" rel="noopener noreferrer"
                          style={{ background: principal.color, color: principal.color === "#FFE66D" ? "#2D3436" : "#fff", borderRadius: 20, padding: "8px 16px", fontSize: 13, fontWeight: "700", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                          Hacerlo ahora →
                        </a>
                        <button onClick={() => preguntaRapida(principal.titulo)}
                          style={{ background: "none", border: `1.5px solid ${principal.color}55`, borderRadius: 20, padding: "8px 14px", fontSize: 13, color: principal.color === "#FFE66D" ? "#854F0B" : principal.color, cursor: "pointer", fontWeight: "600" }}>
                          💬 Preguntar a ALFRED
                        </button>
                      </div>
                    </div>
                    <button onClick={() => descartarTarjeta(principal.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 20, lineHeight: 1, flexShrink: 0, padding: 0 }}>
                      ×
                    </button>
                  </div>

                  {/* Tarjetas secundarias */}
                  {secundarias.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(secundarias.length, 2)}, 1fr)`, gap: 10 }}>
                      {secundarias.map(ac => (
                        <div key={ac.id} style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #eee", padding: "14px", display: "flex", alignItems: "flex-start", gap: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${ac.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 8 }}>
                              {ac.color === "#4ECDC4" ? "🎓" : ac.color === "#FFE66D" ? "📋" : ac.color === "#A29BFE" ? "🪪" : ac.color === "#74B9FF" ? "💼" : "🏥"}
                            </div>
                            <div style={{ fontSize: 13, fontWeight: "700", color: "#2D3436", marginBottom: 4, lineHeight: 1.3 }}>{ac.titulo}</div>
                            <div style={{ fontSize: 12, color: "#888", marginBottom: 10, lineHeight: 1.4 }}>{ac.desc}</div>
                            <button onClick={() => preguntaRapida(ac.titulo)}
                              style={{ background: "none", border: "none", fontSize: 12, color: ac.color === "#FFE66D" ? "#854F0B" : ac.color, cursor: "pointer", fontWeight: "700", padding: 0 }}>
                              Saber más →
                            </button>
                          </div>
                          <button onClick={() => descartarTarjeta(ac.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 16, lineHeight: 1, flexShrink: 0, padding: 0 }}>
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ borderTop: "1px dashed #f0f0f0", marginTop: 20 }} />
                </div>
              );
            })()}

            {/* ITINERARIO PERSONALIZADO */}
            {cargandoItinerario && (
              <div style={{ background: "#FFF5F5", borderRadius: 16, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#FF6B6B", display: "inline-block", animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
                </div>
                <span style={{ fontSize: 13, color: "#FF6B6B", fontWeight: "600" }}>🤖 ALFRED está generando tu itinerario personalizado...</span>
              </div>
            )}

            {itinerarioPersonalizado && !cargandoItinerario && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: "700", color: "#2D3436" }}>🎯 Tu itinerario personalizado</span>
                  <span style={{ fontSize: 10, color: "#aaa" }}>· 🤖 Generado por IA para tu situación concreta</span>
                </div>
                <div style={{ background: "#fff", borderRadius: 20, border: "2px solid #FF6B6B33", borderLeft: "4px solid #FF6B6B", padding: "20px 24px", boxShadow: "0 4px 20px rgba(255,107,107,0.1)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#FF6B6B22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>🎯</div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: "800", color: "#2D3436", marginBottom: 2 }}>{itinerarioPersonalizado.titulo}</div>
                      <div style={{ fontSize: 13, color: "#888" }}>{itinerarioPersonalizado.descripcion}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(itinerarioPersonalizado.pasos.length, 2)}, 1fr)`, gap: 12 }}>
                    {itinerarioPersonalizado.pasos.map((fase, fi) => (
                      <div key={fi} style={{ background: "#FAFAFA", borderRadius: 14, padding: "14px 16px" }}>
                        <div style={{ fontSize: 11, fontWeight: "700", color: "#FF6B6B", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
                          {fi + 1}. {fase.fase}
                        </div>
                        {fase.items.map((item, ii) => {
                          const key = `personalizado-${fi}-${ii}`;
                          const checked = !!itinerarioProgreso[key];
                          return (
                            <div key={ii} onClick={() => actualizarProgreso(key, !checked, item, -1, -1)} style={{ display: "flex", gap: 8, marginBottom: 8, cursor: "pointer", alignItems: "flex-start" }}>
                              <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1, border: checked ? "none" : "2px solid #ddd", background: checked ? "#FF6B6B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                                {checked && <span style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>✓</span>}
                              </div>
                              <span style={{ fontSize: 12, color: checked ? "#aaa" : "#636e72", lineHeight: 1.4, textDecoration: checked ? "line-through" : "none" }}>{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => preguntaRapida(`Explícame más sobre: ${itinerarioPersonalizado.titulo}`)}
                    style={{ marginTop: 14, background: "#FF6B6B", color: "#fff", border: "none", borderRadius: 20, padding: "8px 18px", fontSize: 13, fontWeight: "700", cursor: "pointer" }}>
                    💬 Preguntarle a ALFRED →
                  </button>
                </div>
                <div style={{ borderTop: "1px dashed #f0f0f0", margin: "20px 0" }} />
              </div>
            )}

            {/* Selector de itinerario */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>También puede interesarte:</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                {(mostrarTodos ? itinerarios : itinerarios.slice(0, 5)).map((it2, i) => (
                  <button key={i} onClick={() => setItinerarioActivo(i)}
                    style={{ background: itinerarioActivo === i ? it2.color : "#f8f9fa", color: itinerarioActivo === i ? (it2.color === "#FFE66D" ? "#2D3436" : "#fff") : "#636e72", border: `2px solid ${itinerarioActivo === i ? it2.color : "transparent"}`, borderRadius: 20, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontWeight: itinerarioActivo === i ? "700" : "400", transition: "all 0.15s" }}>
                    {it2.icono} {it2.titulo.split(" ").slice(0, 3).join(" ")}
                  </button>
                ))}
                <button onClick={() => setMostrarTodos(!mostrarTodos)}
                  style={{ background: "none", border: "2px solid #eee", borderRadius: 20, padding: "6px 14px", fontSize: 13, cursor: "pointer", color: "#888", fontWeight: "400" }}>
                  {mostrarTodos ? "▲ Ver menos" : "▼ Ver todos (10)"}
                </button>
              </div>
            </div>

            {/* Header itinerario activo */}
            <div style={{ background: "#FAFAFA", borderRadius: 24, padding: "20px 24px", border: `2px solid ${it.color}33`, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${it.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, flexShrink: 0 }}>{it.icono}</div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: "800", color: "#2D3436" }}>{it.titulo}</div>
                    <div style={{ fontSize: 13, color: "#888" }}>{it.descripcion}</div>
                  </div>
                </div>
                <button onClick={() => { preguntaRapida(`Tengo dudas sobre: ${it.titulo}. ¿Puedes ayudarme con más detalle?`); }}
                  style={{ background: it.color, color: it.color === "#FFE66D" ? "#2D3436" : "#fff", border: "none", borderRadius: 20, padding: "10px 18px", fontSize: 13, fontWeight: "700", cursor: "pointer" }}>
                  💬 Preguntarle a ALFRED →
                </button>
              </div>

              {/* Barra progreso + XP */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 6 }}>
                <span>Progreso: {completados} de {totalPasos} pasos</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ background: "#FF6B6B22", color: "#FF6B6B", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: "700" }}>
                    ⚡ {completados * 10} XP
                  </span>
                  <span style={{ color: it.color, fontWeight: "700" }}>{pct}%</span>
                </div>
              </div>
              <div style={{ background: "#e0e0e0", borderRadius: 8, height: 7, overflow: "hidden" }}>
                <div style={{ background: it.color, height: 7, width: `${pct}%`, transition: "width 0.3s", borderRadius: 8 }} />
              </div>
              {/* Celebración fase completa */}
              {celebracion && (
                <div style={{ marginTop: 14, background: `${it.color}22`, border: `1.5px solid ${it.color}55`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, animation: "fadeIn 0.4s ease" }}>
                  <span style={{ fontSize: 28 }}>🏆</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: "800", color: "#2D3436" }}>¡Fase completada!</div>
                    <div style={{ fontSize: 12, color: "#636e72" }}>"{celebracion}" — +{it.pasos.find(p => p.fase === celebracion)?.items.length || 0 * 10} XP desbloqueados</div>
                  </div>
                  <a href={`https://wa.me/?text=${encodeURIComponent(`🏆 ¡Acabo de completar la fase "${celebracion}" en ALFRED!

Usando ALFRED para gestionar mi vida adulta 💪
https://alfred-isdi.netlify.app`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ marginLeft: "auto", background: "#25D366", color: "#fff", borderRadius: 20, padding: "6px 12px", fontSize: 11, fontWeight: "700", textDecoration: "none", flexShrink: 0 }}>
                    Compartir 🎉
                  </a>
                </div>
              )}
            </div>

            {/* Fases */}
            <div className="fases-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(it.pasos.length, 3)}, 1fr)`, gap: 16 }}>
              {it.pasos.map((fase, fi) => {
                const faseDone = fase.items.filter((_, ii) => itinerarioProgreso[`${itinerarioActivo}-${fi}-${ii}`]).length;
                const faseComplete = faseDone === fase.items.length;
                return (
                  <div key={fi} style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: faseComplete ? `2px solid ${it.color}55` : "2px solid transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: faseComplete ? it.color : `${it.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: "700", color: faseComplete ? "#fff" : it.color === "#FFE66D" ? "#b8860b" : it.color }}>
                        {faseComplete ? "✓" : fi + 1}
                      </div>
                      <div style={{ fontWeight: "700", color: it.color === "#FFE66D" ? "#b8860b" : it.color, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>{fase.fase}</div>
                      <div style={{ marginLeft: "auto", fontSize: 11, color: "#aaa" }}>{faseDone}/{fase.items.length}</div>
                    </div>
                    {fase.items.map((item, ii) => {
                      const key = `${itinerarioActivo}-${fi}-${ii}`;
                      const checked = !!itinerarioProgreso[key];
                      const isUltimo = ultimoMarcado?.key === key && checked;
                      return (
                        <div key={ii} style={{ marginBottom: 10 }}>
                          <div onClick={() => actualizarProgreso(key, !checked, item, fi, ii)} style={{ display: "flex", gap: 10, cursor: "pointer", alignItems: "flex-start" }}>
                            <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1, border: checked ? "none" : "2px solid #ddd", background: checked ? it.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                              {checked && <span style={{ color: it.color === "#FFE66D" ? "#2D3436" : "#fff", fontSize: 11, fontWeight: "700" }}>✓</span>}
                            </div>
                            <span style={{ fontSize: 13, color: checked ? "#aaa" : "#636e72", lineHeight: 1.4, textDecoration: checked ? "line-through" : "none", transition: "all 0.2s" }}>{item}</span>
                          </div>
                          {/* Siguiente paso hint */}
                          {isUltimo && ultimoMarcado?.siguienteItem && !ultimoMarcado.faseCompleta && (
                            <div style={{ marginTop: 6, marginLeft: 30, display: "flex", alignItems: "center", gap: 8, background: "#F0FFF4", borderRadius: 10, padding: "7px 12px", animation: "fadeIn 0.3s ease" }}>
                              <span style={{ fontSize: 11, color: "#2D6A4F" }}>💡 Siguiente: <strong>{ultimoMarcado.siguienteItem}</strong></span>
                              <button onClick={() => preguntaRapida(`¿Cómo hago esto?: ${ultimoMarcado.siguienteItem}`)}
                                style={{ background: "none", border: "none", fontSize: 11, color: it.color, cursor: "pointer", fontWeight: "700", padding: 0, flexShrink: 0 }}>
                                💬 Preguntar →
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB: CHAT ── */}
        {tabApp === "chat" && (
          <div className="tab-content" style={{ padding: "20px", maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", minHeight: "calc(100vh - 160px)" }}>

            {/* Header chat */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: "#888" }}>Respondo en segundos · ✅ Fuentes oficiales verificadas</div>
            </div>

            {/* Preguntas rápidas contextuales */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 16 }}>
              {((): string[] => {
                const tema = temaActivo;
                if (tema === "Trámites") return ["¿Cómo renuevo el DNI?", "¿Cómo me empadrono?", "¿Para qué sirve el certificado digital?", "¿Cómo saco el pasaporte?"];
                if (tema === "Finanzas") return ["¿Qué es la regla 50/30/20?", "¿Cuándo hago la declaración de la renta?", "¿Qué es el IRPF?", "¿Cómo empiezo a ahorrar?"];
                if (tema === "Vivienda") return ["¿Qué revisar en un contrato de alquiler?", "¿Qué es la fianza?", "¿Puedo pedir el bono joven de alquiler?", "¿Cuánto dura mínimo un alquiler?"];
                if (tema === "Viajes") return ["¿Necesito pasaporte para la UE?", "¿Qué es la tarjeta sanitaria europea?", "¿Cómo saco el visado para EEUU?", "¿Qué llevo si viajo fuera de la UE?"];
                if (tema === "Educación") return ["¿Cómo solicito la beca MEC?", "¿Qué es el Erasmus?", "¿Qué es el Bono Cultural?", "¿Cómo renuevo la beca cada año?"];
                if (tema === "Trabajo") return ["¿Cuánto es el SMI en 2026?", "¿Cómo cobro el paro?", "¿Qué es el contrato indefinido?", "¿Cuántos días de vacaciones tengo?"];
                if (tema === "Trámites sanitarios") return ["¿Cómo saco mi tarjeta sanitaria?", "¿Puedo ir al psicólogo por la seguridad social?", "¿Cómo pido cita con el médico?", "¿Qué es la baja médica?"];
                if (tema === "Carné") return ["¿Cómo me saco el carné de conducir?", "¿Cuánto cuesta el carné tipo B?", "¿Cuántas preguntas tiene el examen teórico?", "¿Cuándo puedo presentarme al práctico?"];
                return [`¿Qué necesito para ${it.titulo.toLowerCase()}?`, "¿Cómo renuevo el DNI?", "¿Cuánto es el SMI en 2026?", "¿Cómo solicito la beca MEC?"];
              })().map(q => (
                <button key={q} onClick={() => preguntaRapida(q)}
                  style={{ background: "#fff", border: "2px solid #FF6B6B", borderRadius: 24, padding: "8px 14px", fontSize: 12, cursor: "pointer", color: "#FF6B6B", fontWeight: "600" }}>
                  {q}
                </button>
              ))}
            </div>

            {/* Contexto + limpiar */}
            {situacionElegida && (
              <div style={{ background: "#FFF5F5", borderRadius: 12, padding: "8px 14px", marginBottom: 14, fontSize: 12, color: "#636e72", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span>🎯 Contexto: <strong>{situacionElegida}</strong>{respuestasContexto.length > 0 ? ` · ${respuestasContexto[0]}` : ""}</span>
                {(intercambios.length > 0 || respuestaActual) && (
                  <button onClick={limpiarChat} style={{ background: "none", border: "1px solid #FF6B6B44", borderRadius: 8, padding: "3px 10px", fontSize: 11, color: "#FF6B6B", cursor: "pointer", flexShrink: 0 }}>
                    🗑️ Nueva conversación
                  </button>
                )}
              </div>
            )}

            {/* Área conversación */}
            <div style={{ flex: 1, background: "#fff", borderRadius: 20, padding: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.07)", marginBottom: 14, minHeight: 200 }}>
              {intercambios.length === 0 && !respuestaActual && !cargando && (
                <div style={{ textAlign: "center", color: "#aaa", padding: "32px 16px" }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>💬</div>
                  <div style={{ fontSize: 14, color: "#636e72" }}>¡Hola! Escribe tu pregunta o elige una opción rápida arriba.</div>
                </div>
              )}

              {intercambios.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#aaa", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Conversación anterior ({intercambios.length} {intercambios.length === 1 ? "pregunta" : "preguntas"})
                  </div>
                  {intercambios.map((int, i) => (
                    <IntercambioColapsado key={i} intercambio={int} index={i} formRec={formRec} setFormRec={setFormRec} />
                  ))}
                  <div style={{ borderTop: "2px dashed #f0f0f0", margin: "14px 0" }} />
                </div>
              )}

              {cargando && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 0" }}>
                  <div style={{ background: "#FFF5F5", borderRadius: "4px 16px 16px 16px", padding: "12px 16px", maxWidth: "82%" }}>
                    <div style={{ fontWeight: "700", color: "#FF6B6B", fontSize: 11, marginBottom: 10 }}>🤖 ALFRED · Asistente IA</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {[{ e: "🔍", t: "Clasificando tu pregunta..." }, { e: "📚", t: "Buscando en fuentes oficiales..." }, { e: "✍️", t: "Preparando tu respuesta..." }].map((p, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.3, animation: `fadeIn 0.5s ease ${i * 1.4}s forwards` }}>
                          <span style={{ fontSize: 13 }}>{p.e}</span>
                          <span style={{ fontSize: 13, color: "#636e72" }}>{p.t}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
                      {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#FF6B6B", display: "inline-block", animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
                    </div>
                  </div>
                </div>
              )}

              {respuestaActual && !cargando && (
                <div id="respuesta-actual">
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                    <div style={{ maxWidth: "80%", padding: "11px 15px", borderRadius: "16px 4px 16px 16px", background: "#FF6B6B", color: "#fff", fontSize: 14, lineHeight: 1.5 }}>
                      {preguntaActual}
                    </div>
                  </div>
                  <div style={{ background: "#F8F9FA", borderRadius: "4px 16px 16px 16px", padding: "14px 16px", marginBottom: 8 }}>
                    <div style={{ fontWeight: "700", color: "#FF6B6B", fontSize: 11, marginBottom: 8 }}>🤖 ALFRED · Asistente IA</div>
                    <RespuestaFormateada texto={respuestaActual} />
                  </div>

                  {/* Botones acción */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8, marginLeft: 4 }}>
                    <a href={`https://wa.me/?text=${encodeURIComponent(`🤖 *ALFRED* me respondió sobre "${preguntaActual}":\n\n${respuestaActual?.replace(/\*\*/g, "*").slice(0, 500)}${(respuestaActual?.length || 0) > 500 ? "..." : ""}\n\n_Consulta ALFRED: https://alfred-isdi.netlify.app_`)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 6, background: "#25D366", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: "600", textDecoration: "none" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      Compartir
                    </a>
                    {!formRec.titulo && !formRec.fecha ? (
                      <button onClick={() => setFormRec({ ...formRec, titulo: preguntaActual?.slice(0, 40) || "" })}
                        style={{ background: "none", border: "1px solid #FF6B6B44", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#FF6B6B", cursor: "pointer" }}>
                        📅 Recordatorio
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", background: "#FFF5F5", borderRadius: 10, padding: "8px 12px" }} className="recordatorio-form">
                        <input placeholder="Título" value={formRec.titulo} onChange={e => setFormRec({ ...formRec, titulo: e.target.value })} style={{ flex: 1, minWidth: 120, padding: "6px 10px", borderRadius: 8, border: "1px solid #eee", fontSize: 12 }} />
                        <input type="date" value={formRec.fecha} onChange={e => setFormRec({ ...formRec, fecha: e.target.value })} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #eee", fontSize: 12 }} />
                        <button onClick={() => { if (!formRec.titulo || !formRec.fecha) return; generarICS(formRec); setMostrarRecActual(false); }} style={{ background: "#FF6B6B", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: "700", cursor: "pointer" }}>📥 .ics</button>
                        <button onClick={() => setMostrarRecActual(false)} style={{ background: "#f0f0f0", color: "#888", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>✕</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="chat-input-row" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input ref={inputRef} value={pregunta} onChange={e => setPregunta(e.target.value)} onKeyDown={e => e.key === "Enter" && preguntar()}
                placeholder="Escribe tu pregunta..."
                style={{ flex: 1, padding: "13px 16px", borderRadius: 16, border: "2px solid #eee", fontSize: 16, outline: "none" }}
                onFocus={e => e.target.style.border = "2px solid #FF6B6B"}
                onBlur={e => e.target.style.border = "2px solid #eee"} />
              <button onClick={toggleVoz} title={escuchando ? "Parar" : "Hablar"}
                style={{ width: 46, height: 46, borderRadius: "50%", background: escuchando ? "#FF6B6B" : "#FFF5F5", border: escuchando ? "none" : "2px solid #FF6B6B33", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                {escuchando ? "🔴" : "🎤"}
              </button>
              <button onClick={preguntar} disabled={cargando}
                style={{ background: "#FF6B6B", color: "#fff", border: "none", borderRadius: 14, padding: "13px 20px", fontSize: 15, cursor: "pointer", fontWeight: "700", boxShadow: "0 4px 14px rgba(255,107,107,0.4)", flexShrink: 0 }}>
                {cargando ? "⏳" : "→"}
              </button>
            </div>

            <div style={{ marginTop: 12, padding: "10px 14px", background: "#FFF5F5", borderRadius: 10, fontSize: 11, color: "#aaa", textAlign: "center" }}>
              ⚠️ La información de ALFRED es orientativa y no sustituye asesoramiento profesional ni información oficial.
            </div>
          </div>
        )}

        {/* ── TAB: TEMAS ── */}
        {tabApp === "temas" && (
          <div className="tab-content" style={{ padding: "20px", maxWidth: 720, margin: "0 auto" }}>
            <div style={{ fontSize: 22, fontWeight: "800", color: "#2D3436", marginBottom: 6 }}>¿En qué más puedo ayudarte?</div>
            <div style={{ fontSize: 14, color: "#888", marginBottom: 20 }}>Toca cualquier área para preguntar al chat</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {[
                { icono: "📋", titulo: "Trámites", desc: "DNI, empadronamiento, NIE, Cl@ve", q: "¿Qué trámites son más importantes para un joven?" },
                { icono: "💰", titulo: "Finanzas", desc: "Presupuesto, ahorro, impuestos, renta", q: "¿Cómo empiezo a gestionar mi dinero?" },
                { icono: "🏠", titulo: "Vivienda", desc: "Alquiler, contratos, fianza, derechos", q: "¿Qué debo saber antes de alquilar un piso?" },
                { icono: "✈️", titulo: "Viajes", desc: "Documentación, seguros, visados", q: "¿Qué necesito para viajar al extranjero?" },
                { icono: "🎓", titulo: "Educación", desc: "Becas, Erasmus, MEC, universidad", q: "¿Cómo solicito la beca MEC?" },
                { icono: "💼", titulo: "Trabajo", desc: "Contratos, SMI, derechos laborales", q: "¿Cuáles son mis derechos laborales?" },
                { icono: "🏥", titulo: "Trámites sanitarios", desc: "Tarjeta sanitaria, médico, salud mental", q: "¿Cómo accedo al sistema sanitario público?" },
                { icono: "🚗", titulo: "Carné", desc: "Permiso B, DGT, autoescuela", q: "¿Cuáles son los pasos para sacarme el carné?" },
              ].map(t => (
                <div key={t.titulo} onClick={() => { setTemaActivo(t.titulo); preguntaRapida(t.q); }}
                  style={{ background: temaActivo === t.titulo ? "#FFF5F5" : "#fff", borderRadius: 18, padding: "18px 16px", boxShadow: "0 3px 12px rgba(0,0,0,0.07)", cursor: "pointer", borderTop: `3px solid ${temaActivo === t.titulo ? "#FF6B6B" : "#FF6B6B22"}`, transition: "all 0.15s", border: temaActivo === t.titulo ? "1.5px solid #FF6B6B33" : "1.5px solid transparent" }}
                  onMouseOver={e => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,107,107,0.15)")}
                  onMouseOut={e => (e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,0.07)")}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{t.icono}</div>
                  <div style={{ fontWeight: "700", color: "#2D3436", fontSize: 14, marginBottom: 4 }}>{t.titulo}</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "16px", color: "#aaa", fontSize: 11, borderTop: "1px solid #f0f0f0", flexShrink: 0 }}>
        🤖 ALFRED es un asistente de IA · Información orientativa · Solo para mayores de 18 años · ISDI AIEx 2026
      </div>
    </div>
  );
}

export default App;
