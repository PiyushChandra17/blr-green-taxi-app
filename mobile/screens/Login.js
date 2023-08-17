import { Text, StyleSheet, View, Platform,Alert,Image } from 'react-native'
import React, { Component } from 'react'
import LoginForm from '../components/LoginForm'
import axios from 'axios'
import baseURL from '../baseUrl'
axios.defaults.baseURL = baseURL

export default class Login extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            email: "",
            password: "",
            errorMessage: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSignIn = this.handleSignIn.bind(this)
        this.handleSignUp = this.handleSignUp.bind(this)
    }

    handleChange(name,value) {
        this.setState({
            [name]: value
        })
    }

    async handleSignIn() {
        try {
            const { email, password } = this.state
            const result = await axios.post("/auth/login", { email, password })
            this.props.handleChangeToken(result.data.token)
        } catch (error) {
            this.setState({ errorMessage: error.response.data.message })
            console.error(error)
        }
    }

    async handleSignUp() {
        try {
            const { email, password } = this.state
            await axios.post("/auth/signup", { email, password })
            this.handleSignIn()
        } catch (error) {
            this.setState({ errorMessage: error.response.data.message })
        }
    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>blr green taxi</Text>
        <LoginForm 
            email={this.state.email}
            password={this.state.password}
            handleChange={this.handleChange}
            handleSignIn={this.handleSignIn}
            handleSignUp={this.handleSignUp}
        />
        <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
        <Image 
            source={require("../images/green_car.png")}
            style={styles.logo}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#3A3743"
    },
    errorMessage: {
        marginHorizontal: 10,
        fontSize: 18,
        color: "#F5D7CC",
        fontWeight: "bold"
    },
    headerText: {
        fontSize: 44,
        color: "#C1D760",
        textAlign: "center",
        fontFamily: Platform.OS === "android" ? "sans-serif-light" : undefined,
        marginTop: 30,
        fontWeight: "200"
    },
    logo: {
       height: 300,
       width: 300,
       alignSelf: "center"
    }
})



