import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { createUser } from '../database/db';
import GradientBackground from '../components/GradientBackground'


const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await createUser(username, password);
      Alert.alert('User created successfully', 'Please login now');
      navigation.navigate('Login');
    } catch (e) {
      Alert.alert('Username already exists');
    }
  };

  return (
    <GradientBackground>
    <View style={styles.container}>

        <Text style={styles.headtitle}>Welcome</Text>

      <Text style={styles.title}>SignUp to Create {'\n'} Account</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
                   style={styles.secondaryButton}
                   onPress={handleSignup}
                 >
                   <Text style={styles.secondaryText}>Sign Up</Text>
                 </TouchableOpacity>
      
                  <TouchableOpacity
                   style={styles.primaryButton}
                   onPress={() => navigation.navigate('Login')}
                 >
                   <Text style={styles.primaryText}>Already have an account? Log In</Text>
                 </TouchableOpacity>
    </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 42,
   fontFamily: 'Inter_18pt-Bold',
   fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 30,
    color: '#ffffffff',
  },
 headtitle: {
    fontSize: 40,
    fontFamily: 'Inter_18pt-Medium',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 100,
    color: '#ffffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#1e599cff',
    borderRadius: 30,
    paddingHorizontal: 18,
    height: 50,
    marginTop: 18,
    marginBottom: 5,
    textAlignVertical: 'center',
    backgroundColor: '#fff',
  },
  primaryButton: {
    backgroundColor: '#3177c7ff',
    borderWidth: 3,
    borderColor: '#1e599cff',
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 30,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontFamily: 'Inter_18pt-Bold',
    fontSize: 20,
  },
  secondaryButton: {
    borderWidth: 3,
    borderColor: '#3177c7ff',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 80,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#1e599cff',
    fontSize: 16,
    fontFamily: 'Inter_18pt-Bold',
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default SignupScreen;
