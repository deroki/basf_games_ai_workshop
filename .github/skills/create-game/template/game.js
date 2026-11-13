// ===== Ajustes del juego: ¡prueba a cambiar estos números y colores! =====
const CONFIG = {
  ancho: 800,
  alto: 600,
  velocidadJugador: 380,
  vidas: 3,
  segundosEntreObjetos: 0.7,
  velocidadCaida: 220,
  colorJugador: 0x4fc3f7,
  colorFondoArriba: 0x1b1b3a,
  colorFondoAbajo: 0x693668,
  colorBueno: 0xffd54f,
  colorMalo: 0xef5350,
};

// ===== Texturas: dibujamos los gráficos con código (no hacen falta imágenes) =====
function crearTexturas(escena) {
  const g = escena.make.graphics({ x: 0, y: 0, add: false });

  // Fondo con degradado (con un canvas normal, que funciona en cualquier navegador)
  const fondo = escena.textures.createCanvas("fondo", CONFIG.ancho, CONFIG.alto);
  const degradado = fondo.context.createLinearGradient(0, 0, 0, CONFIG.alto);
  degradado.addColorStop(0, Phaser.Display.Color.IntegerToColor(CONFIG.colorFondoArriba).rgba);
  degradado.addColorStop(1, Phaser.Display.Color.IntegerToColor(CONFIG.colorFondoAbajo).rgba);
  fondo.context.fillStyle = degradado;
  fondo.context.fillRect(0, 0, CONFIG.ancho, CONFIG.alto);
  fondo.refresh();
  // Estrellitas de fondo
  g.fillStyle(0xffffff, 1);
  g.fillCircle(3, 3, 2);
  g.generateTexture("brillo", 6, 6);
  g.clear();

  // Jugador: cuerpo redondeado con ojos
  g.fillStyle(CONFIG.colorJugador, 1);
  g.fillRoundedRect(0, 0, 60, 60, 18);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(20, 24, 9);
  g.fillCircle(42, 24, 9);
  g.fillStyle(0x222222, 1);
  g.fillCircle(22, 26, 4);
  g.fillCircle(44, 26, 4);
  g.lineStyle(3, 0x222222, 1);
  g.beginPath();
  g.arc(31, 38, 10, 0.2, Math.PI - 0.2);
  g.strokePath();
  g.generateTexture("jugador", 60, 60);
  g.clear();

  // Objeto bueno: estrella
  g.fillStyle(CONFIG.colorBueno, 1);
  g.lineStyle(3, 0xffffff, 1);
  const puntas = [];
  for (let i = 0; i < 10; i++) {
    const radio = i % 2 === 0 ? 20 : 9;
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    puntas.push({ x: 22 + Math.cos(ang) * radio, y: 22 + Math.sin(ang) * radio });
  }
  g.fillPoints(puntas, true);
  g.strokePoints(puntas, true);
  g.generateTexture("bueno", 44, 44);
  g.clear();

  // Objeto malo: roca con pinchos
  g.fillStyle(CONFIG.colorMalo, 1);
  g.fillCircle(22, 22, 16);
  g.fillTriangle(22, 0, 14, 10, 30, 10);
  g.fillTriangle(22, 44, 14, 34, 30, 34);
  g.fillTriangle(0, 22, 10, 14, 10, 30);
  g.fillTriangle(44, 22, 34, 14, 34, 30);
  g.fillStyle(0x000000, 0.35);
  g.fillCircle(16, 18, 4);
  g.fillCircle(28, 26, 3);
  g.generateTexture("malo", 44, 44);
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

// Fondo común a todas las pantallas: degradado + estrellitas que caen despacio
function crearFondo(escena) {
  escena.add.image(0, 0, "fondo").setOrigin(0);
  escena.add.particles(0, 0, "brillo", {
    x: { min: 0, max: CONFIG.ancho },
    y: -10,
    lifespan: 7000,
    speedY: { min: 30, max: 90 },
    scale: { min: 0.3, max: 1 },
    alpha: { start: 0.9, end: 0.1 },
    frequency: 120,
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
    crearFondo(this);
    const centro = CONFIG.ancho / 2;

    const titulo = this.add.text(centro, 190, "Mi Juego", estiloTexto(80, "#ffd54f")).setOrigin(0.5);
    this.tweens.add({ targets: titulo, y: 210, duration: 1200, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    const heroe = this.add.image(centro, 340, "jugador").setScale(1.6);
    this.tweens.add({ targets: heroe, angle: { from: -6, to: 6 }, duration: 700, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    this.add.text(centro, 450, "Flechas o A/D para moverte · P para pausa", estiloTexto(22)).setOrigin(0.5);
    const empezar = this.add.text(centro, 510, "Pulsa ENTER para empezar", estiloTexto(32, "#80ff9a")).setOrigin(0.5);
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
    this.terminado = false;

    // La física "arcade" se encarga de mover y detectar choques
    this.jugador = this.physics.add.image(CONFIG.ancho / 2, CONFIG.alto - 70, "jugador");
    this.jugador.setCollideWorldBounds(true);
    this.jugador.body.setSize(48, 52);

    this.buenos = this.physics.add.group();
    this.malos = this.physics.add.group();

    this.physics.add.overlap(this.jugador, this.buenos, (j, objeto) => this.cogerBueno(objeto));
    this.physics.add.overlap(this.jugador, this.malos, (j, objeto) => this.tocarMalo(objeto));

    // Efecto de partículas reutilizable (explosión de chispas)
    this.chispas = this.add.particles(0, 0, "brillo", {
      speed: { min: 80, max: 260 },
      scale: { start: 1.6, end: 0 },
      lifespan: 500,
      emitting: false,
    });

    // Cada cierto tiempo cae un objeto nuevo
    this.time.addEvent({
      delay: CONFIG.segundosEntreObjetos * 1000,
      loop: true,
      callback: () => this.soltarObjeto(),
    });

    // Marcador
    this.textoPuntos = this.add.text(20, 14, "", estiloTexto(30)).setDepth(10);
    this.textoVidas = this.add.text(CONFIG.ancho - 20, 14, "", estiloTexto(30)).setOrigin(1, 0).setDepth(10);
    this.actualizarMarcador();

    this.teclas = this.input.keyboard.addKeys("LEFT,RIGHT,A,D");
    this.input.keyboard.on("keydown-P", () => this.alternarPausa());
  }

  update() {
    if (this.terminado || this.physics.world.isPaused) return;

    const izquierda = this.teclas.LEFT.isDown || this.teclas.A.isDown;
    const derecha = this.teclas.RIGHT.isDown || this.teclas.D.isDown;
    this.jugador.setVelocityX(izquierda ? -CONFIG.velocidadJugador : derecha ? CONFIG.velocidadJugador : 0);

    // Borra los objetos que se salen por abajo
    [this.buenos, this.malos].forEach((grupo) =>
      grupo.getChildren().forEach((o) => { if (o.y > CONFIG.alto + 40) o.destroy(); })
    );
  }

  soltarObjeto() {
    if (this.terminado || this.physics.world.isPaused) return;
    const esBueno = Math.random() < 0.65;
    const x = Phaser.Math.Between(30, CONFIG.ancho - 30);
    const objeto = (esBueno ? this.buenos : this.malos).create(x, -30, esBueno ? "bueno" : "malo");
    objeto.setVelocityY(CONFIG.velocidadCaida + Phaser.Math.Between(-40, 80));
    this.tweens.add({ targets: objeto, angle: 360, duration: 2500, repeat: -1 });
  }

  cogerBueno(objeto) {
    this.chispas.setParticleTint(CONFIG.colorBueno);
    this.chispas.explode(14, objeto.x, objeto.y);
    objeto.destroy();
    this.puntos += 10;
    this.actualizarMarcador();
    this.tweens.add({ targets: this.jugador, scale: { from: 1.25, to: 1 }, duration: 160 });
  }

  tocarMalo(objeto) {
    this.chispas.setParticleTint(CONFIG.colorMalo);
    this.chispas.explode(20, objeto.x, objeto.y);
    objeto.destroy();
    this.vidas -= 1;
    this.actualizarMarcador();
    this.cameras.main.shake(250, 0.012);
    this.cameras.main.flash(150, 255, 80, 80);
    if (this.vidas <= 0) this.terminar();
  }

  actualizarMarcador() {
    this.textoPuntos.setText(`⭐ ${this.puntos}`);
    this.textoVidas.setText("❤️".repeat(Math.max(this.vidas, 0)));
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
        .setOrigin(0.5).setDepth(20);
    }
  }

  terminar() {
    this.terminado = true;
    this.physics.pause();
    this.time.delayedCall(700, () => this.scene.start("Fin", { puntos: this.puntos }));
  }
}

// ===== Pantalla final =====
class Fin extends Phaser.Scene {
  constructor() { super("Fin"); }
  create(datos) {
    crearFondo(this);
    const centro = CONFIG.ancho / 2;

    // Récord guardado en el navegador
    const record = Math.max(datos.puntos, Number(localStorage.getItem("record") || 0));
    localStorage.setItem("record", record);

    const titulo = this.add.text(centro, 200, "¡Fin del juego!", estiloTexto(68, "#ef5350")).setOrigin(0.5).setScale(0);
    this.tweens.add({ targets: titulo, scale: 1, duration: 500, ease: "Back.easeOut" });
    this.add.text(centro, 310, `Puntos: ${datos.puntos}`, estiloTexto(40)).setOrigin(0.5);
    this.add.text(centro, 365, `Récord: ${record}`, estiloTexto(30, "#ffd54f")).setOrigin(0.5);

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
