import { BaseScene } from "./baseScene";

export class GameScene extends BaseScene {

	private ball!: Phaser.Physics.Arcade.Sprite;
	private topBorder!: Phaser.Physics.Arcade.Sprite;
	private bottomBorder!: Phaser.Physics.Arcade.Sprite;
	private rightBorder!: Phaser.Physics.Arcade.Sprite;
	private leftBorder!: Phaser.Physics.Arcade.Sprite;

	constructor() {
		super('GameScene');
	}

	override create() : void {
		super.create();
		this.createBordersWithPhysics(8);
		this.displayBall();
		this.displayPaddles();
		this.displayScore();
	}

	createBordersWithPhysics(borderWidth: number) : void {
		this.topBorder = this.createBorderSprite(0, 0, false, borderWidth);
		this.bottomBorder = this.createBorderSprite(0, this.scale.height - borderWidth, false, borderWidth);
		this.rightBorder = this.createBorderSprite(this.scale.width - borderWidth, 0, true, borderWidth);
		this.leftBorder = this.createBorderSprite(0, 0, true, borderWidth);
	}

	private createBorderSprite(x: number, y: number, isVertical: boolean, borderWidth: number)
	: Phaser.Physics.Arcade.Sprite {
		let drawer = this.add.graphics();

		drawer.fillStyle(0xFFFFFF); // white
		let textureKey = 'borderTexture';
		if (isVertical) {
			drawer.fillRect(x, y, 8, this.scale.height);
			drawer.generateTexture(textureKey, borderWidth, this.scale.height);
		}
		else {
			drawer.fillRect(x, y, this.scale.width, borderWidth);
			drawer.generateTexture(textureKey, this.scale.width, borderWidth);
		}

		let borderSprite = this.physics.add.sprite(x, y, textureKey);

		borderSprite.setAlpha(0); // full opacity
		return borderSprite;
	}

	displayBall() : void {
		this.ball = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'ball');
	}

	displayPaddles() : void {

	}

	displayScore() : void {

	}

	override update(time: number, delta: number): void {
		
	}
}
