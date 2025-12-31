import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { loginUser } from '../database/db';
import { AuthContext } from '../context/AuthContext';
import GradientBackground from '../components/GradientBackground'


const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    const user = await loginUser(username, password);
    if (user) {
      login(user);
    } else {
      Alert.alert('Invalid credentials');
    }
  };

  return (
     <GradientBackground>
    <View style={styles.container}>

       <Text style={styles.headtitle}>Welcome Back</Text>

      <Text style={styles.title}>Login to Your {'\n'}Account  </Text>

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
             onPress={handleLogin}
           >
             <Text style={styles.secondaryText}>Log In</Text>
           </TouchableOpacity>

            <TouchableOpacity
             style={styles.primaryButton}
             onPress={() => navigation.navigate('Signup')}
           >
             <Text style={styles.primaryText}>Don't have an account? Sign Up</Text>
           </TouchableOpacity>
    </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

  },
  title: {
    fontSize: 45,
   fontFamily: 'Inter_18pt-Bold',
   fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 30,
    color: '#ffffffff',
  },
  headtitle: {
    fontSize: 40,
    fontFamily: 'Inter_18pt-Bold',
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

export default LoginScreen;
