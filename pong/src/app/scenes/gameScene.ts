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
    private leftScoreObj!: Phaser.GameObjects.Text;
    private rightScoreObj!: Phaser.GameObjects.Text;
	private leftScore: number = 0;
	private rightScore: number = 0;
	private endGame: boolean = false;

	constructor() {
		super('GameScene');
	}

	init() : void {

	}

	override create() : void {
		super.create();
		this.displayNet();
		this.implementBorders(8);
		this.createPaddlesWithPhysics(30, 15, 80, 8);
		this.implementBall(4, 16);
		this.displayScore();
		this.setupBorderCollision();
		this.setupBallPaddleCollision();
	}

	private implementBorders(borderWidth: number) : void { // works
		this.topBorder = new Border(this, this.scale.width / 2, borderWidth / 2, 
		this.scale.width, borderWidth);
		this.bottomBorder = new Border(this, this.scale.width / 2, this.scale.height - borderWidth / 2, 
		this.scale.width, borderWidth);
	}

	private createPaddlesWithPhysics(x: number, paddleWidth: number, paddleHeight: number, speed: number) : void { // works
		this.leftPaddle = new Paddle(this, paddleWidth, paddleWidth, paddleHeight, speed);
		this.rightPaddle = new Paddle(this, this.scale.width - paddleWidth, paddleWidth, paddleHeight, speed);
	}

	private implementBall(ballSpeed: number, ballSize: number) : void { // works
		this.ball = new Ball(this, ballSpeed, ballSize);
	}

	private displayScore() : void { // this is functional
		this.leftScoreObj = this.add.text(this.scale.width / 4, 50, this.leftScore.toString(), 
		{ font: '48px monospace', color: '#ffffff' }).setOrigin(0.5);
		this.rightScoreObj = this.add.text(this.scale.width * 3 / 4, 50, this.rightScore.toString(), 
		{ font: '48px monospace', color: '#ffffff' }).setOrigin(0.5);
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

	private isPaddleCollision(pair : Phaser.Types.Physics.Matter.MatterCollisionData) : boolean { // works
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
					console.log('paddle collision registered'); // debug
					const diffY: number = ((ball.getBallY() - paddle.getPaddleY()) / (paddle.getPaddleHeight() / 2)) - 1;
					const angle: number = diffY * (45 * Math.PI / 180); 		
					let velocityX: number = this.ball.getBallSpeed() * Math.cos(angle);
					const velocityY: number = this.ball.getBallSpeed() * Math.sin(angle);
					if (paddle === this.rightPaddle) {
						velocityX = -velocityX;
					}
					ball.setBallVelocity(velocityX, velocityY);
				}
			});
		});
	}
	
	override update(time: number, delta: number): void {
		if (this.endGame)
			return;
		
		this.leftPaddle.updatePaddlePos();
		this.rightPaddle.updatePaddlePos();

		const ballOut: string = this.ball.isOutOfBounds(this.scale.width, this.scale.height);

		if (ballOut !== 'in') { // means a point has been marked
			this.updateScore(ballOut);

			if (this.leftScore !== 12 && this.rightScore !== 12) {
				this.ball.resetBall();
			} else {
				this.endGame = true;
			}
		}
		// trigger game over scene if conditions met (score === 12)
		if (this.leftScore === 12 || this.rightScore === 12) {

			this.time.delayedCall(1500, () => {
				this.scene.start('GameOverScene');
			}, [], this);
		}
	}

	private updateScore(side: string) : void { // seems functional
		if (side === 'left') {
			this.rightScore++;
			this.rightScoreObj.text = '';
			this.displayScore();
		} else if (side === 'right') {
			this.leftScore++;
			this.leftScoreObj.text = '';
			this.displayScore();
		}
	}

	private displayNet() : void {
		const netWidth: number = 4;
		const netHeight: number = 20;
		const netGap: number = 15;
		const drawer = this.add.graphics();
		const offset = 8 / 2; // change that

		// count net segments needed
		const netSegmentCount: number = Math.floor(this.scale.height / (netHeight + netGap));

		drawer.lineStyle(netWidth, 0xFFFFFF);

		for (let i = 0; i < netSegmentCount; i++) {
			const y = i * (netHeight + netGap) + offset + netGap / 2;
			drawer.moveTo(this.scale.width / 2, y);
			drawer.lineTo(this.scale.width / 2, y + netHeight);
		}

		drawer.strokePath();
	}
}
