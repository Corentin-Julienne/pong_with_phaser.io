import { GameComponent } from "../game/game.component";
import { StaticAssets } from "./gameClasses/staticAssets";
import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
	
	private gameComponent!: GameComponent;
	private gameOverText!: Phaser.GameObjects.Text;
    private timedEvent!: Phaser.Time.TimerEvent;
	private staticAssets!: StaticAssets;
	
	constructor () {
		super('GameOverScene');	
	}

	init(data: { gameComponent: GameComponent }) : void {
		this.gameComponent = data.gameComponent;
	}

	create(): void {
		this.staticAssets = new StaticAssets(this, true, false, false);
		this.displayGameOverText();
		
		this.timedEvent = this.time.addEvent({ delay: 300, callback: this.blinkText, callbackScope: this, loop: true });

		this.time.delayedCall(3000, () => {
            this.timedEvent.destroy();
            this.gameOverText.setAlpha(1);

			this.game.events.emit('gameOver');
			this.game.destroy(true);
        }, [], this);
	}

	private displayGameOverText() : void {
		const centerX = this.scale.width / 2;
		const centerY = this.scale.height / 2;
		const fontSize: number = Math.max(this.scale.width / 10, this.scale.height / 20);
	
		this.gameOverText = this.add.text(centerX, centerY, 'GAME OVER !', 
        { font: `${fontSize}px monospace`, color: '#ffffff' }).setOrigin(0.5);
	}

	private updateGameOverText() : void {
		const centerX = this.scale.width / 2;
    	const centerY = this.scale.height / 2;
		const fontSize: number = Math.max(this.scale.width / 10, this.scale.height / 20);

		this.gameOverText.setFontSize(fontSize);
		this.gameOverText.setPosition(centerX, centerY);
	}

	private blinkText() {
		if(this.gameOverText.alpha === 0) {
            this.gameOverText.setAlpha(1);
        }
        else {
            this.gameOverText.setAlpha(0);
        }
    }

	override update(time: number, delta: number): void {
		if (this.gameComponent.getHasBeenResized() === true) {
			this.staticAssets.updateGraphicAssets();
			this.updateGameOverText();
		}
	}
}
