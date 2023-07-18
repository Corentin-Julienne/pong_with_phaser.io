import Phaser from "phaser";

export class Paddle {

	private paddleImg: Phaser.Physics.Matter.Image;
	private scene!: Phaser.Scene;

	constructor(scene: Phaser.Scene, x: number, width: number, height: number) {
        this.scene = scene;

        let paddleDrawer = this.scene.add.graphics({ fillStyle: { color: 0xFFFFFF } });
        paddleDrawer.fillRect(0, 0, width, height);
        paddleDrawer.generateTexture('paddleTexture', width, height);
        paddleDrawer.destroy();

        this.paddleImg = this.scene.matter.add.image(x, this.scene.scale.height / 2,
            'paddleTexture', "", { isStatic: true, label: 'paddle' })
            .setRectangle(width, height)
            .setStatic(true);
    }

    public getImageBody() {
        return this.paddleImg.body;
    }

    public getImage() {
        return this.paddleImg;
    }

	public getPaddleWidth() {
		return this.paddleImg.width;
	}

	public getPaddleHeight() {
		return this.paddleImg.height;
	}

	public getPaddleX() {
		return this.paddleImg.x;
	}

	public getPaddleY() {
		return this.paddleImg.y;
	}
}
