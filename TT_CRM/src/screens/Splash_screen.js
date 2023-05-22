import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import { useDispatch } from 'react-redux';
import {COLORS, FONTS, images, SIZES} from '../constants';
import {IS_LOGGED_IN} from '../constants/Constant';
import { setUserID } from '../redux/Slice/User';

const Splash_screen = ({navigation}) => {
   const dispatch = useDispatch();
  // Splash screen timeout condition based
  setTimeout(() => {
    AsyncStorage.getItem(IS_LOGGED_IN).then(value => {
      // console.log(value);
      if (value) {
        dispatch(setUserID());
        navigation.replace('Landing_bottomTab');
      } else {
        navigation.replace('Auth');
      }
    });
  }, 2000);

  return (
    <View style={style.container}>

      <View style={style.bg}>
        {/* Company Logo */}
        <Image
          source={images.TT_logo_splash}
          style={style.image}
          resizeMode="contain"
        />
        {/* Company Name */}
        <Text style={FONTS.company_name}>TECHNO TACKLE</Text>
        <Text style={FONTS.company_name}>SOFTWARE SOLUTIONS</Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: SIZES.width,
    height: SIZES.height,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: 220,
    height: 220,
    top: -25,
  },
});

export default Splash_screen;
