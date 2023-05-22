import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import icons from '../constants/icons';
import {COLORS, SIZES} from '../constants';
import {useNavigation} from '@react-navigation/native';

const LeaveDetailsBox = ({item}, props) => {
  const navigation = useNavigation();

  return (
    <View>
      {/* Leave list */}
      <TouchableOpacity
        style={style.box}
        onPress={() =>
          navigation.navigate('LeaveDetails', {
            leave_type: item.leave_type,
            from_time: item.from_time,
            to_time: item.to_time,
            date_of_leave: item.date_of_leave,
            comments: item.dev_comments,
            status: item.status,
            created_at: item.created_at,
            updated_at: item.updated_at,
          })
        }>
        {/* Leave type */}
        <View style={style.reqTxt}>
          <Text style={style.title}>{item.leave_type}</Text>
          {/*  leave date */}
          <View style={style.day}>
            <Image source={icons.Calendor} style={{width: 18, height: 18}} />
            <Text style={style.dayDate}>{item.date_of_leave} </Text>
          </View>
          {/*  2 hrs leave time checked */}
          {item.leave_type == '2 hrs' && (
            <View style={style.reason}>
              <Image source={icons.Clock} style={{width: 18, height: 18}} />
              <Text style={style.reasonTxt}>
                {item.from_time} to {item.to_time}
              </Text>
            </View>
          )}
          {/*  leave reason */}
          <View style={style.reason}>
            <Image source={icons.Dot} style={{width: 18, height: 18}} />
            <Text style={style.reasonTxt}>{item.dev_comments} </Text>
          </View>
        </View>
        {/* Leave Status */}
        <View>
          {item.status == 'Approved' && (
            <Text style={style.approved}>{item.status}</Text>
          )}
          {item.status == 'Declined' && (
            <Text style={style.declined}>{item.status}</Text>
          )}
          {item.status == 'Requested' && (
            <Text style={style.requested}>{item.status}</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LeaveDetailsBox;

const style = StyleSheet.create({
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
  day: {
    flexDirection: 'row',
    marginTop: 7,
  },
  reason: {
    flexDirection: 'row',
    marginTop: 7,
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
    color: COLORS.blackTextColor
  },
  reasonTxt: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,
    fontFamily: 'DMSans-Regular',
    color: COLORS.blackTextColor
  },
  approved: {
    backgroundColor: COLORS.green1,
    fontSize: 14,
    borderRadius: 5,
    color: COLORS.green,
    paddingVertical: 5,
    paddingHorizontal: 11,
    fontFamily: 'DMSans-Regular',
  },
  declined: {
    backgroundColor: COLORS.red1,
    fontSize: 14,
    borderRadius: 5,
    color: COLORS.red,
    paddingVertical: 5,
    paddingHorizontal: 11,
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
});
