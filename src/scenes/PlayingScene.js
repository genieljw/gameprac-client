import Phaser from "phaser";
import Config from "../Config";
import Player, {Direction} from '../characters/Player';

export default class PlayingScene extends Phaser.Scene{
  constructor(){
    super("playGame");
  }

  create(){
    //sound
    this.sound.pauseOnBlur = false;
    this.m_beamSound = this.sound.add("audio_beam");
    this.sound.add("audio_explosion");
    this.m_pickupSound = this.sound.add("audio_pickup");
    this.m_hurtSound = this.sound.add("audio_hurt");
    this.m_gameoverSound = this.sound.add("audio_gameover");
    this.m_pauseInSound = this.sound.add("pause_in");
    this.m_pauseOutSound = this.sound.add("pause_out");
    this.m_hitEnemySound = this.sound.add("hit_enemy");

    //backgound
    this.m_background = this.add.tileSprite(0, 0, Config.width, Config.height, "background");
    this.m_background.setOrigin(0, 0);

    //player
    this.m_player = new Player(this);
    this.cameras.main.startFollow(this.m_player);

    //attacks
    this.m_attacks = this.add.group();

    //keys
    //this.m_cursorKeys = this.input.keyboard.createCursorKeys();
    this.m_cursorKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
    console.log(this.m_cursorKeys);

    //++mouse
    this.input.on('pointerdown', (pointer)=>{
      this.m_player.shootBeam(pointer.x, pointer.y);
    });
  }

  update(){
    this.handlePlayerMove();
    //camera가 가는 곳으로 background 따라옴!
    this.m_background.setX(this.m_player.x - Config.width/2);
    this.m_background.setY(this.m_player.y - Config.height/2);

    //무한대 배경처럼
    this.m_background.tilePositionX = this.m_player.x - Config.width/2;
    this.m_background.tilePositionY = this.m_player.y - Config.height/2;
  }

  ////////////////FUNCTION//////////////

  handlePlayerMove(){
    if(this.m_cursorKeys.left.isDown){
      this.m_player.move(Direction.Left);
    }else if(this.m_cursorKeys.right.isDown){
      this.m_player.move(Direction.Right);
    }

    if(this.m_cursorKeys.up.isDown){
      this.m_player.move(Direction.Up);
    }else if(this.m_cursorKeys.down.isDown){
      this.m_player.move(Direction.Down);
    }
  }
}