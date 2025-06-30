import { ClockSettings, TimerInterface } from './clock-settings';

describe('ClockSettings Service', () => {
	let service: ClockSettings;

	const mockLocalStorage: Record<string, string> = {};

	beforeEach(() => {
		const localStorageProto = Object.getPrototypeOf(window.localStorage);

		jest
			.spyOn(localStorageProto, 'getItem')
			.mockImplementation(
				(...args) => mockLocalStorage[args[0] as string] || null
			);

		jest.spyOn(localStorageProto, 'setItem').mockImplementation((...args) => {
			const key = args[0] as string;
			const value = args[1] as string;
			mockLocalStorage[key] = value;
		});

		// mock do alert
		jest.spyOn(window, 'alert').mockImplementation(() => {});

		// Inicializa o serviço antes de cada teste
		service = new ClockSettings();
	});

	afterEach(() => {
		jest.clearAllMocks();
		Object.keys(mockLocalStorage).forEach(
			(key) => delete mockLocalStorage[key]
		);
	});

	it('should initialize with default timers if no localStorage', () => {
		expect(service.timers.length).toBe(2);
	});

	it('should load timers from localStorage if present', () => {
		const savedTimers: TimerInterface[] = [
			{ timerStudy: 123, timerRest: 456, timerRestLonger: 789 },
		];
		mockLocalStorage['timers'] = JSON.stringify(savedTimers);

		const loadedService = new ClockSettings();
		expect(loadedService.timers).toEqual(savedTimers);
	});

	it('should add a new timer and save it', () => {
		const newTimer: TimerInterface = {
			timerStudy: 1000,
			timerRest: 2000,
			timerRestLonger: 3000,
		};

		service.addTimer(newTimer);

		expect(service.timers[0]).toEqual(newTimer);
		expect(mockLocalStorage['timers']).toContain('"timerStudy":1000');
	});

	it('should not add a duplicated timer', () => {
		expect(service.timers.length).toBeGreaterThan(0); // Garante que existe pelo menos um timer

		const duplicateTimer = { ...service.timers[0] };

		service.addTimer(duplicateTimer);

		expect(window.alert).toHaveBeenCalledWith('Timer already exists');
		expect(
			service.timers.filter(
				(t) =>
					t.timerStudy === duplicateTimer.timerStudy &&
					t.timerRest === duplicateTimer.timerRest &&
					t.timerRestLonger === duplicateTimer.timerRestLonger
			).length
		).toBe(1);
	});

	it('should remove a timer', () => {
		const toRemove = service.timers[0];
		service.removeTimer(toRemove);

		expect(service.timers).not.toContainEqual(toRemove);
		expect(mockLocalStorage['timers']).not.toContain(JSON.stringify(toRemove));
	});

	it('should save a timer to localStorage', () => {
		const timer: TimerInterface = {
			timerStudy: 1111,
			timerRest: 2222,
			timerRestLonger: 3333,
		};

		service.saveTimer(timer);

		expect(mockLocalStorage['timer']).toEqual(JSON.stringify(timer));
	});
});
