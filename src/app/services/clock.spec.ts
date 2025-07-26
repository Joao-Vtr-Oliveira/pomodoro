import { TestBed } from '@angular/core/testing';
import { ClockService } from './clock.service';

// Mock Notification API para evitar erros durante o teste
(globalThis as any).Notification = function () { return {}; };
(globalThis as any).Notification.permission = 'granted';

jest.useFakeTimers();

describe('ClockService', () => {
  let service: ClockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClockService);

    // Reduz tempos para o teste ficar rápido
    service['timerStudy'].set(3000); // 3s
    service['timerRest'].set(2000); // 2s
    service['timerRestLonger'].set(6000); // exemplo
    service.remainingTime.set(3000);

    // Mock para playSound não tocar de verdade
    service.playSound = jest.fn();
    // Mock para métodos de notificação não darem erro
    (service as any).notifyStartCycle = jest.fn();
    (service as any).notifyTimeLeft = jest.fn();
    (service as any).notifyEndCycle = jest.fn();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start and decrease remainingTime', () => {
    service.startClock();
    expect(service.timerActive()).toBe(true);

    jest.advanceTimersByTime(1000);
    expect(service.remainingTime()).toBe(2000);

    jest.advanceTimersByTime(2000);
    expect(service.remainingTime()).toBe(0);
    expect(service.timerActive()).toBe(false);
  });

  it('should stop the clock', () => {
    service.startClock();
    service.stopClock();

    const current = service.remainingTime();
    jest.advanceTimersByTime(2000);
    expect(service.remainingTime()).toBe(current); // não muda
    expect(service.timerActive()).toBe(false);
  });

  it('should reset the clock to study time', () => {
    service.remainingTime.set(1000);
    service.timerController.set('study');

    service.resetClock();
    expect(service.remainingTime()).toBe(service['timerStudy']());
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

  it('should reset internal values after resetClock', () => {
    service['pausedTimeLeft'] = 1234;
    service['endTime'] = 5678;
    service.resetClock();
    expect(service['pausedTimeLeft']).toBeNull();
    expect(service['endTime']).toBeNull();
  });
});
