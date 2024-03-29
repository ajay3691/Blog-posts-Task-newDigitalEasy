import React, { createContext, useState } from 'react';

import Navbar from './Navabr/Navbar';

import Register from './authComponents/Register';
import Login from'./authComponents/Login'
import UserDashboard from './authComponents/UserDashboard';
import AdminDashboard from './authComponents/AdminDashboard';
import Myprofile from './authComponents/Myprofile'; 
import CreatePost from './postComponents/Crete';
import UpdatePost from './postComponents/Update';
import CreatePostU from './postComponents/CreteU';
import UpdatePostU from './postComponents/UpdateU';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
export const store = createContext();

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <div>
      <store.Provider value={[token, setToken]}>
        <Router>
          <Navbar />
          <Routes>
             <Route path="/register" element={<Register />} /> 
             <Route path="/login" element={<Login />} /> 
             <Route path="/myprofile" element={<Myprofile />} /> 
             <Route path="/userDashboard" element={<UserDashboard />} /> 
             <Route path="/adminDashboard" element={<AdminDashboard />} /> 
             <Route path="/createpost" element={<CreatePost />} /> 
             <Route path="/createpostu" element={<CreatePostU />} /> 
             <Route path="/updatepost/:postId" element={<UpdatePost />} />
             <Route path="/updatepostu/:postId" element={<UpdatePostU />} />
          
          </Routes>
        </Router>
      </store.Provider>

    </div>
  );
};

export default App;