
import React from 'react';
import { Concept } from '../types';

interface ConceptCardProps {
  concept: Concept;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ concept }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-bold text-lg mb-2">{concept.title}</h3>
      <div className="text-xs text-gray-600">
        <p className="mb-1">解释：</p>
        <p>{concept.description}</p>
      </div>
    </div>
  );
};

export default ConceptCard;
