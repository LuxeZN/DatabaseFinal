import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  return (
    <div className="App">
      <div class = "topnav">
      <a className={activeTab === 'home' ? 'active' : ''} href="javascript:void(0)" onClick={() => setActiveTab('home')}>Home</a>
        <a className={activeTab === 'table' ? 'active' : ''} href="javascript:void(0)" onClick={() => setActiveTab('table')}>Table</a>
        <a className={activeTab === 'graph' ? 'active' : ''} href="javascript:void(0)" onClick={() => setActiveTab('graph')}>Graph</a>
        <a className={activeTab === 'containers' ? 'active' : ''} href="javascript:void(0)" onClick={() => setActiveTab('containers')}>Docker Containers</a>
      </div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hello world
        </a>
      </header>
    </div>
  );
}

export default App;
