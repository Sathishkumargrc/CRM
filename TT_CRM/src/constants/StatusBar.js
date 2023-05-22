import {StyleSheet, View, StatusBar} from 'react-native';
import React from 'react';

const StatusBar = () => {
  return (
    <View style={style.container}>
      <StatusBar
        animated={true}
        backgroundColor="#01C2A5"
        barStyle={statusBarStyle}
        showHideTransition={statusBarTransition}
      />
    </View>
  );
};

export default StatusBar;

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
