import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';
import md5 from 'md5';
import axios from 'axios';
import {LEAVE_REQUEST, SALT} from '../constants/API_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEV_ID} from '../constants/Constant';
import {COLORS, SIZES} from '../constants';
import icons from '../constants/icons';
import ToolBar from '../components/ToolBar';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment/moment';
import LoaderModal from '../components/LoaderModal';
import {useIsFocused} from '@react-navigation/native';
import LeaveDetailsBox from '../components/LeaveDetailsBox';
import BackgroundColor from '../components/BackgroundColor';
import Lottie from 'lottie-react-native';

const LeaveRequestScreen = ({navigation}) => {
  const [leaveList, setLeaveList] = useState([]);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [selectedDate, setSelectedDate] = useState();

  const [isLoading, setIsLoading] = useState();
  // const [month, setMonth] = useState('');
  // const [year, setYear] = useState('')

  const getLeaveData = (month, year) => {
    AsyncStorage.getItem(DEV_ID).then(DEV_ID => {
      const authToken = md5(SALT + DEV_ID);
      // const month = moment(date).format("MM");
      // const year = moment(date).format("YYYY");

      console.log('filter', month, year);

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
          setLeaveList(res.parameters);
          console.log(res);
        })
        .catch(function (error) {
          setIsLoading(false);
          console.log(error);
        });
    });
  };

  const showAll = () => {
    setSelectedDate(null);
    setLeaveList([]);
    getLeaveData('', '');
    setDate(new Date());
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    console.log('yes', isFocused);
    if (isFocused) {
      setLeaveList([]);
      setSelectedDate(null);
      getLeaveData('', '');
      setDate(new Date());
    }
  }, [isFocused]);

  //MM YYYY function
  const MonthYear = () => {
    const showPicker = useCallback(value => setShow(value), []);

    const onValueChange = useCallback(
      (event, newDate) => {
        const selectedDate = newDate || date;

        showPicker(false);
        if (selectedDate == newDate) {
          setDate(selectedDate);
          setSelectedDate(selectedDate);
        } else {
          showPicker(false);
        }

        const month = moment(selectedDate).format('MM');
        const year = moment(selectedDate).format('YYYY');

        getLeaveData(month, year);
      },
      [date, showPicker],
    );
    //console.log(date);
    return (
      <SafeAreaView>
        <TouchableOpacity
          onPress={() => showPicker(true)}
          style={{flexDirection: 'row'}}>
          <Text
            style={{
              padding: 10,
              fontSize: 16,
              fontFamily: 'DMSans-Bold',
              marginLeft: 6,
              flex: 1,
              color: COLORS.black,
            }}>
            {selectedDate != null
              ? moment(date).format('MMM YYYY')
              : 'Select MM-YYY'}
          </Text>
          <Image
            source={icons.Left_arrow}
            style={{
              width: 20,
              height: 20,
              transform: [{rotate: '-92 deg'}],
              alignSelf: 'center',
              marginRight: 15,
            }}
          />
        </TouchableOpacity>
        {show && (
          <MonthPicker
            onChange={onValueChange}
            value={date}
            mode = 'short'
            //minimumDate={new Date()}
            //maximumDate={new Date()}
            // locale='in'
            cancelButton={AbortSignal}
          />
        )}
      </SafeAreaView>
    );
  };

  //main return statement
  return (
    <View style={style.container}>
      {/* Top bar component using prop title */}
      <ToolBar title="Leave Request" />
      {/* Loader component */}
      <LoaderModal modalVisible={isLoading} />
      <BackgroundColor>
        {/* MM YYYY select */}
        <View style={style.date}>
          <MonthYear />
        </View>

        {selectedDate && (
          <TouchableOpacity style={style.showAll} onPress={showAll}>
            <Text style={style.showText}>Clear Filter</Text>
          </TouchableOpacity>
        )}

        {/* Leave list */}
        {/* <LeaveDetailsBox dataState = {leaveList} /> */}

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
      </BackgroundColor>
    </View>
  );
};

// stylesheet
const style = StyleSheet.create({
  container: {
    flex: 1,
    width: SIZES.width,
    height: SIZES.height,
    backgroundColor: COLORS.white,
  },
  bell: {
    alignItems: 'flex-end',
    marginRight: 20,
    marginVertical: 15,
  },
  date: {
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    width: '85%',
    borderWidth: 1,
    borderColor: COLORS.white,
    elevation: 4,
    borderRadius: 30,
    marginTop: 10,
  },
  reqContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  req: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.green,
    backgroundColor: COLORS.green1,
    borderRadius: 10,
    textAlign: 'center',
    marginTop: 8,
    marginLeft: 5,
  },
  showAll: {
    width: '30%',
    height: 30,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  showText: {
    color: COLORS.black,
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LeaveRequestScreen;
