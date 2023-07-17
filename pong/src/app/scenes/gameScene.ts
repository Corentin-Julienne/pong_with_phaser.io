import { BaseScene } from "./baseScene";
import { Ball } from "./gameClasses/ball";

export class GameScene extends BaseScene {

	private ball!: Phaser.Physics.Matter.Image;
    private topBorder!: Phaser.Physics.Matter.Image;
    private bottomBorder!: Phaser.Physics.Matter.Image;
    private rightPaddle!: Phaser.Physics.Matter.Image;
    private leftPaddle!: Phaser.Physics.Matter.Image;
    private leftScore!: Phaser.GameObjects.Text;
    private rightScore!: Phaser.GameObjects.Text;
	private ballSpeed!: number;
	private ballCollidedWithBorder: boolean = false;
	private ballCollidedWithPaddle: boolean = false;

	constructor() {
		super('GameScene');
	}

	private setBallSpeed(speed: number) : void {
		this.ballSpeed = speed;
	}

	override create() : void {
		super.create();
		this.createBordersWithPhysics(8);
		this.createPaddlesWithPhysics(30, 15, 80);
		this.displayBall(24);
		this.displayScore();
		this.setBallSpeed(2);
		this.setupBorderCollision();
		this.setupBallPaddleCollision();
		this.implementBallMovement();
	}

	implementBallMovement() : void {
		let direction: number = 1; // change that with a more random stuff
		this.ball.setVelocity(this.ballSpeed * direction, this.ballSpeed * direction);
	}

	displayScore() : void {
		this.leftScore = this.add.text(this.scale.width / 4, 50, '0', { font: '48px monospace', color: '#ffffff' });
		this.rightScore = this.add.text(this.scale.width * 3 / 4, 50, '0', { font: '48px monospace', color: '#ffffff' });
		// make sure the z-index of ball is superior to the z-index of the score
		this.ball.setDepth(1);
		this.leftScore.setDepth(0);
		this.rightScore.setDepth(0);
	}

	createPaddlesWithPhysics(x: number, paddleWidth: number, paddleHeight: number) : void {
		this.leftPaddle = this.createPaddleSprite(x, paddleWidth, paddleHeight);
		this.rightPaddle = this.createPaddleSprite(this.scale.width - x, paddleWidth, paddleHeight);
	}

	private createPaddleSprite(x: number, paddleWidth: number, paddleHeight: number)
	: Phaser.Physics.Matter.Image {
		let paddleSprite = this.matter.add.image(x, this.scale.height / 2,
		'invisible', "", { isStatic: true, label: 'paddle' });

		let paddleDrawer = this.add.graphics({ fillStyle: { color: 0xFFFFFF } });
		paddleDrawer.fillRect(0, 0, paddleWidth, paddleHeight);
		paddleDrawer.generateTexture('paddleTexture', paddleWidth, paddleHeight);
		paddleDrawer.destroy();

		paddleSprite.setTexture('paddleTexture');
		paddleSprite.setRectangle(paddleWidth, paddleHeight);
		paddleSprite.setStatic(true);
	
		return paddleSprite;
	}

	createBordersWithPhysics(borderWidth: number) : void {
		let borderDrawer = this.add.graphics({ fillStyle: { color: 0xFFFFFF } });

		borderDrawer.fillRect(0, 0, this.scale.width, borderWidth);
		borderDrawer.generateTexture('borderTexture', this.scale.width, borderWidth);
		borderDrawer.destroy();

		this.topBorder = this.matter.add.image(this.scale.width / 2, borderWidth / 2,
			'borderTexture', "", {label: 'border'})
        .setRectangle(this.scale.width, borderWidth)
        .setStatic(true);

   		this.bottomBorder = this.matter.add.image(this.scale.width / 2, this.scale.height - borderWidth / 2,
			'borderTexture', "", { label: 'border' })
        .setRectangle(this.scale.width, borderWidth)
        .setStatic(true);
	}

	displayBall(ballSize: number) : void {
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

	private setupBorderCollision(): void { // seems to be working
		this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionActiveEvent) => {
			event.pairs.forEach(pair => {
				if ((pair.bodyA === this.ball.body && 
					(pair.bodyB === this.topBorder.body || pair.bodyB === this.bottomBorder.body)) ||
					(pair.bodyB === this.ball.body && 
					(pair.bodyA === this.topBorder.body || pair.bodyA === this.bottomBorder.body))) {
					// Invert the y-velocity of the ball to ensure a perfect bounce
					let velocity = this.ball.body.velocity;
					this.ball.setVelocityY(-velocity.y);
				}
			});
		});
	}

	// private setupBallPaddleCollision() : void {
	// 	this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
	// 		console.log(event);
	// 		// rest of the code...
	// 	});		
	// }
	
	private setupBallPaddleCollision() : void { // does not work
		this.matter.world.on('collisionstart', (event: { bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType }) => {
			let ball: Phaser.Physics.Matter.Image | null = null;
			let paddle: Phaser.Physics.Matter.Image | null = null;
	
			if (event.bodyA && event.bodyB) {
				let ball: Phaser.Physics.Matter.Image | null = null;
				let paddle: Phaser.Physics.Matter.Image | null = null;
	
				if ((event.bodyA.gameObject === this.ball && 
					(event.bodyB.gameObject === this.leftPaddle || event.bodyB.gameObject === this.rightPaddle))) {
					ball = event.bodyA.gameObject;
					paddle = event.bodyB.gameObject;
				} else if ((event.bodyB.gameObject === this.ball && 
					(event.bodyA.gameObject === this.leftPaddle || event.bodyA.gameObject === this.rightPaddle))) {
					ball = event.bodyB.gameObject;
					paddle = event.bodyA.gameObject;
				}

				if (ball && paddle) {
					// Calculate the normalized difference between ball's y and paddle's y
					let diffY = (ball.y - paddle.y) / paddle.height;
		
					// Scale this difference by a certain factor to determine the bounce angle
					// Adjust this factor to get the desired effect
					let angle = diffY * 45; 
		
					// Calculate the velocity components based on the angle and the desired speed
					let velocityX = this.ballSpeed * Math.cos(angle);
					let velocityY = this.ballSpeed * Math.sin(angle);
		
					// If the ball hits the right paddle, it should move left, hence the negative sign
					if (paddle === this.rightPaddle) {
						velocityX = -velocityX;
					}
		
					// Set the ball's velocity
					ball.setVelocity(velocityX, velocityY);
				}
			}
		});
	}
	
	override update(time: number, delta: number): void {
	
	}
}
