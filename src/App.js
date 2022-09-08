import logo from './logo.svg';
import './App.css';
import ReactBigCalendar from "./Component/ReactBigCalendar";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

import Nav from 'react-bootstrap/Nav';

// router, navigation
import {BrowserRouter as Router , Routes, Route, Link, useMatch, useParams} from "react-router-dom";

function App() {
  return (
    <>
    < ReactBigCalendar />
    </>
  );
}

export default App;
