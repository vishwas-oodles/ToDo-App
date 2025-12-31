import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import GradientBackground from '../components/GradientBackground'
import {Image} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';


const HomeScreen = ({ navigation }) => {
  return (
      
            <GradientBackground>
              <SafeAreaView style={styles.container}>
            
              <Text style={styles.title}>Welcome =) </Text>

              <Text style={styles.subtitle}>
                Hi there!{'\n'}
                We're here to help you organize your tasks.{'\n'}
                The choice is yours: Log in or create an account.
              </Text>

                <Image source={require('../assets/images/welcome.png')} 
                style={styles.logo} />


              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={styles.primaryText}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.secondaryText}>Log In</Text>
              </TouchableOpacity>
            
            </SafeAreaView>
            </GradientBackground>
        
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    
  },
  title: {
    fontSize: 32,
    color: '#000',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Inter_18pt-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 24,
  },
  logo: {
    width: 300,
     height: 300,
    resizeMode: 'contain',
    alignSelf: 'center',
     marginTop: 35,
  },
  primaryButton: {
    backgroundColor: '#3177c7ff',
    borderWidth: 3,
    borderColor: '#1e599cff',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 50,
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
    marginTop: 20,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#1e599cff',
    fontSize: 16,
    fontFamily: 'Inter_18pt-Bold',
  },
});

export default HomeScreen;
