import Phaser from 'phaser';

export class Ball {

	private static readonly BALL_SIZE: number = 0.05;
	private static readonly BALL_SPEED: number = 0.05;
	
	private ballImg!: Phaser.Physics.Matter.Image;
	private scene!: Phaser.Scene;
	private speed!: number;
	private initialSpeed!: number;
	private size!: number;
	private currentWidth!: number;
	private currentHeight!: number;
  
	constructor(scene: Phaser.Scene) {
		this.scene = scene;
		this.initialSpeed = this.determineBallSpeed();
		this.speed = this.initialSpeed;
		this.size = this.determineBallSize();
		
		this.displayBall(this.size);
		this.implementBallMovement(null);

		this.currentWidth = this.scene.scale.width;
		this.currentHeight = this.scene.scale.height;
	}

	private determineBallSpeed() : number { // to update
		return (Ball.BALL_SPEED * this.scene.scale.width);
	}

	private determineBallSize() : number { // to update
		return (Ball.BALL_SIZE * 12);
	}

	public getImage() : Phaser.Physics.Matter.Image {
		return this.ballImg;
	}

	public getImageBody() {
		return this.ballImg.body;
	}

	public getBallY() : number {
		return this.ballImg.y;
	}

	public getBodyVelocity() {
		return this.ballImg.body?.velocity;
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
		if (this.speed < 12)
			this.speed++;

		const velocityX = Math.cos(angleRad) * this.speed;
		const velocityY = Math.sin(angleRad) * this.speed;
		
		this.ballImg.setVelocity(velocityX, velocityY);
	}

	public setBallVelY(velY: number) : void {
		this.ballImg.setVelocityY(velY);
	}

	public resetBall(lastPointLostByPlayer1: boolean) : void {
		this.resetBallPos();
		this.resetBallSpeed();
		this.implementBallMovement(lastPointLostByPlayer1);
	}

	public updateBallWhenResize() : void {
		this.updateBallPositionWhenResize();
		this.updateBallSpeedWhenResize();
		this.updateBallSizeWhenResize(this.rtnNewBallSize());
		// modify initial speed to fit with new dimensions
		this.updateInitialSpeed();
		// updating current screen dimensions
		this.currentWidth = this.scene.scale.width;
		this.currentHeight = this.scene.scale.height;
	}

	private rtnNewBallSize() : number {
		return 20; // change that in a dynamic way
	}

	private updateBallPositionWhenResize() : void { // seems ok
		const ballRelativeX = this.ballImg.x / this.currentWidth;
		const ballRelativeY = this.ballImg.y / this.currentHeight;
		
		this.ballImg.setPosition(ballRelativeX * this.scene.scale.width, ballRelativeY * this.scene.scale.height);
	}

	private updateBallSpeedWhenResize() : void { // seems ok
		const newWidth = this.scene.scale.width;
		const newHeight = this.scene.scale.height;
		
		// Calculate the scaling factors
		const scaleX = newWidth / this.currentWidth;
		const scaleY = newHeight / this.currentHeight;
		
		if (this.ballImg.body) {
			let velocity = this.ballImg.body.velocity;
			// Scale the velocity
			velocity.x *= scaleX;
			velocity.y *= scaleY;
			// Set the new velocity
			this.ballImg.setVelocity(velocity.x, velocity.y);
		} else {
			// raise error there
		}
	}

	private updateBallSizeWhenResize(newBallSize: number) : void {
		this.scene.textures.remove('ballTexture');
		this.createBallTexture(newBallSize, newBallSize / 2);
		// Change the body of the ball to match the new size
		const x: number = this.ballImg.body?.position.x!;
		const y: number = this.ballImg.body?.position.y!;
		const velX: number = this.ballImg.body?.velocity.x!;
		const velY: number = this.ballImg.body?.velocity.y!;

		this.ballImg.setBody({type: 'circle', radius: newBallSize / 2});
		this.ballImg.setPosition(x, y);
		this.ballImg.setVelocity(velX, velY);
		this.ballImg.setTexture('ballTexture');
		this.setBallPhysicFeatures();
	}

	private updateInitialSpeed() : void {

	}

	private createBallTexture(ballSize: number, circleRadius: number) : void {
		let ballDrawer = this.scene.add.graphics({ fillStyle: { color: 0xFFFFFF } });
		ballDrawer.fillCircle(circleRadius, circleRadius, circleRadius);
		ballDrawer.generateTexture('ballTexture', ballSize, ballSize);
		ballDrawer.destroy();
	}

	private setBallPhysicFeatures() : void {
		this.ballImg.setBounce(1);
		this.ballImg.setFrictionAir(0);
		this.ballImg.setIgnoreGravity(true);
		this.ballImg.setFriction(0);
	}
	
	private displayBall(ballSize: number) : void {
		const circleRadius: number = ballSize / 2;
		
		this.createBallTexture(ballSize, circleRadius);
		this.ballImg = this.scene.matter.add.image(this.scene.scale.width / 2, this.scene.scale.height / 2, 
		'ballTexture', "", { isStatic: false });
		
		this.setBallPhysicFeatures();
	}

	private resetBallPos() : void {
		this.ballImg.setPosition(this.scene.scale.width /2, this.scene.scale.height / 2);
	}

	private resetBallSpeed() : void {
		this.speed = this.initialSpeed;
	}

	private implementBallMovement(lastPointLostByPlayer1: boolean | null) : void {
		let angle!: number;
		if (lastPointLostByPlayer1 === null) {
			if (Math.random() < 0.5) {
				angle = Phaser.Math.Between(-45, 45);
			} else {
				angle = Phaser.Math.Between(-135, -225);
			}
		} else if (lastPointLostByPlayer1) {
			angle = Phaser.Math.Between(-45, 45);
		} else {
			angle = Phaser.Math.Between(-135, -225);
		}
	  
		const angleRad = Phaser.Math.DegToRad(angle);
		
		const velocityX = Math.cos(angleRad) * this.speed;
		const velocityY = Math.sin(angleRad) * this.speed;
		
		this.ballImg.setVelocity(velocityX, velocityY);
	}  
}
