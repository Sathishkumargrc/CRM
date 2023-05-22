import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {COLORS} from '../constants';
import images from '../constants/images';

const Welcome_screen = ({navigation}) => {
  return (
    <SafeAreaView style={style.container}>
      <ScrollView>
      <View style={style.imagebg}>
        <Image source={images.TT_logo_splash} style={style.image} />
      </View>
      {/* Company Name */}
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={style.txt}>TECHNO TACKLE</Text>
        <Text style={style.txt}>SOFTWARE SOLUTIONS</Text>
      </View>
      <View>
        {/* Company Welcome Logo */}
        <Image
          source={images.Welocome_screen}
          style={style.image2}
          resizeMode="contain"
        />
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center', top: -40}}>
        {/* Text feild for Holiday */}
        <Text style={style.holiday}>Enjoy Your Holidays</Text>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center', top: -20}}>
        {/* Company Name */}
        <Text style={style.crm}>Techno Tackle Software Solutions CRM</Text>
      </View>

      {/* Botton for Login Page */}
      <TouchableOpacity
        style={style.btn}
        onPress={() => navigation.replace('Login')}>
        <View>
          <Text style={style.go}>Here to go!</Text>
        </View>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  imagebg: {
    alignItems: 'center',
  },
  image: {
    marginVertical: 20,
    width: 55,
    height: 47,
  },
  txt: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: 16,
  },
  image2: {
    marginVertical: 70,
  },
  holiday: {
    color: COLORS.black,
    fontSize: 25,
    fontWeight: 'bold',
  },
  crm: {
    color: COLORS.black,
    fontSize: 17,
    fontWeight: '300',
  },
  btn: {
    width: '95%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pure,
    alignSelf: 'center',
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    marginVertical: 15,
  },
  go: {
    fontSize: 17,
    color: COLORS.white,
    fontWeight: '400',
  },
});

export default Welcome_screen;
