import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  Alert,
  StyleSheet,
  Vibration,
} from 'react-native';
import validator from 'validator';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      emailInvalid: false,
      passwordInvalid: false,
      success: false,
    };
  }
  handFirstNameInput = (first_name) => {
    this.setState({ first_name: first_name });
  };
  handLastNameInput = (last_name) => {
    this.setState({ last_name: last_name });
  };

  handEmailInput = (email) => {
    this.setState({ email: email, emailInvalid: !validator.isEmail(email) });
  };

  handPasswordInput = (pass) => {
    this.setState({
      password: pass,
      passwordInvalid: !validator.isStrongPassword(pass),
    });
  };

  signUp = () => {
    console.log(this.state);
    if (
      validator.isEmail(this.state.email) &&
      validator.isStrongPassword(this.state.password)
    ) {
      fetch(`${this.props.url}/api/1.0.0/user`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.email,
          password: this.state.password,
        }),
      }).then((response) => {
        console.log(response)
        if (response.status == 201) {
          this.setState({
            success: true,
            emailInvalid: !validator.isEmail(this.state.email),
            passwordInvalid: !validator.isStrongPassword(this.state.password),
          });
          this.props.navigation.navigate('Login');
        } else {
          Vibration.vibrate();
        }
      });
    } else {
      this.setState({
        emailInvalid: !validator.isEmail(this.state.email),
        passwordInvalid: !validator.isStrongPassword(this.state.password),
      });
      Vibration.vibrate();
    }
  };

  render() {
    return (
      <View style={{ padding: 50 }}>
        <TextInput
          style={styles.input}
          keyboardType={'text'}
          placeholder="first name"
          onChangeText={this.handFirstNameInput}
          value={this.state.first_name}
        />
        <TextInput
          style={styles.input}
          keyboardType={'text'}
          placeholder="last name"
          onChangeText={this.handLastNameInput}
          value={this.state.last_name}
        />
        <TextInput
          style={styles.input}
          keyboardType={'email-address'}
          placeholder="email..."
          onChangeText={this.handEmailInput}
          value={this.state.email}
        />
        {this.state.emailInvalid && (
          <Text style={{ color: 'red' }}> your email is inccorect</Text>
        )}

        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="password..."
          onChangeText={this.handPasswordInput}
          value={this.state.password}
        />
        {this.state.passwordInvalid && (
          <Text style={{ color: 'red' }}> your password is inccorect</Text>
        )}
        <Button
          onPress={this.signUp}
          title="Sign up"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        {this.state.success && (
          <Text style={{ color: 'green' }}> success login</Text>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  input: {
    borderTop: '1px solid black',
    padding: 10,
    margin: 5,
    backgroundColor: 'yellow',
  },
});

export default SignUp;
