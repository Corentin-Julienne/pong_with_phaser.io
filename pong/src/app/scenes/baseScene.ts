import Phaser from 'phaser';

export class BaseScene extends Phaser.Scene {

	constructor(key: string) {
		super(key);
	}

	create() : void {
		this.displayTerrain();
	}

	displayTerrain() : void {
		const terrain = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000);
		terrain.setOrigin(0, 0);
	}
}
