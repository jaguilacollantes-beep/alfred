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

    const historial = historialActualizado
      .map((m) =>
