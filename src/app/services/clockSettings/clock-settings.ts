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

	constructor() {
		const timers = localStorage.getItem('timers');

		if (timers) this.timers = JSON.parse(timers);
	}

	addTimer(timer: TimerInterface) {
		if (
			this.timers.find(
				(timerFd) =>
					timer.timerRest === timerFd.timerRest &&
					timer.timerRestLonger === timerFd.timerRestLonger &&
					timer.timerStudy === timerFd.timerStudy
			)
		) {
      return alert('Timer already exists');
		}
    this.timers.unshift(timer);
    this.saveTimers();
	}

	removeTimer(timerRm: TimerInterface) {
		this.timers = this.timers.filter(
			(timer) =>
				timer.timerRest !== timerRm.timerRest &&
				timer.timerRestLonger !== timerRm.timerRest &&
				timer.timerStudy !== timerRm.timerStudy
		);

		this.saveTimers();
	}

	saveTimer(timer: TimerInterface) {
		localStorage.setItem('timer', JSON.stringify(timer));
	}

	private saveTimers() {
		localStorage.setItem('timers', JSON.stringify(this.timers));
	}
}
