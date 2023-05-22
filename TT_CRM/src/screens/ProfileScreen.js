import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {COLORS, FONTS} from '../constants';
import {USER_DETAILS} from '../constants/Constant';
import icons from '../constants/icons';
import LoaderModal from '../components/LoaderModal';
import { useDispatch } from 'react-redux';
import { setUserID } from '../redux/Slice/User';

const ProfileScreen = ({navigation}) => {
  const [developer_name, setDeveloper_name] = useState('');
  const [designation, setDesignation] = useState('');
  const [user_id, setUser_id] = useState('');
  const [email_id, setEmail_id] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  const [isLoading, setIsLoading] = useState();

  const dispatch = useDispatch();


  const AlertShow = () => {
    Alert.alert(
      "Hold on",
      "Are you sure want to logout ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => Logout() }
      ]
    );

  }
  

  // Logout function and clear all the local details of the staff.
  const Logout = async () => {
    try {
      await AsyncStorage.clear();
      dispatch(setUserID(''));
      navigation.replace('Login');
    } catch (e) {
      // clear error
    }
    console.log('Done.');
  };

  // get details from user login details.
  const getData = () => {
    setIsLoading(true);
    try {
      AsyncStorage.getItem(USER_DETAILS).then(value => {
        json = JSON.parse(value);
        setIsLoading(false);
        setDeveloper_name(json.developer_name);
        setDesignation(json.designation);
        setUser_id(json.user_id);
        setEmail_id(json.email_id);
        setMobile(json.mobile);
        setAddress(json.address);
      });
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    
    <SafeAreaView style={style.container}>
      {/* Loader for open the screen */}
      <LoaderModal modalVisible={isLoading} />
      <View style={style.topPage}>
      </View>
      {/* Bottom page */}
      <View style={style.bottomPage}>
        {/* User Photo */}
        <View style={style.image}>
          <Image source={icons.User_photo} style={style.userPic} />
        </View>
        <View style={style.nameContainer}>
          {/* Staff name */}
          <Text style={[FONTS.profile_heading, {marginTop: 0}]}>
            {developer_name}
          </Text>
          {/* staff designation */}
          <Text style={[FONTS.profile_subheading, {marginTop: 3}]}>
            {designation}
          </Text>
        </View>
        <ScrollView style={style.content}>
            {/* Emp Number */}
            <Text style={FONTS.profile_heading}>Employee Number</Text>
            <Text style={FONTS.profile_subheading}>TT {user_id}</Text>

            {/* Emp Mail Id */}
            <Text style={FONTS.profile_heading}>Gmail Id</Text>
            <Text style={FONTS.profile_subheading}>{email_id}</Text>

            {/* Emp Contact Number */}
            <Text style={FONTS.profile_heading}>Contact Number</Text>
            <Text style={FONTS.profile_subheading}>{mobile}</Text>

            {/* Emp Address */}
            <Text style={FONTS.profile_heading}>Address</Text>
            <Text style={FONTS.profile_subheading}>{address}</Text>

            {/* Logout Botton */}
            <TouchableOpacity style={style.btn} onPress={() => AlertShow()}>
              <Text style={style.txt}>Log Out</Text>
            </TouchableOpacity>
        </ScrollView>
      </View>
      </SafeAreaView>
    
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  topPage: {
    flex: 1,
    backgroundColor: COLORS.pure,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
  },
  userPic: {
    width: 85,
    height: 85,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#019882',
    backgroundColor: COLORS.white,
  },
  bottomPage: {
    flex: 3.5,
    alignItems: 'center',
  },
  image: {
    top: -40,
  },
  nameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -30,
  },
  content: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    width: '70%',
  },
  txt: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: 'DMSans-Bold',
    textAlign: 'center',
    justifyContent: 'center'
  },
  btn : {
    height: 40,
    width: '40%',
    backgroundColor: COLORS.pure,
    borderRadius: 10,
    marginTop: 30,
    justifyContent: 'center'
  },
});

export default ProfileScreen;
