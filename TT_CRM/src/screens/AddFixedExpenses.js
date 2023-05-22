import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, SIZES} from '../constants';
import BackgroundColor from '../components/BackgroundColor';
import {DEV_ID} from '../constants/Constant';
import {ADD_FIXED_EXPENSES, SALT} from '../constants/API_constants';
import {useNavigation, useRoute} from '@react-navigation/native';
import ToolBar from '../components/ToolBar';
import md5 from 'md5';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LoaderModal from '../components/LoaderModal';

const AddFixedExpenses = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const userID = useSelector(state => state.user.userID);
  // console.log('userid is ', userID);
  const projects = useSelector(state => state.user.projects);
  // console.log('>>>>>>>>projects',projects)

  const [amount, setAmount] = useState('');
  const [addExpenses, setAddExpenses] = useState();
  const [message, setMessage] = useState();
  const [data, setData] = useState([]);
  const [store1, setStore1] = useState();
  const [purpose, setPurpose] = useState('');
  const [purposeError, setPurposeError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [amountError1, setAmountError1] = useState(false);
  const [amountText, setAmountText] = useState();
  const [amountZero, setAmountZero] = useState(false);
  const [alertText, setAlertText] = useState();
  const [fixedExpenses, setFixedExpenses] = useState('');

  const patternAmount = /^[0-9]{1,6}$/;
  const decimalAmount = /^[0-9]$/;

  const route = useRoute();
  const project_id = route.params.project_id;

  const amountFunction = (value) => {
    setAmount(value);
    if (value.length > 6) {
      setAmountError(true);
    }
    else if (value == 0) {
      setAmountZero(true);
    } else {
      setAmountError(false);
      setAmountZero(false);
    }
    setAmountError1(false);
  };

  const handleSubmit = () => {
    if (purpose === '') {
      setPurposeError(true);
    } else if (amount === '') {
      setAmountError(false);
      setAmountError1(true);
      setAmountZero(false);
      setAmountText('Please add amount*');
    }else if (amount == 0){
      Alert.alert('Minimum limit is ₹1');
    } 
    else if (patternAmount.test(amount)) {
      AsyncStorage.getItem(DEV_ID).then(DEV_ID => {
        const developer_id = DEV_ID;
        console.log('>>>>>>>id', developer_id);
        const projectID = project_id;
        const auth_token = md5(SALT + developer_id + projectID + purpose);

        const data1 = {
          developer_id: developer_id,
          project_id: projectID,
          purpose: purpose,
          amount: amount,
          auth_token: auth_token,
        };
        console.log(' fixed data1 is', data1);
        setIsLoading(true);
        axios
          .post(ADD_FIXED_EXPENSES, data1)
          .then(Response => {
            setIsLoading(false);
            if (Response.data.success) {
              setFixedExpenses(Response.data.parameters);
              setAddExpenses(Response.data.parameters);
              console.log('added expenses is', Response.data);
              setStore1(Response.data.parameters.id);
              Alert.alert(
                "Success!", Response.data.message,
                [
                  { text: "OK", onPress: () => navigation.goBack() }
                ]
              );
            } else {
              alert('Please fill mandatory fields', Response.data.message);
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
      //  ()=> projects.map(item => {

      //   });
    } else {
      if (decimalAmount.test(amount)) {
        setAmount('');
        alert('maximum limit below 10 lacs and value should be 0-9');
      }
      else {
        setAmount('');
        alert('Decimal value not allowed');
      }
    }
  };

  return (
    <ScrollView>
      <LoaderModal modalVisible={isLoading} />
      <ToolBar title="Add Expenses" backBtn={true} />

      <BackgroundColor>
        <View style={style.main}>
          <View style={style.inputBox}>
            <View style={style.label1}>
              <Text style={style.labelText}>Purpose</Text>
              <Text style={style.labelStar}>*</Text>
            </View>
            <TextInput
              placeholder="Type Your Purpose"
              placeholderTextColor={COLORS.black}
              style={style.input1}
              keyboardType="default"
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
              placeholder="Enter Your Amount"
              placeholderTextColor={COLORS.black}
              maxLength = {6}
              style={style.input1}
              keyboardType="number-pad"
              onChangeText={value => {
                amountFunction(value);
              }}></TextInput>
            {amountError ? (
              <View style={style.label1}>
                <Text
                  style={{
                    color: COLORS.pure,
                    fontFamily: 'DMSans-Regular',
                    fontSize: 13,
                  }}>
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
                <Text
                  style={{
                    color: COLORS.pure,
                    fontFamily: 'DMSans-Regular',
                    fontSize: 13,
                  }}>
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

export default AddFixedExpenses;

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
