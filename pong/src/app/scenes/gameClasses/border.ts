import Phaser from 'phaser';

export class Border {

	private scene!: Phaser.Scene;
	private border!: Phaser.Physics.Matter.Image;

	constructor (scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
		this.scene = scene;

        this.createBorderImage(x, y, width, height);
	}

    private createBorderImage(x: number, y: number, width: number, height: number) : void {
        let borderDrawer = this.scene.add.graphics({ fillStyle: { color: 0xFFFFFF } });
        borderDrawer.fillRect(0, 0, width, height);
        borderDrawer.generateTexture('borderTexture', width, height);
        borderDrawer.destroy();

        this.border = this.scene.matter.add.image(x, y, 'borderTexture', "", { label: 'border' })
        .setRectangle(width, height)
        .setStatic(true);
    }

    public updateBorderImage() : void {

    }

	public getImageBody() {
        return this.border.body;
    }
}
