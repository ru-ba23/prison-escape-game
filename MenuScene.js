export class MenuScene extends Phaser.Scene {
  constructor(){super('MenuScene');}
  create(){
    this.add.rectangle(480,300,960,600,0x17232e);
    this.add.rectangle(480,300,850,470,0x263744).setStrokeStyle(3,0x526b7a);
    for(let x=90;x<900;x+=55)this.add.rectangle(x,145,5,110,0x8d9ca4);
    this.add.text(480,205,'PRISON ESCAPE',{fontFamily:'Arial',fontSize:'54px',fontStyle:'bold',color:'#ffad68'}).setOrigin(.5);
    this.add.text(480,275,'A daring escape starts with one small key.',{fontSize:'21px',color:'#e9eef0'}).setOrigin(.5);
    this.add.text(480,335,'Collect the key  •  Cross the laser zone  •  Take the access card',{fontSize:'17px',color:'#a9bdc8'}).setOrigin(.5);
    const b=this.add.text(480,425,'▶  START GAME',{fontSize:'25px',fontStyle:'bold',color:'#18232e',backgroundColor:'#ff9b4a',padding:{left:28,right:28,top:16,bottom:16}}).setOrigin(.5).setInteractive({useHandCursor:true});
    b.on('pointerover',()=>b.setStyle({backgroundColor:'#ffc080'}));b.on('pointerout',()=>b.setStyle({backgroundColor:'#ff9b4a'}));b.on('pointerdown',()=>this.scene.start('GameScene'));
    this.add.text(480,515,'Move: Arrow Keys / WASD',{fontSize:'16px',color:'#9eb1bd'}).setOrigin(.5);
  }
}
