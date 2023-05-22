import React from 'react';
import {View, Image} from 'react-native';
import {COLORS} from '../constants';

const Tabs = ({focused, icons}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: focused ? 3 : 0,
        borderColor: focused ? COLORS.pure : COLORS.black,
      }}>
      <Image
        source={icons}
        resizeMode="contain"
        style={{
          width: 30,
          height: 30,
          marginVertical: 8,
          tintColor: focused ? COLORS.pure : COLORS.black,
        }}
      />
    </View>
  );
};

export default Tabs;
