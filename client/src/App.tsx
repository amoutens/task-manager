import './assets/style.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authorization } from './Components/Authorization'
import { Tasks } from './Components/Tasks';
import { Navbar } from './Components/NavBar';
import { Registration } from './Components/Registration';
import { AuthProvider, useAuth } from './Components/AuthProvider';
import { Home } from './Components/Home';
import { Profile } from './Components/Profile';

function App() {
  const PrivateRoute = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Tasks /> : <Home />;
  };
  return (
    <div>
      <AuthProvider>
      <Navbar></Navbar>
      <main className='main-app'>
      <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Authorization />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/" element={<PrivateRoute/>} />
        <Route path='/profile' element={<Profile />}/>
      </Routes>
      </Router>
      </main>
      </AuthProvider>
    </div>
   
  )
}

export default App
