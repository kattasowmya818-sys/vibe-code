import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "SYS_AUDIO_01.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "CORRUPT_SECTOR.MP3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "VOID_SIGNAL.DAT", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("ERR_PLAYBACK:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const prevTrack = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  return (
    <div className="w-full min-w-[300px] bg-black p-6 font-mono text-[#00ffff] relative screen-tear">
      <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} onEnded={nextTrack} />
      
      <div className="border-b-2 border-[#ff00ff] pb-2 mb-4 flex justify-between items-end">
        <span className="text-2xl glitch-text" data-text="AUDIO_SUB">AUDIO_SUB</span>
        <span className="text-sm text-[#ff00ff] animate-pulse">{isPlaying ? 'ACTIVE' : 'IDLE'}</span>
      </div>

      <div className="mb-6">
        <div className="text-sm text-[#ff00ff] mb-1">CURRENT_STREAM:</div>
        <div className="text-xl truncate bg-[#00ffff] text-black p-1">{currentTrack.title}</div>
      </div>

      {/* Raw Progress Bar */}
      <div 
        className="h-4 border-2 border-[#00ffff] mb-6 relative cursor-pointer bg-black"
        onClick={(e) => {
          if (audioRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * audioRef.current.duration;
          }
        }}
      >
        <div className="h-full bg-[#ff00ff]" style={{ width: `${progress}%` }}></div>
        {/* Glitch artifact on progress */}
        <div className="absolute top-0 h-full w-1 bg-white animate-pulse" style={{ left: `${progress}%` }}></div>
      </div>

      {/* Controls */}
      <div className="flex justify-between gap-2">
        <button onClick={prevTrack} className="flex-1 border-2 border-[#00ffff] py-2 hover:bg-[#00ffff] hover:text-black transition-colors">
          {'<<'}
        </button>
        <button onClick={togglePlay} className="flex-[2] border-2 border-[#ff00ff] text-[#ff00ff] py-2 hover:bg-[#ff00ff] hover:text-black transition-colors font-bold">
          {isPlaying ? '[ HALT ]' : '[ EXECUTE ]'}
        </button>
        <button onClick={nextTrack} className="flex-1 border-2 border-[#00ffff] py-2 hover:bg-[#00ffff] hover:text-black transition-colors">
          {'>>'}
        </button>
      </div>
    </div>
  );
}
