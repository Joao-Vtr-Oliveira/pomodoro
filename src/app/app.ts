import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { ClockService } from './services/clock.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  clockService = inject(ClockService);

  controller = computed(() => {
    if(this.clockService.timerController() === 'rest') return this.clockService.remainingTime() === this.clockService.timerRest();
    return this.clockService.remainingTime() === this.clockService.timerLimit();
    
  })

  formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const min = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const sec = String(totalSeconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  }
}
