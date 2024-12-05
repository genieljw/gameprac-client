export default class Player {
    constructor(scene, data) {
    const { playerId, x, y, hp = 100 } = data;

    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "playerTexture");
    this.sprite.id = playerId;
    this.sprite.hp = hp;

    this.hpText = scene.add.text(x, y - 20, `HP: ${hp}`, {
        font: "16px Arial",
        fill: "#ff0000",
    }).setOrigin(0.5);

    this.setupCollisions();
    }

    setupCollisions() {
      // 충돌 처리 로직
    }

    move(velocity) {
        this.sprite.setVelocity(velocity.x, velocity.y);
    }

    updatePosition(x, y) {
        this.sprite.setPosition(x, y);
        this.hpText.setPosition(x, y - 20);
        this.hpText.setText(`HP: ${this.sprite.hp}`);
    }

    takeDamage(damage) {
        this.sprite.hp -= damage;
        if (this.sprite.hp <= 0) {
        this.destroy();
        }
    }

    destroy() {
        this.sprite.destroy();
        this.hpText.destroy();
    }
}
/*
export class Player {
    constructor(playerId, x, y) {
        this.playerId = playerId; // 플레이어의 고유 ID
        this.x = x; // X 좌표
        this.y = y; // Y 좌표
        this.rotation = 0; // 회전 각도
        this.hp = 100; // 체력
        this.speed = 3; // 속도
    }*/

    /** Player의 좌표를 newX, newY로 설정 
    setPosition(newX, newY) {
        this.x = newX;
        this.y = newY;
    }*/

    /** Player의 좌표를 인자값만큼 이동시킴 
    move(directionX, directionY) {
        let moveX = this.x + directionX;
        let moveY = this.y + directionY;

        // 화면을 벗어나지 않도록 최대 범위 설정
        if (moveX > 400 || moveX < -400 || moveY > 300 || moveY < -300) {
            this.x = moveX;
            this.y = moveY;
        }
    }

    setRotation(mouseX, mouseY) {
        // this.rotation = Phaser.Math.Angle.Between(
        //     mouseX,
        //     mouseY,
        //     this.x,
        //     this.y
        // );
    }

    takeDamage(amount) {
        this.hp = Math.max(this.hp - amount, 0); // 체력 감소 (0 이하로 내려가지 않음)
    }

    isAlive() {
        return this.hp > 0; // 플레이어 생존 여부
    }

    isMe(socketId) {
        return this.playerId === socketId;
    }
}

export class thisPlayer extends Player {
    // constructor(playerId, x, y, rotation = 0, hp = 100) {
    //     super(playerId, x, y, rotation, hp);
    //     this.input = {};
    // }
    // // 키 입력 업데이트
    // updateInput(input) {
    //     this.input = input;
    //     this.updateDirection();
    // }
    // updateDirection() {
    //     this.direction = {};
    // }
}

export class otherPlayer extends Player {}*/