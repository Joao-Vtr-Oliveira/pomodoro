import { Injectable } from '@angular/core';

export interface TimerInterface {
	timerStudy: number;
	timerRest: number;
	timerRestLonger: number;
}

@Injectable({
	providedIn: 'root',
})
export class ClockSettings {
	timers: TimerInterface[] = [
		{
			timerStudy: 25 * 60 * 1000,
			timerRest: 5 * 60 * 1000,
			timerRestLonger: 5 * 60 * 1000 * 3,
		},
		{
			timerStudy: 50 * 60 * 1000,
			timerRest: 10 * 60 * 1000,
			timerRestLonger: 10 * 60 * 1000 * 3,
		},
	];
}
