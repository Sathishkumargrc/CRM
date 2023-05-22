import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import BackgroundColor from '../components/BackgroundColor';
import ToolBar from '../components/ToolBar';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { COLORS, SIZES } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEV_ID } from '../constants/Constant';
import md5 from 'md5';
import {
  DELETE_FIXED_EXPENSES,
  DELETE_RECEIVED_PAYMENTS,
  GET_BUDGET_DETAILS,
  LIST_ALL_PROJECT_USER,
  SALT,
} from '../constants/API_constants';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment/moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoaderModal from '../components/LoaderModal';
import { useDispatch, useSelector } from 'react-redux';
import { setEditExpenses, setEditPayments } from '../redux/Slice/User';

const Training = () => {

  const navigation = useNavigation();

  const dispatch = useDispatch();
  const userID = useSelector(state => state.user.userID);
  const projectIDDet = useSelector(state => state.user.projectID);

  const [isLoading, setIsLoading] = useState(false);

  const [dayType, setDayType] = useState('projectspan');
  const [date, setDate] = useState('projectspan');
  const [dateSelector1, setDateSelector1] = useState(false);
  const [projectUserID, setProjectUserID] = useState([]);
  const [blockFromDate, setBlockFromDate] = useState(true);
  const [blockToDate, setBlockToDate] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [showToDate, setShowToDate] = useState(false);

  const [userIDSDate, setUserIDSDate] = useState([]);
  const [developerExpenses, setDeveloperExpenses] = useState();
  const [developerName, setDeveloperName] = useState();
  const [addedExpense, setAddedExpense] = useState();
  const [addPayments, setAddPayments] = useState();
  const [fixedExpenses, setFixedExpenses] = useState();

  const [fromDate, setFromDate] = useState(' ');
  const [toDate, setToDate] = useState(' ');

  const [value, setValue] = useState([]);
  const [items, setItems] = useState([]);

  const [selected, setSelected] = useState([]);

  const [value1, setValue1] = useState([]);
  const [items1, setItems1] = useState([
    { label: 'PROJECT SPAN', value: 'projectspan' },
    { label: 'CURRENT WEEK', value: 'curweek' },
    { label: 'CURRENT MONTH', value: 'curmonth' },
    { label: 'TODAY', value: 'today' },
    { label: 'CUSTOM VIEW', value: 'customview' },
  ]);

  const route = useRoute();

  const project_id = route.params.ProjectId;
  // console.log('project id >>>>>',project_id);

  const nameId = () => {
    AsyncStorage.getItem(DEV_ID).then(DEV_ID => {
      const data = {
        developer_id: DEV_ID,
        project_id: project_id,
        auth_token: md5(SALT + DEV_ID + project_id),
      };
      axios
        .post(LIST_ALL_PROJECT_USER, data)
        .then(Response => {
          if (Response.data.success) {
            const res = Response.data.parameters;
            console.log('>>>>>>>>List all projects', Response.data)
            setItems(res);
            console.log('>>>>>>s', Response.data.parameters);
          } else {
            Alert.alert('name', Response.data.message);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      nameId();
      expenses();
    }
  }, [isFocused]);

  const expenses = () => {
    setIsLoading(false);
    AsyncStorage.getItem(DEV_ID).then(DEV_ID => {
      const type = date;
      const id = DEV_ID;
      const auth_token3 = md5(SALT + id + project_id + type);
      console.log('all', id, project_id, type);
      const data3 = {
        developer_id: id,
        project_id: project_id,
        type: type,
        auth_token: auth_token3,
      };
      console.log('data3 is', data3);
      axios
        .post(GET_BUDGET_DETAILS, data3)
        .then(Response => {
          if (Response.data.success) {
            console.log('response is1', Response.data.parameters);

            if (Response.data.parameters.dev_expenses.length > 0) {
              setFixedExpenses(Response.data.parameters);
              setAddedExpense(Response.data.parameters.fixed_expenses);
              setAddPayments(Response.data.parameters.payments_received);
              setDeveloperExpenses(Response.data.parameters.dev_expenses);
              setDeveloperName(Response.data.parameters.dev_expenses[0].name);
              setIsLoading(true);
            } else {
              setFixedExpenses(Response.data.parameters);
              setAddedExpense(Response.data.parameters.fixed_expenses);
              setAddPayments(Response.data.parameters.payments_received);
              setDeveloperExpenses('');
              setDeveloperName('');
              setIsLoading(true);
            }
          } else {
            Alert.alert('Alert!', Response.data.message);
          }
        })
        .catch(err => {
          alert('>>>>', err);
          console.log('hi', err);
        });
    });
  };

  const userNameSubmit = data => {
    setIsLoading(true);
    // setSelected(data);
    console.log('changedata', data.name);
    console.log('dropvalue', data);
    setIsLoading(false);
    AsyncStorage.getItem(DEV_ID).then(DEV_ID => {
      const developer_id = DEV_ID;
      const projectID = projectIDDet;
      const userIDS = [parseInt(data.id)];
      const userName = data.name;
      const type = dayType;
      const userIDS1 = userIDS;
      const auth_token2 = md5(SALT + developer_id + projectID + type);
      const data2 = {
        developer_id: developer_id,
        project_id: projectID,
        type: type,
        user_ids: userIDS1,
        from_date: fromDate,
        to_date: toDate,
        auth_token: auth_token2,
      };
      console.log('data4', data2);

      axios
        .post(GET_BUDGET_DETAILS, data2)
        .then(Response => {
          if (Response.data.success) {
            if (Response.data.parameters.dev_expenses.length > 0) {
              setFixedExpenses(Response.data.parameters);
              setDeveloperExpenses(Response.data.parameters.dev_expenses);
              setAddedExpense(Response.data.parameters.fixed_expenses);
              setAddPayments(Response.data.parameters.payments_received);
              console.log('result is1', Response.data.parameters, userName);

              if (developerName == userName) {
                console.log('if condition', developerName, userName);
                if (Response.data.parameters.dev_expenses.length > 0) {
                  setDeveloperExpenses(Response.data.parameters.dev_expenses);
                  setAddedExpense(Response.data.parameters.fixed_expenses);
                  setAddPayments(Response.data.parameters.payments_received);
                  setIsLoading(true);
                }
              } else {
                setDeveloperExpenses();
                setIsLoading(true);
              }
            } else {
              setDeveloperExpenses();
              setIsLoading(true);
            }
          } else {
            setIsLoading(false);
            alert(Response.data.message);
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log('>>>>>code error', err);
        });
    })
  };

  const handleSubmitSpan = dateSpan => {
    console.log('dateSpan', dateSpan);
    setDayType(dateSpan);
    setIsLoading(false);
    if (dateSpan == 'customview') {
      expenses();
      setDateSelector1(true);
      console.log('loading is ', isLoading);
    } else {
      setDateSelector1(false);

      AsyncStorage.getItem(DEV_ID).then(DEV_ID => {
        const developer_id = DEV_ID
        const userIDS1 = projectUserID;
        // const userspanID = userIDS1;
        const type = dateSpan;
        const auth_token2 = md5(SALT + developer_id + project_id + type);

        const data2 = {
          developer_id: DEV_ID,
          project_id: project_id,
          type: type,
          // user_ids: userspanID,
          auth_token: auth_token2,
        };
        console.log('dataspan2 is', data2, GET_BUDGET_DETAILS);
        axios
          .post(GET_BUDGET_DETAILS, data2)
          .then(Response => {
            if (Response.data.success) {
              setFixedExpenses(Response.data.parameters);
              console.log('resultspan2 is', Response.data);
              if (Response.data.parameters.dev_expenses.length > 0) {
                setDeveloperExpenses(Response.data.parameters.dev_expenses);
                setIsLoading(true);
              } else {
                setDeveloperExpenses();
                setIsLoading(true);
              }
            } else {
              alert(Response.data.message);
            }
          })
          .catch(err => {
            console.log(err);
          });
      })
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
    setBlockFromDate(false);
  };

  const handleConfirm = date => {
    const day1 = moment(date).format('YYYY-MM-DD');
    setFromDate(day1);
    setShowToDate(true);
    hideDatePicker();
  };

  const hideFromDate = () => {
    setDatePickerVisibility(false);
    setBlockFromDate(true);
  };

  const hideToDate = () => {
    setDatePickerVisibility2(false);
    setBlockToDate(true);
  };

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
    setBlockToDate(false);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
    setBlockToDate(false);
  };

  const handleConfirm2 = date => {
    let day2 = moment(date).format('YYYY-MM-DD');
    setToDate(day2);
    hideDatePicker2();
    setIsLoading(false);
    setShowToDate(true);
    AsyncStorage.getItem(DEV_ID).then(DEV_ID => {
      const userIDS1 = userIDSDate;
      console.log('label is ', userIDS1); //initial state
      // projects.map(item => {
      // const receiveEnd2 = BUDGET_TRACKER;
      // const userID1 = userID;
      // const projectID = projectIDDet;
      const developer_id = DEV_ID;
      const userspanID = userIDS1;
      const type = 'customview';
      const auth_token4 = md5(SALT + developer_id + project_id + type);

      const data4 = {
        developer_id: developer_id,
        project_id: project_id,
        type: type,
        user_ids: userspanID,
        from_date: fromDate,
        to_date: day2,
        auth_token: auth_token4,
      };

      console.log('datepicker2', fromDate, day2);

      axios
        .post(GET_BUDGET_DETAILS, data4)
        .then(Response => {
          if (Response.data.success) {
            setFixedExpenses(Response.data.parameters);
            console.log('datepicker result is', Response.data.parameters);
            if (Response.data.parameters.dev_expenses.length > 0) {
              setDeveloperExpenses(Response.data.parameters.dev_expenses);
              setIsLoading(true);
            } else {
              setDeveloperExpenses();
              setIsLoading(true);
            }
          } else {
            alert('>>>>>>To date function Error!', Response.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    })
  };

  const editExpenses = expense2 => {
    dispatch(setEditExpenses(expense2));
    setValue([]);
    setValue1(null);
    navigation.navigate('UpdateFixedExpenses');
  };

  const deleteExpenses = remove => {
    setIsLoading(true);
    setValue([]);
    setValue1(null);
    setIsLoading(false);
    AsyncStorage.getItem(DEV_ID).then(DEV_ID => {
      const developer_id = DEV_ID;
      const deleteID = remove;
      const auth_token = md5(SALT + developer_id + deleteID);

      const deleteData = {
        developer_id: developer_id,
        id: deleteID,
        auth_token: auth_token,
      };
      console.log('deleteData', deleteData);

      axios
        .post(DELETE_FIXED_EXPENSES, deleteData)
        .then(Response => {
          if (Response.data.success) {
            const mes = Response.data;
            console.log('>>>>>>msg fixed delete', mes);
            Alert.alert('Success!', mes.message);
            expenses();
          }
        })
        .catch(err => {
          alert(err);
        });
    })
  };

  const editPayments = expense => {
    dispatch(setEditPayments(expense));
    // setEditPayments1(expense);
    setValue([]);
    setValue1(null);
    navigation.navigate('UpdateReceivedPayments');
  };

  const deletePayments = removePaymentsID => {
    setIsLoading(true);
    setValue([]);
    setValue1(null);
    AsyncStorage.getItem(DEV_ID).then(DEV_ID => {
      const developer_id = DEV_ID;
      const deleteID = removePaymentsID;
      const auth_token = md5(SALT + developer_id + deleteID);

      const deletePaymentsdata = {
        developer_id: developer_id,
        id: deleteID,
        auth_token: auth_token,
      };

      console.log('data2 is', deletePaymentsdata);
      setIsLoading(false);
      axios
        .post(DELETE_RECEIVED_PAYMENTS, deletePaymentsdata)
        .then(Response => {
          if (Response.data.success) {
            const mes = Response.data;
            Alert.alert('Success!', mes.message)
            console.log('>>>>>>>>>mes', mes)
            expenses();
          }
        })
        .catch(err => {
          alert('>>>>>Delete payment error', err);
        });
    })
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <View> */}
      <ToolBar title="Budget Tracker" backBtn={true} />
      <BackgroundColor>
        <ScrollView>
          {/* select User and Date */}
          {isLoading ? (
            <View
              style={{
                flexDirection: 'row',
                // alignItems: 'center',
                justifyContent: 'space-between',
                width: SIZES.width,
                marginTop: 15,
                alignSelf: 'center'
              }}>
              <View style={{ flexDirection: 'column', width: '50%', alignItems: 'center' }}>
                <Dropdown
                  data={items}
                  value={setItems}
                  // value={selected}
                  labelField="name"
                  selectedStyle={style.selectedTextStyle}
                  valueField="id"
                  placeholder="Select User"
                  style={{
                    width: SIZES.width * 0.44,
                    backgroundColor: COLORS.white,
                    borderRadius: 10,
                    elevation: 4,
                  }}
                  selectedTextStyle={{ color: COLORS.black, fontFamily: 'DMSans-Bold', marginLeft: 10 }}
                  placeholderStyle={{
                    marginLeft: 10,
                    color: COLORS.black,
                    fontFamily: 'DMSans-Bold',
                  }}
                  containerStyle={{ borderRadius: 10 }}
                  itemTextStyle={{
                    fontFamily: 'DMSans-Bold',
                    fontWeight: '400',
                    fontSize: 15,
                  }}
                  onChange={value => {
                    console.log('selected user',value);
                    // setSelected(value);
                    userNameSubmit(value)
                  }}
                />
              </View>

              <View style={{ width: '50%' }}>
                <Dropdown
                  data={items1}
                  labelField="label"
                  valueField="value"
                  style={{
                    width: SIZES.width * 0.44,
                    backgroundColor: COLORS.white,
                    borderRadius: 10,
                    elevation: 4,

                  }}
                  placeholder="Select Type"
                  containerStyle={{ borderRadius: 10 }}
                  itemTextStyle={{
                    fontFamily: 'DMSans-Bold',
                    fontWeight: '400',
                    fontSize: 15,
                  }}
                  placeholderStyle={{
                    marginLeft: 10,
                    color: COLORS.black,
                    fontFamily: 'DMSans-Bold',
                  }}
                  // containerStyle={style.dropdownContainer}
                  onChange={value => handleSubmitSpan(value.value)}
                />
              </View>
            </View>
          ) : null}

          {dateSelector1 ? (
            isLoading ? (
              <View style={style.datePicker}>
                <TouchableOpacity
                  style={style.touchDate}
                  onPress={showDatePicker}>
                  {blockFromDate ? (
                    <Text style={style.datePickerText}>From date</Text>
                  ) : (
                    <Text style={style.datePickerText}>{fromDate}</Text>
                  )}
                </TouchableOpacity>
                <DateTimePicker
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideFromDate}
                />

                <TouchableOpacity
                  style={style.touchDate}
                  onPress={() => {
                    if (showToDate) {
                      showDatePicker2();
                    } else {
                      Alert.alert('select from date');
                      setIsLoading(true);
                    }
                  }}>
                  {blockToDate ? (
                    <Text style={style.datePickerText}>To date</Text>
                  ) : (
                    <Text style={style.datePickerText}>{toDate}</Text>
                  )}
                </TouchableOpacity>
                <DateTimePicker
                  isVisible={isDatePickerVisible2}
                  mode="date"
                  onConfirm={handleConfirm2}
                  onCancel={hideToDate}
                  minimumDate={new Date(fromDate)}
                />
              </View>
            ) : (
              <View></View>
            )
          ) : (
            <View></View>
          )}

          {/* developer expenses */}
          {fixedExpenses ? (
            isLoading ? (
              <View style={{ flex: 1 }}>
                <View>
                  {developerExpenses ? (
                    <View style={{ marginTop: 20 }}>
                      <View style={style.developer_expenses_text}>
                        <Text
                          style={{
                            fontFamily: 'DMSans-Bold',
                            fontSize: 16,
                            color: COLORS.black,
                          }}>
                          Developer Expenses
                        </Text>
                      </View>

                      <View style={style.name_container}>
                        <View style={style.TextBox1}>
                          <Text style={style.BudgetText1}>
                            {developerExpenses[0].name}
                          </Text>
                        </View>
                        <View style={style.TextBox1}>
                          <Text style={style.BudgetText1}>
                            {Math.round(developerExpenses[0].hrsTaken)}hrs
                          </Text>
                        </View>
                        <View style={style.TextBox1}>
                          <Text style={style.BudgetText1}>
                            ₹{Math.round(developerExpenses[0].amount)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View></View>
                  )}
                </View>

                {/* Fixed expenses */}
                <View>
                  <View style={style.fixedContainer}>
                    <View>
                      <Text
                        style={{
                          fontFamily: 'DMSans-Bold',
                          fontSize: 16,
                          color: COLORS.black,
                        }}>
                        Fixed Expenses
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={{ flexDirection: 'row' }}
                      onPress={() => {
                        navigation.navigate('AddFixedExpenses', {
                          project_id: project_id
                        });
                        setValue([]);
                        setValue1(null);
                      }}>
                      <MaterialCommunityIcons
                        name="plus"
                        size={20}
                        color={COLORS.black}
                      />
                      <Text style={style.addExpensesText}>Add Expenses</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {addedExpense.length > 0 ? (
                  addedExpense.map((item1, index) => {
                    return (
                      <View style={style.expensesBox} key={index}>
                        <View style={style.TextBox1}>
                          {item1.added_at ? (
                            <Text style={style.BudgetText1}>
                              {item1.added_at}
                            </Text>
                          ) : (
                            <Text style={style.BudgetText1}>--</Text>
                          )}
                        </View>

                        <View style={style.TextBox1}>
                          {item1.amount ? (
                            <Text style={style.BudgetText1}>
                              ₹{item1.amount}
                            </Text>
                          ) : (
                            <Text style={style.BudgetText1}>--</Text>
                          )}
                        </View>
                        <View style={style.TextBox1}>
                          {item1.amount ? (
                            <Text style={style.BudgetText1} numberOfLines={1}>
                              ₹{item1.amount}
                            </Text>
                          ) : (
                            <Text style={style.BudgetText1}>--</Text>
                          )}
                        </View>

                        <View style={style.editButton}>
                          <TouchableOpacity
                            style={style.touchButton}
                            onPress={() => editExpenses(item1)}>
                            <MaterialCommunityIcons
                              name="square-edit-outline"
                              size={20}
                              color="green"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={style.touchButton}
                            onPress={() => deleteExpenses(item1.id)}>
                            <MaterialCommunityIcons
                              name="delete-outline"
                              size={20}
                              color="red"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <View
                    style={{
                      justifyContent: 'space-around',
                    }}>
                    <View style={style.TextBox1}>
                      <Text style={style.BudgetText1}>--</Text>
                    </View>

                    <View style={style.TextBox1}>
                      <Text style={style.BudgetText1}>--</Text>
                    </View>
                    <View style={style.TextBox1}>
                      <Text style={style.BudgetText1}>--</Text>
                    </View>
                  </View>
                )}

                {/* Payments received */}
                <View>
                  <View style={style.payment_receive_txt_container}>
                    <View style={style.payments_received_text}>
                      <Text
                        style={{
                          fontFamily: 'DMSans-Bold',
                          fontSize: 16,
                          color: COLORS.black,
                        }}>
                        Payment Received
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => {
                          setValue([]);
                          setValue1(null);
                          navigation.navigate('AddPayments', {
                            project_id: project_id
                          });
                        }}>
                        <MaterialCommunityIcons
                          name="plus"
                          size={20}
                          color={COLORS.black}
                        />
                        <Text style={style.addExpensesText}>Add Payments</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {addPayments.length > 0 ? (
                  addPayments.map((item, index) => {
                    return (
                      <View style={style.expensesBox} key={index}>
                        <View style={style.TextBox1}>
                          <Text style={style.BudgetText1}>{item.added_at}</Text>
                        </View>

                        <View style={style.TextBox1}>
                          <Text style={style.BudgetText1}>₹{item.amount}</Text>
                        </View>
                        <View style={style.TextBox1}>
                          <Text style={style.BudgetText1}>₹{item.amount}</Text>
                        </View>
                        <View style={style.editButton}>
                          <TouchableOpacity
                            style={style.touchButton}
                            onPress={() => editPayments(item)}>
                            <MaterialCommunityIcons
                              name="square-edit-outline"
                              size={20}
                              color="green"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={style.touchButton}
                            onPress={() => deletePayments(item.id)}>
                            <MaterialCommunityIcons
                              name="delete-outline"
                              size={20}
                              color="red"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <View
                    style={{
                      justifyContent: 'space-around',
                    }}>
                    <View style={style.TextBox1}>
                      <Text style={style.BudgetText1}>--</Text>
                    </View>

                    <View style={style.TextBox1}>
                      <Text style={style.BudgetText1}>--</Text>
                    </View>
                    <View style={style.TextBox1}>
                      <Text style={style.BudgetText1}>--</Text>
                    </View>
                  </View>
                )}

                {/* Total */}
                <View>
                  <View style={style.total_text}>
                    <Text
                      style={{
                        fontFamily: 'DMSans-Bold',
                        fontSize: 16,
                        color: COLORS.black,
                      }}>
                      Total
                    </Text>
                  </View>

                  <View style={style.BudgetBox1}>
                    <View>
                      <Text style={style.BudgetText}>Total Hours :</Text>
                      <Text style={style.BudgetText}>Total Expenses :</Text>
                      <Text style={style.BudgetText}>Budget :</Text>
                      <Text style={style.BudgetText}>Profit :</Text>
                      <Text style={style.BudgetText}>% :</Text>
                      <Text style={style.BudgetText}>Payments Received :</Text>
                      <Text style={style.BudgetText}>Payments Pending :</Text>
                      <Text style={style.BudgetText}>
                        Payment Received as % :
                      </Text>
                    </View>

                    <View style={style.TextBox}>
                      <Text style={style.TextValue}>
                        {Math.round(fixedExpenses.total_hours)}
                      </Text>
                      <Text style={style.TextValue}>
                        ₹{Math.round(fixedExpenses.total_amount)}
                      </Text>
                      <Text style={style.TextValue}>
                        {fixedExpenses.budget_value}
                      </Text>
                      <Text style={style.TextValue}>
                        {Math.round(fixedExpenses.profit)}
                      </Text>
                      <Text style={style.TextValue}>
                        {Math.round(fixedExpenses.profit_percentage)}
                      </Text>
                      <Text style={style.TextValue}>
                        {Math.round(fixedExpenses.total_payments_received)}
                      </Text>
                      <Text style={style.TextValue}>
                        {Math.round(fixedExpenses.payments_pending)}
                      </Text>
                      <Text style={style.TextValue}>
                        {fixedExpenses.percentage_based_on_payments}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <LoaderModal />
            )
          ) : (
            <LoaderModal />
          )}
        </ScrollView>
      </BackgroundColor>
      {/* </View> */}
    </SafeAreaView>
  );
};

export default Training;

const style = StyleSheet.create({
  developer_expenses_text: {
    alignItems: 'flex-start',
    marginTop: 20,
    width: '92%',
    alignSelf: 'center',
  },
  total_text: {
    alignItems: 'flex-start',
    marginTop: 30,
    width: '92%',
    alignSelf: 'center',
  },
  BudgetText1: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: COLORS.gray1,
    fontWeight: '600',
  },
  fixedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    width: '92%',
    alignSelf: 'center',
  },
  addExpensesText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    color: COLORS.black,
    top: 1,
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    height: 40,
  },
  touchDate: {
    backgroundColor: COLORS.white,
    width: '25%',
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    elevation: 4,
    borderRadius: 5,
  },
  datePickerText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: COLORS.pure,
  },
  name_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '93%',
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 20,
    elevation: 8,
  },
  TextBox1: {
    padding: 7,
    marginTop: 5,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expensesBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '93%',
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 20,
    elevation: 8,
  },
  payment_receive_txt_container: {
    flexDirection: 'row',
    width: '92%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  BudgetBox1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '93%',
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 20,
    elevation: 8,
    padding: 15,
  },
  BudgetText: {
    fontFamily: 'DMSans-Bold',
    marginTop: 25,
    color: COLORS.black,
    fontSize: 15,
  },
  TextValue: {
    fontFamily: 'DMSans-Regular',
    marginTop: 25,
    color: COLORS.gray1,
    fontSize: 14,
  },
  TextBox: {
    marginRight: 10,
  },
  selectedTextStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.2,
    borderColor: COLORS.pure,
    alignSelf: 'center',
  }
});