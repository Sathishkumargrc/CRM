import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import React from 'react';
import ToolBar from '../components/ToolBar';
import {COLORS} from '../constants';

const LeaveDetails = ({route}) => {
  const ListView = props => {
    return (
      <View style={style.outer}>
        <Text style={style.txt}>{props.name}</Text>
        <Text style={style.val}>{props.details}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <ToolBar title="Leave Details" backBtn={true} />

      <View style={{marginTop: 20}}></View>

      {/* Leave details of Staff */}
      <ScrollView>
        <ListView name="Leave Type" details={route.params.leave_type} />
        <ListView name="From Time" details={route.params.from_time} />
        <ListView name="To Time" details={route.params.to_time} />
        <ListView name="Date of Leave" details={route.params.date_of_leave} />
        <ListView name="Comments" details={route.params.comments} />
        <ListView name="Status" details={route.params.status} />
        <ListView name="Created at" details={route.params.created_at} />
        <ListView name="Status Updated at" details={route.params.updated_at} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaveDetails;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  outer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: COLORS.gray,
    width: '90%',
    borderRadius: 10,
    marginLeft: 15,
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 14,
  },
  txt: {
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
    fontFamily: 'DMSans-Bold',
  },
  val: {
    flex: 1,
    textAlign: 'right',
    color: COLORS.black,
    fontFamily: 'DMSans-Regular',
  },
});
