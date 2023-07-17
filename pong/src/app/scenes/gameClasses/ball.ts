import Phaser from 'phaser';

export class Ball {

	private sprite!: Phaser.Physics.Matter.Image;
	private scene!: Phaser.Scene;
	private speed!: number;
  
	constructor(scene: Phaser.Scene) {
	  this.scene = scene;
	}

	public displayBall(ballSize: number) : void {
		const circleRadius: number = ballSize / 2;
		
		let ballDrawer = this.add.graphics({ fillStyle: { color: 0xFFFFFF } });
		ballDrawer.fillCircle(circleRadius, circleRadius, circleRadius);
		ballDrawer.generateTexture('ballTexture', ballSize, ballSize);		
		ballDrawer.destroy();
		
		this.ball = this.matter.add.image(this.scale.width / 2, this.scale.height / 2, 
		'ballTexture', "", { isStatic: false });		
		this.ball.setCircle(circleRadius);		
		this.ball.setBounce(1);
		this.ball.setFrictionAir(0);
		this.ball.setIgnoreGravity(true);
		this.ball.setFriction(0);
	}
}
