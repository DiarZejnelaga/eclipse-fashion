'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CardType {
  id: string;
  name: string;
  sprite: {
    url: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface CardTypeSelectorProps {
  cardTypes: CardType[];
  selectedCardTypeId: string | null;
  onCardTypeSelect: (cardTypeId: string) => void;
  label?: string;
}

const DownArrowIcon = () => (
  <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M19 9l-7 7-7-7"></path>
  </svg>
);

const SpriteLogo: React.FC<{ spriteData: CardType['sprite']; altName: string; className?: string }> = ({ spriteData, altName, className = "" }) => {
  return (
    <div
      role="img"
      aria-label={altName}
      className={`shrink-0 bg-no-repeat ${className}`}
      style={{
        width: `${spriteData.width}px`,
        height: `${spriteData.height}px`,
        backgroundImage: `url(${spriteData.url})`,
        backgroundPosition: `${spriteData.x}px ${spriteData.y}px`,
      }}
    ></div>
  );
};


const CardTypeSelector: React.FC<CardTypeSelectorProps> = ({
  cardTypes,
  selectedCardTypeId,
  onCardTypeSelect,
  label = "Credit Card"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  const selectedType = cardTypes.find(ct => ct.id === selectedCardTypeId) || (cardTypes.length > 0 ? cardTypes[0] : null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (cardTypeId: string) => {
    onCardTypeSelect(cardTypeId);
    setIsOpen(false);
  };

  if (!cardTypes || cardTypes.length === 0) {
    return <div className="text-sm text-gray-500">No card types available.</div>;
  }

  return (
    <div className="relative" ref={selectorRef}>
      <button
        type="button"
        className="group w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="block truncate text-sm font-medium text-gray-700">{label}</span>
        <span className="ml-2 flex items-center space-x-2">
          {selectedType && (
            <SpriteLogo spriteData={selectedType.sprite} altName={selectedType.name} />
          )}
          <DownArrowIcon />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white shadow-lg border border-gray-300 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm max-h-60">
          <ul>
            {cardTypes.map((cardType) => (
              <li
                key={cardType.id}
                className={`px-3 py-2.5 cursor-pointer select-none relative hover:bg-gray-100 flex items-center space-x-3 ${selectedCardTypeId === cardType.id ? 'bg-indigo-50' : ''}`}
                onClick={() => handleSelect(cardType.id)}
                role="option"
                aria-selected={selectedCardTypeId === cardType.id}
              >
                <SpriteLogo spriteData={cardType.sprite} altName={cardType.name} />
                <span className={`block truncate text-sm ${selectedCardTypeId === cardType.id ? 'font-semibold text-indigo-700' : 'font-normal text-gray-800'}`}>
                  {cardType.name}
                </span>
                {selectedCardTypeId === cardType.id && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CardTypeSelector;