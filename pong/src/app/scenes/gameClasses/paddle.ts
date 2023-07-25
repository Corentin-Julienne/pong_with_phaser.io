import Phaser from "phaser";

export class Paddle {

	private paddleImg!: Phaser.Physics.Matter.Image;
    private scene!: Phaser.Scene;
    private isLeftPaddle!: boolean;
    private paddleWidth!: number;
    private paddleHeight!: number;
    private x!: number;
    private speed!: number;
    private arrowUpPressed: boolean = false;
    private arrowDownPressed: boolean = false;

	constructor(scene: Phaser.Scene, isLeftPaddle: boolean) {
        this.scene = scene;
        this.isLeftPaddle = isLeftPaddle;
        this.determineSpeed();
        this.determinePaddleDimensions();
        this.determinePaddlePosition();

        this.addPaddleTexture();

        this.paddleImg = this.scene.matter.add.image(this.x, this.scene.scale.height / 2,
        'paddleTexture', "", { label: 'paddle' })
        .setRectangle(this.paddleWidth, this.paddleHeight);

        this.setPaddlePhysicProperties();

        this.scene.input.keyboard?.on('keydown', this.handleKeyDown, this);
        this.scene.input.keyboard?.on('keyup', this.handleKeyUp, this);
    }

    private determinePaddleDimensions() : void {

    }

    private determinePaddlePosition() : void {
        if (this.isLeftPaddle) {

        } else {

        }
    }

    private determineSpeed() : void {

    }

    private addPaddleTexture() : void {
        let paddleDrawer = this.scene.add.graphics({ fillStyle: { color: 0xFFFFFF } });
        paddleDrawer.fillRect(0, 0, this.paddleWidth, this.paddleHeight);
        paddleDrawer.generateTexture('paddleTexture', this.paddleWidth, this.paddleHeight);
        paddleDrawer.destroy();
    }

    private setPaddlePhysicProperties() : void {
        this.paddleImg.setBounce(1);
        this.paddleImg.setFrictionAir(0);
        this.paddleImg.setIgnoreGravity(true);
        this.paddleImg.setStatic(true);
    }

    public getImageBody() {
        return this.paddleImg.body;
    }

    public updatePaddlePos() : void {
        if (this.arrowUpPressed) {
            this.movePaddle(-this.speed);
        }

        if (this.arrowDownPressed) {
            this.movePaddle(this.speed);
        }
    }

    // return a segment between 1 and 8
    public returnReflectionAngle(ballY: number) : number {
        let diffY = ballY - this.paddleImg.y;

        diffY = (diffY + this.paddleImg.height / 2) / this.paddleImg.height;

        const segment = Math.round(diffY * 8);

        return (this.getReflectionAngle(Math.max(1, Math.min(8, segment))));
    }

    private getChaoticReflectionAngle(): number {
        const angles: number[] = [-45, -30, -15, 0, 30, 45];
        const randomIndex: number = Math.floor(Math.random() * 7);

        console.log(angles[randomIndex]); // debug
        return angles[randomIndex];
    }
    
    private getReflectionAngle(segment: number): number {
        switch (segment) {
            case 1:
                return -45;
            case 2:
                return -30;
            case 3:
                return -15;
            case 4:
                return 0;
            case 5:
                return 0;
            case 6:
                return 15;
            case 7:
                return 30;
            case 8:
                return 45;
            default:
                return 0;
        }
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

    public updatePaddleWhenResize() : void {

    }
}
