export type Board = number[][];

export const getEmptyBoard = (): Board => Array.from({ length: 9 }, () => Array(9).fill(0));

export const isValid = (board: Board, row: number, col: number, num: number): boolean => {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
    if (board[x][col] === num) return false;
  }
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }
  return true;
};

export const solveSudoku = (board: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const fillDiagonal = (board: Board) => {
  for (let i = 0; i < 9; i = i + 3) {
    fillBox(board, i, i);
  }
};

const fillBox = (board: Board, rowStart: number, colStart: number) => {
  let num;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num = Math.floor(Math.random() * 9) + 1;
      } while (!isSafeInBox(board, rowStart, colStart, num));
      board[rowStart + i][colStart + j] = num;
    }
  }
};

const isSafeInBox = (board: Board, rowStart: number, colStart: number, num: number) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[rowStart + i][colStart + j] === num) return false;
    }
  }
  return true;
};

export const generateSudoku = (difficulty: 'easy' | 'medium' | 'hard'): { puzzle: Board, solution: Board } => {
  const solution = getEmptyBoard();
  fillDiagonal(solution);
  solveSudoku(solution);

  const puzzle = solution.map(row => [...row]);
  let cellsToRemove = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 55;

  while (cellsToRemove > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      cellsToRemove--;
    }
  }

  return { puzzle, solution };
};

export const checkWin = (board: Board): boolean => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return false;
      const num = board[r][c];
      board[r][c] = 0; // Temporarily remove
      const valid = isValid(board, r, c, num);
      board[r][c] = num; // Restore
      if (!valid) return false;
    }
  }
  return true;
};

export const getConflicts = (board: Board): { row: number, col: number }[] => {
  const conflicts: { row: number, col: number }[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== 0) {
        const num = board[r][c];
        board[r][c] = 0;
        if (!isValid(board, r, c, num)) {
          conflicts.push({ row: r, col: c });
        }
        board[r][c] = num;
      }
    }
  }
  return conflicts;
};
