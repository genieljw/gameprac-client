import Phaser from "phaser";
import Config from "../Config";
import SocketManager from "../socket/SocketManager";
import InputManager from "../input/InputManager";
import Player from "../state/Player";
import BeamManager from "../state/Beam";


export default class PlayingScene extends Phaser.Scene {
  constructor() {
    super("playGame");

    // other players hashmap
    this.otherPlayers = {};

    // Socket.IO 연결 설정
    this.socketManager = null;

    this.playerData = null;
    this.beamManager = null;
  }

  create() {
    // 배경 설정
    this.m_background = this.add.tileSprite(0, 0, Config.width, Config.height, "background").setOrigin(0, 0);
    // SocketManager 초기화
    this.socketManager = new SocketManager(this);
    // InputManager와 BeamManager 초기화
    this.inputManager = new InputManager(this, this.m_player);
    this.beamManager = new BeamManager(this, this.socketManager);

    


    // 마우스 설정 -> ??뺄 수 있을까??
    this.input.on('pointerdown', (pointer)=>{
      const target = {x: pointer.worldX, y: pointer.worldY};    //클릭 위치: 타겟 설정
      const beam = this.beamManager.createBeam(this.m_player.x, this.m_player.y, target);    //내 위치->타겟 빔 생성
      //충돌 처리 안됨
      this.beamManager.handleBeamCollision(beam, this.otherPlayersGroup);
      this.socketManager.sendShootBeam({
        x: this.m_player.x,
        y: this.m_player.y,   //발사체 시작 위치(내 위치)
        targetX: target.x,
        targetY: target.y   //발사체 목표 위치(마우스 클릭)
      });
    });

    //그룹 초기화
    this.otherPlayersGroup = this.physics.add.group({
      immovable: true, // 움직이지 않도록 설정
    });

    // currentPlayer 데이터가 있을 경우에만 플레이어 생성
    if (this.playerData) {
      console.log("Player Data:", this.playerData); // 디버깅용 로그
      this.setupPlayer(this.playerData);
    }
    // else { //??어디로 옮겨갈 지 고민
    //   // 만약 데이터가 아직 없을 경우, 나중에 데이터가 들어올 때 생성하도록 처리
    //   this.socket.on('currentPlayer', (data) => {
    //     console.log("Received currentPlayer:", data); // 디버깅용 로그
    //     this.setupPlayer(data);
    //   });
    // }

    //+time+ 시간 동기화 시작
    this.socketManager.syncTimeWithServer();

    // 50ms마다 다른 플레이어의 위치 업데이트
    this.time.addEvent({
      delay: 50,
      callback: this.updateOtherPlayers,
      callbackScope: this,
      loop: true
    });
  }

  setupPlayer(data) {
    const { playerId, x, y } = data;
    const hp = data.hp || 100; // `hp`가 없으면 기본값 100으로 설정

    // 현재 플레이어 생성
    this.m_player = this.physics.add.sprite(x, y, "playerTexture");
    //this.m_player.setCollideWorldBounds(true); // 월드 경계 충돌
    this.m_player.id = playerId;
    this.m_player.hp = hp;  //hp설정
    this.m_player.speed = 160 //속도

    //+hp+ hp 텍스트 추가
    this.m_player.hpText = this.add.text(x, y-20, `HP: ${hp}`,{
      font: "16px Arial",
      fill: "#ff0000",
    }).setOrigin(0.5); //??setOrigin??

    // 충돌 처리 등록
    this.physics.add.collider(
      this.m_player,
      this.otherPlayersGroup,
      this.handlePlayerCollision,
      null,
      this
    );

    // 카메라가 플레이어를 따라가도록 설정
    this.cameras.main.startFollow(this.m_player);

    // 상태 전송 시작
    this.startSendingPlayerData();
  }

  //충돌 처리 함수(player끼리)
  handlePlayerCollision(player1, player2) {
    console.log(`Collision detected between Player ${player1.id} and Player ${player2.id}`);

    // 충돌 시 처리 로직 (통과 방지 설정)
    player1.setVelocity(0, 0); // 현재 플레이어 멈춤
    player2.setVelocity(0, 0); // 상대 플레이어도 멈춤

    // 추가 동작: 충돌 시 애니메이션, 점수 변경 등
  }

  //+hp+ 플레이어 제거 처리 함수
  handlePlayerElimination() {
    console.log("You were eliminated!");
    this.m_player.destroy();
    this.m_player.hpText.destroy();
  
    // 추가: 부활 로직 또는 게임 오버 화면 표시
  }
  

  startSendingPlayerData() {
    console.log("start sending data");

    this.time.addEvent({
      delay: 50,
      callback: () => {
        if (this.m_player) {
          this.socketManager.sendPlayerMove({
            x: this.m_player.x,
            y: this.m_player.y,
          });
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (this.m_player) {
      const velocity = this.inputManager.getMovementInput(this.m_player.speed);
      this.m_player.setVelocity(velocity.x, velocity.y);

      // 배경 움직임 설정
      this.m_background.setX(this.m_player.x - Config.width / 2);
      this.m_background.setY(this.m_player.y - Config.height / 2);
      this.m_background.tilePositionX = this.m_player.x - Config.width / 2;
      this.m_background.tilePositionY = this.m_player.y - Config.height / 2;

      //+hp+ HP텍스트 위치 및 내용 업댓
      if(this.m_player.hpText){
        this.m_player.hpText.setPosition(this.m_player.x, this.m_player.y - 20);
        this.m_player.hpText.setText(`HP: ${this.m_player.hp}`);
      }
    }

    //+time+서버시간 기준으로 클라 시간 업데이트
    if (this.serverTimeOffset) {
      const correctedTime = Date.now() + this.serverTimeOffset;
    }
  }

  updateOtherPlayersState(state) {
    Object.keys(state).forEach((playerId) => {
      const playerData = state[playerId];
      const { x, y, hp } = playerData;
  
      if (this.m_player && playerId === this.m_player.id) {
        return;
      }
  
      if (!this.otherPlayers[playerId]) {
        const newPlayer = this.physics.add.sprite(x, y, 'playerTexture');
        newPlayer.id = playerId;
        newPlayer.hp = hp || 100;

        // HP 텍스트 추가
      newPlayer.hpText = this.add.text(x, y - 20, `HP: ${newPlayer.hp}`, {
        font: "16px Arial",
        fill: "#ff0000",
      }).setOrigin(0.5);

        this.otherPlayers[playerId] = newPlayer;
        this.otherPlayersGroup.add(newPlayer);
        this.physics.add.collider(this.m_player, newPlayer);
      }
  
      const player = this.otherPlayers[playerId];
      player.setPosition(x, y);
      player.hp = hp||100;

      // HP 텍스트 업데이트
      if (player.hpText) {
        player.hpText.setPosition(x, y - 20);
        player.hpText.setText(`HP: ${player.hp}`);
      }
    });
  
    Object.keys(this.otherPlayers).forEach((playerId) => {
      if (!state[playerId]) {
        const player =this.otherPlayers[playerId]; 
        player.destroy();
        if(player.hp) player.hpText.destroy();
        delete this.otherPlayers[playerId];
      }
    });
  }

  handlePlayerHit(playerId, hp) {
    if (this.m_player && playerId === this.m_player.id) {
      this.m_player.hp = hp;
      if (hp <= 0) {
        this.handlePlayerElimination();
      }
      return;
    }
  
    if (this.otherPlayers[playerId]) {
      this.otherPlayers[playerId].hp = hp;
    }
  }

}