import React, { useState } from 'react'
import './App.scss';
import BlogList from './Blog/BlogList';
import SingleBlog from './Blog/SingleBlog';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShowData from './Component/ShowData';
import BlogData from './Component/BlogData';
import LanguageDropdown from './Component/LanguageDropDown/LanguageDropdown';

function App() {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [language, setLanguage] = useState();

  return (
    <Router>
      <LanguageDropdown {...{language, setLanguage, dropDownOpen, setDropDownOpen}}/>
      <Routes>
        <Route path="/blogDetails/:id" element={<SingleBlog />} />
        <Route path="/blogList" element={<BlogList />} />
        <Route path="/" element={<BlogList />} />
        <Route path="/:id" element={<ShowData {...{ language, setLanguage}} />} />
        <Route path="/newblog/:id" element={<BlogData {...{ language, setLanguage}} />} />
      </Routes>
    </Router>
  );
}

export default App;
