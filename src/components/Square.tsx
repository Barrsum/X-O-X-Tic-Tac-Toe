import React from 'react';
import { motion } from 'motion/react';
import { CellValue } from '../lib/gameLogic';

interface SquareProps {
  value: CellValue;
  onClick: () => void;
  isWinningSquare: boolean;
  disabled: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare, disabled }) => {
  return (
    <motion.button
      whileHover={!disabled && !value ? { scale: 0.98, backgroundColor: '#fef08a' } : {}}
      whileTap={!disabled && !value ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled || !!value}
      className={`
        h-24 w-24 sm:h-32 sm:w-32 neo-border flex items-center justify-center text-5xl sm:text-6xl font-display
        transition-colors duration-200
        ${isWinningSquare ? 'bg-neo-yellow' : 'bg-neo-white'}
        ${!value && !disabled ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {value && (
        <motion.span
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          className={value === 'X' ? 'text-neo-pink' : 'text-neo-blue'}
        >
          {value}
        </motion.span>
      )}
    </motion.button>
  );
};

export default Square;
