
import './App.css'
import {BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';


import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={ <Home/> } />
            <Route path='/login' element={ <Login/> } />
            <Route path='/register' element={ <Register/> } />
            <Route path='/profile' element={ <Profile/> } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
