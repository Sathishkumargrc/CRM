import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import images from '../constants/images';
import {SIZES, COLORS} from '../constants/themes';
import icons from '../constants/icons';
import Helper from '../constants/Helper';
import {LOGIN, SALT} from '../constants/API_constants';
import md5 from 'md5';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEV_ID, IS_LOGGED_IN, TRUE, USER_DETAILS} from '../constants/Constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoaderModal from '../components/LoaderModal';
import { useDispatch } from 'react-redux';
import { setUserID } from '../redux/Slice/User';

const Login = ({navigation}) => {
  const dispatch =useDispatch()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [seePassword, setSeePassword] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const loginValidation = () => {
    // console.log("email",email)
    if (username == '' && password == '') {
      Alert.alert('Please enter your credentials!');
    } else if(username != '' && password == ''){
      Alert.alert('Please enter your correct password!')
    }else if(username == '' && password != ''){
      Alert.alert('Please enter your correct username!')
    }else if (!Helper.isValidPassword(password)) {
      Alert.alert('Please enter your valid credentials!');
    } else {
      callLoginApi();
    }
  };

  const storeData = async (value, userDetails) => {
    
    try {
      await AsyncStorage.setItem(IS_LOGGED_IN, TRUE);
      await AsyncStorage.setItem(DEV_ID, value);

      const jsonValue = JSON.stringify(userDetails); // for multiple object storage
      await AsyncStorage.setItem(USER_DETAILS, jsonValue);

      navigation.replace('Landing_bottomTab');
    } catch (e) {
      // saving error
    } 
  };

  // const idStore = async storeddata => {
  //   try {
  //     dispatch(setUserID(storeddata));
  //     await AsyncStorage.setItem('@store', storeddata);
  //     console.log('store value is', storeddata);
  //   } catch (e) {
  //     alert('failed to save data');
  //   }

  // }

  const callLoginApi = () => {
    setIsLoading(true)
    let authToken = md5(SALT + username + password);
    
    axios
      .post(LOGIN, {
        username: username,
        password: password,
        auth_token: authToken,
      })
      .then(function (response) {
        // console.log(response.data);
        setIsLoading(false)
        var res = response.data;
        if (res.success) {
          var id = response.data.parameters.id;
          dispatch(setUserID(id));
          storeData(id, response.data.parameters);
          

        } else {
          Alert.alert(res.message);
        }
      })
      .catch(function (error) {
        setIsLoading(false)
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={style.container}>
      <LoaderModal modalVisible = {isLoading} />
      <ScrollView style={{width: SIZES.width, height: SIZES.height}}>
        {/* Techno tackle logo */}
        <View style={style.imagebg}>
          <Image source={images.TT_logo_splash} style={style.image} />
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={style.txt}>TECHNO TACKLE</Text>
          <Text style={style.txt}>SOFTWARE SOLUTIONS</Text>
        </View>
        {/* Login BG Image */}
        <View style={style.imagebg2}>
          <Image
            source={images.Login_bg}
            style={style.image2}
            resizeMode="contain"
          />
        </View>
        {/* Email section */}
        <View style={style.emailBox}>
          <Image source={icons.Profile} style={style.image3} resizeMode = 'contain' />
          <TextInput
            placeholder="Username"
            placeholderTextColor= {COLORS.blackTextColor}
            onChangeText={text => setUsername(text)}
            style={{width: '90%', marginLeft: 6, top: 3, color: COLORS.blackTextColor}}
            maxLength = {25}
          />
        </View>

        {/* Password section */}
        <View style={style.passwordBox}>
          <Image source={icons.Lock} style={style.image4} resizeMode = 'contain' />
          <TextInput
            placeholder="Password"
            placeholderTextColor= {COLORS.blackTextColor}
            style={{width: '73%', marginLeft: 7, top: 3, color: COLORS.blackTextColor}}
            secureTextEntry={seePassword}
            value={password}
            onChangeText={text => setPassword(text)}
            maxLength = {25}
          />
          <TouchableOpacity onPress={() => setSeePassword(!seePassword)}>
            <MaterialCommunityIcons
              name= {seePassword ? "eye-off-outline" : "eye-outline" }
              style={style.eyeIcon}
              size={20}
            />
          </TouchableOpacity>
        </View>
        {/* Login Botton */}
        <TouchableOpacity style={style.btn} onPress={() => loginValidation()}>
          <Text style={style.login}>Login</Text>
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
    justifyContent: 'center',
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
  imagebg2: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image2: {
    width: '80%',
    height: 350,
  },
  emailBox: {
    width: '80%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.pure,
    borderRadius: 30,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  image3: {
    width: '10%',
    height: 25,
    tintColor: COLORS.pure,
  },
  passwordBox: {
    width: '80%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: COLORS.pure,
    borderRadius: 30,
    paddingHorizontal: 5,
    marginVertical: 20,
  },
  image4: {
    width: '10%',
    height: 25,
    tintColor: COLORS.pure,
  },
  btn: {
    width: '80%',
    height: 45,
    backgroundColor: COLORS.pure,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    marginVertical: 20,
    alignSelf: 'center',
  },
  login: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
  eyeIcon: {
    top: 3,
    marginLeft: 10,
    color: COLORS.blackTextColor
  },
});

export default Login;
