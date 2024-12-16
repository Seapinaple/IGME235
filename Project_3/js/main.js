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

let walls;
let rats;
let exit;

let mouseSprites;
// level maps
const lvl1 = [["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
["w", "e", "e", "e", "e", "e", "e", "e", "e", "e", "w", "w", "w", "e", "w", "w", "w", "w", "e", "e", "e", "w", "w", "w", "w"],
["w", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "w", "w", "w", "w", "e", "e", "w", "e", "e", "e", "w", "w", "w"],
["w", "e", "w", "w", "e", "w", "w", "e", "w", "w", "e", "w", "w", "w", "w", "e", "w", "w", "e", "w", "w", "e", "w", "w", "w"],
["w", "e", "e", "e", "w", "w", "w", "w", "e", "w", "e", "e", "w", "w", "w", "e", "e", "w", "w", "w", "w", "w", "e", "w", "w"],
["w", "e", "w", "w", "w", "e", "w", "e", "e", "w", "e", "w", "e", "w", "w", "w", "w", "w", "w", "w", "e", "w", "w", "w", "w"],
["w", "w", "w", "w", "w", "e", "w", "w", "w", "e", "w", "w", "w", "w", "w", "w", "w", "w", "w", "e", "w", "e", "w", "w", "w"],
["w", "w", "w", "w", "w", "w", "w", "w", "e", "e", "w", "w", "w", "e", "w", "w", "w", "w", "e", "w", "w", "e", "w", "w", "w"],
["w", "w", "w", "w", "w", "w", "w", "w", "e", "w", "w", "w", "w", "e", "w", "w", "w", "w", "w", "w", "w", "e", "e", "w", "w"],
["w", "w", "w", "w", "w", "w", "w", "w", "e", "e", "w", "w", "e", "e", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "e", "e", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w",]]; // 15 tall by 25 wide
const lvl2 = [["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
["w", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "w"],
["w", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "w"],
["w", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "r", "e", "e", "e", "e", "e", "e", "w"],
["w", "e", "e", "e", "e", "r", "e", "e", "e", "w", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "w"],
["w", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "r", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "w"],
["w", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "w"],
["w", "e", "e", "e", "e", "e", "e", "e", "e", "e", "x", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "w"],
["w", "w", "e", "e", "w", "w", "w", "w", "e", "w", "w", "w", "w", "e", "w", "w", "w", "e", "e", "w", "w", "e", "e", "w", "w"],
["w", "w", "e", "e", "w", "w", "w", "w", "e", "e", "w", "w", "e", "e", "w", "w", "w", "e", "e", "e", "e", "e", "w", "w", "w"],
["w", "w", "e", "e", "e", "e", "e", "w", "w", "w", "w", "w", "e", "e", "w", "w", "w", "e", "e", "e", "e", "e", "w", "w", "w"],
["w", "w", "e", "e", "e", "e", "e", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "e", "e", "w", "w", "w", "w", "w", "w"],
["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w",]]; // 15 tall by 25 wide



// Load all assets
loadImages();



async function loadImages() {
  // https://pixijs.com/8.x/guides/components/assets#loading-multiple-assets
  PIXI.Assets.addBundle("sprites", {
    player: "images/playerImg.jpg",
    lm: "images/MouseLeft.png",
    rm: "images/MouseRight.png",
    stair: "images/stairs.png",
    wall: "images/wwall.jpg",
  });

  // The second argument is a callback function that is called whenever the loader makes progress.
  assets = await PIXI.Assets.loadBundle("sprites", (progress) => {
    // console.log(`progress=${(progress * 100).toFixed(2)}%`); // 0.4288 => 42.88%
  });

  setup();
}

async function setup() {
  await app.init({ width: 850, height: 600,  backgroundColor: 0x1099bb });
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
  player = new Player(assets.player, 200, 200, 1.5, (sceneWidth / 26));
  gameScene.addChild(player);
  playerMoveVector = new Vector();
  // #6 - Load Sounds
 
  walls = {};
  // #7 - Load sprite sheet
  // #8 - Start update loop
  app.ticker.add(gameLoop);

  mouseSprites = loadSpriteSheet();

  // #9 - Start listening for click events on the canvas
  walls = [];
  rats = [];
  setupLevel(lvl2);
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

// create text to sho on the screen
function CreateLabelsAndButtons()
{
  let buttonStyle = {
    Fill: 0xffc320,
    fontSize: 48,
    fontFamily: "Comic Sans MS",
    stroke: 0xff0000,
    strokeThickness: 6,
  };

  // 1, set up startScene
  // 1A, make top start label
  let startLabel = new PIXI.Text("LIL Kity", {
    fill: 0xCC00CC,
    fontSize: 96,
    fontFamily: "Comic Sans MS",
    stroke: 0xff0000,
    strokeThickness: 6,
  });
  startLabel.x = 25;
  startLabel.y = 120;
  startScene.addChild(startLabel);

  //1B, make middle start label
  let startLabel2 = new PIXI.Text("", {
      fill: 0x04ffAC,
      fontSize: 32,
      fontFamily: "Comic Sans MS",
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
    fill: 0xCD7315,
    fontSize: 18,
    fontFamily: "Comic Sans MS",
    stroke: 0xff0000,
    strokeThickness: 4,
  };



  // 3 - set up `gameOverScene`
  // 3A - make game over text
  let gameOverText = new PIXI.Text("YOU win!\n        ", {
    fill: 0xcf3001,
    fontSize: 64,
    fontFamily: "Comic Sans MS",
    stroke: 0xff0000,
    strokeThickness: 6,
  });
  gameOverText.x = sceneWidth / 2 - gameOverText.width / 2;
  gameOverText.y = sceneHeight / 2 - 160;
  gameOverScene.addChild(gameOverText);

  finalScoreText = new PIXI.Text(`le rat is ded`, {
    fill: 0xf1234f,
    fontSize: 50,
    fontFamily: "Comic Sans MS",
    stroke: 0xff0000,
    strokeThickness: 6,
  });
  finalScoreText.x = sceneWidth / 2 - finalScoreText.width / 2;
  finalScoreText.y = sceneHeight / 2 + 30;
  gameOverScene.addChild(finalScoreText);

  // 3B - make "play again?" button
  
}



function startGame()
{
  // console.log("startGame called");
  startScene.visible = false;
  gameOverScene.visible = false;
  gameScene.visible = true;
  app.view.onclick = getLoc; // TODO: Implement
  levelNum = 1;
  score = 0;
  life = 100;
  loadLevel();

  setTimeout(() => {
    paused = false;
  }, 50);
}

function getLoc()
{

}





function gameLoop()
{
  if (paused) return; // keep this commented out for now

    // #1 - Calculate "delta time"
  let dt = 1 / app.ticker.FPS;
  if (dt > 1 / 12) dt = 1 / 12;


    // #2 - Move Player
    player.update(playerMoveVector, walls, exit, rats);

    for(let rat of rats)
    {
      if (rat != null)
      {
        rat.update(walls, player, rats);

      }
    }
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



function loadSpriteSheet()
{
  let spriteSheet  = PIXI.Texture.from("images/mouse.png");
  let width = 32;
  let height = 32;
  let numCols = 3;
  let numRows = 4; 

  let textures = [];

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      let x = col * width; 
      let y = row * height;

      let frame = new PIXI.Texture({
        source: spriteSheet,
        frame: new PIXI.Rectangle(x, y, width, height),
      });

      textures.push(frame);
    }
  }
  // console.log(textures);
  return textures;
}


// makes level based on level maps on top
function setupLevel(lvlFile)
{
  const tileWidth = ((sceneWidth / (lvlFile[1].length)));
  let currLoc = new Point(0, 0);
  
  for (let y = 0; y < lvlFile.length; y++) 
    {
    for (let x = 0; x < lvlFile[y].length; x++)
      {
        // console.log(`grid[${y}][${x}] = ${lvlFile[y][x]}`);
        if (lvlFile[y][x] === "e")
        {

        }
        else if (lvlFile[y][x] === "w")
        {
          let newWall = new Wall(assets.wall, currLoc, tileWidth);
          walls.push(newWall);
          gameScene.addChild(newWall);
          
          
        }
        else if (lvlFile[y][x] === "r")
        {
          let nerat = new Rat(assets.lm, currLoc.x, currLoc.y, 1, tileWidth, assets.rm);
          rats.push(nerat);
          gameScene.addChild(nerat);
        }
        else if (lvlFile[y][x] === "x")
        {
            exit = new Exit(assets.stair, currLoc, tileWidth);
            gameScene.addChild(exit);
        }
        currLoc.x += tileWidth;
      } 
      currLoc.x = 0;
      currLoc.y += tileWidth;
    }

    // console.log(walls);
}

// removes killed rats from the array
function THErATiSdEAD(rat)
{
  rats[rats.indexOf(rat)] = null;
}