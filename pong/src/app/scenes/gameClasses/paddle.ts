import Phaser from "phaser";

export class Paddle {

	private paddleImg!: Phaser.Physics.Matter.Image;
	private scene!: Phaser.Scene;
    private speed!: number;
    private arrowUpPressed: boolean = false;
    private arrowDownPressed: boolean = false;

	constructor(scene: Phaser.Scene, x: number, width: number, height: number, speed: number) {
        this.scene = scene;
        this.speed = speed;

        let paddleDrawer = this.scene.add.graphics({ fillStyle: { color: 0xFFFFFF } });
        paddleDrawer.fillRect(0, 0, width, height);
        paddleDrawer.generateTexture('paddleTexture', width, height);
        paddleDrawer.destroy();

        this.paddleImg = this.scene.matter.add.image(x, this.scene.scale.height / 2,
        'paddleTexture', "", { label: 'paddle' })
        .setRectangle(width, height);

        // Set the paddle as a dynamic body
        this.paddleImg.setBounce(1);
        this.paddleImg.setFrictionAir(0);
        this.paddleImg.setIgnoreGravity(true);
        this.paddleImg.setStatic(true);

        this.scene.input.keyboard?.on('keydown', this.handleKeyDown, this);
        this.scene.input.keyboard?.on('keyup', this.handleKeyUp, this);
    }

    private handleKeyDown(event: KeyboardEvent) : void {
        if (event.key === 'w' || event.key === 'ArrowUp')
            this.arrowUpPressed = true;
        if (event.key === 's' || event.key === 'ArrowDown')
            this.arrowDownPressed = true;
    }

    private handleKeyUp(event: KeyboardEvent) : void {
        if (event.key === 'w' || event.key === 'ArrowUp')
            this.arrowUpPressed = false;
        if (event.key === 's' || event.key === 'ArrowDown')
            this.arrowDownPressed = false;
    }

    private isMovementAllowed(newY: number) : boolean {
        const topOfPaddle = newY - this.paddleImg.height / 2;
        const bottomOfPaddle = newY + this.paddleImg.height / 2;

        return (topOfPaddle >= 0 && bottomOfPaddle <= this.scene.scale.height);
    }

    private movePaddle(delta: number) {
        const newY = this.paddleImg.y + delta;

        if (this.isMovementAllowed(newY)) {
            this.paddleImg.setPosition(this.paddleImg.x, newY);
        }
    }

    public updatePaddlePos() : void {
        if (this.arrowUpPressed) {
            this.movePaddle(-this.speed);
        }

        if (this.arrowDownPressed) {
            this.movePaddle(this.speed);
        }
    }

    public isMovingUp(): boolean {
        return this.arrowUpPressed;
    }

    public isMovingDown(): boolean {
        return this.arrowDownPressed;
    }

    public setPaddleSpeed(speed: number) {
        this.speed = speed;
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
