
import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface SuccessAnimationProps {
  message: string;
}

const SuccessAnimation = ({ message }: SuccessAnimationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="animate-fade-in fixed top-0 left-0 right-0 flex justify-center p-4 z-50 pointer-events-none">
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-center">
        <div className="bg-green-500 rounded-full p-1 mr-3 flex-shrink-0">
          <Check className="h-4 w-4 text-white" />
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SuccessAnimation;
