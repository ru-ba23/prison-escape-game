export class GameScene extends Phaser.Scene {
  constructor(){super('GameScene');}
  create(){
    this.worldW=1280; this.worldH=820; this.mission=0; this.laserHits=0; this.tick=0; this.message='Mission 1: Find the yellow key.'; this.messageUntil=0; this.finished=false;
    this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
    this.add.image(0,0,'prisonBackground').setOrigin(0).setDisplaySize(this.worldW,this.worldH).setDepth(-1);
    this.add.tileSprite(0,190,this.worldW,this.worldH-214,'floorTile').setOrigin(0).setAlpha(.34).setDepth(0);
    // Outer walls and cell furniture are static physics objects.
    this.walls=this.physics.add.staticGroup();
    this.addWall(0,0,this.worldW,24);this.addWall(0,this.worldH-24,this.worldW,24);this.addWall(0,0,24,this.worldH);this.addWall(this.worldW-24,0,24,this.worldH);
    this.add.rectangle(180,270,190,16,0x7c624b).setDepth(1);this.add.rectangle(180,310,14,72,0x6b513e).setDepth(1);this.add.rectangle(260,310,14,72,0x6b513e).setDepth(1);
    this.add.rectangle(500,120,300,14,0x71838d).setDepth(1);
    this.player=this.physics.add.sprite(90,690,'prisonerSheet').setDepth(5).setScale(.78).setCollideWorldBounds(true);
    this.player.body.setSize(32,55).setOffset(8,10);
    this.physics.add.collider(this.player,this.walls);
    this.guard=this.physics.add.sprite(600,390,'guard').setDepth(5).setScale(.78);this.guard.body.setAllowGravity(false);this.guard.body.setImmovable(true);this.guard.setVelocityX(105);this.guard.setCollideWorldBounds(true);this.guard.body.setBounce(0,0);
    this.physics.add.overlap(this.player,this.guard,()=>this.guardCaught(),null,this);
    this.keyItem=this.physics.add.staticImage(250,690,'keyItem').setDepth(4);
    this.cardItem=this.physics.add.staticImage(1040,390,'accessCard').setDepth(4).setVisible(false).refreshBody();
    this.physics.add.overlap(this.player,this.keyItem,()=>this.collectKey(),null,this);
    this.physics.add.overlap(this.player,this.cardItem,()=>this.collectCard(),null,this);
    // Laser barriers are Phaser objects whose visibility and collision state are updated on a timed cycle.
    this.lasers=[{x:430,y:270,offset:0,period:210,on:120},{x:430,y:390,offset:68,period:210,on:120},{x:430,y:510,offset:136,period:210,on:120}].map((v)=>{
      const glow=this.add.rectangle(850,v.y,820,12,0xff304d).setDepth(3).setAlpha(.95);
      const beam=this.add.rectangle(850,v.y,820,5,0xff5369).setDepth(4);
      const zone=this.add.zone(850,v.y,820,18);this.physics.add.existing(zone,true);
      return {...v,glow,beam,zone,active:false};
    });
    this.lasers.forEach(l=>this.physics.add.overlap(this.player,l.zone,(p,z)=>this.hitLaser(z),null,this));
    this.exit=this.add.rectangle(1190,145,76,100,0x8a6042).setStrokeStyle(4,0xd8c7a9).setDepth(2);
    this.add.text(1190,145,'EXIT',{fontSize:'20px',fontStyle:'bold',color:'#fff'}).setOrigin(.5).setDepth(3);
    this.physics.world.setBounds(24,24,this.worldW-48,this.worldH-48);this.cameras.main.setBounds(0,0,this.worldW,this.worldH);this.cameras.main.startFollow(this.player,true,.08,.08);this.cameras.main.setZoom(1.0);
    this.hudBg=this.add.rectangle(480,35,960,70,0x101a23,.96).setScrollFactor(0).setDepth(20);
    this.title=this.add.text(22,14,'PRISON ESCAPE',{fontSize:'19px',fontStyle:'bold',color:'#ffad68'}).setScrollFactor(0).setDepth(21);
    this.status=this.add.text(22,43,this.message,{fontSize:'16px',color:'#f4f1e9'}).setScrollFactor(0).setDepth(21);
    this.progress=this.add.text(935,18,'MISSIONS 0 / 2',{fontSize:'16px',fontStyle:'bold',color:'#9fe3d0'}).setOrigin(1,0).setScrollFactor(0).setDepth(21);
    this.hint=this.add.text(935,45,'ARROWS / WASD',{fontSize:'12px',color:'#c4d0d7'}).setOrigin(1,0).setScrollFactor(0).setDepth(21);
    this.laserCounter=this.add.text(480,570,'',{fontSize:'14px',color:'#ff9aa7'}).setOrigin(.5).setScrollFactor(0).setDepth(21);
    this.soundReady=false;this.input.once('pointerdown',()=>this.enableAudio());this.input.keyboard.once('keydown',()=>this.enableAudio());
    this.cameras.main.fadeIn(350,0,0,0);
  }
  addWall(x,y,w,h){const r=this.add.rectangle(x+w/2,y+h/2,w,h,0x9aa7ad).setVisible(false);this.physics.add.existing(r,true);this.walls.add(r);}
  enableAudio(){if(this.soundReady)return;this.soundReady=true;try{const AC=window.AudioContext||window.webkitAudioContext;this.audioCtx=new AC();}catch(e){}}
  beep(freq=600,duration=.09){if(!this.audioCtx)return;const o=this.audioCtx.createOscillator(),g=this.audioCtx.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.07,this.audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,this.audioCtx.currentTime+duration);o.connect(g);g.connect(this.audioCtx.destination);o.start();o.stop(this.audioCtx.currentTime+duration);}
  setMessage(s){this.message=s;this.messageUntil=this.time.now+4000;this.status.setText(s);}
  collectKey(){if(this.mission!==0)return;this.mission=1;this.keyItem.disableBody(true,true);this.cardItem.setVisible(true);this.cardItem.body.enable=true;this.checkpoint={x:300,y:690};this.setMessage('Key collected! Cross the red laser beams and find the access card.');this.progress.setText('MISSIONS 1 / 2');this.beep(820,.15);}
  collectCard(){if(this.mission!==1)return;this.mission=2;this.cardItem.disableBody(true,true);this.setMessage('Access card collected! Head to the EXIT door.');this.progress.setText('MISSIONS 2 / 2');this.beep(980,.18);}
  hitLaser(zone){if(this.mission!==1||!zone.active||this.time.now<(this.lastLaserHit||0)+800)return;this.lastLaserHit=this.time.now;this.laserHits++;this.player.setPosition(this.checkpoint.x,this.checkpoint.y);this.player.setVelocity(0,0);this.setMessage('Laser detected you! Wait for the beam to switch off and try again.');this.laserCounter.setText(`LASER RETRIES: ${this.laserHits}`);this.beep(180,.22);}
  guardCaught(){if(this.time.now<(this.lastCaught||0)+1300||this.finished)return;this.lastCaught=this.time.now;this.player.setPosition(this.mission===0?90:300,this.mission===0?690:690);this.player.setVelocity(0,0);this.setMessage('The guard spotted you! Return to the checkpoint and try again.');this.beep(240,.18);}
  update(time,delta){if(this.finished)return;this.tick+=delta;const speed=235;let vx=0,vy=0;const k=this.keys;if(k.LEFT.isDown||k.A.isDown)vx=-speed;else if(k.RIGHT.isDown||k.D.isDown)vx=speed;if(k.UP.isDown||k.W.isDown)vy=-speed;else if(k.DOWN.isDown||k.S.isDown)vy=speed;if(vx&&vy){vx*=.707;vy*=.707;}this.player.setVelocity(vx,vy);if(vx!==0||vy!==0)this.player.anims.play('prisoner-walk',true);else this.player.anims.stop();if(vx<0)this.player.setFlipX(true);else if(vx>0)this.player.setFlipX(false);
    if(this.guard.x>760)this.guard.setVelocityX(-105);else if(this.guard.x<450)this.guard.setVelocityX(105);
    this.lasers.forEach(l=>{const active=((Math.floor(this.tick/16.67)+l.offset)%l.period)<l.on;l.active=active;l.glow.setVisible(this.mission===1&&active);l.beam.setVisible(this.mission===1);l.beam.setFillStyle(active?0xff5369:0x596a74);l.zone.laserOn=active&&this.mission===1;});
    if(this.mission===2&&Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(),this.exit.getBounds())){this.finished=true;this.beep(1100,.3);this.scene.start('WinScene',{laserHits:this.laserHits});}
    if(time>this.messageUntil&&this.messageUntil!==0){this.messageUntil=0;}
  }
}
