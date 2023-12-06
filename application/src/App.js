import './App.css';
import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { faker } from '@faker-js/faker';
import Swal from 'sweetalert2';
import Icon from '@mdi/react'
import { mdiSortDescending, mdiSortAscending } from '@mdi/js'
import withReactContent from 'sweetalert2-react-content';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another
import logo from './imgs/CVEDatabaseLogo.png';
import biglogo from './imgs/CVEDatabaseLogoBig.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MySwal = withReactContent(Swal);



function Chart() {
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const [data, setData] = useState({
    labels: labels,
    datasets: [{
      label: faker.word.words(1),
      data: labels.map(() => faker.number.float({ min: 0, max: 100 })),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  });

  return (
    <div style={{ width: '50%', height: '50%' }}>
      <Line
        data={data}

      />
    </div>
  );
}




function SortButton() {
  const [sort, setSort] = useState(0);
  function handleSortClick() {
    console.log(sort)
    if (sort === 0) {
      setSort(1)
    }
    else if (sort === 1) {
      setSort(0)
    }

  }
  let icon = mdiSortAscending
  if (sort === 0) {
    icon = mdiSortAscending
  }
  else if (sort === 1) {
    icon = mdiSortDescending

  }
  return (
    <button onClick={handleSortClick} >
      <Icon path={icon} size={0.85} />
    </button>
  );
}

function TableHeader({ columns = ["Name", "Number", "Platform", "Date"] }) {
  return (
    <div className="table-row">
      {columns.map((column, index) => (
        <div key={index} className="table-cell">
          {column} <SortButton />
        </div>
      ))}
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
      <img src={biglogo} alt='logo' style={{ justifyContent: 'center' }} />
      <p style={{ textAlign: 'center' }}>Welcome to the CVE Database!</p>
      <div className='home-para'>
        <p style={{ textAlign: 'center', fontSize: '20px' }}>
          The purpose of this application is to make it easier to access and manipulate
          CVEs(Common Vulnerabilities and Exposures) while avoiding the slow and archaic website
          that <a href='https://cve.mitre.org/' target='_blank' style={{ color: '#5ac5fe' }}>The MITRE Corporation</a></p>
        <p style={{ textAlign: 'center', fontSize: '20px' }}>
          It also takes this idea a step further by allowing users to create charts based on the CVE data.
          Users are also able to create, maintain, and run Docker containers from within the application.
        </p>
      </div>

    </div>
  )
}



function TableContainer({ numEntries = 25 }) {
  const [entries, setEntries] = useState(numEntries);
  const [page, setPage] = useState(1);

  function handleEntriesChange(event) {
    setEntries(event.target.value);
  }

  let components = []
  for (let i = 1; i <= entries; i++) {
    components.push(<TableComponent />)
  }

  return (
    <div>
      <div className='menuBar'>
        <select id="entries" onChange={handleEntriesChange} defaultValue={25}>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <PageTurner entries={entries} numPages={10} page={page} setPage={setPage} />
      </div>
      <div className="container">
        <ul className='table-list'>
          <TableHeader
            name="Name"
            number="Number"
            platform="Platform"
            date="Date"
          />
          {components.map((component, index) =>
            <li key={index}>
              {component}
            </li>
          )}
        </ul>
        <PageTurner entries={entries} numPages={10} page={page} setPage={setPage} />
      </div>
    </div>
  );
}


function PageTurner({ entries, numPages, page, setPage }) {
  return (
    <div>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous Page</button>
      <label>{entries * (page - 1) + 1} - {entries * page} </label>
      <button onClick={() => setPage(page + 1)} disabled={page === numPages}>Next Page</button>
    </div>
  );
};
function ChartModal() {
  return (
    <form>
      <label htmlFor="chartName">Chart Name:</label><br />
      <input type="text" id="chartName" name="chartName" /><br />

      <label htmlFor="chartType">Chart Type:</label><br />
      <select id="chartType" name="chartType">
        <option value="line">Line</option>
        <option value="bar">Bar</option>
        <option value="pie">Pie</option>
        {/* Add more options as needed */}
      </select><br />

      <input type="checkbox" id="displayLegend" name="displayLegend" />
      <label htmlFor="displayLegend">Display Legend</label><br />

    </form>
  );
}
function CallChartModal() {

  return (
    MySwal.fire({
      title: 'Create New Chart',
      html: ChartModal(),
      confirmButtonText: 'Submit',
      width: '20%',
    }
    )
  )
};


function ChartContainer() {
  return (
    <div>
      <div className='menuBar'>
        <button onClick={CallChartModal}>Add Graph</button>
      </div>
      <div className='parent-container'>
        <div className='container' style={{ width: '50%' }}>
          <Chart />
        </div>

        <div className='container' style={{ width: '50%' }}>

          <Chart />

        </div>
      </div>
    </div>
  )
}

function DockerModal() {
  return (
    <form>
      <label htmlFor="containerName">Container Name:</label><br />
      <input type="text" id="containerName" name="containerName" /><br />

      <label htmlFor="ubuntuVersion">Ubuntu Version:</label><br />
      <select id="ubuntuVersion" name="ubuntuVersion">
        <option value="20.04">Ubuntu 20.04</option>
        <option value="18.04">Ubuntu 18.04</option>
        <option value="16.04">Ubuntu 16.04</option>
        {/* Add more options as needed */}
      </select><br />

      <input type="checkbox" id="persistentStorage" name="persistentStorage" />
      <label htmlFor="persistentStorage">Persistent Storage</label><br />
    </form>
  );
}

function CallDockerModal() {

  return (
    MySwal.fire({
      title: 'Create Docker Container',
      html: DockerModal(),
      confirmButtonText: 'Submit',
      width: '20%',
    }
    )
  )
};

function DockerContainer() {
  const [code, setCode] = React.useState(
    `                              DOCKER COMPOSE.YAML FILE .OR. DOCKERFILE GOES HERE`
  );
  let components = []
  for (let i = 1; i < 10; i++) {
    components.push(<TableComponent />)
  }
  return (

    <div>
      <div className='menuBar'>
        <button onClick={CallDockerModal}>Add Container</button>
      </div>
      <div className='parent-container'>

        <div className='container' style={{ width: '50%' }}>
          <ul className='table-list'>
            <TableHeader
              columns={["ID", "Name", "Status", "Image"]}
            />
            {components.map((component, index) =>
              <li key={index}>
                {component}
              </li>
            )}
          </ul>
        </div>

        <div className='container' style={{ width: '50%' }}>

          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => highlight(code, languages.js)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 16,
              width: '100%',
              height: '100%',
            }}
          />


        </div>
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

      <div className="topnav">
        <a className={"home-tab"} onClick={() => setActiveTab('home')}>
          <img src={logo} alt='logo' width='75px' height='50px' style={{}} />
        </a>
        <a className={`other-tab ${activeTab === 'table' ? 'active' : ''}`} onClick={() => setActiveTab('table')}>Table</a>
        <a className={`other-tab ${activeTab === 'graph' ? 'active' : ''}`} onClick={() => setActiveTab('graph')}>Graph</a>
        <a className={`other-tab ${activeTab === 'containers' ? 'active' : ''}`} onClick={() => setActiveTab('containers')}>Docker Containers</a>
      </div>

      {content}


    </div>
  );
}

export default App;

