import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import icons from '../constants/icons';
import BackgroundColor from '../components/BackgroundColor';
import ToolBar from '../components/ToolBar';
import { COLORS, SIZES } from '../constants';
import { LIST_ALL_PROJECTS, SALT } from '../constants/API_constants';
import { DEV_ID } from '../constants/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import md5 from 'md5';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import LoaderModal from '../components/LoaderModal';
import { useDispatch } from 'react-redux';
import { setProjectID } from '../redux/Slice/User';

const ListAllProjects = () => {

  const dispatch = useDispatch();

  const [name, setName] = useState('');

  const [isLoading, setIsLoading] = useState();

  const navigation = useNavigation();

  const allProjects = () => {
    setIsLoading(true);
    AsyncStorage.getItem(DEV_ID).then(DEV_ID => {
      // console.log('name :',json)
      const data = {
        developer_id: DEV_ID,
        auth_token: md5(SALT + DEV_ID),
      };
      // console.log(data);

      axios
        .post(LIST_ALL_PROJECTS, data)
        .then(response => {
          // console.log(response.data);
          setName(response.data.parameters);
          const res = response.data.parameters;
          console.log(res);

          setIsLoading(false);
        })
        .catch(function (error) {
          setIsLoading(false);
          console.log(error);
        });
    });
  };

  useEffect(() => {
    console.log('yes');
    allProjects('');
  }, []);

  return (
    <SafeAreaView style={style.container}>
      <LoaderModal modalVisible={isLoading} />
      <ToolBar title="Project List" backBtn={true} />
      <BackgroundColor>
        <View style={{flex:1}}>
          <FlatList
            data={name}
            renderItem={({ item }) => (
              // console.log('>>>>>>>>>>>>>>>',item.name),
              // <ProjectName data={item} />
              <View style={style.btns}>
                <TouchableOpacity
                  style={style.tt}
                  onPress={() => {
                    navigation.navigate('Training', {
                      ProjectId: item.id_string,
                      ProjectName: item.name,
                      project_details: item,
                    })
                    dispatch(setProjectID(item.id_string))
                    console.log('>>>>>>>', item.id_string)
                    console.log('>>>>>', item.name)
                    console.log('>>>>>>>>>>>', item)
                  }}>
                  <Image
                    source={icons.TT}
                    style={{ width: 50, height: 50, tintColor: COLORS.pure, marginLeft: 15 }}
                  />
                  <Text
                    style={{
                      fontFamily: 'DMSans-Bold',
                      fontSize: 16,
                      color: COLORS.black,
                      marginLeft: 10,
                    }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </BackgroundColor>
    </SafeAreaView>
  );
};

export default ListAllProjects;

const style = StyleSheet.create({
  container: {
    width: SIZES.width,
    height: SIZES.height,
    // flex: 1
  },
  btns: {
    alignItems: 'center',
    marginBottom:20,
    justifyContent: 'center'
  },
  tt: {
    flexDirection: 'row',
    width: '80%',
    height: 80,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    elevation: 4
  },
});
