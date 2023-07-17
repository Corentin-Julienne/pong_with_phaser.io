import { BaseScene } from "./baseScene";

export class GameScene extends BaseScene {

	private ball!: Phaser.Physics.Matter.Image;
    private topBorder!: Phaser.Physics.Matter.Image;
    private bottomBorder!: Phaser.Physics.Matter.Image;
    private rightPaddle!: Phaser.Physics.Matter.Image;
    private leftPaddle!: Phaser.Physics.Matter.Image;
    private leftScore!: Phaser.GameObjects.Text;
    private rightScore!: Phaser.GameObjects.Text;
	private ballSpeed!: number;

	constructor() {
		super('GameScene');
	}

	private setBallSpeed(speed: number) : void {
		this.ballSpeed = speed;
	}

	override create() : void {
		super.create();
		this.createBordersWithPhysics(8);
		this.displayBall(24);
		this.createPaddlesWithPhysics(30, 15, 80);
		this.displayScore();
		this.setBallSpeed(2);
		this.implementBallMovement();
	}

	implementBallMovement() : void {
		let direction: number = 1; // chabge that with a more random stuff
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

	createBordersWithPhysics(borderWidth: number) : void { // test physics, graphics works
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
	
	override update(time: number, delta: number): void {
	
	}
}
