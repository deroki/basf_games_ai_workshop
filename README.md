# AI Games Workshop

Taller para que equipos de chicos y chicas creen su propio **videojuego 2D en JavaScript** con ayuda de la IA. Con el comando `/create_game`, Copilot les va haciendo preguntas, diseña el juego, lo construye y lo abre en el navegador. Después entran en un bucle de mejoras.

## Cómo se usa

1. Abre este repositorio en VS Code con GitHub Copilot Chat.
2. En el chat escribe `/create_game`.
3. Responde a las preguntas de Copilot (ver abajo).
4. Cuando confirmes la ficha del juego, Copilot lo crea en `games/<nombre-del-juego>/` y lo abre en el navegador.
5. Sigue pidiendo mejoras hasta que digáis "Ya está, ¡me encanta!".

Para volver a jugar más tarde, abre `games/<nombre-del-juego>/index.html` con doble clic. No hace falta instalar nada ni tener internet.

## Cómo funciona

- **Equipos**: lo primero que pregunta es cuántas personas forman el equipo. A cada una le asigna un número (Jugador 1, 2, 3…).
- **Preguntas de equipo (👥)**: las decide todo el equipo junto (nombre, tipo de juego, reglas, confirmación final…).
- **Preguntas individuales (🙋)**: van dirigidas a un jugador concreto, por turnos (protagonista, escenario, enemigos, objetos…).
- **Barra de progreso**: cada pregunta muestra cuántas faltan (`📊 Progreso: 🟩🟩🟩⬜⬜⬜⬜⬜⬜⬜ 3/10`).
- **Ficha del juego**: antes de escribir código, Copilot resume el juego y pide el OK del equipo.
- **Imágenes**: si aportan un dibujo o una foto, se usa como inspiración para dibujar al personaje con código.
- **Sin depuración**: Copilot escribe el código y abre el juego; si algo falla, lo corrige según lo que cuenten los chicos o avisan a un monitor.

## Tecnología

- HTML + JavaScript con [Phaser 3.90](https://phaser.io) (licencia MIT), incluido en local como `phaser.min.js`. No hay CDNs, npm ni build.
- Control con teclado.

## Estructura

```
.github/
  prompts/create_game.prompt.md      # comando /create_game
  skills/create-game/
    SKILL.md                         # instrucciones del skill (flujo completo)
    template/                        # plantilla base (index.html, game.js, phaser.min.js)
games/
  <nombre-del-juego>/                # cada juego creado (index.html, game.js, phaser.min.js, assets/)
```

## Para monitores

- Cambiar el flujo de preguntas, las reglas técnicas o el estilo: edita [SKILL.md](.github/skills/create-game/SKILL.md).
- Cambiar el aspecto o el comportamiento base de todos los juegos: edita la [plantilla](.github/skills/create-game/template/).
- La plantilla es un juego de ejemplo completo (recoger estrellas y esquivar rocas) que sirve para probar que todo funciona antes del taller.
