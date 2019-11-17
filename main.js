//redo some commenting 



//Stating here all the variables 
let bg;
let map;
let tileset;
let health, traps, level, decorations;
let player;
let enemy;
let cursor;
let score = 0;
let scoreText;
let healthScore = 100;
let healthScoreText; 
let door;
let won = false;
let winScreen;
let dieScreen; 
let uiText;

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'gameScene', active: true });
    },

    //declaring game variables 
    

    preload: function ()
    {

        // loading all the external game components
        this.load.image("background", "clouds.png")
       // this.load.spritesheet("");
       this.load.tilemapTiledJSON('map', 'src/tm_1.json'); // gets the tilmap for the game 
       this.load.image('gameTiles', 'src/sheet.png');
       this.load.spritesheet('player', 'walk.png', { frameWidth: 416, frameHeight: 454 });
       this.load.spritesheet('door', 'door.png', { frameWidth: 250, frameHeight: 592 });
       this.load.image('dead', 'die.png');
       this.load.image('win', 'win.png');
        
        
    },

    create: function ()
    {

        


        // a pivoting point for the map player and input recognition 
        cursor = this.input.keyboard.createCursorKeys();

        // set text displaying score
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //  this.physics.world.setBounds(0, 0, 980, 490);
        bg = this.add.image(400, 300, "background");
        bg.setScale(15, 12); //https://photonstorm.github.io/phaser3-docs/Phaser.Scale.html
        
        

        // creating and setting up the player 
        player = this.physics.add.sprite(0, 0, 'player');
        player.setAngle(0);

        
      
        player.setScale(.15, .15); 
        player.body.setGravityY(250);

        // player animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('door', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        //player.setCollideWorldBounds(true);

        //preset the layout of the level
        map =  this.add.tilemap('map'); 
        tileset = map.addTilesetImage('sheet', 'gameTiles');

        

        // adding layers from thee tilemap sheet
        
        
        traps = map.createStaticLayer('traps', tileset);
        level = map.createStaticLayer('level', tileset);
        
        decorations = map.createStaticLayer('decorations', tileset);
        health = map.createStaticLayer('health', tileset);
        
        

        
        //setting up colliders for layers
        traps.setCollisionBetween(26, 41);
        level.setCollisionBetween(0, 92);
        health.setCollisionBetween(11,13);

        //creating colliders for platforms 
        this.physics.add.collider(player, level);
        //this.physics.add.overlap(player, traps, InTrap, null, this);
        
        

        //set up camera movement https://photonstorm.github.io/phaser3-docs/Phaser.Cameras.Scene2D.Camera.html
        this.cameras.main.startFollow(player, true, 0.08, 0.08);
        this.cameras.main.setZoom(.8);

        //end of the level obj
        door = this.physics.add.sprite(1080.2 , 1265.95, 'door');
        //door = this.physics.add.sprite(0, 0, 'door');

        this.anims.create({
            key: 'woo',
            frames: this.anims.generateFrameNumbers('door', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        //door.anims.load('woo')
          
        door.setScale(.19, .19);
        door.play('woo');
        this.physics.add.collider(door, level);  
        this.physics.add.overlap(player, door, Win, null, this);
        
        // text displaying health

        uiText = this.add.text(20,20, 'health', {
            fontSize: '20',
            fill: '#fffff'
        });
        uiText.setScrollFactor(0);

    },

    update: function ()
    {
        //this.physics.overlap(player, traps, InTrap());
        
        
        //this.physics.collide(player, traps, InTrap());
        
          

        if (cursor.left.isDown)
        {
            player.setVelocityX(-500);
            player.setFlipX(0); // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Flip.html + http://www.html5gamedevs.com/topic/1582-horizontal-sprite-flip/
           // player.anims.play('left', true);


           /*  player.Scale.x *= -1;
            player.scale.y *= -1; */

        }
        else if (cursor.right.isDown)
        {
            player.setVelocityX(500);
            player.setFlipX(-1);
            //player.anims.play('right', true);
            
        }
        else if (cursor.up.isDown)
        {
            player.setVelocityY(-550);
            player.setFlipX(0);
            //player.anims.play('right', true);
            
        } else 
        {
            player.setVelocityX(0);
            player.setVelocityY(600);
            // player.setVelocityY(100);
            //player.anims.play('right', true);
            
        }
        
        // console.log(`${player.x} , ${player.y}`);   
    
        if(player.y > 2240){
            console.log(`player out of bounds`);
            OutOfBounds(healthScore);
        }


        // This if a method of setting up players flip anim 
        /* // Set Anchor to the center of your sprite

        yourSprite.anchor.setTo(.5,.5);

        // Invert scale.x to flip left/right

        yourSprite.scale.x *= -1;

        // Invert scale.y to flip up/down

        yourSprite.scale.y *= -1; */
    },

    //debug the collision
    
    render: function () {  
        this.debugGraphics = this.add.graphics();
        this.debugGraphics.setAplpha(0.75);

        level.renderDebug(debugGraphics, {
            tileColor: new Phaser.Display.Color(40, 244, 143, 255), // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
    },

});

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: GameScene
};

var game = new Phaser.Game(config);

// when the player falls out of the game 
function OutOfBounds(hp) {  
    if(hp > 0){
        player.y = 0;
        player.setVelocity(0,0);
        healthScore -=10; 
    } else {
        console.log('die');
        dieScreen = this.add.image(player.x, player.y, "dead");
        dieScreen.setScale(.4, .4)
        this.cameras.main.stopFollow(player);
    }
}

// checking for the candies, decreasing health -1
function InTrap(){
    console.log('intrap');
    return false;
}

// winning screen 
function Win() {  

    if(!won){
        console.log('win');
        won = true;
        winScreen = this.add.image(player.x, player.y, "win");
        winScreen.setScale(.4, .4)
        this.cameras.main.stopFollow(player);
    }

    return false;
}