import Phaser from 'phaser';

export class StaticAssets {

	private static readonly BORDER_HEIGHT: number = 0.05;
	private static readonly NET_WIDTH: number = 0.05;
	private static readonly NET_HEIGHT: number = 0.04;
	private static readonly NET_GAP: number = 0.02;
	private static readonly PADDLE_WIDTH: number = 0.02;
	private static readonly PADDLE_HEIGHT: number = 0.10;
	
	private scene!: Phaser.Scene;
	private displayNet!: boolean;
	private displayPaddles!: boolean;
	private terrain!: Phaser.GameObjects.Rectangle;
	private topBorder!: Phaser.GameObjects.Rectangle;
	private bottomBorder!: Phaser.GameObjects.Rectangle;
	private leftPaddle!: Phaser.GameObjects.Rectangle;
	private rightPaddle!: Phaser.GameObjects.Rectangle;
	private netGraphics!: Phaser.GameObjects.Graphics;
	private netSegments!: Phaser.Geom.Line[];
	
	constructor (scene: Phaser.Scene, displayNet: boolean, displayPaddles: boolean) {		
		this.scene = scene;
		this.displayNet = displayNet;
		this.displayPaddles = displayPaddles;

		this.displayTerrainAsset();
		this.displayBordersAssets();
		if (this.displayNet) {
			this.displayNetAsset();
		}
		if (this.displayPaddles) {
			this.displayPaddlesAssets();
		}
	};

	private displayTerrainAsset() : void {
		console.log(this.scene);
		this.terrain = this.scene.add.rectangle(0, 0, this.scene.scale.width, this.scene.scale.height, 0x000000);
		this.terrain.setOrigin(0, 0);
	}

	private updateTerrainAsset() : void {
		this.terrain.setSize(this.scene.scale.width, this.scene.scale.height);
	}

	private displayBordersAssets() : void {
		const borderHeight = this.scene.scale.height * StaticAssets.BORDER_HEIGHT;
		const offset: number = borderHeight / 2;

		this.topBorder = this.scene.add.rectangle(this.scene.scale.width / 2, offset, this.scene.scale.width, 
		borderHeight, 0xFFFFFF);

		this.bottomBorder = this.scene.add.rectangle(this.scene.scale.width / 2, this.scene.scale.height - offset, 
		this.scene.scale.width, borderHeight, 0xFFFFFF);
	}

	private updateBordersAssets() : void { // to test
		const borderHeight = this.scene.scale.height * StaticAssets.BORDER_HEIGHT;
        const offset: number = borderHeight / 2;

		this.topBorder.setPosition(this.scene.scale.width / 2, offset);
		this.topBorder.setSize(this.scene.scale.width, borderHeight);

		this.bottomBorder.setPosition(this.scene.scale.width / 2, this.scene.scale.height - offset);
		this.bottomBorder.setSize(this.scene.scale.width, borderHeight);
	}

	private drawNet(): void {
		const netWidth: number = this.scene.scale.width * StaticAssets.NET_WIDTH;
		
		this.netGraphics.clear();
		this.netGraphics.lineStyle(netWidth, 0xFFFFFF);
		
		for (const segment of this.netSegments) {
			this.netGraphics.strokeLineShape(segment);
		}
	}

	private displayNetAsset() : void { // to test
		const netHeight: number = this.scene.scale.height * StaticAssets.NET_HEIGHT;
		const netGap: number = this.scene.scale.height * StaticAssets.NET_GAP;
		const offset: number = (this.scene.scale.height * StaticAssets.BORDER_HEIGHT) / 2;

		const netSegmentCount: number = Math.floor(this.scene.scale.height / (netHeight + netGap));

		for (let i = 0; i < netSegmentCount; i++) {
			const y = i * (netHeight + netGap) + offset + netGap / 2;
			const line = new Phaser.Geom.Line(this.scene.scale.width / 2, y, this.scene.scale.width / 2, y + netHeight);
			this.netSegments.push(line);
		}
		
		this.drawNet();
	}

	private updateNetAsset() : void { // to test
        const netHeight: number = this.scene.scale.height * StaticAssets.NET_HEIGHT;
        const netGap: number = this.scene.scale.height * StaticAssets.NET_GAP;
        const offset: number = (this.scene.scale.height * StaticAssets.BORDER_HEIGHT) / 2;

        const netSegmentCount: number = Math.floor(this.scene.scale.height / (netHeight + netGap));

        this.netSegments = [];
        for (let i = 0; i < netSegmentCount; i++) {
            const y = i * (netHeight + netGap) + offset + netGap / 2;
            const line = new Phaser.Geom.Line(this.scene.scale.width / 2, y, this.scene.scale.width / 2, y + netHeight);
            this.netSegments.push(line);
        }

        this.drawNet();
	}

	private displayPaddlesAssets() : void {
		const paddleWidth: number = StaticAssets.PADDLE_WIDTH * this.scene.scale.width;
		const paddleHeight: number = StaticAssets.PADDLE_HEIGHT * this.scene.scale.height;

		this.leftPaddle = this.scene.add.rectangle(50, this.scene.scale.height / 2, paddleWidth, paddleHeight, 0xFFFFFF);
	    this.rightPaddle = this.scene.add.rectangle(this.scene.scale.width - 50, this.scene.scale.height / 2, 
		paddleWidth, paddleHeight, 0xFFFFFF);
	}

	private updatePaddlesAssets() : void { // to test
		const paddleWidth: number = StaticAssets.PADDLE_WIDTH * this.scene.scale.width;
		const paddleHeight: number = StaticAssets.PADDLE_HEIGHT * this.scene.scale.height;

		this.leftPaddle.setPosition(50, this.scene.scale.height / 2);
		this.leftPaddle.setSize(this.scene.scale.width - 50, this.scene.scale.height / 2);

		this.rightPaddle.setPosition(paddleWidth, paddleHeight);
		this.rightPaddle.setSize(paddleWidth, paddleHeight);
	}

	public updateGraphicAssets() : void {
		this.updateTerrainAsset();
		this.updateBordersAssets();
		if (this.displayNet) {
			this.updateNetAsset();
		}
		if (this.displayPaddles) {
			this.updatePaddlesAssets();
		}
	}
}
