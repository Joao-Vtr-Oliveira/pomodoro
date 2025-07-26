import { computed, Injectable, signal } from '@angular/core';
import { TimerInterface } from './clockSettings/clock-settings';

@Injectable({
	providedIn: 'root',
})
export class ClockService {
	private timerStudy = signal(25 * 60 * 1000); // estudo: 25 minutos
	private timerRest = signal(5 * 60 * 1000); // descanso: 5 minutos
	private timerRestLonger = signal(this.timerRest() * 3);
	private endTime: number | null = null;
	private pausedTimeLeft: number | null = null;
	studyCycle = signal(0); // Quantos ciclos já se passaram

	timerController = signal<'study' | 'rest'>('study'); // Se é estudo ou descanso
	timerActive = signal(false); // Informação se o timer está ativo

	remainingTime = signal(this.timerStudy());
	private intervalId: ReturnType<typeof setInterval> | null = null;

	// ? Pega a informação do localStorage se existir
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

		this.notifyStartCycle(Math.round(this.remainingTime() / 60000));

		let remaining =
			this.pausedTimeLeft !== null ? this.pausedTimeLeft : this.remainingTime();

		remaining = Math.max(0, remaining);

		this.endTime = Date.now() + remaining;
		this.pausedTimeLeft = null;

		this.intervalId = setInterval(() => {
			const now = Date.now();
			let remaining = (this.endTime ?? now) - now;
			if (remaining <= 5 * 60 * 1000 + 500 && remaining > 5 * 60 * 1000 - 500) {
				this.notifyTimeLeft(5);
			}

			if (remaining <= 0) {
				remaining = 0;
				this.stopClock();
				this.handleCycleEnd();
				this.playSound();
			}
			this.remainingTime.set(remaining);
		}, 1000);
	}

	stopClock() {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
			this.timerActive.set(false);
			if (this.endTime) {
				const now = Date.now();
				const left = Math.max(0, this.endTime - now);
				this.pausedTimeLeft = left;
				this.remainingTime.set(left);
			}
			this.endTime = null;
		}
	}

	resetClock() {
		this.stopClock();
		this.remainingTime.set(
			this.timerController() === 'study' ? this.timerStudy() : this.timerRest()
		);
		this.timerActive.set(false);
		this.pausedTimeLeft = null;
		this.endTime = null;
	}

	handleCycleEnd() {
		if (this.timerController() === 'study') {
			console.log('⏰ Estudo acabou! Hora de descansar!');
			this.notifyEndCycle(true);
			this.studyCycle.update((oldValue) => oldValue + 1);
			this.timerController.set('rest');
			if (this.studyCycle() % 4 === 0) {
				this.remainingTime.set(this.timerRestLonger());
			} else {
				this.remainingTime.set(this.timerRest());
			}
		} else {
			console.log('⏰ Descanso acabou! Hora de voltar a estudar!');
			this.notifyEndCycle(false);
			this.timerController.set('study');
			this.remainingTime.set(this.timerStudy());
		}
		this.timerActive.set(false);
		this.pausedTimeLeft = null;
		this.endTime = null;
	}

	playSound() {
		const audio = new Audio('/alarm-sound.mp3');
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

	private notifyStartCycle(minutesTotal: number) {
		if ('Notification' in window && Notification.permission === 'granted') {
			try {
				new Notification('🍅 Pomodoro iniciado!', {
					body: `Ciclo de ${minutesTotal} minutos começou!`,
					icon: '/icons/icon-192x192.png',
					badge: '/icons/icon-96x96.png',
					vibrate: [200, 100, 200],
					tag: 'pomodoro-timer',
				} as any);
				console.log('Notificação "Pomodoro iniciado" enviada!');
			} catch (e) {
				console.error('Erro ao criar notificação de início:', e);
			}
		} else {
			console.log(
				'Permissão de notificação não concedida (início):',
				Notification.permission
			);
		}
	}

	private notifyTimeLeft(minutesLeft: number) {
		if ('Notification' in window && Notification.permission === 'granted') {
			try {
				new Notification('⏳ Pomodoro em andamento!', {
					body: `Faltam apenas ${minutesLeft} minutos para concluir este ciclo.`,
					icon: '/icons/icon-192x192.png',
					badge: '/icons/icon-96x96.png',
					vibrate: [200, 100, 200],
					tag: 'pomodoro-timer',
				} as any);
				console.log('Notificação de tempo restante enviada!');
			} catch (e) {
				console.error('Erro ao criar notificação de tempo restante:', e);
			}
		} else {
			console.log(
				'Permissão de notificação não concedida (tempo):',
				Notification.permission
			);
		}
	}

	private notifyEndCycle(isStudy: boolean) {
		if ('Notification' in window && Notification.permission === 'granted') {
			try {
				new Notification(
					isStudy ? '🍅 Pomodoro finalizado!' : '💤 Descanso finalizado!',
					{
						body: isStudy
							? 'Hora de fazer uma pausa! Você completou um ciclo.'
							: 'Hora de voltar a estudar!',
						icon: '/icons/icon-192x192.png',
						badge: '/icons/icon-96x96.png',
						vibrate: [400, 200, 400],
						tag: 'pomodoro-timer',
					} as any
				);
				console.log('Notificação de fim de ciclo enviada!');
			} catch (e) {
				console.error('Erro ao criar notificação de fim de ciclo:', e);
			}
		} else {
			console.log(
				'Permissão de notificação não concedida (fim):',
				Notification.permission
			);
		}
	}
}
