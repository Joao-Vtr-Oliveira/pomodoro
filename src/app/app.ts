import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { ClockService } from './services/clock.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import { MusicPlayerComponent } from "./music-player/music-player";

@Component({
  selector: 'app-root',
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule, MusicPlayerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  clockService = inject(ClockService);
  showMusic = signal(false);

  onMusicClick() {
    this.showMusic.update((oldMusic) => !oldMusic);
  }

  formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const min = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const sec = String(totalSeconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  }
}
