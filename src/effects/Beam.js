import Phaser from 'phaser';

export default class Beam extends Phaser.Physics.Arcade.Image{
  static SPEED = 300;//100->300
  static DURATION = 1000;

  constructor(scene, player, targetX, targetY){//class init method
    const x = player.x;
    const y = player.y - 16;
    super(scene, x, y, "beam");
    this.scale = 0.2;

    scene.add.existing(this);
    scene.physics.world.enableBody(this);

    // 타겟 방향 계산
    const directionX = targetX - x;
    const directionY = targetY - y;
    const magnitude = Math.sqrt(directionX ** 2 + directionY ** 2); // 벡터 길이 계산
    const normalizedX = directionX / magnitude;
    const normalizedY = directionY / magnitude;

    // 속도 설정 (방향 벡터에 속도 곱하기)
    this.setVelocity(normalizedX * Beam.SPEED, normalizedY * Beam.SPEED);

    //원형 범위 설정(생략 가능성 있음)
    this.setCircle(30);


    scene.m_attacks.add(this);
    scene.m_beamSound.play();

    setTimeout(() => this.destroy(), Beam.DURATION);
  }

  update(){

  }
}

