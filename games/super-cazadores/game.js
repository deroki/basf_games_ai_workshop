// ===== Ajustes del juego: ¡prueba a cambiar estos números! =====
const CONFIG = {
  ancho: 960,
  alto: 540,
  suelo: 470,            // altura del suelo (donde pisa la cazadora)
  gravedad: 1500,

  // Cazadora
  vidas: 10,
  velocidadCazadora: 270,
  saltoCazadora: 620,
  multiplicadorMoto: 1.5,        // cuánto más rápida va con la moto
  segundosEntreDisparos: 0.35,
  velocidadFlecha: 760,
  danoFlecha: 1,
  segundosVoltereta: 0.45,
  segundosEntreVolteretas: 0.8,
  segundosInvulnerable: 1.2,     // tiempo sin recibir daño tras un golpe
  segundosEscudo: 6,
  probabilidadEscudo: 0.12,      // posibilidad de que un animal suelte un escudo

  // Niveles
  nivelFinal: 10,                // ¡al llegar a este nivel ganas!
  animalesPorNivel: 8,
  segundosEntreAnimales: 2.4,    // al empezar... y baja con cada nivel
  segundosEntreAnimalesMinimo: 0.7,
  bajadaPorNivel: 0.18,
  animalesMaximosBase: 2,        // y +1 con cada nivel
  velocidadExtraPorNivel: 0.07,  // 7% más rápidos en cada nivel

  // Animales: vida (flechas que aguantan), velocidad y puntos
  animales: {
    zorro:    { vida: 1, velocidad: 150, puntos: 4 },
    lobo:     { vida: 2, velocidad: 165, puntos: 5 },
    leopardo: { vida: 2, velocidad: 235, puntos: 5 },
    pantera:  { vida: 3, velocidad: 125, puntos: 6 },
  },

  // Casas
  monedasPorCasa: 5,
  golpesPorCasa: 3,
  segundosReaparecerCasa: 8,

  // Casas de lujo con LEDs (tecla C): refugio donde no te atacan
  precioCasaLujo: 15,
  maxCasasLujo: 3,
  segundosParaAvanzar: 5,        // descansando dentro tanto tiempo...
  progresoPorDescanso: 1,        // ...cuenta como cazar este número de animales

  // Tienda
  precios: { espada: 30, pocion: 10, arco: 25, moto: 50 },
  vidasPocion: 3,
  mejorasArcoMaximas: 2,
};

const ANCHO = CONFIG.ancho;
const ALTO = CONFIG.alto;
const SUELO = CONFIG.suelo;

// ===== Texturas: dibujamos los gráficos con código (no hacen falta imágenes) =====
function crearTexturas(escena) {
  const g = escena.make.graphics({ x: 0, y: 0, add: false });

  // Cielo con degradado
  const cielo = escena.textures.createCanvas("fondo", ANCHO, ALTO);
  const degradado = cielo.context.createLinearGradient(0, 0, 0, SUELO);
  degradado.addColorStop(0, "#4aa8e8");
  degradado.addColorStop(1, "#d8f1ff");
  cielo.context.fillStyle = degradado;
  cielo.context.fillRect(0, 0, ANCHO, ALTO);
  cielo.refresh();

  // Chispas
  g.fillStyle(0xffffff, 1);
  g.fillCircle(3, 3, 2);
  g.generateTexture("brillo", 6, 6);
  g.clear();

  // Sol
  g.fillStyle(0xfff59d, 0.35);
  g.fillCircle(60, 60, 58);
  g.fillStyle(0xfff176, 0.6);
  g.fillCircle(60, 60, 44);
  g.fillStyle(0xffeb3b, 1);
  g.fillCircle(60, 60, 32);
  g.generateTexture("sol", 120, 120);
  g.clear();

  // Nube
  g.fillStyle(0xffffff, 0.95);
  g.fillCircle(30, 38, 20);
  g.fillCircle(58, 28, 26);
  g.fillCircle(90, 36, 22);
  g.fillCircle(112, 42, 15);
  g.fillRoundedRect(14, 38, 108, 20, 10);
  g.generateTexture("nube", 130, 66);
  g.clear();

  // Montañas del fondo
  const picos = [
    { cx: 100, h: 170, w: 320 }, { cx: 370, h: 215, w: 380 },
    { cx: 650, h: 160, w: 320 }, { cx: 890, h: 200, w: 360 },
  ];
  picos.forEach((p) => {
    g.fillStyle(0x8fb3d9, 1);
    g.fillTriangle(p.cx - p.w / 2, 230, p.cx, 230 - p.h, p.cx + p.w / 2, 230);
    g.fillStyle(0x7499c4, 1);
    g.fillTriangle(p.cx, 230 - p.h, p.cx + p.w / 2, 230, p.cx + 20, 230);
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(p.cx - p.w * 0.12, 230 - p.h * 0.76, p.cx, 230 - p.h, p.cx + p.w * 0.12, 230 - p.h * 0.76);
  });
  g.generateTexture("montanas", ANCHO, 230);
  g.clear();

  // Ciudad rodeada de bosque
  const hileraArboles = (colorTronco, colorCopa, altura, paso, desfase) => {
    for (let x = -10 + desfase; x < ANCHO + 20; x += paso) {
      const h = altura + Math.sin(x * 0.09) * 18;
      g.fillStyle(colorTronco, 1);
      g.fillRect(x + paso / 2 - 3, 200 - 18, 6, 18);
      g.fillStyle(colorCopa, 1);
      g.fillTriangle(x, 200 - 14, x + paso / 2, 200 - h, x + paso, 200 - 14);
      g.fillTriangle(x + 3, 200 - 14 - h * 0.35, x + paso / 2, 200 - h - 14, x + paso - 3, 200 - 14 - h * 0.35);
    }
  };
  hileraArboles(0x4e342e, 0x1f6b3b, 150, 34, 0);
  const edificios = [
    { x: 290, w: 50, h: 110 }, { x: 340, w: 44, h: 150 }, { x: 384, w: 60, h: 90 },
    { x: 444, w: 52, h: 175 }, { x: 496, w: 46, h: 125 }, { x: 542, w: 58, h: 145 }, { x: 600, w: 70, h: 100 },
  ];
  edificios.forEach((e, i) => {
    g.fillStyle(i % 2 ? 0x9aa5b8 : 0x8793aa, 1);
    g.fillRect(e.x, 200 - e.h, e.w, e.h);
    g.fillStyle(0xfff59d, 1);
    for (let y = 200 - e.h + 10; y < 180; y += 18) {
      for (let x = e.x + 8; x < e.x + e.w - 8; x += 14) g.fillRect(x, y, 7, 9);
    }
  });
  // Árboles delanteros solo a los lados para que se vea la ciudad en el centro
  for (let x = -6; x < ANCHO + 10; x += 38) {
    if (x > 270 && x < 690) continue;
    const h = 120 + Math.sin(x * 0.13) * 18;
    g.fillStyle(0x5d4037, 1);
    g.fillRect(x + 16, 200 - 20, 6, 20);
    g.fillStyle(0x2e8b57, 1);
    g.fillTriangle(x, 200 - 16, x + 19, 200 - h, x + 38, 200 - 16);
    g.fillTriangle(x + 4, 200 - 16 - h * 0.35, x + 19, 200 - h - 14, x + 34, 200 - 16 - h * 0.35);
  }
  g.generateTexture("ciudad", ANCHO, 200);
  g.clear();

  // Suelo: hierba, tierra y acera de la ciudad
  g.fillStyle(0x6d4c41, 1);
  g.fillRect(0, 0, ANCHO, 80);
  g.fillStyle(0x5a3e35, 1);
  for (let x = 0; x < ANCHO; x += 46) g.fillRect(x, 34 + ((x / 46) % 3) * 12, 20, 5);
  g.fillStyle(0x5cb85c, 1);
  g.fillRect(0, 0, ANCHO, 16);
  g.fillStyle(0x7bd36b, 1);
  for (let x = 0; x < ANCHO; x += 14) g.fillTriangle(x, 0, x + 7, -0, x + 3, 8);
  g.fillStyle(0xb0b6bf, 1);
  g.fillRect(270, 0, 420, 12);
  g.fillStyle(0x8d949e, 1);
  g.fillRect(270, 12, 420, 3);
  g.generateTexture("suelo", ANCHO, 80);
  g.clear();

  // Casas (tres colores de tejado)
  [0xd9534f, 0x4a7fd1, 0x8e5fc4].forEach((tejado, i) => {
    g.fillStyle(0x8d6e63, 1);
    g.fillRect(96, 14, 14, 30);
    g.fillStyle(0xffe0b2, 1);
    g.fillRect(12, 52, 106, 66);
    g.lineStyle(3, 0x8d6e63, 1);
    g.strokeRect(12, 52, 106, 66);
    g.fillStyle(tejado, 1);
    g.fillTriangle(0, 58, 65, 4, 130, 58);
    g.lineStyle(3, 0x4e342e, 0.7);
    g.strokeTriangle(0, 58, 65, 4, 130, 58);
    g.fillStyle(0x6d4c41, 1);
    g.fillRoundedRect(52, 78, 26, 40, 4);
    g.fillStyle(0xffd54f, 1);
    g.fillCircle(72, 100, 2.5);
    g.fillStyle(0x81d4fa, 1);
    g.fillRect(22, 68, 22, 22);
    g.fillRect(86, 68, 22, 22);
    g.lineStyle(2, 0x5d4037, 1);
    g.strokeRect(22, 68, 22, 22);
    g.strokeRect(86, 68, 22, 22);
    g.lineBetween(33, 68, 33, 90);
    g.lineBetween(22, 79, 44, 79);
    g.lineBetween(97, 68, 97, 90);
    g.lineBetween(86, 79, 108, 79);
    g.generateTexture("casa" + i, 130, 120);
    g.clear();
  });

  // Casa de lujo moderna + sus luces LED (se pintan aparte para poder cambiarles el color)
  g.fillStyle(0xeceff1, 1);
  g.fillRect(10, 40, 130, 88);
  g.fillRect(30, 14, 90, 30);
  g.fillStyle(0x90a4ae, 1);
  g.fillRect(10, 118, 130, 10);
  g.fillStyle(0x37474f, 1);
  g.fillRect(4, 36, 142, 8);
  g.fillRect(24, 8, 102, 7);
  g.fillStyle(0x4dd0e1, 1);
  g.fillRect(20, 56, 40, 42);
  g.fillRect(90, 56, 40, 42);
  g.fillRect(44, 20, 62, 15);
  g.fillStyle(0xffffff, 0.55);
  g.fillTriangle(22, 58, 40, 58, 22, 80);
  g.fillTriangle(92, 58, 110, 58, 92, 80);
  g.fillStyle(0x263238, 1);
  g.fillRect(64, 70, 22, 58);
  g.fillStyle(0xffd54f, 1);
  g.fillCircle(81, 100, 2.5);
  g.fillStyle(0x2e8b57, 1);
  g.fillCircle(12, 122, 8);
  g.fillCircle(138, 122, 8);
  g.generateTexture("casaLujo", 150, 130);
  g.clear();
  g.lineStyle(4, 0xffffff, 1);
  g.lineBetween(4, 46, 146, 46);
  g.lineBetween(24, 17, 126, 17);
  g.strokeRect(18, 54, 44, 46);
  g.strokeRect(88, 54, 44, 46);
  g.strokeRect(62, 68, 26, 60);
  g.fillStyle(0xffffff, 1);
  for (let x = 14; x < 140; x += 14) g.fillCircle(x, 127, 2.5);
  g.generateTexture("ledsLujo", 150, 130);
  g.clear();

  // Puesto de la tienda
  g.fillStyle(0x8d6e63, 1);
  g.fillRect(10, 40, 8, 90);
  g.fillRect(152, 40, 8, 90);
  g.fillStyle(0xa1887f, 1);
  g.fillRoundedRect(8, 92, 154, 38, 6);
  g.fillStyle(0x795548, 1);
  g.fillRect(8, 92, 154, 6);
  for (let i = 0; i < 8; i++) {
    g.fillStyle(i % 2 ? 0xffffff : 0xe53935, 1);
    g.fillRect(i * 21, 18, 21, 28);
    g.fillCircle(i * 21 + 10.5, 46, 10.5);
  }
  g.fillStyle(0x7e57c2, 1);
  g.fillRoundedRect(30, 72, 12, 20, 4);
  g.fillStyle(0xe91e63, 1);
  g.fillRoundedRect(48, 74, 12, 18, 4);
  g.fillStyle(0xcfd8dc, 1);
  g.fillRect(100, 60, 5, 32);
  g.fillStyle(0x6d4c41, 1);
  g.fillRect(94, 84, 17, 5);
  g.lineStyle(4, 0x558b2f, 1);
  g.beginPath();
  g.arc(130, 78, 18, -1.1, 1.1);
  g.strokePath();
  g.generateTexture("tienda", 170, 132);
  g.clear();

  // Personas de la ciudad
  const persona = (nombre, ropa, pelo, extra) => {
    g.fillStyle(0x37474f, 1);
    g.fillRoundedRect(11, 46, 8, 22, 3);
    g.fillRoundedRect(21, 46, 8, 22, 3);
    g.fillStyle(ropa, 1);
    g.fillRoundedRect(7, 22, 26, 30, 9);
    if (extra === "delantal") {
      g.fillStyle(0xffffff, 1);
      g.fillRoundedRect(12, 30, 16, 22, 4);
    }
    g.fillStyle(0xffd7b5, 1);
    g.fillCircle(20, 14, 11);
    g.fillStyle(pelo, 1);
    if (extra === "sombrero") {
      g.fillRoundedRect(7, 2, 26, 8, 4);
      g.fillRect(3, 8, 34, 4);
    } else {
      g.fillEllipse(20, 6, 26, 12);
      g.fillEllipse(9, 16, 7, 14);
      g.fillEllipse(31, 16, 7, 14);
    }
    g.fillStyle(0x222222, 1);
    g.fillCircle(16, 15, 1.7);
    g.fillCircle(25, 15, 1.7);
    g.lineStyle(2, 0xc0504d, 1);
    g.beginPath();
    g.arc(20.5, 19, 3.5, 0.2, Math.PI - 0.2);
    g.strokePath();
    g.generateTexture(nombre, 40, 70);
    g.clear();
  };
  persona("npcTendero", 0x6d4c41, 0x4e342e, "delantal");
  persona("npcVecino", 0x3f51b5, 0x3e2723, "sombrero");
  persona("npcVecina", 0xe91e63, 0xbf360c, "pelo");

  // Moto
  g.fillStyle(0x263238, 1);
  g.fillCircle(18, 28, 12);
  g.fillCircle(72, 28, 12);
  g.fillStyle(0xcfd8dc, 1);
  g.fillCircle(18, 28, 6);
  g.fillCircle(72, 28, 6);
  g.fillStyle(0xe53935, 1);
  g.fillRoundedRect(20, 10, 48, 14, 6);
  g.fillTriangle(60, 10, 76, 22, 60, 24);
  g.fillStyle(0x212121, 1);
  g.fillRoundedRect(24, 6, 22, 7, 3);
  g.lineStyle(4, 0x455a64, 1);
  g.lineBetween(68, 14, 76, 4);
  g.lineBetween(76, 4, 84, 4);
  g.fillStyle(0xfff176, 1);
  g.fillCircle(80, 14, 4);
  g.generateTexture("moto", 92, 42);
  g.clear();

  // Flecha
  g.fillStyle(0x8d6e63, 1);
  g.fillRect(6, 3, 24, 2);
  g.fillStyle(0xcfd8dc, 1);
  g.fillTriangle(30, 0, 38, 4, 30, 8);
  g.fillStyle(0x7cb342, 1);
  g.fillTriangle(0, 0, 9, 3, 3, 4);
  g.fillTriangle(0, 8, 9, 5, 3, 4);
  g.generateTexture("flecha", 38, 8);
  g.clear();

  // Escudo (objeto) y burbuja protectora
  g.fillStyle(0x4fc3f7, 1);
  g.fillRoundedRect(4, 2, 30, 26, 8);
  g.fillTriangle(4, 22, 34, 22, 19, 42);
  g.lineStyle(3, 0xffffff, 1);
  g.strokeRoundedRect(4, 2, 30, 26, 8);
  g.fillStyle(0xffffff, 0.9);
  g.fillRect(17, 8, 4, 18);
  g.fillRect(11, 14, 16, 4);
  g.generateTexture("escudo", 38, 44);
  g.clear();
  g.fillStyle(0x4fc3f7, 0.25);
  g.fillCircle(60, 60, 58);
  g.lineStyle(4, 0xb3e5fc, 0.9);
  g.strokeCircle(60, 60, 58);
  g.generateTexture("burbuja", 120, 120);
  g.clear();

  // Tajo de la espada
  g.lineStyle(8, 0xffffff, 0.95);
  g.beginPath();
  g.arc(10, 40, 50, -0.8, 0.8);
  g.strokePath();
  g.generateTexture("tajo", 70, 80);
  g.clear();

  dibujarCazadora(g);
  dibujarAnimales(g);
  g.destroy();
}

// La exploradora (dibujo del equipo): pelo rubio muy rizado, chaqueta verde militar abierta,
// cinturón con hebilla redonda, pantalón corto con rodilleras, botas altas y arco (mira a la derecha)
function dibujarCazadora(g) {
  const cx = 42;
  // Pelo de atrás: una melena grande de rizos
  g.fillStyle(0xdba93c, 1);
  g.fillRoundedRect(cx - 20, 18, 40, 38, 14);
  for (let i = 0; i < 12; i++) {
    const y = 20 + i * 4.5;
    g.fillCircle(cx - 21 + (i % 2) * 3, y, 7);
    g.fillCircle(cx + 21 - (i % 2) * 3, y, 7);
  }
  // Carcaj con flechas
  g.fillStyle(0x6d4c41, 1);
  g.fillRoundedRect(cx - 25, 42, 9, 26, 3);
  g.fillStyle(0xcfd8dc, 1);
  g.fillTriangle(cx - 24, 42, cx - 21, 33, cx - 18, 42);
  // Piernas, rodilleras y botas altas
  g.fillStyle(0xffd7b5, 1);
  g.fillRoundedRect(cx - 11, 64, 10, 14, 3);
  g.fillRoundedRect(cx + 1, 64, 10, 14, 3);
  g.fillStyle(0x3a4a22, 1);
  g.fillRoundedRect(cx - 12, 74, 12, 5, 2);
  g.fillRoundedRect(cx + 1, 74, 12, 5, 2);
  g.fillStyle(0x2b2118, 1);
  g.fillRoundedRect(cx - 11, 78, 10, 14, 3);
  g.fillRoundedRect(cx + 1, 78, 10, 14, 3);
  g.fillRoundedRect(cx - 12, 87, 13, 5, 2);
  g.fillRoundedRect(cx + 1, 87, 15, 5, 2);
  // Pantalón corto, camiseta clara y cinturón con hebilla redonda
  g.fillStyle(0x4b5a2a, 1);
  g.fillRoundedRect(cx - 13, 58, 26, 20, 4);
  g.fillStyle(0xf1e6c8, 1);
  g.fillRoundedRect(cx - 9, 42, 18, 20, 5);
  g.fillStyle(0x3a2f1d, 1);
  g.fillRect(cx - 13, 58, 26, 4);
  g.lineStyle(2, 0xffd54f, 1);
  g.strokeCircle(cx, 60, 2.5);
  // Chaqueta verde militar abierta (dos mitades)
  g.fillStyle(0x556b2f, 1);
  g.fillRoundedRect(cx - 14, 42, 8, 18, 3);
  g.fillRoundedRect(cx + 6, 42, 8, 18, 3);
  // Cabeza
  g.fillStyle(0xffd7b5, 1);
  g.fillCircle(cx, 28, 14);
  // Pelo de delante: rizos por todas partes
  g.fillStyle(0xf2c94c, 1);
  for (let i = 0; i < 9; i++) {
    const ang = Math.PI * (1 + i / 8);
    g.fillCircle(cx + Math.cos(ang) * 14, 24 + Math.sin(ang) * 13, 6.5);
  }
  [[-15, 30], [-16, 38], [-13, 46], [15, 32], [16, 40], [-9, 8], [8, 7]].forEach(([dx, y]) => g.fillCircle(cx + dx, y, 6));
  // Ojos turquesa
  g.fillStyle(0xffffff, 1);
  g.fillEllipse(cx - 5, 29, 9, 10);
  g.fillEllipse(cx + 7, 29, 9, 10);
  g.fillStyle(0x30d5c8, 1);
  g.fillCircle(cx - 4, 29, 3.6);
  g.fillCircle(cx + 8, 29, 3.6);
  g.fillStyle(0x0b2b2b, 1);
  g.fillCircle(cx - 4, 29, 1.7);
  g.fillCircle(cx + 8, 29, 1.7);
  g.lineStyle(2, 0xc0504d, 1);
  g.beginPath();
  g.arc(cx + 2, 36, 4, 0.2, Math.PI - 0.2);
  g.strokePath();
  // Brazo estirado con el arco
  g.fillStyle(0x556b2f, 1);
  g.fillRoundedRect(cx + 6, 47, 24, 9, 4);
  g.fillStyle(0xffd7b5, 1);
  g.fillCircle(cx + 31, 51, 4.5);
  g.lineStyle(5, 0x4b5a2a, 1);
  g.beginPath();
  g.arc(cx + 8, 51, 26, -1.0, 1.0);
  g.strokePath();
  g.lineStyle(1.5, 0xf5f5f5, 1);
  g.lineBetween(cx + 22, 51 - 26 * Math.sin(1.0), cx + 22, 51 + 26 * Math.sin(1.0));
  g.generateTexture("cazadora", 84, 92);
  g.clear();
}

// Los cuatro animales (miran a la derecha; el juego los gira solo)
function dibujarAnimales(g) {
  const fiera = (nombre, c) => {
    g.fillStyle(c.oscuro, 1);
    [18, 29, 46, 57].forEach((x) => g.fillRoundedRect(x, 32, 7, 14, 3));
    g.fillStyle(c.cola, 1);
    g.fillEllipse(8, 22, c.colaGrande ? 26 : 22, c.colaGrande ? 14 : 8);
    if (c.puntaCola) {
      g.fillStyle(c.puntaCola, 1);
      g.fillCircle(3, 22, 5);
    }
    g.fillStyle(c.cuerpo, 1);
    g.fillEllipse(34, 26, 46, 24);
    g.fillStyle(c.vientre, 1);
    g.fillEllipse(36, 33, 32, 9);
    if (c.manchas) {
      g.fillStyle(c.manchas, 1);
      [[22, 20], [32, 17], [42, 21], [28, 26], [38, 26], [18, 27]].forEach(([x, y]) => g.fillCircle(x, y, 3));
    }
    g.fillStyle(c.cuerpo, 1);
    g.fillEllipse(57, 20, 24, 21);
    g.fillTriangle(50, 12, 54, 0, 60, 10);
    g.fillTriangle(59, 10, 65, 1, 68, 13);
    g.fillStyle(c.oscuro, 1);
    g.fillTriangle(53, 10, 55, 4, 58, 10);
    g.fillStyle(c.vientre, 1);
    g.fillEllipse(65, 25, 14, 10);
    g.fillStyle(0x111111, 1);
    g.fillCircle(70, 23, 2.5);
    g.fillStyle(c.ojo, 1);
    g.fillCircle(61, 17, 3.4);
    g.fillStyle(0x000000, 1);
    g.fillCircle(62, 17, 1.6);
    g.lineStyle(2, 0x111111, 1);
    g.lineBetween(57, 12, 65, 15);
    g.generateTexture("animal_" + nombre, 72, 48);
    g.clear();
  };
  fiera("lobo", { cuerpo: 0x8a929c, oscuro: 0x5f6670, vientre: 0xd3d8de, cola: 0x7b838d, ojo: 0xffd54f });
  fiera("zorro", { cuerpo: 0xf08a24, oscuro: 0x7a3d12, vientre: 0xfff3e0, cola: 0xf08a24, puntaCola: 0xffffff, colaGrande: true, ojo: 0xffffff });
  fiera("leopardo", { cuerpo: 0xf2c14e, oscuro: 0xb07a1c, vientre: 0xfff0c2, cola: 0xf2c14e, manchas: 0x5a3b0b, ojo: 0x76ff03 });
  fiera("pantera", { cuerpo: 0x2b2b35, oscuro: 0x14141a, vientre: 0x3d3d4d, cola: 0x2b2b35, ojo: 0xffeb3b });
}

// Texto bonito con borde y sombra
function estiloTexto(tamaño, color = "#ffffff") {
  return {
    fontFamily: "Trebuchet MS, Verdana, sans-serif",
    fontSize: `${tamaño}px`,
    fontStyle: "bold",
    color,
    stroke: "#1a2e1f",
    strokeThickness: Math.max(3, tamaño / 8),
    shadow: { offsetX: 0, offsetY: 3, color: "#000000", blur: 6, fill: true },
  };
}

// Escenario común: cielo, sol, nubes, montañas, ciudad con bosque y suelo
function crearFondo(escena) {
  escena.add.image(0, 0, "fondo").setOrigin(0).setDepth(0);
  const sol = escena.add.image(840, 90, "sol").setDepth(1);
  escena.tweens.add({ targets: sol, scale: 1.08, duration: 2500, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

  [[70, 60, 55000], [350, 130, 70000], [620, 40, 62000], [900, 110, 80000]].forEach(([x, y, duracion], i) => {
    const nube = escena.add.image(x, y, "nube").setDepth(1).setAlpha(0.9).setScale(0.8 + (i % 3) * 0.25);
    escena.tweens.add({
      targets: nube, x: ANCHO + 160, duration: duracion * ((ANCHO + 160 - x) / (ANCHO + 160)), onComplete: () => {
        nube.x = -160;
        escena.tweens.add({ targets: nube, x: ANCHO + 160, duration: duracion, repeat: -1 });
      },
    });
  });

  escena.add.image(0, SUELO - 10, "montanas").setOrigin(0, 1).setDepth(2);
  escena.add.image(0, SUELO - 4, "ciudad").setOrigin(0, 1).setDepth(3);
  escena.add.image(0, SUELO - 10, "suelo").setOrigin(0, 0).setDepth(4);

  // Motitas de polen que flotan
  escena.add.particles(0, 0, "brillo", {
    x: { min: 0, max: ANCHO },
    y: { min: 120, max: SUELO - 20 },
    lifespan: 5000,
    speedX: { min: -30, max: -8 },
    speedY: { min: -10, max: 10 },
    scale: { min: 0.3, max: 0.8 },
    alpha: { start: 0.8, end: 0 },
    tint: 0xfff9c4,
    frequency: 250,
  }).setDepth(5);
}

// ===== Música de fondo con Web Audio (sin archivos de sonido) =====
const Musica = {
  ctx: null,
  maestro: null,
  timer: null,
  paso: 0,
  silencio: false,
  melodia: [69, 0, 67, 0, 64, 0, 67, 0, 62, 0, 64, 0, 60, 0, 0, 0, 69, 0, 67, 0, 64, 0, 62, 0, 64, 0, 60, 0, 57, 0, 0, 0],
  bajo: [45, 45, 41, 41, 43, 43, 40, 40],
  iniciar(escena) {
    const ctx = escena.sound && escena.sound.context;
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    if (this.timer) return;
    this.ctx = ctx;
    this.maestro = ctx.createGain();
    this.maestro.gain.value = this.silencio ? 0 : 0.13;
    this.maestro.connect(ctx.destination);
    this.timer = setInterval(() => this.tocarPaso(), 230);
  },
  alternar() {
    this.silencio = !this.silencio;
    if (this.maestro) this.maestro.gain.value = this.silencio ? 0 : 0.13;
  },
  nota(midi, duracion, tipo, volumen) {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = tipo;
    osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    amp.gain.setValueAtTime(0, t);
    amp.gain.linearRampToValueAtTime(volumen, t + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.001, t + duracion);
    osc.connect(amp);
    amp.connect(this.maestro);
    osc.start(t);
    osc.stop(t + duracion + 0.05);
  },
  tocarPaso() {
    if (!this.ctx || this.ctx.state !== "running") return;
    const p = this.paso % this.melodia.length;
    if (this.melodia[p]) this.nota(this.melodia[p], 0.35, "triangle", 0.7);
    if (p % 4 === 0) this.nota(this.bajo[(p / 4) % this.bajo.length], 0.8, "sine", 0.9);
    if (p % 2 === 0) this.nota(96, 0.06, "square", 0.08);
    this.paso++;
  },
};

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
    const centro = ANCHO / 2;

    const panel = this.add.graphics().setDepth(6);
    panel.fillStyle(0x0d2418, 0.55);
    panel.fillRoundedRect(centro - 400, 40, 800, 440, 24);

    const titulo = this.add.text(centro, 100, "🏹 Súper Cazadores 🏹", estiloTexto(60, "#ffd54f")).setOrigin(0.5).setDepth(7);
    this.tweens.add({ targets: titulo, y: 118, duration: 1200, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    const heroina = this.add.image(centro, 300, "cazadora").setScale(1.5).setDepth(7);
    this.tweens.add({ targets: heroina, y: 286, duration: 600, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    [["zorro", -300], ["lobo", -190], ["leopardo", 190], ["pantera", 300]].forEach(([animal, dx], i) => {
      const a = this.add.image(centro + dx, 330, "animal_" + animal).setScale(1.3).setFlipX(dx > 0).setDepth(7);
      this.tweens.add({ targets: a, y: 316, duration: 500 + i * 90, yoyo: true, repeat: -1, ease: "Sine.easeOut" });
    });

    const linea = (y, texto, tamaño = 20, color = "#ffffff") =>
      this.add.text(centro, y, texto, { ...estiloTexto(tamaño, color), align: "center" }).setOrigin(0.5).setDepth(7);
    linea(392, "⬅️➡️ mover · ⬆️ saltar · ⬇️ agacharse · ESPACIO disparar", 20);
    linea(420, "SHIFT voltereta · E hablar · T tienda · X espada · C casa de lujo · P pausa · M música", 18);
    linea(449, `¡Caza animales y sube hasta el nivel ${CONFIG.nivelFinal}!`, 22, "#a5d6a7");
    const empezar = linea(505, "Pulsa ENTER para empezar", 30, "#80ff9a");
    this.tweens.add({ targets: empezar, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

    this.input.keyboard.once("keydown-ENTER", () => {
      Musica.iniciar(this);
      this.scene.start("Juego");
    });
  }
}

// ===== El juego =====
class Juego extends Phaser.Scene {
  constructor() { super("Juego"); }

  create() {
    Musica.iniciar(this);
    this.physics.world.gravity.y = CONFIG.gravedad;
    this.physics.world.setBounds(-200, 0, ANCHO + 400, SUELO);
    crearFondo(this);

    // Estado de la partida
    this.reloj = 0;
    this.puntos = 0;
    this.monedas = 0;
    this.vidas = CONFIG.vidas;
    this.nivel = 1;
    this.cazados = 0;
    this.terminado = false;
    this.pausaActiva = false;
    this.enTienda = false;
    this.parado = false;
    this.mirando = 1;
    this.proxDisparo = 0;
    this.proxVoltereta = 0;
    this.rodandoHasta = 0;
    this.invulnerableHasta = 0;
    this.aturdidoHasta = 0;
    this.escudoHasta = 0;
    this.tiempoAnimal = 1.5;
    this.tieneEspada = false;
    this.tieneMoto = false;
    this.mejorasArco = 0;
    this.proxEspada = 0;
    this.lujos = [];
    this.enRefugio = false;
    this.descanso = 0;

    this.crearCiudad();
    this.barraLujo = this.add.graphics().setDepth(31);

    // Cazadora (el cuerpo es más estrecho que el dibujo)
    this.motoImg = this.add.image(0, 0, "moto").setOrigin(0.5, 1).setDepth(11).setVisible(false);
    this.jugadora = this.physics.add.sprite(ANCHO / 2, SUELO, "cazadora").setOrigin(0.5, 1).setDepth(12);
    this.jugadora.setCollideWorldBounds(true);
    this.jugadora.body.setSize(26, 84).setOffset(29, 8);
    this.burbuja = this.add.image(0, 0, "burbuja").setDepth(13).setVisible(false);

    this.animales = this.physics.add.group();
    this.flechas = this.physics.add.group({ allowGravity: false });
    this.escudos = this.physics.add.group();

    this.physics.add.overlap(this.jugadora, this.animales, (j, animal) => this.golpeaAnimal(animal));
    this.physics.add.overlap(this.flechas, this.animales, (flecha, animal) => this.flechaDaAnimal(flecha, animal));
    this.physics.add.overlap(this.flechas, this.casas, (flecha, casa) => this.flechaDaCasa(flecha, casa));
    this.physics.add.overlap(this.jugadora, this.escudos, (j, objeto) => this.cogerEscudo(objeto));

    // Efecto de partículas reutilizable
    this.chispas = this.add.particles(0, 0, "brillo", {
      speed: { min: 80, max: 280 },
      scale: { start: 1.7, end: 0 },
      lifespan: 520,
      gravityY: 400,
      emitting: false,
    }).setDepth(20);

    this.crearMarcador();

    this.teclas = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,A,D,W,S,SPACE,SHIFT,E,X,C");
    const teclado = this.input.keyboard;
    teclado.on("keydown-P", () => this.alternarPausa());
    teclado.on("keydown-T", () => (this.enTienda ? this.cerrarTienda() : this.abrirTienda()));
    teclado.on("keydown-ESC", () => this.cerrarTienda());
    teclado.on("keydown-M", () => Musica.alternar());
    ["ONE", "TWO", "THREE", "FOUR"].forEach((tecla, i) => teclado.on("keydown-" + tecla, () => this.comprar(i)));

    this.anunciar("¡Nivel 1!", "#ffd54f");
  }

  // ----- Ciudad: casas, tienda y gente -----
  crearCiudad() {
    this.casas = this.physics.add.group({ allowGravity: false, immovable: true });
    [[110, 0], [560, 1], [820, 2]].forEach(([x, tipo]) => {
      const casa = this.casas.create(x, SUELO, "casa" + tipo).setOrigin(0.5, 1).setDepth(6);
      casa.vida = CONFIG.golpesPorCasa;
      casa.reaparecerEn = 0;
    });

    this.add.image(300, SUELO, "tienda").setOrigin(0.5, 1).setDepth(7);
    this.add.text(300, SUELO - 150, "🛒 TIENDA", estiloTexto(24, "#ffd54f")).setOrigin(0.5).setDepth(7);

    this.gente = [
      { clave: "npcTendero", x: 440, frases: ["¡Bienvenida! Pulsa T para ver mi tienda 🛒", "Tengo espadas, pociones, arcos y motos."] },
      { clave: "npcVecina", x: 690, frases: ["¡Ánimo, cazadora! 💪", "¡Cuidado con las panteras, son muy sigilosas!", "¡Mi casa siempre vuelve a crecer! 🏠"] },
      { clave: "npcVecino", x: 40, frases: ["¡Los lobos vienen de todas partes!", "Rompe casas y gana monedas 🪙"] },
    ].map((p) => {
      const npc = this.add.image(p.x, SUELO, p.clave).setOrigin(0.5, 1).setDepth(8);
      this.tweens.add({ targets: npc, scaleY: 1.04, duration: 800 + p.x, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      npc.frases = p.frases;
      return npc;
    });
  }

  // ----- Marcador -----
  crearMarcador() {
    this.textoNivel = this.add.text(20, 10, "", estiloTexto(26, "#ffd54f")).setDepth(30);
    this.barra = this.add.graphics().setDepth(30);
    this.textoPuntos = this.add.text(ANCHO / 2, 10, "", estiloTexto(28)).setOrigin(0.5, 0).setDepth(30);
    this.textoMonedas = this.add.text(ANCHO - 20, 10, "", estiloTexto(26, "#ffe082")).setOrigin(1, 0).setDepth(30);
    this.textoVidas = this.add.text(ANCHO - 20, 46, "", estiloTexto(20)).setOrigin(1, 0).setDepth(30);
    this.add.text(ANCHO / 2, ALTO - 24, "T tienda · C casa de lujo · E hablar · X espada · SHIFT voltereta · P pausa", estiloTexto(16, "#e8f5e9"))
      .setOrigin(0.5).setDepth(30).setAlpha(0.85);
    this.actualizarMarcador();
  }

  actualizarMarcador() {
    this.textoNivel.setText(`Nivel ${this.nivel}/${CONFIG.nivelFinal}`);
    this.textoPuntos.setText(`⭐ ${this.puntos}`);
    this.textoMonedas.setText(`🪙 ${this.monedas}`);
    this.textoVidas.setText("❤️".repeat(Math.max(this.vidas, 0)));
    const fraccion = Phaser.Math.Clamp(this.cazados / CONFIG.animalesPorNivel, 0, 1);
    this.barra.clear();
    this.barra.fillStyle(0x000000, 0.45);
    this.barra.fillRoundedRect(20, 48, 190, 16, 8);
    this.barra.fillStyle(0x80ff9a, 1);
    if (fraccion > 0) this.barra.fillRoundedRect(22, 50, 186 * fraccion, 12, 6);
  }

  anunciar(texto, color) {
    const cartel = this.add.text(ANCHO / 2, ALTO / 2 - 60, texto, estiloTexto(64, color)).setOrigin(0.5).setDepth(40).setScale(0);
    this.tweens.add({
      targets: cartel, scale: 1, duration: 350, ease: "Back.easeOut", yoyo: true, hold: 700,
      onComplete: () => cartel.destroy(),
    });
  }

  flotante(x, y, texto, color = "#ffffff") {
    const t = this.add.text(x, y, texto, estiloTexto(24, color)).setOrigin(0.5).setDepth(25);
    this.tweens.add({ targets: t, y: y - 50, alpha: 0, duration: 900, onComplete: () => t.destroy() });
  }

  decir(objeto, texto, altura) {
    if (objeto.globo) objeto.globo.destroy();
    const globo = this.add.text(objeto.x, objeto.y - altura, texto, {
      fontFamily: "Trebuchet MS, Verdana, sans-serif", fontSize: "18px", fontStyle: "bold", color: "#222222",
      backgroundColor: "#ffffff", padding: { x: 10, y: 6 }, align: "center", wordWrap: { width: 250 },
    }).setOrigin(0.5, 1).setDepth(35);
    objeto.globo = globo;
    objeto.alturaGlobo = altura;
    this.time.delayedCall(2800, () => {
      if (objeto.globo === globo) { globo.destroy(); objeto.globo = null; }
    });
  }

  // ----- Bucle principal -----
  update(tiempo, delta) {
    if (this.terminado || this.parado) return;
    const dt = delta / 1000;
    this.reloj += delta;

    // Los LEDs de las casas de lujo cambian de color como un arcoíris
    this.lujos.forEach((casa, i) => casa.leds.setTint(Phaser.Display.Color.HSVToRGB(((tiempo / 2500) + i * 0.2) % 1, 1, 1).color));

    this.moverCazadora();
    this.actualizarRefugio(dt);
    this.actualizarAnimales();
    this.actualizarCasas(dt);

    // Aparecen animales cada cierto tiempo (cada nivel, más y más rápido)
    this.tiempoAnimal -= dt;
    const maximo = CONFIG.animalesMaximosBase + this.nivel;
    if (this.tiempoAnimal <= 0 && this.animales.countActive() < maximo) {
      this.crearAnimal();
      this.tiempoAnimal = Math.max(CONFIG.segundosEntreAnimalesMinimo, CONFIG.segundosEntreAnimales - CONFIG.bajadaPorNivel * (this.nivel - 1));
    }

    // Borra las flechas que se salen de la pantalla
    this.flechas.getChildren().forEach((f) => { if (f.x < -60 || f.x > ANCHO + 60) f.destroy(); });
  }

  // ----- La cazadora -----
  estaInvulnerable() {
    return this.enRefugio || this.reloj < this.invulnerableHasta || this.reloj < this.escudoHasta || this.reloj < this.rodandoHasta;
  }

  // ----- Casas de lujo con LEDs: refugio donde los animales no atacan -----
  construirCasaLujo() {
    const h = this.jugadora;
    if (this.lujos.length >= CONFIG.maxCasasLujo) {
      this.flotante(h.x, h.y - 110, `¡Ya tienes ${CONFIG.maxCasasLujo} casas de lujo!`, "#ffe082");
      return;
    }
    if (this.monedas < CONFIG.precioCasaLujo) {
      this.flotante(h.x, h.y - 110, `Faltan ${CONFIG.precioCasaLujo - this.monedas} 🪙`, "#ef9a9a");
      return;
    }
    const x = Phaser.Math.Clamp(h.x + this.mirando * 110, 85, ANCHO - 85);
    if (this.lujos.some((c) => Math.abs(c.x - x) < 150)) {
      this.flotante(h.x, h.y - 110, "¡Aquí no hay sitio!", "#ef9a9a");
      return;
    }
    this.monedas -= CONFIG.precioCasaLujo;

    const casa = this.add.image(x, SUELO, "casaLujo").setOrigin(0.5, 1).setDepth(9).setScale(0.2);
    const leds = this.add.image(x, SUELO, "ledsLujo").setOrigin(0.5, 1).setDepth(9.1).setBlendMode(Phaser.BlendModes.ADD).setScale(0.2);
    casa.leds = leds;
    this.lujos.push(casa);
    this.tweens.add({ targets: [casa, leds], scale: 1, duration: 450, ease: "Back.easeOut" });
    this.tweens.add({ targets: leds, alpha: { from: 0.55, to: 1 }, duration: 700, yoyo: true, repeat: -1 });
    this.chispas.setParticleTint(0xffffff);
    this.chispas.explode(26, x, SUELO - 60);
    this.flotante(x, SUELO - 140, "🏠✨ ¡Casa de lujo!", "#ffd54f");
    this.actualizarMarcador();
  }

  actualizarRefugio(dt) {
    this.barraLujo.clear();
    const h = this.jugadora;
    const casa = this.lujos.find((c) => Math.abs(c.x - h.x) < 62);
    this.enRefugio = !!casa;
    if (!casa) {
      this.descanso = 0;
      return;
    }
    this.descanso += dt;
    this.barraLujo.fillStyle(0x000000, 0.5);
    this.barraLujo.fillRoundedRect(casa.x - 42, SUELO - 150, 84, 12, 6);
    this.barraLujo.fillStyle(0x80d8ff, 1);
    this.barraLujo.fillRoundedRect(casa.x - 40, SUELO - 148, 80 * (this.descanso / CONFIG.segundosParaAvanzar), 8, 4);
    if (this.descanso >= CONFIG.segundosParaAvanzar) {
      this.descanso = 0;
      this.flotante(casa.x, SUELO - 175, "😌 ¡Descansas y avanzas!", "#80d8ff");
      this.sumarProgreso(CONFIG.progresoPorDescanso);
    }
  }

  // Cada animal cazado (o descanso en una casa de lujo) llena la barra del nivel
  sumarProgreso(cantidad) {
    this.cazados += cantidad;
    if (this.cazados >= CONFIG.animalesPorNivel) this.subirNivel();
    else this.actualizarMarcador();
  }

  moverCazadora() {
    const h = this.jugadora;
    const c = this.teclas;
    const enSuelo = h.body.blocked.down;
    const rodando = this.reloj < this.rodandoHasta;
    const aturdida = this.reloj < this.aturdidoHasta;
    const izquierda = c.LEFT.isDown || c.A.isDown;
    const derecha = c.RIGHT.isDown || c.D.isDown;
    const abajo = c.DOWN.isDown || c.S.isDown;
    const JustDown = Phaser.Input.Keyboard.JustDown;

    // Teclas "de un toque" (se leen siempre para no acumularlas)
    const saltar = JustDown(c.UP) || JustDown(c.W);
    const voltereta = JustDown(c.SHIFT);
    const hablar = JustDown(c.E);
    const tajo = JustDown(c.X);
    const construir = JustDown(c.C);

    if (!aturdida) {
      let velocidad = CONFIG.velocidadCazadora * (this.tieneMoto ? CONFIG.multiplicadorMoto : 1);
      const agachada = abajo && enSuelo && !rodando;
      h.setScale(1, agachada || rodando ? 0.8 : 1);

      if (rodando) {
        h.setVelocityX(this.mirando * velocidad * 1.7);
      } else {
        if (agachada) velocidad *= 0.35;
        if (izquierda && !derecha) { h.setVelocityX(-velocidad); this.mirando = -1; }
        else if (derecha && !izquierda) { h.setVelocityX(velocidad); this.mirando = 1; }
        else h.setVelocityX(0);

        if (saltar && enSuelo && !agachada) h.setVelocityY(-CONFIG.saltoCazadora);

        if (voltereta && this.reloj >= this.proxVoltereta) {
          this.rodandoHasta = this.reloj + CONFIG.segundosVoltereta * 1000;
          this.proxVoltereta = this.reloj + CONFIG.segundosEntreVolteretas * 1000;
          this.tweens.add({
            targets: h, angle: this.mirando * 360, duration: CONFIG.segundosVoltereta * 1000,
            onComplete: () => h.setAngle(0),
          });
        } else if (c.SPACE.isDown && this.reloj >= this.proxDisparo) {
          this.disparar(agachada);
        }

        if (tajo && this.tieneEspada && this.reloj >= this.proxEspada) this.usarEspada();
        if (hablar) this.hablar();
        if (construir) this.construirCasaLujo();
      }
      h.setFlipX(this.mirando < 0);
      if (!rodando) h.setAngle(enSuelo && h.body.velocity.x !== 0 ? Math.sin(this.reloj / 70) * 3 : 0);
    }

    // No salir de la pantalla
    if (h.x < 30) { h.x = 30; h.setVelocityX(Math.max(h.body.velocity.x, 0)); }
    if (h.x > ANCHO - 30) { h.x = ANCHO - 30; h.setVelocityX(Math.min(h.body.velocity.x, 0)); }

    // Parpadea si acaba de recibir un golpe
    const enGolpe = this.reloj < this.invulnerableHasta && this.reloj >= this.escudoHasta;
    h.setAlpha(this.enRefugio ? 0.6 : enGolpe && Math.floor(this.reloj / 90) % 2 ? 0.35 : 1);

    // Moto, burbuja del escudo y globo de texto siguen a la cazadora
    this.motoImg.setVisible(this.tieneMoto).setPosition(h.x, h.y + 2).setFlipX(this.mirando < 0);
    const escudoActivo = this.reloj < this.escudoHasta;
    this.burbuja.setVisible(escudoActivo && (this.escudoHasta - this.reloj > 1500 || Math.floor(this.reloj / 120) % 2 === 0));
    this.burbuja.setPosition(h.x, h.y - 46 * h.scaleY);
    if (h.globo) h.globo.setPosition(h.x, h.y - h.alturaGlobo * h.scaleY);
  }

  disparar(agachada) {
    this.proxDisparo = this.reloj + CONFIG.segundosEntreDisparos * 1000 * (1 - 0.15 * this.mejorasArco);
    const h = this.jugadora;
    const flecha = this.flechas.create(h.x + this.mirando * 42, h.y - (agachada ? 40 : 50), "flecha");
    flecha.body.setAllowGravity(false);
    flecha.setFlipX(this.mirando < 0).setDepth(11);
    flecha.setVelocityX(this.mirando * CONFIG.velocidadFlecha);
    flecha.dano = CONFIG.danoFlecha + this.mejorasArco;
    this.tweens.add({ targets: h, scaleX: { from: 0.94, to: 1 }, duration: 100 });
  }

  usarEspada() {
    const h = this.jugadora;
    this.proxEspada = this.reloj + 400;
    const tajo = this.add.image(h.x + this.mirando * 10, h.y - 50, "tajo").setOrigin(0, 0.5).setFlipX(this.mirando < 0).setDepth(14);
    this.tweens.add({ targets: tajo, alpha: 0, scaleX: 1.4, duration: 220, onComplete: () => tajo.destroy() });
    const alcanza = (objeto) => {
      const dx = (objeto.x - h.x) * this.mirando;
      return dx > -20 && dx < 110 && Math.abs(objeto.y - (h.y - 30)) < 90;
    };
    this.animales.getChildren().slice().forEach((a) => { if (alcanza(a)) this.herirAnimal(a, 2); });
    this.casas.getChildren().forEach((casa) => { if (casa.body.enable && alcanza(casa)) this.herirCasa(casa, 2); });
  }

  hablar() {
    const h = this.jugadora;
    const cerca = this.gente.find((p) => Math.abs(p.x - h.x) < 120);
    if (cerca) {
      this.mirando = cerca.x >= h.x ? 1 : -1;
      this.decir(h, "¡Hola! 👋", 105);
      this.time.delayedCall(700, () => this.decir(cerca, Phaser.Utils.Array.GetRandom(cerca.frases), 80));
    } else {
      this.decir(h, "¡Hola a todos! 👋", 105);
    }
  }

  // ----- Animales -----
  crearAnimal() {
    const tipos = ["lobo", "lobo", "zorro", "zorro"];
    if (this.nivel >= 2) tipos.push("leopardo", "leopardo");
    if (this.nivel >= 3) tipos.push("pantera", "pantera");
    const tipo = Phaser.Utils.Array.GetRandom(tipos);
    const datos = CONFIG.animales[tipo];
    const desdeLaIzquierda = Math.random() < 0.5;

    const a = this.animales.create(desdeLaIzquierda ? -50 : ANCHO + 50, SUELO - 25, "animal_" + tipo).setDepth(10);
    a.setCollideWorldBounds(true);
    a.body.setSize(56, 34).setOffset(8, 12);
    a.tipo = tipo;
    a.vida = datos.vida;
    a.velocidad = datos.velocidad * (1 + CONFIG.velocidadExtraPorNivel * (this.nivel - 1));
    a.proxSalto = this.reloj + Phaser.Math.Between(300, 900);
    a.saltando = false;
  }

  actualizarAnimales() {
    const h = this.jugadora;
    this.animales.getChildren().forEach((a) => {
      const direccion = h.x >= a.x ? 1 : -1;
      const enSuelo = a.body.blocked.down;
      const cerca = Math.abs(h.x - a.x);
      a.setFlipX(direccion < 0);
      if (enSuelo) a.saltando = false;

      switch (a.tipo) {
        case "lobo": // corre recto hacia la cazadora
          a.setVelocityX(direccion * a.velocidad);
          break;
        case "zorro": // va a saltitos
          a.setVelocityX(direccion * a.velocidad);
          if (enSuelo && this.reloj > a.proxSalto) {
            a.setVelocityY(-380);
            a.proxSalto = this.reloj + Phaser.Math.Between(600, 1100);
          }
          break;
        case "leopardo": // muy rápido y de vez en cuando salta
          a.setVelocityX(direccion * a.velocidad);
          if (enSuelo && cerca < 280 && this.reloj > a.proxSalto) {
            a.setVelocityY(-430);
            a.proxSalto = this.reloj + Phaser.Math.Between(1200, 2200);
          }
          break;
        case "pantera": // sigilosa: se acerca despacio y de pronto se lanza de un salto
          if (!a.saltando) a.setVelocityX(direccion * a.velocidad);
          a.setAlpha(0.75 + Math.sin(this.reloj / 220) * 0.25);
          if (enSuelo && cerca < 230 && this.reloj > a.proxSalto) {
            a.saltando = true;
            a.setVelocity(direccion * a.velocidad * 2.6, -520);
            a.proxSalto = this.reloj + 2200;
          }
          break;
      }
    });
  }

  herirAnimal(a, dano) {
    if (!a.active) return;
    a.vida -= dano;
    a.setTintFill(0xffffff);
    this.time.delayedCall(80, () => { if (a.active) a.clearTint(); });
    this.chispas.setParticleTint(0xffffff);
    this.chispas.explode(5, a.x, a.y);
    if (a.vida <= 0) this.matarAnimal(a);
  }

  matarAnimal(a) {
    const datos = CONFIG.animales[a.tipo];
    this.chispas.setParticleTint(0xffd54f);
    this.chispas.explode(18, a.x, a.y);
    this.flotante(a.x, a.y - 20, `+${datos.puntos}`, "#ffd54f");
    this.puntos += datos.puntos;
    if (Math.random() < CONFIG.probabilidadEscudo) this.soltarEscudo(a.x, a.y);
    a.destroy();

    this.sumarProgreso(1);
  }

  subirNivel() {
    this.nivel += 1;
    this.cazados = 0;
    this.actualizarMarcador();
    if (this.nivel >= CONFIG.nivelFinal) {
      this.terminar(true);
      return;
    }
    this.anunciar(`¡Nivel ${this.nivel}!`, "#80ff9a");
    this.cameras.main.flash(200, 255, 255, 200);
  }

  flechaDaAnimal(flecha, animal) {
    if (!flecha.active || !animal.active) return;
    const dano = flecha.dano;
    flecha.destroy();
    this.herirAnimal(animal, dano);
  }

  golpeaAnimal(a) {
    if (!a.active || this.estaInvulnerable()) return;
    const h = this.jugadora;
    this.vidas -= 1;
    this.invulnerableHasta = this.reloj + CONFIG.segundosInvulnerable * 1000;
    this.aturdidoHasta = this.reloj + 250;
    const empuje = h.x >= a.x ? 1 : -1;
    h.setVelocity(empuje * 320, -280);
    h.setScale(1, 1);
    this.chispas.setParticleTint(0xef5350);
    this.chispas.explode(16, h.x, h.y - 40);
    this.cameras.main.shake(250, 0.012);
    this.cameras.main.flash(150, 255, 80, 80);
    this.actualizarMarcador();
    if (this.vidas <= 0) this.terminar(false);
  }

  // ----- Escudos -----
  soltarEscudo(x, y) {
    const objeto = this.escudos.create(x, y - 10, "escudo").setDepth(9);
    objeto.setVelocityY(-260).setBounce(0.35).setCollideWorldBounds(true);
    this.tweens.add({ targets: objeto, scale: 1.15, duration: 400, yoyo: true, repeat: -1 });
    this.time.delayedCall(8000, () => { if (objeto.active) objeto.destroy(); });
  }

  cogerEscudo(objeto) {
    objeto.destroy();
    this.escudoHasta = this.reloj + CONFIG.segundosEscudo * 1000;
    this.flotante(this.jugadora.x, this.jugadora.y - 100, "🛡️ ¡Escudo!", "#81d4fa");
  }

  // ----- Casas -----
  flechaDaCasa(flecha, casa) {
    if (!flecha.active || !casa.body.enable) return;
    flecha.destroy();
    this.herirCasa(casa, 1);
  }

  herirCasa(casa, golpes) {
    casa.vida -= golpes;
    this.tweens.add({ targets: casa, x: casa.x + 5, duration: 40, yoyo: true, repeat: 2, onComplete: () => { casa.x = Math.round(casa.x); } });
    casa.setTint(casa.vida >= 2 ? 0xe0d0c0 : 0xb0a090);
    this.chispas.setParticleTint(0xd7ccc8);
    this.chispas.explode(6, casa.x, casa.y - 60);
    if (casa.vida <= 0) this.destruirCasa(casa);
  }

  destruirCasa(casa) {
    this.chispas.setParticleTint(0xffcc80);
    this.chispas.explode(30, casa.x, casa.y - 50);
    this.cameras.main.shake(200, 0.008);
    this.monedas += CONFIG.monedasPorCasa;
    this.flotante(casa.x, casa.y - 90, `+${CONFIG.monedasPorCasa} 🪙`, "#ffe082");
    casa.body.enable = false;
    casa.setVisible(false);
    casa.reaparecerEn = CONFIG.segundosReaparecerCasa;
    this.actualizarMarcador();
  }

  actualizarCasas(dt) {
    this.casas.getChildren().forEach((casa) => {
      if (casa.body.enable) return;
      casa.reaparecerEn -= dt;
      if (casa.reaparecerEn <= 0) {
        casa.vida = CONFIG.golpesPorCasa;
        casa.clearTint();
        casa.setVisible(true).setScale(0.2);
        casa.body.enable = true;
        this.tweens.add({ targets: casa, scale: 1, duration: 450, ease: "Back.easeOut" });
      }
    });
  }

  // ----- Pausa y tienda -----
  actualizarParo() {
    this.parado = this.pausaActiva || this.enTienda;
    if (this.parado) this.physics.pause();
    else this.physics.resume();
  }

  alternarPausa() {
    if (this.terminado || this.enTienda) return;
    this.pausaActiva = !this.pausaActiva;
    this.actualizarParo();
    if (this.pausaActiva) {
      this.cartelPausa = this.add.text(ANCHO / 2, ALTO / 2, "PAUSA\n(pulsa P)", { ...estiloTexto(56), align: "center" })
        .setOrigin(0.5).setDepth(60);
    } else {
      this.cartelPausa.destroy();
    }
  }

  catalogo() {
    const p = CONFIG.precios;
    return [
      { id: "espada", nombre: "⚔️ Espada (tecla X)", precio: p.espada, ocupado: this.tieneEspada ? "¡Ya la tienes!" : null },
      { id: "pocion", nombre: `🧪 Poción (+${CONFIG.vidasPocion} vidas)`, precio: p.pocion, ocupado: this.vidas >= CONFIG.vidas ? "Ya tienes todas las vidas" : null },
      {
        id: "arco", nombre: `🏹 Arco mejorado (${this.mejorasArco}/${CONFIG.mejorasArcoMaximas})`, precio: p.arco * (this.mejorasArco + 1),
        ocupado: this.mejorasArco >= CONFIG.mejorasArcoMaximas ? "¡Arco al máximo!" : null,
      },
      { id: "moto", nombre: "🏍️ Moto (¡mucho más rápida!)", precio: p.moto, ocupado: this.tieneMoto ? "¡Ya la tienes!" : null },
    ];
  }

  abrirTienda() {
    if (this.enTienda || this.terminado || this.pausaActiva) return;
    this.enTienda = true;
    this.actualizarParo();
    const cx = ANCHO / 2;
    const cy = ALTO / 2;
    const oscuro = this.add.rectangle(cx, cy, ANCHO, ALTO, 0x000000, 0.55);
    const panel = this.add.graphics();
    panel.fillStyle(0x3e2723, 1);
    panel.fillRoundedRect(cx - 320, cy - 200, 640, 400, 20);
    panel.lineStyle(5, 0xffd54f, 1);
    panel.strokeRoundedRect(cx - 320, cy - 200, 640, 400, 20);
    const titulo = this.add.text(cx, cy - 165, "🛒 Tienda de la ciudad", estiloTexto(36, "#ffd54f")).setOrigin(0.5);
    const monedas = this.add.text(cx + 300, cy - 190, "", estiloTexto(26, "#ffe082")).setOrigin(1, 0);
    const filas = [0, 1, 2, 3].map((i) => this.add.text(cx - 290, cy - 110 + i * 56, "", estiloTexto(24)));
    const mensaje = this.add.text(cx, cy + 135, "Pulsa 1, 2, 3 o 4 para comprar", estiloTexto(22, "#a5d6a7")).setOrigin(0.5);
    const ayuda = this.add.text(cx, cy + 172, "T o ESC para salir", estiloTexto(18)).setOrigin(0.5);
    this.tienda = { elementos: [oscuro, panel, titulo, monedas, ...filas, mensaje, ayuda], monedas, filas, mensaje };
    this.tienda.elementos.forEach((e) => e.setDepth(50));
    this.refrescarTienda();
  }

  refrescarTienda() {
    if (!this.tienda) return;
    this.tienda.monedas.setText(`🪙 ${this.monedas}`);
    this.catalogo().forEach((item, i) => {
      const fila = this.tienda.filas[i];
      fila.setText(`${i + 1}  ${item.nombre}  —  ${item.ocupado || item.precio + " 🪙"}`);
      fila.setColor(item.ocupado ? "#9e9e9e" : this.monedas >= item.precio ? "#ffffff" : "#ef9a9a");
    });
  }

  comprar(i) {
    if (!this.enTienda) return;
    const item = this.catalogo()[i];
    let texto;
    if (item.ocupado) texto = item.ocupado;
    else if (this.monedas < item.precio) texto = `Te faltan ${item.precio - this.monedas} 🪙. ¡Destruye casas!`;
    else {
      this.monedas -= item.precio;
      if (item.id === "espada") this.tieneEspada = true;
      if (item.id === "pocion") this.vidas = Math.min(CONFIG.vidas, this.vidas + CONFIG.vidasPocion);
      if (item.id === "arco") this.mejorasArco += 1;
      if (item.id === "moto") this.tieneMoto = true;
      texto = "¡Comprado! 🎉";
      this.actualizarMarcador();
    }
    this.tienda.mensaje.setText(texto);
    this.refrescarTienda();
  }

  cerrarTienda() {
    if (!this.enTienda) return;
    this.enTienda = false;
    this.tienda.elementos.forEach((e) => e.destroy());
    this.tienda = null;
    this.actualizarParo();
  }

  // ----- Final -----
  terminar(ganado) {
    this.terminado = true;
    this.physics.pause();
    this.time.delayedCall(ganado ? 900 : 700, () =>
      this.scene.start("Fin", { ganado, puntos: this.puntos, nivel: this.nivel, monedas: this.monedas })
    );
  }
}

// ===== Pantalla final =====
class Fin extends Phaser.Scene {
  constructor() { super("Fin"); }
  create(datos) {
    crearFondo(this);
    const centro = ANCHO / 2;

    const panel = this.add.graphics().setDepth(6);
    panel.fillStyle(0x0d2418, 0.6);
    panel.fillRoundedRect(centro - 340, 90, 680, 380, 24);

    const texto = datos.ganado ? "🏆 ¡Has ganado! 🏆" : "¡Los animales te vencieron!";
    const color = datos.ganado ? "#ffd54f" : "#ef5350";
    const titulo = this.add.text(centro, 170, texto, estiloTexto(54, color)).setOrigin(0.5).setScale(0).setDepth(7);
    this.tweens.add({ targets: titulo, scale: 1, duration: 500, ease: "Back.easeOut" });

    const heroina = this.add.image(centro, 300, "cazadora").setDepth(7).setScale(1.2);
    if (datos.ganado) {
      this.tweens.add({ targets: heroina, y: 280, duration: 400, yoyo: true, repeat: -1, ease: "Sine.easeOut" });
      this.add.particles(centro, 120, "brillo", {
        speed: { min: 150, max: 380 }, angle: { min: 200, max: 340 }, gravityY: 350, scale: { start: 1.8, end: 0 },
        lifespan: 1500, frequency: 60, tint: [0xffd54f, 0xff80ab, 0x80d8ff, 0xb9f6ca],
      }).setDepth(8);
    } else {
      heroina.setAngle(-90).setY(330);
    }

    const linea = (y, t, tamaño, col) => this.add.text(centro, y, t, estiloTexto(tamaño, col)).setOrigin(0.5).setDepth(7);
    linea(385, `Puntos: ${datos.puntos}   ·   Nivel: ${datos.nivel}/${CONFIG.nivelFinal}   ·   🪙 ${datos.monedas}`, 28);
    const otra = linea(445, "Pulsa ENTER para jugar otra vez", 30, "#80ff9a");
    this.tweens.add({ targets: otra, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });
    this.input.keyboard.once("keydown-ENTER", () => this.scene.start("Juego"));
  }
}

// ===== Arrancar Phaser =====
const juego = new Phaser.Game({
  type: Phaser.AUTO,
  width: ANCHO,
  height: ALTO,
  physics: { default: "arcade", arcade: { gravity: { y: CONFIG.gravedad } } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [Preparar, Inicio, Juego, Fin],
});
