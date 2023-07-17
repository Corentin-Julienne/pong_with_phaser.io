import { BaseScene } from "./baseScene";

export class BootScene extends BaseScene {
	
	private countdownText!: Phaser.GameObjects.Text;
	private countdownVal: number = 5;
	
	constructor () {
		super('BootScene');
	}

	override create() : void {
		super.create();
		this.displayTerrainBorders();
		this.displayPaddles();

		// initiating display of coutdown
		this.countdownText = this.add.text(400, 300, this.countdownVal.toString(), 
		{ fontSize: '32px', color: '#fff' }); // change that
		// Start the countdown
        this.time.addEvent({
            delay: 1000,  // 1 second delay
            callback: this.updateCountdown,
            callbackScope: this,
            loop: true
        });
	}

	updateCountdown() : void {
		this.countdownVal--;
		this.countdownText.setText(this.countdownVal.toString());

		if (this.countdownVal <= 4) { // change this
			this.scene.start('GameScene');
		}
	}

	displayPaddles() : void {
		const paddleWidth: number = 15;
		const paddleHeight: number = 60;

		this.add.rectangle(50, this.scale.height / 2, paddleWidth, paddleHeight, 0xFFFFFF);
		this.add.rectangle(this.scale.width - 50, this.scale.height / 2, paddleWidth, paddleHeight, 0xFFFFFF);
	}

	displayTerrainBorders() : void {
		const borderWidth: number = 8;
		const offset: number = borderWidth / 2;

		// Top border
		const topBorder = this.add.rectangle(this.scale.width / 2, offset, this.scale.width, 
		borderWidth, 0xFFFFFF);
		
		// Bottom border
		const bottomBorder = this.add.rectangle(this.scale.width / 2, this.scale.height - offset, 
		this.scale.width, borderWidth, 0xFFFFFF);
	}
}
