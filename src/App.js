import { useEffect, useState } from 'react';
import './App.css';
import observe from './spy';

function App() {
  const [ list, setList ] = useState([]);
  useEffect(() => {
    observe(setList);
  }, []);
  console.log(list);

  return (
    <div className="container">
      {list.map(({reactionName, causedBy, newValue, oldValue}, index) => {
        return (
          <div key={index} className="item">
            <div>
              <span className="label">Rerun:</span> {reactionName}
            </div>
            <div>
              <span className="label">CausedBy: </span> {causedBy}
            </div>
            <div>
              <span className="label">Value Change: </span> <span style={{color: 'red'}}>{oldValue}</span> -> <span style={{color: 'green'}}>{newValue}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
