import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import ToolBar from '../components/ToolBar';
import BackgroundColor from '../components/BackgroundColor';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { COLORS, SIZES } from '../constants';
import { DEV_ID } from '../constants/Constant';
import { SALT, UPDATE_RECEIVED_PAYMENTS } from '../constants/API_constants';
import md5 from 'md5';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderModal from '../components/LoaderModal';

const UpdateReceivedPayments = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const userID = useSelector(state => state.user.userID);
  const editPayments = useSelector(state => state.user.editPayments);
  const [remarks, setRemarks] = useState(editPayments.remarks);
  const [amount, setAmount] = useState(editPayments.amount);
  const [remarksError, setRemarksError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [amountError1, setAmountError1] = useState(false);
  const [amountText, setAmountText] = useState();
  const [amountZero, setAmountZero] = useState(false);
  const patternAmount = /^[0-9]{1,6}$/;
  const decimalAmount = /^[0-9]$/;

  const handleSubmit = () => {
    if (remarks === '') {
      setRemarksError(true);
    }
    else if (amount === '') {
      setAmountError(false);
      setAmountZero(false);
      setAmountError1(true);
      setAmountText('Please add amount*');
    } else if (amount == 0){
      Alert.alert('Minimum limit is ₹1');
    } 
    else if (patternAmount.test(amount)) {
     AsyncStorage.getItem(DEV_ID).then(DEV_ID => {

      const developer_id = DEV_ID;
      const paymentsID = editPayments.id;
      console.log('>>>>>>>id ',paymentsID )
      const remarks1 = remarks;
      const auth_token = md5(SALT + developer_id + paymentsID + remarks);

      const data1 = {
        developer_id: developer_id,
        id: paymentsID,
        remarks: remarks1,
        amount: amount,
        auth_token: auth_token,
      };
      console.log(' fixed data1 is', data1);
      setIsLoading(true);
      axios
        .post(UPDATE_RECEIVED_PAYMENTS, data1)
        .then(Response => {
          setIsLoading(false);
          if (Response.data.success) {
            Alert.alert(
              "Success!",Response.data.message,
              [
                { text: "OK", onPress: () => navigation.goBack() }
              ]
            );
          } else {
            Alert.alert('Remarks alert!', Response.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
     })
    } else {
      if (decimalAmount.test(amount)) {
        setAmount('');
        alert('maximum limit below 10lacs and value should be 0-9');
      } else {
        setAmount('');
        alert('Decimal value not allowed');
      }
    }
  };

  return (
    <ScrollView>
      <LoaderModal modalVisible = {isLoading} />
      <ToolBar title = 'Update Received Payments'  backBtn={true} />
      <BackgroundColor>
      <View style={style.main}>
        
          <View style={style.inputBox}>
            <View style={style.label1}>
              <Text style={style.labelText}>Remarks</Text>
              <Text style={style.labelStar}>*</Text>
            </View>
            <TextInput
              value={remarks}
              style={style.input1}
              placeholder = 'Type your Remarks'
              placeholderTextColor={COLORS.black}
              onChangeText={value => {
                setRemarks(value);
                setRemarksError(false);

              }}></TextInput>
            {remarksError ? (
              <View style={style.label1}>
                <Text style={{color: COLORS.pure}}>
                  Please enter remarks*
                </Text>
              </View>
            ) : null}

            <View style={style.label1}>
              <Text style={style.labelText}>Amount</Text>
              <Text style={style.labelStar}>*</Text>
            </View>
            <TextInput
              value={amount}
              style={style.input1}
              placeholder = 'Enter your Amount'
              placeholderTextColor={COLORS.black}
              maxLength = {6}
              keyboardType="number-pad"
              onChangeText={value => {
                setAmount(value);
                if (value.length > 6) {
                  setAmountError(true);
                } else if (value == 0){
                  setAmountZero(true);
                }
                else {
                  setAmountError(false);
                  setAmountZero(false);
                }
                setAmountError1(false);
              }}></TextInput>
            {amountError ? (
              <View style={style.label1}>
                <Text style={{color: COLORS.pure}}>
                  Maximum limit is below ₹ 10L
                </Text>
              </View>
            ) : null}
            {amountError1 ? (
              <View style={style.label1}>
                <Text style={{color: COLORS.pure}}>
                  {amountText}
                </Text>
              </View>
            ) : null}
            {amountZero ? (
              <View style={style.label1}>
                <Text style={{color: COLORS.pure}}>
                  Minimum limit is ₹1
                </Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => {
              handleSubmit();
            }}
            style={style.button1}>
            <Text style={style.buttonText}>Save</Text>
          </TouchableOpacity>
        
      </View>
      </BackgroundColor>
    </ScrollView>
  )
}

export default UpdateReceivedPayments

const style = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZES.width,
    height: SIZES.height,
    top: -30
  },
  inputBox: {
    width: '85%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  label1: {
    flexDirection: 'row',
    marginTop: 20
  },
  labelText: {
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
  },
  labelStar: {
    color: COLORS.red,
  },
  input1: {
    borderWidth: 0.2,
    borderColor: COLORS.pure,
    marginTop: 15,
    borderRadius: 7,
    fontSize: 13,
    fontFamily: 'DMSans-Regular',
  },
  button1: {
    width: '45%',
    backgroundColor: COLORS.pure,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    borderRadius: 15
  },
  buttonText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
  },
})