import './App.css';
import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown, faChevronRight, faChevronLeft, faArrowRight, faCaretRight, faCaretDown, faPlay, faStop, faTrash, } from '@fortawesome/free-solid-svg-icons';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
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
  const [search, setSearch] = useState('None');
  const [sort, setSort] = useState('DESC');
  const [column, setColumn] = useState('cve_id');
  const [components, setComponents] = useState([]);

  function handleEntriesChange(event) {
    setEntries(event.target.value);
  }
  function submitSearch() {
    let searchValue = document.getElementById("search").value;
    console.log(searchValue);
    setSearch(searchValue);
  }


  useEffect(() => {
    fetch(`http://localhost:5000/getrange?lower_bound=${(entries * (page - 1) + 1) - 1}&upper_bound=${(entries * page) - 1}&sort=${sort}&filter=${search}&column=${column}`)
      .then(response => response.json())
      .then(data => {
        let newComponents = [];
        for (let i = 0; i < data.length; i++) {
          newComponents.push(
            <TableComponent
              ID={data[i][0]}
              title={data[i][1]}
              description={data[i][2]}
              date={data[i][9].substring(0, 10)}
            />
          );
        }
        setComponents(newComponents);

      })
      .catch(error => console.error('Error:', error));
  }, [entries, page, search, sort, column]);

  return (
    <div>
      <div className='menuBar'>
        <select id="entries" onChange={handleEntriesChange} defaultValue={25}>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <PageTurner entries={entries} numPages={1000} page={page} setPage={setPage} />
        <div>
          <input className='search-bar' type="text" id="search" name="search" placeholder="Search.." />
          <FontAwesomeIcon icon={faArrowRight} style={{ color: '#fffff' }} onClick={submitSearch} />
        </div>

      </div>
      <div className="container">
        <ul className='table-list'>
          <TableHeader
            columns={["ID", "Title", "Description", "Upload Date"]}
            setSort={setSort}
            sort={sort}

          />
          {components.map((component, index) =>
            <li key={index}>
              {component}
            </li>
          )}
        </ul>
        <PageTurner entries={entries} numPages={1000} page={page} setPage={setPage} />
      </div>
    </div>
  );
}

function SortButton({ setSort, sort }) {

  function handleSortClick() {
    if (sort === 'DESC') {
      setSort('ASC');
    } else {
      setSort('DESC');
    }
  }

  let icon = faSort;
  if (sort === 'DESC') {
    icon = faSortDown;
  } else if (sort === 'ASC') {
    icon = faSortUp;

  }

  return (
    <FontAwesomeIcon icon={icon} onClick={handleSortClick} />
  );
}

function TableHeader({ columns = ["Name", "Number", "Platform", "Date"], setSort, sort }) {
  return (
    <div className="row-container" style={{ margin: '5px' }}>
      <div className="table-row table-header">
        {columns.map((column, index) => (
          <div key={index} className={`table-cell ${index === 0 ? 'table-cell-outer-left' : ''} ${index === columns.length - 1 ? 'table-cell-outer-right' : ''}`}>
            {column}
            {index === 0 && <SortButton setSort={setSort} sort={sort} />}
          </div>
        ))}
      </div>
    </div>
  );

}

function TableComponent({ title = "n/a", ID = "n/a", description = "n/a", date = "n/a" }) {

  const [open, setOpen] = useState(false);
  let icon = faCaretRight;
  open ? icon = faCaretDown : icon = faCaretRight;


  return (
    <div className="row-container">
      <div className="table-row">
        <div className="table-cell table-cell-outer-left" style={{ display: 'flex', alignContent: 'center' }}>
          <FontAwesomeIcon icon={icon} className='dropdown' onClick={() => setOpen(!open)} />
          {ID}</div>
        <div className="table-cell cve-title">{title}</div>
        <div className="table-cell cell-description">
          {description}
        </div>
        <div className="table-cell table-cell-outer-right">{date}</div>
      </div>
      {open && (
        <div className="dropdown-area">
          <div className='cve-dropdown-area'>
            ID: {ID}
            <br />
            Title: {title}
            <br />
            Date: {date}
            <br />
            <br />
            Description: {description}
          </div>
        </div>
      )}
    </div>
  );
}

function PageTurner({ entries, numPages, page, setPage }) {
  return (
    <div style={{ width: '150px' }}>
      <div
        onClick={() => page !== 1 && setPage(page - 1)}
        style={{ padding: '10px', display: 'inline-block' }}
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          style={{ color: page === 1 ? '#586671' : '#5d829f' }}
        />
      </div>
      <label className='page-turner' style={{ userSelect: 'none' }}>{entries * (page - 1) + 1} - {entries * page}</label>
      <div
        onClick={() => page !== numPages && setPage(page + 1)}
        style={{ padding: '10px', display: 'inline-block' }}
      >
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ color: page === numPages ? '#586671' : '#5d829f' }}
        />
      </div>
    </div>
  );
};



function ChartContainer() {
  return (
    <div>
      <div className='menuBar'>
      </div>
      <div className='parent-container'>
        <div className='container' style={{ width: '50%' }}>
          <Chart type={'last_5_bs_graph'} />
          <Chart type={'num_cves_by_year'} />
        </div>

        <div className='container' style={{ width: '50%' }}>

          <Chart type={'avg_base_by_year'} />
          <Chart type={'base_score_10_by_year'} />

        </div>
        <div className='container' style={{ width: '50%' }}>

          <Chart type={'complex_by_year'} />
          <Chart type={'availability_by_year'} />

        </div>


      </div>
    </div>
  )
}

function Chart({ type }) {
  const [chartData, setChartData] = useState(null);

  



  useEffect(() => {
    // Try to get the data from localStorage first
    const cachedData = localStorage.getItem(type);

    if (cachedData) {
      setChartData(JSON.parse(cachedData));
    } else {
      // If the data is not in localStorage, fetch it
      fetch(`http://localhost:5000/${type}`)
        .then(response => response.json())
        .then(data => {
          const labels = data.map(item => item[0]);
          const dataset = data.map(item => item[1]);

          const newChartData = {
            labels: labels,
            datasets: [{
              label: type,
              data: dataset,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          };

          setChartData(newChartData);

          // Save the data to localStorage for future use
          localStorage.setItem(type, JSON.stringify(newChartData));
        })
        .catch(error => console.error('Error:', error));
    }
  }, [type]);

  if (!chartData) {
    return null;
  }

  return (
    <div style={{ width: '50%', height: '50%' }}>
      <Line data={chartData} />
    </div>
  );
}




function DockerContainer() {
  const [code, setCode] = React.useState(
    `FROM <base_image>
    
# Set the working directory
WORKDIR /app
    
# Copy the application files to the container
COPY . .
    
# Install dependencies (if any)
RUN <command_to_install_dependencies>
    
# Expose the necessary ports
EXPOSE <port_number>
    
# Define the command to run the application
CMD ["<command_to_run_application>"]`
  );
  const [components, setComponents] = useState([]);
  const [refresh, setRefresh] = useState(true);
  useEffect(() => {
    fetch(`http://localhost:5000/containers`)
      .then(response => response.json())
      .then(data => {
        let newComponents = [];
        for (let i = 0; i < data.length; i++) {
          newComponents.push(
            <DockerComponent
              id={data[i][0]}
              name={data[i][1]}
              status={data[i][2]}
              image={data[i][3]}
              setRefresh={setRefresh}
            />
          );
        }
        setComponents(newComponents);

      })
      .catch(error => console.error('Error:', error));
  }, [refresh]);
  return (

    <div>
      <DockerPopup
        setRefresh={setRefresh} />

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
            textareaId='code'
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
          <FilePopup />


        </div>
      </div>
    </div>



  )
}

function FilePopup() {


  function addFile() {
    let dockerFile = document.getElementById("code").value;
    let dockerFileName = document.getElementById("dockerfile").value;
    console.log(dockerFile);
    let data = {
      dockerFileName: dockerFileName,
      dockerFile: dockerFile,
    }



    fetch(`http://localhost:5000/dockerfile/${dockerFileName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response)
      .then(data => {
        console.log('Success:', data);

      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }

  return (
    <div className='menuBar'>
      <Popup trigger={<button>Submit</button>} className='docker-popup' modal>
        <div className='modal'>
          <h1>Create New Dockerfile</h1>
          <label>Dockerfile Name:</label>
          <br />
          <input id='dockerfile' placeholder='Name of Dockerfile' />
          <br />
          <button onClick={addFile}>Submit</button>


        </div>

      </Popup>


    </div>
  )
};

function DockerPopup({ setRefresh }) {

  function addContainer() {
    let containerName = document.getElementById("containerName").value;
    let image = document.getElementById("image").value;
    let cveId = document.getElementById("cveId").value;

    let data = {
      container_id: containerName,
      cve_id: cveId,
      status: 'online',
      image: image,
    }


    fetch(`http://localhost:5000/containers_modify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response)
      .then(data => {
        console.log('Success:', data);
        setRefresh(prevRefresh => !prevRefresh); // Trigger a re-render of DockerContainer

      })
      .catch((error) => {
        console.error('Error:', error);
      });


  }

  return (
    <div className='menuBar'>
      <Popup trigger={<button>Create New Container</button>} className='docker-popup' modal>
        <div className='modal'>
          <h1>Create Docker Container</h1>
          <label>Container ID:</label>
          <br />
          <input id='containerName' placeholder='Number for something' />
          <br />
          <label>Container Name:</label>
          <br />
          <input id='cveId' placeholder='Name of Container' />
          <br />
          <label >Image: </label>
          <br />
          <input id='image' placeholder='DockerHub Image or Dockerfile' />
          <br />
          <label>
            Persistent Storage:
            <input type='checkbox' id='persistentStorage' />
          </label>
          <br />
          <button onClick={addContainer}>Submit</button>


        </div>

      </Popup>


    </div>
  );
};

function DockerComponent({ id = 0, name = "n/a", status = "n/a", image = "n/a", setRefresh }) {
  const [open, setOpen] = useState(false);
  const [contStatus, setContStatus] = useState(status); // Used to change the color of the start/stop buttons
  let icon = faCaretRight;
  open ? icon = faCaretDown : icon = faCaretRight;
  status === 'online' ? status = <span style={{ color: 'green' }}>{status}</span> : status = <span style={{ color: 'red' }}>{status}</span>;

  function handleStartClick() {
    fetch(`http://localhost:5000/containers_enable/${name}`)
      .then(response => response)
      .then(data => {
        console.log('Success:', data);
        setContStatus('online');
        setRefresh(prevRefresh => !prevRefresh); // Trigger a re-render of DockerContainer
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function handleStopClick() {
    fetch(`http://localhost:5000/containers_disable/${name}`)
      .then(response => response)
      .then(data => {
        console.log('Success:', data);
        setContStatus('offline');
        setRefresh(prevRefresh => !prevRefresh); // Trigger a re-render of DockerContainer
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function remove() {
    fetch(`http://localhost:5000/containers_delete/${name}`)
      .then(response => response)
      .then(data => {
        console.log('Success:', data);
        setRefresh(prevRefresh => !prevRefresh); // Trigger a re-render of DockerContainer
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <div className='row-container'>
      <div className="table-row">
        <div className="table-cell table-cell-outer-left" style={{ display: 'flex', alignContent: 'center' }}>
          <FontAwesomeIcon icon={icon} className='dropdown' onClick={() => setOpen(!open)} />
          {id}</div>

        <div className="table-cell">{name}</div>
        <div className="table-cell">{status}</div>
        <div className="table-cell table-cell-outer-right">{image}</div>

      </div>
      {open && (
        <div className="dropdown-area">
          <div className='cve-dropdown-area' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <span>ID: {id}</span>
              <br />
              <span style={{ fontSize: '20px' }}>Name: {name}</span>
              <br />
              <span style={{ fontSize: '20px' }}>Status: {status}</span>
              <br />
              <span style={{ fontSize: '20px' }}>Image: {image}</span>
            </div>
            <div className='docker-controls' style={{ textAlign: 'right' }}>
              <div>
                <FontAwesomeIcon icon={faPlay} className='docker-buttons' onClick={handleStartClick} style={{ color: `${contStatus === 'online' ? 'grey' : 'lightgreen'}` }} />
                <FontAwesomeIcon icon={faStop} className='docker-buttons' onClick={handleStopClick} style={{ color: `${contStatus === 'online' ? 'red' : 'grey'}` }} />
                <FontAwesomeIcon icon={faTrash} className='docker-buttons' onClick={remove} style={{ color: 'grey' }} />
              </div>
              <div style={{ fontSize: '14px', color: 'white' }}>
                Run `docker exec -it {name} bash` to access the container's shell
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

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

