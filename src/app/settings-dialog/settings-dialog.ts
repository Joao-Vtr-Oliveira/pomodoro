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

@Component({
	standalone: true,
	selector: 'settings-dialog',
	imports: [MatDialogModule, MatButtonModule, MatChipsModule, MatIconModule],
	templateUrl: './settings-dialog.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsDialogComponent {
	dialogRef = inject(MatDialogRef<SettingsDialogComponent>);

	clockService = inject(ClockService);
	clockSettings = inject(ClockSettings);

	timerSelected = this.clockService.returnTimer();

	checkTimers() {
		return this.clockSettings.timers.filter(
			(timer) =>
				timer.timerStudy !== this.timerSelected.timerStudy &&
				timer.timerRest !== this.timerSelected.timerRest
		);
	}
}
