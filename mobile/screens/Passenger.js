import React, { Component } from 'react';
import {Text, View, StyleSheet, Platform, TextInput, TouchableHighlight,Keyboard, TouchableOpacity,ActivityIndicator} from 'react-native';
import {enableLatestRenderer} from 'react-native-maps';
import MapView, { Polyline,Marker,PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import _ from 'lodash'
import  PolyLine  from '@mapbox/polyline';
import apiKey from '../google_api_key';
import socketIO from 'socket.io-client'
import BottomButton from "../components/BottomButton";


enableLatestRenderer();

class Passenger extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: "",
      latitude: 0,
      longitude: 0,
      destination: "",
      predictions: [],
      pointCoords: [],
      routeResponse: {},
      lookingForDriver: false,
      buttonText: "Find Driver"
    }
    this.onChangeDestinationDebounced = _.debounce(this.onChangeDestination)
  }

  componentDidMount() {
    // Get current location and set initial region to this
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        })

        this.getRouteDirections()
      
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true , maximumAge: 2000, timeout: 20000}
    ) 

  }

  async getRouteDirections(placeId,destinationName) {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?destination=Udupi&origin=Bengaluru&key=AIzaSyB5GTxVix5FGyEsO1Juv9D15k35x3ZKgMU`)
      console.log(placeId)
      const json = await response.json()
      console.log(json)
      const points = PolyLine.decode(json.routes[0].overview_polyline.points)
      const pointCoords = points.map(point => {
        return { latitude: point[0], longitude: point[1] }
      })

      this.setState({
        pointCoords,
        predictions: [],
        destination: destinationName,
        routeResponse: json

      })

      Keyboard.dismiss()
      this.map.fitToCoordinates(pointCoords)

    } catch (err) {
      console.error(err)
    }
  }

  async onChangeDestination(destination) {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000`
    try {
      const result = await fetch(apiUrl)
      const json = await result.json()
      this.setState({
        predictions: json.predictions
      })
    } catch (err) {
      console.error(err)
    }
  } 

  async requestDriver() {
    this.setState({ lookingForDriver: true })
    const socket = socketIO.connect("http://10.200.158.242:3000")

    socket.on("connect", () => {
        console.log("client connected")
        // Request a taxi
        socket.emit("taxiRequest", this.state.routeResponse)
    })

    socket.on("driverLocation", (driverLocation) => {
        this.setState({ lookingForDriver: false })
    })
  }

  render() {
    let marker = null
    let driverButton = null
    if(this.state.pointCoords.length > 1) {
      marker = (
        <Marker coordinate={this.state.pointCoords[this.state.pointCoords.length - 1]}/>
      )

      driverButton = (
        <TouchableOpacity onPress={() => this.requestDriver()} style={styles.bottomButton}>
            <View>
                <Text style={styles.bottomButtonText}>{this.state.buttonText}</Text>
                {this.state.lookingForDriver === true ? (
                    <ActivityIndicator animating={this.state.lookingForDriver} size="large"/>
                ): null}
            </View>
        </TouchableOpacity>
      )
    }

    const predictions = this.state.predictions.map(prediction => (
      <TouchableHighlight onPress={() => this.getRouteDirections(prediction.place_id, prediction.description)} key={prediction.place_id}>
        <View>
          <Text style={styles.suggestions} key={prediction.place_id}>{prediction.description}</Text>
        </View>
      </TouchableHighlight>
    ))
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <MapView
        ref={map => {
          this.map = map
        }}
        provider={PROVIDER_GOOGLE} 
        style={styles.map}
        region={{
          latitude: 12.9716,
          longitude: 77.5946,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsUserLocation={true}
      >
        <Polyline
          coordinates={this.state.pointCoords}
          stokeWidth={6}
          strokeColor="red"
        />
        {marker}
      </MapView>
     <TextInput 
      placeholder='Enter destination...'
      style={styles.destinationInput}
      value={this.state.destination}
      clearButtonMode='always'
      onChangeText={destination => {
        this.setState({ destination, pointCoords: [] })
        this.onChangeDestinationDebounced(destination)
      }}
     />
     {predictions}
     {driverButton}
    </View>
    );
  }
}

const styles = StyleSheet.create({
    bottomButton: {
        backgroundColor: "black",
        marginTop: "auto",
        margin: 20,
        padding: 15,
        paddingLeft: 30,
        paddingRight: 30,
        alignSelf: "center"
    },
    bottomButtonText: {
        color: "white"
    },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  destinationInput: {
    height: 40,
    width: 400,
    borderWidth: 0.5,
    marginBottom: 300,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    backgroundColor: "white"
  },
  suggestions: {
    backgroundColor: "white",
    padding: 5,
    fontSize: 18,
    borderWidth: 0.5,
    marginLeft: 5,
    marginRight: 5,
    height: 40,
    width: 400
  }
 });

export default Passenger;