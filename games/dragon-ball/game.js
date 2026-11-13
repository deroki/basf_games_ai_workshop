// ===== Ajustes del juego: ¡prueba a cambiar estos números y colores! =====
const CONFIG = {
  ancho: 800,
  alto: 600,
  altoSuelo: 70,              // alto de la franja de suelo (ciudad + tierra)

  // Dragón
  velocidadVolar: 260,        // velocidad a los lados mientras vuela
  velocidadPatinar: 380,      // velocidad a los lados cuando patina por el suelo
  fuerzaVuelo: 300,           // lo rápido que sube con la flecha arriba
  velocidadBajar: 420,        // lo rápido que baja con la flecha abajo
  gravedad: 450,              // lo que tira el suelo del dragón

  // Vidas y puntos
  vidas: 3,
  vidasMaximas: 5,
  puntosEstrella: 100,
  puntosCasa: 500,            // premio por cada casa construida
  estrellasParaCasa: 2,       // estrellas que hacen falta para cada casa
  numeroCasas: 4,             // casas que hay que construir para ganar
  tamañoCasas: [1, 1.2, 1.4, 1.6],   // cada casa es más grande que la anterior
  // Colores de cada casa: [delante, arriba, lado]
  coloresCasas: [
    [0xffe082, 0xfff8e1, 0xffb74d],  // amarilla
    [0xf48fb1, 0xfce4ec, 0xec407a],  // rosa
    [0x80cbc4, 0xe0f2f1, 0x26a69a],  // verde agua
    [0xb39ddb, 0xede7f6, 0x7e57c2],  // morada
  ],
  segundosEscudo: 6,
  segundosInvencible: 1.5,    // tiempo sin recibir daño después de un golpe

  // Mundo (fácil y tranquilo, no se acelera)
  velocidadMundo: 200,
  segundosEntreObstaculos: 1.8,
  segundosEntreObjetos: 2.0,
  velocidadLlamarada: 520,    // lo rápido que va el fuego que escupe el dragón
  segundosEntreLlamaradas: 0.4, // tiempo de espera entre un fuego y otro
  puntosRomper: 20,           // puntos por romper un obstáculo con fuego
  probabilidadCorazon: 0.15,
  probabilidadEscudo: 0.12,
  posicionSolar: 600,         // dónde se para la zona de tierra para construir

  // Colores
  colorDragon: 0x1e1e26,
  colorCresta: 0xe53935,
  colorTela: 0xd7b98e,
  colorCieloArriba: 0x2b1055,
  colorCieloAbajo: 0xff9a62,
  luzSol: 420,                // lo lejos que llega la luz del sol
  colorEstrella: 0xffd54f,
};

const SUELO_Y = CONFIG.alto - CONFIG.altoSuelo;

// ===== Sonidos hechos con Web Audio (sin archivos) =====
function pitido(escena, frecuencia, duracion, tipo = "square", frecuenciaFinal = frecuencia, volumen = 0.12, retraso = 0) {
  const ctx = escena.sound.context;
  if (!ctx) return;
  const t = ctx.currentTime + retraso;
  const osc = ctx.createOscillator();
  const volumenNodo = ctx.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(frecuencia, t);
  osc.frequency.exponentialRampToValueAtTime(frecuenciaFinal, t + duracion);
  volumenNodo.gain.setValueAtTime(volumen, t);
  volumenNodo.gain.exponentialRampToValueAtTime(0.001, t + duracion);
  osc.connect(volumenNodo);
  volumenNodo.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duracion);
}

const SONIDOS = {
  estrella: (e) => { pitido(e, 880, 0.1, "triangle", 1320); pitido(e, 1320, 0.15, "triangle", 1760, 0.12, 0.08); },
  corazon: (e) => [523, 659, 784].forEach((f, i) => pitido(e, f, 0.12, "triangle", f, 0.12, i * 0.09)),
  escudo: (e) => pitido(e, 300, 0.35, "sawtooth", 900, 0.08),
  golpe: (e) => pitido(e, 220, 0.3, "square", 60, 0.15),
  romper: (e) => pitido(e, 500, 0.15, "square", 150, 0.08),
  pieza: (e, n) => pitido(e, 400 + n * 120, 0.18, "triangle", 600 + n * 120, 0.14),
  ganar: (e) => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => pitido(e, f, 0.18, "triangle", f, 0.14, i * 0.13)),
  perder: (e) => pitido(e, 440, 0.8, "sawtooth", 80, 0.1),
  llamarada: (e) => { pitido(e, 180, 0.25, "sawtooth", 60, 0.1); pitido(e, 90, 0.2, "square", 40, 0.06); },
};

// ===== Texturas: dibujamos todo con código (no hacen falta imágenes) =====

// Puntadas de costura (líneas cortitas) para el ala de tela
function puntadas(g, x1, y1, x2, y2, cuantas) {
  for (let i = 0; i < cuantas; i++) {
    const a = i / cuantas;
    const b = (i + 0.5) / cuantas;
    g.lineBetween(x1 + (x2 - x1) * a, y1 + (y2 - y1) * a, x1 + (x2 - x1) * b, y1 + (y2 - y1) * b);
  }
}

// El dragón del dibujo del equipo: cabeza redonda, cuello largo, 4 patas
// y cola curvada. Negro, con cresta roja, ala de tela y patines.
function dibujarDragon(g, alaArriba) {
  const negro = CONFIG.colorDragon;

  // Cola que se curva hacia abajo, con punta roja
  g.lineStyle(9, negro, 1);
  g.beginPath();
  g.moveTo(24, 52);
  g.lineTo(8, 54);
  g.lineTo(6, 70);
  g.strokePath();
  g.fillStyle(CONFIG.colorCresta, 1);
  g.fillTriangle(0, 68, 12, 68, 6, 80);

  // Cresta roja por la espalda
  g.fillTriangle(26, 46, 31, 34, 37, 45);
  g.fillTriangle(38, 44, 43, 32, 49, 44);
  g.fillTriangle(50, 44, 55, 33, 60, 45);

  // Cuerpo alargado
  g.fillStyle(negro, 1);
  g.fillEllipse(44, 56, 58, 26);

  // Cuello largo
  g.lineStyle(12, negro, 1);
  g.lineBetween(62, 52, 78, 22);
  g.fillStyle(CONFIG.colorCresta, 1);
  g.fillTriangle(64, 40, 62, 30, 70, 34);

  // 4 patas (la de delante con pie)
  g.fillStyle(negro, 1);
  [20, 34, 48].forEach((x) => g.fillRoundedRect(x, 60, 9, 20, 4));
  g.fillRoundedRect(62, 60, 9, 20, 4);
  g.fillRoundedRect(62, 74, 16, 7, 3);

  // Patines: barra roja y ruedas amarillas
  g.fillStyle(CONFIG.colorCresta, 1);
  g.fillRoundedRect(16, 79, 64, 4, 2);
  g.fillStyle(0xffd54f, 1);
  [22, 36, 50, 64, 76].forEach((x) => g.fillCircle(x, 86, 3.5));

  // Cresta roja de la cabeza
  g.fillStyle(CONFIG.colorCresta, 1);
  g.fillTriangle(70, 8, 72, -2, 78, 5);
  g.fillTriangle(76, 4, 81, -4, 85, 4);
  g.fillTriangle(68, 16, 62, 8, 72, 10);

  // Cabeza redonda
  g.fillStyle(negro, 1);
  g.fillCircle(81, 16, 14);

  // Ojo
  g.fillStyle(0xffffff, 1);
  g.fillCircle(86, 12, 5);
  g.fillStyle(0x111111, 1);
  g.fillCircle(87.5, 12, 2.5);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(88, 11, 1);

  // Sonrisa grande como en el dibujo
  g.lineStyle(2, 0xff8a80, 1);
  g.beginPath();
  g.arc(86, 17, 7, 0.2, Math.PI - 0.9);
  g.strokePath();

  // Ala de tela con costuras y un parche
  const ala = alaArriba
    ? [{ x: 38, y: 48 }, { x: 22, y: 14 }, { x: 34, y: 22 }, { x: 44, y: 8 }, { x: 52, y: 24 }, { x: 56, y: 46 }]
    : [{ x: 38, y: 50 }, { x: 14, y: 64 }, { x: 28, y: 64 }, { x: 34, y: 74 }, { x: 46, y: 62 }, { x: 56, y: 50 }];
  g.fillStyle(CONFIG.colorTela, 1);
  g.fillPoints(ala, true);
  g.lineStyle(2, 0x8d6e63, 1);
  g.strokePoints(ala, true);
  g.lineStyle(1.5, 0xffffff, 0.9);
  if (alaArriba) {
    puntadas(g, 40, 44, 32, 22, 5);
    puntadas(g, 48, 44, 44, 14, 5);
    g.fillStyle(0xe57373, 1);
    g.fillRect(40, 28, 8, 8);
    g.lineStyle(1, 0xffffff, 1);
    g.strokeRect(40, 28, 8, 8);
  } else {
    puntadas(g, 40, 54, 24, 62, 5);
    puntadas(g, 48, 54, 38, 70, 5);
    g.fillStyle(0xe57373, 1);
    g.fillRect(36, 56, 8, 8);
    g.lineStyle(1, 0xffffff, 1);
    g.strokeRect(36, 56, 8, 8);
  }
}

// Dragoncito pequeño (para el escudo): cuello y cabeza, cuerpo, 4 patas y cola
function dibujarMiniDragon(g, cx, cy, s, color) {
  g.fillStyle(color, 1);
  g.fillRoundedRect(cx - 10 * s, cy - 3 * s, 20 * s, 6 * s, 2 * s);
  g.fillRect(cx - 10 * s, cy - 11 * s, 3 * s, 9 * s);
  g.fillCircle(cx - 8.5 * s, cy - 12 * s, 3.2 * s);
  [-9, -4, 1, 6].forEach((x) => g.fillRect(cx + x * s, cy + 2 * s, 2.2 * s, 6 * s));
  g.fillTriangle(cx + 9 * s, cy - 2 * s, cx + 9 * s, cy + 2 * s, cx + 16 * s, cy + 4 * s);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(cx - 9.5 * s, cy - 12.5 * s, 1 * s);
}

function dibujarEstrella(g, cx, cy, grande, pequeño, color, borde) {
  const puntas = [];
  for (let i = 0; i < 10; i++) {
    const radio = i % 2 === 0 ? grande : pequeño;
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    puntas.push({ x: cx + Math.cos(ang) * radio, y: cy + Math.sin(ang) * radio });
  }
  g.fillStyle(color, 1);
  g.fillPoints(puntas, true);
  if (borde) {
    g.lineStyle(3, 0xffffff, 1);
    g.strokePoints(puntas, true);
  }
}

function crearTexturas(escena) {
  const g = escena.make.graphics({ x: 0, y: 0, add: false });

  // Cielo con degradado de atardecer y un sol
  const cielo = escena.textures.createCanvas("cielo", CONFIG.ancho, CONFIG.alto);
  const ctx = cielo.context;
  const degradado = ctx.createLinearGradient(0, 0, 0, CONFIG.alto);
  degradado.addColorStop(0, Phaser.Display.Color.IntegerToColor(CONFIG.colorCieloArriba).rgba);
  degradado.addColorStop(1, Phaser.Display.Color.IntegerToColor(CONFIG.colorCieloAbajo).rgba);
  ctx.fillStyle = degradado;
  ctx.fillRect(0, 0, CONFIG.ancho, CONFIG.alto);
  // Luz del sol: un gran resplandor que ilumina el cielo
  const solX = 620;
  const solY = 300;
  const luz = ctx.createRadialGradient(solX, solY, 40, solX, solY, CONFIG.luzSol);
  luz.addColorStop(0, "rgba(255, 249, 196, 0.95)");
  luz.addColorStop(0.3, "rgba(255, 224, 130, 0.6)");
  luz.addColorStop(1, "rgba(255, 200, 100, 0)");
  ctx.fillStyle = luz;
  ctx.fillRect(0, 0, CONFIG.ancho, CONFIG.alto);
  // Rayos de sol
  ctx.fillStyle = "rgba(255, 245, 157, 0.35)";
  for (let i = 0; i < 12; i++) {
    const ang = (Math.PI * 2 / 12) * i;
    ctx.beginPath();
    ctx.moveTo(solX, solY);
    ctx.arc(solX, solY, CONFIG.luzSol, ang - 0.08, ang + 0.08);
    ctx.fill();
  }
  // El sol, muy brillante
  ctx.shadowColor = "#fff59d";
  ctx.shadowBlur = 60;
  ctx.fillStyle = "#fffde7";
  ctx.beginPath();
  ctx.arc(solX, solY, 65, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  cielo.refresh();

  // Nube
  g.fillStyle(0xffffff, 0.75);
  g.fillCircle(30, 28, 18);
  g.fillCircle(55, 20, 22);
  g.fillCircle(80, 28, 16);
  g.fillRoundedRect(14, 26, 82, 18, 9);
  g.generateTexture("nube", 110, 48);
  g.clear();

  // Chispa (para partículas)
  g.fillStyle(0xffffff, 1);
  g.fillCircle(4, 4, 4);
  g.generateTexture("chispa", 8, 8);
  g.clear();

  // Edificios lejanos (morados)
  const altosLejos = [120, 160, 100, 180, 140, 110, 170, 130];
  altosLejos.forEach((alto, i) => {
    const x = i * 50;
    g.fillStyle(0x6a3d8a, 1);
    g.fillRect(x + 2, 220 - alto, 46, alto);
    g.fillStyle(0xffe082, 0.5);
    for (let wy = 220 - alto + 12; wy < 210; wy += 22) {
      for (let wx = x + 8; wx < x + 42; wx += 14) {
        if ((wx + wy + i) % 3 !== 0) g.fillRect(wx, wy, 6, 9);
      }
    }
  });
  g.generateTexture("edificiosLejos", 400, 220);
  g.clear();

  // Edificios cercanos (más oscuros, con ventanas encendidas)
  const altosCerca = [150, 210, 120, 240, 170, 200];
  altosCerca.forEach((alto, i) => {
    const x = i * 80;
    g.fillStyle(0x3a2350, 1);
    g.fillRect(x + 4, 260 - alto, 72, alto);
    g.fillRect(x + 30, 260 - alto - 18, 4, 18); // antena
    g.fillStyle(0xffd54f, 0.9);
    for (let wy = 260 - alto + 14; wy < 245; wy += 26) {
      for (let wx = x + 12; wx < x + 68; wx += 18) {
        if ((wx * 7 + wy + i) % 4 !== 0) g.fillRect(wx, wy, 9, 12);
      }
    }
  });
  g.generateTexture("edificiosCerca", 480, 260);
  g.clear();

  // Suelo: una parte de acera/carretera de la ciudad y otra de tierra
  g.fillStyle(0x6d6d7a, 1);
  g.fillRect(0, 0, 200, CONFIG.altoSuelo);
  g.fillStyle(0x9e9eab, 1);
  g.fillRect(0, 0, 200, 8);
  g.fillStyle(0xffffff, 0.9);
  g.fillRect(20, 36, 50, 6);
  g.fillRect(120, 36, 50, 6);
  g.fillStyle(0x8d5a2b, 1);
  g.fillRect(200, 0, 200, CONFIG.altoSuelo);
  g.fillStyle(0x6d4320, 1);
  [[220, 24], [260, 50], [300, 30], [340, 56], [370, 20], [235, 58]].forEach(([x, y]) => g.fillCircle(x, y, 5));
  g.fillStyle(0x66bb6a, 1);
  for (let x = 204; x < 400; x += 14) g.fillTriangle(x, 6, x + 5, -4, x + 10, 6);
  g.fillRect(200, 0, 200, 5);
  g.generateTexture("suelo", 400, CONFIG.altoSuelo);
  g.clear();

  // Dragón con el ala arriba y con el ala abajo (para aletear)
  dibujarDragon(g, true);
  g.generateTexture("dragon1", 100, 90);
  g.clear();
  dibujarDragon(g, false);
  g.generateTexture("dragon2", 100, 90);
  g.clear();

  // Obstáculo: montón de tierra
  g.fillStyle(0x8d5a2b, 1);
  g.fillCircle(40, 50, 40);
  g.fillStyle(0x6d4320, 1);
  g.fillCircle(24, 30, 6);
  g.fillCircle(50, 22, 5);
  g.fillCircle(60, 36, 7);
  g.fillStyle(0x9e9e9e, 1);
  g.fillCircle(36, 38, 5);
  g.fillCircle(16, 42, 4);
  g.generateTexture("tierra", 80, 44);
  g.clear();

  // Obstáculo: pinchos
  g.fillStyle(0x555566, 1);
  g.fillRoundedRect(0, 30, 72, 10, 3);
  for (let i = 0; i < 4; i++) {
    g.fillStyle(0xcfd8dc, 1);
    g.fillTriangle(i * 18, 32, i * 18 + 9, 0, i * 18 + 18, 32);
    g.lineStyle(2, 0x37474f, 1);
    g.strokeTriangle(i * 18, 32, i * 18 + 9, 0, i * 18 + 18, 32);
  }
  g.generateTexture("pinchos", 72, 40);
  g.clear();

  // Obstáculo: bola de fuego (va hacia la izquierda)
  g.fillStyle(0xff5722, 1);
  g.fillTriangle(20, 4, 64, 20, 20, 36);
  g.fillStyle(0xff9800, 1);
  g.fillTriangle(20, 11, 54, 20, 20, 29);
  g.fillStyle(0xff5722, 1);
  g.fillCircle(20, 20, 18);
  g.fillStyle(0xffc107, 1);
  g.fillCircle(19, 20, 12);
  g.fillStyle(0xfff59d, 1);
  g.fillCircle(17, 20, 6);
  g.generateTexture("fuego", 64, 40);
  g.clear();

  // Objeto: estrella
  dibujarEstrella(g, 22, 22, 20, 9, CONFIG.colorEstrella, true);
  g.generateTexture("estrella", 44, 44);
  g.clear();

  // Objeto: corazón
  g.fillStyle(0xff4d6d, 1);
  g.fillCircle(11, 12, 10);
  g.fillCircle(29, 12, 10);
  g.fillTriangle(2, 16, 38, 16, 20, 36);
  g.fillStyle(0xffffff, 0.7);
  g.fillCircle(8, 9, 3);
  g.generateTexture("corazon", 40, 38);
  g.clear();

  // Objeto: escudo (como el dibujo del equipo: estrella con un dragoncito dentro)
  dibujarEstrella(g, 28, 29, 27, 12, 0x42a5f5, true);
  dibujarMiniDragon(g, 28, 32, 0.85, 0x1a237e);
  g.generateTexture("escudo", 56, 58);
  g.clear();

  // Escudo puesto: una estrella grande y transparente alrededor del dragón
  const puntasEscudo = [];
  for (let i = 0; i < 10; i++) {
    const radio = i % 2 === 0 ? 72 : 38;
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    puntasEscudo.push({ x: 75 + Math.cos(ang) * radio, y: 78 + Math.sin(ang) * radio });
  }
  g.fillStyle(0x81d4fa, 0.3);
  g.fillPoints(puntasEscudo, true);
  g.lineStyle(4, 0xb3e5fc, 0.95);
  g.strokePoints(puntasEscudo, true);
  g.generateTexture("burbuja", 150, 150);
  g.clear();

  // Zona de tierra para construir, con un cartel de casita
  g.fillStyle(0x8d5a2b, 1);
  g.fillRoundedRect(0, 86, 240, 24, 8);
  g.fillStyle(0x6d4320, 1);
  [20, 60, 100, 140, 180].forEach((x) => g.fillCircle(x, 98, 4));
  g.fillStyle(0x795548, 1);
  g.fillRect(216, 40, 8, 50);
  g.fillStyle(0xffecb3, 1);
  g.fillRoundedRect(196, 14, 44, 32, 5);
  g.fillStyle(0xff7043, 1);
  g.fillTriangle(204, 30, 218, 18, 232, 30);
  g.fillStyle(0xffd54f, 1);
  g.fillRect(208, 30, 20, 12);
  g.generateTexture("solar", 240, 110);
  g.clear();

  // Piezas de las casas de estrellas (como el dibujo del equipo):
  // una caja ancha abajo y un cubo encima. Una de cada color.
  const tinta = 0x3949ab;

  // Caja en 3D: cara de delante, de arriba y del lado
  const caja = (ancho, alto, fondo, colores) => {
    const delante = [{ x: 0, y: fondo }, { x: ancho, y: fondo }, { x: ancho, y: fondo + alto }, { x: 0, y: fondo + alto }];
    const arriba = [{ x: 0, y: fondo }, { x: fondo * 1.3, y: 0 }, { x: ancho + fondo * 1.3, y: 0 }, { x: ancho, y: fondo }];
    const lado = [{ x: ancho, y: fondo }, { x: ancho + fondo * 1.3, y: 0 }, { x: ancho + fondo * 1.3, y: alto }, { x: ancho, y: fondo + alto }];
    [[delante, colores[0]], [arriba, colores[1]], [lado, colores[2]]].forEach(([cara, color]) => {
      g.fillStyle(color, 1);
      g.fillPoints(cara, true);
      g.lineStyle(3, tinta, 1);
      g.strokePoints(cara, true);
    });
  };

  CONFIG.coloresCasas.forEach((colores, n) => {
    // Planta de abajo: caja ancha
    caja(170, 64, 20, colores);
    [[30, 36], [150, 36]].forEach(([x, y]) => dibujarEstrella(g, x, y, 7, 3, 0xffffff, false));
    g.generateTexture(`casaBase${n}`, 200, 84);
    g.clear();

    // Planta de arriba: cubo
    caja(84, 72, 24, colores);
    dibujarEstrella(g, 42, 46, 12, 5, CONFIG.colorEstrella, true);
    g.generateTexture(`casaCubo${n}`, 110, 96);
    g.clear();
  });

  // Puerta con forma de arco
  g.fillStyle(0x8d6e63, 1);
  g.fillRoundedRect(0, 0, 30, 44, { tl: 14, tr: 14, bl: 0, br: 0 });
  g.lineStyle(3, tinta, 1);
  g.strokeRoundedRect(1.5, 1.5, 27, 42.5, { tl: 13, tr: 13, bl: 0, br: 0 });
  g.lineBetween(15, 6, 15, 44);
  g.fillStyle(0xffd54f, 1);
  g.fillCircle(22, 26, 2.5);
  g.generateTexture("casaPuerta", 30, 44);
  g.clear();

  // Ventanita con forma de arco
  g.fillStyle(0x81d4fa, 1);
  g.fillRoundedRect(0, 0, 20, 26, { tl: 10, tr: 10, bl: 0, br: 0 });
  g.lineStyle(3, tinta, 1);
  g.strokeRoundedRect(1.5, 1.5, 17, 23, { tl: 9, tr: 9, bl: 0, br: 0 });
  g.generateTexture("casaVentana", 20, 26);
  g.destroy();
}

// Texto bonito con borde y sombra
function estiloTexto(tamaño, color = "#ffffff") {
  return {
    fontFamily: "Trebuchet MS, Verdana, sans-serif",
    fontSize: `${tamaño}px`,
    fontStyle: "bold",
    color,
    stroke: "#1a1a2e",
    strokeThickness: Math.max(3, tamaño / 8),
    shadow: { offsetX: 0, offsetY: 4, color: "#000000", blur: 8, fill: true },
    align: "center",
  };
}

// Fondo común: cielo, nubes, dos capas de edificios y suelo que se mueven
function crearFondo(escena) {
  escena.add.image(0, 0, "cielo").setOrigin(0);
  escena.add.particles(0, 0, "nube", {
    x: CONFIG.ancho + 60,
    y: { min: 40, max: 220 },
    lifespan: 26000,
    speedX: { min: -50, max: -25 },
    scale: { min: 0.6, max: 1.2 },
    alpha: 0.8,
    frequency: 3500,
    advance: 20000,
  });
  escena.capas = [
    { sprite: escena.add.tileSprite(0, SUELO_Y + 10, CONFIG.ancho, 220, "edificiosLejos").setOrigin(0, 1), velocidad: 0.2 },
    { sprite: escena.add.tileSprite(0, SUELO_Y + 4, CONFIG.ancho, 260, "edificiosCerca").setOrigin(0, 1), velocidad: 0.45 },
    { sprite: escena.add.tileSprite(0, SUELO_Y, CONFIG.ancho, CONFIG.altoSuelo, "suelo").setOrigin(0), velocidad: 1 },
  ];
  escena.fondoParado = false;
  const moverCapas = (tiempo, delta) => {
    if (escena.fondoParado) return;
    escena.capas.forEach((c) => { c.sprite.tilePositionX += CONFIG.velocidadMundo * c.velocidad * (delta / 1000); });
  };
  escena.events.on("update", moverCapas);
  // Al cambiar de pantalla dejamos de mover este fondo
  escena.events.once("shutdown", () => escena.events.off("update", moverCapas));
}

// ===== Pantalla de carga: prepara las texturas =====
class Preparar extends Phaser.Scene {
  constructor() { super("Preparar"); }
  create() {
    crearTexturas(this);
    this.scene.start("Inicio");
  }
}

// ===== Pantalla de inicio =====
class Inicio extends Phaser.Scene {
  constructor() { super("Inicio"); }
  create() {
    crearFondo(this);
    const centro = CONFIG.ancho / 2;

    const titulo = this.add.text(centro, 110, "Dragon Ball", estiloTexto(84, "#ffd54f")).setOrigin(0.5);
    this.tweens.add({ targets: titulo, y: 128, duration: 1200, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    const dragon = this.add.image(centro, 260, "dragon1").setScale(1.8);
    this.tweens.add({ targets: dragon, y: 280, angle: { from: -5, to: 5 }, duration: 800, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    this.time.addEvent({ delay: 150, loop: true, callback: () => dragon.setTexture(dragon.texture.key === "dragon1" ? "dragon2" : "dragon1") });

    this.add.text(centro, 370, "Coge 2 ⭐ para cada casa y construye 4 casas 🏠\n¡Esquiva la tierra, los pinchos y el fuego!", estiloTexto(24)).setOrigin(0.5);
    this.add.text(centro, 445, "⬆️ volar  ⬇️ patinar  ⬅️ ➡️ moverse  ESPACIO fuego 🔥  P pausa", estiloTexto(20, "#ffe0b2")).setOrigin(0.5);
    const empezar = this.add.text(centro, 500, "Pulsa ENTER para empezar", estiloTexto(32, "#80ff9a")).setOrigin(0.5);
    this.tweens.add({ targets: empezar, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

    this.input.keyboard.once("keydown-ENTER", () => this.scene.start("Juego"));
  }
}

// ===== El juego =====
class Juego extends Phaser.Scene {
  constructor() { super("Juego"); }

  create() {
    crearFondo(this);
    this.puntos = 0;
    this.vidas = CONFIG.vidas;
    this.estrellas = 0;
    this.terminado = false;
    this.pausado = false;
    this.construyendo = false;
    this.invencible = false;
    this.escudoActivo = false;
    this.temporizadorEscudo = null;
    this.solar = null;
    this.casasHechas = 0;

    // El suelo es el borde de abajo del mundo: el dragón patina encima
    this.physics.world.setBounds(0, 0, CONFIG.ancho, SUELO_Y);

    // El dragón
    this.jugador = this.physics.add.image(150, SUELO_Y - 40, "dragon1").setDepth(5);
    this.jugador.setCollideWorldBounds(true);
    this.jugador.body.setSize(60, 62).setOffset(18, 28);
    this.jugador.body.setGravityY(CONFIG.gravedad);
    this.jugador.body.setMaxVelocity(1000, 500);
    this.burbuja = this.add.image(0, 0, "burbuja").setDepth(6).setVisible(false);
    this.tweens.add({ targets: this.burbuja, angle: 360, duration: 4000, repeat: -1 });

    // Grupos de obstáculos y objetos
    this.obstaculos = this.physics.add.group();
    this.objetos = this.physics.add.group();
    this.physics.add.overlap(this.jugador, this.obstaculos, (j, o) => this.tocarObstaculo(o));
    this.physics.add.overlap(this.jugador, this.objetos, (j, o) => this.cogerObjeto(o));

    // Llamaradas que escupe el dragón: rompen los obstáculos
    this.llamaradas = this.physics.add.group({ allowGravity: false });
    this.physics.add.overlap(this.llamaradas, this.obstaculos, (llama, o) => this.romperConFuego(llama, o));
    this.ultimaLlamarada = 0;

    // Partículas: explosión de chispas y estela de los patines
    this.chispas = this.add.particles(0, 0, "chispa", {
      speed: { min: 80, max: 260 },
      scale: { start: 1.4, end: 0 },
      lifespan: 600,
      emitting: false,
    }).setDepth(8);
    this.estelaPatin = this.add.particles(0, 0, "chispa", {
      speed: { min: 30, max: 90 },
      angle: { min: 160, max: 200 },
      scale: { start: 0.9, end: 0 },
      lifespan: 350,
      tint: [0xffd54f, 0xff7043, 0xffffff],
      emitting: false,
    }).setDepth(4);

    // Cada cierto tiempo salen obstáculos y objetos por la derecha
    this.time.addEvent({ delay: CONFIG.segundosEntreObstaculos * 1000, loop: true, callback: () => this.crearObstaculo() });
    this.time.addEvent({ delay: CONFIG.segundosEntreObjetos * 1000, loop: true, callback: () => this.crearObjeto() });

    // Marcador
    this.textoPuntos = this.add.text(20, 12, "", { ...estiloTexto(28), align: "left" }).setDepth(10);
    this.textoEstrellas = this.add.text(20, 50, "", { ...estiloTexto(28, "#ffd54f"), align: "left" }).setDepth(10);
    this.textoVidas = this.add.text(CONFIG.ancho - 20, 12, "", estiloTexto(28)).setOrigin(1, 0).setDepth(10);
    this.textoEscudo = this.add.text(CONFIG.ancho - 20, 52, "🛡️", estiloTexto(28)).setOrigin(1, 0).setDepth(10).setVisible(false);
    this.actualizarMarcador();

    this.teclas = this.input.keyboard.addKeys("UP,DOWN,LEFT,RIGHT,SPACE");
    this.input.keyboard.on("keydown-P", () => this.alternarPausa());
  }

  update(tiempo) {
    if (this.terminado || this.pausado || this.construyendo) return;

    const cuerpo = this.jugador.body;
    const enSuelo = cuerpo.blocked.down;

    // Moverse a los lados: patinando va más rápido
    const velocidad = enSuelo ? CONFIG.velocidadPatinar : CONFIG.velocidadVolar;
    if (this.teclas.LEFT.isDown) this.jugador.setVelocityX(-velocidad);
    else if (this.teclas.RIGHT.isDown) this.jugador.setVelocityX(velocidad);
    else this.jugador.setVelocityX(0);

    // Volar hacia arriba o bajar a patinar
    if (this.teclas.UP.isDown) this.jugador.setVelocityY(-CONFIG.fuerzaVuelo);
    else if (this.teclas.DOWN.isDown) this.jugador.setVelocityY(CONFIG.velocidadBajar);

    if (enSuelo) {
      // Patinando: ala quieta, recto y dejando chispas
      this.jugador.setTexture("dragon1");
      this.jugador.setAngle(0);
      this.estelaPatin.emitParticleAt(this.jugador.x - 30, this.jugador.y + 40);
    } else {
      // Volando: aletea y se inclina según suba o baje
      this.jugador.setTexture(Math.floor(tiempo / 120) % 2 === 0 ? "dragon1" : "dragon2");
      this.jugador.setAngle(Phaser.Math.Clamp(cuerpo.velocity.y / 25, -15, 15));
    }

    this.burbuja.setPosition(this.jugador.x, this.jugador.y);

    // Escupir fuego con Espacio
    if (this.teclas.SPACE.isDown && tiempo - this.ultimaLlamarada > CONFIG.segundosEntreLlamaradas * 1000) {
      this.ultimaLlamarada = tiempo;
      this.escupirFuego();
    }
    this.llamaradas.getChildren().forEach((l) => { if (l.x > CONFIG.ancho + 60) l.destroy(); });

    // La zona de tierra se para cuando llega a su sitio; la flecha la sigue
    if (this.solar) {
      if (this.solar.x <= CONFIG.posicionSolar) this.solar.setVelocityX(0);
      this.flecha.x = this.solar.x - 25 * this.solar.scaleX;
    }

    // Borra lo que se sale por la izquierda
    [this.obstaculos, this.objetos].forEach((grupo) =>
      grupo.getChildren().forEach((o) => { if (o.x < -100) o.destroy(); })
    );
  }

  crearObstaculo() {
    if (this.terminado || this.pausado || this.construyendo) return;
    // Cuando aparece la zona de tierra, solo vienen bolas de fuego
    const tipos = this.solar ? ["fuego"] : ["tierra", "pinchos", "fuego"];
    const tipo = Phaser.Utils.Array.GetRandom(tipos);
    const x = CONFIG.ancho + 60;

    if (tipo === "fuego") {
      const y = Phaser.Math.Between(110, SUELO_Y - 80);
      const fuego = this.obstaculos.create(x, y, "fuego");
      fuego.body.setCircle(16, 4, 4);
      fuego.setVelocityX(-(CONFIG.velocidadMundo + 80));
      this.tweens.add({ targets: fuego, y: y + 40, duration: 700, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      this.tweens.add({ targets: fuego, scaleY: 1.15, duration: 150, yoyo: true, repeat: -1 });
    } else {
      const obstaculo = this.obstaculos.create(x, SUELO_Y, tipo).setOrigin(0.5, 1);
      if (tipo === "tierra") obstaculo.body.setSize(64, 34).setOffset(8, 10);
      else obstaculo.body.setSize(64, 30).setOffset(4, 10);
      obstaculo.setVelocityX(-CONFIG.velocidadMundo);
    }
  }

  crearObjeto() {
    if (this.terminado || this.pausado || this.construyendo) return;
    let tipo = "estrella";
    const azar = Math.random();
    if (azar < CONFIG.probabilidadCorazon && this.vidas < CONFIG.vidasMaximas) tipo = "corazon";
    else if (azar > 1 - CONFIG.probabilidadEscudo) tipo = "escudo";
    // Con las 5 estrellas ya no salen más estrellas
    if (tipo === "estrella" && this.estrellas >= CONFIG.estrellasParaCasa) return;

    const y = Phaser.Math.Between(90, SUELO_Y - 40);
    const objeto = this.objetos.create(CONFIG.ancho + 40, y, tipo);
    objeto.tipo = tipo;
    objeto.setVelocityX(-CONFIG.velocidadMundo * 0.9);
    this.tweens.add({ targets: objeto, y: y - 14, duration: 600, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    if (tipo === "estrella") this.tweens.add({ targets: objeto, angle: 360, duration: 2500, repeat: -1 });
  }

  cogerObjeto(objeto) {
    const tipo = objeto.tipo;
    const x = objeto.x;
    const y = objeto.y;
    objeto.destroy();
    this.tweens.add({ targets: this.jugador, scale: { from: 1.2, to: 1 }, duration: 160 });

    if (tipo === "estrella") {
      this.estrellas += 1;
      this.puntos += CONFIG.puntosEstrella;
      this.explotar(x, y, CONFIG.colorEstrella, 16);
      SONIDOS.estrella(this);
      if (this.estrellas === CONFIG.estrellasParaCasa) this.aparecerSolar();
    } else if (tipo === "corazon") {
      this.vidas = Math.min(this.vidas + 1, CONFIG.vidasMaximas);
      this.explotar(x, y, 0xff4d6d, 16);
      this.aviso("+1 ❤️", "#ff8fa3", x, y);
      SONIDOS.corazon(this);
    } else if (tipo === "escudo") {
      this.explotar(x, y, 0x42a5f5, 16);
      this.ponerEscudo();
      SONIDOS.escudo(this);
    }
    this.actualizarMarcador();
  }

  // El dragón escupe una bola de fuego hacia delante
  escupirFuego() {
    const llama = this.llamaradas.create(this.jugador.x + 45, this.jugador.y - 22, "fuego");
    llama.setFlipX(true).setScale(0.7);
    llama.body.setCircle(16, 28, 4);
    llama.setVelocityX(CONFIG.velocidadLlamarada);
    this.tweens.add({ targets: llama, scaleY: 0.85, duration: 120, yoyo: true, repeat: -1 });
    SONIDOS.llamarada(this);
  }

  // Una llamarada choca con un obstáculo: ¡los dos se rompen!
  romperConFuego(llama, obstaculo) {
    this.explotar(obstaculo.x, obstaculo.y - 15, 0xff9800, 20);
    llama.destroy();
    obstaculo.destroy();
    this.puntos += CONFIG.puntosRomper;
    this.actualizarMarcador();
    SONIDOS.romper(this);
  }

  ponerEscudo() {
    this.escudoActivo = true;
    this.burbuja.setVisible(true).setAlpha(1);
    this.textoEscudo.setVisible(true);
    if (this.temporizadorEscudo) this.temporizadorEscudo.remove();
    if (this.parpadeoEscudo) this.parpadeoEscudo.remove();
    // Parpadea un poco antes de acabarse
    this.parpadeoEscudo = this.time.delayedCall((CONFIG.segundosEscudo - 1.5) * 1000, () => {
      this.tweens.add({ targets: this.burbuja, alpha: 0.2, duration: 150, yoyo: true, repeat: 4 });
    });
    this.temporizadorEscudo = this.time.delayedCall(CONFIG.segundosEscudo * 1000, () => {
      this.escudoActivo = false;
      this.burbuja.setVisible(false);
      this.textoEscudo.setVisible(false);
    });
  }

  tocarObstaculo(obstaculo) {
    if (this.terminado || this.construyendo) return;

    // Con escudo, ¡el obstáculo se rompe!
    if (this.escudoActivo) {
      this.explotar(obstaculo.x, obstaculo.y - 15, 0x81d4fa, 20);
      obstaculo.destroy();
      SONIDOS.romper(this);
      return;
    }
    if (this.invencible) return;

    this.explotar(obstaculo.x, obstaculo.y - 15, 0xff5722, 22);
    obstaculo.destroy();
    this.vidas -= 1;
    this.actualizarMarcador();
    SONIDOS.golpe(this);
    this.cameras.main.shake(250, 0.012);
    this.cameras.main.flash(150, 255, 80, 80);

    if (this.vidas <= 0) {
      this.terminar(false);
      return;
    }

    // Un ratito sin recibir daño, parpadeando
    this.invencible = true;
    this.tweens.add({ targets: this.jugador, alpha: 0.3, duration: 120, yoyo: true, repeat: Math.floor(CONFIG.segundosInvencible * 1000 / 240) });
    this.time.delayedCall(CONFIG.segundosInvencible * 1000, () => {
      this.invencible = false;
      this.jugador.setAlpha(1);
    });
  }

  // Aparece la zona de tierra donde se construye la siguiente casa
  aparecerSolar() {
    const escala = CONFIG.tamañoCasas[this.casasHechas];
    this.aviso(`¡Ya tienes ${CONFIG.estrellasParaCasa} ⭐!\n¡Ve a la zona de tierra! 🏠`, "#80ff9a", CONFIG.ancho / 2, 200);
    this.solar = this.physics.add.image(CONFIG.ancho + 200, SUELO_Y + 10, "solar").setOrigin(0.5, 1).setDepth(2).setScale(escala);
    this.solar.setVelocityX(-CONFIG.velocidadMundo);
    this.choqueSolar = this.physics.add.overlap(this.jugador, this.solar, () => this.construirCasa());

    this.flecha = this.add.text(this.solar.x - 25 * escala, SUELO_Y - 90, "⬇️", estiloTexto(40)).setOrigin(0.5).setDepth(3);
    this.tweens.add({ targets: this.flecha, y: SUELO_Y - 70, duration: 400, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  // ¡A construir una casa con las estrellas!
  construirCasa() {
    if (this.construyendo || this.terminado) return;
    this.construyendo = true;
    this.fondoParado = true;
    this.flecha.destroy();
    this.choqueSolar.destroy();
    this.solar.setVelocityX(0);
    this.solar.body.enable = false;

    const n = this.casasHechas;
    const escala = CONFIG.tamañoCasas[n];

    // Los obstáculos y objetos desaparecen
    [this.obstaculos, this.objetos, this.llamaradas].forEach((grupo) => {
      grupo.getChildren().forEach((o) => this.explotar(o.x, o.y, 0xffffff, 8));
      grupo.clear(true, true);
    });

    // El dragón se aparta y espera contento
    this.jugador.body.enable = false;
    this.jugador.setAngle(0).setAlpha(1).setTexture("dragon1");
    this.burbuja.setVisible(false);
    const cx = this.solar.x - 25 * escala;
    const base = SUELO_Y + 10 - 22 * escala;
    this.tweens.add({ targets: this.jugador, x: cx - 130 * escala - 50, y: SUELO_Y - 45, duration: 600, ease: "Sine.easeOut" });

    // La casa es un grupo de piezas (un "container") que podemos hacer más grande
    const casa = this.add.container(cx, base).setDepth(3).setScale(escala);

    // Cada estrella construye una planta de la casa
    const plantas = [
      [
        { textura: `casaBase${n}`, x: 0, y: 0, origenY: 1 },
        { textura: "casaPuerta", x: 20, y: 0, origenY: 1 },
        { textura: "casaVentana", x: -55, y: -36, origenY: 0.5 },
        { textura: "casaVentana", x: 50, y: -36, origenY: 0.5 },
      ],
      [
        { textura: `casaCubo${n}`, x: -15, y: -66, origenY: 1 },
      ],
    ];

    plantas.forEach((piezas, i) => {
      this.time.delayedCall(800 + i * 1000, () => {
        const estrella = this.add.image(this.jugador.x, this.jugador.y - 20, "estrella").setDepth(9);
        this.estrellas -= 1;
        this.actualizarMarcador();
        const destinoX = cx + piezas[0].x * escala;
        const destinoY = base + (piezas[0].y - 30) * escala;
        this.tweens.add({
          targets: estrella,
          x: destinoX,
          y: destinoY,
          angle: 360,
          duration: 450,
          ease: "Sine.easeInOut",
          onComplete: () => {
            estrella.destroy();
            this.explotar(destinoX, destinoY, CONFIG.colorEstrella, 22);
            SONIDOS.pieza(this, n + i);
            piezas.forEach((pieza, j) => {
              const trozo = this.add.image(pieza.x, pieza.y, pieza.textura).setOrigin(0.5, pieza.origenY).setScale(0);
              casa.add(trozo);
              this.tweens.add({ targets: trozo, scale: 1, delay: j * 120, duration: 350, ease: "Back.easeOut" });
            });
          },
        });
      });
    });

    // ¡Casa terminada!
    this.time.delayedCall(800 + plantas.length * 1000 + 300, () => {
      this.casasHechas += 1;
      this.puntos += CONFIG.puntosCasa;
      this.actualizarMarcador();
      SONIDOS.ganar(this);
      this.aviso(`¡CASA ${this.casasHechas} CONSTRUIDA!\n+${CONFIG.puntosCasa}`, "#ffd54f", 260, 120);
      this.tweens.add({ targets: this.jugador, y: SUELO_Y - 80, duration: 300, yoyo: true, repeat: 3, ease: "Sine.easeOut" });
      const colores = [0xffd54f, 0xff7043, 0x80ff9a, 0x81d4fa, 0xff4d6d];
      for (let i = 0; i < 6; i++) {
        this.time.delayedCall(i * 250, () =>
          this.explotar(Phaser.Math.Between(150, 650), Phaser.Math.Between(80, 250), Phaser.Utils.Array.GetRandom(colores), 30)
        );
      }

      if (this.casasHechas >= CONFIG.numeroCasas) {
        this.time.delayedCall(2800, () => this.terminar(true));
      } else {
        this.time.delayedCall(2600, () => this.seguirConstruyendo(casa));
      }
    });
  }

  // La casa se queda atrás y el dragón sigue buscando estrellas
  seguirConstruyendo(casa) {
    const solar = this.solar;
    this.solar = null;
    const distancia = casa.x + 300;
    const duracion = (distancia / CONFIG.velocidadMundo) * 1000;
    this.tweens.add({ targets: [casa, solar], x: `-=${distancia}`, duration: duracion, onComplete: () => { casa.destroy(); solar.destroy(); } });

    this.jugador.body.enable = true;
    this.jugador.body.reset(this.jugador.x, this.jugador.y);
    this.estrellas = 0;
    this.actualizarMarcador();
    this.construyendo = false;
    this.fondoParado = false;
    if (this.escudoActivo) this.burbuja.setVisible(true);
  }

  explotar(x, y, color, cuantas) {
    this.chispas.setParticleTint(color);
    this.chispas.explode(cuantas, x, y);
  }

  // Texto que aparece, sube y desaparece
  aviso(texto, color, x, y) {
    const t = this.add.text(x, y, texto, estiloTexto(34, color)).setOrigin(0.5).setDepth(15).setScale(0);
    this.tweens.add({ targets: t, scale: 1, duration: 300, ease: "Back.easeOut" });
    this.tweens.add({ targets: t, y: y - 40, alpha: 0, delay: 1600, duration: 600, onComplete: () => t.destroy() });
  }

  actualizarMarcador() {
    this.textoPuntos.setText(`Puntos: ${this.puntos}`);
    this.textoEstrellas.setText(`⭐ ${this.estrellas}/${CONFIG.estrellasParaCasa}   🏠 ${this.casasHechas}/${CONFIG.numeroCasas}`);
    this.textoVidas.setText("❤️".repeat(Math.max(this.vidas, 0)));
  }

  alternarPausa() {
    if (this.terminado || this.construyendo) return;
    this.pausado = !this.pausado;
    this.fondoParado = this.pausado;
    if (this.pausado) {
      this.physics.pause();
      this.tweens.pauseAll();
      this.time.paused = true;
      this.cartelPausa = this.add.text(CONFIG.ancho / 2, CONFIG.alto / 2, "PAUSA\n(pulsa P)", estiloTexto(56)).setOrigin(0.5).setDepth(20);
    } else {
      this.physics.resume();
      this.tweens.resumeAll();
      this.time.paused = false;
      this.cartelPausa.destroy();
    }
  }

  terminar(gano) {
    this.terminado = true;
    this.fondoParado = true;
    this.physics.pause();
    if (!gano) SONIDOS.perder(this);
    this.time.delayedCall(gano ? 0 : 900, () => this.scene.start("Fin", { puntos: this.puntos, gano }));
  }
}

// ===== Pantalla final =====
class Fin extends Phaser.Scene {
  constructor() { super("Fin"); }
  create(datos) {
    crearFondo(this);
    const centro = CONFIG.ancho / 2;

    const mensaje = datos.gano ? "¡HAS GANADO! 🏠" : "¡Fin del juego!";
    const titulo = this.add.text(centro, 150, mensaje, estiloTexto(66, datos.gano ? "#ffd54f" : "#ef5350")).setOrigin(0.5).setScale(0);
    this.tweens.add({ targets: titulo, scale: 1, duration: 500, ease: "Back.easeOut" });

    const dragon = this.add.image(centro, 280, "dragon1").setScale(1.5);
    this.tweens.add({ targets: dragon, y: datos.gano ? 250 : 290, duration: datos.gano ? 350 : 1200, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    this.add.text(centro, 380, `Puntos: ${datos.puntos}`, estiloTexto(40)).setOrigin(0.5);

    const otra = this.add.text(centro, 470, "Pulsa ENTER para jugar otra vez", estiloTexto(30, "#80ff9a")).setOrigin(0.5);
    this.tweens.add({ targets: otra, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });
    this.input.keyboard.once("keydown-ENTER", () => this.scene.start("Juego"));
  }
}

// ===== Arrancar Phaser =====
const juego = new Phaser.Game({
  type: Phaser.AUTO,
  width: CONFIG.ancho,
  height: CONFIG.alto,
  physics: { default: "arcade" },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [Preparar, Inicio, Juego, Fin],
});
