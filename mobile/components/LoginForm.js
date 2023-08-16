import { Text, StyleSheet, View, TextInput, TouchableOpacity, Platform } from 'react-native'
import React, { Component } from 'react'

export default class LoginForm extends Component {
  render() {
    return (
      <View>
        <TextInput 
            style={styles.input}
            placeholder='your@email.com'
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            placeholderTextColor="#fff"
            value={this.props.email}
            onChangeText={email => this.props.handleChange("email",email)}
        />
        <TextInput 
            style={styles.input}
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry
            placeholder='password'
            placeholderTextColor="#fff"
            value={this.props.password}
            onChangeText={password => this.props.handleChange("password",password)}

        />
        <TouchableOpacity onPress={this.props.handleSignIn} style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.handleSignUp} style={styles.button}>
            <Text style={styles.buttonText}>Create account</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        backgroundColor: "#8793A6",
        color: "#FFF",
        marginBottom: 10
    },
    button: {
        backgroundColor: "#ABC837",
        paddingVertical: 20,
        marginVertical: 10
    },
    buttonText: {
        textAlign: "center",
        fontSize: 23,
        color: "#000",
        fontWeight: "200",
        fontFamily: Platform.OS === "android" ? "sans-serif-light" : undefined
    }
})