import './App.css';
import Navbar from './routes/Navbar';
import CreatePage from './routes/CreatePage';
import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Browse from './routes/Browse';
import ManageShows from './routes/ManageShows';
import Profile from './routes/Profile';


function App() {
  return (
    <Routes className="App">
      <Route path='/' element={ <Navbar />} >
        <Route index element={ <Home />} />
        <Route path='/browse/*' element={<Browse />} />
        <Route path='/manageshows' element={<ManageShows />} />
        <Route path='/createshow' element={<CreatePage />} />
        <Route path='/profile' element={<Profile />} />

    </Route>
      
      
    </Routes>
  );
}

export default App;
