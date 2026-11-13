// ===== Ajustes del juego: ¡prueba a cambiar estos números! =====
const CONFIG = {
  velocidadJugador: 5,
  vidas: 3,
  colorJugador: "#4fc3f7",
  imagenJugador: "", // p. ej. "assets/personaje.png" (vacío = dibujar un cuadrado)
};

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.focus();

// ===== Teclado =====
const teclas = {};
window.addEventListener("keydown", (e) => {
  teclas[e.key] = true;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
  if (e.key === "Enter" && (estado === "inicio" || estado === "fin")) empezar();
  if ((e.key === "p" || e.key === "P") && (estado === "jugando" || estado === "pausa")) {
    estado = estado === "jugando" ? "pausa" : "jugando";
  }
});
window.addEventListener("keyup", (e) => { teclas[e.key] = false; });

// ===== Imágenes =====
const imgJugador = new Image();
if (CONFIG.imagenJugador) imgJugador.src = CONFIG.imagenJugador;

// ===== Estado del juego =====
let estado = "inicio"; // inicio | jugando | pausa | fin
let jugador, puntos, vidas;

function empezar() {
  jugador = { x: canvas.width / 2 - 25, y: canvas.height - 80, ancho: 50, alto: 50 };
  puntos = 0;
  vidas = CONFIG.vidas;
  estado = "jugando";
}

// ===== Lógica =====
function actualizar() {
  if (estado !== "jugando") return;

  if (teclas["ArrowLeft"] || teclas["a"]) jugador.x -= CONFIG.velocidadJugador;
  if (teclas["ArrowRight"] || teclas["d"]) jugador.x += CONFIG.velocidadJugador;
  if (teclas["ArrowUp"] || teclas["w"]) jugador.y -= CONFIG.velocidadJugador;
  if (teclas["ArrowDown"] || teclas["s"]) jugador.y += CONFIG.velocidadJugador;

  // No salir de la pantalla
  jugador.x = Math.max(0, Math.min(canvas.width - jugador.ancho, jugador.x));
  jugador.y = Math.max(0, Math.min(canvas.height - jugador.alto, jugador.y));
}

// Devuelve true si dos rectángulos se tocan
function chocan(a, b) {
  return a.x < b.x + b.ancho && a.x + a.ancho > b.x && a.y < b.y + b.alto && a.y + a.alto > b.y;
}

// ===== Dibujo =====
function texto(msg, y, tamaño = 32) {
  ctx.fillStyle = "#fff";
  ctx.font = `${tamaño}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(msg, canvas.width / 2, y);
}

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (estado === "inicio") {
    texto("Mi Juego", 220, 56);
    texto("Flechas o WASD para moverte · P para pausa", 320, 22);
    texto("Pulsa Enter para empezar", 400, 28);
    return;
  }

  if (imgJugador.complete && imgJugador.naturalWidth > 0) {
    ctx.drawImage(imgJugador, jugador.x, jugador.y, jugador.ancho, jugador.alto);
  } else {
    ctx.fillStyle = CONFIG.colorJugador;
    ctx.fillRect(jugador.x, jugador.y, jugador.ancho, jugador.alto);
  }

  ctx.fillStyle = "#fff";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Puntos: ${puntos}   Vidas: ${"❤️".repeat(vidas)}`, 16, 30);

  if (estado === "pausa") texto("PAUSA (pulsa P)", canvas.height / 2);
  if (estado === "fin") {
    texto("¡Fin del juego!", canvas.height / 2 - 20, 48);
    texto("Pulsa Enter para jugar otra vez", canvas.height / 2 + 30, 24);
  }
}

// ===== Bucle principal =====
function bucle() {
  actualizar();
  dibujar();
  requestAnimationFrame(bucle);
}
bucle();
