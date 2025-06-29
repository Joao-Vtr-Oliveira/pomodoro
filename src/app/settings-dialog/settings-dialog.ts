import {
	ChangeDetectionStrategy,
	Component,
	inject,
} from '@angular/core';
import {
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
	standalone: true,
	selector: 'settings-dialog',
	imports: [MatDialogModule, MatButtonModule, MatChipsModule, MatIconModule],
	templateUrl: './settings-dialog.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsDialogComponent {
	dialogRef = inject(MatDialogRef<SettingsDialogComponent>);

}
