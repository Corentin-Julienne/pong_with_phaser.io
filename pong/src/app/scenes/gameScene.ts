import { Ball } from "./gameClasses/ball";
import { Border } from "./gameClasses/border";
import { Paddle } from "./gameClasses/paddle";
import { StaticAssets } from "./gameClasses/staticAssets";
import { ScoreDisplayer } from "./gameClasses/scoreDisplayer";
import { GameComponent } from "../game/game.component";
import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {

	private gameComponent!: GameComponent;
	
	private staticAssets!: StaticAssets;
	private ball!: Ball;
    private topBorder!: Border;
    private bottomBorder!: Border;
    private rightPaddle!: Paddle;
    private leftPaddle!: Paddle;
	private scoreDisplayer!: ScoreDisplayer;
	private endGame: boolean = false;

	constructor() {
		super('GameScene');
	}

	init(data: { gameComponent: GameComponent }) : void {
		this.gameComponent = data.gameComponent;
	}

	create() : void {
		this.staticAssets = new StaticAssets(this, false, true, false);
		this.implementBorders();
		this.createPaddlesWithPhysics(30, 15, 80, 8);
		this.implementBall();
		this.scoreDisplayer = new ScoreDisplayer(this);
		this.scoreDisplayer.displayScore();
		this.setupBorderCollision();
		this.setupBallPaddleCollision();
	}

	private implementBorders() : void {
		this.topBorder = new Border(this, true);
		this.bottomBorder = new Border(this, false);
	}

	private createPaddlesWithPhysics(x: number, paddleWidth: number, paddleHeight: number, speed: number) : void {
		this.leftPaddle = new Paddle(this, paddleWidth, paddleWidth, paddleHeight, speed);
		this.rightPaddle = new Paddle(this, this.scale.width - paddleWidth, paddleWidth, paddleHeight, speed);
	}

	private implementBall() : void {
		this.ball = new Ball(this);
	}

	private setupBorderCollision(): void {
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

	private setupBallPaddleCollision() : void {
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
					const reflectAngle: number = paddle.returnReflectionAngle(ball.getBallY());
					let angleRad = Phaser.Math.DegToRad(reflectAngle);

					if (paddle === this.rightPaddle) {
						angleRad = Math.PI - angleRad;
					}
					this.ball.updateBallVelocity(angleRad);
				}
			});
		});
	}
	
	override update(time: number, delta: number): void {
		this.handleResizeChanges();
		
		if (this.endGame)
			return;
		
		this.leftPaddle.updatePaddlePos();
		this.rightPaddle.updatePaddlePos();

		const ballOut: string = this.ball.isOutOfBounds(this.scale.width);

		if (ballOut !== 'in') {
			this.scoreDisplayer.updateScore(ballOut);

			if (!this.scoreDisplayer.isMaxScoreReached()) {
				if (ballOut === 'right') {
					this.ball.resetBall(true);
				} else {
					this.ball.resetBall(false);
				}
			} else {
				this.endGame = true;
			}
		}
		if (this.scoreDisplayer.isMaxScoreReached()) {

			this.time.delayedCall(1200, () => {
				this.scene.start('GameOverScene');
			}, [], this);
		}
	}

	private handleResizeChanges() : void {
		if (this.gameComponent.getHasBeenResized() === true) {
			this.staticAssets.updateGraphicAssets();
			this.scoreDisplayer.updateScoreWhenResize();
			this.ball.updateBallWhenResize();
		}
	}
}
