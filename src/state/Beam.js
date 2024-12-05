export default class BeamManager {
  constructor(scene, socket) {
    this.scene = scene;
    this.socket = socket;
  }

  //공격 생성 함수(총알 그리기)
  createBeam(startX, startY, target) {
    const beam = this.scene.physics.add.sprite(startX, startY, "beamTexture"); //시작 위치에서 beamTexture 스프라이트 생성
    this.scene.physics.moveTo(beam, target.x, target.y, 300); // 빔 속도 설정
    this.scene.time.delayedCall(1000, () => beam.destroy()); // 일정 시간 후 제거
    return beam;
  }

  //충돌 처리 함수
  handleBeamCollision(beam, otherPlayersGroup){
    // 총알과 otherPlayersGroup 간 충돌 처리
    this.scene.physics.add.collider(beam, otherPlayersGroup, (beam, player) => {
      console.log(`Player ${player.id} hit by beam!`);
      this.socket.emit("playerHit", { 
        playerId: player.id,
        damage: 10,
      });
      beam.destroy();
    });
  }
}