import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentOperand, setCurrentOperand] = useState('');
  const [previousOperand, setPreviousOperand] = useState('');
  const [operation, setOperation] = useState<string | undefined>(undefined);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const appendNumber = (number: string) => {
    if (number === '.' && currentOperand.includes('.')) return;
    setCurrentOperand(currentOperand.toString() + number.toString());
  };

  const chooseOperation = (op: string) => {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
      compute();
    }
    setOperation(op);
    setPreviousOperand(currentOperand);
    setCurrentOperand('');
  };

  const compute = () => {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '÷':
        computation = prev / current;
        break;
      default:
        return;
    }
    
    const result = computation.toString();
    const historyItem = `${previousOperand} ${operation} ${currentOperand} = ${result}`;
    
    setHistory(prevHistory => {
      const newHistory = [historyItem, ...prevHistory];
      return newHistory.slice(0, 10);
    });

    setCurrentOperand(result);
    setOperation(undefined);
    setPreviousOperand('');
  };

  const clear = () => {
    setCurrentOperand('');
    setPreviousOperand('');
    setOperation(undefined);
  };

  const deleteNumber = () => {
    setCurrentOperand(currentOperand.toString().slice(0, -1));
  };

  const percentage = () => {
    if (currentOperand === '') return;
    setCurrentOperand((parseFloat(currentOperand) / 100).toString());
  };

  const clearHistory = () => {
    setHistory([]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
      } else if (e.key === '.') {
        appendNumber('.');
      } else if (e.key === '%') {
        percentage();
      } else if (e.key === '+') {
        chooseOperation('+');
      } else if (e.key === '-') {
        chooseOperation('-');
      } else if (e.key === '*') {
        chooseOperation('*');
      } else if (e.key === '/') {
        e.preventDefault(); // Prevent quick find in Firefox/Safari
        chooseOperation('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        compute();
      } else if (e.key === 'Backspace') {
        deleteNumber();
      } else if (e.key === 'Escape') {
        clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentOperand, previousOperand, operation, history]); // Re-bind when state changes

  return (
    <div className="app-container">
      <div className={`history-panel ${showHistory ? 'visible' : ''}`}>
        <div className="history-header">
          <h3>History</h3>
          {history.length > 0 && (
            <button className="clear-history-btn" onClick={clearHistory}>
              Clear
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="no-history">No history yet</p>
        ) : (
          <ul>
            {history.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="calculator-container">
        <button className="history-toggle" onClick={() => setShowHistory(!showHistory)}>
           {showHistory ? 'Hide History' : 'Show History'}
        </button>
        <div className="calculator-grid">
          <div className="output">
            <div className="previous-operand">{previousOperand} {operation}</div>
            <div className="current-operand">{currentOperand}</div>
          </div>
          <button onClick={clear}>AC</button>
          <button onClick={deleteNumber}>DEL</button>
          <button onClick={percentage}>%</button>
          <button onClick={() => chooseOperation('÷')}>÷</button>
          <button onClick={() => appendNumber('1')}>1</button>
          <button onClick={() => appendNumber('2')}>2</button>
          <button onClick={() => appendNumber('3')}>3</button>
          <button onClick={() => chooseOperation('*')}>*</button>
          <button onClick={() => appendNumber('4')}>4</button>
          <button onClick={() => appendNumber('5')}>5</button>
          <button onClick={() => appendNumber('6')}>6</button>
          <button onClick={() => chooseOperation('+')}>+</button>
          <button onClick={() => appendNumber('7')}>7</button>
          <button onClick={() => appendNumber('8')}>8</button>
          <button onClick={() => appendNumber('9')}>9</button>
          <button onClick={() => chooseOperation('-')}>-</button>
          <button onClick={() => appendNumber('.')}>.</button>
          <button onClick={() => appendNumber('0')}>0</button>
          <button className="span-two" onClick={compute}>=</button>
        </div>
      </div>
    </div>
  );
}

export default App;