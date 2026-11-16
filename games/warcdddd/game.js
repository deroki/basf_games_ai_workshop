// ===== Ajustes del juego: ¡prueba a cambiar estos números! =====
const CONFIG = {
  nombre: "Warcdddd",
  velocidadJugador: 245,
  velocidadEstrella: 1.7,
  duracionEstrella: 4,
  recargaEstrella: 8,
  vidas: 3,
  tiempoLimite: 90,
  pasajerosParaGanar: 5,
  puntosSaco: 10,
  puntosPasajero: 1000,
  invulnerabilidad: 1.8,
  cantidadSacos: 4,
  intervaloPiedra: 4,
  intervaloFuego: 3.8,
  intervaloMonstruoInicial: 5.5,
  intervaloMonstruoMinimo: 1.4,
  velocidadObstaculos: 82,
};

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const CALLE = { izquierda: 105, derecha: 695, arriba: 72, abajo: 590 };
const teclas = {};
const AudioContextJuego = window.AudioContext || window.webkitAudioContext;

let estado = "inicio";
let jugador;
let puntos = 0;
let vidas = CONFIG.vidas;
let tiempoRestante = CONFIG.tiempoLimite;
let entregados = 0;
let llevaPasajero = false;
let pasajero;
let destino;
let sacos = [];
let obstaculos = [];
let efectos = [];
let tiempoPiedra = 0;
let tiempoFuego = 0;
let tiempoMonstruo = 0;
let ultimoTiempo = 0;
let audio;
let mensajeFin = "";

canvas.addEventListener("click", () => canvas.focus());
canvas.focus();

window.addEventListener("keydown", (evento) => {
  const tecla = evento.key.toLowerCase();
  teclas[tecla] = true;
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(tecla)) {
    evento.preventDefault();
  }
  if (tecla === "enter" && (estado === "inicio" || estado === "fin")) empezar();
  if (tecla === "p" && (estado === "jugando" || estado === "pausa")) {
    estado = estado === "jugando" ? "pausa" : "jugando";
  }
  if (tecla === " " && estado === "jugando") activarEstrella();
});

window.addEventListener("keyup", (evento) => {
  teclas[evento.key.toLowerCase()] = false;
});

function sonido(frecuencia, duracion, forma = "sine", bajada = 0) {
  if (!AudioContextJuego) return;
  if (!audio) audio = new AudioContextJuego();

  const ahora = audio.currentTime;
  const oscilador = audio.createOscillator();
  const volumen = audio.createGain();
  oscilador.type = forma;
  oscilador.frequency.setValueAtTime(frecuencia, ahora);
  if (bajada > 0) {
    oscilador.frequency.exponentialRampToValueAtTime(bajada, ahora + duracion);
  }
  volumen.gain.setValueAtTime(0.08, ahora);
  volumen.gain.exponentialRampToValueAtTime(0.001, ahora + duracion);
  oscilador.connect(volumen);
  volumen.connect(audio.destination);
  oscilador.start(ahora);
  oscilador.stop(ahora + duracion);
}

function empezar() {
  jugador = {
    x: canvas.width / 2 - 23,
    y: canvas.height - 105,
    ancho: 46,
    alto: 58,
    estrella: 0,
    recarga: 0,
    invulnerable: 0,
  };
  puntos = 0;
  vidas = CONFIG.vidas;
  tiempoRestante = CONFIG.tiempoLimite;
  entregados = 0;
  llevaPasajero = false;
  sacos = [];
  obstaculos = [];
  efectos = [];
  tiempoPiedra = 1.5;
  tiempoFuego = 3;
  tiempoMonstruo = 5;
  pasajero = crearPasajero();
  destino = null;
  for (let i = 0; i < CONFIG.cantidadSacos; i += 1) sacos.push(crearSaco());
  mensajeFin = "";
  estado = "jugando";
  ultimoTiempo = performance.now();
}

function crearPasajero() {
  return {
    x: numeroAleatorio(CALLE.izquierda + 60, CALLE.derecha - 60),
    y: numeroAleatorio(CALLE.arriba + 120, CALLE.abajo - 70),
  };
}

function crearSaco() {
  return {
    x: numeroAleatorio(CALLE.izquierda + 35, CALLE.derecha - 35),
    y: numeroAleatorio(CALLE.arriba + 65, CALLE.abajo - 45),
    radio: 14,
  };
}

function numeroAleatorio(minimo, maximo) {
  return minimo + Math.random() * (maximo - minimo);
}

function activarEstrella() {
  if (jugador.recarga > 0) return;
  jugador.estrella = CONFIG.duracionEstrella;
  jugador.recarga = CONFIG.recargaEstrella;
  sonido(740, 0.32, "triangle", 420);
}

function actualizar(delta) {
  if (estado !== "jugando") return;

  tiempoRestante -= delta;
  jugador.estrella = Math.max(0, jugador.estrella - delta);
  jugador.recarga = Math.max(0, jugador.recarga - delta);
  jugador.invulnerable = Math.max(0, jugador.invulnerable - delta);

  moverJugador(delta);
  actualizarObstaculos(delta);
  actualizarObjetivos();
  actualizarEfectos(delta);

  if (tiempoRestante <= 0) terminar(false, "¡Se acabó el tiempo!");
}

function moverJugador(delta) {
  let dx = 0;
  let dy = 0;
  if (teclas.arrowleft || teclas.a) dx -= 1;
  if (teclas.arrowright || teclas.d) dx += 1;
  if (teclas.arrowup || teclas.w) dy -= 1;
  if (teclas.arrowdown || teclas.s) dy += 1;

  const largo = Math.hypot(dx, dy) || 1;
  const turbo = jugador.estrella > 0 ? CONFIG.velocidadEstrella : 1;
  const anteriorX = jugador.x;
  const anteriorY = jugador.y;
  const velocidad = CONFIG.velocidadJugador * turbo * delta;
  jugador.x += (dx / largo) * velocidad;
  jugador.y += (dy / largo) * velocidad;
  jugador.x = limitar(jugador.x, CALLE.izquierda + 5, CALLE.derecha - jugador.ancho - 5);
  jugador.y = limitar(jugador.y, CALLE.arriba + 8, CALLE.abajo - jugador.alto);

  if (jugador.invulnerable > 0 && jugador.estrella > 0) return;
  const golpe = obstaculos.find((objeto) => seTocan(jugador, objeto));
  if (!golpe) return;

  jugador.x = anteriorX;
  jugador.y = anteriorY;
  crearEfecto(jugador.x + jugador.ancho / 2, jugador.y + jugador.alto / 2, "#ffd166");
  if (jugador.estrella > 0 || jugador.invulnerable > 0) return;

  jugador.invulnerable = CONFIG.invulnerabilidad;
  sonido(golpe.tipo === "piedra" ? 170 : 260, 0.4, "triangle", 70);
  if (golpe.tipo === "piedra") {
    vidas -= 1;
    if (vidas <= 0) terminar(false, "¡El taxi se quedó sin vidas!");
  }
}

function actualizarObstaculos(delta) {
  tiempoPiedra -= delta;
  tiempoFuego -= delta;
  tiempoMonstruo -= delta;

  if (tiempoPiedra <= 0) {
    obstaculos.push(crearObstaculo("piedra"));
    tiempoPiedra = CONFIG.intervaloPiedra;
  }
  if (tiempoFuego <= 0) {
    obstaculos.push(crearObstaculo("fuego"));
    tiempoFuego = CONFIG.intervaloFuego;
  }
  if (tiempoMonstruo <= 0) {
    obstaculos.push(crearObstaculo("monstruo"));
    const tiempoJugado = CONFIG.tiempoLimite - tiempoRestante;
    tiempoMonstruo = Math.max(
      CONFIG.intervaloMonstruoMinimo,
      CONFIG.intervaloMonstruoInicial - tiempoJugado / 18
    );
    sonido(115, 0.55, "sine", 65);
  }

  for (const objeto of obstaculos) {
    objeto.y += objeto.velocidad * delta;
  }
  obstaculos = obstaculos.filter((objeto) => objeto.y < CALLE.abajo + 40);
}

function crearObstaculo(tipo) {
  return {
    tipo,
    x: numeroAleatorio(CALLE.izquierda + 35, CALLE.derecha - 35),
    y: CALLE.arriba - 35,
    ancho: tipo === "piedra" ? 34 : 40,
    alto: tipo === "piedra" ? 34 : 42,
    velocidad: CONFIG.velocidadObstaculos + numeroAleatorio(0, 35),
  };
}

function actualizarObjetivos() {
  if (!llevaPasajero && seTocan(jugador, { x: pasajero.x - 12, y: pasajero.y - 17, ancho: 24, alto: 34 })) {
    llevaPasajero = true;
    destino = {
      x: pasajero.x < canvas.width / 2 ? CALLE.derecha - 95 : CALLE.izquierda + 55,
      y: pasajero.y < canvas.height / 2 ? CALLE.abajo - 60 : CALLE.arriba + 45,
    };
    sonido(540, 0.22, "sine", 760);
  }

  if (llevaPasajero && seTocan(jugador, { x: destino.x - 22, y: destino.y - 22, ancho: 44, alto: 44 })) {
    entregados += 1;
    puntos += CONFIG.puntosPasajero;
    llevaPasajero = false;
    destino = null;
    sonido(660, 0.35, "triangle", 990);
    if (entregados >= CONFIG.pasajerosParaGanar) {
      terminar(true, "¡Servicio de taxi completado!");
      return;
    }
    pasajero = crearPasajero();
  }

  for (let i = sacos.length - 1; i >= 0; i -= 1) {
    const saco = sacos[i];
    if (seTocan(jugador, { x: saco.x - 12, y: saco.y - 12, ancho: 24, alto: 24 })) {
      puntos += CONFIG.puntosSaco;
      crearEfecto(saco.x, saco.y, "#f5d69a");
      sacos.splice(i, 1, crearSaco());
      sonido(420, 0.12, "sine", 680);
    }
  }
}

function actualizarEfectos(delta) {
  for (const efecto of efectos) efecto.tiempo -= delta;
  efectos = efectos.filter((efecto) => efecto.tiempo > 0);
}

function crearEfecto(x, y, color) {
  efectos.push({ x, y, color, tiempo: 0.38, duracion: 0.38 });
}

function seTocan(a, b) {
  return a.x < b.x + b.ancho
    && a.x + a.ancho > b.x
    && a.y < b.y + b.alto
    && a.y + a.alto > b.y;
}

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor));
}

function terminar(gano, mensaje) {
  estado = "fin";
  mensajeFin = mensaje;
  if (gano) sonido(880, 0.7, "triangle", 440);
}

function dibujarFondo() {
  ctx.fillStyle = "#171b27";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  dibujarEdificios(0, 0, 94, canvas.height, 0);
  dibujarEdificios(706, 0, 94, canvas.height, 1);

  ctx.fillStyle = "#313541";
  ctx.fillRect(CALLE.izquierda, 0, CALLE.derecha - CALLE.izquierda, canvas.height);
  ctx.fillStyle = "#73717c";
  ctx.fillRect(CALLE.izquierda - 7, 0, 7, canvas.height);
  ctx.fillRect(CALLE.derecha, 0, 7, canvas.height);

  ctx.strokeStyle = "#d8c967";
  ctx.lineWidth = 3;
  ctx.setLineDash([26, 24]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fillRect(CALLE.izquierda + 12, 0, 3, canvas.height);
  ctx.fillRect(CALLE.derecha - 15, 0, 3, canvas.height);
}

function dibujarEdificios(x, y, ancho, alto, lado) {
  ctx.fillStyle = lado === 0 ? "#252c39" : "#292437";
  ctx.fillRect(x, y, ancho, alto);
  for (let fila = 0; fila < 6; fila += 1) {
    for (let columna = 0; columna < 2; columna += 1) {
      const ventanaX = x + 12 + columna * 39;
      const ventanaY = 18 + fila * 88;
      ctx.fillStyle = (fila + columna + lado) % 3 === 0 ? "#b2705b" : "#5c7184";
      ctx.fillRect(ventanaX, ventanaY, 20, 28);
      ctx.fillStyle = "rgba(255, 223, 145, 0.45)";
      ctx.fillRect(ventanaX + 4, ventanaY + 4, 4, 20);
    }
  }
  ctx.fillStyle = "#404354";
  ctx.fillRect(x + 8, alto - 48, ancho - 16, 48);
  ctx.fillStyle = "#b95a54";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(lado === 0 ? "HOTEL" : "TAXI", x + ancho / 2, alto - 20);
}

function dibujarSaco(saco) {
  ctx.fillStyle = "#d6b57a";
  ctx.beginPath();
  ctx.ellipse(saco.x, saco.y, 13, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#775d39";
  ctx.fillRect(saco.x - 7, saco.y - 13, 14, 4);
  ctx.fillStyle = "#4b3b29";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("H", saco.x, saco.y + 4);
}

function dibujarPasajero() {
  ctx.fillStyle = "#b8f2e6";
  ctx.beginPath();
  ctx.arc(pasajero.x, pasajero.y - 8, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4cc9a5";
  ctx.fillRect(pasajero.x - 9, pasajero.y, 18, 19);
  ctx.fillStyle = "#17232c";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("!", pasajero.x, pasajero.y + 14);
  ctx.fillStyle = "#fff";
  ctx.font = "12px sans-serif";
  ctx.fillText("PASAJERO", pasajero.x, pasajero.y + 34);
}

function dibujarDestino() {
  ctx.strokeStyle = "#8fffc1";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(destino.x, destino.y, 26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(73, 220, 147, 0.28)";
  ctx.beginPath();
  ctx.arc(destino.x, destino.y, 21, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#eafff3";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("DESTINO", destino.x, destino.y + 46);
}

function dibujarObstaculo(objeto) {
  if (objeto.tipo === "piedra") {
    ctx.fillStyle = "#8b909b";
    ctx.beginPath();
    ctx.moveTo(objeto.x - 17, objeto.y + 11);
    ctx.lineTo(objeto.x - 13, objeto.y - 12);
    ctx.lineTo(objeto.x + 2, objeto.y - 18);
    ctx.lineTo(objeto.x + 17, objeto.y - 5);
    ctx.lineTo(objeto.x + 14, objeto.y + 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#b7bac2";
    ctx.fillRect(objeto.x - 5, objeto.y - 8, 5, 5);
  } else if (objeto.tipo === "fuego") {
    ctx.fillStyle = "#e4513d";
    ctx.beginPath();
    ctx.ellipse(objeto.x, objeto.y + 5, 17, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffb43b";
    ctx.beginPath();
    ctx.moveTo(objeto.x - 12, objeto.y + 12);
    ctx.lineTo(objeto.x - 3, objeto.y - 15);
    ctx.lineTo(objeto.x + 2, objeto.y + 1);
    ctx.lineTo(objeto.x + 12, objeto.y - 10);
    ctx.lineTo(objeto.x + 13, objeto.y + 14);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = "#8c68c7";
    ctx.beginPath();
    ctx.arc(objeto.x, objeto.y, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(objeto.x - 14, objeto.y - 9);
    ctx.lineTo(objeto.x - 21, objeto.y - 23);
    ctx.lineTo(objeto.x - 4, objeto.y - 16);
    ctx.moveTo(objeto.x + 14, objeto.y - 9);
    ctx.lineTo(objeto.x + 21, objeto.y - 23);
    ctx.lineTo(objeto.x + 4, objeto.y - 16);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillRect(objeto.x - 8, objeto.y - 4, 5, 7);
    ctx.fillRect(objeto.x + 3, objeto.y - 4, 5, 7);
    ctx.fillStyle = "#33234b";
    ctx.fillRect(objeto.x - 6, objeto.y - 2, 2, 3);
    ctx.fillRect(objeto.x + 5, objeto.y - 2, 2, 3);
  }
}

function dibujarTaxi() {
  if (jugador.invulnerable > 0 && Math.floor(jugador.invulnerable * 12) % 2 === 0) return;
  const x = jugador.x;
  const y = jugador.y;

  ctx.fillStyle = "#10131a";
  ctx.fillRect(x - 4, y + 10, 7, 16);
  ctx.fillRect(x + jugador.ancho - 3, y + 10, 7, 16);
  ctx.fillRect(x - 4, y + 37, 7, 15);
  ctx.fillRect(x + jugador.ancho - 3, y + 37, 7, 15);

  ctx.fillStyle = "#f4c542";
  ctx.fillRect(x, y, jugador.ancho, jugador.alto);
  ctx.strokeStyle = "#fff0a5";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 2, y + 2, jugador.ancho - 4, jugador.alto - 4);

  ctx.fillStyle = "#334b5b";
  ctx.fillRect(x + 7, y + 8, jugador.ancho - 14, 15);
  ctx.fillStyle = "#e5f3f5";
  ctx.fillRect(x + 10, y + 10, jugador.ancho - 20, 7);

  ctx.fillStyle = "#ed514b";
  ctx.beginPath();
  ctx.arc(x + jugador.ancho / 2, y + 33, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f6f1e8";
  ctx.beginPath();
  ctx.moveTo(x + 12, y + 27);
  ctx.lineTo(x + 13, y + 19);
  ctx.lineTo(x + 20, y + 27);
  ctx.moveTo(x + 26, y + 27);
  ctx.lineTo(x + 33, y + 19);
  ctx.lineTo(x + 34, y + 27);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + 15, y + 31, 4, 4);
  ctx.fillRect(x + 27, y + 31, 4, 4);
  ctx.fillStyle = "#3e2630";
  ctx.fillRect(x + 16, y + 32, 2, 2);
  ctx.fillRect(x + 28, y + 32, 2, 2);
  ctx.fillStyle = "#532c32";
  ctx.fillRect(x + 19, y + 40, 8, 3);

  ctx.fillStyle = "#fff1a8";
  ctx.fillRect(x + 3, y + 2, 8, 4);
  ctx.fillRect(x + jugador.ancho - 11, y + 2, 8, 4);
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + 15, y + 48, 16, 7);
  ctx.fillStyle = "#20242c";
  ctx.font = "bold 7px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("TAXI", x + jugador.ancho / 2, y + 54);

  if (jugador.estrella > 0) dibujarEstrella(x + jugador.ancho / 2, y - 10);
}

function dibujarEstrella(x, y) {
  ctx.fillStyle = "#fff176";
  ctx.strokeStyle = "#ffb300";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let punta = 0; punta < 10; punta += 1) {
    const radio = punta % 2 === 0 ? 13 : 6;
    const angulo = -Math.PI / 2 + punta * Math.PI / 5;
    const px = x + Math.cos(angulo) * radio;
    const py = y + Math.sin(angulo) * radio;
    if (punta === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function dibujarEfectos() {
  for (const efecto of efectos) {
    const avance = 1 - efecto.tiempo / efecto.duracion;
    const radio = 7 + avance * 27;
    ctx.globalAlpha = 1 - avance;
    ctx.strokeStyle = efecto.color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(efecto.x, efecto.y, radio, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#fff2a8";
    ctx.beginPath();
    ctx.arc(efecto.x, efecto.y, radio * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function dibujarMarcador() {
  ctx.fillStyle = "rgba(13, 16, 25, 0.88)";
  ctx.fillRect(115, 8, 570, 52);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 17px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Puntos: ${puntos}`, 128, 30);
  ctx.fillText(`Vidas: ${"❤️".repeat(Math.max(0, vidas))}`, 285, 30);
  ctx.textAlign = "right";
  ctx.fillText(`Pasajeros: ${entregados}/${CONFIG.pasajerosParaGanar}`, 672, 30);
  ctx.fillStyle = "#d6d9e8";
  ctx.font = "13px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Tiempo: ${Math.ceil(tiempoRestante)} s`, 128, 50);
  ctx.textAlign = "right";
  ctx.fillText(jugador.estrella > 0 ? "¡Estrella activa!" : "Espacio: estrella", 672, 50);
}

function texto(mensaje, y, tamano = 28, color = "#fff") {
  ctx.fillStyle = color;
  ctx.font = `bold ${tamano}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(mensaje, canvas.width / 2, y);
}

function dibujarPantalla() {
  dibujarFondo();
  if (estado !== "inicio") {
    if (llevaPasajero) dibujarDestino();
    else dibujarPasajero();
    for (const saco of sacos) dibujarSaco(saco);
    for (const obstaculo of obstaculos) dibujarObstaculo(obstaculo);
    dibujarTaxi();
    dibujarEfectos();
    dibujarMarcador();
  }

  if (estado === "inicio") {
    ctx.fillStyle = "rgba(11, 14, 25, 0.84)";
    ctx.fillRect(130, 105, 540, 390);
    texto("Warcdddd", 175, 46, "#ffd966");
    texto("Taxi de otro mundo", 214, 25, "#cdb7ff");
    texto("Recoge pasajeros y llévalos al destino", 280, 20);
    texto("Entrega 5 para ganar; ¡cuidado con las piedras!", 316, 17);
    texto("Flechas o WASD: conducir · Espacio: estrella", 370, 17);
    texto("P: pausa · Enter: empezar", 405, 17);
    texto("Pulsa Enter para empezar", 455, 23, "#8fffc1");
  }

  if (estado === "jugando") {
    ctx.fillStyle = "rgba(10, 12, 20, 0.82)";
    ctx.fillRect(155, 548, 490, 34);
    texto(llevaPasajero ? "¡Lleva al pasajero al círculo verde!" : "¡Busca al pasajero que espera en la calle!", 572, 16);
  }

  if (estado === "pausa") {
    ctx.fillStyle = "rgba(10, 12, 20, 0.74)";
    ctx.fillRect(170, 230, 460, 130);
    texto("PAUSA", 290, 42, "#ffd966");
    texto("Pulsa P para continuar", 330, 19);
  }

  if (estado === "fin") {
    ctx.fillStyle = "rgba(10, 12, 20, 0.84)";
    ctx.fillRect(145, 210, 510, 190);
    texto(mensajeFin, 275, 30, entregados >= CONFIG.pasajerosParaGanar ? "#8fffc1" : "#ffd966");
    texto(`Pasajeros: ${entregados} · Puntos: ${puntos}`, 320, 20);
    texto("Pulsa Enter para jugar otra vez", 365, 20);
  }
}

function bucle(marcaTiempo) {
  const delta = Math.min((marcaTiempo - ultimoTiempo) / 1000 || 0, 0.05);
  ultimoTiempo = marcaTiempo;
  actualizar(delta);
  dibujarPantalla();
  requestAnimationFrame(bucle);
}

requestAnimationFrame((marcaTiempo) => {
  ultimoTiempo = marcaTiempo;
  bucle(marcaTiempo);
});
