import { BaseScene } from "./baseScene";
import { Ball } from "./gameClasses/ball";
import { Border } from "./gameClasses/border";
import { Paddle } from "./gameClasses/paddle";

export class GameScene extends BaseScene {

	private ball!: Ball;
    private topBorder!: Border;
    private bottomBorder!: Border;
    private rightPaddle!: Paddle;
    private leftPaddle!: Paddle;
    private leftScore!: Phaser.GameObjects.Text;
    private rightScore!: Phaser.GameObjects.Text;

	constructor() {
		super('GameScene');
	}

	override create() : void {
		super.create();
		this.implementBorders(8);
		this.createPaddlesWithPhysics(30, 15, 80);
		this.implementBall();
		this.displayScore();
		console.log('go there');
		// this.setupBorderCollision();
		// this.setupBallPaddleCollision();
	}

	private implementBorders(borderWidth: number) : void {
		this.topBorder = new Border(this, this.scale.width / 2, borderWidth / 2, 
		this.scale.width, borderWidth);
		this.bottomBorder = new Border(this, this.scale.width / 2, this.scale.height - borderWidth / 2, 
		this.scale.width, borderWidth);
	}

	private implementBall() : void {
		this.ball = new Ball(this, 1, 8);
	}

	private createPaddlesWithPhysics(x: number, paddleWidth: number, paddleHeight: number) : void {
		this.leftPaddle = new Paddle(this, paddleWidth, paddleWidth, paddleHeight);
		this.rightPaddle = new Paddle(this, this.scale.width - paddleWidth, paddleWidth, paddleHeight);
	}

	private displayScore() : void { // this is functional
		this.leftScore = this.add.text(this.scale.width / 4, 50, '0', { font: '48px monospace', color: '#ffffff' });
		this.rightScore = this.add.text(this.scale.width * 3 / 4, 50, '0', { font: '48px monospace', color: '#ffffff' });
		// make sure the z-index of ball is superior to the z-index of the score
		this.ball.setBallDepth(1);
		this.leftScore.setDepth(0);
		this.rightScore.setDepth(0);
	}

	private setupBorderCollision(): void { // seems to be working
		this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionActiveEvent) => {
			event.pairs.forEach(pair => {
				if ((pair.bodyA === this.ball.getImageBody() && 
					(pair.bodyB === this.topBorder.getImageBody() || pair.bodyB === this.bottomBorder.getImageBody())) ||
					(pair.bodyB === this.ball.getImageBody() && 
					(pair.bodyA === this.topBorder.getImageBody() || pair.bodyA === this.bottomBorder.getImageBody()))) {
					// Invert the y-velocity of the ball to ensure a perfect bounce
					let velocity = this.ball.getBodyVelocity();
					if (velocity)
						this.ball.setBallVelY(-velocity.y);
				}
			});
		});
	}
	
	private setupBallPaddleCollision() : void { // does not work
		this.matter.world.on('collisionstart', (event: { bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType }) => {
			let ball: Ball | null = null;
			let paddle: Paddle | null = null;
	
			if (event.bodyA && event.bodyB) {
				if ((event.bodyA.gameObject === this.ball.getImage() && 
                    (event.bodyB.gameObject === this.leftPaddle.getImage() 
					|| event.bodyB.gameObject === this.rightPaddle.getImage()))) {
                    ball = this.ball;
                    paddle = (event.bodyB.gameObject === this.leftPaddle.getImage()) ? this.leftPaddle : this.rightPaddle;
                } else if ((event.bodyB.gameObject === this.ball.getImage() && 
                    (event.bodyA.gameObject === this.leftPaddle.getImage() 
					|| event.bodyA.gameObject === this.rightPaddle.getImage()))) {
                    ball = this.ball;
                    paddle = (event.bodyA.gameObject === this.leftPaddle.getImage()) ? this.leftPaddle : this.rightPaddle;
                }

				if (ball && paddle) {
					// Calculate the normalized difference between ball's y and paddle's y
					const diffY: number = (ball.getBallY() - paddle.getPaddleY()) / paddle.getPaddleHeight();
					// Scale this difference by a certain factor to determine the bounce angle
					// Adjust this factor to get the desired effect
					const angle: number = diffY * 45; 		
					// Calculate the velocity components based on the angle and the desired speed
					let velocityX: number = this.ball.getBallSpeed() * Math.cos(angle);
					const velocityY: number = this.ball.getBallSpeed() * Math.sin(angle);
					// If the ball hits the right paddle, it should move left, hence the negative sign
					if (paddle === this.rightPaddle) {
						velocityX = -velocityX;
					}
					ball.setBallVelocity(velocityX, velocityY);
				}
			}
		});
	}
	
	override update(time: number, delta: number): void {
	
	}
}
