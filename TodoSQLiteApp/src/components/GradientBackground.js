import React from "react";
import {StyleSheet} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const GradientBackground = ({children}) => {
        return(
            <LinearGradient
                colors={['#FFF2E8', '#72b6ddff', '#B4DFFA', '#E6F4FF', '#FFFFFF']}
  locations={[0, 0, 0.50, 0.81, 0.94]}
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: 1 }}
            style={styles.container}>
                {children}
            </LinearGradient>
        );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default GradientBackground;