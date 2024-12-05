import io from 'socket.io-client';

export default class SocketManager {
  constructor(scene) {
    this.scene = scene;
    //this.socket = io(socketUrl); //매개 변수로 url을 받아올 수 있음
    this.socket = io("ws://localhost:8081");
    this.setupListeners();
  }

  setupListeners(){
    // currentPlayer 이벤트 리스너 설정
    this.socket.on('currentPlayer', (data) => {
      console.log("current player", data);
      this.scene.setupPlayer(data);
    });

    this.socket.on('state', (state) => {
      this.scene.updateOtherPlayersState(state); // 다른 플레이어 상태 업데이트
    });

    //server->client shootBeam 이벤트 수신(총알 발사 그리기)
    this.socket.on('shootBeam', (data)=>{
      if(data.playerID !== this.scene.m_player.id){
        this.scene.beamManager.createBeam(data.x, data.y, {x: data.targetX, y: data.targetY});
      }
    });

    //+hp+ HP감소 처리 이벤트 처리
    this.socket.on("playerHit", (data) =>{
      const {playerId, hp} = data;
      this.scene.handlePlayerHit(playerId, hp); // HP 업데이트 처리
    });

    //+hp+ hp=0 제거처리
    this.socket.on("playerEliminated", (playerId)=>{
      //나 제거
      this.scene.handlePlayerEliminated(playerId);
      
    });

    this.socket.on('requestServerTime', (clientTime, callback) => {
      const serverTime = Date.now(); // 서버 시간 제공
      callback(serverTime);
    });

  }

    //+time+ server-client 시간 동기화(callback)
    syncTimeWithServer(){
      const clientTime = Date.now();
      this.socket.emit('requestServerTime', clientTime, (serverTime)=>{
        console.log("Raw serverTime received:", serverTime);
  
        const averageTime = (Date.now() + clientTime)/2;
        this.serverTimeOffset = serverTime - averageTime;
  
        console.log("Server time synchronized. Offset:", this.serverTimeOffset);
        console.log("Corrected server time:", new Date(Date.now()));
      });
    }

    // 서버로 데이터 전송 메서드
  sendPlayerMove(data) {
    this.socket.emit('playerMove', data);
  }

  sendShootBeam(data) {
    this.socket.emit('shootBeam', data);
  }
}

//   setupListeners() {
//     Object.entries(this.eventHandlers).forEach(([event, handler]) => {
//       this.socket.on(event, handler);
//     });
//   }

//   emit(event, data, callback) {
//     this.socket.emit(event, data, callback);
//   }

//   requestServerTime() {
//     const clientTime = Date.now();
//     this.socket.emit('requestServerTime', clientTime, (serverTime) => {
//       const averageTime = (Date.now() + clientTime) / 2;
//       this.serverTimeOffset = serverTime - averageTime;
//       console.log("Server time synchronized. Offset:", this.serverTimeOffset);
//     });
//   }

//   getCurrentTime() {
//     return this.serverTimeOffset 
//       ? Date.now() + this.serverTimeOffset 
//       : Date.now();
//   }
// }