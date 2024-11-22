import Beam from '../effects/Beam';

export const Direction = Object.freeze({
  Up :'Up',
  Down :'Down',
  Left : 'Left',
  Right : 'Right'
});

export default class Player extends Phaser.Physics.Arcade.Image{
  static PLAYER_SPEED = 5;

  constructor(scene){
    super(scene, 400, 300, "cat");
    this.scale = 0.4;
    this.alpha = 1;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.lastShotTime = 0;
    this.shotCooldown = 300;//300ms 쿨타임

    // scene.time.addEvent({
    //   delay: 1000,
    //   callback: () => {
    //     this.shootBeam();
    //   },
    //   loop: true,
    // });
  }

  move(direction){
    switch(direction){
      case Direction.Up:
        this.y -= Player.PLAYER_SPEED;
        break;

      case Direction.Down:
        this.y += Player.PLAYER_SPEED;
        break;

      case Direction.Left:
        this.x -= Player.PLAYER_SPEED;
        this.flipX = true;    //chracter image 거울모드 필요시
        break;

      case Direction.Right:
        this.x += Player.PLAYER_SPEED;
        this.flipX = false;
        break;
    }
  }

  //hitByEnemy(damage){}

  canShoot(){
    return Date.now - this.lastShotTime > this.shotCooldown;
  }

  shootBeam(targetX, targetY){
    new Beam(this.scene, this, targetX, targetY);
    this.lastShotTime = Date.now();
  }
}