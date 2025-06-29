import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicPlayerComponent } from './music-player';
import { MusicService } from '../services/MusicService/music.service';
import { signal } from '@angular/core';

class fakeMusicService {
	private audio = {
		src: '',
		volume: 0.5,
		load: jest.fn(),
		play: jest.fn(),
		pause: jest.fn(),
	};

	volume = signal(0.5);
	currentGenre = signal<'lofi' | null>(null);

	private sources = {
		lofi: 'https://streaming.shoutcast.com/chillofi-radio',
	};

	play(genre: 'lofi') {
		this.stop();
		this.audio.src = this.sources[genre];
		this.audio.volume = this.volume();
		this.audio.load();
		this.audio.play();

		this.currentGenre.set(genre);
	}

	stop() {
		this.audio.pause();
		this.audio.src = '';
		this.currentGenre.set(null);
	}

	setVolume(v: number) {
		this.volume.set(v);
		this.audio.volume = v;
	}
}

describe('MusicPlayerComponent', () => {
	let component: MusicPlayerComponent;
	let fixture: ComponentFixture<MusicPlayerComponent>;
	let service: fakeMusicService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MusicPlayerComponent],
			providers: [{ provide: MusicService, useClass: fakeMusicService }],
		}).compileComponents();

		fixture = TestBed.createComponent(MusicPlayerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		service = TestBed.inject(MusicService) as unknown as fakeMusicService;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should play', () => {
		const btnPlay: HTMLButtonElement = fixture.nativeElement.querySelector(
			'[data-testid="btnPlay-musicPlay"]'
		);
		expect(service.currentGenre()).toBe(null);
		btnPlay.click();
		fixture.detectChanges();
		expect(service.currentGenre()).toBe('lofi');
		expect(btnPlay.disabled).toBe(true);
	});
	it('should pause', () => {
		service.play('lofi');
		fixture.detectChanges();
		const btnPause: HTMLButtonElement = fixture.nativeElement.querySelector(
			'[data-testid="btnPause-musicPlay"]'
		);
		expect(service.currentGenre()).toBe('lofi');
		btnPause.click();
		fixture.detectChanges();
		expect(service.currentGenre()).toBe(null);
		expect(btnPause.disabled).toBe(true);
	});
	it('should change volume', () => {
		const inputSlide: HTMLInputElement = fixture.nativeElement.querySelector(
			'[data-testid="inputSlider-musicPlay"]'
		);
    inputSlide.value = '0.8';
    inputSlide.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(service.volume()).toBe(Number(inputSlide.value));
	});
});
