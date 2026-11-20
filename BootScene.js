export class BootScene extends Phaser.Scene {
  constructor(){ super('BootScene'); }
  preload(){ this.load.image('prisonBackground','assets/prison_background.png'); this.load.spritesheet('prisonerSheet','assets/prisoner_walk.png',{frameWidth:48,frameHeight:70}); }
  create(){
    const g=this.make.graphics({x:0,y:0,add:false});
    // Repeating floor tile used by the tile-sprite environment.
    g.fillStyle(0x354957,1).fillRect(0,0,48,48);
    g.lineStyle(1,0x405766,1).strokeRect(1,1,46,46);
    g.lineStyle(1,0x2b3d49,.8).lineBetween(24,0,24,48).lineBetween(0,24,48,24);
    g.generateTexture('floorTile',48,48);g.destroy();
    const p=this.make.graphics({x:0,y:0,add:false});
    p.fillStyle(0x30251f).fillRoundedRect(10,0,28,18,7);
    p.fillStyle(0xd9a47b).fillRoundedRect(13,7,22,22,6);
    p.fillStyle(0xf28b32).fillRoundedRect(8,25,32,34,5);
    p.fillStyle(0xe8e3dc).fillRoundedRect(8,57,13,10,3).fillRoundedRect(27,57,13,10,3);
    p.fillStyle(0x292323).fillCircle(20,17,2).fillCircle(29,17,2);
    p.fillStyle(0x6f3c1d).fillRect(17,35,14,5);
    p.generateTexture('prisoner',48,70);p.destroy();
    const guard=this.make.graphics({x:0,y:0,add:false});
    guard.fillStyle(0x263c50).fillRoundedRect(8,23,32,36,5);
    guard.fillStyle(0xd9a47b).fillRoundedRect(13,5,22,22,6);
    guard.fillStyle(0x26303b).fillRoundedRect(10,0,28,11,4);
    guard.fillStyle(0x202b38).fillRect(10,57,11,11).fillRect(27,57,11,11);
    guard.fillStyle(0x202020).fillCircle(20,15,2).fillCircle(29,15,2);
    guard.generateTexture('guard',48,70);guard.destroy();
    const key=this.make.graphics({x:0,y:0,add:false});
    key.fillStyle(0xffd85c).fillCircle(12,12,8).fillRect(18,9,20,6).fillRect(31,9,5,12).fillRect(24,9,4,9);
    key.generateTexture('keyItem',42,26);key.destroy();
    const card=this.make.graphics({x:0,y:0,add:false});
    card.fillStyle(0x65d6d0).fillRoundedRect(0,0,36,25,4).fillStyle(0x19343c).fillRect(5,6,9,4).fillRect(5,14,24,3);
    card.generateTexture('accessCard',36,25);card.destroy();
    this.anims.create({key:'prisoner-walk',frames:this.anims.generateFrameNumbers('prisonerSheet',{start:0,end:3}),frameRate:8,repeat:-1});
    this.scene.start('MenuScene');
  }
}
