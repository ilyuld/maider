import React from 'react';
import './main.css'
import Header from './header.js';
import Charts from './charts.js';
import { Maider } from '../core/maider.js';

function Main(props){

    return (
        <Maider>
            <Header />
            <Charts />
        </Maider>
    )
}

export default Main