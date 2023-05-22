import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const COLORS = {
  primary: '#FF002E', // Red

  pure: '#01C2A5',
  white: '#fff',
  black: '#000000',
  blackTextColor : '#242625',
  blue: '#4096FE',
  gray: '#F4F6F9',
  gray1: '#363636',
  lightGray: '#dedede',
  transparentWhite: 'rgba(255, 255, 255, 0.2)',
  transparentBlack: 'rgba(0, 0, 0, 0.4)',
  green: '#05a153',
  green1: '#64fbb0',
  red1: '#f28989',
  red: '#f41313',
  yellow1: '#f4f374',
  yellow: '#C09B04',
};

export const SIZES = {
  base: 8,
  font: 18,
  radius: 14,
  radius_16: 16,
  padding: 12,

  max: 125,
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  h5: 12,

  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimesions...
  width,
  height,
};

export const FONTS = {
  largeTitle: {fontFamily: 'Monstserrat-Bold', fontSize: SIZES.largeTitle},

  h1: {fontFamily: 'Monstserrat-SemiBold', fontSize: SIZES.h1, lineHeight: 36},
  h2: {fontFamily: 'Monstserrat-SemiBold', fontSize: SIZES.h2, lineHeight: 30},
  h3: {fontFamily: 'Monstserrat-SemiBold', fontSize: SIZES.h3, lineHeight: 22},
  h4: {fontFamily: 'Monstserrat-SemiBold', fontSize: SIZES.h4, lineHeight: 22},
  h5: {fontFamily: 'Monstserrat-SemiBold', fontSize: SIZES.h5, lineHeight: 20},

  body1: {
    fontFamily: 'Monstserrat-Italic',
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: 'Monstserrat-Light',
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontFamily: 'Monstserrat-Regular',
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    fontFamily: 'Monstserrat-Bold',
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
  body5: {
    fontFamily: 'Monstserrat-Light',
    fontSize: SIZES.body5,
    lineHeight: 20,
  },

  company_name: {
    fontSize: 22,
    color: COLORS.black,
    fontFamily: 'DMSans-Bold',
  },
  profile_heading: {
    fontSize: 16,
    color: COLORS.black,
    marginTop: 15,
    fontFamily: 'DMSans-Bold',
  },
  profile_subheading: {
    fontSize: 14,
    marginTop: 10,
    fontFamily: 'DMSans-Bold',
    color : "#808080"
  },
};
const appTheme = {COLORS, SIZES, FONTS};

export default {appTheme};
