import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import Phaser from 'phaser';
import { BootScene } from '../scenes/bootScene';
import { GameScene } from '../scenes/gameScene';
import { GameOverScene } from '../scenes/gameOverScene';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnDestroy, AfterViewInit {
    
    @ViewChild('gameContainer', { static: true }) gameContainerRef!: ElementRef;
    private phaserGame!: Phaser.Game;

    // placeholder for header display
    private headerHeight: number = 100; // give true value to this one
    private hasBeenResized: boolean = false;
    private resizedHandler!: () => void; 

    constructor (private router: Router) {} // add routing to final app

    public getHasBeenResized() : boolean {
        return this.hasBeenResized;
    }

    private addScenesToPhaserGame() : void {
        this.phaserGame.scene.add('BootScene', BootScene, false);
        this.phaserGame.scene.add('GameScene', GameScene, false);
        // this.phaserGame.scene.add('GameOverScene', GameOverScene, false);
    }
    
    ngAfterViewInit(): void {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: this.gameContainerRef.nativeElement,
            physics: {
                default: 'matter',
                matter: { debug: false, gravity: {y : 0} }
            }
        };
        this.phaserGame = new Phaser.Game(config);
        this.addScenesToPhaserGame();
        this.phaserGame.scene.start('BootScene', { gameComponent: this });
        // listen to window event to resize the game in case of screen resize by a player
        this.resizedHandler = () => {
            this.phaserGame.scale.resize(window.innerWidth, window.innerHeight);
            this.hasBeenResized = true;
        };
        window.addEventListener('resize', this.resizedHandler);
        // Listen for the 'gameOver' event
        this.phaserGame.events.on('gameOver', () => {
            console.log('redirect to other url'); // debug
            // this.router.navigateByUrl();
        });
    }

    ngOnDestroy(): void {
        this.phaserGame.events.off('gameOver');
        window.removeEventListener('resize', this.resizedHandler);
        this.phaserGame.destroy(true);
    }
}
