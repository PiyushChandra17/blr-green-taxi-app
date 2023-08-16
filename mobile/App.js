import React, { Component } from 'react';
import {StyleSheet,Button, View } from 'react-native';
import {enableLatestRenderer} from 'react-native-maps';
import Driver from './screens/Driver';
import Passenger from './screens/Passenger';
import Passenger1 from './screens/Passenger1';
import GenericContainer from './components/GenericContainer';
import Login from './screens/Login';
import DriverOrPassenger from './screens/DriverOrPassenger';

const DriverWithGenericContainer = GenericContainer(Driver)
const PassengerWithGenericContainer = GenericContainer(Passenger1)

enableLatestRenderer();

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDriver: false,
      isPassenger: false,
      token: ""
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeToken = this.handleChangeToken.bind(this)
  }

  handleChangeToken(token) {
    this.setState({ token })
  }

  handleChange(name, value) {
    this.setState({ [name]: value });
  }


  render() {
    if(this.state.token === "") {
      return <Login handleChangeToken={this.handleChangeToken}/>
    }

    if (this.state.isDriver) {
      return <DriverWithGenericContainer token={this.state.token}/>
    }

    if (this.state.isPassenger) {
      return <PassengerWithGenericContainer token={this.state.token}/>
    }

    return (
      <DriverOrPassenger handleChange={this.handleChange}/>
    );
  }
}

export default App;