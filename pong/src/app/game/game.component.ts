import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
    private phaserGame?: Phaser.Game;

    ngAfterViewInit(): void {
        // init game config
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            height: 600, // make that shit responsive
            width: 800,
            scene: [BootScene, GameScene, GameOverScene],
            parent: this.gameContainerRef.nativeElement,
            physics: {
                default: 'arcade',
                arcade: { debug: false, gravity: {y : 0} }
            }
        };
        // create game instance
        this.phaserGame = new Phaser.Game(config);
    }

    ngOnDestroy(): void { // destroy the game just before killing component
        this.phaserGame?.destroy(true);
    }
}
