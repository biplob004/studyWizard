import { useState, useEffect, useCallback } from 'react';

export const useTextSelection = () => {
  const [selectedText, setSelectedText] = useState<string>('');

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('keyup', handleTextSelection);
    };
  }, [handleTextSelection]);

  const clearSelection = () => {
    setSelectedText('');
    if (window.getSelection) {
      if (window.getSelection()?.empty) {
        window.getSelection()?.empty();
      } else if (window.getSelection()?.removeAllRanges) {
        window.getSelection()?.removeAllRanges();
      }
    }
  };

  return { selectedText, clearSelection };
};
