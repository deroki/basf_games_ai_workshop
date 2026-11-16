// ===== Ajustes del juego: ¡prueba a cambiar estos números y colores! =====
const CONFIG = {
  ancho: 800,
  alto: 600,
  velocidadCoche: 300,        // lo rápido que conduces
  aceleracion: 450,           // lo rápido que arranca el taxi
  rozamiento: 300,            // lo rápido que se para al soltar la tecla
  giro: 2.8,                  // lo rápido que gira
  mundoAncho: 4000,           // tamaño del desierto
  mundoAlto: 4000,
  pasajerosParaGanar: 6,      // pasajeros que hay que entregar para ganar
  puntosPasajero: 50,
  puntosBitcoin: 10,
  puntosSoldado: 5,
  puntosPolicia: 30,
  segundosEntreBitcoins: 1.4,
  esperaDisparo: 90,          // milisegundos entre disparos de la ametralladora
  velocidadBala: 900,
  alcanceBala: 700,           // milisegundos que vive una bala
  vidaPolicia: 12,            // balas que aguanta un coche de policía
  segundosParaMasPolicias: 12, // cada tanto sale otro coche de policía
  maxPolicias: 3,
  colorTaxi: 0xffc107,
  colorCresta: 0xff2d95,
  colorArenaClara: 0xf2c879,
  colorArenaOscura: 0xd9a54f,
};

// Tres dificultades que se eligen al empezar (teclas 1, 2 y 3)
const DIFICULTADES = [
  { nombre: "FÁCIL", velPolicia: 110, soldadosCada: 2.8, velSoldado: 70 },
  { nombre: "NORMAL", velPolicia: 150, soldadosCada: 2.0, velSoldado: 95 },
  { nombre: "DIFÍCIL", velPolicia: 195, soldadosCada: 1.3, velSoldado: 125 },
];

// ===== Sonidos con Web Audio (sin archivos) =====
function sonido(escena, frecuencia, duracion, tipo = "square", bajada = 0, volumen = 0.12) {
  const ctx = escena.sound.context;
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const vol = ctx.createGain();
  const t = ctx.currentTime;
  osc.type = tipo;
  osc.frequency.setValueAtTime(frecuencia, t);
  if (bajada) osc.frequency.exponentialRampToValueAtTime(Math.max(30, frecuencia + bajada), t + duracion);
  vol.gain.setValueAtTime(volumen, t);
  vol.gain.exponentialRampToValueAtTime(0.001, t + duracion);
  osc.connect(vol);
  vol.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duracion);
}
const sonidoMetralla = (e) => sonido(e, 240, 0.06, "square", -120, 0.06);
const sonidoBitcoin = (e) => { sonido(e, 880, 0.08, "square"); setTimeout(() => sonido(e, 1320, 0.14, "square"), 70); };
const sonidoGolpe = (e) => sonido(e, 160, 0.3, "sawtooth", -110, 0.2);
const sonidoPasajero = (e) => { sonido(e, 520, 0.1, "triangle"); setTimeout(() => sonido(e, 660, 0.1, "triangle"), 100); setTimeout(() => sonido(e, 780, 0.2, "triangle"), 200); };
const sonidoSirena = (e) => { sonido(e, 700, 0.18, "sine", 300, 0.15); setTimeout(() => sonido(e, 1000, 0.18, "sine", -300, 0.15), 180); };

// ===== Texturas: dibujamos todo con código =====
function crearTexturas(escena) {
  const g = escena.make.graphics({ x: 0, y: 0, add: false });
  const A = CONFIG.ancho, H = CONFIG.alto;

  // Suelo del desierto (se repite en todas direcciones)
  g.fillStyle(CONFIG.colorArenaClara, 1);
  g.fillRect(0, 0, A, H);
  g.fillStyle(CONFIG.colorArenaOscura, 0.5);
  for (let i = 0; i < 40; i++) {
    g.fillEllipse(Phaser.Math.Between(60, A - 60), Phaser.Math.Between(40, H - 40), Phaser.Math.Between(30, 90), Phaser.Math.Between(8, 20));
  }
  g.generateTexture("suelo", A, H);
  g.clear();

  // Cactus
  g.fillStyle(0x2e8b57, 1);
  g.fillRoundedRect(15, 2, 12, 52, 6);
  g.fillRoundedRect(2, 16, 9, 22, 4);
  g.fillRoundedRect(31, 10, 9, 22, 4);
  g.fillRect(4, 32, 16, 7);
  g.fillRect(22, 26, 16, 7);
  g.generateTexture("cactus", 42, 58);
  g.clear();

  // Roca
  g.fillStyle(0x8d7b68, 1);
  g.fillEllipse(20, 14, 38, 24);
  g.fillStyle(0xb09d88, 1);
  g.fillEllipse(16, 10, 18, 10);
  g.generateTexture("roca", 40, 28);
  g.clear();

  // Flecha que señala el objetivo
  g.fillStyle(0xffffff, 1);
  g.fillTriangle(15, 0, 0, 28, 30, 28);
  g.generateTexture("flecha", 30, 28);
  g.clear();

  // Brillo para partículas
  g.fillStyle(0xffffff, 1);
  g.fillCircle(3, 3, 3);
  g.generateTexture("brillo", 6, 6);
  g.clear();

  // Taxi visto desde arriba (44 x 80) con el punki al volante
  g.fillStyle(0x000000, 1);
  g.fillRoundedRect(0, 12, 8, 18, 3);
  g.fillRoundedRect(36, 12, 8, 18, 3);
  g.fillRoundedRect(0, 52, 8, 18, 3);
  g.fillRoundedRect(36, 52, 8, 18, 3);
  g.fillStyle(CONFIG.colorTaxi, 1);
  g.fillRoundedRect(4, 2, 36, 76, 12);
  g.lineStyle(2, 0x7a5a00, 1);
  g.strokeRoundedRect(4, 2, 36, 76, 12);
  g.fillStyle(0x263238, 1);
  g.fillRoundedRect(8, 16, 28, 14, 4);   // parabrisas
  g.fillRoundedRect(8, 58, 28, 10, 4);   // luneta
  g.fillStyle(0xfff59d, 1);
  g.fillCircle(11, 6, 3);
  g.fillCircle(33, 6, 3);
  g.fillStyle(0xef5350, 1);
  g.fillCircle(11, 75, 3);
  g.fillCircle(33, 75, 3);
  // cartel TAXI
  g.fillStyle(0xffffff, 1);
  g.fillRoundedRect(15, 34, 14, 8, 2);
  g.fillStyle(0x222222, 1);
  g.fillRect(17, 37, 10, 2);
  // punki: cabeza con cresta rosa
  g.fillStyle(0xffcc99, 1);
  g.fillCircle(22, 48, 7);
  g.fillStyle(CONFIG.colorCresta, 1);
  g.fillTriangle(22, 38, 18, 52, 26, 52);
  g.fillTriangle(22, 36, 20, 46, 24, 46);
  g.fillStyle(0x222222, 1);
  g.fillCircle(19, 49, 1.5);
  g.fillCircle(25, 49, 1.5);
  g.generateTexture("taxi", 44, 80);
  g.clear();

  // Coche de policía (44 x 80)
  g.fillStyle(0x000000, 1);
  g.fillRoundedRect(0, 12, 8, 18, 3);
  g.fillRoundedRect(36, 12, 8, 18, 3);
  g.fillRoundedRect(0, 52, 8, 18, 3);
  g.fillRoundedRect(36, 52, 8, 18, 3);
  g.fillStyle(0xf5f5f5, 1);
  g.fillRoundedRect(4, 2, 36, 76, 12);
  g.lineStyle(2, 0x555555, 1);
  g.strokeRoundedRect(4, 2, 36, 76, 12);
  g.fillStyle(0x1565c0, 1);
  g.fillRect(4, 36, 36, 12);
  g.fillStyle(0x263238, 1);
  g.fillRoundedRect(8, 16, 28, 14, 4);
  g.fillRoundedRect(8, 56, 28, 10, 4);
  g.fillStyle(0xe53935, 1);
  g.fillRoundedRect(9, 32, 12, 6, 2);
  g.fillStyle(0x1e88e5, 1);
  g.fillRoundedRect(23, 32, 12, 6, 2);
  g.fillStyle(0xfff59d, 1);
  g.fillCircle(11, 6, 3);
  g.fillCircle(33, 6, 3);
  g.generateTexture("policia", 44, 80);
  g.clear();

  // Soldado del desierto con palo (36 x 44)
  g.lineStyle(5, 0x6d4c41, 1);
  g.lineBetween(30, 4, 30, 40);           // palo
  g.fillStyle(0x6b7a3a, 1);
  g.fillRoundedRect(6, 16, 22, 26, 8);    // cuerpo
  g.fillStyle(0x56632d, 1);
  g.fillRect(6, 30, 22, 4);
  g.fillStyle(0xffcc99, 1);
  g.fillCircle(17, 14, 8);                // cara
  g.fillStyle(0x4b5a24, 1);
  g.fillRoundedRect(8, 3, 18, 10, 5);     // casco
  g.fillStyle(0x222222, 1);
  g.fillCircle(14, 16, 1.5);
  g.fillCircle(20, 16, 1.5);
  g.lineStyle(2, 0x222222, 1);
  g.lineBetween(14, 21, 20, 21);          // gesto enfadado
  g.generateTexture("soldado", 36, 44);
  g.clear();

  // Bitcoin: moneda dorada con una B
  g.fillStyle(0xb8860b, 1);
  g.fillCircle(18, 20, 18);
  g.fillStyle(0xffc107, 1);
  g.fillCircle(18, 18, 18);
  g.lineStyle(3, 0xfff3b0, 1);
  g.strokeCircle(18, 18, 16);
  g.lineStyle(4, 0x8a5a00, 1);
  g.lineBetween(13, 9, 13, 27);
  g.beginPath();
  g.arc(14, 14, 5, -Math.PI / 2, Math.PI / 2);
  g.strokePath();
  g.beginPath();
  g.arc(14, 22, 5, -Math.PI / 2, Math.PI / 2);
  g.strokePath();
  g.lineStyle(2, 0x8a5a00, 1);
  g.lineBetween(16, 6, 16, 9);
  g.lineBetween(16, 27, 16, 30);
  g.generateTexture("bitcoin", 36, 36);
  g.clear();

  // Pasajero haciendo señas (30 x 44)
  g.lineStyle(4, 0xffcc99, 1);
  g.lineBetween(22, 22, 28, 6);           // brazo levantado
  g.fillStyle(0x7e57c2, 1);
  g.fillRoundedRect(6, 18, 18, 24, 7);
  g.fillStyle(0xffcc99, 1);
  g.fillCircle(15, 12, 8);
  g.fillStyle(0x4e342e, 1);
  g.fillRoundedRect(7, 3, 16, 7, 4);      // pelo
  g.fillStyle(0x222222, 1);
  g.fillCircle(12, 13, 1.5);
  g.fillCircle(18, 13, 1.5);
  g.generateTexture("pasajero", 30, 44);
  g.clear();

  // Destino: bandera verde
  g.fillStyle(0x00c853, 0.35);
  g.fillCircle(32, 32, 31);
  g.lineStyle(4, 0x00e676, 1);
  g.strokeCircle(32, 32, 28);
  g.lineStyle(4, 0xeeeeee, 1);
  g.lineBetween(26, 14, 26, 50);
  g.fillStyle(0xff1744, 1);
  g.fillTriangle(26, 14, 48, 22, 26, 31);
  g.generateTexture("destino", 64, 64);
  g.clear();

  // Bala de la ametralladora
  g.fillStyle(0xff9100, 0.6);
  g.fillRoundedRect(0, 0, 10, 30, 5);
  g.fillStyle(0xfff59d, 1);
  g.fillRoundedRect(3, 2, 4, 26, 2);
  g.generateTexture("bala", 10, 30);
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
  };
}

// ===== Pantalla de carga =====
class Preparar extends Phaser.Scene {
  constructor() { super("Preparar"); }
  create() {
    crearTexturas(this);
    this.registry.set("dificultad", 1);
    this.scene.start("Inicio");
  }
}

// ===== Pantalla de inicio =====
class Inicio extends Phaser.Scene {
  constructor() { super("Inicio"); }
  create() {
    const centro = CONFIG.ancho / 2;
    this.suelo = this.add.tileSprite(0, 0, CONFIG.ancho, CONFIG.alto, "suelo").setOrigin(0);
    this.add.rectangle(centro, CONFIG.alto / 2, CONFIG.ancho, CONFIG.alto, 0x000000, 0.45);

    const titulo = this.add.text(centro, 90, "KILLEMALL", estiloTexto(84, "#ffc107")).setOrigin(0.5);
    this.tweens.add({ targets: titulo, y: 110, duration: 1200, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    this.add.text(centro, 170, "Taxi punki del desierto", estiloTexto(26, "#ff2d95")).setOrigin(0.5);

    const taxi = this.add.image(centro, 260, "taxi").setScale(1.2);
    this.tweens.add({ targets: taxi, angle: { from: -8, to: 8 }, duration: 700, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    this.add.text(centro, 340, "Lleva pasajeros por el desierto sin que te pille la policía", estiloTexto(20)).setOrigin(0.5);
    this.add.text(centro, 372, "Flechas / WASD: conducir · ESPACIO: ametralladora · P: pausa", estiloTexto(20)).setOrigin(0.5);
    this.add.text(centro, 404, "₿ = puntos · Cuidado con los soldados del desierto", estiloTexto(20, "#ffd54f")).setOrigin(0.5);

    this.textoDif = this.add.text(centro, 462, "", estiloTexto(30, "#80d8ff")).setOrigin(0.5);
    this.add.text(centro, 494, "Elige dificultad con 1, 2 o 3", estiloTexto(18)).setOrigin(0.5);
    this.mostrarDificultad();
    this.input.keyboard.on("keydown-ONE", () => this.elegir(0));
    this.input.keyboard.on("keydown-TWO", () => this.elegir(1));
    this.input.keyboard.on("keydown-THREE", () => this.elegir(2));

    const empezar = this.add.text(centro, 550, "Pulsa ENTER para empezar", estiloTexto(32, "#80ff9a")).setOrigin(0.5);
    this.tweens.add({ targets: empezar, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });
    this.input.keyboard.once("keydown-ENTER", () => this.scene.start("Juego"));
  }
  elegir(n) {
    this.registry.set("dificultad", n);
    this.mostrarDificultad();
    sonido(this, 600 + n * 150, 0.1, "square");
  }
  mostrarDificultad() {
    const n = this.registry.get("dificultad");
    this.textoDif.setText(DIFICULTADES.map((d, i) => (i === n ? `[ ${i + 1} ${d.nombre} ]` : `${i + 1} ${d.nombre}`)).join("   "));
  }
  update() { this.suelo.tilePositionY -= 1.5; }
}

// ===== El juego (mundo abierto) =====
class Juego extends Phaser.Scene {
  constructor() { super("Juego"); }

  create() {
    this.dif = DIFICULTADES[this.registry.get("dificultad")];
    this.puntos = 0;
    this.bitcoins = 0;
    this.entregas = 0;
    this.terminado = false;
    this.llevaPasajero = false;
    this.aturdidoHasta = 0;
    this.ultimoDisparo = 0;
    this.velocidad = 0;

    const W = CONFIG.mundoAncho, H = CONFIG.mundoAlto;
    this.physics.world.setBounds(0, 0, W, H);

    // Suelo que se repite siguiendo a la cámara
    this.suelo = this.add.tileSprite(0, 0, CONFIG.ancho, CONFIG.alto, "suelo").setOrigin(0).setScrollFactor(0);

    // Cactus y rocas repartidos por el desierto (solo adorno)
    for (let i = 0; i < 260; i++) {
      const x = Phaser.Math.Between(40, W - 40);
      const y = Phaser.Math.Between(40, H - 40);
      if (Math.abs(x - W / 2) < 150 && Math.abs(y - H / 2) < 150) continue;
      this.add.image(x, y, Math.random() < 0.6 ? "cactus" : "roca").setDepth(1);
    }

    this.taxi = this.physics.add.image(W / 2, H / 2, "taxi").setDepth(5);
    this.taxi.setCollideWorldBounds(true);
    this.taxi.body.setCircle(22, 0, 18);
    this.cameras.main.setBounds(0, 0, W, H);
    this.cameras.main.startFollow(this.taxi, true, 0.12, 0.12);

    this.bitcoinsGrupo = this.physics.add.group();
    this.soldados = this.physics.add.group();
    this.policias = this.physics.add.group();
    this.balas = this.physics.add.group();
    this.pasajeros = this.physics.add.group();
    this.destinos = this.physics.add.group();

    this.physics.add.overlap(this.taxi, this.bitcoinsGrupo, (t, b) => this.cogerBitcoin(b));
    this.physics.add.overlap(this.taxi, this.pasajeros, (t, p) => this.recogerPasajero(p));
    this.physics.add.overlap(this.taxi, this.destinos, (t, d) => this.entregar(d));
    this.physics.add.overlap(this.taxi, this.soldados, (t, s) => this.golpeSoldado(s));
    this.physics.add.overlap(this.taxi, this.policias, () => this.terminar(false));
    this.physics.add.overlap(this.balas, this.soldados, (b, s) => this.balaSoldado(b, s));
    this.physics.add.overlap(this.balas, this.policias, (b, p) => this.balaPolicia(b, p));

    // Chispas y explosiones
    this.chispas = this.add.particles(0, 0, "brillo", {
      speed: { min: 80, max: 280 },
      scale: { start: 1.6, end: 0 },
      lifespan: 500,
      emitting: false,
    }).setDepth(8);

    // Humo del taxi
    this.humo = this.add.particles(0, 0, "brillo", {
      speed: { min: 10, max: 40 },
      scale: { start: 1.2, end: 0 },
      alpha: { start: 0.5, end: 0 },
      tint: 0xd7ccc8,
      lifespan: 450,
      frequency: 60,
    }).setDepth(4);
    this.humo.startFollow(this.taxi);

    // Flecha que apunta al pasajero o al destino
    this.flecha = this.add.image(0, 0, "flecha").setDepth(9).setAlpha(0.9);

    // Eventos de aparición
    this.time.addEvent({ delay: CONFIG.segundosEntreBitcoins * 1000, loop: true, callback: () => this.soltarBitcoin() });
    this.time.addEvent({ delay: this.dif.soldadosCada * 1000, loop: true, callback: () => this.soltarSoldado() });
    this.time.addEvent({ delay: CONFIG.segundosParaMasPolicias * 1000, loop: true, callback: () => this.nuevaPolicia() });
    this.time.delayedCall(4000, () => this.nuevaPolicia());
    for (let i = 0; i < 12; i++) this.soltarBitcoin(true);
    this.nuevoPasajero();

    // Marcador (fijo en la pantalla)
    this.textoPuntos = this.add.text(16, 12, "", estiloTexto(26)).setDepth(10).setScrollFactor(0);
    this.textoPasajeros = this.add.text(CONFIG.ancho - 16, 12, "", estiloTexto(26)).setOrigin(1, 0).setDepth(10).setScrollFactor(0);
    this.textoAviso = this.add.text(CONFIG.ancho / 2, 566, "", estiloTexto(24, "#80ff9a")).setOrigin(0.5).setDepth(10).setScrollFactor(0);
    this.actualizarMarcador();

    this.teclas = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,W,A,S,D,SPACE");
    this.input.keyboard.on("keydown-P", () => this.alternarPausa());
  }

  // Punto aleatorio cerca del taxi, fuera de la pantalla
  puntoCerca(min, max) {
    const ang = Math.random() * Math.PI * 2;
    const dist = Phaser.Math.Between(min, max);
    return {
      x: Phaser.Math.Clamp(this.taxi.x + Math.cos(ang) * dist, 40, CONFIG.mundoAncho - 40),
      y: Phaser.Math.Clamp(this.taxi.y + Math.sin(ang) * dist, 40, CONFIG.mundoAlto - 40),
    };
  }

  update(tiempo, delta) {
    if (this.terminado || this.physics.world.isPaused) return;
    const t = this.teclas;
    const dt = delta / 1000;
    const cam = this.cameras.main;

    this.suelo.tilePositionX = cam.scrollX;
    this.suelo.tilePositionY = cam.scrollY;

    // Conducir: izquierda/derecha giran, arriba acelera, abajo frena y da marcha atrás
    const aturdido = tiempo < this.aturdidoHasta;
    const maxima = aturdido ? CONFIG.velocidadCoche * 0.35 : CONFIG.velocidadCoche;
    const acelera = t.UP.isDown || t.W.isDown;
    const frena = t.DOWN.isDown || t.S.isDown;
    if (acelera) this.velocidad += CONFIG.aceleracion * dt;
    else if (frena) this.velocidad -= CONFIG.aceleracion * dt;
    else this.velocidad -= Math.sign(this.velocidad) * Math.min(Math.abs(this.velocidad), CONFIG.rozamiento * dt);
    this.velocidad = Phaser.Math.Clamp(this.velocidad, -maxima * 0.4, maxima);

    const giro = (t.RIGHT.isDown || t.D.isDown ? 1 : 0) - (t.LEFT.isDown || t.A.isDown ? 1 : 0);
    const agarre = Phaser.Math.Clamp(Math.abs(this.velocidad) / 120, 0, 1);
    this.taxi.rotation += giro * CONFIG.giro * agarre * Math.sign(this.velocidad || 1) * dt;
    const dir = this.taxi.rotation - Math.PI / 2;
    this.taxi.setVelocity(Math.cos(dir) * this.velocidad, Math.sin(dir) * this.velocidad);
    this.taxi.setAlpha(aturdido ? 0.6 + 0.4 * Math.sin(tiempo / 40) : 1);

    // Ametralladora: mantén ESPACIO
    if (t.SPACE.isDown && tiempo > this.ultimoDisparo + CONFIG.esperaDisparo) {
      this.ultimoDisparo = tiempo;
      this.disparar(tiempo);
    }

    // Balas que se pierden a lo lejos
    this.balas.getChildren().forEach((b) => { if (tiempo - b.nace > CONFIG.alcanceBala) b.destroy(); });

    // Cosas que se quedan atrás se borran
    [this.bitcoinsGrupo, this.soldados].forEach((grupo) =>
      grupo.getChildren().forEach((o) => {
        if (Phaser.Math.Distance.Between(o.x, o.y, this.taxi.x, this.taxi.y) > 1200) o.destroy();
      })
    );

    // Soldados: corren hacia el taxi
    this.soldados.getChildren().forEach((s) => {
      const ang = Phaser.Math.Angle.Between(s.x, s.y, this.taxi.x, this.taxi.y);
      s.setVelocity(Math.cos(ang) * this.dif.velSoldado, Math.sin(ang) * this.dif.velSoldado);
    });

    // Policías: persiguen al taxi
    this.policias.getChildren().forEach((p) => {
      if (tiempo < p.aturdidoHasta) { p.setVelocity(0, 0); return; }
      const ang = Phaser.Math.Angle.Between(p.x, p.y, this.taxi.x, this.taxi.y);
      p.setVelocity(Math.cos(ang) * this.dif.velPolicia, Math.sin(ang) * this.dif.velPolicia);
      p.setRotation(ang + Math.PI / 2);
    });

    this.actualizarFlecha();
  }

  actualizarFlecha() {
    const objetivo = (this.llevaPasajero ? this.destinos : this.pasajeros).getChildren()[0];
    this.flecha.setVisible(!!objetivo);
    if (!objetivo) return;
    const ang = Phaser.Math.Angle.Between(this.taxi.x, this.taxi.y, objetivo.x, objetivo.y);
    this.flecha.setPosition(this.taxi.x + Math.cos(ang) * 90, this.taxi.y + Math.sin(ang) * 90);
    this.flecha.setRotation(ang + Math.PI / 2);
    this.flecha.setTint(this.llevaPasajero ? 0x00e676 : 0xb388ff);
  }

  // --- Apariciones ---
  soltarBitcoin(porElMundo = false) {
    if (this.terminado || this.physics.world.isPaused || this.bitcoinsGrupo.countActive() >= 16) return;
    const p = porElMundo
      ? { x: Phaser.Math.Between(60, CONFIG.mundoAncho - 60), y: Phaser.Math.Between(60, CONFIG.mundoAlto - 60) }
      : this.puntoCerca(450, 800);
    const b = this.bitcoinsGrupo.create(p.x, p.y, "bitcoin").setDepth(3);
    b.body.setCircle(16, 2, 2);
    this.tweens.add({ targets: b, scaleX: { from: 1, to: 0.3 }, duration: 450, yoyo: true, repeat: -1 });
  }

  soltarSoldado() {
    if (this.terminado || this.physics.world.isPaused || this.soldados.countActive() >= 14) return;
    const p = this.puntoCerca(480, 650);
    const s = this.soldados.create(p.x, p.y, "soldado").setDepth(4);
    s.body.setSize(26, 34);
  }

  nuevaPolicia() {
    if (this.terminado || this.physics.world.isPaused) return;
    if (this.policias.countActive() >= CONFIG.maxPolicias) return;
    const pos = this.puntoCerca(520, 700);
    const p = this.policias.create(pos.x, pos.y, "policia").setDepth(5);
    p.body.setCircle(22, 0, 18);
    p.aturdidoHasta = 0;
    p.vida = CONFIG.vidaPolicia;
    sonidoSirena(this);
    this.textoAviso.setText("🚨 ¡La policía te persigue!").setColor("#ff8a80");
    this.time.delayedCall(2000, () => this.actualizarMarcador());
  }

  nuevoPasajero() {
    if (this.terminado || this.llevaPasajero || this.pasajeros.countActive() > 0) return;
    const pos = this.puntoCerca(600, 1300);
    const p = this.pasajeros.create(pos.x, pos.y, "pasajero").setDepth(3);
    p.body.setSize(34, 44);
    this.tweens.add({ targets: p, scale: { from: 1, to: 1.15 }, duration: 400, yoyo: true, repeat: -1 });
  }

  nuevoDestino() {
    if (this.terminado || !this.llevaPasajero || this.destinos.countActive() > 0) return;
    const pos = this.puntoCerca(800, 1500);
    const d = this.destinos.create(pos.x, pos.y, "destino").setDepth(2);
    d.body.setCircle(26, 6, 6);
    this.tweens.add({ targets: d, scale: { from: 0.9, to: 1.2 }, duration: 500, yoyo: true, repeat: -1 });
  }

  // --- Acciones ---
  disparar(tiempo) {
    const dir = this.taxi.rotation - Math.PI / 2;
    const lado = dir + Math.PI / 2;
    [-9, 9].forEach((desvio) => {
      const x = this.taxi.x + Math.cos(dir) * 44 + Math.cos(lado) * desvio;
      const y = this.taxi.y + Math.sin(dir) * 44 + Math.sin(lado) * desvio;
      const b = this.balas.create(x, y, "bala").setDepth(6).setRotation(this.taxi.rotation);
      b.body.setCircle(5, 0, 10);
      b.nace = tiempo;
      b.setVelocity(Math.cos(dir) * CONFIG.velocidadBala, Math.sin(dir) * CONFIG.velocidadBala);
    });
    sonidoMetralla(this);
  }

  cogerBitcoin(b) {
    this.chispas.setParticleTint(0xffc107);
    this.chispas.explode(12, b.x, b.y);
    b.destroy();
    this.bitcoins += 1;
    this.puntos += CONFIG.puntosBitcoin;
    sonidoBitcoin(this);
    this.actualizarMarcador();
  }

  recogerPasajero(p) {
    this.chispas.setParticleTint(0xb388ff);
    this.chispas.explode(16, p.x, p.y);
    p.destroy();
    this.llevaPasajero = true;
    sonidoPasajero(this);
    this.nuevoDestino();
    this.actualizarMarcador();
  }

  entregar(d) {
    this.chispas.setParticleTint(0x00e676);
    this.chispas.explode(24, d.x, d.y);
    d.destroy();
    this.llevaPasajero = false;
    this.entregas += 1;
    this.puntos += CONFIG.puntosPasajero;
    sonidoPasajero(this);
    this.cameras.main.flash(200, 120, 255, 160);
    this.actualizarMarcador();
    if (this.entregas >= CONFIG.pasajerosParaGanar) this.terminar(true);
    else this.time.delayedCall(800, () => this.nuevoPasajero());
  }

  golpeSoldado(s) {
    this.chispas.setParticleTint(0xef5350);
    this.chispas.explode(16, s.x, s.y);
    s.destroy();
    this.aturdidoHasta = this.time.now + 1200;
    this.cameras.main.shake(250, 0.012);
    this.cameras.main.flash(150, 255, 80, 80);
    sonidoGolpe(this);
  }

  balaSoldado(b, s) {
    this.chispas.setParticleTint(0xff1744);
    this.chispas.explode(14, s.x, s.y);
    b.destroy();
    s.destroy();
    this.puntos += CONFIG.puntosSoldado;
    sonido(this, 300, 0.15, "square", -200);
    this.actualizarMarcador();
  }

  // La policía aguanta varios disparos y luego explota
  balaPolicia(b, p) {
    this.chispas.setParticleTint(0xfff176);
    this.chispas.explode(6, b.x, b.y);
    b.destroy();
    p.vida -= 1;
    p.setTint(0xff8a80);
    this.time.delayedCall(80, () => p.active && p.clearTint());
    if (p.vida > 0) return;
    for (const color of [0xff6f00, 0xffd54f, 0x424242]) {
      this.chispas.setParticleTint(color);
      this.chispas.explode(24, p.x, p.y);
    }
    p.destroy();
    this.puntos += CONFIG.puntosPolicia;
    this.cameras.main.shake(200, 0.01);
    sonidoGolpe(this);
    this.actualizarMarcador();
  }

  actualizarMarcador() {
    this.textoPuntos.setText(`⭐ ${this.puntos}   ₿ ${this.bitcoins}`);
    this.textoPasajeros.setText(`🚕 ${this.entregas}/${CONFIG.pasajerosParaGanar}`);
    this.textoAviso
      .setText(this.llevaPasajero ? "🏁 ¡Sigue la flecha verde hasta el destino!" : "🧍 ¡Sigue la flecha morada hasta el pasajero!")
      .setColor("#80ff9a");
  }

  alternarPausa() {
    if (this.terminado) return;
    if (this.physics.world.isPaused) {
      this.physics.resume();
      this.tweens.resumeAll();
      this.cartelPausa.destroy();
    } else {
      this.physics.pause();
      this.tweens.pauseAll();
      this.cartelPausa = this.add.text(CONFIG.ancho / 2, CONFIG.alto / 2, "PAUSA\n(pulsa P)", { ...estiloTexto(56), align: "center" })
        .setOrigin(0.5).setDepth(20).setScrollFactor(0);
    }
  }

  terminar(gano) {
    if (this.terminado) return;
    this.terminado = true;
    this.physics.pause();
    this.humo.stop();
    if (!gano) {
      this.cameras.main.shake(400, 0.02);
      sonidoGolpe(this);
      sonidoSirena(this);
    }
    this.time.delayedCall(900, () => this.scene.start("Fin", { gano, puntos: this.puntos, entregas: this.entregas }));
  }
}

// ===== Pantalla final =====
class Fin extends Phaser.Scene {
  constructor() { super("Fin"); }
  create(datos) {
    const centro = CONFIG.ancho / 2;
    this.suelo = this.add.tileSprite(0, 0, CONFIG.ancho, CONFIG.alto, "suelo").setOrigin(0);
    this.add.rectangle(centro, CONFIG.alto / 2, CONFIG.ancho, CONFIG.alto, 0x000000, 0.55);

    // Récord guardado en el navegador
    const record = Math.max(datos.puntos, Number(localStorage.getItem("killemall-record") || 0));
    localStorage.setItem("killemall-record", record);

    const texto = datos.gano ? "¡HAS GANADO!" : "¡TE ATRAPÓ LA POLICÍA!";
    const titulo = this.add.text(centro, 190, texto, estiloTexto(datos.gano ? 66 : 52, datos.gano ? "#80ff9a" : "#ef5350")).setOrigin(0.5).setScale(0);
    this.tweens.add({ targets: titulo, scale: 1, duration: 500, ease: "Back.easeOut" });
    this.add.text(centro, 290, `Pasajeros entregados: ${datos.entregas}`, estiloTexto(30)).setOrigin(0.5);
    this.add.text(centro, 340, `Puntos: ${datos.puntos}`, estiloTexto(40)).setOrigin(0.5);
    this.add.text(centro, 395, `Récord: ${record}`, estiloTexto(30, "#ffd54f")).setOrigin(0.5);

    const otra = this.add.text(centro, 490, "Pulsa Enter para jugar otra vez", estiloTexto(30, "#80ff9a")).setOrigin(0.5);
    this.tweens.add({ targets: otra, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });
    this.input.keyboard.once("keydown-ENTER", () => this.scene.start("Inicio"));
  }
  update() { this.suelo.tilePositionY -= 1.5; }
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
