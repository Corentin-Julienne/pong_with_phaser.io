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
    private headerHeight: number = 100;

    constructor (private router: Router) {} // add routing to final app
    
    ngAfterViewInit(): void {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            scene: [BootScene, GameScene, GameOverScene],
            parent: this.gameContainerRef.nativeElement,
            physics: {
                default: 'matter',
                matter: { debug: false, gravity: {y : 0} }
            }
        };
        this.phaserGame = new Phaser.Game(config);
        // listen to window event to resize the game in case of screen resize by a player
        window.addEventListener('resize', () => {
            this.phaserGame.scale.resize(window.innerWidth, window.innerHeight);
        });
        // Listen for the 'gameOver' event
        this.phaserGame.events.on('gameOver', () => {
            console.log('redirect to other url');
            // this.router.navigateByUrl();
        });
    }

    ngOnDestroy(): void {
        this.phaserGame.events.off('gameOver');
        window.removeEventListener('resize', window);
        this.phaserGame.destroy(true);
    }
}
