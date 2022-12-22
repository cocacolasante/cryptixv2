import './App.css';
import Navbar from './routes/Navbar';
import CreateShow from './routes/CreateShow';
import ViewShows from './routes/ViewShows';

function App() {
  return (
    <div className="App">
      <Navbar />
      <CreateShow />
      <ViewShows />
    </div>
  );
}

export default App;
