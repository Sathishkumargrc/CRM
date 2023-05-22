import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import BackgroundColor from '../components/BackgroundColor';
import {COLORS, SIZES, FONTS} from '../constants/themes';
import LoaderModal from '../components/LoaderModal';
import icons from '../constants/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEV_ID, USER_DETAILS} from '../constants/Constant';
import {
  LEAVE_REQUEST,
  LIST_ALL_PROJECTS,
  SALT,
} from '../constants/API_constants';
import md5 from 'md5';
import axios from 'axios';
import LeaveDetailsBox from '../components/LeaveDetailsBox';
import Lottie from 'lottie-react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setProjects } from '../redux/Slice/User';
import PushNotification from 'react-native-push-notification';

const HomeScreen = () => {

   // Notification config
PushNotification.configure({
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    notification.finish(PushNotification.FetchResult.NoData);
  },
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

  },
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

  const Navigation = useNavigation();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [developer_name, setDeveloper_name] = useState();
  const [designation, setDesignation] = useState();

  const [leaveList, setLeaveList] = useState([]);

  const [role, setRole] = useState('');

  //User details get from async storage (dev_name, designation)
  const getData = () => {
    setIsLoading(true);
    try {
      AsyncStorage.getItem(USER_DETAILS).then(value => {
        json = JSON.parse(value);
        setIsLoading(false);
        setDeveloper_name(json.developer_name);
        setDesignation(json.designation);
        setRole(json.role);
        console.log(json);
      });
    } catch (e) {
      // error reading value
    }
  };

  //Get current MM YYYY leave using newDate and get a response from API
  const getLeaveData = (Month, Year) => {
    AsyncStorage.getItem(DEV_ID).then(DEV_ID => {
      const authToken = md5(SALT + DEV_ID);
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      // const month = moment(date).format("MM");
      // const year = moment(date).format("YYYY");

      console.log('filter', Month, Year);

      setIsLoading(true);
      axios
        .post(LEAVE_REQUEST, {
          developer_id: DEV_ID,
          auth_token: authToken,
          month: month,
          year: year,
        })
        .then(function (response) {
          setIsLoading(false);
          let res = response.data;
          dispatch(setProjects(res.parameters));
          setLeaveList(res.parameters);
          console.log(res);
        })
        .catch(function (error) {
          setIsLoading(false);
          console.log(error);
        });
    });
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      setLeaveList([]);
      getData();
      getLeaveData('', ''); //month nad year get from
    }
  }, [isFocused]); // before open the screen is empty.

  //main return statement
  return (
    <View style={style.container}>
      <LoaderModal modalVisible={isLoading} />
      <BackgroundColor>
        <View style={style.profileContainer}>
          <TouchableOpacity
            onPress={() => Navigation.navigate('Custom_screen')}>
            <Image
              source={icons.User_photo}
              style={{
                width: 75,
                height: 75,
                borderRadius: 45,
                borderWidth: 3,
                borderColor: '#019882',
                backgroundColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
          <View
            style={{flexDirection: 'column', flex: 1, top: -5, marginLeft: 10}}>
            <Text style={[FONTS.profile_heading]}> {developer_name} </Text>
            <Text style={FONTS.profile_subheading}> {designation} </Text>
          </View>
        </View>

        {/* Check if it is DEV role Or NOT */}
        {role != 'DEV' ? (
          <TouchableOpacity
            style={style.budgetBox}
            onPress={() => Navigation.navigate('ListAllProjects')}>
            <Text
              style={{
                fontFamily: 'DMSans-Bold',
                fontSize: 16,
                color: COLORS.blackTextColor,
              }}>
              Budget Tracker
            </Text>
          </TouchableOpacity>
        ) : null}

        <View style={style.recentLeave}>
          <Text style={style.recentTxt}>Recent Leave Status</Text>
          {leaveList && leaveList.length > 0 ? (
            <FlatList
              data={leaveList}
              renderItem={({item}) => <LeaveDetailsBox item={item} />}
              style={{marginTop: 20}}
            />
          ) : (
            <View
              style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
              {/* No results found */}
              <Lottie
                source={require('../assets/animation/emptyFeild.json')}
                autoPlay
                loop
                style={{width: 150, height: 150}}
              />
              <Text style={{fontFamily: 'DMSans-Bold'}}>
                Leave Requests not found.!
              </Text>
            </View>
          )}
        </View>
      </BackgroundColor>
    </View>
  );
};

export default HomeScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  recentLeave: {
    flex: 1,
    marginTop: 20,
  },
  recentTxt: {
    fontFamily: 'DMSans-Bold',
    color: COLORS.black,
    fontSize: 22,
    marginLeft: 30,
    marginTop: 5,
  },
  box: {
    width: '85%',
    borderWidth: 1,
    borderColor: COLORS.white,
    elevation: 4,
    borderRadius: SIZES.radius_16,
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    marginVertical: 10,
    flexDirection: 'row',
    padding: 15,
  },
  reqTxt: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'DMSans-Bold',
    color: COLORS.black,
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,
    fontFamily: 'DMSans-Regular',
  },
  reason: {
    flexDirection: 'row',
    marginTop: 7,
  },
  reasonTxt: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,
    fontFamily: 'DMSans-Regular',
  },
  approved: {
    backgroundColor: COLORS.green1,
    fontSize: 14,
    borderRadius: 5,
    color: COLORS.green,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontFamily: 'DMSans-Regular',
  },
  declined: {
    backgroundColor: COLORS.red1,
    fontSize: 14,
    borderRadius: 5,
    color: COLORS.red,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontFamily: 'DMSans-Regular',
  },
  requested: {
    backgroundColor: COLORS.yellow1,
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: COLORS.yellow,
    fontFamily: 'DMSans-Regular',
  },
  budgetBox: {
    width: '85%',
    height: 40,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 7,
  },
});
