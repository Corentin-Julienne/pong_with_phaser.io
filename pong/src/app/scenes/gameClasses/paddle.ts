import Phaser from "phaser";

export class Paddle {

	private paddleImg: Phaser.Physics.Matter.Image;
	private scene!: Phaser.Scene;
    private speed!: number;

	constructor(scene: Phaser.Scene, x: number, width: number, height: number, speed: number) {
        this.scene = scene;
        this.speed = speed;

        let paddleDrawer = this.scene.add.graphics({ fillStyle: { color: 0xFFFFFF } });
        paddleDrawer.fillRect(0, 0, width, height);
        paddleDrawer.generateTexture('paddleTexture', width, height);
        paddleDrawer.destroy();

        this.paddleImg = this.scene.matter.add.image(x, this.scene.scale.height / 2,
        'paddleTexture', "", { isStatic: false, label: 'paddle' })
        .setRectangle(width, height);

        // Set the paddle as a dynamic body
        this.paddleImg.setBounce(1);
        this.paddleImg.setFrictionAir(0);
        this.paddleImg.setIgnoreGravity(true);
    }

    private movePaddle(velY: number) {
        this.paddleImg.setVelocityY(velY);
    }

    public setPaddleSpeed(speed: number) {
        this.speed = speed;
    }

    public setPaddleStaticFeature(bool: boolean) {
        this.paddleImg.setStatic(bool);
    }

    public triggerPaddleMove = (event: KeyboardEvent) => {      
        if (this.paddleImg && this.paddleImg.body && event.key === 'ArrowUp') {
          this.movePaddle(-this.speed); // Use negative velY to move upward
        } else if (this.paddleImg && this.paddleImg.body && event.key === 'ArrowDown') {
          this.movePaddle(this.speed);
        }
    }

    public stopPaddleMove = (event: KeyboardEvent) => {
        if (this.paddleImg && this.paddleImg.body) {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                this.paddleImg.setVelocityY(0);
            }
        }
    }

    // public getStaticStatus() : boolean {
    //     this.paddleImg.
    // }

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
