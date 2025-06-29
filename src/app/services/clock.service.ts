import { computed, Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ClockService {
	// timerLimit = signal(10 * 1000); // estudo: 10 segundos
	// timerRest = signal(5 * 1000); // descanso: 5 segundos
	timerLimit = signal(25 * 60 * 1000); // estudo: 25 minutos
	timerRest = signal(5 * 60 * 1000); // descanso: 5 minutos

	timerController = signal<'study' | 'rest'>('study');

	remainingTime = signal(this.timerLimit());
	private intervalId: ReturnType<typeof setInterval> | null = null;

	progress = computed(() => {
		const total =
			this.timerController() === 'study' ? this.timerLimit() : this.timerRest();
		const remaining = this.remainingTime();
		const percent = ((total - remaining) / total) * 100;
		return Math.min(100, Math.max(1, Math.round(percent)));
	});

	startClock() {
		if (this.intervalId !== null) return;

		// Se o tempo acabou, reseta para o tempo do ciclo atual
		if (this.remainingTime() === 0) {
			this.remainingTime.set(
				this.timerController() === 'study'
					? this.timerLimit()
					: this.timerRest()
			);
		}

		this.intervalId = setInterval(() => {
			this.remainingTime.update((time) => {
				const updated = time - 1000;

				if (updated <= 0) {
					this.stopClock();
					this.handleCycleEnd();
					this.playSound();
					return 0;
				}

				return updated;
			});
		}, 1000);
	}

	stopClock() {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	resetClock() {
		this.stopClock();
		this.remainingTime.set(
			this.timerController() === 'study' ? this.timerLimit() : this.timerRest()
		);
	}

	handleCycleEnd() {
		if (this.timerController() === 'study') {
			console.log('⏰ Estudo acabou! Hora de descansar!');
			this.timerController.set('rest');
			this.remainingTime.set(this.timerRest());
		} else {
			console.log('⏰ Descanso acabou! Hora de voltar a estudar!');
			this.timerController.set('study');
			this.remainingTime.set(this.timerLimit());
		}
		// Aqui **não reinicia** automaticamente!
	}

	private playSound() {
		const audio = new Audio('alarm-sound.mp3');
		audio.play().catch((err) => {
			console.error('Erro ao tocar o som: ', err);
		});
	}
}
