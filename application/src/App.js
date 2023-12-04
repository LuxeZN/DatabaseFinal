import './App.css';
import React, { useState } from 'react';
import { ReactTerminal } from "react-terminal";

function SortButton() {
  const [sort, setSort] = useState(0);
  function handleSortClick() {
    console.log(sort)
    if (sort === 0) {
      setSort(1)
    }
    else if (sort === 1) {
      setSort(2)
    }
    else if (sort === 2) {
      setSort(0)
    }
  }
  let buttonName = "None"
  if (sort === 0) {
    buttonName = "None"
  }
  else if (sort === 1) {
    buttonName = "Ascending"
  }
  else if (sort === 2) {
    buttonName = "Descending"
  }


  return (
    <button onClick={handleSortClick}>
      {buttonName}
    </button>
  );
}

function TableHeader() {

  return (
    <div className="table-row">
      <div className="table-cell">Name <SortButton /></div>
      <div className="table-cell">Number <SortButton /></div>
      <div className="table-cell">Platform <SortButton /></div>
      <div className="table-cell">Date <SortButton /></div>
    </div>
  );

}
function TableComponent({ number = 0, name = "n/a", platform = "n/a", date = "n/a" }) {
  return (
    <div className="table-row">
      <div className="table-cell">{name}</div>
      <div className="table-cell">{number}</div>
      <div className="table-cell">{platform}</div>
      <div className="table-cell">{date}</div>
    </div>
  );
}


function HomeContainer() {
  return (
    <div className='container'>
      <h1>Home</h1>
    </div>
  )
}

function TableContainer() {
  let components = []
  for (let i = 1; i < 100; i++) {
    components.push(<TableComponent />)
  }


  return (
    <div className="container">
      <ul className='table-list'>
        <TableHeader />
        {components.map((component, index) =>
          <li key={index}>
            {component}
          </li>
        )}
      </ul>

    </div>
  );
}

function ChartContainer() {
  return (
    <div className='container'>
      <h1>Charts</h1>
    </div>
  )
}

function DockerContainer() {
  const commands = {
    whoami: "wshinkle",
    cd: (directory) => `changed path to ${directory}`
  };
  let components = []
  for (let i = 1; i < 10; i++) {
    components.push(<TableComponent />)
  }
  return (
    <div className='parent-container'>
      <div className='container' style={{ width: '50%' }}>
        <ul className='table-list'>
          <TableHeader />
          {components.map((component, index) =>
            <li key={index}>
              {component}
            </li>
          )}
        </ul>
      </div>

      <div className='container' style={{ width: '50%' }}>
        <ReactTerminal
          commands={commands}
          style={{ width: "100%" }}
          showControlButtons={false}
        />
      </div>
    </div>


  )
}




function App() {
  const [activeTab, setActiveTab] = useState('home');
  let content = <HomeContainer />
  if (activeTab === 'table') {
    content = <TableContainer />
  }
  else if (activeTab === 'graph') {
    content = <ChartContainer />
  }
  else if (activeTab === 'containers') {
    content = <DockerContainer />
  }
  else if (activeTab === 'home') {
    content = <HomeContainer />
  }
  return (

    <div className="App">
      <div class="topnav">
        <a className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Home</a>
        <a className={activeTab === 'table' ? 'active' : ''} onClick={() => setActiveTab('table')}>Table</a>
        <a className={activeTab === 'graph' ? 'active' : ''} onClick={() => setActiveTab('graph')}>Graph</a>
        <a className={activeTab === 'containers' ? 'active' : ''} onClick={() => setActiveTab('containers')}>Docker Containers</a>
      </div>

      {content}


    </div>
  );
}

export default App;
