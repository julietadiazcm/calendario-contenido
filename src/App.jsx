import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "cm-calendar-pro-v4";
const STATUS_OPTIONS = ["Idea","Borrador","En producción","Para revisión interna","Enviado al cliente","Cambios solicitados","Aprobado","Programado","Publicado"];
const STATUS_COLORS = { "Idea":"#a78bfa","Borrador":"#64748b","En producción":"#0ea5e9","Para revisión interna":"#a855f7","Enviado al cliente":"#f59e0b","Cambios solicitados":"#ef4444","Aprobado":"#22c55e","Programado":"#6366f1","Publicado":"#111827" };
const CONTENT_TYPES = ["Reel","Carrusel","Foto","Video","Story"];

const ACCOUNTS = [
  { id:"basile", name:"Distribuidora Basile", shortName:"Basile", emoji:"📦", description:"Dietética · Suplementos · Bienestar", brand:{ primary:"#F6D522", primarySoft:"#FBEA8C", accent:"#EF1C16", text:"#111111", white:"#FFFEF5", bg:"#FFF8D0", cardBg:"#FFFFF8", sidebar:"#111111", sidebarText:"#F6D522", btnBg:"#EF1C16", btnText:"#FFFFFF", inputBorder:"#F6D522", fontTitle:"'Impact',sans-serif", fontBody:"'Trebuchet MS',sans-serif", tagline:"¿Tu local ya tiene estas opciones?" }, brandKit:{ audience:"Dueños/as de dietéticas, comercios saludables y revendedores.", objective:"Captar altas de clientes mayoristas y posicionar la distribuidora.", tone:"Profesional, claro, comercial, cercano y B2B.", wordsYes:"mayorista, distribución, stock, dietéticas", wordsNo:"promesas milagrosas, lenguaje retail", instagram:"", whatsapp:"", drive:"", canva:"", website:"", notes:"Hablarle al comerciante, no al consumidor final. Gaia es la cara de la marca." } },
  { id:"caro", name:"Caro · Nutricionista", shortName:"Caro", emoji:"🥗", description:"Nutrición · Bienestar femenino · Hábitos reales", brand:{ primary:"#99B8B2", primarySoft:"#c8dcd9", accent:"#F791A9", text:"#171820", white:"#FFFDF8", bg:"#E9E7EA", cardBg:"#FFFDF8", sidebar:"#FFFDF8", sidebarText:"#171820", btnBg:"#99B8B2", btnText:"#FFFDF8", inputBorder:"#99B8B2", fontTitle:"'Georgia',serif", fontBody:"'Trebuchet MS',sans-serif", tagline:"Nutrición posible, personalizada y sin extremos." }, brandKit:{ audience:"Mujeres adultas, personas que entrenan y pacientes que buscan mejorar hábitos.", objective:"Construir autoridad profesional, generar confianza y atraer consultas.", tone:"Profesional, humano, cálido, ético y claro.", wordsYes:"hábitos, proceso, alimentación real, composición corporal, consulta personalizada", wordsNo:"dietas mágicas, promesas rápidas, lenguaje culpabilizante", instagram:"", whatsapp:"", drive:"", canva:"", website:"", notes:"Contenido guardable, compartible y responsable en salud." } },
  { id:"suitehouse", name:"Suite House Cariló", shortName:"Suite House", emoji:"🌲", description:"Hotel premium · Bosque & Mar · Cariló", brand:{ primary:"#AAB8A3", primarySoft:"#d0daca", accent:"#928359", text:"#1A1A1A", white:"#FFFFFF", bg:"#f5f3ef", cardBg:"#FFFFFF", sidebar:"#1A1A1A", sidebarText:"#AAB8A3", btnBg:"#928359", btnText:"#FFFFFF", inputBorder:"#AAB8A3", fontTitle:"'Georgia',serif", fontBody:"'Trebuchet MS',sans-serif", tagline:"Bosque, playa y descanso en un mismo lugar." }, brandKit:{ audience:"Familias, parejas y viajeros que buscan descanso en Cariló.", objective:"Aumentar consultas y reservas directas.", tone:"Premium, cálido, aspiracional, visual y emocional.", wordsYes:"bosque, playa, descanso, suites, escapada, Cariló, experiencia", wordsNo:"hostel, barato, tono demasiado informal", instagram:"", whatsapp:"", drive:"", canva:"", website:"", notes:"Usar mucho deseo visual: bosque, desayuno, pileta, habitaciones." } },
];

function todayISO() { return new Date().toISOString().slice(0,10); }
function getWeekFromDate(date) { if(!date) return 1; const day=new Date(date+"T00:00:00").getDate(); return Math.ceil(day/7); }
function getDayName(date) { if(!date) return "Sin fecha"; return new Date(date+"T00:00:00").toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"short"}); }
function createChecklist() { return [{id:"idea",label:"Idea definida",done:false},{id:"copy",label:"Copy listo",done:false},{id:"script",label:"Guion listo",done:false},{id:"design",label:"Diseño listo",done:false},{id:"visual",label:"Material visual listo",done:false},{id:"sent",label:"Enviado al cliente",done:false},{id:"approved",label:"Aprobado",done:false},{id:"scheduled",label:"Programado",done:false},{id:"published",label:"Publicado",done:false},{id:"metrics",label:"Métricas cargadas",done:false}]; }
function createMetrics() { return {reach:"",likes:"",comments:"",shares:"",saves:"",clicks:"",profileVisits:"",inquiries:"",websiteClicks:"",notes:""}; }
let _id = 0;
function mk(accountId, o) { _id++; return { id:`${accountId}_${_id}`, accountId, section:"post", type:"Reel", date:todayISO(), week:1, theme:"", objective:"", development:"", script:"", copy:"", content:"", status:"Borrador", slides:[], clientComments:[], internalNotes:[], checklist:createChecklist(), metrics:createMetrics(), ...o }; }

// ─── SUITE HOUSE DATA (mayo 2026) ────────────────────────────────────────────
const suiteData = [
  mk("suitehouse",{ date:"2026-05-01", week:1, section:"post", type:"Reel", theme:"Finde largo", objective:"Venta", development:"Clips de bosque, pileta y relax del finde largo.", script:`Hook: "Si tenías que escaparte… era este finde"\nClips: bosque + pileta + relax\nTexto en pantalla: "Mayo arranca con una pausa que necesitás"`, copy:"Si tenías que escaparte… era este finde. 🌲\n\nMayo arranca con una pausa que el cuerpo pide.\nBosque, pileta, relax y nada más.\n\n¿Te quedaste con ganas? Todavía hay tiempo en mayo.\n📩 Consultá disponibilidad por DM.", status:"Publicado", checklist:createChecklist().map(c=>({...c,done:true})) }),

  mk("suitehouse",{ date:"2026-05-02", week:1, section:"story", type:"Encuesta + interacción", theme:"Finde largo - Encuesta", objective:"Interacción", content:"Encuesta: '¿Te escapaste o te quedaste con ganas?' (Me escapé 🌲 / Me quedé con ganas 😅)", status:"Publicado" }),

  mk("suitehouse",{ date:"2026-05-03", week:1, section:"story", type:"Novedades", theme:"Post feriado - Todavía hay tiempo", objective:"Awareness", content:"Video relax + texto: 'Todavía estás a tiempo en mayo 🌿'\nRecordatorio de que quedan fechas disponibles.", status:"Publicado" }),

  mk("suitehouse",{ date:"2026-05-06", week:2, section:"post", type:"Carrusel", theme:"Baja de precios - Semana", objective:"Venta", development:"Carrusel mostrando la promo de semana con hasta 50% OFF.", script:"", copy:"Ahora escaparte es mucho más fácil 🌿\n\nHasta 50% OFF viniendo entre semana.\nMenos gente, más calma.\nIdeal para cortar la rutina.\n\nDesayuno buffet + piscina climatizada + descanso real.\n\nTu escapada está más cerca de lo que pensás.\n📩 Reservá ahora", status:"Enviado al cliente",
    slides:[{id:"sh_s1",text:"Ahora escaparte es mucho más fácil 🌿"},{id:"sh_s2",text:"Hasta 50% OFF en la semana"},{id:"sh_s3",text:"Menos gente, más calma. Ideal para cortar la rutina"},{id:"sh_s4",text:"Desayuno buffet + piscina climatizada + descanso real"},{id:"sh_s5",text:"Tu escapada está más cerca de lo que pensás 📩 Reservá ahora"}] }),

  mk("suitehouse",{ date:"2026-05-07", week:2, section:"story", type:"Conversión / Venta", theme:"Precio semana", objective:"Valor", content:"Dato: 'Venir entre semana puede salir hasta 50% menos 💸'\n+ Foto del hotel tranquilo\n+ CTA: 'Consultá disponibilidad'", status:"Enviado al cliente" }),

  mk("suitehouse",{ date:"2026-05-08", week:2, section:"story", type:"Encuesta + interacción", theme:"Interacción semana", objective:"Engagement", content:"Encuesta: '¿Te escaparías un lunes?'\nOpciones: Sí 💆‍♀️ / Prefiero finde", status:"Enviado al cliente" }),

  mk("suitehouse",{ date:"2026-05-10", week:2, section:"post", type:"Reel", theme:"Escapada entre semana", objective:"Reposicionamiento", development:"Mostrar el hotel vacío y tranquilo entre semana. Contraste con el caos del finde.", script:`Hook: "El verdadero lujo no es el finde…"\nClips: bosque + pileta + relax + desayuno vacío y tranquilo\nTexto en pantalla: "Menos gente. Más calma."`, copy:"El verdadero lujo no es el finde… 🌿\n\nEs llegar un martes y tener todo para vos.\nSin filas. Sin ruido. Sin apuros.\n\nMenos gente. Más calma.\n\n📩 Consultá disponibilidad", status:"Enviado al cliente" }),

  mk("suitehouse",{ date:"2026-05-11", week:2, section:"story", type:"Detrás de escena", theme:"Experiencia pileta climatizada", objective:"Deseo", content:"Video pileta climatizada + texto: 'Esto te espera…'\n+ CTA suave a DM", status:"Enviado al cliente" }),

  mk("suitehouse",{ date:"2026-05-15", week:3, section:"post", type:"Carrusel", theme:"Beneficios de la estadía", objective:"Valor", development:"Carrusel mostrando todos los servicios incluidos en la estadía.", script:"", copy:"Todo lo que incluye tu estadía en Suite House ✨\n\nNada de sorpresas. Nada de extras escondidos.\n\nSolo llegás y disfrutás:\n☕ Desayuno buffet\n💧 Piscina climatizada\n🌿 Suites amplias rodeadas de bosque\n🏖 Servicio de playa\n\n¿Cuándo venís?\n📩 Reservá ahora", status:"Borrador",
    slides:[{id:"sh_b1",text:"Todo lo que incluye tu estadía ✨"},{id:"sh_b2",text:"☕ Desayuno buffet"},{id:"sh_b3",text:"💧 Piscina climatizada"},{id:"sh_b4",text:"🌿 Suites amplias + bosque"},{id:"sh_b5",text:"🏖 Servicio de playa — CTA: Reservá ahora"}] }),

  mk("suitehouse",{ date:"2026-05-16", week:3, section:"story", type:"Detrás de escena", theme:"Amenities secuencia", objective:"Marca", content:"Secuencia de stories:\n1. Desayuno\n2. Pileta\n3. Bosque\n4. Cierre: 'Así se vive en Suite House 🌿'", status:"Borrador" }),

  mk("suitehouse",{ date:"2026-05-17", week:3, section:"story", type:"Encuesta + interacción", theme:"¿Qué valorás más?", objective:"Engagement", content:"Pregunta: '¿Qué valorás más en una escapada?'\nOpciones: Descanso / Comodidad / Ubicación / Servicios", status:"Borrador" }),

  mk("suitehouse",{ date:"2026-05-20", week:3, section:"post", type:"Reel", theme:"Pre finde largo (25 de mayo)", objective:"Venta", development:"Activar reservas para el finde del 25 de mayo. Mostrar experiencia completa.", script:`Hook: "Se viene otro finde largo…"\nClips: experiencia completa (bosque, pileta, habitación, desayuno)\nTexto: "Y esta vez podés hacerlo distinto"`, copy:"Se viene otro finde largo… 🇦🇷\n\nY esta vez podés hacerlo distinto.\nNada de quedarte en casa. Nada de planes a medias.\n\nCariló, bosque, pileta y descanso real.\n\nLos lugares se están llenando.\n📩 Reservá antes de que se agoten", status:"Borrador" }),

  mk("suitehouse",{ date:"2026-05-21", week:3, section:"story", type:"Encuesta + interacción", theme:"Activación 25 de mayo", objective:"Interacción", content:"Pregunta: '¿Ya tenés plan para el 25?'\nOpciones: Sí ✅ / Todavía no 😬", status:"Borrador" }),

  mk("suitehouse",{ date:"2026-05-22", week:4, section:"story", type:"Conversión / Venta", theme:"Urgencia - últimos lugares", objective:"Conversión", content:"⚠️ Últimos lugares disponibles para el finde largo\n+ CTA directo a WhatsApp", status:"Borrador" }),

  mk("suitehouse",{ date:"2026-05-25", week:4, section:"post", type:"Carrusel", theme:"Finde largo 25 de mayo", objective:"Venta", development:"Carrusel de escapada para el finde del 25 de mayo.", script:"", copy:"Finde largo en Cariló 🇦🇷🌲\n\nEscapada cerca. Sin complicaciones.\nNaturaleza + descanso real.\n\n✨ Beneficio especial abonando en efectivo.\n\nQuedan muy pocos lugares.\n📩 Reservá ahora antes de que se agoten.", status:"Borrador",
    slides:[{id:"sh_f1",text:"Finde largo en Cariló 🇦🇷🌲"},{id:"sh_f2",text:"Escapada cerca, sin complicaciones"},{id:"sh_f3",text:"Naturaleza + descanso real"},{id:"sh_f4",text:"✨ Beneficio especial abonando en efectivo"},{id:"sh_f5",text:"Reservá ahora 📩"}] }),

  mk("suitehouse",{ date:"2026-05-26", week:4, section:"story", type:"Detrás de escena", theme:"Durante finde largo", objective:"Marca", content:"Video real del hotel durante el finde largo\n+ Texto: 'Así se vive en Suite House 🌿'", status:"Borrador" }),

  mk("suitehouse",{ date:"2026-05-27", week:4, section:"story", type:"Encuesta + interacción", theme:"Post finde largo", objective:"Engagement", content:"Pregunta: '¿Te quedaste con ganas de volver?' (Sí, quiero volver 🌲 / Fue increíble ✨)", status:"Borrador" }),

  mk("suitehouse",{ date:"2026-05-29", week:5, section:"post", type:"Carrusel", theme:"Cierre de mes - Cariló todo el año", objective:"Branding", development:"Carrusel de cierre que posiciona Cariló como destino en cualquier estación.", script:"", copy:"Mayo demostró algo… 🌿\n\nNo hace falta el verano para disfrutar Cariló.\n\nEscapadas cortas. Descanso real. Todo el año.\n\n¿Cuándo planeás la tuya?\n📩 Reservá tu próxima escapada", status:"Borrador",
    slides:[{id:"sh_c1",text:"Mayo demostró algo… 🌿"},{id:"sh_c2",text:"No hace falta verano"},{id:"sh_c3",text:"Cariló se disfruta todo el año"},{id:"sh_c4",text:"Escapadas cortas, descanso real"},{id:"sh_c5",text:"📩 Planeá tu próxima escapada"}] }),

  mk("suitehouse",{ date:"2026-05-30", week:5, section:"story", type:"Conversión / Venta", theme:"Conversión cierre de mes", objective:"Venta", content:"Pregunta: '¿Planeamos tu próxima escapada?' + botón de respuesta / enlace", status:"Borrador" }),

  mk("suitehouse",{ date:"2026-05-31", week:5, section:"story", type:"Conversión / Venta", theme:"CTA final del mes", objective:"Conversión", content:"CTA directo: 'Reservá por WhatsApp 📲'\n+ Botón de acción directo", status:"Borrador" }),
];

// ─── BASILE DATA (junio 2026) ─────────────────────────────────────────────────
const basileData = [
  mk("basile",{ date:"2026-06-02", week:1, section:"post", type:"Reel", theme:"Novedades del mes (Gaia)", objective:"Mostrar ingresos + generar consultas mayoristas", development:"Gaia presenta los nuevos productos: bruschettas, pancakes, bebidas vegetales, shots.", script:`Hook: "Si tenés una dietética… mirá todo lo nuevo que llegó 👀"\nGaia: "Soy Gaia y te muestro los ingresos de este mes"\nMostrar: bruschettas, pancakes, bebidas vegetales, shots\nCierre: "Todo esto lo podés sumar a tu local"\nCTA: "Pedinos la lista mayorista"`, copy:"¿Tenés una dietética? Entonces esto te interesa 👀\n\nEste mes llegaron novedades que tus clientes ya están buscando:\n📦 Bruschettas\n🥞 Pancakes\n🥛 Bebidas vegetales\n⚡ Shots naturales\n\nTodo en un solo proveedor. Todo a precio mayorista.\n\n👉 Pedinos la lista y sumá variedad a tu góndola.", status:"Borrador" }),
  mk("basile",{ date:"2026-06-02", week:1, section:"story", type:"Encuesta + interacción", theme:"Novedades del mes - Stories", content:"Historia 1: Gaia: 'Arrancó el mes y tenemos novedades 👀'\nHistoria 2: Encuesta: '¿Ya hiciste pedido este mes?' (SÍ / NO)", status:"Borrador" }),
  mk("basile",{ date:"2026-06-03", week:1, section:"story", type:"Detrás de escena", theme:"Behind the scenes - Depósito", content:"Video depósito: 'Así se ve la distribuidora por dentro 📦'\nSticker: '¿Querés ver más?'", status:"Borrador" }),
  mk("basile",{ date:"2026-06-04", week:1, section:"post", type:"Carrusel", theme:"Nuevos ingresos del mes", objective:"Mostrar variedad + CTA lista mayorista", script:"", copy:"Nuevos productos que pueden hacerte vender más 👀\n\nTus clientes buscan variedad y novedades constantes.\n\n📦 Bruschettas\n🥞 Pancakes\n🥛 Bebidas vegetales\n⚡ Shots\n🍫 Barras\n\nTodo en un solo proveedor.\n\n👉 Pedinos la lista mayorista", status:"Borrador",
    slides:[{id:"b3_1",text:"Nuevos productos que pueden hacerte vender más 👀"},{id:"b3_2",text:"Tus clientes buscan variedad"},{id:"b3_3",text:"Y novedades constantes"},{id:"b3_4",text:"📦 Bruschettas"},{id:"b3_5",text:"🥞 Pancakes"},{id:"b3_6",text:"🥛 Bebidas vegetales"},{id:"b3_7",text:"⚡ Shots naturales"},{id:"b3_8",text:"🍫 Barras saludables"},{id:"b3_9",text:"Todo en un solo proveedor"},{id:"b3_10",text:"👉 Pedinos la lista mayorista"}] }),
  mk("basile",{ date:"2026-06-04", week:1, section:"story", type:"Conversión / Venta", theme:"Nuevos ingresos - CTA", content:"Historia 1: '¿Querés lista de ingresos?'\nHistoria 2: CTA: 'Te la pasamos por WhatsApp'", status:"Borrador" }),
  mk("basile",{ date:"2026-06-07", week:1, section:"post", type:"Reel", theme:"Cómo comprar en la web", objective:"Reducir fricción de compra online", script:`Hook: "¿Todavía no compraste desde nuestra web?"\nGaia:\n"Entrás a la web"\n"Elegís los productos"\n"Los agregás al carrito"\n"Confirmás el pedido"\nCierre: "Así de fácil 🙌"\nCTA: "El link está en la bio"`, copy:"¿Todavía no compraste desde nuestra web? 🛒\n\nEs más fácil de lo que pensás:\n1️⃣ Entrás al link de la bio\n2️⃣ Elegís los productos\n3️⃣ Los agregás al carrito\n4️⃣ Confirmás el pedido\n\nY listo. Te llega a tu local.\n\n👉 Probalo hoy", status:"Borrador" }),
  mk("basile",{ date:"2026-06-07", week:1, section:"story", type:"Conversión / Venta", theme:"Web - Stories", content:"Historia 1: Gaia: 'Si nunca compraste por nuestra web, te ayudamos'\nHistoria 2: Caja de preguntas: '¿Querés ayuda para tu primer pedido?'", status:"Borrador" }),
  mk("basile",{ date:"2026-06-09", week:2, section:"story", type:"Conversión / Venta", theme:"Promo pasta de maní", content:"Mostrar promo\nTexto: '🔥 5% OFF / 10% OFF en pasta de maní'\nCTA: 'Consultanos stock'", status:"Borrador" }),
  mk("basile",{ date:"2026-06-10", week:2, section:"post", type:"Carrusel", theme:"Pancakes nuevos", objective:"Presentar producto + generar pedidos", script:"", copy:"Nuevo ingreso que tus clientes te van a pedir 👀\n\nLos pancakes llegaron para quedarse.\n🥞 Prácticos para todos los días\n🟢 Opciones keto disponibles\n📦 Más variedad = más ventas\n\nStockeate antes de que se agoten.\n\n👉 Pedinos precios", status:"Borrador",
    slides:[{id:"b6_1",text:"Nuevo ingreso que tus clientes te van a pedir 👀"},{id:"b6_2",text:"Práctico para todos los días"},{id:"b6_3",text:"Ideal para el desayuno y merienda"},{id:"b6_4",text:"Variedad de sabores"},{id:"b6_5",text:"Opciones keto disponibles 🟢"},{id:"b6_6",text:"Más variedad = más ventas"},{id:"b6_7",text:"👉 Pedinos precios mayoristas"}] }),
  mk("basile",{ date:"2026-06-10", week:2, section:"story", type:"Encuesta + interacción", theme:"Pancakes - Encuesta", content:"Historia 1: Encuesta: '¿Vendés pancakes en tu local?' (SÍ / NO)\nHistoria 2: Video producto: 'Nuevo ingreso 👀'", status:"Borrador" }),
  mk("basile",{ date:"2026-06-12", week:2, section:"post", type:"Reel", theme:"Armado de pedido (Behind the scenes)", objective:"Generar confianza mostrando proceso interno", script:`Hook: "¿Sabés qué pasa después de que hacés tu pedido? 👀"\nGaia:\n"Seleccionamos los productos"\n"Armamos el pedido"\n"Controlamos todo"\n"Listo para salir 🚛"\nCierre: "Así trabajamos todos los días"\nCTA: "Hacé tu pedido hoy"`, copy:"¿Sabés qué pasa después de que hacés tu pedido? 👀\n\nTe lo mostramos por dentro:\n📦 Seleccionamos los productos\n✅ Armamos y controlamos\n🚛 Lo despachamos\n\nTrabajamos todos los días para que tu local no le falte nada.\n\n👉 Hacé tu pedido hoy", status:"Borrador" }),
  mk("basile",{ date:"2026-06-12", week:2, section:"story", type:"Detrás de escena", theme:"Armado de pedidos - Stories", content:"Historia 1: Gaia: 'Estamos armando pedidos 📦'\nHistoria 2: Encuesta: '¿Cada cuánto hacés pedido a tu proveedor?'", status:"Borrador" }),
  mk("basile",{ date:"2026-06-14", week:2, section:"story", type:"Conversión / Venta", theme:"Promo barritas", content:"Mostrar productos + promo\nCTA: 'Pedinos precios'", status:"Borrador" }),
  mk("basile",{ date:"2026-06-16", week:3, section:"post", type:"Carrusel", theme:"Barritas saludables", objective:"Mostrar línea de barritas + generar pedidos", script:"", copy:"El snack que más se vende en dietéticas 👀\n\nTus clientes buscan practicidad y opciones saludables.\n\n🍫 Laddubar\n🌿 Yakamush\n🟡 Pont\n\n+ Promos especiales este mes.\n\n¿Cuánto stock tenés?\n\n👉 Pedinos precios", status:"Borrador",
    slides:[{id:"b9_1",text:"El snack que más se vende 👀"},{id:"b9_2",text:"Tus clientes buscan practicidad"},{id:"b9_3",text:"Opciones saludables y ricas"},{id:"b9_4",text:"🍫 Laddubar"},{id:"b9_5",text:"🌿 Yakamush"},{id:"b9_6",text:"🟡 Pont"},{id:"b9_7",text:"+ Promos especiales"},{id:"b9_8",text:"👉 Pedinos precios mayoristas"}] }),
  mk("basile",{ date:"2026-06-16", week:3, section:"story", type:"Encuesta + interacción", theme:"Barritas - Encuesta", content:"Historia 1: '¿Qué snack se vende más en tu local?'\nHistoria 2: CTA con link a WhatsApp", status:"Borrador" }),
  mk("basile",{ date:"2026-06-17", week:3, section:"post", type:"Reel", theme:"No somos solo distribuidora", objective:"Posicionamiento como socio estratégico", script:`Hook: "Si pensás que solo vendemos productos… esto te va a cambiar la idea"\nGaia:\n"Te ayudamos a elegir qué conviene más"\n"Te mostramos las tendencias"\n"Te asesoramos para que vendas más"\nCierre: "Somos más que proveedores"\nCTA: "Hablemos"`, copy:"Si pensás que solo vendemos productos… esto te va a cambiar la idea 👀\n\nEn Basile:\n✅ Te ayudamos a elegir qué conviene más\n📈 Te mostramos las tendencias del mercado\n🤝 Te asesoramos para que vendas más\n\nSomos más que proveedores. Somos parte de tu negocio.\n\n👉 Escribinos y empecemos", status:"Borrador" }),
  mk("basile",{ date:"2026-06-17", week:3, section:"story", type:"Encuesta + interacción", theme:"No somos solo distribuidora - Stories", content:"Historia 1: Gaia: 'No somos solo proveedores'\nHistoria 2: Encuesta: '¿Tenés una dietética o local saludable?' (SÍ / Estoy armando uno)", status:"Borrador" }),
  mk("basile",{ date:"2026-06-18", week:3, section:"story", type:"Novedades", theme:"Bebidas vegetales", content:"Gaia mostrando producto:\n'Un básico que no puede faltar en tu góndola 🥛'\n'Bebidas vegetales — consultanos stock'", status:"Borrador" }),
  mk("basile",{ date:"2026-06-19", week:3, section:"post", type:"Carrusel", theme:"Promos del mes", objective:"Mostrar descuentos y generar urgencia", script:"", copy:"Promos que no podés dejar pasar 👀\n\nStockearte mejor = vender más.\n\nEste mes:\n🥜 Pasta de maní\n☕ Café\n🍯 Dulces y mermeladas\n🍫 Barritas\n\n⚠️ Hasta agotar stock.\n\n👉 Consultanos ahora", status:"Borrador",
    slides:[{id:"b12_1",text:"Promos que no podés dejar pasar 👀"},{id:"b12_2",text:"Stockearte mejor = vender más"},{id:"b12_3",text:"🥜 Pasta de maní — OFF especial"},{id:"b12_4",text:"☕ Café — precio mayorista"},{id:"b12_5",text:"🍯 Dulces y mermeladas"},{id:"b12_6",text:"🍫 Barritas — promo combo"},{id:"b12_7",text:"⚠️ Hasta agotar stock"},{id:"b12_8",text:"👉 Consultanos ahora"}] }),
  mk("basile",{ date:"2026-06-19", week:3, section:"story", type:"Conversión / Venta", theme:"Promos del mes - Stories", content:"Historia 1: Mostrar promos con precio\nHistoria 2: CTA 'Consultanos ahora'", status:"Borrador" }),
  mk("basile",{ date:"2026-06-21", week:3, section:"post", type:"Reel", theme:"Pedido real (Social proof)", objective:"Mostrar volumen y confianza", script:`Hook: "Este pedido ya tiene dueño…"\nMostrar cajas + productos organizados\nGaia: "Esto también puede ser tu local"\nCTA: "Escribinos y pedí el tuyo"`, copy:"Este pedido ya tiene dueño… 📦\n\nAsí se ve cuando confiás en un proveedor que trabaja bien.\n\n¿Tu local ya tiene todo lo que necesita este mes?\n\n👉 Escribinos y armamos tu pedido", status:"Borrador" }),
  mk("basile",{ date:"2026-06-21", week:3, section:"story", type:"Detrás de escena", theme:"Pedido real - Stories", content:"Historia 1: Video salida de pedidos 🚛\n'Los pedidos están saliendo. ¿El tuyo está listo?'", status:"Borrador" }),
  mk("basile",{ date:"2026-06-23", week:4, section:"story", type:"Novedades", theme:"Shot Natier", content:"Gaia:\n'Nuevo ingreso: energía natural ⚡'\n'Shot Natier — consultanos precio mayorista'", status:"Borrador" }),
  mk("basile",{ date:"2026-06-24", week:4, section:"story", type:"Encuesta + interacción", theme:"Caja de preguntas", content:"Caja de preguntas: '¿Qué necesitás para tu local?'\nGaia responde las preguntas en la siguiente historia.", status:"Borrador" }),
];

// ─── CARO DATA (junio 2026) ───────────────────────────────────────────────────
const caroData = [
  mk("caro",{ date:"2026-06-03", week:1, type:"Reel", theme:"Qué comer después de entrenar", objective:"Contenido guardable", script:"Hook: Si entrenás y después no comés bien, estás perdiendo resultados.\nDesarrollo: proteína + energía.\nCierre: La recuperación también es parte del entrenamiento.", copy:"Si entrenás y después no comés bien… estás perdiendo parte de los resultados.\n\nTu cuerpo necesita:\n✔ energía para recuperar\n✔ proteína para reparar el músculo\n\n💡 Ejemplos:\n• yogur griego + fruta\n• pollo + arroz + verduras\n• tostada con huevo\n\n👉 La recuperación también es parte del entrenamiento.", status:"Enviado al cliente", internalNotes:[{id:"in1",author:"CM",text:"Confirmar con Caro si agrega foto propia",date:"14/05/2026"}], checklist:createChecklist().map((c,i)=>i<5?{...c,done:true}:c) }),
  mk("caro",{ date:"2026-06-07", week:1, type:"Reel", theme:"Cómo son mis consultas", objective:"Generar confianza", script:"Hook: Muchas personas me preguntan cómo es una consulta nutricional.\nDesarrollo: historia clínica, composición corporal, hábitos, plan personalizado.\nCierre: No es solo una dieta, es construir hábitos.", copy:"✋ Basta de planes de comida que terminan en el cajón.\n\nMi enfoque:\n1️⃣ No es una dieta, es un proceso\n2️⃣ Sin juicios\n3️⃣ Herramientas reales\n\n¿Querés empezar? Escribime por DM ✨", status:"Borrador", internalNotes:[{id:"in2",author:"CM",text:"Grabar en el consultorio si es posible",date:"14/05/2026"}] }),
  mk("caro",{ date:"2026-06-10", week:2, type:"Reel", theme:"Carbohidratos ¿engordan?", objective:"Educación y derribar mitos", script:"Hook: ¿Los carbohidratos engordan? La respuesta corta es no.\nDesarrollo: a completar con info de Caro.\nCierre: En un plan bien armado forman parte de una alimentación saludable.", copy:"🛑 ¿Todavía le tenés miedo a los carbohidratos?\n\nError nº1 que veo en consulta.\n\nCuando los eliminás:\n1️⃣ Tu energía cae en picada\n2️⃣ Aparece la ansiedad\n3️⃣ El plan se vuelve insostenible\n\nLa clave: elegirlos bien 🥖🥔🍎\n\n¿Querés aprender a comer sin miedo? Comentá HABITOS 👇", status:"Borrador" }),
  mk("caro",{ date:"2026-06-11", week:2, type:"Carrusel", theme:"Inspo desayunos", objective:"Inspiración + engagement", copy:"", status:"Idea", internalNotes:[{id:"in3",author:"CM",text:"Buscar fotos de desayunos estéticos",date:"14/05/2026"}] }),
  mk("caro",{ date:"2026-06-12", week:2, type:"Carrusel", theme:"No necesitás otro suplemento", objective:"Educación", copy:"¿Qué suplemento tengo que tomar?\n\nLa base está en la alimentación 🥗, los hábitos 😴 y el movimiento 🏋️‍♀️.\n\nRecién después suman los suplementos.\n\nNo hacen magia: complementan.", status:"Cambios solicitados", slides:[{id:"s1",text:"NO NECESITÁS OTRO SUPLEMENTO"},{id:"s2",text:"El cambio no empieza por un suplemento"},{id:"s3",text:"Empieza por la base: 🥗 😴 🏋️‍♀️"},{id:"s4",text:"No hacen magia. Complementan 💛"}], clientComments:[{id:"cm1",author:"Cliente",text:"Me gusta, pero lo haría un poco menos tajante.",date:"14/05/2026"}] }),
  mk("caro",{ date:"2026-06-17", week:3, type:"Carrusel", theme:"Hambre real vs ansiedad", objective:"Conexión con el público", script:"INFO DADA POR CARO", copy:"🚨 ¿Hambre o ansiedad?\n\nHambre Real: aparece gradual, se calma con cualquier alimento 🍎\nHambre Emocional: aparece de golpe, busca algo específico 🍫\n\nDiferenciarlos es el primer paso para comer sin culpas.\n\n¿Cuál te visita más seguido? 👇", status:"Para revisión interna", slides:[{id:"sc1",text:"¿TENÉS HAMBRE O ANSIEDAD? 🧠"},{id:"sc2",text:"El hambre real aparece de forma gradual"},{id:"sc3",text:"La ansiedad aparece de golpe"},{id:"sc4",text:"El hambre real se satisface con comida"},{id:"sc5",text:"La ansiedad busca alimentos específicos"},{id:"sc6",text:"Aprender a reconocerlo cambia todo 💛"}], internalNotes:[{id:"in4",author:"CM",text:"Revisar si Caro quiere agregar un slide de solución",date:"14/05/2026"}] }),
  mk("caro",{ date:"2026-06-18", week:3, type:"Carrusel", theme:"Tu hambre no es el problema", objective:"Conexión con audiencia femenina", copy:"No es falta de control, es tu cuerpo adaptándose.\n\nA lo largo del ciclo cambia tu energía y tu hambre. Entenderte es la clave 💛", status:"Borrador", slides:[{id:"sh1",text:"TU HAMBRE NO ES EL PROBLEMA"},{id:"sh2",text:"No es falta de control"},{id:"sh3",text:"Es tu cuerpo adaptándose"},{id:"sh4",text:"🩸 Menstruación → menos energía"},{id:"sh5",text:"🌙 Lútea → más hambre y antojos"},{id:"sh6",text:"Aprendé a adaptarte, no a exigirte 💛"}] }),
  mk("caro",{ date:"2026-06-19", week:3, type:"Carrusel", theme:"Peso de la balanza vs composición corporal", objective:"Educación y autoridad", script:"INFO DADA POR CARO", copy:"Muchas veces te pesás y sentís que no hay cambios.\n\nPero la balanza no siempre cuenta la historia completa.\n\nPodés ver el mismo número y tener más músculo y menos grasa.\n\nPor eso evaluamos composición corporal, no solo kilos 💛", status:"Borrador", slides:[{id:"sb1",text:"LA BALANZA TE ESTÁ MINTIENDO"},{id:"sb2",text:"El peso no cuenta toda la historia"},{id:"sb3",text:"Podés estar igual… y haber cambiado todo"},{id:"sb4",text:"Más músculo, menos grasa"},{id:"sb5",text:"Por eso no evaluamos solo kilos"},{id:"sb6",text:"No sos un número 💛"}] }),
  mk("caro",{ date:"2026-06-24", week:4, type:"Carrusel", theme:"Alimentación en menopausia", objective:"Posicionamiento en nutrición femenina", script:"INFO DADA POR CARO", copy:"¿Tu metabolismo se 'rompió' por la menopausia?\n\n¡No es así! ✋ Tus necesidades cambiaron.\n\nComer MEJOR:\n✅ Proteína\n✅ Grasas saludables\n✅ Carbohidratos de calidad\n\nNo te resignés. RE-APRENDÉ a nutrirte ✨\n\n¿Estás en esta etapa? Escribime 📲", status:"Borrador", slides:[{id:"sm1",text:"LA ALIMENTACIÓN EN MENOPAUSIA SÍ IMPORTA"},{id:"sm2",text:"En esta etapa cambia el metabolismo"},{id:"sm3",text:"Suele aumentar la tendencia a acumular grasa"},{id:"sm4",text:"La proteína se vuelve más importante 🥩"},{id:"sm5",text:"El entrenamiento de fuerza ayuda mucho 💪"},{id:"sm6",text:"Una buena alimentación puede ayudarte ✨"}], internalNotes:[{id:"in5",author:"CM",text:"Este contenido puede servir para pauta",date:"14/05/2026"}] }),
  // Stories Caro
  mk("caro",{ date:"2026-06-03", week:1, section:"story", type:"Encuesta + interacción", theme:"Entrenamiento y alimentación", content:"Historia 1: Encuesta → '¿Entrenás actualmente?' (Sí / No pero quiero empezar)\nHistoria 2: Caja de preguntas → '¿Qué solés comer después de entrenar?'", status:"Enviado al cliente" }),
  mk("caro",{ date:"2026-06-04", week:1, section:"story", type:"Video + tip", theme:"Post entrenamiento", content:"Historia 1 (video): Caro hablando a cámara.\nGuion: 'Una duda muy común es qué comer después de entrenar. [info de Caro]'\nHistoria 2: 'Ejemplos: yogur griego / pollo con arroz / tostada con huevo.'", status:"Borrador", internalNotes:[{id:"in6",author:"CM",text:"Recordarle a Caro que grabe este video",date:"14/05/2026"}] }),
  mk("caro",{ date:"2026-06-05", week:1, section:"story", type:"Consultorio / Consultas", theme:"Mostrar su trabajo", content:"Historia 1: Foto o video del consultorio.\n'Hoy en consulta trabajamos recomposición corporal, ansiedad y organización de comidas.'\nHistoria 2: 'Si sentís que probaste mil dietas y nada funciona, muchas veces el problema no es la comida sino el enfoque.'", status:"Borrador" }),
  mk("caro",{ date:"2026-06-10", week:2, section:"story", type:"Encuesta + educación", theme:"Carbohidratos", content:"Historia 1: Encuesta → '¿Le tenés miedo a los carbohidratos?'\nHistoria 2: 'Los carbohidratos son la principal fuente de energía del cuerpo. [INFO DE CARO]'", status:"Borrador" }),
  mk("caro",{ date:"2026-06-11", week:2, section:"story", type:"Video + tip", theme:"Derribar mito carbohidratos", content:"Historia 1 (video):\nGuion: 'Muchos pacientes llegan pensando que los carbohidratos engordan. En realidad el problema suele ser el contexto de la alimentación.'", status:"Borrador" }),
  mk("caro",{ date:"2026-06-12", week:2, section:"story", type:"Caja de preguntas", theme:"Interacción carbohidratos", content:"Historia 1: Caja de preguntas → '¿Qué dudas tenés sobre carbohidratos?'\nHistoria 2: Foto de plato equilibrado. 'Ejemplo: proteína + carbohidrato + verduras.'", status:"Borrador" }),
  mk("caro",{ date:"2026-06-17", week:3, section:"story", type:"Encuesta + educación", theme:"Hambre vs ansiedad", content:"Historia 1: Encuesta → '¿Te pasa que comés por ansiedad?'\nHistoria 2: 'Hambre real aparece gradual. Ansiedad aparece de golpe.'", status:"Borrador" }),
  mk("caro",{ date:"2026-06-18", week:3, section:"story", type:"Video + tip", theme:"Explicación hambre vs ansiedad", content:"Historia 1 (video):\nGuion: 'Algo que trabajamos en consulta es diferenciar hambre real de ansiedad. El hambre real aparece gradual y se satisface con comida. La ansiedad aparece de golpe y busca algo específico.'", status:"Borrador" }),
  mk("caro",{ date:"2026-06-19", week:3, section:"story", type:"Profesional", theme:"Evaluación corporal", content:"Historia 1: Foto o video evaluación corporal.\n'En consulta evaluamos masa muscular, masa grasa y composición corporal. No solo el peso.'", status:"Borrador" }),
  mk("caro",{ date:"2026-06-24", week:4, section:"story", type:"Encuesta + educación", theme:"Menopausia y metabolismo", content:"Historia 1: Encuesta → '¿Sabías que el metabolismo cambia en la menopausia?'\nHistoria 2: 'En esta etapa suele aumentar la grasa corporal y disminuir la masa muscular.'", status:"Borrador" }),
  mk("caro",{ date:"2026-06-25", week:4, section:"story", type:"Video + tip", theme:"Nutrición en menopausia", content:"Historia 1 (video):\nGuion: 'En menopausia muchas mujeres sienten que su metabolismo cambió. La alimentación y el entrenamiento de fuerza pueden ayudar muchísimo.'", status:"Borrador" }),
  mk("caro",{ date:"2026-06-26", week:4, section:"story", type:"Conversión / Venta", theme:"Consultas abiertas", content:"Historia 1: 'En consulta trabajamos hábitos, composición corporal y alimentación real.'\nHistoria 2: 'Si querés mejorar tu alimentación y sentirte mejor con tu cuerpo, podés agendar una consulta.'", status:"Borrador" }),
];

const initialData = { basile: basileData, caro: caroData, suitehouse: suiteData };

function newContent(accountId) { return mk(accountId,{}); }

export default function App() {
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [data, setData] = useState(() => { try { const s=localStorage.getItem(STORAGE_KEY); return s?JSON.parse(s):initialData; } catch(e){ return initialData; } });
  const [view, setView] = useState("manager");
  const [tab, setTab] = useState("calendar");
  const [activeAccountId, setActiveAccountId] = useState("caro");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState(newContent("caro"));
  const [clientComment, setClientComment] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [calendarMode, setCalendarMode] = useState("list"); // list | month | kanban
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayPanel, setShowDayPanel] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(todayISO().slice(0,7));
  const [filters, setFilters] = useState({ client:"current", status:"all", type:"all", section:"all", month:"", week:"all", search:"", withComments:false, incomplete:false, changes:false });

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(data)); } catch(e){} }, [data]);

  const account = accounts.find(a=>a.id===activeAccountId);
  const B = account.brand;

  const allItems = useMemo(()=>Object.entries(data).flatMap(([aid,items])=>items.map(item=>({...item,accountId:aid,accountName:accounts.find(a=>a.id===aid)?.name||aid}))),[data,accounts]);

  const visibleItems = useMemo(()=>{
    let items = view==="client"?(data[activeAccountId]||[]):allItems;
    if(view==="manager"&&filters.client==="current") items=items.filter(i=>i.accountId===activeAccountId);
    if(view==="manager"&&filters.client!=="current"&&filters.client!=="all") items=items.filter(i=>i.accountId===filters.client);
    if(filters.section!=="all") items=items.filter(i=>i.section===filters.section);
    if(filters.status!=="all") items=items.filter(i=>i.status===filters.status);
    if(filters.type!=="all") items=items.filter(i=>i.type===filters.type);
    if(filters.week!=="all") items=items.filter(i=>String(i.week)===String(filters.week));
    if(filters.month) items=items.filter(i=>i.date?.startsWith(filters.month));
    if(filters.withComments) items=items.filter(i=>i.clientComments?.length);
    if(filters.changes) items=items.filter(i=>i.status==="Cambios solicitados");
    if(filters.incomplete) items=items.filter(i=>!i.date||!i.theme||(i.section==="post"&&!i.copy&&!i.script)||(i.section==="story"&&!i.content));
    if(filters.search.trim()){const q=filters.search.toLowerCase();items=items.filter(i=>[i.theme,i.copy,i.script,i.content,i.objective].join(" ").toLowerCase().includes(q));}
    return items.sort((a,b)=>(a.date||"").localeCompare(b.date||""));
  },[data,activeAccountId,allItems,filters,view]);

  const stats = useMemo(()=>{
    const byClient=accounts.map(acc=>{
      const items=data[acc.id]||[];
      return {id:acc.id,name:acc.name,emoji:acc.emoji,brand:acc.brand,
        total:items.length,drafts:items.filter(i=>i.status==="Borrador").length,
        sent:items.filter(i=>i.status==="Enviado al cliente").length,
        changes:items.filter(i=>i.status==="Cambios solicitados").length,
        approved:items.filter(i=>i.status==="Aprobado").length,
        scheduled:items.filter(i=>i.status==="Programado").length,
        published:items.filter(i=>i.status==="Publicado").length,
        comments:items.reduce((a,i)=>a+(i.clientComments?.length||0),0),
        noCopy:items.filter(i=>i.section==="post"&&!i.copy).length,
        noScript:items.filter(i=>i.section==="post"&&!i.script).length,
      };
    });
    const now=new Date(todayISO()+"T00:00:00");
    const next7=allItems.filter(i=>{if(!i.date)return false;const d=new Date(i.date+"T00:00:00");const diff=(d-now)/86400000;return diff>=0&&diff<=7;});
    return {byClient,next7};
  },[data,accounts,allItems]);

  function updateItem(item){setData(prev=>({...prev,[item.accountId]:prev[item.accountId].map(i=>i.id===item.id?item:i)}));}
  function saveSelected(){if(!selectedItem)return;updateItem({...selectedItem,week:getWeekFromDate(selectedItem.date)});setSelectedItem(null);}
  function deleteSelected(){if(!selectedItem)return;setData(prev=>({...prev,[selectedItem.accountId]:prev[selectedItem.accountId].filter(i=>i.id!==selectedItem.id)}));setSelectedItem(null);}
  function duplicateItem(item){const dup={...item,id:`${item.accountId}_${Date.now()}`,theme:`${item.theme} (copia)`,status:"Borrador",clientComments:[],internalNotes:[],metrics:createMetrics(),checklist:createChecklist()};setData(prev=>({...prev,[item.accountId]:[...prev[item.accountId],dup]}));}
  function createItem(){if(!draft.theme.trim())return;const item={...draft,id:`${activeAccountId}_${Date.now()}`,accountId:activeAccountId,week:getWeekFromDate(draft.date)};setData(prev=>({...prev,[activeAccountId]:[...prev[activeAccountId],item]}));setDraft(newContent(activeAccountId));setShowNew(false);}
  function addClientComment(){if(!clientComment.trim()||!selectedItem)return;const c={id:`cc_${Date.now()}`,author:view==="client"?"Cliente":"CM",text:clientComment,date:new Date().toLocaleDateString("es-AR")};const updated={...selectedItem,clientComments:[...(selectedItem.clientComments||[]),c]};setSelectedItem(updated);updateItem(updated);setClientComment("");}
  function addInternalNote(){if(!internalNote.trim()||!selectedItem)return;const n={id:`in_${Date.now()}`,author:"CM",text:internalNote,date:new Date().toLocaleDateString("es-AR")};const updated={...selectedItem,internalNotes:[...(selectedItem.internalNotes||[]),n]};setSelectedItem(updated);updateItem(updated);setInternalNote("");}
  function removeInternalNote(id){const updated={...selectedItem,internalNotes:selectedItem.internalNotes.filter(n=>n.id!==id)};setSelectedItem(updated);updateItem(updated);}
  function approveSelected(){const u={...selectedItem,status:"Aprobado"};setSelectedItem(u);updateItem(u);}
  function requestChanges(){const u={...selectedItem,status:"Cambios solicitados"};setSelectedItem(u);updateItem(u);}
  function toggleChecklist(id){setSelectedItem(prev=>({...prev,checklist:prev.checklist.map(c=>c.id===id?{...c,done:!c.done}:c)}));}
  function updateMetric(key,value){setSelectedItem(prev=>({...prev,metrics:{...prev.metrics,[key]:value}}));}
  function updateBrandKit(field,value){setAccounts(prev=>prev.map(acc=>acc.id===activeAccountId?{...acc,brandKit:{...acc.brandKit,[field]:value}}:acc));}

  function exportCSV(){
    const rows=[["Cliente","Fecha","Sección","Tipo","Tema","Estado","Copy/Contenido","Guion/Script"],...visibleItems.map(i=>[i.accountName||account.name,i.date,i.section,i.type,i.theme,i.status,(i.copy||i.content||"").replace(/\n/g," "),(i.script||"").replace(/\n/g," ")])];
    const csv=rows.map(r=>r.map(v=>`"${v||""}"`).join(",")).join("\n");
    const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="calendario.csv";a.click();URL.revokeObjectURL(url);
  }

  async function runAI(prompt){
    setAiLoading(true);setAiOutput("");
    const kit=account.brandKit;
    const fullPrompt=`Sos una experta Community Manager y estratega de contenido para redes sociales.

CLIENTE: ${account.name}
DESCRIPCIÓN: ${account.description}
PÚBLICO: ${kit.audience}
OBJETIVO: ${kit.objective}
TONO: ${kit.tone}
PALABRAS SÍ: ${kit.wordsYes}
PALABRAS NO: ${kit.wordsNo}
NOTAS: ${kit.notes}
${selectedItem?`\nCONTENIDO ACTIVO:\n- Tema: ${selectedItem.theme}\n- Tipo: ${selectedItem.type}\n- Estado: ${selectedItem.status}\n- Copy: ${selectedItem.copy||"sin copy"}\n- Guion: ${selectedItem.script||"sin guion"}`:""}
${(selectedItem?.clientComments||[]).length?`\nCOMENTARIOS DEL CLIENTE:\n${selectedItem.clientComments.map(c=>c.text).join("\n")}`:""}

PEDIDO: ${prompt}

Respondé de forma clara, concreta y lista para usar. Sin rodeos.`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:fullPrompt}]})});
      const json=await res.json();
      setAiOutput(json.content?.filter(b=>b.type==="text").map(b=>b.text).join("\n")||"Sin respuesta.");
    }catch(e){setAiOutput("Error al conectar. Intentá de nuevo.");}
    setAiLoading(false);
  }

  const S={
    input:{width:"100%",padding:"9px 11px",border:`1.5px solid ${B.inputBorder}`,borderRadius:8,fontSize:13,fontFamily:B.fontBody,color:B.text,background:B.white,boxSizing:"border-box",outline:"none"},
    textarea:{width:"100%",padding:"9px 11px",border:`1.5px solid ${B.inputBorder}`,borderRadius:8,fontSize:13,fontFamily:B.fontBody,color:B.text,background:B.white,boxSizing:"border-box",outline:"none",resize:"vertical",minHeight:80,lineHeight:1.65},
    label:{display:"block",fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1.2,color:"#888",marginBottom:5},
    btn:{padding:"9px 16px",borderRadius:8,border:"none",background:B.btnBg,color:B.btnText,fontWeight:700,cursor:"pointer",fontSize:13},
    outline:{padding:"9px 16px",borderRadius:8,border:`1.5px solid ${B.primary}`,background:"transparent",color:B.primary,fontWeight:700,cursor:"pointer",fontSize:13},
    field:{marginBottom:14},
    sTitle:{fontSize:11,fontWeight:800,color:B.primary,textTransform:"uppercase",letterSpacing:1.5,marginBottom:8},
  };

  function Badge({status}){return <span style={{padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:800,color:STATUS_COLORS[status],background:`${STATUS_COLORS[status]}20`,border:`1px solid ${STATUS_COLORS[status]}40`}}>{status}</span>;}
  function Pill({label}){return <span style={{display:"inline-block",padding:"2px 8px",borderRadius:6,fontSize:10,fontWeight:600,background:`${B.primary}25`,color:B.primary,marginRight:4}}>{label}</span>;}

  function renderCard(item){
    const done=item.checklist?.filter(c=>c.done).length||0;
    const total=item.checklist?.length||10;
    return(
      <div key={item.id} onClick={()=>setSelectedItem(item)}
        style={{background:B.cardBg,border:`1px solid ${B.primary}35`,borderLeft:`5px solid ${STATUS_COLORS[item.status]||"#ccc"}`,borderRadius:14,padding:16,marginBottom:10,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",transition:"all 0.18s"}}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 20px ${B.primary}30`;}}
        onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.05)";}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:10,marginBottom:8}}>
          <div>
            <div style={{fontWeight:700,fontSize:15,fontFamily:B.fontTitle,marginBottom:4}}>{item.theme||"Sin título"}</div>
            <div style={{fontSize:12,color:"#777"}}><Pill label={item.section==="story"?"Story":item.type}/>{getDayName(item.date)}</div>
            {view==="manager"&&filters.client==="all"&&<div style={{fontSize:12,color:"#aaa",marginTop:2}}>{item.accountName}</div>}
          </div>
          <div style={{flexShrink:0}}><Badge status={item.status}/></div>
        </div>
        <div style={{display:"flex",gap:12,fontSize:12,color:"#aaa",flexWrap:"wrap"}}>
          {(item.clientComments||[]).length>0&&<span>💬 {item.clientComments.length}</span>}
          {view==="manager"&&(item.internalNotes||[]).length>0&&<span>📝 {item.internalNotes.length}</span>}
          {view==="manager"&&<span style={{color:done===total?"#22c55e":"#aaa"}}>✅ {done}/{total}</span>}
          {item.slides?.length>0&&<span>📋 {item.slides.length} slides</span>}
          {item.section==="story"&&<span style={{color:B.primary}}>📖 Historia</span>}
        </div>
      </div>
    );
  }

  function getItemsByDate(date) { return visibleItems.filter(i=>i.date===date); }

  // ─── MONTH CALENDAR ────────────────────────────────────────────────────────
  function renderMonthCalendar() {
    const [year, month] = currentMonth.split("-").map(Number);
    const firstDay = new Date(year, month-1, 1);
    const lastDay = new Date(year, month, 0);
    const startDow = (firstDay.getDay()+6)%7; // Mon=0
    const totalDays = lastDay.getDate();
    const cells = [];
    for(let i=0;i<startDow;i++) cells.push(null);
    for(let d=1;d<=totalDays;d++) cells.push(d);
    while(cells.length%7!==0) cells.push(null);

    const weeks=[];
    for(let i=0;i<cells.length;i+=7) weeks.push(cells.slice(i,i+7));
    const DOW=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
    const MONTH_NAMES=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

    function dayStr(d){ return d?`${year}-${String(month).padStart(2,"0")}-${String(d).padStart(2,"0")}`:null; }

    function DayCell({d}){
      if(!d) return <div style={{background:"transparent",borderRadius:10,minHeight:90}}/>;
      const ds=dayStr(d);
      const items=getItemsByDate(ds);
      const isToday=ds===todayISO();
      const hasPending=items.some(i=>i.status==="Para revisión interna"||i.status==="Enviado al cliente"||i.status==="Cambios solicitados");
      const hasApproved=items.some(i=>i.status==="Aprobado"||i.status==="Programado");
      const hasPublished=items.some(i=>i.status==="Publicado");
      const posts=items.filter(i=>i.section==="post");
      const stories=items.filter(i=>i.section==="story");
      const typeCounts={};
      posts.forEach(i=>{typeCounts[i.type]=(typeCounts[i.type]||0)+1;});
      const dotColor = hasPublished?"#6366f1":hasApproved?"#22c55e":hasPending?"#f59e0b":"#e5e7eb";

      return(
        <div onClick={()=>{setSelectedDate(ds);setShowDayPanel(true);}}
          style={{background:items.length>0?B.cardBg:"transparent",borderRadius:10,minHeight:90,padding:"7px 8px",cursor:items.length>0?"pointer":"default",border:isToday?`2px solid ${B.primary}`:`1px solid ${items.length>0?B.primary+"40":"#e5e7eb"}`,transition:"all 0.18s",position:"relative"}}
          onMouseEnter={e=>{if(items.length>0){e.currentTarget.style.boxShadow=`0 4px 14px ${B.primary}30`;e.currentTarget.style.transform="translateY(-1px)";}}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{fontWeight:isToday?800:600,fontSize:13,color:isToday?B.primary:B.text,background:isToday?`${B.primary}20`:"transparent",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center"}}>{d}</span>
            {items.length>0&&<div style={{width:8,height:8,borderRadius:"50%",background:dotColor}}/>}
          </div>
          {items.length>0&&(
            <>
              <div style={{fontSize:10,color:"#888",marginBottom:4}}>{items.length} pieza{items.length!==1?"s":""}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                {Object.entries(typeCounts).map(([type,count])=>(
                  <span key={type} style={{fontSize:9,padding:"1px 5px",borderRadius:10,background:`${B.primary}30`,color:B.primary,fontWeight:700}}>{type} {count>1?`×${count}`:""}</span>
                ))}
                {stories.length>0&&<span style={{fontSize:9,padding:"1px 5px",borderRadius:10,background:`${B.accent}30`,color:B.accent,fontWeight:700}}>📖 ×{stories.length}</span>}
              </div>
            </>
          )}
        </div>
      );
    }

    return(
      <div>
        {/* Month nav */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <button onClick={()=>{const d=new Date(year,month-2,1);setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);}} style={{...S.outline,padding:"7px 14px",fontSize:16}}>‹</button>
          <h2 style={{margin:0,fontFamily:"'Georgia',serif",fontSize:20}}>{MONTH_NAMES[month-1]} {year}</h2>
          <button onClick={()=>{const d=new Date(year,month,1);setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);}} style={{...S.outline,padding:"7px 14px",fontSize:16}}>›</button>
          <button onClick={()=>setCurrentMonth(todayISO().slice(0,7))} style={{...S.outline,padding:"6px 12px",fontSize:12,marginLeft:4}}>Hoy</button>
          <div style={{marginLeft:"auto",fontSize:13,color:"#888"}}>{visibleItems.filter(i=>i.date?.startsWith(currentMonth)).length} contenidos este mes</div>
        </div>

        {/* Grid header */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:6}}>
          {DOW.map(d=><div key={d} style={{textAlign:"center",fontSize:11,fontWeight:800,color:"#aaa",padding:"6px 0",textTransform:"uppercase",letterSpacing:1}}>{d}</div>)}
        </div>

        {/* Grid weeks */}
        {weeks.map((week,wi)=>(
          <div key={wi} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:6}}>
            {week.map((d,di)=><DayCell key={di} d={d}/>)}
          </div>
        ))}

        {/* Legend */}
        <div style={{display:"flex",gap:16,marginTop:12,fontSize:11,color:"#aaa",flexWrap:"wrap"}}>
          {[["#6366f1","Publicado"],["#22c55e","Aprobado/Programado"],["#f59e0b","Pendiente revisión"],["#e5e7eb","Sin estado crítico"]].map(([color,label])=>(
            <span key={label} style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:color,display:"inline-block"}}/>
              {label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // ─── DAY PANEL ─────────────────────────────────────────────────────────────
  function renderDayPanel() {
    if(!showDayPanel||!selectedDate) return null;
    const dayItems = getItemsByDate(selectedDate);
    const posts = dayItems.filter(i=>i.section==="post");
    const stories = dayItems.filter(i=>i.section==="story");
    const dateLabel = getDayName(selectedDate);
    const isClient = view==="client";

    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:900,display:"flex",justifyContent:"flex-end"}} onClick={e=>e.target===e.currentTarget&&setShowDayPanel(false)}>
        <div style={{background:B.white,width:"100%",maxWidth:480,height:"100%",overflowY:"auto",boxShadow:"-8px 0 40px rgba(0,0,0,0.2)",display:"flex",flexDirection:"column"}}>
          {/* Header */}
          <div style={{padding:"18px 20px",background:B.primary,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
            <div>
              <div style={{color:`${B.btnText}90`,fontSize:11,marginBottom:2,textTransform:"uppercase",letterSpacing:1}}>Contenidos del día</div>
              <div style={{color:B.btnText,fontWeight:800,fontSize:17,fontFamily:B.fontTitle}}>{dateLabel}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              {view==="manager"&&(
                <button onClick={()=>{setShowDayPanel(false);setDraft({...newContent(activeAccountId),date:selectedDate,week:getWeekFromDate(selectedDate)});setShowNew(true);}}
                  style={{padding:"7px 14px",borderRadius:8,border:`1.5px solid ${B.btnText}`,background:"transparent",color:B.btnText,fontWeight:700,fontSize:12,cursor:"pointer"}}>
                  + Nuevo
                </button>
              )}
              <button onClick={()=>setShowDayPanel(false)} style={{padding:"7px 12px",borderRadius:8,border:`1.5px solid ${B.btnText}50`,background:"transparent",color:B.btnText,cursor:"pointer",fontSize:16}}>✕</button>
            </div>
          </div>

          <div style={{padding:18,flex:1}}>
            {dayItems.length===0?(
              <div style={{textAlign:"center",padding:"48px 20px",color:"#aaa"}}>
                <div style={{fontSize:32,marginBottom:10}}>📭</div>
                <div style={{fontSize:14,marginBottom:16}}>No hay contenidos para este día</div>
                {view==="manager"&&(
                  <button onClick={()=>{setShowDayPanel(false);setDraft({...newContent(activeAccountId),date:selectedDate,week:getWeekFromDate(selectedDate)});setShowNew(true);}}
                    style={{...S.btn,padding:"9px 20px"}}>
                    + Crear contenido para este día
                  </button>
                )}
              </div>
            ):(
              <>
                {posts.length>0&&(
                  <div style={{marginBottom:20}}>
                    <div style={{...S.sTitle,marginBottom:10}}>📌 Posts & Reels ({posts.length})</div>
                    {posts.map(item=>(
                      <DayPanelCard key={item.id} item={item} onOpen={()=>{setShowDayPanel(false);setSelectedItem(item);}} isClient={isClient} B={B} S={S}/>
                    ))}
                  </div>
                )}
                {stories.length>0&&(
                  <div>
                    <div style={{...S.sTitle,marginBottom:10}}>📖 Historias ({stories.length})</div>
                    {stories.map(item=>(
                      <DayPanelCard key={item.id} item={item} onOpen={()=>{setShowDayPanel(false);setSelectedItem(item);}} isClient={isClient} B={B} S={S}/>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── KANBAN ────────────────────────────────────────────────────────────────
  function renderKanban() {
    const kanbanCols = ["Idea","Borrador","En producción","Enviado al cliente","Cambios solicitados","Aprobado","Programado","Publicado"];
    return(
      <div>
        <div style={{overflowX:"auto",paddingBottom:16}}>
          <div style={{display:"flex",gap:12,minWidth:kanbanCols.length*210}}>
            {kanbanCols.map(status=>{
              const colItems = visibleItems.filter(i=>i.status===status);
              return(
                <div key={status} style={{width:200,flexShrink:0}}>
                  <div style={{padding:"8px 12px",borderRadius:"10px 10px 0 0",background:`${STATUS_COLORS[status]}20`,border:`1px solid ${STATUS_COLORS[status]}40`,borderBottom:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:12,fontWeight:800,color:STATUS_COLORS[status]}}>{status}</span>
                    <span style={{fontSize:11,background:STATUS_COLORS[status],color:"#fff",borderRadius:20,padding:"1px 7px",fontWeight:700}}>{colItems.length}</span>
                  </div>
                  <div style={{background:"#f8f8f8",borderRadius:"0 0 10px 10px",border:`1px solid ${STATUS_COLORS[status]}40`,minHeight:200,padding:8}}>
                    {colItems.length===0&&<div style={{fontSize:12,color:"#ccc",textAlign:"center",padding:"20px 0"}}>Vacío</div>}
                    {colItems.map(item=>(
                      <div key={item.id} onClick={()=>setSelectedItem(item)}
                        style={{background:B.cardBg,borderRadius:8,padding:"10px 12px",marginBottom:8,cursor:"pointer",border:`1px solid ${B.primary}30`,borderLeft:`3px solid ${STATUS_COLORS[item.status]}`,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",transition:"all 0.15s"}}
                        onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
                        onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                        <div style={{fontWeight:700,fontSize:12,marginBottom:4,fontFamily:B.fontTitle,lineHeight:1.3}}>{item.theme||"Sin título"}</div>
                        <div style={{fontSize:10,color:"#999",marginBottom:4}}>{item.section==="story"?"📖":""}{item.type} · {item.date}</div>
                        {view==="manager"&&filters.client==="all"&&<div style={{fontSize:10,color:B.primary,fontWeight:600}}>{item.accountName}</div>}
                        <div style={{display:"flex",gap:6,marginTop:6,fontSize:10,color:"#bbb"}}>
                          {(item.clientComments||[]).length>0&&<span>💬{item.clientComments.length}</span>}
                          {item.slides?.length>0&&<span>📋{item.slides.length}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function renderCalendar(){
    const grouped=visibleItems.reduce((acc,item)=>{const k=item.date||"Sin fecha";acc[k]=acc[k]||[];acc[k].push(item);return acc;},{});
    return(
      <>
        <div style={{background:`linear-gradient(135deg,${B.primary},${B.primarySoft})`,padding:"20px 24px",borderRadius:16,marginBottom:18}}>
          <div style={{fontSize:20,fontWeight:800,color:B.btnText,fontFamily:B.fontTitle}}>{account.emoji} {account.name}</div>
          <div style={{fontSize:13,color:`${B.btnText}cc`}}>{account.description}</div>
        </div>
        {/* View mode tabs */}
        <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
          {[["list","📋 Lista"],["month","📅 Mes"],["kanban","🗂 Kanban"]].map(([mode,label])=>(
            <button key={mode} onClick={()=>setCalendarMode(mode)}
              style={{padding:"7px 16px",borderRadius:20,border:`1.5px solid ${calendarMode===mode?B.primary:"#ddd"}`,background:calendarMode===mode?B.primary:"#fff",color:calendarMode===mode?B.btnText:"#777",fontWeight:calendarMode===mode?700:400,fontSize:12,cursor:"pointer",transition:"all 0.2s"}}>
              {label}
            </button>
          ))}
          {calendarMode==="month"&&(
            <input type="month" value={currentMonth} onChange={e=>setCurrentMonth(e.target.value)} style={{...S.input,width:160,marginLeft:8}}/>
          )}
        </div>

        {/* Section tabs — only for list mode */}
        {calendarMode==="list"&&(
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            {[["all","Todo"],["post","Posts & Reels"],["story","Historias"]].map(([val,label])=>(
              <button key={val} onClick={()=>setFilters({...filters,section:val})}
                style={{padding:"8px 18px",borderRadius:20,border:`1.5px solid ${filters.section===val?B.primary:"#ddd"}`,background:filters.section===val?B.primary:"#fff",color:filters.section===val?B.btnText:"#777",fontWeight:filters.section===val?700:400,fontSize:13,cursor:"pointer",transition:"all 0.2s"}}>
                {label}
              </button>
            ))}
            <div style={{marginLeft:"auto",fontSize:13,color:"#aaa",alignSelf:"center"}}>
              {visibleItems.filter(i=>i.section==="post").length} posts · {visibleItems.filter(i=>i.section==="story").length} historias
            </div>
          </div>
        )}

        {/* Filters — only for list mode */}
        {calendarMode==="list"&&(
        <div style={{background:B.cardBg,padding:16,borderRadius:14,marginBottom:16,border:`1px solid ${B.primary}35`}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:10}}>
            {view==="manager"&&(<div><label style={S.label}>Cliente</label><select style={S.input} value={filters.client} onChange={e=>{setFilters({...filters,client:e.target.value});if(e.target.value!=="all"&&e.target.value!=="current")setActiveAccountId(e.target.value);}}><option value="current">Cliente actual</option><option value="all">Todos</option>{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></div>)}
            <div><label style={S.label}>Estado</label><select style={S.input} value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}><option value="all">Todos</option>{STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}</select></div>
            <div><label style={S.label}>Tipo</label><select style={S.input} value={filters.type} onChange={e=>setFilters({...filters,type:e.target.value})}><option value="all">Todos</option>{CONTENT_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label style={S.label}>Mes</label><input type="month" style={S.input} value={filters.month} onChange={e=>setFilters({...filters,month:e.target.value})}/></div>
            <div><label style={S.label}>Semana</label><select style={S.input} value={filters.week} onChange={e=>setFilters({...filters,week:e.target.value})}><option value="all">Todas</option>{[1,2,3,4,5].map(w=><option key={w} value={w}>Semana {w}</option>)}</select></div>
            <div><label style={S.label}>Buscar</label><input style={S.input} value={filters.search} onChange={e=>setFilters({...filters,search:e.target.value})} placeholder="Buscar..."/></div>
          </div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap",fontSize:13}}>
            <label style={{cursor:"pointer"}}><input type="checkbox" checked={filters.withComments} onChange={e=>setFilters({...filters,withComments:e.target.checked})}/> Con comentarios</label>
            <label style={{cursor:"pointer"}}><input type="checkbox" checked={filters.incomplete} onChange={e=>setFilters({...filters,incomplete:e.target.checked})}/> Incompletos</label>
            <label style={{cursor:"pointer"}}><input type="checkbox" checked={filters.changes} onChange={e=>setFilters({...filters,changes:e.target.checked})}/> Cambios solicitados</label>
            {(filters.status!=="all"||filters.type!=="all"||filters.month||filters.week!=="all"||filters.search||filters.withComments||filters.incomplete||filters.changes)&&<button onClick={()=>setFilters({...filters,status:"all",type:"all",month:"",week:"all",search:"",withComments:false,incomplete:false,changes:false})} style={{...S.outline,fontSize:11,padding:"4px 10px"}}>✕ Limpiar</button>}
          </div>
        </div>
        )}

        {calendarMode==="list"&&(
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <strong>{visibleItems.length} contenido{visibleItems.length!==1?"s":""}</strong>
          <div style={{display:"flex",gap:8}}>
            <button style={S.outline} onClick={exportCSV}>📥 CSV</button>
            {view==="manager"&&<button style={S.btn} onClick={()=>{setDraft(newContent(activeAccountId));setShowNew(true);}}>+ Nuevo</button>}
          </div>
        </div>
        )}

        {calendarMode==="month" && renderMonthCalendar()}
        {calendarMode==="kanban" && renderKanban()}
        {calendarMode==="list" && (
          <>
        {Object.keys(grouped).length===0&&<div style={{padding:60,textAlign:"center",color:"#aaa"}}>📭 No hay contenidos con estos filtros.</div>}
        {Object.keys(grouped).sort().map(date=>(
          <div key={date}>
            <div style={{...S.sTitle,marginTop:18}}>— {getDayName(date)}</div>
            {grouped[date].map(renderCard)}
          </div>
        ))}
          </>
        )}
      </>
    );
  }

  function renderDashboard(){
    return(
      <div>
        <h2 style={{marginBottom:4,fontFamily:"'Georgia',serif"}}>📊 Dashboard CM</h2>
        <p style={{color:"#777",marginBottom:20}}>Resumen de todos tus clientes.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginBottom:20}}>
          {stats.byClient.map(s=>(
            <div key={s.id} style={{background:s.brand.cardBg,borderRadius:14,padding:18,border:`1.5px solid ${s.brand.primary}50`}}>
              <div style={{fontWeight:800,fontSize:15,marginBottom:12,fontFamily:"'Georgia',serif"}}>{s.emoji} {s.name}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {[["Total",s.total,"#6366f1"],["Enviados",s.sent,"#f59e0b"],["Cambios",s.changes,"#ef4444"],["Aprobados",s.approved,"#22c55e"],["Programados",s.scheduled,"#6366f1"],["Publicados",s.published,"#111"],["Sin copy",s.noCopy,"#f97316"],["Sin guion",s.noScript,"#f97316"]].map(([lbl,val,color])=>(
                  <div key={lbl} style={{background:`${color}10`,border:`1px solid ${color}25`,borderRadius:8,padding:"8px 10px"}}>
                    <div style={{fontSize:18,fontWeight:800,color}}>{val}</div>
                    <div style={{fontSize:10,color:"#888"}}>{lbl}</div>
                  </div>
                ))}
              </div>
              {s.comments>0&&<div style={{marginTop:10,padding:"6px 10px",background:`${s.brand.accent}20`,borderRadius:8,fontSize:12,color:s.brand.accent,fontWeight:700}}>💬 {s.comments} comentarios</div>}
            </div>
          ))}
        </div>
        <div style={{background:B.cardBg,padding:18,borderRadius:14,border:`1px solid ${B.primary}40`}}>
          <div style={S.sTitle}>📅 Próximos 7 días</div>
          {stats.next7.length===0&&<p style={{color:"#aaa"}}>No hay contenidos próximos.</p>}
          {stats.next7.map(i=>(
            <div key={i.id} onClick={()=>{setActiveAccountId(i.accountId);setSelectedItem(i);}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${B.primary}25`,padding:"10px 0",cursor:"pointer"}}>
              <div><div style={{fontWeight:600}}>{i.theme}</div><div style={{fontSize:12,color:"#999"}}>{i.accountName} · {i.type} · {i.date}</div></div>
              <Badge status={i.status}/>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderBrandKit(){
    const kit=account.brandKit;
    const fields=[["audience","Público objetivo"],["objective","Objetivo de la cuenta"],["tone","Tono de comunicación"],["wordsYes","Palabras que SÍ usa"],["wordsNo","Palabras que NO usa"],["instagram","Instagram"],["whatsapp","WhatsApp"],["drive","Drive"],["canva","Canva"],["website","Tienda online / web"],["notes","Observaciones estratégicas"]];
    return(
      <div>
        <h2 style={{marginBottom:4,fontFamily:"'Georgia',serif"}}>🎨 Brand Kit · {account.name}</h2>
        <p style={{color:"#777",marginBottom:20}}>{view==="manager"?"Editá los datos estratégicos del cliente.":"Datos del cliente."}</p>
        <div style={{background:B.cardBg,padding:20,borderRadius:14,border:`1px solid ${B.primary}40`,marginBottom:16}}>
          {fields.map(([key,label])=>(
            <div key={key} style={S.field}>
              <label style={S.label}>{label}</label>
              {view==="manager"?<textarea value={kit[key]||""} onChange={e=>updateBrandKit(key,e.target.value)} style={S.textarea}/>:<div style={{fontSize:13,whiteSpace:"pre-wrap",lineHeight:1.6,color:B.text}}>{kit[key]||"—"}</div>}
            </div>
          ))}
        </div>
        <div style={{background:B.cardBg,padding:16,borderRadius:14,border:`1px solid ${B.primary}40`}}>
          <div style={S.sTitle}>Paleta de colores</div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            {[["Principal",B.primary],["Suave",B.primarySoft],["Acento",B.accent],["Fondo",B.bg],["Botón",B.btnBg]].map(([lbl,color])=>(
              <div key={lbl} style={{textAlign:"center"}}>
                <div style={{width:48,height:48,borderRadius:10,background:color,border:"1px solid #ddd",marginBottom:4}}/>
                <div style={{fontSize:10,color:"#888"}}>{lbl}</div>
                <div style={{fontSize:9,color:"#aaa"}}>{color}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderAI(){
    const actions=[["💡 Crear ideas de posts","Generame 5 ideas de posts para este cliente basadas en su tono y objetivo"],["✍️ Mejorar copy","Mejorar el copy del contenido seleccionado manteniendo el tono del cliente"],["🎬 Generar guion para reel","Generar un guion completo con hook, desarrollo y CTA para el contenido seleccionado"],["📖 Crear historias","Crear 3 historias para acompañar el contenido seleccionado"],["📣 Generar opciones de CTA","Generame 3 opciones de CTA distintos para este contenido"],["🔍 Revisar equilibrio del calendario","Analizá si el calendario tiene buen equilibrio entre venta, comunidad, educación y autoridad"],["💬 Gestionar cambios del cliente","Resumí los comentarios del cliente del contenido seleccionado y convertirlos en tareas concretas"],["📊 Armar reporte mensual","Armame la estructura de un reporte mensual profesional para enviarle al cliente"]];
    return(
      <div>
        <h2 style={{marginBottom:4,fontFamily:"'Georgia',serif"}}>🤖 Agente IA · {account.name}</h2>
        <p style={{color:"#777",marginBottom:16}}>Trabajá con el contexto completo del cliente{selectedItem?` y el contenido: "${selectedItem.theme}"`:". Seleccioná un contenido del calendario para trabajar sobre él."}</p>
        {selectedItem&&<div style={{background:`${B.primary}18`,border:`1px solid ${B.primary}35`,borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:13}}><strong>Contenido activo:</strong> {selectedItem.theme} · {selectedItem.type} · <Badge status={selectedItem.status}/></div>}
        <div style={{display:"grid",gridTemplateColumns:"230px 1fr",gap:16}}>
          <div style={{background:B.cardBg,padding:14,borderRadius:14,border:`1px solid ${B.primary}40`,display:"flex",flexDirection:"column",gap:6}}>
            <div style={S.sTitle}>Acciones rápidas</div>
            {actions.map(([label,prompt])=>(
              <button key={label} style={{...S.outline,width:"100%",textAlign:"left",fontSize:12,padding:"7px 10px"}} onClick={()=>{setAiInput(prompt);runAI(prompt);}}>{label}</button>
            ))}
          </div>
          <div style={{background:B.cardBg,padding:16,borderRadius:14,border:`1px solid ${B.primary}40`}}>
            <div style={S.field}>
              <label style={S.label}>¿Qué necesitás?</label>
              <textarea value={aiInput} onChange={e=>setAiInput(e.target.value)} style={{...S.textarea,minHeight:70}} placeholder="Ej: Generame 5 ideas para Caro sobre menopausia&#10;Ej: Mejorar el hook de este reel&#10;Ej: Crear historias para este carrusel de Basile"/>
            </div>
            <button style={{...S.btn,marginBottom:16}} onClick={()=>runAI(aiInput)} disabled={aiLoading}>{aiLoading?"⏳ Generando...":"🚀 Enviar a IA"}</button>
            {aiOutput&&(
              <div>
                <label style={S.label}>Respuesta</label>
                <div style={{whiteSpace:"pre-wrap",background:`${B.primary}12`,padding:16,borderRadius:12,fontSize:13,lineHeight:1.7,border:`1px solid ${B.primary}25`,maxHeight:380,overflowY:"auto"}}>{aiOutput}</div>
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <button style={{...S.outline,fontSize:11,padding:"5px 12px"}} onClick={()=>navigator.clipboard?.writeText(aiOutput)}>📋 Copiar</button>
                  {selectedItem&&<button style={{...S.outline,fontSize:11,padding:"5px 12px"}} onClick={()=>setSelectedItem(p=>({...p,copy:aiOutput}))}>Usar como copy</button>}
                </div>
              </div>
            )}
            {!aiOutput&&!aiLoading&&<div style={{padding:40,textAlign:"center",color:"#aaa",background:`${B.primary}08`,borderRadius:12,fontSize:13}}>Seleccioná una acción o escribí tu pedido 👆</div>}
          </div>
        </div>
      </div>
    );
  }

  function renderModal(){
    if(!selectedItem) return null;
    const editable=view==="manager";
    const isClient=view==="client";
    const isPost=selectedItem.section==="post";
    const checkDone=selectedItem.checklist?.filter(c=>c.done).length||0;
    const checkTotal=selectedItem.checklist?.length||10;
    const bStyle=(bg,color="#fff")=>({padding:"8px 14px",borderRadius:8,border:"none",background:bg,color,fontWeight:700,cursor:"pointer",fontSize:12});
    const oStyle=(color)=>({padding:"8px 14px",borderRadius:8,border:`1.5px solid ${color}`,background:"transparent",color,fontWeight:700,cursor:"pointer",fontSize:12});

    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:999,display:"flex",justifyContent:"center",alignItems:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&setSelectedItem(null)}>
        <div style={{background:B.white,borderRadius:16,width:"100%",maxWidth:820,maxHeight:"93vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.3)"}}>
          {/* Header */}
          <div style={{padding:"16px 20px",background:B.primary,borderRadius:"16px 16px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",position:"sticky",top:0,zIndex:1}}>
            <div>
              <div style={{color:`${B.btnText}90`,fontSize:12,marginBottom:2}}>{isPost?selectedItem.type:"Story"} · {selectedItem.date} · {selectedItem.accountId}</div>
              <div style={{color:B.btnText,fontWeight:800,fontSize:17,fontFamily:B.fontTitle}}>{selectedItem.theme||"Contenido"}</div>
            </div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {editable&&<><button style={oStyle(B.btnText)} onClick={()=>duplicateItem(selectedItem)}>Duplicar</button>
              <button style={bStyle(B.accent)} onClick={saveSelected}>Guardar</button>
              <button style={bStyle("#ef4444")} onClick={deleteSelected}>Eliminar</button></>}
              {isClient&&(selectedItem.status==="Enviado al cliente"||selectedItem.status==="Cambios solicitados")&&(
                <><button style={bStyle("#22c55e")} onClick={approveSelected}>✅ Aprobar</button>
                <button style={bStyle("#ef4444")} onClick={requestChanges}>✏️ Pedir cambios</button></>
              )}
              <button onClick={()=>setSelectedItem(null)} style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${B.btnText}50`,background:"transparent",color:B.btnText,cursor:"pointer",fontSize:14}}>✕</button>
            </div>
          </div>

          <div style={{padding:20}}>
            {/* Status */}
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
              <Badge status={selectedItem.status}/>
              {editable&&<select style={{...S.input,width:"auto"}} value={selectedItem.status} onChange={e=>setSelectedItem({...selectedItem,status:e.target.value})}>{STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}</select>}
              {editable&&<input type="date" style={{...S.input,width:155}} value={selectedItem.date||""} onChange={e=>setSelectedItem({...selectedItem,date:e.target.value,week:getWeekFromDate(e.target.value)})}/>}
              {editable&&<select style={{...S.input,width:"auto"}} value={selectedItem.type} onChange={e=>setSelectedItem({...selectedItem,type:e.target.value})}>{CONTENT_TYPES.map(t=><option key={t}>{t}</option>)}</select>}
              {isClient&&selectedItem.status==="Aprobado"&&<span style={{color:"#22c55e",fontWeight:700}}>✅ Aprobado</span>}
            </div>

            {/* Client action banner */}
            {isClient&&(selectedItem.status==="Enviado al cliente"||selectedItem.status==="Cambios solicitados")&&(
              <div style={{background:`${B.primary}12`,border:`1px solid ${B.primary}30`,borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",gap:10}}>
                <button onClick={approveSelected} style={{flex:1,padding:10,borderRadius:8,border:"none",background:"#22c55e",color:"#fff",fontWeight:700,cursor:"pointer"}}>✅ Aprobar contenido</button>
                <button onClick={requestChanges} style={{flex:1,padding:10,borderRadius:8,border:"1.5px solid #ef4444",background:"transparent",color:"#ef4444",fontWeight:700,cursor:"pointer"}}>✏️ Pedir cambios</button>
              </div>
            )}

            {/* Fields */}
            <MF label="Tema" value={selectedItem.theme} editable={editable} onChange={v=>setSelectedItem({...selectedItem,theme:v})} S={S}/>
            {editable&&<MF label="Objetivo interno" value={selectedItem.objective} editable onChange={v=>setSelectedItem({...selectedItem,objective:v})} S={S}/>}
            {editable&&<MF label="Desarrollo interno" value={selectedItem.development} textarea editable onChange={v=>setSelectedItem({...selectedItem,development:v})} S={S}/>}

            {isPost?(
              <>
                <MF label="Guion" value={selectedItem.script} textarea editable={editable} onChange={v=>setSelectedItem({...selectedItem,script:v})} S={S}/>
                <MF label="Copy del post" value={selectedItem.copy} textarea highlight editable={editable} onChange={v=>setSelectedItem({...selectedItem,copy:v})} S={S} B={B}/>
                {(selectedItem.type==="Carrusel"||selectedItem.slides?.length>0)&&(
                  <div style={S.field}>
                    <label style={S.label}>Slides ({selectedItem.slides?.length||0})</label>
                    {(selectedItem.slides||[]).map((slide,i)=>(
                      <div key={slide.id} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                        <div style={{width:26,height:26,borderRadius:"50%",background:B.primary,color:B.btnText,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0}}>{i+1}</div>
                        {editable?<><input style={{...S.input,flex:1}} value={slide.text} onChange={e=>setSelectedItem({...selectedItem,slides:selectedItem.slides.map(s=>s.id===slide.id?{...s,text:e.target.value}:s)})}/><button onClick={()=>setSelectedItem({...selectedItem,slides:selectedItem.slides.filter(s=>s.id!==slide.id)})} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:15}}>✕</button></>:<div style={{fontSize:13,flex:1}}>{slide.text||"—"}</div>}
                      </div>
                    ))}
                    {editable&&<button style={{...S.outline,fontSize:11,padding:"5px 12px"}} onClick={()=>setSelectedItem({...selectedItem,slides:[...(selectedItem.slides||[]),{id:`sl_${Date.now()}`,text:""}]})}>+ Agregar slide</button>}
                  </div>
                )}
              </>
            ):(
              <MF label="Contenido / Guion" value={selectedItem.content} textarea highlight editable={editable} onChange={v=>setSelectedItem({...selectedItem,content:v})} S={S} B={B}/>
            )}

            {/* Checklist */}
            {editable&&(
              <div style={{marginBottom:16}}>
                <button onClick={()=>setShowChecklist(!showChecklist)} style={{...S.outline,fontSize:12,padding:"6px 14px",marginBottom:showChecklist?10:0}}>
                  {showChecklist?"▲":"▼"} Checklist ({checkDone}/{checkTotal})
                </button>
                {showChecklist&&(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:7}}>
                    {selectedItem.checklist.map(c=>(
                      <label key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,background:c.done?`${B.primary}20`:"transparent",border:`1px solid ${c.done?B.primary:"#e5e7eb"}`,cursor:"pointer",fontSize:13}}>
                        <input type="checkbox" checked={c.done} onChange={()=>toggleChecklist(c.id)} style={{accentColor:B.primary}}/><span style={{color:c.done?B.primary:"#555"}}>{c.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Metrics */}
            {editable&&selectedItem.status==="Publicado"&&(
              <div style={{marginBottom:16}}>
                <button onClick={()=>setShowMetrics(!showMetrics)} style={{...S.outline,fontSize:12,padding:"6px 14px",marginBottom:showMetrics?10:0}}>{showMetrics?"▲":"▼"} 📊 Métricas</button>
                {showMetrics&&(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8}}>
                    {Object.keys(selectedItem.metrics||{}).map(key=>(
                      <div key={key} style={S.field}>
                        <label style={S.label}>{key}</label>
                        {key==="notes"?<textarea style={S.textarea} value={selectedItem.metrics[key]} onChange={e=>updateMetric(key,e.target.value)}/>:<input style={S.input} value={selectedItem.metrics[key]} onChange={e=>updateMetric(key,e.target.value)}/>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Internal notes */}
            {editable&&(
              <div style={{marginBottom:16}}>
                <label style={S.label}>📝 Notas internas (solo CM)</label>
                {(selectedItem.internalNotes||[]).length===0&&<div style={{fontSize:12,color:"#bbb",marginBottom:8}}>Sin notas.</div>}
                {(selectedItem.internalNotes||[]).map(n=>(
                  <div key={n.id} style={{background:"#fff8e7",border:"1px solid #f6d52255",borderRadius:8,padding:"8px 12px",marginBottom:6,display:"flex",gap:8,alignItems:"flex-start"}}>
                    <div style={{flex:1}}><div style={{fontSize:11,color:"#888",marginBottom:2}}><strong>{n.author}</strong> · {n.date}</div><div style={{fontSize:13,lineHeight:1.5}}>{n.text}</div></div>
                    <button onClick={()=>removeInternalNote(n.id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14,flexShrink:0}}>✕</button>
                  </div>
                ))}
                <div style={{display:"flex",gap:8,marginTop:6}}>
                  <input style={{...S.input,flex:1}} value={internalNote} onChange={e=>setInternalNote(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addInternalNote()} placeholder="Agregar nota interna..."/>
                  <button style={S.btn} onClick={addInternalNote}>+</button>
                </div>
              </div>
            )}

            {/* Client comments */}
            <div style={{borderTop:`1px solid ${B.primary}25`,paddingTop:16}}>
              <label style={S.label}>💬 Comentarios del cliente</label>
              {(selectedItem.clientComments||[]).length===0&&<div style={{fontSize:12,color:"#bbb",marginBottom:10}}>Sin comentarios aún.</div>}
              {(selectedItem.clientComments||[]).map(c=>(
                <div key={c.id} style={{background:`${B.accent||B.primary}12`,border:`1px solid ${B.accent||B.primary}30`,borderRadius:10,padding:"10px 13px",marginBottom:8}}>
                  <div style={{fontSize:11,fontWeight:800,color:B.accent||B.primary,marginBottom:4}}>{c.author} · {c.date}</div>
                  <div style={{fontSize:13,lineHeight:1.55}}>{c.text}</div>
                </div>
              ))}
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <input style={{...S.input,flex:1}} value={clientComment} onChange={e=>setClientComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addClientComment()} placeholder={isClient?"Dejá tu comentario o pedí cambios...":"Escribir como cliente..."}/>
                <button style={S.btn} onClick={addClientComment}>Enviar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderNewModal(){
    if(!showNew) return null;
    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:999,display:"flex",justifyContent:"center",alignItems:"center",padding:20}}>
        <div style={{background:B.white,borderRadius:16,width:"100%",maxWidth:640,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.25)"}}>
          <div style={{padding:"16px 20px",background:B.primary,borderRadius:"16px 16px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{color:B.btnText,fontWeight:800,fontSize:16,fontFamily:B.fontTitle}}>Nuevo contenido · {account.name}</div>
            <button onClick={()=>setShowNew(false)} style={{padding:"6px 11px",borderRadius:8,border:`1.5px solid ${B.btnText}50`,background:"transparent",color:B.btnText,cursor:"pointer"}}>✕</button>
          </div>
          <div style={{padding:20}}>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {["post","story"].map(sec=>(
                <button key={sec} onClick={()=>setDraft({...draft,section:sec})} style={{padding:"8px 16px",borderRadius:8,border:`1.5px solid ${B.primary}`,background:draft.section===sec?B.primary:"transparent",color:draft.section===sec?B.btnText:B.primary,fontWeight:700,cursor:"pointer"}}>
                  {sec==="post"?"📌 Post / Reel":"📖 Story"}
                </button>
              ))}
            </div>
            <MF label="Tema *" value={draft.theme} editable onChange={v=>setDraft({...draft,theme:v})} S={S}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={S.field}><label style={S.label}>Fecha</label><input type="date" style={S.input} value={draft.date} onChange={e=>setDraft({...draft,date:e.target.value,week:getWeekFromDate(e.target.value)})}/></div>
              <div style={S.field}><label style={S.label}>Tipo</label><select style={S.input} value={draft.type} onChange={e=>setDraft({...draft,type:e.target.value})}>{CONTENT_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            </div>
            <div style={S.field}><label style={S.label}>Estado</label><select style={S.input} value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value})}>{STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}</select></div>
            <MF label="Objetivo" value={draft.objective||""} editable onChange={v=>setDraft({...draft,objective:v})} S={S}/>
            {draft.section==="post"?<MF label="Copy" value={draft.copy||""} textarea editable onChange={v=>setDraft({...draft,copy:v})} S={S}/>:<MF label="Contenido / Guion" value={draft.content||""} textarea editable onChange={v=>setDraft({...draft,content:v})} S={S}/>}
            <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:8}}>
              <button style={S.outline} onClick={()=>setShowNew(false)}>Cancelar</button>
              <button style={{...S.btn,opacity:!draft.theme.trim()?0.5:1}} onClick={createItem} disabled={!draft.theme.trim()}>Crear</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const menuItems=[["calendar","📅 Calendario"],...(view==="manager"?[["dashboard","📊 Dashboard"]]:[]),["brand","🎨 Brand Kit"],...(view==="manager"?[["ai","🤖 Agente IA"]]:[] )];

  return(
    <div style={{minHeight:"100vh",background:B.bg,color:B.text,fontFamily:B.fontBody}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${B.primary}60;border-radius:3px}`}</style>
      <header style={{background:B.sidebar,padding:"0 24px",display:"flex",justifyContent:"space-between",alignItems:"center",height:58,position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 14px rgba(0,0,0,0.15)"}}>
        <strong style={{fontSize:15,color:B.sidebarText,fontFamily:B.fontTitle}}>📅 Calendario de Contenido Pro</strong>
        <div style={{display:"flex",gap:4,background:"rgba(255,255,255,0.1)",borderRadius:8,padding:3}}>
          {[["manager","✏️ CM"],["client","👤 Cliente"]].map(([v,label])=>(
            <button key={v} onClick={()=>{setView(v);if(v==="client")setTab("calendar");}} style={{padding:"5px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:view===v?B.sidebarText:"transparent",color:view===v?B.sidebar:B.sidebarText}}>
              {label}
            </button>
          ))}
        </div>
        <div style={{fontSize:12,color:`${B.sidebarText}70`}}>{view==="client"?"Solo lectura · Podés aprobar y comentar":""}</div>
      </header>
      <div style={{display:"flex",minHeight:"calc(100vh - 58px)"}}>
        <aside style={{width:230,background:B.sidebar,flexShrink:0,padding:"18px 0",display:"flex",flexDirection:"column",borderRight:`2px solid ${B.primary}20`}}>
          <div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:2.5,color:`${B.sidebarText}50`,padding:"10px 18px 6px"}}>Cuentas</div>
          {accounts.map(acc=>{
            if(view==="client"&&acc.id!==activeAccountId) return null;
            const isActive=activeAccountId===acc.id;
            return(
              <button key={acc.id} onClick={()=>setActiveAccountId(acc.id)}
                style={{display:"block",width:"100%",padding:"9px 18px",border:"none",textAlign:"left",background:isActive?acc.brand.primary:"transparent",color:isActive?acc.brand.text:acc.brand.sidebarText,cursor:"pointer",fontWeight:isActive?800:500,fontSize:13,borderLeft:`3px solid ${isActive?acc.brand.accent:"transparent"}`,transition:"all 0.15s"}}>
                {acc.emoji} {acc.shortName}
              </button>
            );
          })}
          <hr style={{margin:"14px 0",borderColor:`${B.primary}30`}}/>
          <div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:2.5,color:`${B.sidebarText}50`,padding:"0 18px 6px"}}>Menú</div>
          {menuItems.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{display:"block",width:"100%",padding:"9px 18px",border:"none",textAlign:"left",background:tab===id?B.primary:"transparent",color:tab===id?B.text:B.sidebarText,cursor:"pointer",fontWeight:tab===id?800:500,fontSize:13,borderLeft:`3px solid ${tab===id?B.accent:"transparent"}`,transition:"all 0.15s"}}>
              {label}
            </button>
          ))}
          <div style={{marginTop:"auto",padding:"14px 18px",borderTop:`1px solid ${B.primary}25`}}>
            <div style={{fontSize:10,color:`${B.sidebarText}45`,fontStyle:"italic",lineHeight:1.4}}>{B.tagline}</div>
          </div>
        </aside>
        <main style={{flex:1,padding:24,overflowY:"auto"}}>
          {tab==="calendar"&&renderCalendar()}
          {tab==="dashboard"&&view==="manager"&&renderDashboard()}
          {tab==="brand"&&renderBrandKit()}
          {tab==="ai"&&view==="manager"&&renderAI()}
        </main>
      </div>
      {renderModal()}
      {renderNewModal()}
      {renderDayPanel()}
    </div>
  );
}

function DayPanelCard({item, onOpen, isClient, B, S}){
  const isPost = item.section==="post";
  const newComments = (item.clientComments||[]).length;
  return(
    <div onClick={onOpen} style={{background:B.white,borderRadius:10,padding:"12px 14px",marginBottom:8,cursor:"pointer",border:`1px solid ${B.primary}35`,borderLeft:`4px solid ${STATUS_COLORS[item.status]||"#ccc"}`,boxShadow:"0 1px 4px rgba(0,0,0,0.05)",transition:"all 0.15s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateX(2px)";e.currentTarget.style.boxShadow=`0 3px 12px ${B.primary}25`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.05)";}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:13,fontFamily:B.fontTitle,marginBottom:3}}>{item.theme||"Sin título"}</div>
          <div style={{fontSize:11,color:"#999",display:"flex",gap:6,flexWrap:"wrap"}}>
            <span style={{background:`${B.primary}20`,color:B.primary,padding:"1px 6px",borderRadius:6,fontWeight:600}}>{isPost?item.type:"Story"}</span>
            {!isClient&&item.accountName&&<span style={{color:"#bbb"}}>{item.accountName}</span>}
          </div>
        </div>
        <span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:20,background:`${STATUS_COLORS[item.status]}20`,color:STATUS_COLORS[item.status],border:`1px solid ${STATUS_COLORS[item.status]}40`,flexShrink:0,whiteSpace:"nowrap"}}>{item.status}</span>
      </div>
      <div style={{display:"flex",gap:10,marginTop:6,fontSize:11,color:"#bbb"}}>
        {newComments>0&&<span>💬 {newComments}</span>}
        {item.slides?.length>0&&<span>📋 {item.slides.length} slides</span>}
        <span style={{marginLeft:"auto",color:B.primary,fontWeight:600}}>Ver detalle →</span>
      </div>
    </div>
  );
}

function MF({label,value,onChange,editable,textarea,highlight,S,B}){
  return(
    <div style={S.field}>
      <label style={S.label}>{label}</label>
      {editable
        ?textarea?<textarea style={S.textarea} value={value||""} onChange={e=>onChange(e.target.value)}/>
                 :<input style={S.input} value={value||""} onChange={e=>onChange(e.target.value)}/>
        :<div style={{fontSize:13,whiteSpace:"pre-wrap",lineHeight:1.65,...(highlight&&B?{background:`${B.primary}12`,padding:"10px 12px",borderRadius:8,border:`1px solid ${B.primary}25`}:{})}}>{value||"—"}</div>}
    </div>
  );
}
