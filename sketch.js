//creating game objects' global variables
var monkey, monkey_running, monkeyoverImg;
var ground;
var banana, bananaImage, obstacle, obstacleImage;
var bananaGroup, obstacleGroup;
var survivalTime = 0,
  bananaScore = 0,
  bananaScoreImg;
var replayImg, replay;
var gameState = "play";
var bg, bgImg, floorImg, floor1, floor2;

function preload() {
  //adding animation for monkey running
  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");
  monkeyoverImg = loadImage("monkey sad.png");

  //loading the objects' image
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  replayImg = loadImage("replay.png");
  bgImg = loadImage("bg1.jpg");
  floorImg = loadImage("floor.png");
}

function setup() {
  createCanvas(600, 400);

  bg = createSprite(300, 170);
  bg.addImage(bgImg);
  bg.scale = 2;

  monkey = createSprite(60, 285, 20, 20);
  monkey.addAnimation("monkey_running", monkey_running);
  monkey.addAnimation("Sad", monkeyoverImg);
  monkey.scale = 0.2;
  monkey.setCollider("circle", -50, 0, 300);

  ground = createSprite(300, 350, 1200, 10);
  ground.x = ground.width / 2;
  ground.visible = false;

  floor1 = createSprite(523, 280);
  floor1.addImage(floorImg);

  floor2 = createSprite(1246, 280);
  floor2.addImage(floorImg);

  bananaScoreImg = createSprite(350, 40);
  bananaScoreImg.addImage(bananaImage);
  bananaScoreImg.scale = 0.15;
  bananaScoreImg.rotation = -10;

  replay = createSprite(300, 200);
  replay.addImage(replayImg);
  replay.scale = 0.15;
  replay.visible = false;

  bananaGroup = new Group();
  obstacleGroup = new Group();
}

function draw() {
  background(225);

  if (gameState == "play") {
    if (keyDown("space") && monkey.y == 285)
      monkey.velocityY = -12;

    monkey.velocityY += 0.8;

    ground.velocityX = -4;

    floor1.velocityX = -10;
    floor2.velocityX = -10;

    bg.velocityX = -5;

    if (ground.x < 0)
      ground.x = ground.width / 2;

    if (floor1.x < -323)
      floor1.x = 1246;
    if (floor2.x < -323)
      floor2.x = 1246

    if (bg.x < 100)
      bg.x = 300;

    bananas();
    obstacles();

    if (bananaGroup.isTouching(monkey)) {
      bananaGroup.destroyEach();
      bananaScore++;
    }

    survivalTime += Math.round(getFrameRate()/60);
    // console.log(Math.round(getFrameRate()/60));
  }

  if (obstacleGroup.isTouching(monkey))
    gameState = "over";
  if (gameState == "over") {
    replay.visible = true;
    bg.velocityX = 0;
    floor1.velocityX = 0;
    floor2.velocityX = 0;
    monkey.velocityY = 0;
    monkey.changeAnimation("Sad", monkeyoverImg);
    bananaGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    banana.lifetime = -1;
    obstacle.lifetime = -1;
    ground.velocityX = 0;
    floor.velocityX = 0;
  }

  if (gameState == "over" && mousePressedOver(replay)) {
    replay.visible = false;
    bg.velocityX = -5;
    floor1.velocityX = -10;
    floor2.velocityX = -10;
    gameState = "play";
    survivalTime = 0;
    bananaScore = 0;
    monkey.changeAnimation("monkey_running", monkey_running);
    obstacleGroup.destroyEach();
    bananaGroup.destroyEach();
  }

  monkey.collide(ground);

  drawSprites();

  stroke(255);
  textSize(20);
  fill(255);
  text("Survival Time: " + survivalTime, 100, 50);
  text("-->   " + bananaScore, 400, 50);
}

function bananas() {
  if (frameCount % 80 == 0) {
    banana = createSprite(620, 250);
    banana.y = Math.round(random(120, 200));
    banana.addImage("Banana", bananaImage);
    banana.scale = 0.15;
    banana.setCollider("rectangle", 50, 0, banana.width - 100, banana.height - 250);
    banana.velocityX = -8;
    banana.lifetime = 124;
    banana.depth = replay.depth;
    replay.depth++;

    bananaGroup.add(banana);
  }
}

function obstacles() {
  if (frameCount % 300 == 0) {
    obstacle = createSprite(620, 320);
    obstacle.addImage("Obstacle", obstacleImage);
    obstacle.scale = 0.2;
    obstacle.setCollider("circle", 50, 50, 250);
    obstacle.velocityX = -10;
    obstacle.lifetime = 124;
    obstacle.depth = floor1.depth;
    floor1.depth++;
    obstacleGroup.add(obstacle);
  }
}