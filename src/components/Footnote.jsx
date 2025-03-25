import React, { useState, useRef, useEffect } from 'react';

const Footnote = ({ id, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ vertical: 'top', horizontal: 'center' });
  const footnoteRef = useRef(null);
  const timeoutRef = useRef(null);

  const showFootnote = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const hideFootnote = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 200); // Small delay to allow moving mouse to footnote content
  };

  useEffect(() => {
    const checkPosition = () => {
      if (footnoteRef.current) {
        const rect = footnoteRef.current.getBoundingClientRect();
        const spaceAbove = rect.top;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceLeft = rect.left;
        const spaceRight = window.innerWidth - rect.right;
        
        // Check vertical position
        const vertical = spaceAbove < 200 && spaceBelow > 200 ? 'bottom' : 'top';
        
        // Check horizontal position
        let horizontal = 'center';
        if (spaceLeft < 128) { // 128 is half of the tooltip width (256px)
          horizontal = 'left';
        } else if (spaceRight < 128) {
          horizontal = 'right';
        }
        
        setPosition({ vertical, horizontal });
      }
    };

    if (isVisible) {
      checkPosition();
      window.addEventListener('scroll', checkPosition);
      window.addEventListener('resize', checkPosition);
    }

    return () => {
      window.removeEventListener('scroll', checkPosition);
      window.removeEventListener('resize', checkPosition);
    };
  }, [isVisible]);

  // Close footnote when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (footnoteRef.current && !footnoteRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  const getHorizontalPosition = () => {
    switch (position.horizontal) {
      case 'left':
        return 'left-0';
      case 'right':
        return 'right-0';
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  return (
    <span 
      ref={footnoteRef} 
      className="relative inline-block"
      onMouseEnter={showFootnote}
      onMouseLeave={hideFootnote}
    >
      <sup
        className="text-blue-600 cursor-pointer hover:text-blue-800"
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(!isVisible);
        }}
      >
        [{id}]
      </sup>
      {isVisible && (
        <div 
          className={`absolute w-64 bg-white p-3 rounded-lg shadow-lg text-sm z-50 border border-gray-200
            ${position.vertical === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
            ${getHorizontalPosition()}`}
          onMouseEnter={showFootnote}
          onMouseLeave={hideFootnote}
        >
          {children}
        </div>
      )}
    </span>
  );
};

export default Footnote; 