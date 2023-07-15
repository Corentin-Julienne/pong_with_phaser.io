import Phaser from 'phaser';

export class BaseScene extends Phaser.Scene {

	constructor(key: string) {
		super(key);
	}

	create() : void {
		this.displayTerrain();
		this.displayNet();
	}

	displayTerrain() : void {
		const terrain = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000);
		terrain.setOrigin(0, 0);
	}

	displayNet() : void {
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
