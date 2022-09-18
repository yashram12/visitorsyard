import { useEffect, useState } from "react";
import Navbarcomp from "./components/Navbar";
import "./app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import jwt from "jsonwebtoken";
import "dotenv/config";
import About from "./components/About";
import Tours from "./components/Tours";
import Places from "./components/Places";
import Login from "./components/Login";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Place from "./components/places/Place";
import Tour from "./components/tours/Tour";
import Profile from "./components/Profile";
import Admin from "./components/Admin";
import My404Component from "./components/My404Component";
import Logincontext from "./contexts/Logincontext";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("pubtoken") !== null) {
      try{
        const decripted = jwt.verify(localStorage.getItem("pubtoken"), "secret");
        if (decripted.id) {
          if(decripted.user === 'vivek &')
            setAdmin(true)
          setLoggedIn(true);
        }
      }catch(e){
        setLoggedIn(false);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Logincontext.Provider value={{ loggedIn, setLoggedIn, setAdmin ,admin}}>
            <Navbarcomp />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/tour/:tid" element={<Tour />} />
              <Route path="/places" element={<Places />} />
              <Route path="/place/:pid" element={<Place />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              {admin && <Route path="/admin" element={<Admin />} />}
              <Route path="*" exact={true} element={<My404Component />} />
            </Routes>
            <Footer />
        </Logincontext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
