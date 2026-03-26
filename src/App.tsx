/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-sans selection:bg-[#ff00ff] selection:text-black flex flex-col crt-flicker">
      <div className="scanlines"></div>
      <div className="static-noise"></div>

      {/* Header */}
      <header className="w-full p-4 border-b-4 border-[#ff00ff] bg-black z-10 flex justify-between items-center screen-tear">
        <div className="flex flex-col">
          <h1 className="text-4xl font-mono text-[#00ffff] glitch-text uppercase tracking-tighter" data-text="SYS.OP.SNAKE_PROTOCOL">
            SYS.OP.SNAKE_PROTOCOL
          </h1>
          <span className="text-[#ff00ff] text-xl mt-2">STATUS: ONLINE // V.9.0.1</span>
        </div>
        <div className="border-2 border-[#00ffff] p-2 bg-black text-[#ff00ff] font-mono text-sm uppercase">
          <span className="animate-pulse">REC_</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8 p-8 relative z-10">
        {/* Game Section */}
        <div className="flex-1 flex justify-center items-center w-full max-w-2xl border-4 border-[#00ffff] p-1 relative bg-black">
          <div className="absolute top-0 left-0 w-full h-full border-2 border-[#ff00ff] pointer-events-none animate-pulse opacity-50"></div>
          <SnakeGame onScoreChange={setScore} />
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-auto flex flex-col items-start justify-start gap-8">
          <motion.div 
            className="w-full h-32 border-4 border-[#ff00ff] bg-black flex items-center justify-center relative overflow-hidden screen-tear"
            animate={{
              borderColor: ["#ff00ff", "#00ffff", "#ff00ff"],
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <div className="text-center">
              <div className="text-[#00ffff] font-mono text-lg">DATA_FRAGMENTS</div>
              <div className="text-5xl font-mono text-[#ff00ff] glitch-text" data-text={score.toString().padStart(4, '0')}>
                {score.toString().padStart(4, '0')}
              </div>
            </div>
          </motion.div>
          
          <div className="w-full border-4 border-[#00ffff] bg-black p-1">
            <MusicPlayer />
          </div>
        </div>
      </main>
    </div>
  );
}
