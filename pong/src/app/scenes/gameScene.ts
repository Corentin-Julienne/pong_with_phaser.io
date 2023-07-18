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
	private isHandlingPaddleCol: boolean = false;

	constructor() {
		super('GameScene');
	}

	override create() : void {
		super.create();
		this.implementBorders(8);
		this.createPaddlesWithPhysics(30, 15, 80, 4);
		this.implementBall(2, 16);
		this.displayScore();
		this.setupBorderCollision();
		this.setupBallPaddleCollision();
	}

	private implementBorders(borderWidth: number) : void {
		this.topBorder = new Border(this, this.scale.width / 2, borderWidth / 2, 
		this.scale.width, borderWidth);
		this.bottomBorder = new Border(this, this.scale.width / 2, this.scale.height - borderWidth / 2, 
		this.scale.width, borderWidth);
	}

	private createPaddlesWithPhysics(x: number, paddleWidth: number, paddleHeight: number, speed: number) : void {
		this.leftPaddle = new Paddle(this, paddleWidth, paddleWidth, paddleHeight, speed);
		this.rightPaddle = new Paddle(this, this.scale.width - paddleWidth, paddleWidth, paddleHeight, speed);

		if (this.input && this.input.keyboard) {
            this.input.keyboard.on('keydown', this.leftPaddle.triggerPaddleMove, this);
			this.input.keyboard.on('keydown', this.rightPaddle.triggerPaddleMove, this);
            this.input.keyboard.on('keyup', this.leftPaddle.stopPaddleMove, this);
			this.input.keyboard.on('keyup', this.rightPaddle.stopPaddleMove, this);
        } // add handling error there
	}

	private implementBall(ballSpeed: number, ballSize: number) : void {
		this.ball = new Ball(this, ballSpeed, ballSize);
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

	private isPaddleCollision(pair : Phaser.Types.Physics.Matter.MatterCollisionData) : boolean {
		if ((pair.bodyA === this.ball.getImageBody() && (pair.bodyB === this.leftPaddle.getImageBody() 
		|| pair.bodyB === this.rightPaddle.getImageBody()))) {
			return true;
		}
		else if ((pair.bodyB === this.ball.getImageBody() && (pair.bodyA === this.leftPaddle.getImageBody() 
		|| pair.bodyA === this.rightPaddle.getImageBody()))) {
			return true;
		}
		return false;
	}

	private setupBallPaddleCollision() : void { // check this
		this.isHandlingPaddleCol = true;
		this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionActiveEvent) => {
			event.pairs.forEach(pair => {
				let ball: Ball | null = null;
				let paddle: Paddle | null = null;

				if (this.isPaddleCollision(pair) === true) {
					ball = this.ball;
					if (pair.bodyA === this.leftPaddle.getImageBody() || pair.bodyB === this.rightPaddle.getImageBody()) {
						paddle = (pair.bodyA === this.leftPaddle.getImageBody()) ? this.leftPaddle : this.rightPaddle;
					}
					else {
						paddle = (pair.bodyB === this.leftPaddle.getImageBody()) ? this.leftPaddle : this.rightPaddle;
					}
				}
				if (ball && paddle) {
					console.log('managing paddle collision');
					paddle.setPaddleStaticFeature(true);
					const diffY: number = (ball.getBallY() - paddle.getPaddleY()) / paddle.getPaddleHeight();
					const angle: number = diffY * 45; 		
					let velocityX: number = this.ball.getBallSpeed() * Math.cos(angle);
					const velocityY: number = this.ball.getBallSpeed() * Math.sin(angle);
					if (paddle === this.rightPaddle) {
						velocityX = -velocityX;
					}
					ball.setBallVelocity(velocityX, velocityY);
				}
			});
		});
		this.isHandlingPaddleCol = false;
	}

	private rmPaddleStaticState() : void {
		if (!this.isHandlingPaddleCol && (this.leftPaddle || this.rightPaddle)) // modify that
		{
			this.leftPaddle.setPaddleStaticFeature(false);
    		this.rightPaddle.setPaddleStaticFeature(false);
		}
	}
	
	override update(time: number, delta: number): void {
		this.rmPaddleStaticState();
	}
}
