import React from 'react';
import './App.css';
import Calculator from './Calculator/Calculator';
// import Graphic from './Graphic/Graphic';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <div className="Moon-Picture">
        {/* <Graphic></Graphic> */}
      </div>
      <div className="Calculator">
        <Calculator></Calculator>
      </div>
    </div>
  );
}

export default App;