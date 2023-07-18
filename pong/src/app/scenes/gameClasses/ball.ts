import Phaser from 'phaser';

export class Ball {

	private ballImg!: Phaser.Physics.Matter.Image;
	private scene!: Phaser.Scene;
	private speed!: number;
	private size!: number;
  
	constructor(scene: Phaser.Scene, ballSpeed: number, ballSize: number) {
	  this.scene = scene;
	  this.speed = ballSpeed;
	  this.size = ballSize;
	  this.displayBall(this.size);
	  this.implementBallMovement();
	}

	public setBallDepth(val: number) : void {
		this.ballImg.setDepth(val);
	}

	public setBallVelocity(velX: number, velY: number) : void {
		this.ballImg.setVelocity(velX, velY);
	}

	public setBallVelX(velX: number) : void {
		this.ballImg.setVelocityX(velX);
	}

	public setBallVelY(velY: number) : void {
		this.ballImg.setVelocityY(velY);
	}

	public getImage() : Phaser.Physics.Matter.Image {
		return this.ballImg;
	}

	public getImageBody() {
		return this.ballImg.body;
	}

	public getBallX() : number {
		return this.ballImg.x;
	}

	public getBallY() : number {
		return this.ballImg.y;
	}

	public getBallSpeed() : number {
		return this.speed;
	}

	public getBodyVelocity() {
		return this.ballImg.body?.velocity;
	}

	private displayBall(ballSize: number) : void { // pb to solve there
		const circleRadius: number = ballSize / 2;
		
		let ballDrawer = this.scene.add.graphics({ fillStyle: { color: 0xFFFFFF } });
		ballDrawer.fillCircle(circleRadius, circleRadius, circleRadius);
		ballDrawer.generateTexture('ballTexture', ballSize, ballSize);
		ballDrawer.destroy();

		this.ballImg = this.scene.matter.add.image(this.scene.scale.width / 2, this.scene.scale.height / 2, 
		'ballTexture', "", { isStatic: false });
		
		this.ballImg.setBounce(1);
		this.ballImg.setFrictionAir(0);
		this.ballImg.setIgnoreGravity(true);
		this.ballImg.setFriction(0);
	}

	private implementBallMovement() : void {
		let direction: number = 1; // change that with a more random stuff
		this.ballImg.setVelocity(this.speed * direction, this.speed * direction);
	}
}
