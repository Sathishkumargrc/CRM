import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ToolBar from '../components/ToolBar';
import {COLORS} from '../constants';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment/moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEV_ID} from '../constants/Constant';
import md5 from 'md5';
import {APPLY_LEAVE, SALT} from '../constants/API_constants';
import LoaderModal from '../components/LoaderModal';
import BackgroundColor from '../components/BackgroundColor';
import {useIsFocused} from '@react-navigation/native';

const ApplyLeaveScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  //Dropdown picker Leave Type
  const [open, setOpen] = useState(false);
  const [leaveType, setleaveType] = useState('');
  //items
  const [items, setItems] = useState([
    {label: 'FULL DAY', value: '1'},
    {label: 'HALF DAY', value: '2'},
    {label: '2 hrs', value: '3'},
    {label: 'Compensation Full Day', value: '4'},
    {label: 'Compensation Half Day', value: '5'},
    {label: 'Work from home', value: '6'},
  ]);

  const [day, setDay] = useState(new Date());
  const [fullSee, setFullSee] = useState(false);

  const [comment, setComment] = useState('');

  const [halfDay, setHalfDay] = useState(new Date());
  const [halfSee, setHalfSee] = useState(false);

  // const [twoHrs, setTwoHrs] = useState(new Date());

  const [toTime, setToTime] = useState('');

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      resetDatas(); 
    }
  }, [isFocused]);

  const resetDatas = () => {
    setleaveType('');
    setDay(new Date());
    setComment('');
    setToTime(new Date());
    setHalfDay(new Date());
    setToTime('');
    setOpen('');
  };

  const CheckValidation = () => {
    if (leaveType == '') {
      Alert.alert('Please select a valid Leave type!');
    } else if (comment.trim() == '') {
      Alert.alert('Please enter your comment!');
    }
    else {
      LeaveApi();
    }
  };

  const LeaveApi = async () => {
    AsyncStorage.getItem(DEV_ID).then(DEV_ID => {
      const LEAVE_TYPE = items[leaveType - 1].label;
      const DATE_OF_LEAVE = moment(day).format('YYYY-MM-DD');
      const COMMENTS = comment;
      const FROM_TIME = moment(halfDay).format('LTS');
      const TO_TIME = moment(toTime).format('LTS');
      const authToken = md5(SALT + DEV_ID + LEAVE_TYPE + DATE_OF_LEAVE);
      console.log(
        DEV_ID,
        LEAVE_TYPE,
        DATE_OF_LEAVE,
        COMMENTS,
        FROM_TIME,
        TO_TIME,
        authToken,
      );
      const datas = {
        developer_id: DEV_ID,
        leave_type: LEAVE_TYPE,
        date_of_leave: DATE_OF_LEAVE,
        dev_comments: COMMENTS,
        from_time: FROM_TIME,
        to_time: TO_TIME,
        auth_token: authToken,
      };
      //Api response
      setIsLoading(true);
      axios
        .post(APPLY_LEAVE, datas)
        .then(response => {
          setIsLoading(false);
          let res = response.data;
          //setLeaveApi(res);
          let message = res.message;
          Alert.alert(message);
          //console.log(message)
          console.log('Api success response', res);
          if (res.success == true) {
            resetDatas();
          }
        })
        .catch(function (error) {
          setIsLoading(false);
          console.log(error);
        });
    });
  };

  const LeaveType = () => {
    return (
      <DropDownPicker
        placeholder="Select a Leave type"
        open={open}
        value={leaveType}
        items={items}
        setOpen={setOpen}
        setValue={setleaveType}
        setItems={setItems}
        textStyle={{
          fontSize: 14,
          fontFamily: 'DMSans-Regular',
          color: COLORS.black,
        }}
        containerStyle={{width: '90%', marginTop: 10}}
        style={{elevation: 4, borderColor: 'white'}}
        // labelStyle = {{color: COLORS.pure}} text selected color
        dropDownContainerStyle={{borderColor: COLORS.white, elevation: 4}}
      />
    );
  };

  const FullDay = () => {
    return (
      <View style={{marginTop: 10}}>
        <TouchableOpacity
          style={style.leaveDateContainer}
          onPress={() => setFullSee(true)}>
          <Text style={style.leaveDateTxt}>
            {moment(day).format('MMM-DD-YYYY')}{' '}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={fullSee}
          date={day}
          onConfirm={date => {
            setFullSee(false);
            setDay(date);
            // console.log('current date',date)
          }}
          onCancel={() => {
            setFullSee(false);
          }}
          // minimumDate={new Date()}
          mode="date"

          // androidVariant = 'nativeAndroid'
        />
      </View>
    );
  };

  const FromTime = () => {
    return (
      <View style={{marginTop: 10}}>
        <LoaderModal modalVisible={isLoading} />
        {/* <Button title="Open" onPress={() => setSee(true)} /> */}
        <TouchableOpacity
          style={style.fromTime}
          onPress={() => setHalfSee(true)}>
          <Text style={style.fromTimeTxt}>{moment(halfDay).format('LT')}</Text>
        </TouchableOpacity>

        <DatePicker
          modal
          open={halfSee}
          date={halfDay}
          onConfirm={date => {
            setHalfSee(false);
            // console.log('from time', moment(date).format('LT'));
            setHalfDay(date);

            // if leave type 2 or 3 validation, Half day or 2 hours of permission.
            {
              if (leaveType == 3) {
                // console.log(
                //   'to time',
                //   moment(date).add(2, 'hours').format('LT'),
                // );
                let to_time = moment(date).add(2, 'hours').format('LT');
                setToTime(to_time);
              } else if (leaveType == 2) {
                // console.log(
                //   'to time',
                //   moment(date).add(4, 'hours').format('LT'),
                // );
                let to_time = moment(date).add(4, 'hours').format('LT');
                setToTime(to_time);
              }
            }
          }}
          onCancel={() => {
            setHalfSee(false);
          }}
          // minimumDate={new Date()}
          mode="time"
          is24hourSource="locale"
        />
      </View>
    );
  };

  const ToTime = () => {
    return (
      <View style={{marginTop: 10}}>
        <View style={style.toTimeContainer}>
          <Text style={style.fromTimeTxt}>{toTime}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <ToolBar title="Apply Leave" />
      <LoaderModal modalVisible={isLoading} />
      <BackgroundColor>
        <ScrollView style={{flex: 1}}>
          <View style={style.leaveContainer}>
            <Text style={style.leaveTxt}>Leave Type</Text>
            <LeaveType />
          </View>

          <View style={style.dateContainer}>
            <Text style={style.dateText}>Date Of Leave</Text>
            <FullDay />
          </View>

          <View style={style.commentsContainer}>
            <Text style={style.commentTxt}>Comments</Text>
            <View style={style.commentsBox}>
              <TextInput
                value={comment} //Don't use 'date' for reset your datas.
                style={style.textInput}
                multiline={true}
                placeholder="Type your Reason"
                placeholderTextColor={COLORS.blackTextColor}
                onChangeText={text => setComment(text.trimStart())} // starting letter don't accept white spaces.
                maxLength={50}
              />
            </View>
          </View>

          {(leaveType == 3 || leaveType == 2) && (
            <View style={style.timeContainer}>
              <View style={{width: '50%'}}>
                <Text style={style.fromTxt}>From time:</Text>
                <FromTime />
              </View>

              <View style={{width: '50%', marginLeft: 20}}>
                <Text style={style.fromTxt}>To time:</Text>
                <ToTime />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={style.applyBox}
            onPress={() => CheckValidation()}>
            <Text style={style.applyTxt}>Apply</Text>
          </TouchableOpacity>
        </ScrollView>
      </BackgroundColor>
    </SafeAreaView>
  );
};

export default ApplyLeaveScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  leaveContainer: {
    marginTop: 50,
    marginLeft: 25,
  },
  leaveTxt: {
    fontSize: 16,
    fontFamily: 'DMSans-Bold',
    color: COLORS.black,
  },
  dateContainer: {
    marginTop: 40,
    marginLeft: 25,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'DMSans-Bold',
    color: COLORS.black,
  },
  leaveDateContainer: {
    width: '90%',
    backgroundColor: COLORS.white,
    elevation: 4,
    borderRadius: 10,
  },
  leaveDateTxt: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    marginLeft: 10,
    paddingVertical: 14,
    color: COLORS.black,
  },
  commentsContainer: {
    marginTop: 40,
    marginLeft: 25,
  },
  commentTxt: {
    fontFamily: 'DMSans-Bold',
    color: COLORS.black,
    fontSize: 16,
  },
  commentsBox: {
    width: '90%',
    borderRadius: 10,
    backgroundColor: COLORS.white,
    elevation: 4,
    marginTop: 10,
  },
  textInput: {
    marginLeft: 10,
    color: COLORS.blackTextColor
  },
  fromTime: {
    width: '65%',
    backgroundColor: COLORS.white,
    elevation: 4,
    borderRadius: 10,
  },
  toTimeContainer: {
    width: '65%',
    backgroundColor: '#e8e7e3',
    elevation: 4,
    borderRadius: 10,
  },
  fromTimeTxt: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    marginLeft: 10,
    paddingVertical: 14,
    color: COLORS.black,
  },
  timeContainer: {
    marginLeft: 28,
    marginTop: 40,
    flexDirection: 'row',
  },
  fromTxt: {
    color: COLORS.black,
    fontFamily: 'DMSans-Bold',
    fontSize: 16,
  },
  applyBox: {
    width: '83%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.pure,
    height: 50,
    marginTop: 40,
    borderBottomLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  applyTxt: {
    color: COLORS.white,
    fontFamily: 'DMSans-Bold',
    fontSize: 16,
  },
});
