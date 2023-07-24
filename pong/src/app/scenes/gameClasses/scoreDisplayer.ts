import Phaser from 'phaser';

export class ScoreDisplayer {

	private scene!: Phaser.Scene;
	private leftScore: number = 0;
	private rightScore: number = 0;
	private leftScoreObj!: Phaser.GameObjects.Text;
    private rightScoreObj!: Phaser.GameObjects.Text;
	private fontSize!: string;
	
	constructor (scene: Phaser.Scene) {
		this.scene = scene;
	};

	public isMaxScoreReached() : boolean {
		if (this.leftScore === 12 || this.rightScore === 12) {
			return true;
		}
		return false;
	}

	public updateScore(side: string) : void {
		if (side === 'left') {
			this.rightScore++;
			this.rightScoreObj.setText(this.rightScore.toString());
		} else if (side === 'right') {
			this.leftScore++;
			this.leftScoreObj.setText(this.leftScore.toString());
		}
	}

	public displayScore() : void {
		this.fontSize = this.determineFontSize();
		
		this.leftScoreObj = this.scene.add.text(this.scene.scale.width / 4, this.determineDistanceFromTopScreen(), 
		this.leftScore.toString(), { font: `${this.fontSize}px monospace`, color: '#ffffff' }).setOrigin(0.5);

		this.rightScoreObj = this.scene.add.text(this.scene.scale.width * 3/4, this.determineDistanceFromTopScreen(),
		this.rightScore.toString(), { font: `${this.fontSize}px monospace`, color: '#ffffff' }).setOrigin(0.5);
	}

	private determineDistanceFromTopScreen() : number {
		return 50; // change that later
	}

	private determineFontSize() : string {
		return '48'; // change that later
	}
	
	public updateScoreWhenResize() : void { // debug that to keep police similar
		this.fontSize = this.determineFontSize();
	
		this.leftScoreObj.setFontSize(+this.fontSize);
		this.leftScoreObj.setPosition(this.scene.scale.width / 4, this.determineDistanceFromTopScreen());
	
		this.rightScoreObj.setFontSize(+this.fontSize);
		this.rightScoreObj.setPosition(this.scene.scale.width * 3/4, this.determineDistanceFromTopScreen());
	}
}
