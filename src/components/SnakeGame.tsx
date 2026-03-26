import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const SPEED = 80;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  directionRef.current = direction;
  const changingDirectionRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused(p => !p);
        return;
      }
      
      if (changingDirectionRef.current) return;

      if (['ArrowUp', 'w', 'W'].includes(e.key) && directionRef.current.y === 0) {
        setDirection({ x: 0, y: -1 });
        changingDirectionRef.current = true;
      } else if (['ArrowDown', 's', 'S'].includes(e.key) && directionRef.current.y === 0) {
        setDirection({ x: 0, y: 1 });
        changingDirectionRef.current = true;
      } else if (['ArrowLeft', 'a', 'A'].includes(e.key) && directionRef.current.x === 0) {
        setDirection({ x: -1, y: 0 });
        changingDirectionRef.current = true;
      } else if (['ArrowRight', 'd', 'D'].includes(e.key) && directionRef.current.x === 0) {
        setDirection({ x: 1, y: 0 });
        changingDirectionRef.current = true;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 1;
            onScoreChange(newScore);
            return newScore;
          });
          let newFood;
          while (true) {
            newFood = {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE),
            };
            // eslint-disable-next-line no-loop-func
            if (!newSnake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
          }
          setFood(newFood);
        } else {
          newSnake.pop();
        }

        changingDirectionRef.current = false;
        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, SPEED);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, onScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid
    ctx.strokeStyle = '#ff00ff';
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_SIZE, i); ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Food
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#00ffff';
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      
      // Glitch artifact on snake body occasionally
      if (Math.random() > 0.9) {
         ctx.fillStyle = '#ff00ff';
         ctx.fillRect(segment.x * CELL_SIZE + Math.random()*5, segment.y * CELL_SIZE, CELL_SIZE/2, CELL_SIZE/2);
      }
    });

  }, [snake, food]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setFood({ x: 15, y: 15 });
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
    changingDirectionRef.current = false;
  };

  return (
    <div className="relative flex flex-col items-center w-full bg-black">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="bg-black block w-full h-auto image-rendering-pixelated"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20">
          <h2 className="text-6xl font-mono text-[#ff00ff] glitch-text mb-8" data-text="FATAL_ERR">FATAL_ERR</h2>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-[#00ffff] text-black font-mono text-2xl hover:bg-[#ff00ff] hover:text-white transition-colors uppercase border-4 border-black outline outline-2 outline-[#00ffff] hover:outline-[#ff00ff]"
          >
            [ REBOOT ]
          </button>
        </div>
      )}
      
      {isPaused && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <h2 className="text-5xl font-mono text-[#00ffff] glitch-text animate-pulse" data-text="SYSTEM_HALT">SYSTEM_HALT</h2>
        </div>
      )}
    </div>
  );
}
