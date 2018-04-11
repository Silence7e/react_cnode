import React, { Component } from 'react';
import axios from 'axios';

/* eslint-disable */
const getTopic = () => {
  axios.get('/api/topics').then((resp) => {
    console.log(resp);
  }).catch((err) => {
    console.log(err);
  });
};

const login = () => {
  axios.post('api/user/login', {
    accessToken: 'accessToken',
  }).then((resp) => {
    console.log(resp);
  }).catch((err) => {
    console.log(err);
  });
};

const markAll = () => {
  axios.post('/api/message/mark_all?needAccessToken=true').then((resp) => {
    console.log(resp);
  }).catch((err) => {
    console.log(err);
  });
};

export default class extends Component {
  componentDidMount() {
    // did mount
  }
  render() {
    return (
      <div>
        <button onClick={getTopic}>topics</button>
        <button onClick={login}>login</button>
        <button onClick={markAll}>markAll</button>
      </div>
    );
  }
}
/* eslint-ensable */
