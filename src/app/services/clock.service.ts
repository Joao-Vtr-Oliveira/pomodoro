import { computed, Injectable, signal } from '@angular/core';
import { TimerInterface } from './clockSettings/clock-settings';

@Injectable({
	providedIn: 'root',
})
export class ClockService {
	// timerStudy = signal(10 * 1000); // estudo: 10 segundos
	// timerRest = signal(5 * 1000); // descanso: 5 segundos
	private timerStudy = signal(25 * 60 * 1000); // estudo: 25 minutos
	private timerRest = signal(5 * 60 * 1000); // descanso: 5 minutos
	private timerRestLonger = signal(this.timerRest() * 3);
	studyCycle = signal(0); // Quantos ciclos já se passaram

	timerController = signal<'study' | 'rest'>('study'); // Se é estudo ou descanso
	timerActive = signal(false); // Informação se o timer está ativo

	remainingTime = signal(this.timerStudy());
	private intervalId: ReturnType<typeof setInterval> | null = null;

	constructor() {
		const stored = localStorage.getItem('timer');
		if (stored) {
			const { timerStudy, timerRest, timerRestLonger } = JSON.parse(stored);
			JSON.parse(stored);
			this.timerStudy.set(timerStudy);
			this.timerRest.set(timerRest);
			this.timerRestLonger.set(timerRestLonger);
			this.remainingTime.set(timerStudy);
		}
	}

	progress = computed(() => {
		const total =
			this.timerController() === 'study' ? this.timerStudy() : this.timerRest();
		const remaining = this.remainingTime();
		const percent = (remaining / total) * 100;
		return Math.max(0, Math.min(100, Math.round(percent)));
	});

	changeTimers(
		timerStudy: number,
		timerRest: number,
		timeRestLonger: number = timerRest * 3
	) {
		this.timerStudy.set(timerStudy);
		this.timerRest.set(timerRest);
		this.timerRestLonger.set(timeRestLonger);
		this.resetClock();
	}

	startClock() {
		if (this.intervalId !== null) return;
		this.timerActive.set(true);

		// Se o tempo acabou, reseta para o tempo do ciclo atual
		if (this.remainingTime() === 0) {
			this.remainingTime.set(
				this.timerController() === 'study'
					? this.timerStudy()
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
			this.timerActive.set(false);
		}
	}

	resetClock() {
		this.stopClock();
		this.remainingTime.set(
			this.timerController() === 'study' ? this.timerStudy() : this.timerRest()
		);
		this.timerActive.set(false);
	}

	handleCycleEnd() {
		if (this.timerController() === 'study') {
			console.log('⏰ Estudo acabou! Hora de descansar!');
			this.studyCycle.update((oldValue) => oldValue + 1);
			this.timerController.set('rest');
			if (this.studyCycle() % 4 === 0) {
				this.remainingTime.set(this.timerRestLonger());
			} else {
				this.remainingTime.set(this.timerRest());
			}
		} else {
			console.log('⏰ Descanso acabou! Hora de voltar a estudar!');
			this.timerController.set('study');
			this.remainingTime.set(this.timerStudy());
		}
		this.timerActive.set(false);
		// Aqui **não reinicia** automaticamente!
	}

	playSound() {
		const audio = new Audio('alarm-sound.mp3');
		audio.play().catch((err) => {
			console.error('Erro ao tocar o som: ', err);
		});
	}

	returnTimer(): TimerInterface {
		return {
			timerStudy: this.timerStudy(),
			timerRest: this.timerRest(),
			timerRestLonger: this.timerRestLonger(),
		};
	}
}
