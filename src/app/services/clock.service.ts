import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClockService {
  // timerLimit = signal(25 * 60 * 1000); // 25 minutos
  timerLimit = signal(10 * 1000); // 10 segundos


  // Tempo restante em milissegundos
  remainingTime = signal(this.timerLimit());

  // Guarda a referência do intervalo para poder parar
  private intervalId: ReturnType<typeof setInterval> | null = null;

  progress = computed(() => {
    const total = this.timerLimit();
    const remaining = this.remainingTime();
    const percent = ((total - remaining) / total) * 100;
    return Math.min(100, Math.max(0, Math.round(percent)));
  });

  startClock() {
    if (this.intervalId !== null) return;

    this.intervalId = setInterval(() => {
      this.remainingTime.update((time) => {
        const updated = time - 1000;
        if (updated <= 0) {
          this.stopClock();
          console.log('⏰ Tempo acabou!');
          this.playSound();
          return 0;
        }
        return updated;
      });
    }, 1000);
		
  }

  stopClock() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resetClock() {
    this.stopClock();
    this.remainingTime.set(this.timerLimit());
  }

  private playSound() {
    const audio = new Audio('alarm-sound.mp3');
    audio.play().catch((err) => {
      console.error('Erro ao tocar o som: ', err)
    })
  }
}
