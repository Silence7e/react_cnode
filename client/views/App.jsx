import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import AppBar from './layout/appBar';
import Routes from '../config/router';


export default class extends Component {
  componentDidMount() {
    // do something
  }

  render() {
    return [
      <AppBar key="appBar" />,
      <Routes key="routes" />,
    ];
  }
}
