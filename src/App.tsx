import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, RotateCcw, User, Cpu, Trophy, Hash, Play, X, Minus, Square as SquareIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import Square from './components/Square';
import { CellValue, checkWinner, getBestMove } from './lib/gameLogic';

type GameMode = 'PvP' | 'PvC';
type GameState = 'menu' | 'playing';

const GITHUB_URL = "https://github.com/Barrsum/X-O-X-Tic-Tac-Toe";
const LINKEDIN_URL = "https://www.linkedin.com/in/ram-bapat-barrsum-diamos";

export default function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState<GameMode>('PvC');
  const [winnerInfo, setWinnerInfo] = useState<{ winner: 'X' | 'O' | 'Draw'; line: number[] | null } | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, Draw: 0 });

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinnerInfo(null);
  }, []);

  const handleSquareClick = (i: number) => {
    if (board[i] || winnerInfo) return;

    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Computer move logic
  useEffect(() => {
    if (gameMode === 'PvC' && !isXNext && !winnerInfo && gameState === 'playing') {
      const timer = setTimeout(() => {
        const move = getBestMove(board);
        if (move !== -1) {
          handleSquareClick(move);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, board, winnerInfo, gameState]);

  // Check for winner
  useEffect(() => {
    const result = checkWinner(board);
    if (result.winner) {
      setWinnerInfo(result as { winner: 'X' | 'O' | 'Draw'; line: number[] | null });
      if (result.winner === 'X') setScores(s => ({ ...s, X: s.X + 1 }));
      else if (result.winner === 'O') setScores(s => ({ ...s, O: s.O + 1 }));
      else setScores(s => ({ ...s, Draw: s.Draw + 1 }));

      if (result.winner !== 'Draw') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#facc15', '#f472b6', '#60a5fa']
        });
      }
    }
  }, [board]);

  return (
    <div className="min-h-screen flex flex-col bg-neo-white selection:bg-neo-yellow selection:text-neo-black">
      {/* Header */}
      <header className="p-4 sm:p-6 border-b-4 border-neo-black bg-neo-yellow">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-neo-black text-neo-white neo-shadow-sm">
              <Hash size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase leading-none">X-O-X</h1>
              <p className="text-[10px] font-bold uppercase tracking-tighter opacity-70">
                Made by <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-neo-pink">Ram Bapat</a>
              </p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-4 mr-4">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-neo-black hover:text-neo-pink transition-colors"><Github size={20} /></a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-neo-black hover:text-neo-blue transition-colors"><Linkedin size={20} /></a>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setGameMode('PvP'); resetGame(); }}
                className={`px-3 py-1.5 neo-border text-sm font-bold flex items-center gap-2 transition-all ${gameMode === 'PvP' ? 'bg-neo-black text-neo-white neo-shadow-sm' : 'bg-neo-white hover:bg-neo-pink/20'}`}
              >
                <User size={14} /> PvP
              </button>
              <button
                onClick={() => { setGameMode('PvC'); resetGame(); }}
                className={`px-3 py-1.5 neo-border text-sm font-bold flex items-center gap-2 transition-all ${gameMode === 'PvC' ? 'bg-neo-black text-neo-white neo-shadow-sm' : 'bg-neo-white hover:bg-neo-blue/20'}`}
              >
                <Cpu size={14} /> PvC
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {gameState === 'menu' ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg w-full p-8 sm:p-12 neo-border neo-shadow bg-neo-white text-center relative"
            >
              <div className="absolute -top-6 -left-6 p-4 bg-neo-pink neo-border neo-shadow-sm rotate-[-5deg]">
                <X size={48} className="text-neo-white" />
              </div>
              <div className="absolute -bottom-6 -right-6 p-4 bg-neo-blue neo-border neo-shadow-sm rotate-[10deg]">
                <div className="w-12 h-12 rounded-full border-8 border-neo-white" />
              </div>

              <h2 className="text-5xl sm:text-7xl font-display mb-4 leading-none">TIC TAC TOE</h2>
              <p className="text-lg font-bold mb-8 opacity-70 uppercase tracking-widest">The Ultimate Challenge</p>
              
              <div className="space-y-4 mb-10">
                <button
                  onClick={() => setGameState('playing')}
                  className="w-full py-5 bg-neo-yellow neo-border neo-shadow-hover font-display text-3xl flex items-center justify-center gap-4 transition-all"
                >
                  <Play size={32} fill="currentColor" /> START GAME
                </button>
                
                <div className="flex gap-4">
                   <button
                    onClick={() => setGameMode(gameMode === 'PvP' ? 'PvC' : 'PvP')}
                    className="flex-1 py-3 bg-neo-white neo-border neo-shadow-sm font-bold flex items-center justify-center gap-2 hover:bg-neo-pink/10 transition-all"
                  >
                    MODE: {gameMode}
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t-4 border-neo-black/10">
                <p className="font-bold text-sm uppercase tracking-widest mb-4">Made by Ram Bapat</p>
                <div className="flex justify-center gap-6">
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="p-3 neo-border bg-neo-white text-neo-black hover:bg-neo-pink transition-all neo-shadow-sm hover:neo-shadow">
                    <Github size={24} />
                  </a>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="p-3 neo-border bg-neo-white text-neo-black hover:bg-neo-blue transition-all neo-shadow-sm hover:neo-shadow">
                    <Linkedin size={24} />
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full"
            >
              {/* Window Container */}
              <div className="neo-border neo-shadow bg-neo-white overflow-hidden">
                {/* Window Title Bar */}
                <div className="bg-neo-black p-3 flex justify-between items-center border-b-4 border-neo-black">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-neo-pink" />
                    <div className="w-3 h-3 rounded-full bg-neo-yellow" />
                    <div className="w-3 h-3 rounded-full bg-neo-blue" />
                    <span className="text-neo-white text-[10px] font-bold uppercase ml-2 tracking-widest">X-O-X.exe</span>
                  </div>
                  <div className="flex gap-2">
                    <Minus size={14} className="text-neo-white cursor-pointer hover:text-neo-yellow" />
                    <SquareIcon size={12} className="text-neo-white cursor-pointer hover:text-neo-blue" />
                    <X size={14} className="text-neo-white cursor-pointer hover:text-neo-pink" onClick={() => setGameState('menu')} />
                  </div>
                </div>

                <div className="p-6">
                  {/* Status Bar */}
                  <div className="mb-6 flex justify-between items-center gap-4">
                    <div className={`p-3 neo-border neo-shadow-sm flex-1 transition-colors ${isXNext && !winnerInfo ? 'bg-neo-pink text-neo-white' : 'bg-neo-white'}`}>
                      <p className="text-[10px] uppercase font-bold opacity-70">Player X</p>
                      <p className="text-xl font-display">{scores.X}</p>
                    </div>
                    <div className="text-center font-display text-2xl opacity-30">VS</div>
                    <div className={`p-3 neo-border neo-shadow-sm flex-1 transition-colors ${!isXNext && !winnerInfo ? 'bg-neo-blue text-neo-white' : 'bg-neo-white'}`}>
                      <p className="text-[10px] uppercase font-bold opacity-70">Player O</p>
                      <p className="text-xl font-display">{scores.O}</p>
                    </div>
                  </div>

                  {/* Game Board */}
                  <div className="relative">
                    <div className="grid grid-cols-3 gap-0 neo-border bg-neo-black overflow-hidden">
                      {board.map((square, i) => (
                        <Square
                          key={i}
                          value={square}
                          onClick={() => handleSquareClick(i)}
                          isWinningSquare={winnerInfo?.line?.includes(i) || false}
                          disabled={!!winnerInfo || (gameMode === 'PvC' && !isXNext)}
                        />
                      ))}
                    </div>

                    {/* Winner Overlay */}
                    <AnimatePresence>
                      {winnerInfo && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute inset-0 flex flex-col items-center justify-center bg-neo-black/90 backdrop-blur-sm z-10 p-6 text-center"
                        >
                          <Trophy className="text-neo-yellow mb-4" size={48} />
                          <h2 className="text-3xl font-display text-neo-white mb-6">
                            {winnerInfo.winner === 'Draw' ? "IT'S A DRAW!" : `${winnerInfo.winner} WINS!`}
                          </h2>
                          <div className="flex flex-col gap-3 w-full">
                            <button
                              onClick={resetGame}
                              className="w-full py-3 bg-neo-yellow neo-border neo-shadow-sm font-bold text-lg flex items-center justify-center gap-2 hover:neo-shadow transition-all"
                            >
                              <RotateCcw size={20} /> PLAY AGAIN
                            </button>
                            <button
                              onClick={() => setGameState('menu')}
                              className="w-full py-3 bg-neo-white neo-border neo-shadow-sm font-bold text-lg flex items-center justify-center gap-2 hover:bg-neo-pink/20 transition-all"
                            >
                              QUIT TO MENU
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Controls */}
                  <div className="mt-8 flex justify-between items-center">
                    <button
                      onClick={resetGame}
                      className="px-4 py-2 neo-border neo-shadow-sm bg-neo-white font-bold text-sm flex items-center gap-2 hover:bg-neo-yellow transition-colors"
                    >
                      <RotateCcw size={16} /> RESET
                    </button>
                    <button
                      onClick={() => setGameState('menu')}
                      className="px-4 py-2 neo-border neo-shadow-sm bg-neo-white font-bold text-sm flex items-center gap-2 hover:bg-neo-pink/20 transition-colors"
                    >
                      MENU
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="font-bold text-[10px] uppercase tracking-widest opacity-50">
                  Made by <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="underline">Ram Bapat</a>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-8 border-t-4 border-neo-black bg-neo-black text-neo-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl mb-2">OPEN SOURCE</h3>
            <p className="opacity-70 text-sm max-w-xs">
              Built with React, Tailwind CSS, and Framer Motion. Part of the April Vibe Coding Challenge.
            </p>
          </div>
          
          <div className="flex gap-6">
            <a 
              href={GITHUB_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 neo-border bg-neo-white text-neo-black hover:bg-neo-pink transition-colors"
              title="View Source on GitHub"
            >
              <Github size={24} />
            </a>
            <a 
              href={LINKEDIN_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 neo-border bg-neo-white text-neo-black hover:bg-neo-blue transition-colors"
              title="Connect on LinkedIn"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neo-white/10 text-center text-xs opacity-40 uppercase tracking-widest">
          © 2026 X-O-X • Created by Ram Bapat
        </div>
      </footer>
    </div>
  );
}
