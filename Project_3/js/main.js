// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application();

let sceneWidth, sceneHeight;

// aliases
let stage;
let assets;

// game variables
let startScene;
let gameScene, player, scoreLabel, lifeLabel;
let gameOverScene;

let score = 0;
let life = 100;
let levelNum = 1;
let paused = true;

let playerMoveVector;

let finalScoreText;

// Load all assets
loadImages();



async function loadImages() {
  // https://pixijs.com/8.x/guides/components/assets#loading-multiple-assets
  PIXI.Assets.addBundle("sprites", {
    player: "images/playerImg.jpg",
  });

  // The second argument is a callback function that is called whenever the loader makes progress.
  assets = await PIXI.Assets.loadBundle("sprites", (progress) => {
    console.log(`progress=${(progress * 100).toFixed(2)}%`); // 0.4288 => 42.88%
  });

  setup();
}

async function setup() {
  await app.init({ width: 600, height: 600 });

  document.body.appendChild(app.canvas);

  stage = app.stage;
  sceneWidth = app.renderer.width;
  sceneHeight = app.renderer.height;

  // #1 - Create the `start` scene
  startScene = new PIXI.Container;
  stage.addChild(startScene);
  // #2 - Create the main `game` scene and make it invisible
  gameScene = new PIXI.Container;
  gameScene.visible = false;
  stage.addChild(gameScene);
  // #3 - Create the `gameOver` scene and make it invisible
  gameOverScene = new PIXI.Container;
  gameOverScene.visible = false;
  stage.addChild(gameOverScene);
  // #4 - Create labels for all 3 scenes
  CreateLabelsAndButtons();
  // #5 - Create player
  player = new Player(assets.player, 0, 0, 5);
  gameScene.addChild(player);
  playerMoveVector = new Vector();
  // #6 - Load Sounds
 

  // #7 - Load sprite sheet

  // #8 - Start update loop
  app.ticker.add(gameLoop);

  // #9 - Start listening for click events on the canvas

  // Now our `startScene` is visible
  // Clicking the button calls startGame()


  // adding input listeners for movement
  document.addEventListener("keydown", (event) => 
  {
    switch (event.key)
    {
      case "ArrowUp":
      case "w":
        playerMoveVector.y = -1;
        break;

      case "ArrowDown":
      case "s":
        playerMoveVector.y = 1;
        break;

      case "ArrowLeft":
      case "a":
        playerMoveVector.x = -1;
        break;

      case "ArrowRight":
      case "d":
        playerMoveVector.x = 1;
        break;

    }
  });

  document.addEventListener("keyup", (event) => 
    {
      switch (event.key)
      {
        case "ArrowUp":
        case "w":
          playerMoveVector.y = 0;
          break;
  
        case "ArrowDown":
        case "s":
          playerMoveVector.y = 0;
          break;
  
        case "ArrowLeft":
        case "a":
          playerMoveVector.x = 0;
          break;
  
        case "ArrowRight":
        case "d":
          playerMoveVector.x = 0;
          break;
  
      }
    });
}

function CreateLabelsAndButtons()
{
  let buttonStyle = {
    Fill: 0xff0000,
    fontSize: 48,
    fontFamily: "Verdana",
    stroke: 0xff0000,
    strokeThickness: 6,
  };

  // 1, set up startScene
  // 1A, make top start label
  let startLabel = new PIXI.Text("Game", {
    fill: 0xffffff,
    fontSize: 96,
    fontFamily: "Verdana",
    stroke: 0xff0000,
    strokeThickness: 6,
  });
  startLabel.x = 25;
  startLabel.y = 120;
  startScene.addChild(startLabel);

  //1B, make middle start label
  let startLabel2 = new PIXI.Text("", {
      fill: 0xffffff,
      fontSize: 32,
      fontFamily: "Verdana",
      fontStyle: "italic",
      stroke: 0xff0000,
      strokeThickness: 6,
  });
  startLabel2.x = 185;
  startLabel2.y = 300;
  startScene.addChild(startLabel2);

  //1C make start game button
  let startButton = new PIXI.Text("Start", buttonStyle);
  startButton.x = sceneWidth / 2 - startButton.width / 2;
  startButton.y = sceneHeight - 100;
  startButton.interactive = true;
  startButton.buttonMode = true;
  startButton.on("pointerup", startGame);
  startButton.on("pointerover", (e) => (e.target.alpha = 0.7));
  startButton.on("pointerout", (e) => (e.currentTarget.alpha = 1.0));
  startScene.addChild(startButton);

  let textStyle = {
    fill: 0xffffff,
    fontSize: 18,
    fontFamily: "Verdana",
    stroke: 0xff0000,
    strokeThickness: 4,
  };

  scoreLabel = new PIXI.Text("", textStyle);
  scoreLabel.x = 5;
  scoreLabel.y = 5;
  gameScene.addChild(scoreLabel);
  increaseScoreBy(0);

  lifeLabel = new PIXI.Text("", textStyle);
  lifeLabel.x = 5;
  lifeLabel.y = 26;
  gameScene.addChild(lifeLabel);
  decreaseLifeBy(0);

  // 3 - set up `gameOverScene`
  // 3A - make game over text
  let gameOverText = new PIXI.Text("Game Over!\n        :-O", {
    fill: 0xffffff,
    fontSize: 64,
    fontFamily: "Futura",
    stroke: 0xff0000,
    strokeThickness: 6,
  });
  gameOverText.x = sceneWidth / 2 - gameOverText.width / 2;
  gameOverText.y = sceneHeight / 2 - 160;
  gameOverScene.addChild(gameOverText);

  finalScoreText = new PIXI.Text(`Your final score : ${score}`, {
    fill: 0xffffff,
    fontSize: 24,
    fontFamily: "Futura",
    stroke: 0xff0000,
    strokeThickness: 6,
  });
  finalScoreText.x = sceneWidth / 2 - finalScoreText.width / 2;
  finalScoreText.y = sceneHeight / 2 + 30;
  gameOverScene.addChild(finalScoreText);

  // 3B - make "play again?" button
  let playAgainButton = new PIXI.Text("Play Again?", buttonStyle);
  playAgainButton.x = sceneWidth / 2 - playAgainButton.width / 2;
  playAgainButton.y = sceneHeight - 100;
  playAgainButton.interactive = true;
  playAgainButton.buttonMode = true;
  playAgainButton.on("pointerup", startGame); // startGame is a function reference
  playAgainButton.on("pointerover", (e) => (e.target.alpha = 0.7)); // concise arrow function with no brackets
  playAgainButton.on("pointerout", (e) => (e.currentTarget.alpha = 1.0)); // ditto
  gameOverScene.addChild(playAgainButton);
}



function startGame()
{
  console.log("startGame called");
  startScene.visible = false;
  gameOverScene.visible = false;
  gameScene.visible = true;
  app.view.onclick = getLoc; // TODO: Implement
  levelNum = 1;
  score = 0;
  life = 100;
  increaseScoreBy(0);
  decreaseLifeBy(0);
  loadLevel();

  setTimeout(() => {
    paused = false;
  }, 50);
}

function getLoc()
{

}

function increaseScoreBy(value)
{
  score += value;
  scoreLabel.text = `Score:   ${score}`;
}

function decreaseLifeBy(value)
{
  life -= value;
  life = parseInt(life);
  lifeLabel.text = `Life:   ${life}%`;
}

function gameLoop()
{
  if (paused) return; // keep this commented out for now

    // #1 - Calculate "delta time"
  let dt = 1 / app.ticker.FPS;
  if (dt > 1 / 12) dt = 1 / 12;


    // #2 - Move Player
    player.update(playerMoveVector);
  let mousePosition = app.renderer.events.pointer.global;

  let amt = 6 * dt;

 
}



function loadLevel()
{
}

function end()
{
  paused = true;

  

  app.view.onclick = null; 

  finalScoreText.text = `Your final score : ${score}`;

  gameOverScene.visible = true;
  gameScene.visible = false;
}

function fireBullet()
{
  if (paused) return;

  let b = new Bullet(0xffffff, ship.x, ship.y);
  bullets.push(b);
  gameScene.addChild(b);
  if (score >= 5)
  {
    let b2 = new Bullet(0xffffff, ship.x + 10, ship.y);
    bullets.push(b2);
    gameScene.addChild(b2);

    let b3 = new Bullet(0xffffff, ship.x - 10, ship.y);
    bullets.push(b3);
    gameScene.addChild(b3);
  }
  
  shootSound.play();
}

function loadSpriteSheet()
{
  let spriteSheet  = PIXI.Texture.from("images/explosions.png");
  let width = 64;
  let height = 64;
  let numFrames = 16;
  let textures = [];
  for (let i = 0; i < numFrames; i++)
  {
    let frame = new PIXI.Texture({
      source: spriteSheet,
      frame: new PIXI.Rectangle(i * width, 64, width, height),
    });
    textures.push(frame);
  }
  return textures;
}

function createExplosion(x, y, frameWidth, frameHeight)
{
  let w2 = frameWidth / 2;
  let h2 = frameHeight / 2;
  let expl = new PIXI.AnimatedSprite(explosionTextures);
  expl.x  = x - w2;
  expl.y = y - h2;
  expl.animationSpeed = 1 / 2;
  expl.loop = false;
  expl.onComplete = () => gameScene.removeChild(expl);
  explosions.push(expl);
  gameScene.addChild(expl);
  expl.play();
}