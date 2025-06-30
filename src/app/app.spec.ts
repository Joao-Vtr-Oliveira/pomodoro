import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { ClockService } from './services/clock.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog';

describe('App', () => {
	let fixture: any;
	let app: App;
	let dialogSpy: jest.Mocked<MatDialog>;

	beforeEach(async () => {
		dialogSpy = { open: jest.fn() } as any;

		await TestBed.configureTestingModule({
			imports: [App],
			providers: [ClockService, { provide: MatDialog, useValue: dialogSpy }],
		}).compileComponents();

		fixture = TestBed.createComponent(App);
		app = fixture.componentInstance;
	});

	it('should create the app', () => {
		expect(app).toBeTruthy();
	});

	it('should toggle showMusic when onMusicClick is called', () => {
		const initial = app.showMusic();
		app.onMusicClick();
		expect(app.showMusic()).toBe(!initial);
	});

	it('should open settings dialog when openDialog is called', () => {
		app.openDialog();
		expect(dialogSpy.open).toHaveBeenCalledWith(SettingsDialogComponent);
	});

	it('should format time correctly', () => {
		expect(app.formatTime(0)).toBe('00:00');
		expect(app.formatTime(61000)).toBe('01:01');
		expect(app.formatTime(3599000)).toBe('59:59');
	});
});
