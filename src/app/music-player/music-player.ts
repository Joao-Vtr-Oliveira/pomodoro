import { Component, inject, signal } from '@angular/core';
import { MusicService } from '../services/MusicService/music-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';


@Component({
	selector: 'app-music-player',
	templateUrl: './music-player.html',
	styleUrl: './music-player.css',
	imports: [MatButtonModule, MatIconModule, MatSliderModule],
})
export class MusicPlayerComponent {
  musicService = inject(MusicService)

	onVolumeChange(event: Event) {
		const input = event.target as HTMLInputElement;
		this.musicService.setVolume(Number(input.value));
	}

    formatLabel(value: number): string {
    return String(Math.round(value * 100));
  }
}
