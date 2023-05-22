import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import React from 'react';
import ToolBar from '../components/ToolBar';
import BackgroundColor from '../components/BackgroundColor';
import {COLORS, SIZES} from '../constants';
import {useState} from 'react';
import {DEV_ID} from '../constants/Constant';
import {SALT, UPDATE_FIXED_EXPENSES} from '../constants/API_constants';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import md5 from 'md5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderModal from '../components/LoaderModal';

const UpdateFixedExpenses = () => {
  const navigation = useNavigation();
  const editExpenses = useSelector(state => state.user.editExpenses);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [purpose, setPurpose] = useState(editExpenses.purpose);
  const [purposeError, setPurposeError] = useState(false);
  const [amount, setAmount] = useState(editExpenses.amount);
  const [data, setData] = useState([]);
  const [amountError, setAmountError] = useState(false);
  const [amountError1, setAmountError1] = useState(false);
  const [amountText, setAmountText] = useState();
  const [amountZero, setAmountZero] = useState(false);

  // const [editExpenses, setEditExpenses] = useState('');

  const patternAmount = /^[0-9]{1,6}$/;
  const decimalAmount = /^[0-9]$/;

  const handleSubmit = () => {
    if (purpose === '') {
      setPurposeError(true);
    } else if (amount === '') {
      setAmountError(false);
      setAmountError1(true);
      setAmountZero(false);
      setAmountText('Please add amount*');
    } else if (amount == 0){
      Alert.alert('Minimum limit is ₹1');
    } 
    else if (patternAmount.test(amount)) {
      AsyncStorage.getItem(DEV_ID).then(DEV_ID => {
        const developer_id = DEV_ID;
        const expensesID = editExpenses.id;
        console.log('>>>>>>>>>expenses_id', expensesID)
        // const purpose = editExpenses.purpose;
        const auth_token = md5(SALT + developer_id + expensesID + purpose);

        const data1 = {
          developer_id: developer_id,
          id: expensesID,
          purpose: purpose,
          amount: amount,
          auth_token: auth_token,
        };
        console.log('>>>>>>>>>>', data1);
        setIsLoading(true);
        axios
          .post(UPDATE_FIXED_EXPENSES, data1)
          .then(Response => {
            setIsLoading(false);
            if (Response.data.success) {
              console.log('edited expenses is', Response.data);
              Alert.alert(
                "Success!", Response.data.message,
                [
                  { text: "OK", onPress: () => navigation.goBack() }
                ]
              );
            } else {
              Alert.alert('Purpose alert!', Response.data.message);
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
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
      {/* <Header name="Update Fixed Expenses" /> */}
      <LoaderModal modalVisible = {isLoading} />
      <ToolBar title="Update Fixed Expenses" backBtn={true} />
      <BackgroundColor>
        <View style={style.main}>
          <View style={style.inputBox}>
            <View style={style.label1}>
              <Text style={style.labelText}>Purpose</Text>
              <Text style={style.labelStar}>*</Text>
            </View>
            <TextInput
              value={purpose}
              style={style.input1}
              placeholder="Type your Purpose"
              placeholderTextColor={COLORS.black}
              onChangeText={value => {
                setPurpose(value);
                setPurposeError(false);
              }}></TextInput>
            {purposeError ? (
              <View style={style.label1}>
                <Text style={{color: COLORS.pure}}>Please enter purpose*</Text>
              </View>
            ) : null}

            <View style={style.label1}>
              <Text style={style.labelText}>Amount</Text>
              <Text style={style.labelStar}>*</Text>
            </View>
            <TextInput
              value={amount}
              style={style.input1}
              placeholder="Enter your Amount"
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
                <Text style={{color: COLORS.pure}}>{amountText}</Text>
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
  );
};

export default UpdateFixedExpenses;

const style = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZES.width,
    height: SIZES.height,
    top: -30,
  },
  inputBox: {
    width: '85%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  label1: {
    flexDirection: 'row',
    marginTop: 20,
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
    borderRadius: 15,
  },
  buttonText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
  },
});
