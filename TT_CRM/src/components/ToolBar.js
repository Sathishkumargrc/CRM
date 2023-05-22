import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../constants';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ToolBar = props => {
  const navigation = useNavigation();

  return (
    <View style={style.top}>
      <TouchableOpacity
        style={{alignSelf: 'flex-start'}}
        onPress={() => navigation.goBack()}>
        {props.backBtn && (
          <MaterialIcons name="arrow-back" size={25} color="#ffffff" />
        )}
      </TouchableOpacity>
      <Text style={style.txt}>{props.title}</Text>
    </View>
  );
};

export default ToolBar;

const style = StyleSheet.create({
  top: {
    backgroundColor: COLORS.pure,
    flexDirection: 'row',
    padding: 14,
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
  },
  txt: {
    fontSize: 19,
    color: COLORS.white,
    marginLeft: 10,
    fontFamily: 'DMSans-Bold',
  },
});
