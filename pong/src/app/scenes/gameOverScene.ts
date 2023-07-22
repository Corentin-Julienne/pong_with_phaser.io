import { BaseScene } from "./baseScene";

export class GameOverScene extends BaseScene {
	
	private gameOverText!: Phaser.GameObjects.Text;
    private timedEvent!: Phaser.Time.TimerEvent;
	
	constructor () {
		super('GameOverScene');
	}

	override create(): void {
		super.create();
		this.displayTerrainBorders();

		this.gameOverText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'GAME OVER !', 
        { font: '48px monospace', color: '#ffffff' }).setOrigin(0.5);

        this.timedEvent = this.time.addEvent({ delay: 300, callback: this.blinkText, callbackScope: this, loop: true });

		this.time.delayedCall(3000, () => {
            this.timedEvent.destroy();
            this.gameOverText.setAlpha(1);

			this.game.events.emit('gameOver');
			this.game.destroy(true);
        }, [], this);
	}

	private blinkText() {
		if(this.gameOverText.alpha === 0) {
            this.gameOverText.setAlpha(1);
        }
        else {
            this.gameOverText.setAlpha(0);
        }
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
