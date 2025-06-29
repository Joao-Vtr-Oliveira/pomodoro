import { TestBed } from '@angular/core/testing';
import { MusicService } from './music.service';

// Mock da API Audio
const playMock = jest.fn().mockResolvedValue(void 0);
const pauseMock = jest.fn();

class MockAudio {
  src = '';
  volume = 1;
  load = jest.fn();
  play = playMock;
  pause = pauseMock;
}

describe('MusicService', () => {
  let service: MusicService;

  beforeEach(() => {
    globalThis.Audio = jest.fn().mockImplementation(() => new MockAudio()) as any;

    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicService);

    // Limpa mocks
    playMock.mockClear();
    pauseMock.mockClear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should play lofi music', () => {
    service.play('lofi');

    expect(service.currentGenre()).toBe('lofi');
    expect(playMock).toHaveBeenCalled();
    expect(service['audio'].src).toBe('https://streaming.shoutcast.com/chillofi-radio');
  });

  it('should stop music', () => {
    service.play('lofi');
    service.stop();

    expect(service.currentGenre()).toBeNull();
    expect(service['audio'].src).toBe('');
    expect(pauseMock).toHaveBeenCalled();
  });

  it('should set volume', () => {
    service.setVolume(0.25);

    expect(service.volume()).toBe(0.25);
    expect(service['audio'].volume).toBe(0.25);
  });
});
