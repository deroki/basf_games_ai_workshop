// ===== Ajustes del juego: ¡prueba a cambiar estos números! =====
const CONFIG = {
  velocidadJugador: 230,
  vidas: 3,
  goblinsIniciales: 2,
  tiempoEntreGoblins: 4,
  aceleracionGoblins: 4,
  velocidadLanza: 520,
  puntosCristal: 10,
  duracionEscudo: 6,
  esperaNuevoEscudo: 14,
  proteccionInicio: 2.5,
  tiempoProtegidoTrasGolpe: 1.5,
  claveRecord: "las-naves-del-espacio-record",
};

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.focus();

const teclas = {};
let estado = "inicio";
let jugador;
let goblins = [];
let lanzas = [];
let cristal;
let piedra;
let escudoObjeto;
let puntos = 0;
let vidas = CONFIG.vidas;
let record = Number(localStorage.getItem(CONFIG.claveRecord)) || 0;
let tiempo = 0;
let tiempoDesdeGoblin = 0;
let tiempoHerido = 0;
let tiempoLanza = 0;
let escudoRestante = 0;
let proteccionInicioRestante = 0;
let tiempoSiguienteEscudo = 0;
let audio;

window.addEventListener("keydown", (evento) => {
  const tecla = evento.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(tecla)) {
    evento.preventDefault();
  }

  if (tecla === "enter" && (estado === "inicio" || estado === "fin" || estado === "victoria")) empezar();
  if (tecla === "p" && (estado === "jugando" || estado === "pausa")) {
    estado = estado === "jugando" ? "pausa" : "jugando";
  }
  if (tecla === " " && estado === "jugando" && !teclas[tecla]) lanzar();
  teclas[tecla] = true;
});

window.addEventListener("keyup", (evento) => {
  teclas[evento.key.toLowerCase()] = false;
});

function sonido(frecuencia, duracion = 0.1) {
  const AudioContextDelNavegador = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextDelNavegador) return;
  if (!audio) audio = new AudioContextDelNavegador();
  if (audio.state === "suspended") audio.resume();

  const oscilador = audio.createOscillator();
  const volumen = audio.createGain();
  oscilador.frequency.value = frecuencia;
  volumen.gain.setValueAtTime(0.08, audio.currentTime);
  volumen.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duracion);
  oscilador.connect(volumen);
  volumen.connect(audio.destination);
  oscilador.start();
  oscilador.stop(audio.currentTime + duracion);
}

function posicionLibre(ancho, alto) {
  return {
    x: 30 + Math.random() * (canvas.width - ancho - 60),
    y: 70 + Math.random() * (canvas.height - alto - 100),
  };
}

function crearGoblin() {
  const lado = Math.floor(Math.random() * 4);
  const goblin = { x: 0, y: 0, ancho: 38, alto: 38, fase: Math.random() * 6 };
  if (lado === 0) goblin.y = -goblin.alto;
  if (lado === 1) goblin.x = canvas.width + goblin.ancho;
  if (lado === 2) goblin.y = canvas.height + goblin.alto;
  if (lado === 3) goblin.x = -goblin.ancho;
  if (lado === 0 || lado === 2) goblin.x = Math.random() * canvas.width;
  else goblin.y = 50 + Math.random() * (canvas.height - 100);
  return goblin;
}

function empezar() {
  const inicioJugador = { x: canvas.width / 2 - 18, y: canvas.height / 2 - 24 };
  jugador = { ...inicioJugador, ancho: 36, alto: 48, miraX: 1, miraY: 0 };
  goblins = Array.from({ length: CONFIG.goblinsIniciales }, crearGoblin);
  lanzas = [];
  cristal = posicionLibre(24, 24);
  piedra = posicionLibre(32, 32);
  escudoObjeto = { x: canvas.width / 2 + 52, y: canvas.height / 2 - 15 };
  puntos = 0;
  vidas = CONFIG.vidas;
  tiempo = 0;
  tiempoDesdeGoblin = 0;
  tiempoHerido = 0;
  tiempoLanza = 0;
  escudoRestante = 0;
  proteccionInicioRestante = CONFIG.proteccionInicio;
  tiempoSiguienteEscudo = 0;
  estado = "jugando";
}

function lanzar() {
  if (tiempoLanza > 0) return;
  let dx = jugador.miraX;
  let dy = jugador.miraY;

  if (goblins.length > 0) {
    const objetivo = goblins.reduce((cercano, goblin) => {
      const distancia = Math.hypot(goblin.x - jugador.x, goblin.y - jugador.y);
      return !cercano || distancia < cercano.distancia ? { goblin, distancia } : cercano;
    }, null).goblin;
    dx = objetivo.x + objetivo.ancho / 2 - (jugador.x + jugador.ancho / 2);
    dy = objetivo.y + objetivo.alto / 2 - (jugador.y + jugador.alto / 2);
  }

  const largo = Math.hypot(dx, dy) || 1;
  dx /= largo;
  dy /= largo;
  lanzas.push({
    x: jugador.x + jugador.ancho / 2,
    y: jugador.y + jugador.alto / 2,
    vx: dx * CONFIG.velocidadLanza,
    vy: dy * CONFIG.velocidadLanza,
    angulo: Math.atan2(dy, dx),
  });
  tiempoLanza = 0.35;
  sonido(520, 0.08);
}

function tocar(a, b) {
  return a.x < b.x + b.ancho && a.x + a.ancho > b.x
    && a.y < b.y + b.alto && a.y + a.alto > b.y;
}

function actualizarRecord() {
  if (puntos > record) {
    record = puntos;
    localStorage.setItem(CONFIG.claveRecord, String(record));
  }
}

function actualizar(delta) {
  if (estado !== "jugando") return;
  tiempo += delta;
  tiempoDesdeGoblin += delta;
  tiempoHerido = Math.max(0, tiempoHerido - delta);
  tiempoLanza = Math.max(0, tiempoLanza - delta);
  escudoRestante = Math.max(0, escudoRestante - delta);
  proteccionInicioRestante = Math.max(0, proteccionInicioRestante - delta);

  let moverX = 0;
  let moverY = 0;
  if (teclas.arrowleft || teclas.a) moverX -= 1;
  if (teclas.arrowright || teclas.d) moverX += 1;
  if (teclas.arrowup || teclas.w) moverY -= 1;
  if (teclas.arrowdown || teclas.s) moverY += 1;

  const largoMovimiento = Math.hypot(moverX, moverY) || 1;
  if (moverX || moverY) {
    moverX /= largoMovimiento;
    moverY /= largoMovimiento;
    jugador.miraX = moverX;
    jugador.miraY = moverY;
    jugador.x += moverX * CONFIG.velocidadJugador * delta;
    jugador.y += moverY * CONFIG.velocidadJugador * delta;
  }
  jugador.x = Math.max(0, Math.min(canvas.width - jugador.ancho, jugador.x));
  jugador.y = Math.max(42, Math.min(canvas.height - jugador.alto, jugador.y));

  if (!escudoObjeto && tiempo >= tiempoSiguienteEscudo) {
    escudoObjeto = posicionLibre(30, 30);
  }
  if (escudoObjeto && tocar(jugador, { ...escudoObjeto, ancho: 30, alto: 30 })) {
    escudoRestante = CONFIG.duracionEscudo;
    escudoObjeto = null;
    tiempoSiguienteEscudo = tiempo + CONFIG.esperaNuevoEscudo;
    sonido(680, 0.2);
  }

  if (tiempoDesdeGoblin >= Math.max(0.9, CONFIG.tiempoEntreGoblins - tiempo * 0.025)) {
    goblins.push(crearGoblin());
    tiempoDesdeGoblin = 0;
  }

  const velocidadGoblin = 75 + Math.min(115, tiempo * CONFIG.aceleracionGoblins);
  goblins.forEach((goblin) => {
    const dx = jugador.x + jugador.ancho / 2 - (goblin.x + goblin.ancho / 2);
    const dy = jugador.y + jugador.alto / 2 - (goblin.y + goblin.alto / 2);
    const distancia = Math.hypot(dx, dy) || 1;
    goblin.x += (dx / distancia) * velocidadGoblin * delta;
    goblin.y += (dy / distancia) * velocidadGoblin * delta;
    goblin.fase += delta * 9;

    if (tocar(jugador, goblin) && escudoRestante > 0) {
    goblin.derrotado = true;
    sonido(610, 0.1);
    } else if (tocar(jugador, goblin) && tiempoHerido === 0 && proteccionInicioRestante === 0) {
      vidas -= 1;
      tiempoHerido = CONFIG.tiempoProtegidoTrasGolpe;
      sonido(150, 0.2);
      if (vidas <= 0) estado = "fin";
    }
  });
  goblins = goblins.filter((goblin) => !goblin.derrotado);

  lanzas.forEach((lanza) => {
    lanza.x += lanza.vx * delta;
    lanza.y += lanza.vy * delta;
  });
  lanzas = lanzas.filter((lanza) => (
    lanza.x > -30 && lanza.x < canvas.width + 30
    && lanza.y > -30 && lanza.y < canvas.height + 30
  ));

  lanzas = lanzas.filter((lanza) => {
    const objetivo = goblins.find((goblin) => tocar(
      { x: lanza.x - 12, y: lanza.y - 5, ancho: 24, alto: 10 },
      goblin,
    ));
    if (!objetivo) return true;
    goblins = goblins.filter((goblin) => goblin !== objetivo);
    puntos += 5;
    actualizarRecord();
    sonido(760, 0.08);
    return false;
  });

  if (tocar(jugador, { ...cristal, ancho: 24, alto: 24 })) {
    puntos += CONFIG.puntosCristal;
    actualizarRecord();
    cristal = posicionLibre(24, 24);
    sonido(880, 0.12);
  }

  if (tocar(jugador, { ...piedra, ancho: 32, alto: 32 })) {
    estado = "victoria";
    sonido(1040, 0.35);
  }
}

function texto(mensaje, y, tamano = 24, color = "#fff") {
  ctx.fillStyle = color;
  ctx.font = `bold ${tamano}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(mensaje, canvas.width / 2, y);
}

function dibujarJungla() {
  const fondo = ctx.createLinearGradient(0, 0, 0, canvas.height);
  fondo.addColorStop(0, "#1c5145");
  fondo.addColorStop(1, "#18382e");
  ctx.fillStyle = fondo;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#24583d";
  for (let x = 20; x < canvas.width; x += 95) {
    ctx.beginPath();
    ctx.ellipse(x, 58 + (x % 3) * 7, 62, 38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 38, canvas.height - 16, 58, 34, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(201, 231, 141, 0.09)";
  for (let x = 40; x < canvas.width; x += 120) {
    ctx.beginPath();
    ctx.ellipse(x, 145 + (x % 5) * 38, 34, 8, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function dibujarHeroina() {
  const centroX = jugador.x + jugador.ancho / 2;
  const centroY = jugador.y + jugador.alto / 2;
  const angulo = Math.atan2(jugador.miraY, jugador.miraX);

  if (escudoRestante > 0 || proteccionInicioRestante > 0) {
    ctx.strokeStyle = escudoRestante > 0 ? "rgba(110, 231, 255, 0.9)" : "rgba(245, 246, 202, 0.8)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(centroX, centroY, 31, 37, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.save();
  ctx.translate(centroX, centroY);
  ctx.rotate(angulo);
  ctx.fillStyle = "#74452e";
  ctx.beginPath();
  ctx.arc(0, -12, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d99b69";
  ctx.beginPath();
  ctx.arc(5, -12, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#25b49a";
  ctx.fillRect(-10, 0, 22, 21);
  ctx.fillStyle = "#e9c36a";
  ctx.fillRect(-12, 5, 26, 4);
  ctx.fillStyle = "#49332a";
  ctx.fillRect(-11, 19, 8, 12);
  ctx.fillRect(4, 19, 8, 12);
  ctx.restore();

  if (tiempoHerido > 0 && Math.floor(tiempoHerido * 12) % 2 === 0) {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.strokeRect(jugador.x - 3, jugador.y - 3, jugador.ancho + 6, jugador.alto + 6);
  }
}

function dibujarGoblin(goblin) {
  const salto = Math.abs(Math.sin(goblin.fase)) * 9;
  ctx.save();
  ctx.translate(goblin.x, goblin.y - salto);
  ctx.strokeStyle = "#344022";
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Brazos y botas inspirados en el dibujo.
  ctx.beginPath();
  ctx.moveTo(3, 21);
  ctx.lineTo(-5, 16);
  ctx.moveTo(35, 21);
  ctx.lineTo(43, 16);
  ctx.stroke();
  ctx.fillStyle = "#b8d464";
  for (const x of [-6, 44]) {
    ctx.beginPath();
    ctx.arc(x, 15, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#6b5638";
  ctx.fillRect(7, 33, 6, 6);
  ctx.fillRect(25, 33, 6, 6);
  ctx.fillRect(3, 37, 10, 4);
  ctx.fillRect(25, 37, 10, 4);

  ctx.fillStyle = "#b8d464";
  ctx.beginPath();
  ctx.moveTo(3, 34);
  ctx.lineTo(3, 0);
  for (let x = 3; x < 35; x += 8) {
    ctx.lineTo(x + 2, -6);
    ctx.lineTo(x + 5, 1);
    ctx.lineTo(x + 8, 0);
  }
  ctx.lineTo(35, 34);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fffbe5";
  for (const ojo of [{ x: 13, y: 12, radio: 8 }, { x: 28, y: 15, radio: 6 }]) {
    ctx.beginPath();
    ctx.arc(ojo.x, ojo.y, ojo.radio, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#51427c";
  ctx.beginPath();
  ctx.arc(16, 11, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(26, 17, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#493047";
  ctx.beginPath();
  ctx.ellipse(20, 27, 10, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffbe5";
  ctx.fillRect(13, 22, 4, 4);
  ctx.fillRect(22, 28, 4, 4);
  ctx.restore();
}

function dibujarCristal() {
  ctx.fillStyle = "#73e8f2";
  ctx.beginPath();
  ctx.moveTo(cristal.x + 12, cristal.y);
  ctx.lineTo(cristal.x + 23, cristal.y + 10);
  ctx.lineTo(cristal.x + 12, cristal.y + 24);
  ctx.lineTo(cristal.x, cristal.y + 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#d5ffff";
  ctx.fillRect(cristal.x + 10, cristal.y + 6, 4, 10);
}

function dibujarEscudoObjeto() {
  if (!escudoObjeto) return;
  ctx.fillStyle = "#72e7ff";
  ctx.beginPath();
  ctx.moveTo(escudoObjeto.x + 15, escudoObjeto.y);
  ctx.lineTo(escudoObjeto.x + 29, escudoObjeto.y + 6);
  ctx.lineTo(escudoObjeto.x + 26, escudoObjeto.y + 22);
  ctx.lineTo(escudoObjeto.x + 15, escudoObjeto.y + 30);
  ctx.lineTo(escudoObjeto.x + 4, escudoObjeto.y + 22);
  ctx.lineTo(escudoObjeto.x, escudoObjeto.y + 6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e3fcff";
  ctx.fillRect(escudoObjeto.x + 13, escudoObjeto.y + 7, 4, 14);
}

function dibujarPiedra() {
  ctx.save();
  ctx.shadowColor = "#ffd76a";
  ctx.shadowBlur = 22;
  ctx.fillStyle = "#e3ae48";
  ctx.beginPath();
  ctx.moveTo(piedra.x + 16, piedra.y);
  ctx.lineTo(piedra.x + 31, piedra.y + 10);
  ctx.lineTo(piedra.x + 25, piedra.y + 31);
  ctx.lineTo(piedra.x + 6, piedra.y + 29);
  ctx.lineTo(piedra.x, piedra.y + 12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#fff2b0";
  ctx.font = "bold 15px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("?", piedra.x + 16, piedra.y + 21);
}

function dibujarLanzas() {
  lanzas.forEach((lanza) => {
    ctx.save();
    ctx.translate(lanza.x, lanza.y);
    ctx.rotate(lanza.angulo);
    ctx.fillStyle = "#e5d3a1";
    ctx.fillRect(-14, -2, 27, 4);
    ctx.fillStyle = "#d7edf0";
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(7, -5);
    ctx.lineTo(7, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function dibujarPantalla() {
  dibujarJungla();

  if (estado === "inicio") {
    texto("Las naves del espacio", 190, 48, "#d5f59c");
    texto("¡Encuentra la piedra secreta en la jungla!", 255, 24);
    texto("Flechas o WASD: moverse · Espacio: lanzar lanzas", 325, 19);
    texto("Cristales: +10 puntos · Escudo azul: protege 6 segundos", 365, 19);
    texto("P: pausa", 398, 19);
    texto("Pulsa Enter para empezar", 435, 28, "#ffe18a");
    return;
  }

  dibujarCristal();
  dibujarEscudoObjeto();
  dibujarPiedra();
  goblins.forEach(dibujarGoblin);
  dibujarLanzas();
  dibujarHeroina();

  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(0, 0, canvas.width, 42);
  ctx.fillStyle = "#fff";
  ctx.font = "18px sans-serif";
  ctx.textAlign = "left";
  const textoEscudo = escudoRestante > 0
    ? `   Escudo: ${Math.ceil(escudoRestante)}s`
    : proteccionInicioRestante > 0 ? `   Protección: ${Math.ceil(proteccionInicioRestante)}s` : "";
  ctx.fillText(`Puntos: ${puntos}   Récord: ${record}${textoEscudo}`, 14, 28);
  ctx.textAlign = "right";
  ctx.fillText(`Vidas: ${"♥ ".repeat(vidas)}`, canvas.width - 14, 28);

  if (estado === "pausa") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    texto("PAUSA", canvas.height / 2, 48);
    texto("Pulsa P para continuar", canvas.height / 2 + 42, 24);
  }

  if (estado === "fin" || estado === "victoria") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    texto(estado === "victoria" ? "¡Encontraste la piedra secreta!" : "¡Fin del juego!", canvas.height / 2 - 45, 37, "#ffe18a");
    texto(`Puntos: ${puntos}   Récord: ${record}`, canvas.height / 2 + 5, 24);
    texto("Pulsa Enter para jugar otra vez", canvas.height / 2 + 55, 22);
  }
}

let ultimoTiempo = 0;
function bucle(marcaTiempo) {
  const delta = Math.min((marcaTiempo - ultimoTiempo) / 1000, 0.05);
  ultimoTiempo = marcaTiempo;
  actualizar(delta);
  dibujarPantalla();
  requestAnimationFrame(bucle);
}

requestAnimationFrame(bucle);
