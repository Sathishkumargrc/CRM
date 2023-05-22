import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const BackgroundColor = props => {
  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor="#01C2A5"
        // statuBarStyle = 'light-content'
      />
      <LinearGradient
        start={{x: 0.0, y: 0.02}}
        end={{x: 0.4, y: 0.9}}
        locations={[0, 0.5]}
        colors={['#01C2A5', '#fff']}
        style={style.container}>
        {props.children}
      </LinearGradient>
    </>
  );
};

export default BackgroundColor;

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
