import Phaser from 'phaser';

export class Border {

	private scene!: Phaser.Scene;
	private border!: Phaser.Physics.Matter.Image;

	constructor (scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
		this.scene = scene;

		let borderDrawer = this.scene.add.graphics({ fillStyle: { color: 0xFFFFFF } });
        borderDrawer.fillRect(0, 0, width, height);
        borderDrawer.generateTexture('borderTexture', width, height);
        borderDrawer.destroy();

        this.border = this.scene.matter.add.image(x, y, 'borderTexture', "", { label: 'border' })
        .setRectangle(width, height)
        .setStatic(true);
	}

	getImageBody() {
        return this.border.body;
    }

    getImage() {
        return this.border;
    }
}
