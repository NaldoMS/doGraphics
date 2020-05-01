import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter} from "react-router-dom";
import './App.css';
import './index.css';
import 'react-vis/dist/style.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(<BrowserRouter basename={process.env.PUBLIC_URL}><App /></BrowserRouter>, document.getElementById('root'));
