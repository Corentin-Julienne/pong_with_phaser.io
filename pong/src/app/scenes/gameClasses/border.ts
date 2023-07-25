import Phaser from 'phaser';

export class Border {

	private static readonly BORDER_HEIGHT: number = 0.03;
    
    private scene!: Phaser.Scene;
	private border!: Phaser.Physics.Matter.Image;
    private borderHeight!: number;
    private borderWidth!: number;
    private x!: number;
    private y!: number;
    private isTopBorder!: boolean;

	constructor (scene: Phaser.Scene, isTopBorder: boolean) {
		this.scene = scene;
        this.isTopBorder = isTopBorder;
        this.borderHeight = this.rtnBorderHeight();
        this.determineBorderPosition();
        this.createBorderImage();
	}

    private determineBorderPosition() : void {
        if (this.isTopBorder) {
            this.x = this.scene.scale.width / 2;
            this.y = this.borderHeight / 2;
        } else {
            this.x = this.scene.scale.width / 2;
            this.y = this.scene.scale.height - this.borderHeight / 2;
        }
    }

    private rtnBorderHeight() : number { // update this
        return (Border.BORDER_HEIGHT * this.scene.scale.height);
    }

    private createBordertexture() : void {
        let borderDrawer = this.scene.add.graphics({ fillStyle: { color: 0xFFFFFF } });
        borderDrawer.fillRect(0, 0, this.borderWidth, this.borderHeight);
        borderDrawer.generateTexture('borderTexture', this.borderWidth, this.borderHeight);
        borderDrawer.destroy();
    }

    private createBorderImage() : void {
        this.createBordertexture();

        this.border = this.scene.matter.add.image(this.x, this.y, 'borderTexture', "", { label: 'border' })
        .setRectangle(this.borderWidth, this.borderHeight)
        .setStatic(true);
    }

    public updateBorderImage() : void { // to test
        this.borderWidth = this.scene.scale.width;
        this.borderHeight = this.scene.scale.height * Border.BORDER_HEIGHT;

        this.determineBorderPosition();
        
        this.scene.textures.remove('borderTexture');
        this.createBordertexture();

        this.border.setTexture('borderTexture');
        this.border.setRectangle(this.borderWidth, this.borderHeight);
        this.border.setPosition(this.x, this.y);
    }

	public getImageBody() {
        return this.border.body;
    }
}
