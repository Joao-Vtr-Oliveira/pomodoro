import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private audio = new Audio();
  volume = signal(0.5);
  currentGenre = signal<'lofi' | null>(null);

  private sources = {
    lofi: 'https://streaming.shoutcast.com/chillofi-radio',
    synthwave: 'https://waveretro.ru:8443/stream',
  };

  play(genre: 'lofi') {
    this.stop();
    this.audio.src = this.sources[genre];
    this.audio.volume = this.volume();
    this.audio.load();
    this.audio.play().catch(err => console.error('Erro ao tocar áudio', err));
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
