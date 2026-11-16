// ===== Ajustes del juego: ¡prueba a cambiar estos números y colores! =====
const CONFIG = {
  ancho: 800,
  alto: 600,
  segundosCarrera: 60,      // tiempo para llegar a la meta
  metrosMeta: 1600,         // distancia hasta la meta
  velocidadNormal: 320,     // velocidad sin tocar nada
  velocidadMaxima: 460,     // velocidad con la flecha arriba
  velocidadMinima: 140,     // velocidad con la flecha abajo
  velocidadTurbo: 720,      // velocidad con el turbo (Espacio)
  velocidadLateral: 340,    // lo rápido que giras a los lados
  nitroInicial: 60,         // turbo al empezar (máximo 100)
  gastoNitro: 35,           // cuánto turbo gastas por segundo
  nitroPorGarrafa: 35,      // cuánto turbo da cada garrafa
  segundosEntreCharcos: 1.6,
  segundosEntreGarrafas: 3.5,
  aceleracionFinal: 0.35,   // cuánto más rápido va todo cerca de la meta
  puntosPorCharcoEsquivado: 50,
  musica: true,
  volumenMusica: 0.07,
  colorCoche: 0xffffff,
  colorRayas: 0x9c27ff,
  colorNeonRosa: 0xff3df2,
  colorNeonAzul: 0x2ef2ff,
  colorNeonAmarillo: 0xffe94d,
};

// La carretera ocupa el centro de la pantalla, con 4 carriles
const CARRETERA_X = 200;
const CARRETERA_ANCHO = 400;

// ===== Texturas: dibujamos los gráficos con código (no hacen falta imágenes) =====
function crearTexturas(escena) {
  const g = escena.make.graphics({ x: 0, y: 0, add: false });

  // Carretera: asfalto oscuro, bordes de neón y líneas de carril
  g.fillStyle(0x24203a, 1);
  g.fillRect(0, 0, CARRETERA_ANCHO, 160);
  g.fillStyle(0x2c2747, 1);
  for (let i = 0; i < 25; i++) g.fillRect(Phaser.Math.Between(0, 390), Phaser.Math.Between(0, 155), 6, 3);
  g.fillStyle(CONFIG.colorNeonAzul, 1);
  g.fillRect(0, 0, 6, 160);
  g.fillRect(CARRETERA_ANCHO - 6, 0, 6, 160);
  g.fillStyle(0xffffff, 0.85);
  [100, 200, 300].forEach((x) => g.fillRect(x - 3, 20, 6, 50));
  [100, 200, 300].forEach((x) => g.fillRect(x - 3, 100, 6, 50));
  g.generateTexture("carretera", CARRETERA_ANCHO, 160);
  g.clear();

  // Ciudad de noche (vista desde arriba): edificios con luces de neón
  crearCiudad(g, "ciudadIzq", true);
  crearCiudad(g, "ciudadDer", false);

  // Coche protagonista: blanco, rayas moradas y ventanas largas
  g.fillStyle(0x111111, 1); // ruedas
  g.fillRoundedRect(0, 12, 10, 22, 4);
  g.fillRoundedRect(40, 12, 10, 22, 4);
  g.fillRoundedRect(0, 60, 10, 22, 4);
  g.fillRoundedRect(40, 60, 10, 22, 4);
  g.fillStyle(0x000000, 0.3); // sombra
  g.fillRoundedRect(6, 6, 40, 86, 14);
  g.fillStyle(CONFIG.colorCoche, 1); // carrocería
  g.fillRoundedRect(4, 2, 42, 86, 14);
  g.fillStyle(CONFIG.colorRayas, 1); // rayas moradas
  g.fillRect(16, 2, 6, 86);
  g.fillRect(28, 2, 6, 86);
  g.fillStyle(0x1d2b5c, 1); // ventanas largas
  g.fillRoundedRect(9, 22, 32, 20, 6);
  g.fillRoundedRect(9, 46, 32, 28, 6);
  g.fillStyle(0x7fd8ff, 0.6); // brillo del cristal
  g.fillRect(12, 25, 10, 4);
  g.fillRect(12, 49, 8, 4);
  g.fillStyle(CONFIG.colorNeonAmarillo, 1); // faros
  g.fillCircle(11, 6, 4);
  g.fillCircle(39, 6, 4);
  g.fillStyle(0xff2a2a, 1); // luces de atrás
  g.fillRect(7, 84, 10, 4);
  g.fillRect(33, 84, 10, 4);
  g.lineStyle(2, 0xd0c8ff, 1);
  g.strokeRoundedRect(4, 2, 42, 86, 14);
  g.generateTexture("coche", 50, 92);
  g.clear();

  // Charco de aceite: mancha negra con brillos de colores
  g.fillStyle(0x0a0a0f, 0.95);
  g.fillEllipse(35, 23, 66, 38);
  g.fillEllipse(18, 14, 26, 18);
  g.fillEllipse(54, 32, 22, 16);
  g.fillStyle(0x6a3cff, 0.5);
  g.fillEllipse(28, 18, 22, 7);
  g.fillStyle(CONFIG.colorNeonAzul, 0.4);
  g.fillEllipse(44, 28, 16, 5);
  g.fillStyle(CONFIG.colorNeonRosa, 0.35);
  g.fillEllipse(22, 30, 12, 4);
  g.generateTexture("charco", 70, 46);
  g.clear();

  // Garrafa de nitro: bote verde neón con un rayo
  g.fillStyle(0x000000, 0.3);
  g.fillRoundedRect(5, 12, 30, 38, 8);
  g.fillStyle(0x2bff88, 1);
  g.fillRoundedRect(3, 10, 30, 38, 8);
  g.fillStyle(0x1aa85a, 1);
  g.fillRect(12, 2, 12, 10);
  g.fillStyle(0x555555, 1);
  g.fillRect(10, 0, 16, 5);
  g.fillStyle(0xffffff, 1);
  g.fillTriangle(20, 15, 10, 31, 18, 31);
  g.fillTriangle(16, 43, 26, 27, 18, 27);
  g.generateTexture("nitro", 38, 52);
  g.clear();

  // Línea de meta: cuadros blancos y negros
  for (let fila = 0; fila < 2; fila++) {
    for (let col = 0; col < 20; col++) {
      g.fillStyle((fila + col) % 2 === 0 ? 0xffffff : 0x111111, 1);
      g.fillRect(col * 20, fila * 20, 20, 20);
    }
  }
  g.generateTexture("meta", CARRETERA_ANCHO, 40);
  g.clear();

  // Chispa / llama para partículas
  g.fillStyle(0xffffff, 1);
  g.fillCircle(6, 6, 6);
  g.generateTexture("brillo", 12, 12);
  g.destroy();
}

// Dibuja un lado de la ciudad (200 x 600) que se repite hacia abajo
function crearCiudad(g, clave, aceraALaDerecha) {
  const ancho = 200;
  const alto = 600;
  const neones = [CONFIG.colorNeonRosa, CONFIG.colorNeonAzul, CONFIG.colorNeonAmarillo, CONFIG.colorRayas];
  g.fillStyle(0x120c26, 1);
  g.fillRect(0, 0, ancho, alto);

  // Acera junto a la carretera
  const aceraX = aceraALaDerecha ? ancho - 24 : 0;
  g.fillStyle(0x3a3358, 1);
  g.fillRect(aceraX, 0, 24, alto);

  // Edificios (los vemos desde arriba: tejados)
  const zonaX = aceraALaDerecha ? 8 : 32;
  let y = 6;
  while (y < alto - 40) {
    const altoEdificio = Phaser.Math.Between(60, 120);
    const anchoEdificio = Phaser.Math.Between(110, 150);
    const x = aceraALaDerecha ? zonaX + (160 - anchoEdificio) : zonaX;
    const neon = Phaser.Utils.Array.GetRandom(neones);
    g.fillStyle(Phaser.Utils.Array.GetRandom([0x2a1f4f, 0x1f2a4f, 0x33204a]), 1);
    g.fillRoundedRect(x, y, anchoEdificio, altoEdificio, 6);
    g.lineStyle(3, neon, 0.9);
    g.strokeRoundedRect(x, y, anchoEdificio, altoEdificio, 6);
    // Lucecitas en el tejado
    for (let i = 0; i < 6; i++) {
      g.fillStyle(Phaser.Utils.Array.GetRandom(neones), Math.random() * 0.5 + 0.5);
      g.fillRect(x + Phaser.Math.Between(8, anchoEdificio - 16), y + Phaser.Math.Between(8, altoEdificio - 14), 8, 6);
    }
    y += altoEdificio + Phaser.Math.Between(14, 26);
  }

  // Farolas con brillo en la acera
  for (let fy = 50; fy < alto; fy += 150) {
    const fx = aceraX + 12;
    g.fillStyle(CONFIG.colorNeonAmarillo, 0.15);
    g.fillCircle(fx, fy, 22);
    g.fillStyle(CONFIG.colorNeonAmarillo, 0.35);
    g.fillCircle(fx, fy, 11);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(fx, fy, 4);
  }
  g.generateTexture(clave, ancho, alto);
  g.clear();
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

// Fondo común: carretera y ciudad que se pueden mover hacia abajo
function crearFondo(escena) {
  return {
    carretera: escena.add.tileSprite(CARRETERA_X, 0, CARRETERA_ANCHO, CONFIG.alto, "carretera").setOrigin(0),
    izquierda: escena.add.tileSprite(0, 0, 200, CONFIG.alto, "ciudadIzq").setOrigin(0),
    derecha: escena.add.tileSprite(600, 0, 200, CONFIG.alto, "ciudadDer").setOrigin(0),
  };
}

function moverFondo(fondo, pixeles) {
  fondo.carretera.tilePositionY -= pixeles;
  fondo.izquierda.tilePositionY -= pixeles;
  fondo.derecha.tilePositionY -= pixeles;
}

// ===== Música de fondo hecha con Web Audio (sin archivos) =====
function tocarNota(ctx, frecuencia, duracion, tipo, volumen) {
  const inicio = ctx.currentTime + 0.02;
  const osc = ctx.createOscillator();
  const ganancia = ctx.createGain();
  osc.type = tipo;
  osc.frequency.value = frecuencia;
  ganancia.gain.setValueAtTime(volumen, inicio);
  ganancia.gain.exponentialRampToValueAtTime(0.001, inicio + duracion);
  osc.connect(ganancia);
  ganancia.connect(ctx.destination);
  osc.start(inicio);
  osc.stop(inicio + duracion + 0.05);
}

const BAJOS = [110, 87.31, 130.81, 98];                       // La, Fa, Do, Sol
const MELODIA = [440, 523.25, 659.25, 523.25, 349.23, 440, 523.25, 440,
                 523.25, 659.25, 783.99, 659.25, 392, 493.88, 587.33, 493.88];

function empezarMusica(escena) {
  const ctx = escena.sound.context;
  if (!CONFIG.musica || !ctx) return;
  if (ctx.state === "suspended") ctx.resume();
  let paso = 0;
  escena.time.addEvent({
    delay: 180,
    loop: true,
    callback: () => {
      const v = CONFIG.volumenMusica;
      if (paso % 4 === 0) tocarNota(ctx, BAJOS[Math.floor(paso / 16) % 4], 0.6, "sawtooth", v * 1.2);
      tocarNota(ctx, MELODIA[paso % 16], 0.16, "square", v * 0.6);
      paso++;
    },
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
    this.fondo = crearFondo(this);
    this.add.rectangle(0, 0, CONFIG.ancho, CONFIG.alto, 0x000000, 0.45).setOrigin(0);
    const centro = CONFIG.ancho / 2;

    const titulo = this.add.text(centro, 120, "El Súper Juego\nde Coches", { ...estiloTexto(60, "#ff6af0"), align: "center" }).setOrigin(0.5);
    this.tweens.add({ targets: titulo, y: 135, duration: 1200, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    const coche = this.add.image(centro, 290, "coche").setScale(1.4);
    this.tweens.add({ targets: coche, angle: { from: -5, to: 5 }, duration: 600, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    const ayuda = [
      "⬅️ ➡️  moverte     ⬆️ acelerar     ⬇️ frenar",
      "ESPACIO = TURBO 🔥     P = pausa",
      "🏁 ¡Llega a la meta en 60 segundos!",
      "Esquiva el aceite 🛢️ y coge nitro ⚡",
    ];
    this.add.text(centro, 430, ayuda.join("\n"), { ...estiloTexto(22), align: "center", lineSpacing: 6 }).setOrigin(0.5);
    const empezar = this.add.text(centro, 545, "Pulsa ENTER para empezar", estiloTexto(32, "#80ff9a")).setOrigin(0.5);
    this.tweens.add({ targets: empezar, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

    this.input.keyboard.once("keydown-ENTER", () => this.scene.start("Juego"));
  }
  update(t, delta) {
    moverFondo(this.fondo, 120 * delta / 1000);
  }
}

// ===== El juego =====
class Juego extends Phaser.Scene {
  constructor() { super("Juego"); }

  create() {
    this.fondo = crearFondo(this);
    this.tiempo = CONFIG.segundosCarrera;
    this.distancia = 0;            // en píxeles (10 píxeles = 1 metro)
    this.bonus = 0;
    this.nitro = CONFIG.nitroInicial;
    this.velocidad = CONFIG.velocidadNormal;
    this.patinando = false;
    this.terminado = false;
    this.pausado = false;
    this.meta = null;
    this.relojCharco = 1.5;
    this.relojGarrafa = 2.5;

    // El coche solo puede moverse dentro de la carretera
    this.physics.world.setBounds(CARRETERA_X + 8, 0, CARRETERA_ANCHO - 16, CONFIG.alto);
    this.jugador = this.physics.add.image(CONFIG.ancho / 2, CONFIG.alto - 90, "coche").setDepth(5);
    this.jugador.setCollideWorldBounds(true);
    this.jugador.body.setSize(40, 82);

    this.charcos = this.physics.add.group();
    this.garrafas = this.physics.add.group();
    this.physics.add.overlap(this.jugador, this.charcos, (j, charco) => this.pisarCharco(charco));
    this.physics.add.overlap(this.jugador, this.garrafas, (j, garrafa) => this.cogerNitro(garrafa));

    // Fuego del turbo que sale por detrás del coche
    this.fuego = this.add.particles(0, 0, "brillo", {
      follow: this.jugador,
      followOffset: { y: 46 },
      speedY: { min: 150, max: 320 },
      speedX: { min: -40, max: 40 },
      scale: { start: 1.1, end: 0 },
      tint: [0xffe94d, 0xff8a00, 0xff3df2],
      lifespan: 300,
      frequency: 15,
      blendMode: "ADD",
      emitting: false,
    }).setDepth(4);

    // Chispas para cuando coges algo o pisas aceite
    this.chispas = this.add.particles(0, 0, "brillo", {
      speed: { min: 80, max: 260 },
      scale: { start: 1, end: 0 },
      lifespan: 500,
      emitting: false,
    }).setDepth(6);

    // Marcador
    this.textoTiempo = this.add.text(20, 14, "", estiloTexto(30)).setDepth(10);
    this.textoPuntos = this.add.text(20, 56, "", estiloTexto(24, "#ffe94d")).setDepth(10);
    this.textoMetros = this.add.text(CONFIG.ancho - 20, 14, "", estiloTexto(26)).setOrigin(1, 0).setDepth(10);
    this.textoVelocidad = this.add.text(CONFIG.ancho - 20, CONFIG.alto - 20, "", estiloTexto(24, "#2ef2ff")).setOrigin(1, 1).setDepth(10);
    this.add.text(20, CONFIG.alto - 62, "NITRO ⚡", estiloTexto(20, "#2bff88")).setDepth(10);
    this.barras = this.add.graphics().setDepth(10);
    this.actualizarMarcador();

    this.teclas = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,SPACE");
    this.input.keyboard.on("keydown-P", () => this.alternarPausa());

    empezarMusica(this);
  }

  update(t, delta) {
    if (this.terminado || this.pausado) return;
    const dt = delta / 1000;

    // Cuanto más cerca de la meta, más rápido va todo
    const progreso = Math.min(this.distancia / 10 / CONFIG.metrosMeta, 1);
    const extra = 1 + progreso * CONFIG.aceleracionFinal;

    // Elegir a qué velocidad queremos ir
    const enTurbo = this.teclas.SPACE.isDown && this.nitro > 0 && !this.patinando;
    let objetivo = CONFIG.velocidadNormal;
    if (this.teclas.UP.isDown) objetivo = CONFIG.velocidadMaxima;
    if (this.teclas.DOWN.isDown) objetivo = CONFIG.velocidadMinima;
    if (enTurbo) {
      objetivo = CONFIG.velocidadTurbo;
      this.nitro = Math.max(0, this.nitro - CONFIG.gastoNitro * dt);
    }
    if (!this.patinando) this.velocidad += (objetivo * extra - this.velocidad) * Math.min(1, dt * 2.5);

    // Fuego del turbo
    if (enTurbo && !this.fuego.emitting) this.fuego.start();
    if (!enTurbo && this.fuego.emitting) this.fuego.stop();

    // Girar a los lados (si patinas, no controlas el coche)
    if (this.patinando) {
      this.jugador.setVelocityX(0);
    } else {
      const izq = this.teclas.LEFT.isDown;
      const der = this.teclas.RIGHT.isDown;
      this.jugador.setVelocityX(izq ? -CONFIG.velocidadLateral : der ? CONFIG.velocidadLateral : 0);
      this.jugador.setAngle(izq ? -8 : der ? 8 : 0);
    }

    // Avanzar: el mundo se mueve hacia abajo
    const avance = this.velocidad * dt;
    this.distancia += avance;
    moverFondo(this.fondo, avance);
    [this.charcos, this.garrafas].forEach((grupo) =>
      grupo.getChildren().forEach((o) => o.setVelocityY(this.velocidad))
    );

    // Poner charcos y garrafas (más charcos cerca de la meta)
    if (!this.meta) {
      this.relojCharco -= dt;
      if (this.relojCharco <= 0) {
        this.ponerObjeto(this.charcos, "charco");
        this.relojCharco = CONFIG.segundosEntreCharcos / (1 + progreso);
      }
      this.relojGarrafa -= dt;
      if (this.relojGarrafa <= 0) {
        this.ponerObjeto(this.garrafas, "nitro");
        this.relojGarrafa = CONFIG.segundosEntreGarrafas;
      }
    }

    this.revisarCharcosEsquivados();

    // ¡La meta aparece al llegar a la distancia!
    if (!this.meta && progreso >= 1) {
      this.meta = this.add.image(CONFIG.ancho / 2, -40, "meta").setDepth(2);
      const cartel = this.add.text(CONFIG.ancho / 2, 200, "¡LA META! 🏁", estiloTexto(54, "#ffe94d")).setOrigin(0.5).setDepth(10);
      this.tweens.add({ targets: cartel, alpha: 0, scale: 1.5, duration: 1400, onComplete: () => cartel.destroy() });
    }
    if (this.meta) {
      this.meta.y += avance;
      if (this.meta.y >= this.jugador.y) return this.terminar(true);
    }

    // Reloj
    this.tiempo -= dt;
    if (this.tiempo <= 0) {
      this.tiempo = 0;
      this.actualizarMarcador();
      return this.terminar(false);
    }
    this.actualizarMarcador();
  }

  ponerObjeto(grupo, clave) {
    const carril = Phaser.Math.Between(0, 3);
    const x = CARRETERA_X + 50 + carril * 100;
    const objeto = grupo.create(x, -40, clave).setDepth(3);
    if (clave === "charco") {
      objeto.body.setSize(52, 30);
      objeto.setAngle(Phaser.Math.Between(-20, 20));
    } else {
      this.tweens.add({ targets: objeto, scale: { from: 0.9, to: 1.15 }, duration: 400, yoyo: true, repeat: -1 });
    }
  }

  // Puntos extra por cada charco que dejas atrás sin pisarlo
  revisarCharcosEsquivados() {
    this.charcos.getChildren().forEach((charco) => {
      if (!charco.getData("tocado") && !charco.getData("contado") && charco.y > this.jugador.y + 60) {
        charco.setData("contado", true);
        this.bonus += CONFIG.puntosPorCharcoEsquivado;
        const texto = this.add.text(this.jugador.x, this.jugador.y - 60, `+${CONFIG.puntosPorCharcoEsquivado}`, estiloTexto(26, "#80ff9a")).setOrigin(0.5).setDepth(10);
        this.tweens.add({ targets: texto, y: texto.y - 50, alpha: 0, duration: 700, onComplete: () => texto.destroy() });
      }
    });
    [this.charcos, this.garrafas].forEach((grupo) =>
      grupo.getChildren().slice().forEach((o) => { if (o.y > CONFIG.alto + 60) o.destroy(); })
    );
  }

  pisarCharco(charco) {
    if (this.patinando || charco.getData("tocado")) return;
    charco.setData("tocado", true);
    this.patinando = true;
    this.velocidad *= 0.4;
    this.chispas.setParticleTint(0x6a3cff);
    this.chispas.explode(16, this.jugador.x, this.jugador.y);
    this.cameras.main.shake(250, 0.01);
    // El coche da una vuelta patinando
    this.tweens.add({
      targets: this.jugador,
      angle: this.jugador.angle + 360,
      duration: 800,
      ease: "Cubic.easeOut",
      onComplete: () => { this.jugador.setAngle(0); this.patinando = false; },
    });
  }

  cogerNitro(garrafa) {
    this.chispas.setParticleTint(0x2bff88);
    this.chispas.explode(18, garrafa.x, garrafa.y);
    garrafa.destroy();
    this.nitro = Math.min(100, this.nitro + CONFIG.nitroPorGarrafa);
    this.cameras.main.flash(120, 40, 255, 140);
  }

  puntos() {
    return Math.floor(this.distancia / 10) + this.bonus;
  }

  actualizarMarcador() {
    const segundos = Math.ceil(this.tiempo);
    this.textoTiempo.setText(`⏱️ ${segundos}`);
    this.textoTiempo.setColor(segundos <= 10 ? "#ff5252" : "#ffffff");
    this.textoPuntos.setText(`⭐ ${this.puntos()}`);
    const metros = Math.min(Math.floor(this.distancia / 10), CONFIG.metrosMeta);
    this.textoMetros.setText(`🏁 ${metros} / ${CONFIG.metrosMeta} m`);
    this.textoVelocidad.setText(`${Math.round(this.velocidad / 3)} km/h`);

    // Barras de nitro y de camino hasta la meta
    this.barras.clear();
    this.barras.fillStyle(0x000000, 0.5);
    this.barras.fillRoundedRect(20, CONFIG.alto - 36, 160, 18, 8);
    this.barras.fillStyle(0x2bff88, 1);
    if (this.nitro > 1) this.barras.fillRoundedRect(20, CONFIG.alto - 36, 160 * this.nitro / 100, 18, 8);
    this.barras.fillStyle(0x000000, 0.5);
    this.barras.fillRoundedRect(CONFIG.ancho - 180, 52, 160, 14, 7);
    this.barras.fillStyle(CONFIG.colorNeonRosa, 1);
    this.barras.fillRoundedRect(CONFIG.ancho - 180, 52, Math.max(14, 160 * metros / CONFIG.metrosMeta), 14, 7);
  }

  alternarPausa() {
    if (this.terminado) return;
    this.pausado = !this.pausado;
    if (this.pausado) {
      this.physics.pause();
      this.tweens.pauseAll();
      this.time.paused = true; // también para la música
      this.fuego.stop();
      this.cartelPausa = this.add.text(CONFIG.ancho / 2, CONFIG.alto / 2, "PAUSA\n(pulsa P)", { ...estiloTexto(56), align: "center" })
        .setOrigin(0.5).setDepth(20);
    } else {
      this.physics.resume();
      this.tweens.resumeAll();
      this.time.paused = false;
      this.cartelPausa.destroy();
    }
  }

  terminar(gano) {
    this.terminado = true;
    this.physics.pause();
    this.fuego.stop();
    this.time.removeAllEvents(); // para la música
    // Si ganas, cada segundo que sobra vale 10 puntos
    const puntos = this.puntos() + (gano ? Math.ceil(this.tiempo) * 10 : 0);
    if (gano) {
      this.chispas.setParticleTint(CONFIG.colorNeonAmarillo);
      this.chispas.explode(60, this.jugador.x, this.jugador.y);
      this.cameras.main.flash(300, 255, 255, 255);
    } else {
      this.cameras.main.shake(300, 0.015);
    }
    this.time.delayedCall(900, () => this.scene.start("Fin", { gano, puntos, tiempo: Math.ceil(this.tiempo) }));
  }
}

// ===== Pantalla final =====
class Fin extends Phaser.Scene {
  constructor() { super("Fin"); }
  create(datos) {
    crearFondo(this);
    this.add.rectangle(0, 0, CONFIG.ancho, CONFIG.alto, 0x000000, 0.55).setOrigin(0);
    const centro = CONFIG.ancho / 2;

    // Récord guardado en el navegador
    const record = Math.max(datos.puntos, Number(localStorage.getItem("recordSuperCoches") || 0));
    localStorage.setItem("recordSuperCoches", record);

    const mensaje = datos.gano ? "¡HAS GANADO! 🏆" : "¡Se acabó el tiempo! ⏰";
    const titulo = this.add.text(centro, 170, mensaje, estiloTexto(58, datos.gano ? "#ffe94d" : "#ff5252")).setOrigin(0.5).setScale(0);
    this.tweens.add({ targets: titulo, scale: 1, duration: 500, ease: "Back.easeOut" });

    if (datos.gano) {
      this.add.text(centro, 250, `Te sobraron ${datos.tiempo} segundos`, estiloTexto(26, "#80ff9a")).setOrigin(0.5);
      this.add.particles(0, 0, "brillo", {
        x: { min: 0, max: CONFIG.ancho }, y: -10,
        speedY: { min: 100, max: 250 }, lifespan: 4000,
        tint: [CONFIG.colorNeonRosa, CONFIG.colorNeonAzul, CONFIG.colorNeonAmarillo, CONFIG.colorRayas],
        frequency: 40,
      });
    }
    this.add.text(centro, 320, `Puntos: ${datos.puntos}`, estiloTexto(40)).setOrigin(0.5);
    this.add.text(centro, 375, `Récord: ${record}`, estiloTexto(30, "#ffe94d")).setOrigin(0.5);

    const otra = this.add.text(centro, 480, "Pulsa ENTER para jugar otra vez", estiloTexto(30, "#80ff9a")).setOrigin(0.5);
    this.tweens.add({ targets: otra, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });
    this.input.keyboard.once("keydown-ENTER", () => this.scene.start("Juego"));
  }
}

// ===== Arrancar Phaser =====
const juego = new Phaser.Game({
  type: Phaser.AUTO,
  width: CONFIG.ancho,
  height: CONFIG.alto,
  backgroundColor: "#120c26",
  physics: { default: "arcade" },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [Preparar, Inicio, Juego, Fin],
});
