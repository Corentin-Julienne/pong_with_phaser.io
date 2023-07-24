import { GameComponent } from "../game/game.component";
import { StaticAssets } from "./gameClasses/staticAssets";
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
	
	private gameComponent!: GameComponent;
	private countdownText!: Phaser.GameObjects.Text;
	private countdownVal: number = 1; // change this
	private staticAssets!: StaticAssets;
	
	constructor () {
		super('BootScene');
	}

	init(data: { gameComponent: GameComponent }) {
		this.gameComponent = data.gameComponent;
	}

	create() : void {
		this.staticAssets = new StaticAssets(this, true, false, true);
		this.displayCountdownText();
        this.time.addEvent({
            delay: 1000,
            callback: this.updateCountdown,
            callbackScope: this,
            loop: true
        });
	}

	private displayCountdownText() : void { // test
		const centerX = this.scale.width / 2;
    	const centerY = this.scale.height / 2;
		const fontSize: number = Math.max(this.scale.width / 10, this.scale.height / 20); // change that
		
		this.countdownText = this.add.text(centerX, centerY, this.countdownVal.toString(), 
		{ fontSize: `${fontSize}px`, color: '#fff' });
		this.countdownText.setOrigin(0.5);
	}

	private updateCountdownWhenResize() : void {
		const centerX = this.scale.width / 2;
    	const centerY = this.scale.height / 2;
		const fontSize: number = Math.max(this.scale.width / 10, this.scale.height / 20);
		
		this.countdownText.setFontSize(fontSize);
		this.countdownText.setPosition(centerX, centerY);
	}

	private updateCountdown() : void {
		this.countdownVal--;
		this.countdownText.setText(this.countdownVal.toString());

		if (this.countdownVal === 0) {
			this.scene.start('GameScene', { gameComponent: this.gameComponent });
		}
	}

	override update(time: number, delta: number): void {
		if (this.gameComponent.getHasBeenResized() === true) {
			this.staticAssets.updateGraphicAssets();
			this.updateCountdownWhenResize();
		}
	}
}
