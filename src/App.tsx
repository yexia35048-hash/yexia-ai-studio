import React, { useState, useEffect, useCallback } from 'react';
import { generateSudoku, checkWin, getConflicts, Board } from './utils/sudoku';
import { RefreshCw, CheckCircle2, Lightbulb, Eraser } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function App() {
  const [board, setBoard] = useState<Board>([]);
  const [initialBoard, setInitialBoard] = useState<Board>([]);
  const [solution, setSolution] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [isWon, setIsWon] = useState(false);
  const [conflicts, setConflicts] = useState<{row: number, col: number}[]>([]);

  const startNewGame = useCallback(() => {
    const { puzzle, solution: newSolution } = generateSudoku(difficulty);
    setInitialBoard(puzzle.map(r => [...r]));
    setBoard(puzzle.map(r => [...r]));
    setSolution(newSolution);
    setSelectedCell(null);
    setIsWon(false);
    setConflicts([]);
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (board.length > 0) {
      setConflicts(getConflicts(board));
      if (checkWin(board)) {
        setIsWon(true);
      }
    }
  }, [board]);

  const handleInput = useCallback((num: number) => {
    if (!selectedCell || isWon) return;
    const [r, c] = selectedCell;
    if (initialBoard[r][c] !== 0) return; // Cannot edit initial cells

    setBoard(prev => {
      const newBoard = prev.map(row => [...row]);
      newBoard[r][c] = num;
      return newBoard;
    });
  }, [selectedCell, initialBoard, isWon]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isWon) return;
    
    if (e.key >= '1' && e.key <= '9') {
      handleInput(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      handleInput(0);
    } else if (selectedCell) {
      const [r, c] = selectedCell;
      if (e.key === 'ArrowUp') setSelectedCell([Math.max(0, r - 1), c]);
      if (e.key === 'ArrowDown') setSelectedCell([Math.min(8, r + 1), c]);
      if (e.key === 'ArrowLeft') setSelectedCell([r, Math.max(0, c - 1)]);
      if (e.key === 'ArrowRight') setSelectedCell([r, Math.min(8, c + 1)]);
    }
  }, [handleInput, selectedCell, isWon]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const solveGame = () => {
    setBoard(solution.map(r => [...r]));
  };

  if (board.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const isSelected = (r: number, c: number) => selectedCell?.[0] === r && selectedCell?.[1] === c;
  const isRelated = (r: number, c: number) => {
    if (!selectedCell) return false;
    const [sr, sc] = selectedCell;
    return r === sr || c === sc || (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3));
  };
  const isSameNumber = (r: number, c: number) => {
    if (!selectedCell || board[selectedCell[0]][selectedCell[1]] === 0) return false;
    return board[r][c] === board[selectedCell[0]][selectedCell[1]];
  };
  const isConflict = (r: number, c: number) => conflicts.some(conf => conf.row === r && conf.col === c);
  const isInitial = (r: number, c: number) => initialBoard[r][c] !== 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <div className="max-w-lg mx-auto py-8 px-4 flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Sudoku</h1>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(level => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  difficulty === level 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Win Message */}
        {isWon && (
          <div className="w-full mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="font-semibold">Puzzle Solved!</h3>
              <p className="text-sm opacity-90">Great job completing the {difficulty} puzzle.</p>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="w-full aspect-square bg-white border-4 border-slate-800 rounded-sm shadow-xl overflow-hidden mb-8 select-none">
          <div className="grid grid-cols-9 h-full">
            {board.map((row, r) => 
              row.map((cell, c) => {
                const selected = isSelected(r, c);
                const related = isRelated(r, c);
                const sameNum = isSameNumber(r, c);
                const conflict = isConflict(r, c);
                const initial = isInitial(r, c);

                let bgClass = 'bg-white';
                if (selected) bgClass = 'bg-blue-200';
                else if (conflict) bgClass = 'bg-red-100';
                else if (sameNum) bgClass = 'bg-blue-100';
                else if (related) bgClass = 'bg-slate-100';

                let textClass = 'text-transparent'; // Hide 0s
                if (cell !== 0) {
                  if (conflict) textClass = 'text-red-600 font-semibold';
                  else if (initial) textClass = 'text-slate-900 font-semibold';
                  else textClass = 'text-blue-600 font-medium';
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => setSelectedCell([r, c])}
                    className={`
                      flex items-center justify-center text-xl sm:text-2xl cursor-pointer transition-colors
                      border-slate-300 border-r border-b
                      ${c === 2 || c === 5 ? 'border-r-slate-800 border-r-2' : ''}
                      ${r === 2 || r === 5 ? 'border-b-slate-800 border-b-2' : ''}
                      ${c === 8 ? 'border-r-0' : ''}
                      ${r === 8 ? 'border-b-0' : ''}
                      ${bgClass}
                      ${textClass}
                    `}
                  >
                    {cell !== 0 ? cell : ''}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Numpad */}
        <div className="w-full grid grid-cols-5 gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleInput(num)}
              disabled={isWon}
              className="aspect-square bg-white border border-slate-200 rounded-xl text-2xl font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleInput(0)}
            disabled={isWon}
            className="aspect-square bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            aria-label="Erase"
          >
            <Eraser className="w-6 h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="w-full flex gap-4">
          <button
            onClick={startNewGame}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-sm"
          >
            <RefreshCw className="w-5 h-5" />
            New Game
          </button>
          <button
            onClick={solveGame}
            disabled={isWon}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 py-3 px-4 rounded-xl font-medium hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lightbulb className="w-5 h-5" />
            Solve
          </button>
        </div>

      </div>
    </div>
  );
}
