import Phaser from 'phaser';

export class Ball {

	private ballImg!: Phaser.Physics.Matter.Image;
	private scene!: Phaser.Scene;
	private speed!: number;
	private initialSpeed!: number;
	private size!: number;
  
	constructor(scene: Phaser.Scene, ballSpeed: number, ballSize: number) {
		this.scene = scene;
		this.initialSpeed = ballSpeed;
		this.speed = this.initialSpeed;
		this.size = ballSize;
		this.displayBall(this.size);
		this.implementBallMovement(null);
	}

	public isOutOfBounds(screenWidth: number): 'left' | 'right' | 'in' {
		const radius = this.size / 2;
		if (this.ballImg.x + radius < 0) {
			return 'left';
		} else if (this.ballImg.x - radius > screenWidth) {
			return 'right';
		}
		return 'in';
	}

	public updateBallVelocity(angleRad: number) : void {
		const velocityX = Math.cos(angleRad) * this.speed;
		const velocityY = Math.sin(angleRad) * this.speed;

		this.ballImg.setVelocity(velocityX, velocityY);
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

	public getVelocity() : Phaser.Math.Vector2 | MatterJS.Vector | undefined {
		if (this.ballImg.body && this.ballImg.body.velocity) {
			return this.ballImg.body?.velocity;
		} else {
			return undefined;
		}
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

	public getBallY() : number { // used
		return this.ballImg.y;
	}

	public getBallSpeed() : number {
		return this.speed;
	}

	public getBodyVelocity() {
		return this.ballImg.body?.velocity;
	}

	private displayBall(ballSize: number) : void {
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

	private resetBallPos() : void {
		this.ballImg.setPosition(this.scene.scale.width /2, this.scene.scale.height / 2);
	}

	private resetBallSpeed() : void {
		this.speed = this.initialSpeed;
	}

	public resetBall(lastPointLostByPlayer1: boolean) : void {
		this.resetBallPos();
		this.resetBallSpeed();
		this.implementBallMovement(lastPointLostByPlayer1);
	}

	private implementBallMovement(lastPointLostByPlayer1: boolean | null): void {
		let angle!: number;
		if (lastPointLostByPlayer1 === null) {
		  // Game just started, choose randomly
		  if (Math.random() < 0.5) {
			angle = Phaser.Math.Between(-45, 45);
		  } else {
			angle = Phaser.Math.Between(-135, -225);
		  }
		} else if (lastPointLostByPlayer1) {
		  // Player 1 lost, send the ball towards player 2
		  angle = Phaser.Math.Between(-45, 45);
		} else {
		  // Player 2 lost, send the ball towards player 1
		  angle = Phaser.Math.Between(-135, -225);
		}
	  
		const angleRad = Phaser.Math.DegToRad(angle);
		
		const velocityX = Math.cos(angleRad) * this.speed;
		const velocityY = Math.sin(angleRad) * this.speed;
		
		this.ballImg.setVelocity(velocityX, velocityY);
	}  
}
