import { TestBed } from '@angular/core/testing';
import { ClockService } from './clock.service';

jest.useFakeTimers(); // Ativa temporizador fake do Jest

describe('ClockService', () => {
	let service: ClockService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ClockService);

		// Configura para tempo curto no teste
		service.timerStudy.set(3000); // 3s
		service.timerRest.set(2000); // 2s
		service.remainingTime.set(3000);
    service.playSound = jest.fn();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should start and decrease remainingTime', () => {
		service.startClock();
		expect(service.timerActive()).toBe(true);

		jest.advanceTimersByTime(1000); // 1s
		expect(service.remainingTime()).toBe(2000);

		jest.advanceTimersByTime(2000); // fim do ciclo
		expect(service.remainingTime()).toBe(0);
		expect(service.timerActive()).toBe(false);
	});

	it('should stop the clock', () => {
		service.startClock();
		service.stopClock();

		const current = service.remainingTime();
		jest.advanceTimersByTime(2000);
		expect(service.remainingTime()).toBe(current); // não mudou
		expect(service.timerActive()).toBe(false);
	});

	it('should reset the clock to study time', () => {
		service.remainingTime.set(1000);
		service.timerController.set('study');

		service.resetClock();
		expect(service.remainingTime()).toBe(service.timerStudy());
		expect(service.timerActive()).toBe(false);
	});

	it('should change to rest after study and increase cycle', () => {
		service.timerController.set('study');
		service.remainingTime.set(1000);
		service.startClock();

		jest.advanceTimersByTime(1000);
		expect(service.timerController()).toBe('rest');
		expect(service.studyCycle()).toBe(1);
		expect(service.timerActive()).toBe(false);
	});

	it('should change to study after rest', () => {
		service.timerController.set('rest');
		service.remainingTime.set(1000);
		service.startClock();

		jest.advanceTimersByTime(1000);
		expect(service.timerController()).toBe('study');
		expect(service.timerActive()).toBe(false);
	});
});
