// ===== Ajustes del juego: ¡prueba a cambiar estos números! =====
const CONFIG = {
  ancho: 960,
  alto: 540,
  suelo: 500,               // altura (y) del suelo donde corre tu Pokémon
  posicionJugador: 190,     // en qué punto de la pantalla se queda tu Pokémon

  vidas: 5,                 // golpes que aguantas antes de perder
  vidasMaximas: 8,          // las Pokeballs dan vidas extra hasta este máximo
  monedasParaGanar: 15,     // monedas mínimas para ganar al llegar a la meta
  puntosPorMoneda: 100,
  longitudPista: 27000,     // más número = carrera más larga (unos 60 segundos)

  velocidadInicial: 320,    // velocidad al empezar (y tras recibir un golpe)
  velocidadMaxima: 560,
  aceleracion: 10,            // cuánto se acelera cada segundo

  gravedad: 2200,
  fuerzaSalto: 760,         // más número = salto más alto

  turboMaximo: 100,
  gastoTurbo: 45,           // lo que gasta el turbo por segundo
  recargaTurbo: 6,          // lo que se recarga solo por segundo
  multiplicadorTurbo: 1.5,  // cuánto más rápido vas con turbo
  turboBaya: 50,            // lo que recarga una baya

  duracionAtaque: 0.28,
  enfriamientoAtaque: 0.7,  // segundos hasta poder atacar otra vez
  segundosInvulnerable: 1.5,

  huecoMin: 520,            // distancia mínima entre cosas
  huecoMax: 820,
  probCoche: 0.42,          // probabilidad de que salga un Lambo
  probPocion: 0.30,         // probabilidad de poción (el resto: monedas)
  velocidadCocheMin: 40,
  velocidadCocheMax: 160,
  gravedadPocion: 500,      // más número = la poción cae más rápido

  sonidos: true,
  musica: true,
};

// ===== Los Pokémon de cada región (3 por región) =====
// cuerpo / vientre / acento = colores. orejas, cola y extras = rasgos para dibujarlos.
const REGIONES = [
  { nombre: "Kanto", color: 0xe53935, pokemon: [
    { nombre: "Bulbasaur", cuerpo: 0x6cc3b5, vientre: 0x9ad9cd, acento: 0x4caf50, orejas: "puntiaguda", cola: "ninguna", extras: ["bulbo"] },
    { nombre: "Charmander", cuerpo: 0xff8a3d, vientre: 0xffe08a, acento: 0xff7043, orejas: "ninguna", cola: "llama", extras: [] },
    { nombre: "Squirtle", cuerpo: 0x6ec6f2, vientre: 0xfff0b3, acento: 0x8d6e3b, orejas: "ninguna", cola: "rizo", extras: ["concha"] },
  ] },
  { nombre: "Johto", color: 0xffb300, pokemon: [
    { nombre: "Chikorita", cuerpo: 0xb7e36a, vientre: 0xe8f5b0, acento: 0x4caf50, orejas: "ninguna", cola: "ninguna", extras: ["hoja"] },
    { nombre: "Cyndaquil", cuerpo: 0x37677d, vientre: 0xfff1b8, acento: 0xff7043, orejas: "redonda", cola: "ninguna", extras: ["llama", "hocico"] },
    { nombre: "Totodile", cuerpo: 0x4fa9e8, vientre: 0xfff0b3, acento: 0xe53935, orejas: "ninguna", cola: "lagarto", extras: ["mandibula"] },
  ] },
  { nombre: "Hoenn", color: 0x1e88e5, pokemon: [
    { nombre: "Treecko", cuerpo: 0x66bb6a, vientre: 0xe8f5c8, acento: 0x2e7d32, orejas: "ninguna", cola: "lagarto", extras: ["hoja"] },
    { nombre: "Torchic", cuerpo: 0xffb347, vientre: 0xffe9a8, acento: 0xffd54f, orejas: "ninguna", cola: "ninguna", extras: ["pico"] },
    { nombre: "Mudkip", cuerpo: 0x62b8ef, vientre: 0xf3f3f3, acento: 0xff9d3a, orejas: "ninguna", cola: "aleta", extras: ["aleta", "mejillas"] },
  ] },
  { nombre: "Sinnoh", color: 0x7e6bc4, pokemon: [
    { nombre: "Turtwig", cuerpo: 0x8bc34a, vientre: 0xc5e1a5, acento: 0x6d4c41, orejas: "ninguna", cola: "ninguna", extras: ["hoja", "concha"] },
    { nombre: "Chimchar", cuerpo: 0xa1693f, vientre: 0xf5d5a8, acento: 0xff7043, orejas: "redonda", cola: "llama", extras: ["hocico"] },
    { nombre: "Piplup", cuerpo: 0x3f8fe0, vientre: 0xf5f5f5, acento: 0xffc107, orejas: "ninguna", cola: "ninguna", extras: ["pico"] },
  ] },
  { nombre: "Teselia", color: 0x546e7a, pokemon: [
    { nombre: "Snivy", cuerpo: 0x5fcf6a, vientre: 0xfff3c7, acento: 0xffd54f, orejas: "ninguna", cola: "hoja", extras: [] },
    { nombre: "Tepig", cuerpo: 0xff8f3a, vientre: 0xffd9a0, acento: 0x424242, orejas: "redonda", cola: "ninguna", extras: ["hocico"] },
    { nombre: "Oshawott", cuerpo: 0x4aa3df, vientre: 0xf5f0e0, acento: 0xf0e68c, orejas: "ninguna", cola: "ninguna", extras: ["hocico"] },
  ] },
  { nombre: "Kalos", color: 0xec407a, pokemon: [
    { nombre: "Chespin", cuerpo: 0x9c6b3f, vientre: 0xf5deb3, acento: 0x4caf50, orejas: "redonda", cola: "ninguna", extras: ["concha"] },
    { nombre: "Fennekin", cuerpo: 0xffd54f, vientre: 0xfff8e1, acento: 0xff7043, orejas: "larga", cola: "ninguna", extras: [] },
    { nombre: "Froakie", cuerpo: 0x4a90e2, vientre: 0xe8f4ff, acento: 0xffffff, orejas: "ninguna", cola: "ninguna", extras: ["mejillas"] },
  ] },
  { nombre: "Alola", color: 0xff7043, pokemon: [
    { nombre: "Rowlet", cuerpo: 0xa1805a, vientre: 0xfff3d9, acento: 0x4caf50, orejas: "puntiaguda", cola: "ninguna", extras: ["pico"] },
    { nombre: "Litten", cuerpo: 0x2b2b3a, vientre: 0xe0453a, acento: 0xffa726, orejas: "puntiaguda", cola: "llama", extras: ["mejillas"] },
    { nombre: "Popplio", cuerpo: 0x3d78d6, vientre: 0xfdfdfd, acento: 0xf48fb1, orejas: "redonda", cola: "aleta", extras: ["hocico"] },
  ] },
  { nombre: "Galar", color: 0x26a69a, pokemon: [
    { nombre: "Grookey", cuerpo: 0x8bc34a, vientre: 0xfff0b0, acento: 0x6d4c41, orejas: "redonda", cola: "ninguna", extras: ["hocico"] },
    { nombre: "Scorbunny", cuerpo: 0xf5f5f5, vientre: 0xffffff, acento: 0xff7043, orejas: "larga", cola: "ninguna", extras: ["mejillas"] },
    { nombre: "Sobble", cuerpo: 0x7ec8e3, vientre: 0xe6f6fb, acento: 0x3a6ea5, orejas: "ninguna", cola: "lagarto", extras: ["aleta"] },
  ] },
  { nombre: "Paldea", color: 0x9ccc65, pokemon: [
    { nombre: "Sprigatito", cuerpo: 0x8fdc7a, vientre: 0xe6f7d0, acento: 0x4caf50, orejas: "puntiaguda", cola: "hoja", extras: [] },
    { nombre: "Fuecoco", cuerpo: 0xe5504a, vientre: 0xfff1b0, acento: 0xffd54f, orejas: "ninguna", cola: "lagarto", extras: ["mandibula"] },
    { nombre: "Quaxly", cuerpo: 0xf5f5f5, vientre: 0xffffff, acento: 0x3a8dde, orejas: "ninguna", cola: "ninguna", extras: ["pico", "aleta"] },
  ] },
];

// Lista plana de todos los Pokémon (cada uno guarda su "clave" de textura)
const LISTA_POKEMON = [];
REGIONES.forEach((region, indice) => {
  region.pokemon.forEach((p) => {
    p.region = indice;
    p.clave = "poke_" + LISTA_POKEMON.length;
    LISTA_POKEMON.push(p);
  });
});

// ===== Sonidos y música con Web Audio (sin archivos) =====
const MELODIA = [
  523, 0, 659, 0, 784, 0, 659, 0, 587, 0, 698, 0, 880, 0, 698, 0,
  523, 659, 784, 1047, 784, 659, 523, 0, 587, 698, 880, 698, 587, 0, 523, 0,
];
const BAJO = [131, 0, 131, 0, 196, 0, 196, 0, 175, 0, 175, 0, 196, 0, 196, 0];

const Sonido = {
  ctx: null,
  apagado: false,
  paso: 0,

  iniciar(escena) {
    const contexto = escena.sound && escena.sound.context;
    if (contexto) {
      this.ctx = contexto;
      if (contexto.state === "suspended") contexto.resume();
    }
  },
  alternar() { this.apagado = !this.apagado; },

  tono(frecuencia, duracion, tipo = "square", volumen = 0.1, hasta = null, retraso = 0) {
    if (!this.ctx || this.apagado || !CONFIG.sonidos) return;
    const t = this.ctx.currentTime + retraso;
    const oscilador = this.ctx.createOscillator();
    const vol = this.ctx.createGain();
    oscilador.type = tipo;
    oscilador.frequency.setValueAtTime(frecuencia, t);
    if (hasta) oscilador.frequency.exponentialRampToValueAtTime(hasta, t + duracion);
    vol.gain.setValueAtTime(volumen, t);
    vol.gain.exponentialRampToValueAtTime(0.001, t + duracion);
    oscilador.connect(vol);
    vol.connect(this.ctx.destination);
    oscilador.start(t);
    oscilador.stop(t + duracion + 0.05);
  },
  ruido(duracion, volumen = 0.2) {
    if (!this.ctx || this.apagado || !CONFIG.sonidos) return;
    const n = Math.floor(this.ctx.sampleRate * duracion);
    const buffer = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const datos = buffer.getChannelData(0);
    for (let i = 0; i < n; i++) datos[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const fuente = this.ctx.createBufferSource();
    const vol = this.ctx.createGain();
    fuente.buffer = buffer;
    vol.gain.value = volumen;
    fuente.connect(vol);
    vol.connect(this.ctx.destination);
    fuente.start();
  },

  salto() { this.tono(320, 0.16, "square", 0.08, 720); },
  saltoDoble() { this.tono(480, 0.18, "square", 0.08, 1000); },
  moneda() { this.tono(988, 0.07, "square", 0.07); this.tono(1319, 0.18, "square", 0.07, null, 0.06); },
  ataque() { this.tono(900, 0.12, "triangle", 0.12, 300); },
  explosion() { this.ruido(0.45, 0.25); this.tono(130, 0.4, "sawtooth", 0.12, 40); },
  danio() { this.tono(220, 0.35, "sawtooth", 0.14, 60); },
  vida() { [523, 659, 784, 1047].forEach((f, i) => this.tono(f, 0.12, "square", 0.08, null, i * 0.08)); },
  baya() { this.tono(300, 0.4, "sawtooth", 0.07, 900); },
  turbo() { this.tono(200, 0.3, "sawtooth", 0.06, 700); },
  victoria() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tono(f, 0.2, "square", 0.09, null, i * 0.14)); },
  derrota() { [392, 349, 311, 262].forEach((f, i) => this.tono(f, 0.28, "triangle", 0.12, null, i * 0.2)); },
  clic() { this.tono(520, 0.05, "square", 0.05); },

  // Música de fondo: una melodía alegre que se repite
  musica(escena) {
    if (!CONFIG.musica) return;
    this.paso = 0;
    escena.time.addEvent({
      delay: 170,
      loop: true,
      callback: () => {
        if (escena.pausado || escena.estado === "perdiendo") return;
        const melodia = MELODIA[this.paso % MELODIA.length];
        const bajo = BAJO[this.paso % BAJO.length];
        this.paso++;
        if (melodia) this.tono(melodia, 0.16, "square", 0.03);
        if (bajo) this.tono(bajo, 0.22, "triangle", 0.07);
      },
    });
  },
};

// ===== Utilidades =====
function oscuro(color, cantidad) {
  return Phaser.Display.Color.ValueToColor(color).darken(cantidad).color;
}

// ¿Toca un círculo a un rectángulo?
function circuloRect(cx, cy, radio, caja) {
  const px = Phaser.Math.Clamp(cx, caja.izq, caja.der);
  const py = Phaser.Math.Clamp(cy, caja.arr, caja.aba);
  const dx = cx - px;
  const dy = cy - py;
  return dx * dx + dy * dy < radio * radio;
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
  };
}

// ===== Dibujo de un Pokémon (cabe en un cuadro de 80x80) =====
function dibujarPokemon(g, p) {
  const borde = 0x1d1d2b;
  const tiene = (extra) => p.extras.includes(extra);
  g.lineStyle(2, borde, 1);

  // Cola (detrás del cuerpo)
  if (p.cola === "llama") {
    g.fillStyle(0xff7043, 1); g.fillTriangle(4, 62, 20, 44, 26, 66);
    g.fillStyle(0xffeb3b, 1); g.fillTriangle(10, 60, 20, 51, 22, 63);
  } else if (p.cola === "hoja") {
    g.fillStyle(p.acento, 1); g.fillEllipse(12, 54, 16, 30); g.strokeEllipse(12, 54, 16, 30);
  } else if (p.cola === "lagarto") {
    g.fillStyle(p.cuerpo, 1); g.fillTriangle(2, 68, 22, 48, 28, 68); g.strokeTriangle(2, 68, 22, 48, 28, 68);
  } else if (p.cola === "aleta") {
    g.fillStyle(p.acento, 1); g.fillTriangle(6, 50, 24, 58, 18, 72); g.strokeTriangle(6, 50, 24, 58, 18, 72);
  } else if (p.cola === "rizo") {
    g.fillStyle(p.cuerpo, 1); g.fillTriangle(4, 52, 24, 58, 18, 70); g.strokeTriangle(4, 52, 24, 58, 18, 70);
  }

  // Concha o caparazón (detrás)
  if (tiene("concha")) {
    g.fillStyle(p.acento, 1); g.fillEllipse(40, 54, 52, 40);
    g.strokeEllipse(40, 54, 52, 40);
  }
  // Bulbo en la espalda (detrás de la cabeza)
  if (tiene("bulbo")) {
    g.fillStyle(p.acento, 1); g.fillEllipse(40, 12, 38, 24);
    g.strokeEllipse(40, 12, 38, 24);
  }

  // Orejas
  if (p.orejas === "puntiaguda") {
    g.fillStyle(p.cuerpo, 1);
    g.fillTriangle(18, 20, 22, 0, 36, 12); g.strokeTriangle(18, 20, 22, 0, 36, 12);
    g.fillTriangle(62, 20, 58, 0, 44, 12); g.strokeTriangle(62, 20, 58, 0, 44, 12);
  } else if (p.orejas === "redonda") {
    g.fillStyle(p.cuerpo, 1);
    g.fillCircle(20, 14, 9); g.strokeCircle(20, 14, 9);
    g.fillCircle(60, 14, 9); g.strokeCircle(60, 14, 9);
    g.fillStyle(p.vientre, 1);
    g.fillCircle(20, 14, 4); g.fillCircle(60, 14, 4);
  } else if (p.orejas === "larga") {
    g.fillStyle(p.cuerpo, 1);
    g.fillTriangle(14, 24, 14, 0, 36, 14); g.strokeTriangle(14, 24, 14, 0, 36, 14);
    g.fillTriangle(66, 24, 66, 0, 44, 14); g.strokeTriangle(66, 24, 66, 0, 44, 14);
    g.fillStyle(p.acento, 1);
    g.fillTriangle(17, 18, 17, 7, 27, 14); g.fillTriangle(63, 18, 63, 7, 53, 14);
  }

  // Pies, cuerpo y vientre
  g.fillStyle(p.cuerpo, 1);
  g.fillEllipse(27, 73, 20, 10); g.strokeEllipse(27, 73, 20, 10);
  g.fillEllipse(53, 73, 20, 10); g.strokeEllipse(53, 73, 20, 10);
  g.fillEllipse(40, 54, 44, 36); g.strokeEllipse(40, 54, 44, 36);
  g.fillStyle(p.vientre, 1);
  g.fillEllipse(40, 58, 26, 22);

  // Cabeza
  g.fillStyle(p.cuerpo, 1);
  g.fillCircle(40, 30, 22); g.strokeCircle(40, 30, 22);

  // Ojos
  g.fillStyle(0xffffff, 1);
  g.fillCircle(31, 29, 6); g.fillCircle(49, 29, 6);
  g.fillStyle(borde, 1);
  g.fillCircle(32, 30, 3.2); g.fillCircle(50, 30, 3.2);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(33, 28.5, 1.2); g.fillCircle(51, 28.5, 1.2);

  // Boca (si no tiene pico, hocico o mandíbula)
  if (!tiene("pico") && !tiene("hocico") && !tiene("mandibula")) {
    g.lineStyle(2, borde, 1);
    g.beginPath();
    g.arc(40, 37, 6, 0.3, Math.PI - 0.3, false);
    g.strokePath();
  }

  // Rasgos de la cara y la cabeza
  if (tiene("hocico")) {
    g.fillStyle(p.vientre, 1); g.fillEllipse(40, 39, 20, 13); g.strokeEllipse(40, 39, 20, 13);
    g.fillStyle(borde, 1); g.fillCircle(36, 38, 1.5); g.fillCircle(44, 38, 1.5);
  }
  if (tiene("pico")) {
    g.fillStyle(0xffb300, 1); g.fillTriangle(33, 36, 47, 36, 40, 47); g.strokeTriangle(33, 36, 47, 36, 40, 47);
  }
  if (tiene("mandibula")) {
    g.fillStyle(0xe57373, 1); g.fillEllipse(40, 41, 26, 11); g.strokeEllipse(40, 41, 26, 11);
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(30, 37, 35, 37, 32, 42); g.fillTriangle(45, 37, 50, 37, 48, 42);
  }
  if (tiene("mejillas")) {
    g.fillStyle(p.acento, 1); g.fillCircle(21, 39, 5); g.fillCircle(59, 39, 5);
  }
  if (tiene("hoja")) {
    g.fillStyle(0x4caf50, 1); g.fillTriangle(40, 0, 31, 12, 49, 12); g.strokeTriangle(40, 0, 31, 12, 49, 12);
  }
  if (tiene("llama")) {
    g.fillStyle(0xff7043, 1); g.fillTriangle(40, 0, 31, 12, 49, 12);
    g.fillStyle(0xffeb3b, 1); g.fillTriangle(40, 5, 36, 12, 44, 12);
  }
  if (tiene("aleta")) {
    g.fillStyle(p.cuerpo, 1); g.fillTriangle(40, 0, 32, 12, 48, 12); g.strokeTriangle(40, 0, 32, 12, 48, 12);
  }
}

// Un Lambo (mirando a la izquierda) del color del Pokémon y con su dibujo en el lateral
function crearCoche(escena, p) {
  const clave = "coche_" + p.clave;
  if (escena.textures.exists(clave)) return clave;
  const g = escena.make.graphics({ x: 0, y: 0, add: false });
  const sombra = oscuro(p.cuerpo, 30);

  const negro = 0x15151f;
  const brillo = Phaser.Display.Color.ValueToColor(p.cuerpo).lighten(35).color;

  // Alerón trasero (detrás de la carrocería): patas y ala grande
  g.fillStyle(negro, 1);
  g.fillRect(168, 22, 4, 16);
  g.fillRect(178, 22, 4, 16);

  // Carrocería de cuña: morro bajo, techo curvo y cola alta (como en el dibujo)
  const cuerpo = [
    { x: 1, y: 54 }, { x: 2, y: 46 }, { x: 8, y: 43 }, { x: 60, y: 34 }, { x: 84, y: 25 },
    { x: 100, y: 16 }, { x: 116, y: 12 }, { x: 134, y: 12 }, { x: 150, y: 17 },
    { x: 166, y: 28 }, { x: 183, y: 34 }, { x: 186, y: 40 }, { x: 186, y: 54 },
  ];
  g.fillStyle(p.cuerpo, 1);
  g.lineStyle(2, negro, 1);
  g.fillPoints(cuerpo, true);
  g.strokePoints(cuerpo, true);

  // Franja inferior oscura y brillo del techo
  g.fillStyle(sombra, 1);
  g.fillRect(4, 49, 180, 5);
  g.lineStyle(2, brillo, 0.9);
  g.beginPath();
  g.moveTo(66, 33); g.lineTo(84, 24); g.lineTo(100, 15); g.lineTo(116, 11); g.lineTo(134, 11); g.lineTo(150, 16);
  g.strokePath();

  // Ventana triangular
  g.fillStyle(0x1c2733, 1);
  g.fillPoints([{ x: 82, y: 33 }, { x: 102, y: 19 }, { x: 118, y: 15 }, { x: 134, y: 15 }, { x: 152, y: 27 }, { x: 152, y: 33 }], true);
  g.fillStyle(0x5d7b99, 1);
  g.fillPoints([{ x: 92, y: 30 }, { x: 105, y: 21 }, { x: 114, y: 19 }, { x: 106, y: 30 }], true);

  // Línea de la puerta y toma de aire lateral
  g.lineStyle(1.5, negro, 0.5);
  g.strokeRect(78, 34, 62, 14);
  g.fillStyle(negro, 1);
  g.fillPoints([{ x: 144, y: 36 }, { x: 168, y: 34 }, { x: 168, y: 47 }, { x: 144, y: 47 }], true);
  g.fillStyle(sombra, 1);
  g.fillRect(148, 39, 16, 2); g.fillRect(148, 43, 16, 2);

  // Faros: delanteros finos y traseros rojos
  g.fillStyle(0xfff59d, 1);
  g.fillPoints([{ x: 3, y: 44 }, { x: 26, y: 40 }, { x: 26, y: 44 }, { x: 4, y: 48 }], true);
  g.fillStyle(0xff1744, 1); g.fillRect(182, 36, 4, 7);
  g.fillStyle(negro, 1); g.fillRect(1, 51, 32, 3);

  // Ruedas con llanta
  [38, 150].forEach((x) => {
    g.fillStyle(negro, 1); g.fillCircle(x, 52, 17);
    g.fillStyle(0x2b2b33, 1); g.fillCircle(x, 52, 14);
    g.fillStyle(0xcfd8dc, 1); g.fillCircle(x, 52, 8);
    g.fillStyle(0x78909c, 1); g.fillCircle(x, 52, 3);
    g.lineStyle(2, 0x78909c, 1);
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5;
      g.lineBetween(x, 52, x + Math.cos(a) * 8, 52 + Math.sin(a) * 8);
    }
  });

  // Ala del alerón (delante de las patas)
  g.fillStyle(negro, 1);
  g.fillPoints([{ x: 160, y: 19 }, { x: 188, y: 14 }, { x: 191, y: 20 }, { x: 164, y: 25 }], true);
  g.fillStyle(p.acento, 1);
  g.fillRect(166, 20, 20, 2);

  // Pegatina con el Pokémon en el lateral
  g.fillStyle(0xffffff, 0.95);
  g.fillCircle(104, 42, 14);
  g.lineStyle(2, negro, 0.8);
  g.strokeCircle(104, 42, 14);
  g.save();
  g.translateCanvas(104 - 14.4, 42 - 14.4);
  g.scaleCanvas(0.36, 0.36);
  dibujarPokemon(g, p);
  g.restore();

  g.generateTexture(clave, 192, 70);
  g.destroy();
  return clave;
}

// ===== Científico (mirando a la izquierda) basado en el dibujo del equipo =====
// conPocion = true: lleva el matraz en la mano; false: ya lo ha lanzado
function dibujarCientifico(g, conPocion) {
  const borde = 0x1d1d2b;
  const pelo = 0x5d3a22;
  const peloBorde = 0x2b1a10;
  g.lineStyle(2, borde, 1);

  // Piernas y zapatos
  g.fillStyle(0x37474f, 1);
  g.fillRect(38, 128, 9, 15); g.fillRect(53, 128, 9, 15);
  g.fillStyle(0x222222, 1);
  g.fillEllipse(39, 146, 18, 7); g.fillEllipse(55, 146, 18, 7);

  // Brazo de atrás
  g.lineStyle(8, 0xf5f5f5, 1);
  g.lineBetween(64, 94, 72, 114);
  g.fillStyle(0xf5c9a0, 1); g.fillCircle(72, 116, 5);

  // Bata blanca con cuello y botones
  g.fillStyle(0xfafafa, 1);
  g.fillRoundedRect(29, 84, 42, 48, 9);
  g.lineStyle(2, borde, 1);
  g.strokeRoundedRect(29, 84, 42, 48, 9);
  g.lineStyle(2, 0xb0bec5, 1);
  g.lineBetween(50, 90, 50, 130);
  g.fillStyle(0x66bb6a, 1); g.fillCircle(38, 118, 4); // mancha de química
  g.fillStyle(0x546e7a, 1); g.fillCircle(46, 100, 1.8); g.fillCircle(46, 110, 1.8);

  // Pelo rizado por detrás de la cara
  g.fillStyle(pelo, 1);
  g.lineStyle(1.5, peloBorde, 1);
  for (let a = 0; a < 360; a += 30) {
    const r = Phaser.Math.DegToRad(a);
    const s = Math.sin(r);
    if (s > 0.55) continue;
    const cx = 50 + Math.cos(r) * 22;
    const cy = 68 + s * 20;
    g.fillCircle(cx, cy, 9); g.strokeCircle(cx, cy, 9);
  }

  // Cara
  g.fillStyle(0xf5c9a0, 1);
  g.lineStyle(2, borde, 1);
  g.fillCircle(50, 69, 17); g.strokeCircle(50, 69, 17);
  g.fillStyle(0xf48fb1, 0.7);
  g.fillCircle(39, 74, 3.5); g.fillCircle(61, 74, 3.5);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(43, 66, 4.5); g.fillCircle(57, 66, 4.5);
  g.fillStyle(borde, 1);
  g.fillCircle(42, 67, 2.4); g.fillCircle(56, 67, 2.4);
  g.lineStyle(2, borde, 1);
  g.beginPath(); g.arc(50, 73, 6, 0.2, Math.PI - 0.2, false); g.strokePath();

  // Flequillo de rizos
  g.fillStyle(pelo, 1);
  g.lineStyle(1.5, peloBorde, 1);
  [[37, 56], [46, 52], [56, 52], [64, 57]].forEach(([x, y]) => { g.fillCircle(x, y, 7); g.strokeCircle(x, y, 7); });

  // Sombrero de pico doblado
  g.fillStyle(0x4527a0, 1);
  g.lineStyle(2, borde, 1);
  g.fillEllipse(50, 47, 74, 12); g.strokeEllipse(50, 47, 74, 12);
  const cono = [
    { x: 34, y: 46 }, { x: 66, y: 46 }, { x: 61, y: 28 }, { x: 52, y: 16 },
    { x: 30, y: 6 }, { x: 33, y: 17 }, { x: 40, y: 30 },
  ];
  g.fillPoints(cono, true);
  g.strokePoints(cono, true);
  g.fillStyle(0xffd54f, 1);
  g.fillRect(36, 38, 29, 6);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(52, 31, 2.2);

  // Brazo que lanza (hacia la izquierda) y matraz
  g.lineStyle(8, 0xf5f5f5, 1);
  g.lineBetween(35, 92, 18, 104);
  g.fillStyle(0xf5c9a0, 1); g.fillCircle(16, 105, 5);
  if (conPocion) {
    g.lineStyle(2, 0x4a148c, 1);
    g.fillStyle(0xb0bec5, 1); g.fillRect(8, 78, 8, 10); g.strokeRect(8, 78, 8, 10);
    g.fillStyle(0x8e24aa, 1);
    g.fillPoints([{ x: 9, y: 88 }, { x: 15, y: 88 }, { x: 25, y: 106 }, { x: 0, y: 106 }], true);
    g.strokePoints([{ x: 9, y: 88 }, { x: 15, y: 88 }, { x: 25, y: 106 }, { x: 0, y: 106 }], true);
    g.fillStyle(0xce93d8, 1); g.fillCircle(8, 100, 2.5);
    g.fillStyle(0xffeb3b, 1); g.fillCircle(16, 101, 2); g.fillCircle(12, 96, 1.5);
    g.fillStyle(0xf5c9a0, 1); g.fillCircle(14, 106, 4.5);
  }
}

// ===== Texturas: dibujamos todo con código (no hacen falta imágenes) =====
function crearTexturas(escena) {
  const g = escena.make.graphics({ x: 0, y: 0, add: false });
  const guardar = (nombre, ancho, alto) => { g.generateTexture(nombre, ancho, alto); g.clear(); };

  // Cielo con degradado
  const cielo = escena.textures.createCanvas("cielo", CONFIG.ancho, CONFIG.alto);
  const degradado = cielo.context.createLinearGradient(0, 0, 0, CONFIG.alto);
  degradado.addColorStop(0, "#3d9be9");
  degradado.addColorStop(0.65, "#a8dcf7");
  degradado.addColorStop(1, "#fdeccb");
  cielo.context.fillStyle = degradado;
  cielo.context.fillRect(0, 0, CONFIG.ancho, CONFIG.alto);
  cielo.refresh();

  // Sol
  g.fillStyle(0xfff59d, 0.35); g.fillCircle(60, 60, 60);
  g.fillStyle(0xfff176, 0.6); g.fillCircle(60, 60, 42);
  g.fillStyle(0xffeb3b, 1); g.fillCircle(60, 60, 30);
  guardar("sol", 120, 120);

  // Nube
  g.fillStyle(0xffffff, 0.95);
  g.fillCircle(40, 38, 22); g.fillCircle(72, 28, 28); g.fillCircle(106, 36, 24);
  g.fillRoundedRect(20, 38, 108, 22, 11);
  guardar("nube", 150, 64);

  // Ciudad lejana (siluetas azuladas, incluye unas torres altas)
  g.fillStyle(0xa7cbe8, 1);
  let x = 0;
  while (x < 960) {
    const resto = 960 - x;
    const ancho = resto < 150 ? resto : Phaser.Math.Between(50, 100);
    const alto = Phaser.Math.Between(70, 170);
    g.fillRect(x, 240 - alto, ancho, alto);
    x += ancho;
  }
  g.fillStyle(0x93bddf, 1);
  [[700, 235], [738, 215], [776, 200], [814, 225]].forEach(([tx, alto]) => g.fillRect(tx, 240 - alto, 34, alto));
  guardar("lejos", 960, 240);

  // Ciudad cercana estilo Madrid (fachadas, tejados de pizarra, Metrópolis y Puerta de Alcalá)
  const colores = [0xf3e1b5, 0xe8a07a, 0xe0b45a, 0xefc3c3, 0xf5efe6];
  const suelo = 300;
  const fachada = (px, ancho, alto, color) => {
    const y0 = suelo - alto;
    g.fillStyle(color, 1); g.fillRect(px, y0, ancho, alto);
    g.fillStyle(oscuro(color, 22), 1); g.fillRect(px, suelo - 26, ancho, 26);
    g.fillStyle(0x4a5568, 1);
    g.fillPoints([{ x: px + 6, y: y0 - 24 }, { x: px + ancho - 6, y: y0 - 24 }, { x: px + ancho, y: y0 }, { x: px, y: y0 }], true);
    g.fillStyle(0x2d3748, 1); g.fillRect(px + ancho / 2 - 7, y0 - 19, 14, 13);
    const columnas = Math.floor((ancho - 14) / 26);
    const filas = Math.floor((alto - 70) / 42);
    const margen = (ancho - columnas * 26) / 2 + 6;
    for (let f = 0; f < filas; f++) {
      for (let c = 0; c < columnas; c++) {
        const wx = px + margen + c * 26;
        const wy = y0 + 16 + f * 42;
        g.fillStyle(0xffffff, 1); g.fillRect(wx - 1, wy - 1, 16, 26);
        g.fillStyle(0x3a5775, 1); g.fillRect(wx, wy, 14, 24);
        g.fillStyle(0x222222, 1); g.fillRect(wx - 3, wy + 20, 20, 3);
      }
    }
    g.fillStyle(0xb3e5fc, 1); // escaparates
    for (let c = 0; c < columnas; c++) g.fillRect(px + margen + c * 26 - 2, suelo - 20, 18, 16);
    g.lineStyle(2, 0x000000, 0.18); g.strokeRect(px, y0, ancho, alto);
  };

  const metropolis = (px) => {
    const ancho = 150;
    const y0 = 90;
    g.fillStyle(0xf1ead8, 1); g.fillRect(px, y0, ancho, suelo - y0);
    g.fillRect(px + 35, y0 - 50, 80, 50);
    g.fillStyle(0xd8cfb8, 1);
    g.fillRect(px, y0, ancho, 8); g.fillRect(px, y0 + 90, ancho, 6); g.fillRect(px + 30, y0 - 4, 90, 6);
    g.fillStyle(0x37474f, 1);
    g.fillEllipse(px + 75, y0 - 52, 76, 56);
    g.fillStyle(0xffd54f, 1);
    g.fillRect(px + 72, y0 - 92, 6, 14); g.fillCircle(px + 75, y0 - 98, 5);
    for (let f = 0; f < 4; f++) {
      for (let c = 0; c < 5; c++) {
        g.fillStyle(0x3a5775, 1); g.fillRect(px + 14 + c * 27, y0 + 18 + f * 44, 14, 26);
        g.fillStyle(0x222222, 1); g.fillRect(px + 11 + c * 27, y0 + 40 + f * 44, 20, 3);
      }
    }
    g.fillStyle(0xd7c9a8, 1); g.fillRect(px, suelo - 26, ancho, 26);
    g.lineStyle(2, 0x000000, 0.18); g.strokeRect(px, y0, ancho, suelo - y0);
  };

  const puerta = (px) => {
    g.fillStyle(0xe6d9b8, 1); g.fillRect(px, suelo - 130, 240, 130);
    g.fillStyle(0xdccfae, 1); g.fillRect(px + 60, suelo - 168, 120, 38);
    g.fillTriangle(px + 80, suelo - 168, px + 120, suelo - 194, px + 160, suelo - 168);
    g.fillStyle(0xcdbf99, 1);
    g.fillRect(px - 4, suelo - 136, 248, 8);
    g.fillRect(px + 75, suelo - 130, 8, 130); g.fillRect(px + 157, suelo - 130, 8, 130);
    g.fillRect(px + 26, suelo - 152, 10, 16); g.fillRect(px + 204, suelo - 152, 10, 16);
    g.fillStyle(0x6d5a3d, 1);
    g.fillRect(px + 98, suelo - 100, 44, 100); g.fillCircle(px + 120, suelo - 100, 22);
    g.fillRect(px + 40, suelo - 85, 30, 85); g.fillCircle(px + 55, suelo - 85, 15);
    g.fillRect(px + 170, suelo - 85, 30, 85); g.fillCircle(px + 185, suelo - 85, 15);
    g.fillRect(px + 10, suelo - 60, 22, 60); g.fillRect(px + 208, suelo - 60, 22, 60);
    g.lineStyle(2, 0x000000, 0.18); g.strokeRect(px, suelo - 130, 240, 130);
  };

  fachada(0, 70, 190, colores[0]);
  metropolis(70);
  fachada(220, 90, 200, colores[1]);
  fachada(310, 110, 230, colores[2]);
  fachada(420, 100, 180, colores[3]);
  puerta(520);
  fachada(760, 90, 210, colores[4]);
  fachada(850, 110, 240, colores[1]);
  guardar("cerca", 960, 300);

  // Calle: acera, bordillo, asfalto y línea discontinua
  g.fillStyle(0xd7d2c8, 1); g.fillRect(0, 0, 160, 22);
  g.fillStyle(0xbdb7aa, 1); g.fillRect(0, 0, 160, 3); g.fillRect(79, 0, 2, 22);
  g.fillStyle(0x9a958a, 1); g.fillRect(0, 22, 160, 6);
  g.fillStyle(0x3c4048, 1); g.fillRect(0, 28, 160, 72);
  g.fillStyle(0x4a4f59, 1); g.fillRect(30, 40, 6, 3); g.fillRect(110, 80, 8, 3); g.fillRect(70, 90, 5, 3);
  g.fillStyle(0xffffff, 0.9); g.fillRect(0, 62, 80, 5);
  guardar("calle", 160, 100);

  // Moneda
  g.fillStyle(0xff8f00, 1); g.fillCircle(18, 18, 16);
  g.fillStyle(0xffca28, 1); g.fillCircle(18, 18, 13);
  g.lineStyle(2, 0xff8f00, 1); g.strokeCircle(18, 18, 8);
  g.fillStyle(0xfff8e1, 1); g.fillRect(12, 9, 3, 7);
  guardar("moneda", 36, 36);

  // Pokeball
  g.fillStyle(0xffffff, 1); g.fillCircle(18, 18, 16);
  g.fillStyle(0xe53935, 1);
  g.beginPath(); g.moveTo(2, 18); g.arc(18, 18, 16, Math.PI, Math.PI * 2, false); g.closePath(); g.fillPath();
  g.fillStyle(0x222222, 1); g.fillRect(2, 16, 32, 4); g.fillCircle(18, 18, 6);
  g.fillStyle(0xffffff, 1); g.fillCircle(18, 18, 3.5);
  g.lineStyle(2, 0x222222, 1); g.strokeCircle(18, 18, 16);
  guardar("pokeball", 36, 36);

  // Baya (turbo)
  g.fillStyle(0xe91e63, 1); g.fillCircle(17, 23, 13);
  g.fillStyle(0xff80ab, 1); g.fillCircle(12, 18, 4.5);
  g.fillStyle(0x4caf50, 1); g.fillTriangle(17, 11, 8, 2, 24, 4);
  g.lineStyle(2, 0x880e4f, 1); g.strokeCircle(17, 23, 13);
  guardar("baya", 34, 38);

  // Poción explosiva
  g.fillStyle(0x8d6e63, 1); g.fillRect(15, 0, 10, 8);
  g.fillStyle(0xb0bec5, 1); g.fillRect(14, 6, 12, 12);
  g.fillStyle(0x8e24aa, 1); g.fillCircle(20, 30, 16);
  g.fillStyle(0xce93d8, 1); g.fillCircle(14, 25, 5);
  g.fillStyle(0xffeb3b, 1); g.fillCircle(26, 34, 3); g.fillCircle(21, 38, 2);
  g.lineStyle(2, 0x4a148c, 1); g.strokeCircle(20, 30, 16); g.strokeRect(14, 6, 12, 12);
  guardar("pocion", 40, 48);

  // Explosión
  g.fillStyle(0xff5722, 0.9); g.fillCircle(50, 50, 42);
  g.fillStyle(0xff9800, 1); g.fillCircle(50, 50, 31);
  g.fillStyle(0xffeb3b, 1); g.fillCircle(50, 50, 19);
  g.fillStyle(0xffffff, 1); g.fillCircle(50, 50, 8);
  guardar("boom", 100, 100);

  // Tajo del ataque
  g.lineStyle(12, 0xffffff, 1);
  g.beginPath(); g.arc(0, 50, 60, -0.9, 0.9, false); g.strokePath();
  g.lineStyle(5, 0xffeb3b, 1);
  g.beginPath(); g.arc(0, 50, 60, -0.9, 0.9, false); g.strokePath();
  guardar("tajo", 70, 100);

  // Polvo y brillo
  g.fillStyle(0xffffff, 1); g.fillCircle(8, 8, 8);
  guardar("puff", 16, 16);
  g.fillStyle(0xffffff, 1); g.fillCircle(3, 3, 2);
  guardar("brillo", 6, 6);

  // Meta: franja de cuadros y poste
  for (let fila = 0; fila < 10; fila++) {
    for (let col = 0; col < 4; col++) {
      g.fillStyle((fila + col) % 2 === 0 ? 0x111111 : 0xffffff, 1);
      g.fillRect(col * 10, fila * 10, 10, 10);
    }
  }
  guardar("cuadros", 40, 100);
  g.fillStyle(0xeeeeee, 1); g.fillRect(0, 0, 12, 130);
  g.fillStyle(0xe53935, 1);
  for (let y = 0; y < 130; y += 26) g.fillRect(0, y, 12, 13);
  guardar("poste", 12, 130);

  // Centro Pokémon
  g.fillStyle(0xfff5f0, 1); g.fillRect(20, 90, 200, 110);
  g.lineStyle(3, 0xc9a9a2, 1); g.strokeRect(20, 90, 200, 110);
  g.fillStyle(0xe53935, 1); g.fillRoundedRect(8, 50, 224, 50, 14);
  g.lineStyle(3, 0x9b1c1c, 1); g.strokeRoundedRect(8, 50, 224, 50, 14);
  g.fillStyle(0xffffff, 1); g.fillCircle(120, 30, 28);
  g.fillStyle(0xe53935, 1);
  g.beginPath(); g.moveTo(92, 30); g.arc(120, 30, 28, Math.PI, Math.PI * 2, false); g.closePath(); g.fillPath();
  g.fillStyle(0x222222, 1); g.fillRect(92, 28, 56, 5); g.fillCircle(120, 30, 9);
  g.fillStyle(0xffffff, 1); g.fillCircle(120, 30, 5);
  g.lineStyle(3, 0x222222, 1); g.strokeCircle(120, 30, 28);
  g.fillStyle(0xb3e5fc, 1); g.fillRect(36, 118, 44, 50); g.fillRect(160, 118, 44, 50);
  g.fillStyle(0x80d8ff, 1); g.fillRect(98, 130, 44, 70);
  g.fillStyle(0xffffff, 1); g.fillRect(119, 130, 2, 70);
  g.fillStyle(0xe53935, 1); g.fillRect(116, 104, 8, 22); g.fillRect(109, 111, 22, 8);
  guardar("centro", 240, 200);

  // Científico con y sin matraz
  dibujarCientifico(g, true);
  guardar("cientifico", 100, 150);
  dibujarCientifico(g, false);
  guardar("cientifico_sin", 100, 150);

  g.destroy();

  // Un dibujo por cada Pokémon
  const gp = escena.make.graphics({ x: 0, y: 0, add: false });
  LISTA_POKEMON.forEach((p) => {
    dibujarPokemon(gp, p);
    gp.generateTexture(p.clave, 80, 80);
    gp.clear();
  });
  gp.destroy();
}

// ===== Ciudad de fondo (cielo, nubes, edificios y calle) =====
function crearCiudad(escena) {
  const ciudad = {};
  escena.add.image(0, 0, "cielo").setOrigin(0).setDepth(-50);
  escena.add.image(820, 100, "sol").setDepth(-49);
  ciudad.nubes = [];
  for (let i = 0; i < 5; i++) {
    const nube = escena.add.image(Phaser.Math.Between(0, CONFIG.ancho), Phaser.Math.Between(30, 190), "nube")
      .setScale(Phaser.Math.FloatBetween(0.7, 1.3)).setAlpha(0.9).setDepth(-48);
    ciudad.nubes.push(nube);
  }
  ciudad.lejos = escena.add.tileSprite(0, 200, CONFIG.ancho, 240, "lejos").setOrigin(0).setDepth(-45);
  ciudad.cerca = escena.add.tileSprite(0, 140, CONFIG.ancho, 300, "cerca").setOrigin(0).setDepth(-40);
  ciudad.calle = escena.add.tileSprite(0, 440, CONFIG.ancho, 100, "calle").setOrigin(0).setDepth(-30);
  return ciudad;
}

// Mueve las capas a distinta velocidad para dar sensación de profundidad
function moverCiudad(ciudad, distancia, dt) {
  ciudad.calle.tilePositionX = distancia;
  ciudad.cerca.tilePositionX = distancia * 0.45;
  ciudad.lejos.tilePositionX = distancia * 0.15;
  ciudad.nubes.forEach((nube, i) => {
    nube.x -= (8 + i * 3) * dt;
    if (nube.x < -120) nube.x = CONFIG.ancho + 120;
  });
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
    Sonido.iniciar(this);
    this.ciudad = crearCiudad(this);
    this.distancia = 0;
    const centro = CONFIG.ancho / 2;

    const titulo = this.add.text(centro, 100, "Pokecarrera", estiloTexto(88, "#ffd54f")).setOrigin(0.5);
    this.tweens.add({ targets: titulo, y: 120, duration: 1200, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    this.add.text(centro, 188, "¡Corre por Madrid, esquiva Lambos y las pociones del científico!", estiloTexto(26)).setOrigin(0.5);

    this.add.rectangle(centro, 318, 780, 140, 0x1a1a2e, 0.65).setStrokeStyle(3, 0xffffff, 0.6);
    this.add.text(centro, 318,
      "⬆ / W / ESPACIO: saltar (¡dos veces = doble salto!)\n" +
      "X: ataque que rompe pociones  ·  SHIFT: turbo\n" +
      "P: pausa  ·  M: sonido\n" +
      `🏁 Llega a la meta con ${CONFIG.monedasParaGanar} 🪙 como mínimo. ¡${CONFIG.vidas} golpes y pierdes!`,
      { ...estiloTexto(21), align: "center", lineSpacing: 6 }).setOrigin(0.5);

    const empezar = this.add.text(centro, 432, "Pulsa ENTER para elegir tu región", estiloTexto(34, "#80ff9a")).setOrigin(0.5);
    this.tweens.add({ targets: empezar, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

    // Pokémon al azar saltando por la calle
    Phaser.Utils.Array.Shuffle(LISTA_POKEMON.slice()).slice(0, 5).forEach((p, i) => {
      const corredor = this.add.image(110 + i * 185, 520, p.clave).setOrigin(0.5, 0.97).setScale(0.8).setDepth(10);
      this.tweens.add({ targets: corredor, y: 492, duration: 380, delay: i * 140, yoyo: true, repeat: -1, ease: "Quad.easeOut" });
    });

    this.input.keyboard.once("keydown-ENTER", () => { Sonido.clic(); this.scene.start("Regiones"); });
  }
  update(time, delta) {
    this.distancia += 180 * delta / 1000;
    moverCiudad(this.ciudad, this.distancia, delta / 1000);
  }
}

// ===== Elegir región =====
class Regiones extends Phaser.Scene {
  constructor() { super("Regiones"); }
  create() {
    Sonido.iniciar(this);
    this.ciudad = crearCiudad(this);
    this.distancia = 0;
    this.yaElegida = false;
    this.seleccion = 0;
    this.add.rectangle(CONFIG.ancho / 2, CONFIG.alto / 2, CONFIG.ancho, CONFIG.alto, 0x10162b, 0.55).setDepth(-20);
    this.add.text(CONFIG.ancho / 2, 48, "Elige tu región", estiloTexto(50, "#ffd54f")).setOrigin(0.5);

    this.celdas = [];
    REGIONES.forEach((region, i) => {
      const x = 40 + (i % 3) * 300 + 140;
      const y = 104 + Math.floor(i / 3) * 117 + 52;
      const contenedor = this.add.container(x, y);
      const fondo = this.add.graphics();
      fondo.fillStyle(0x1b2340, 0.92); fondo.fillRoundedRect(-140, -52, 280, 104, 18);
      fondo.fillStyle(region.color, 1); fondo.fillRoundedRect(-140, -52, 14, 104, { tl: 18, bl: 18, tr: 0, br: 0 });
      const marco = this.add.graphics();
      const nombre = this.add.text(-112, -28, region.nombre, estiloTexto(30)).setOrigin(0, 0.5);
      contenedor.add([fondo, marco, nombre]);
      region.pokemon.forEach((p, k) => {
        contenedor.add(this.add.image(-76 + k * 68, 20, p.clave).setScale(0.62));
      });
      const zona = this.add.zone(x, y, 280, 104).setInteractive({ useHandCursor: true });
      zona.on("pointerover", () => this.elegir(i));
      zona.on("pointerdown", () => this.confirmar(i));
      this.celdas.push({ contenedor, marco });
    });

    this.add.text(CONFIG.ancho / 2, 495, "← ↑ ↓ → para moverte  ·  ENTER para elegir", estiloTexto(24)).setOrigin(0.5);

    const k = this.input.keyboard;
    k.on("keydown-LEFT", () => this.mover(-1));
    k.on("keydown-RIGHT", () => this.mover(1));
    k.on("keydown-UP", () => this.mover(-3));
    k.on("keydown-DOWN", () => this.mover(3));
    k.on("keydown-ENTER", () => this.confirmar(this.seleccion));
    this.resaltar();
  }
  update(time, delta) {
    this.distancia += 180 * delta / 1000;
    moverCiudad(this.ciudad, this.distancia, delta / 1000);
  }
  mover(paso) {
    const nuevo = this.seleccion + paso;
    if (nuevo < 0 || nuevo >= REGIONES.length) return;
    Sonido.clic();
    this.elegir(nuevo);
  }
  elegir(i) {
    this.seleccion = i;
    this.resaltar();
  }
  resaltar() {
    this.celdas.forEach((celda, i) => {
      celda.marco.clear();
      const activa = i === this.seleccion;
      if (activa) {
        celda.marco.lineStyle(5, 0xffffff, 1);
        celda.marco.strokeRoundedRect(-140, -52, 280, 104, 18);
      }
      celda.contenedor.setScale(activa ? 1.06 : 1);
    });
  }
  confirmar(i) {
    if (this.yaElegida) return;
    this.yaElegida = true;
    Sonido.moneda();
    this.scene.start("Ruleta", { region: i });
  }
}

// ===== Ruleta: te toca un Pokémon de la región al azar =====
class Ruleta extends Phaser.Scene {
  constructor() { super("Ruleta"); }
  create(datos) {
    Sonido.iniciar(this);
    this.ciudad = crearCiudad(this);
    this.distancia = 0;
    this.add.rectangle(CONFIG.ancho / 2, CONFIG.alto / 2, CONFIG.ancho, CONFIG.alto, 0x10162b, 0.6).setDepth(-20);
    const region = REGIONES[datos.region];
    this.region = region;
    this.fase = "espera";
    this.add.text(CONFIG.ancho / 2, 40, `Ruleta de ${region.nombre}`, estiloTexto(46, "#ffd54f")).setOrigin(0.5);

    const cx = CONFIG.ancho / 2;
    const cy = 275;
    const radio = 165;
    this.rueda = this.add.container(cx, cy);
    const colores = [0xef5350, 0x42a5f5, 0x66bb6a];
    const trozos = this.add.graphics();
    this.rueda.add(trozos);
    this.imagenes = [];
    region.pokemon.forEach((p, i) => {
      const inicio = Phaser.Math.DegToRad(i * 120 - 150);
      const fin = Phaser.Math.DegToRad(i * 120 - 30);
      trozos.fillStyle(colores[i], 1);
      trozos.beginPath(); trozos.moveTo(0, 0); trozos.arc(0, 0, radio, inicio, fin, false); trozos.closePath(); trozos.fillPath();
      trozos.lineStyle(4, 0xffffff, 1); trozos.strokePath();
      const medio = Phaser.Math.DegToRad(i * 120 - 90);
      const imagen = this.add.image(Math.cos(medio) * 100, Math.sin(medio) * 100, p.clave).setScale(1.25).setAngle(i * 120);
      this.rueda.add(imagen);
      this.imagenes.push(imagen);
    });
    trozos.lineStyle(8, 0xffd54f, 1); trozos.strokeCircle(0, 0, radio);
    trozos.fillStyle(0xffffff, 1); trozos.fillCircle(0, 0, 16);

    // Flecha fija que marca el ganador
    const puntero = this.add.graphics().setDepth(5);
    puntero.fillStyle(0xffd54f, 1);
    puntero.fillTriangle(cx - 20, cy - radio - 28, cx + 20, cy - radio - 28, cx, cy - radio + 14);
    puntero.lineStyle(3, 0x1a1a2e, 1);
    puntero.strokeTriangle(cx - 20, cy - radio - 28, cx + 20, cy - radio - 28, cx, cy - radio + 14);

    this.resultado = this.add.text(cx, 462, "", estiloTexto(36, "#ffd54f")).setOrigin(0.5);
    this.mensaje = this.add.text(cx, 505, "Pulsa ENTER para girar la ruleta 🎡", estiloTexto(30, "#80ff9a")).setOrigin(0.5);
    this.parpadeo = this.tweens.add({ targets: this.mensaje, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

    this.input.keyboard.on("keydown-ENTER", () => {
      if (this.fase === "espera") this.girar();
      else if (this.fase === "listo") this.empezar();
    });
  }
  update(time, delta) {
    this.distancia += 180 * delta / 1000;
    moverCiudad(this.ciudad, this.distancia, delta / 1000);
  }
  girar() {
    this.fase = "girando";
    this.parpadeo.stop();
    this.mensaje.setAlpha(1).setText("¡Girando…!");
    const indice = Phaser.Math.Between(0, 2);
    this.indice = indice;
    this.elegido = this.region.pokemon[indice];
    let ultimo = 0;
    this.tweens.add({
      targets: this.rueda,
      angle: 360 * 5 - indice * 120,
      duration: 4200,
      ease: "Cubic.easeOut",
      onUpdate: () => {
        const n = Math.floor(this.rueda.angle / 40);
        if (n !== ultimo) { ultimo = n; Sonido.tono(700, 0.04, "square", 0.05); }
      },
      onComplete: () => this.mostrarResultado(),
    });
  }
  mostrarResultado() {
    this.fase = "listo";
    Sonido.victoria();
    this.resultado.setText(`¡Te ha tocado ${this.elegido.nombre}!`);
    this.mensaje.setText("Pulsa ENTER para correr 🏃");
    this.tweens.add({ targets: this.mensaje, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });
    this.tweens.add({ targets: this.imagenes[this.indice], scale: { from: 1.25, to: 1.7 }, duration: 350, yoyo: true, repeat: 2 });
  }
  empezar() {
    this.registry.set("pokemon", this.elegido);
    this.scene.start("Juego");
  }
}

// ===== El juego =====
class Juego extends Phaser.Scene {
  constructor() { super("Juego"); }

  create() {
    Sonido.iniciar(this);
    this.pokemon = this.registry.get("pokemon") || LISTA_POKEMON[0];
    this.claveCoche = crearCoche(this, this.pokemon);
    this.ciudad = crearCiudad(this);
    this.px = CONFIG.posicionJugador;

    // Estado de la partida
    this.distancia = 0;
    this.velocidad = CONFIG.velocidadInicial;
    this.vidas = CONFIG.vidas;
    this.monedas = 0;
    this.tiempo = 0;
    this.estado = "corriendo"; // corriendo, llegando o perdiendo
    this.pausado = false;
    this.turbo = CONFIG.turboMaximo / 2;
    this.turboActivo = false;
    this.y = CONFIG.suelo;
    this.vy = 0;
    this.saltos = 0;
    this.invulnerable = 0;
    this.ataqueRestante = 0;
    this.ataqueEspera = 0;
    this.contadorPolvo = 0;
    this.coches = [];
    this.pociones = [];
    this.cientificos = [];
    this.explosiones = [];
    this.recogibles = [];
    this.decorados = [];

    // Centros Pokémon: uno al salir y otro al llegar, y la meta
    this.ponerCentro(620);
    this.ponerCentro(CONFIG.longitudPista + 420);
    this.ponerMeta(CONFIG.longitudPista);

    // Tu Pokémon
    this.jugador = this.add.image(this.px, CONFIG.suelo, this.pokemon.clave)
      .setOrigin(0.5, 0.97).setScale(1.1).setDepth(20);

    // Efectos de partículas
    this.chispas = this.add.particles(0, 0, "brillo", {
      speed: { min: 80, max: 300 },
      scale: { start: 1.8, end: 0 },
      lifespan: 550,
      emitting: false,
    }).setDepth(30);
    this.polvo = this.add.particles(0, 0, "puff", {
      speedX: { min: -260, max: -120 },
      speedY: { min: -60, max: -10 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 400,
      emitting: false,
    }).setDepth(19);

    this.crearNivel();
    this.crearMarcador();

    this.teclas = this.input.keyboard.addKeys("UP,W,SPACE,X,SHIFT,P,M");
    Sonido.musica(this);
  }

  // ----- Preparar el recorrido -----
  crearNivel() {
    this.eventos = [];
    this.siguiente = 0;
    this.ponerMonedas(900, "fila");
    let x = 1500;
    const fin = CONFIG.longitudPista - 900;
    while (x < fin) {
      const azar = Math.random();
      if (azar < CONFIG.probCoche) {
        this.eventos.push({ tipo: "coche", x, v: Phaser.Math.Between(CONFIG.velocidadCocheMin, CONFIG.velocidadCocheMax) });
      } else if (azar < CONFIG.probCoche + CONFIG.probPocion) {
        this.eventos.push({ tipo: "pocion", x });
      } else {
        this.ponerMonedas(x, Math.random() < 0.6 ? "arco" : "fila");
      }
      x += Phaser.Math.Between(CONFIG.huecoMin, CONFIG.huecoMax);
    }
    // Pocas Pokeballs (vida extra) y bayas (turbo extra)
    [0.3, 0.62, 0.86].forEach((f) => this.ponerRecogible("pokeball", CONFIG.longitudPista * f, CONFIG.suelo - 150));
    [0.15, 0.38, 0.58, 0.78].forEach((f) => this.ponerRecogible("baya", CONFIG.longitudPista * f, CONFIG.suelo - 70));
  }

  ponerMonedas(x, forma) {
    for (let i = 0; i < 4; i++) {
      const alto = forma === "arco" ? CONFIG.suelo - 40 - Math.sin((i / 3) * Math.PI) * 110 : CONFIG.suelo - 40;
      this.ponerRecogible("moneda", x + i * 55, alto);
    }
  }

  ponerRecogible(tipo, mundoX, y) {
    const imagen = this.add.image(0, y, tipo).setDepth(15);
    if (tipo === "pokeball") imagen.setScale(1.25);
    this.recogibles.push({ imagen, tipo, mundoX, y, cogido: false, fase: Math.random() * 6 });
  }

  ponerCentro(mundoX) {
    const edificio = this.add.image(0, 462, "centro").setOrigin(0.5, 1);
    const letrero = this.add.text(0, 462 - 135, "CENTRO POKÉMON", estiloTexto(16)).setOrigin(0.5);
    const contenedor = this.add.container(0, 0, [edificio, letrero]).setDepth(-29);
    this.decorados.push({ contenedor, mundoX });
  }

  ponerMeta(mundoX) {
    const cuadros = this.add.image(0, 440, "cuadros").setOrigin(0.5, 0);
    const poste = this.add.image(-24, 440, "poste").setOrigin(0.5, 1);
    const cartel = this.add.text(0, 318, "🏁 META 🏁", estiloTexto(44, "#ffd54f")).setOrigin(0.5);
    const contenedor = this.add.container(0, 0, [poste, cuadros, cartel]).setDepth(-29);
    this.decorados.push({ contenedor, mundoX });
  }

  crearMarcador() {
    this.barras = this.add.graphics().setDepth(100);
    this.textoMonedas = this.add.text(20, 8, "", estiloTexto(30)).setDepth(100);
    this.textoVidas = this.add.text(20, 48, "", estiloTexto(26)).setDepth(100);
    this.add.text(20, 93, "⚡", estiloTexto(22)).setDepth(100);
    this.add.text(20, 121, "💥", estiloTexto(22)).setDepth(100);
    this.textoTiempo = this.add.text(CONFIG.ancho - 20, 8, "", estiloTexto(30)).setOrigin(1, 0).setDepth(100);
    const record = Number(localStorage.getItem("pokecarrera_record") || 0);
    this.add.text(CONFIG.ancho - 20, 48, `🏆 ${record}`, estiloTexto(22, "#ffd54f")).setOrigin(1, 0).setDepth(100);
    this.add.text(646, 29, "🏁", estiloTexto(26)).setOrigin(0, 0.5).setDepth(100);
    this.iconoProgreso = this.add.image(330, 29, this.pokemon.clave).setScale(0.45).setDepth(101);
  }

  // ----- Cada fotograma -----
  update(time, delta) {
    const dt = Math.min(delta / 1000, 0.05);
    const K = Phaser.Input.Keyboard;
    if (K.JustDown(this.teclas.P)) this.alternarPausa();
    if (K.JustDown(this.teclas.M)) Sonido.alternar();
    if (this.pausado || this.estado === "perdiendo") return;

    const corriendo = this.estado === "corriendo";
    const pulsaSalto = [this.teclas.UP, this.teclas.W, this.teclas.SPACE].map((t) => K.JustDown(t)).some(Boolean);
    const pulsaAtaque = K.JustDown(this.teclas.X);
    if (corriendo) {
      this.tiempo += dt;
      if (pulsaSalto) this.saltar();
      if (pulsaAtaque) this.atacar();
    }

    // Velocidad: se acelera sola; con SHIFT gastas turbo para ir más rápido
    if (this.estado === "llegando") {
      this.velocidad = Math.max(0, this.velocidad - 650 * dt);
    } else {
      this.velocidad = Math.min(CONFIG.velocidadMaxima, this.velocidad + CONFIG.aceleracion * dt);
    }
    const quiereTurbo = corriendo && this.teclas.SHIFT.isDown && this.turbo > 0;
    if (quiereTurbo) {
      if (!this.turboActivo) Sonido.turbo();
      this.turbo = Math.max(0, this.turbo - CONFIG.gastoTurbo * dt);
    } else {
      this.turbo = Math.min(CONFIG.turboMaximo, this.turbo + CONFIG.recargaTurbo * dt);
    }
    this.turboActivo = quiereTurbo;
    const velocidadReal = this.velocidad * (quiereTurbo ? CONFIG.multiplicadorTurbo : 1);
    this.distancia += velocidadReal * dt;
    moverCiudad(this.ciudad, this.distancia, dt);

    this.moverJugador(dt);

    // Aparecen coches y pociones cuando se acercan a la pantalla
    while (this.siguiente < this.eventos.length && this.eventos[this.siguiente].x - this.distancia <= CONFIG.ancho + 100) {
      this.lanzarEvento(this.eventos[this.siguiente]);
      this.siguiente++;
    }

    const caja = { izq: this.px - 20, der: this.px + 20, arr: this.y - 58, aba: this.y };
    this.actualizarDecorados();
    this.actualizarRecogibles(corriendo);
    this.actualizarCoches(dt, caja, corriendo);
    this.actualizarCientificos(dt);
    this.actualizarPociones(dt, caja, corriendo);
    this.actualizarExplosiones(dt, caja, corriendo);

    if (corriendo && this.distancia + this.px >= CONFIG.longitudPista) this.llegar();
    this.actualizarMarcador();
  }

  moverJugador(dt) {
    this.vy += CONFIG.gravedad * dt;
    this.y += this.vy * dt;
    let enSuelo = false;
    if (this.y >= CONFIG.suelo) {
      this.y = CONFIG.suelo;
      this.vy = 0;
      this.saltos = 0;
      enSuelo = true;
      if (this.estado === "llegando") this.vy = -520; // saltitos de alegría
    }
    this.jugador.y = this.y - (enSuelo ? Math.abs(Math.sin(this.distancia / 55)) * 6 : 0);
    let inclinacion = enSuelo ? 0 : Phaser.Math.Clamp(this.vy / 80, -10, 12);
    if (this.turboActivo) inclinacion += 8;
    if (this.ataqueRestante > 0) inclinacion += 16;
    this.jugador.angle = inclinacion;

    // Polvito al correr
    if (enSuelo && this.estado === "corriendo") {
      this.contadorPolvo += dt;
      if (this.contadorPolvo > 0.09) {
        this.contadorPolvo = 0;
        this.polvo.explode(1, this.px - 18, CONFIG.suelo - 2);
      }
    }
    if (this.turboActivo) {
      this.chispas.setParticleTint(0xffd54f);
      this.chispas.explode(1, this.px - 30, this.y - 30);
    }

    if (this.invulnerable > 0) {
      this.invulnerable -= dt;
      this.jugador.alpha = Math.floor(this.invulnerable * 12) % 2 === 0 ? 0.35 : 1;
      if (this.invulnerable <= 0) this.jugador.alpha = 1;
    }
    this.ataqueRestante = Math.max(0, this.ataqueRestante - dt);
    this.ataqueEspera = Math.max(0, this.ataqueEspera - dt);
  }

  saltar() {
    if (this.saltos >= 2) return;
    const doble = this.saltos === 1;
    this.vy = -CONFIG.fuerzaSalto;
    this.saltos++;
    if (doble) {
      Sonido.saltoDoble();
      this.chispas.setParticleTint(0xffffff);
      this.chispas.explode(8, this.px, this.y - 30);
    } else {
      Sonido.salto();
      this.polvo.explode(4, this.px, CONFIG.suelo - 2);
    }
    this.tweens.add({ targets: this.jugador, scaleX: { from: 0.9, to: 1.1 }, scaleY: { from: 1.3, to: 1.1 }, duration: 180 });
  }

  atacar() {
    if (this.ataqueEspera > 0) return;
    this.ataqueRestante = CONFIG.duracionAtaque;
    this.ataqueEspera = CONFIG.enfriamientoAtaque;
    Sonido.ataque();
    const tajo = this.add.image(this.px + 40, this.y - 40, "tajo").setOrigin(0, 0.5).setDepth(22).setScale(0.6);
    this.tweens.add({ targets: tajo, scale: 1.5, alpha: 0, x: this.px + 90, duration: 260, onComplete: () => tajo.destroy() });
  }

  // ----- Coches, pociones y explosiones -----
  lanzarEvento(evento) {
    if (evento.tipo === "coche") {
      const imagen = this.add.image(evento.x - this.distancia, CONFIG.suelo + 6, this.claveCoche)
        .setOrigin(0.5, 1).setDepth(12);
      this.coches.push({ imagen, mundoX: evento.x, v: evento.v });
    } else {
      // Un científico entra por la derecha y lanza la poción (ver actualizarCientificos)
      const imagen = this.add.image(CONFIG.ancho + 120, CONFIG.suelo + 10, "cientifico")
        .setOrigin(0.5, 1).setDepth(13);
      this.cientificos.push({ imagen, t: 0, lanzada: false });
    }
  }

  actualizarCientificos(dt) {
    const parado = CONFIG.ancho - 70;
    const fuera = CONFIG.ancho + 120;
    const base = CONFIG.suelo + 10;
    for (let i = this.cientificos.length - 1; i >= 0; i--) {
      const c = this.cientificos[i];
      c.t += dt;
      const t = c.t;
      let x = parado;
      let angulo = 0;
      let rebote = 0;
      if (t < 0.45) {
        const k = t / 0.45; // entra corriendo
        x = fuera - (fuera - parado) * (1 - (1 - k) * (1 - k));
        rebote = Math.abs(Math.sin(t * 22)) * 5;
      } else if (t < 0.85) {
        angulo = 14 * Math.sin(((t - 0.45) / 0.4) * (Math.PI / 2)); // echa el brazo atrás
      } else if (t < 1.3) {
        if (!c.lanzada) this.lanzarPocion(c, x);
        angulo = -10 * (1 - (t - 0.85) / 0.45); // lanza hacia delante
      } else {
        const k = (t - 1.3) / 0.5; // se va corriendo
        x = parado + (fuera - parado) * k * k;
        rebote = Math.abs(Math.sin(t * 22)) * 5;
        if (k >= 1) {
          c.imagen.destroy();
          this.cientificos.splice(i, 1);
          continue;
        }
      }
      c.imagen.setPosition(x, base - rebote).setAngle(angulo);
    }
  }

  lanzarPocion(c, x) {
    c.lanzada = true;
    c.imagen.setTexture("cientifico_sin");
    Sonido.ataque();
    // La poción sale de la mano y viaja trazando un arco hasta la altura de tu Pokémon
    const x0 = x - 36;
    const y0 = CONFIG.suelo - 44;
    const vx = Phaser.Math.Between(300, 380);
    const g = CONFIG.gravedadPocion;
    const alturaImpacto = CONFIG.suelo - Phaser.Math.Between(25, 190);
    const t = (x0 - this.px) / vx;
    const vy = (alturaImpacto - y0 - 0.5 * g * t * t) / t;
    const imagen = this.add.image(x0, y0, "pocion").setDepth(14);
    this.pociones.push({ imagen, x: x0, y: y0, vx, vy, g });
  }

  actualizarCoches(dt, caja, peligro) {
    for (let i = this.coches.length - 1; i >= 0; i--) {
      const coche = this.coches[i];
      coche.mundoX -= coche.v * dt;
      const x = coche.mundoX - this.distancia;
      coche.imagen.x = x;
      if (x < -200) {
        coche.imagen.destroy();
        this.coches.splice(i, 1);
        continue;
      }
      const cocheCaja = { izq: x - 72, der: x + 72, arr: CONFIG.suelo - 46, aba: CONFIG.suelo + 6 };
      if (peligro && caja.izq < cocheCaja.der && caja.der > cocheCaja.izq && caja.arr < cocheCaja.aba && caja.aba > cocheCaja.arr) {
        this.golpe();
      }
    }
  }

  actualizarPociones(dt, caja, peligro) {
    for (let i = this.pociones.length - 1; i >= 0; i--) {
      const p = this.pociones[i];
      p.vy += p.g * dt;
      p.x -= p.vx * dt;
      p.y += p.vy * dt;
      p.imagen.setPosition(p.x, p.y);
      p.imagen.rotation -= 5 * dt;

      let fin = false;
      const dentroAtaque = this.ataqueRestante > 0 && p.x > this.px - 10 && p.x < this.px + 150 && Math.abs(p.y - (this.y - 45)) < 80;
      if (dentroAtaque) {
        this.explotar(p.x, p.y, false); // ¡la rompes con el ataque!
        fin = true;
      } else if (peligro && circuloRect(p.x, p.y, 16, caja)) {
        this.explotar(p.x, p.y, false);
        this.golpe();
        fin = true;
      } else if (p.y >= CONFIG.suelo - 16) {
        this.explotar(p.x, CONFIG.suelo - 30, p.x > this.px - 70); // explota en el suelo
        fin = true;
      } else if (p.x < this.px - 70) {
        this.explotar(p.x, p.y, false);
        fin = true;
      }
      if (fin) {
        p.imagen.destroy();
        this.pociones.splice(i, 1);
      }
    }
  }

  explotar(x, y, hace_dano) {
    const imagen = this.add.image(x, y, "boom").setDepth(25);
    this.tweens.add({
      targets: imagen,
      scale: { from: 0.4, to: 1.3 },
      alpha: { from: 1, to: 0 },
      duration: 450,
      ease: "Quad.easeOut",
      onComplete: () => imagen.destroy(),
    });
    this.chispas.setParticleTint(0xffa726);
    this.chispas.explode(16, x, y);
    Sonido.explosion();
    this.explosiones.push({ imagen, mundoX: x + this.distancia, y, vida: 0.45, hace_dano });
  }

  actualizarExplosiones(dt, caja, peligro) {
    for (let i = this.explosiones.length - 1; i >= 0; i--) {
      const e = this.explosiones[i];
      e.vida -= dt;
      if (e.vida <= 0 || !e.imagen.active) {
        this.explosiones.splice(i, 1);
        continue;
      }
      e.imagen.x = e.mundoX - this.distancia;
      if (peligro && e.hace_dano && circuloRect(e.imagen.x, e.y, 38, caja)) this.golpe();
    }
  }

  // ----- Monedas, Pokeballs y bayas -----
  actualizarRecogibles(corriendo) {
    const centroY = this.y - 32;
    this.recogibles.forEach((r) => {
      if (r.cogido) return;
      const x = r.mundoX - this.distancia;
      r.imagen.x = x;
      const visible = x > -50 && x < CONFIG.ancho + 50;
      r.imagen.visible = visible;
      if (!visible) return;
      if (r.tipo === "moneda") r.imagen.scaleX = 0.25 + 0.75 * Math.abs(Math.cos(this.distancia / 90 + r.fase));
      else r.imagen.y = r.y + Math.sin(this.distancia / 120 + r.fase) * 5;
      if (corriendo && Math.abs(x - this.px) < 34 && Math.abs(r.y - centroY) < 46) this.coger(r);
    });
  }

  coger(r) {
    r.cogido = true;
    r.imagen.destroy();
    const x = r.mundoX - this.distancia;
    if (r.tipo === "moneda") {
      this.monedas++;
      Sonido.moneda();
      this.chispas.setParticleTint(0xffd54f);
      this.flotante(x, r.y - 20, `+${CONFIG.puntosPorMoneda}`, "#ffd54f");
    } else if (r.tipo === "pokeball") {
      this.vidas = Math.min(CONFIG.vidasMaximas, this.vidas + 1);
      Sonido.vida();
      this.chispas.setParticleTint(0xef5350);
      this.flotante(x, r.y - 20, "❤️ +1", "#ff8a80");
    } else {
      this.turbo = Math.min(CONFIG.turboMaximo, this.turbo + CONFIG.turboBaya);
      Sonido.baya();
      this.chispas.setParticleTint(0xff80ab);
      this.flotante(x, r.y - 20, "⚡ turbo", "#ffeb3b");
    }
    this.chispas.explode(12, x, r.y);
  }

  flotante(x, y, texto, color) {
    const t = this.add.text(x, y, texto, estiloTexto(26, color)).setOrigin(0.5).setDepth(60);
    this.tweens.add({ targets: t, y: y - 50, alpha: 0, duration: 700, onComplete: () => t.destroy() });
  }

  actualizarDecorados() {
    this.decorados.forEach((d) => { d.contenedor.x = d.mundoX - this.distancia; });
  }

  // ----- Golpes, final y pausa -----
  golpe() {
    if (this.invulnerable > 0 || this.estado !== "corriendo") return;
    this.vidas--;
    this.invulnerable = CONFIG.segundosInvulnerable;
    this.velocidad = CONFIG.velocidadInicial; // al chocar vuelves a ir despacio
    this.cameras.main.shake(250, 0.012);
    this.cameras.main.flash(150, 255, 80, 80);
    Sonido.danio();
    this.chispas.setParticleTint(0xef5350);
    this.chispas.explode(18, this.px, this.y - 30);
    if (this.vidas <= 0) this.perder(`¡Te han dado ${CONFIG.vidas} veces!`);
  }

  perder(motivo) {
    this.estado = "perdiendo";
    this.jugador.alpha = 1;
    Sonido.derrota();
    this.tweens.add({ targets: this.jugador, angle: 360, y: this.jugador.y - 40, duration: 700, ease: "Quad.easeOut" });
    this.time.delayedCall(1100, () => this.irAFin(false, motivo));
  }

  llegar() {
    this.estado = "llegando";
    this.jugador.alpha = 1;
    this.jugador.angle = 0;
    const gana = this.monedas >= CONFIG.monedasParaGanar;
    if (gana) {
      Sonido.victoria();
      const tintes = [0xffd54f, 0xef5350, 0x42a5f5, 0x66bb6a, 0xec407a];
      this.time.addEvent({
        delay: 140,
        repeat: 12,
        callback: () => {
          this.chispas.setParticleTint(Phaser.Utils.Array.GetRandom(tintes));
          this.chispas.explode(16, Phaser.Math.Between(100, 860), Phaser.Math.Between(80, 300));
        },
      });
    } else {
      Sonido.derrota();
    }
    const motivo = gana ? "" : `Llegaste a la meta, pero con ${this.monedas} 🪙 y hacían falta ${CONFIG.monedasParaGanar}.`;
    this.time.delayedCall(2200, () => this.irAFin(gana, motivo));
  }

  irAFin(gana, motivo) {
    this.scene.start("Fin", { gana, motivo, monedas: this.monedas, tiempo: this.tiempo, pokemon: this.pokemon });
  }

  alternarPausa() {
    if (this.estado !== "corriendo") return;
    this.pausado = !this.pausado;
    if (this.pausado) {
      this.tweens.pauseAll();
      this.cartelPausa = this.add.text(CONFIG.ancho / 2, CONFIG.alto / 2, "PAUSA\n(pulsa P)", { ...estiloTexto(60), align: "center" })
        .setOrigin(0.5).setDepth(200);
    } else {
      this.tweens.resumeAll();
      this.cartelPausa.destroy();
    }
  }

  // ----- Marcador -----
  actualizarMarcador() {
    const segundos = Math.floor(this.tiempo);
    this.textoMonedas.setText(`🪙 ${this.monedas}/${CONFIG.monedasParaGanar}`);
    this.textoVidas.setText("❤️".repeat(Math.max(this.vidas, 0)));
    this.textoTiempo.setText(`⏱ ${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, "0")}`);

    const progreso = Phaser.Math.Clamp((this.distancia + this.px) / CONFIG.longitudPista, 0, 1);
    this.iconoProgreso.x = 330 + 300 * progreso;

    const g = this.barras;
    g.clear();
    const barra = (x, y, ancho, fraccion, color) => {
      g.fillStyle(0x000000, 0.45); g.fillRect(x, y, ancho, 14);
      g.fillStyle(color, 1); g.fillRect(x, y, ancho * Phaser.Math.Clamp(fraccion, 0, 1), 14);
      g.lineStyle(2, 0xffffff, 0.7); g.strokeRect(x, y, ancho, 14);
    };
    barra(56, 98, 150, this.turbo / CONFIG.turboMaximo, this.turboActivo ? 0xffeb3b : 0xffb300);
    const listoAtaque = 1 - this.ataqueEspera / CONFIG.enfriamientoAtaque;
    barra(56, 126, 150, listoAtaque, listoAtaque >= 1 ? 0x80ff9a : 0xff7043);
    barra(330, 23, 300, progreso, 0x80ff9a);
  }
}

// ===== Pantalla final =====
class Fin extends Phaser.Scene {
  constructor() { super("Fin"); }
  create(datos) {
    Sonido.iniciar(this);
    this.ciudad = crearCiudad(this);
    this.distancia = 0;
    this.add.rectangle(CONFIG.ancho / 2, CONFIG.alto / 2, CONFIG.ancho, CONFIG.alto, 0x10162b, 0.6).setDepth(-20);
    const centro = CONFIG.ancho / 2;

    const puntos = datos.monedas * CONFIG.puntosPorMoneda;
    const record = Math.max(puntos, Number(localStorage.getItem("pokecarrera_record") || 0));
    localStorage.setItem("pokecarrera_record", record);
    const segundos = Math.floor(datos.tiempo);

    const titulo = this.add.text(centro, 80, datos.gana ? "🏆 ¡Has ganado!" : "¡Has perdido!", estiloTexto(70, datos.gana ? "#ffd54f" : "#ef5350"))
      .setOrigin(0.5).setScale(0);
    this.tweens.add({ targets: titulo, scale: 1, duration: 500, ease: "Back.easeOut" });

    const heroe = this.add.image(centro, 215, datos.pokemon.clave).setScale(1.8);
    this.tweens.add({ targets: heroe, y: 195, duration: 450, yoyo: true, repeat: -1, ease: "Quad.easeOut" });

    if (datos.motivo) {
      this.add.text(centro, 300, datos.motivo, { ...estiloTexto(24), align: "center", wordWrap: { width: 800 } }).setOrigin(0.5);
    }
    this.add.text(centro, 345, `🪙 ${datos.monedas}/${CONFIG.monedasParaGanar}    ⏱ ${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, "0")}`, estiloTexto(32)).setOrigin(0.5);
    this.add.text(centro, 395, `Puntos: ${puntos}`, estiloTexto(40)).setOrigin(0.5);
    this.add.text(centro, 442, `🏆 Récord: ${record}`, estiloTexto(28, "#ffd54f")).setOrigin(0.5);

    const otra = this.add.text(centro, 497, "Pulsa ENTER para jugar otra vez", estiloTexto(30, "#80ff9a")).setOrigin(0.5);
    this.tweens.add({ targets: otra, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });
    this.input.keyboard.once("keydown-ENTER", () => { Sonido.clic(); this.scene.start("Regiones"); });
  }
  update(time, delta) {
    this.distancia += 180 * delta / 1000;
    moverCiudad(this.ciudad, this.distancia, delta / 1000);
  }
}

// ===== Arrancar Phaser =====
const juego = new Phaser.Game({
  type: Phaser.AUTO,
  width: CONFIG.ancho,
  height: CONFIG.alto,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [Preparar, Inicio, Regiones, Ruleta, Juego, Fin],
});
