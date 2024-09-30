import React from 'react';

// LevelUpModal komponenti uchun props tipi
type LevelUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  level: string;
};

// Modal komponenti
const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, onClose, level }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Tabriklaymiz!</h2>
        <p className="text-lg mb-6">Siz {level} darajasiga erishdingiz!</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Yopish
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;
