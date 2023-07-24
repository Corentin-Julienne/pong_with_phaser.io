import Phaser from 'phaser';

export class StaticAssets {

	// update the value, check for ui aesthetics
	private static readonly BORDER_HEIGHT: number = 0.05;
	private static readonly NET_WIDTH: number = 0.05;
	private static readonly NET_HEIGHT: number = 0.04;
	private static readonly NET_GAP: number = 0.02;
	private static readonly PADDLE_WIDTH: number = 0.02;
	private static readonly PADDLE_HEIGHT: number = 0.10;
	
	private scene!: Phaser.Scene;
	private displayNet!: boolean;
	private displayBorders!: boolean;
	private displayPaddles!: boolean;
	private terrain!: Phaser.GameObjects.Rectangle;
	private topBorder!: Phaser.GameObjects.Rectangle;
	private bottomBorder!: Phaser.GameObjects.Rectangle;
	private leftPaddle!: Phaser.GameObjects.Rectangle;
	private rightPaddle!: Phaser.GameObjects.Rectangle;
	private netGraphics!: Phaser.GameObjects.Graphics;
	private netSegments: Phaser.GameObjects.Rectangle[] = [];
	
	constructor (scene: Phaser.Scene, displayBorders: boolean, displayNet: boolean, displayPaddles: boolean) { // ok
		this.scene = scene;
		this.displayBorders = displayBorders;
		this.displayNet = displayNet;
		this.displayPaddles = displayPaddles;
		this.netGraphics = this.scene.add.graphics();

		this.displayTerrainAsset();
		if (this.displayBorders) {
			this.displayBordersAssets();
		}
		if (this.displayNet) {
			this.displayNetAsset();
		}
		if (this.displayPaddles) {
			this.displayPaddlesAssets();
		}
	};

	private displayTerrainAsset() : void { // ok
		console.log(this.scene);
		this.terrain = this.scene.add.rectangle(0, 0, this.scene.scale.width, this.scene.scale.height, 0x000000);
		this.terrain.setOrigin(0, 0);
	}

	private updateTerrainAsset() : void { // ok
		this.terrain.setSize(this.scene.scale.width, this.scene.scale.height);
	}

	private displayBordersAssets() : void { // ok
		const borderHeight = this.scene.scale.height * StaticAssets.BORDER_HEIGHT;
		const offset: number = borderHeight / 2;

		this.topBorder = this.scene.add.rectangle(this.scene.scale.width / 2, offset, this.scene.scale.width, 
		borderHeight, 0xFFFFFF);

		this.bottomBorder = this.scene.add.rectangle(this.scene.scale.width / 2, this.scene.scale.height - offset, 
		this.scene.scale.width, borderHeight, 0xFFFFFF);
	}

	private updateBordersAssets() : void { // ok
		const borderHeight = this.scene.scale.height * StaticAssets.BORDER_HEIGHT;
        const offset: number = borderHeight / 2;

		this.topBorder.setPosition(this.scene.scale.width / 2, offset);
		this.topBorder.setSize(this.scene.scale.width, borderHeight);

		this.bottomBorder.setPosition(this.scene.scale.width / 2, this.scene.scale.height - offset);
		this.bottomBorder.setSize(this.scene.scale.width, borderHeight);
	}

	private displayNetAsset() : void { // good
		const netHeight: number = this.scene.scale.height * StaticAssets.NET_HEIGHT;
		const netGap: number = this.scene.scale.height * StaticAssets.NET_GAP;
		const offset: number = (this.scene.scale.height * StaticAssets.BORDER_HEIGHT) / 2;
		const netWidth: number = this.scene.scale.width * StaticAssets.NET_WIDTH;

		const netSegmentCount: number = Math.floor(this.scene.scale.height / (netHeight + netGap));
		
		for (let i = 0; i < netSegmentCount; i++) {
			const y = i * (netHeight + netGap) + offset + netGap / 2;
			const rect = this.scene.add.rectangle(this.scene.scale.width / 2, y + netHeight / 2, netWidth, netHeight, 0xFFFFFF);
			this.netSegments.push(rect);
		}
	}

	private updateNetAsset() : void { // seems ok
		const netHeight: number = this.scene.scale.height * StaticAssets.NET_HEIGHT;
		const netGap: number = this.scene.scale.height * StaticAssets.NET_GAP;
		const offset: number = (this.scene.scale.height * StaticAssets.BORDER_HEIGHT) / 2;
		const netWidth: number = this.scene.scale.width * StaticAssets.NET_WIDTH;

        const netSegmentCount: number = Math.floor(this.scene.scale.height / (netHeight + netGap));

        for (let i = 0; i < netSegmentCount; i++) {
			const y = i * (netHeight + netGap) + offset + netGap / 2;
	
			if (i < this.netSegments.length) { // Update existing rectangle
				this.netSegments[i].setPosition(this.scene.scale.width / 2, y + netHeight / 2);
				this.netSegments[i].setSize(netWidth, netHeight);
			} else { // Add new rectangle if needed
				const rect = this.scene.add.rectangle(this.scene.scale.width / 2, y + netHeight / 2, netWidth, 
				netHeight, 0xFFFFFF);
				this.netSegments.push(rect);
			}
		}

		while (this.netSegments.length > netSegmentCount) { // Remove extra rectangles if any
			const lastRect = this.netSegments.pop();
			if (lastRect) lastRect.destroy();
		}
	}

	private displayPaddlesAssets() : void {
		const paddleWidth: number = StaticAssets.PADDLE_WIDTH * this.scene.scale.width;
		const paddleHeight: number = StaticAssets.PADDLE_HEIGHT * this.scene.scale.height;

		this.leftPaddle = this.scene.add.rectangle(50, this.scene.scale.height / 2, paddleWidth, paddleHeight, 0xFFFFFF);
	    this.rightPaddle = this.scene.add.rectangle(this.scene.scale.width - 50, this.scene.scale.height / 2, 
		paddleWidth, paddleHeight, 0xFFFFFF);
	}

	private updatePaddlesAssets() : void {
		const paddleWidth: number = StaticAssets.PADDLE_WIDTH * this.scene.scale.width;
		const paddleHeight: number = StaticAssets.PADDLE_HEIGHT * this.scene.scale.height;
	
		this.leftPaddle.setPosition(50, this.scene.scale.height / 2);
		this.leftPaddle.setSize(paddleWidth, paddleHeight); // update this line
	
		this.rightPaddle.setPosition(this.scene.scale.width - 50, this.scene.scale.height / 2); // update this line
		this.rightPaddle.setSize(paddleWidth, paddleHeight);
	}
	
	public updateGraphicAssets() : void {
		this.updateTerrainAsset();
		if (this.displayBorders) {
			this.updateBordersAssets();
		}
		if (this.displayNet) {
			this.updateNetAsset();
		}
		if (this.displayPaddles) {
			this.updatePaddlesAssets();
		}
	}
}
