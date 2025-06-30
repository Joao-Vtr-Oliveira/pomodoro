import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	signal,
} from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ClockService } from '../services/clock.service';
import {
	ClockSettings,
	TimerInterface,
} from '../services/clockSettings/clock-settings';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
	standalone: true,
	selector: 'settings-dialog',
	imports: [
		MatDialogModule,
		MatButtonModule,
		MatChipsModule,
		MatIconModule,
		FormsModule,
		MatInputModule,
		MatFormFieldModule,
	],
	templateUrl: './settings-dialog.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsDialogComponent {
	dialogRef = inject(MatDialogRef<SettingsDialogComponent>);

	clockService = inject(ClockService);
	clockSettings = inject(ClockSettings);

	timerSelected = this.clockService.returnTimer();

	tabSelected = signal(true);

	newTimerRest = signal<number | undefined>(undefined);
	newTimerStudy = signal<number | undefined>(undefined);
	newTimerRestLonger = signal<number | undefined>(undefined);

	clickNewTimer() {
		const rest = this.newTimerRest();
		const study = this.newTimerStudy();
		const restLonger = this.newTimerRestLonger();
		if (!rest || !study || !restLonger) return;
		this.clockSettings.addTimer({
			timerRest: rest * 60 * 1000,
			timerStudy: study * 60 * 1000,
			timerRestLonger: restLonger * 60 * 1000,
		});
		this.tabSelected.set(true);
	}

	checkTimers() {
		return this.clockSettings.timers.filter(
			(timer) =>
				timer.timerStudy !== this.timerSelected.timerStudy &&
				timer.timerRest !== this.timerSelected.timerRest
		);
	}

	clickChangeTimer(timer: TimerInterface) {
		this.clockService.changeTimers(
			timer.timerStudy,
			timer.timerRest,
			timer.timerRestLonger
		),
		this.dialogRef.close();
		this.clockSettings.saveTimer(timer);
	}
}
