export default class InputManager {
  constructor(scene) {
    this.scene = scene;

    // 키 설정
    this.cursorKeys = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // 마우스 설정 -> ??순간적인 이벤트로 분리가 어려움
    //this.scene.input.on('pointerdown', this.handleMouseClick.bind(this));
  }

  //클릭된 좌표 반환 ->??분리 안되면 의미가 없는듯
  // getMouseTarget(pointer) {
  //   return { x: pointer.worldX, y: pointer.worldY };
  // }

  //벡터값 반환
  getMovementInput(speed) {
    const PLAYER_SPEED = speed;
    const velocity = { x: 0, y: 0 };

    if (this.cursorKeys.left.isDown) velocity.x = -PLAYER_SPEED;
    if (this.cursorKeys.right.isDown) velocity.x = PLAYER_SPEED;
    if (this.cursorKeys.up.isDown) velocity.y = -PLAYER_SPEED;
    if (this.cursorKeys.down.isDown) velocity.y = PLAYER_SPEED;

    return velocity;
  }
}