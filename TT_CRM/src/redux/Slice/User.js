import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  parameters: '',
  projects: '',
  projectID:'',
  projectUsers: '',
  leaveRequests :'',
  expenses: '',
  userID: '',
  editExpenses: '',
  editPayments : '',
};

const userSlicer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    setUser: (state, action) => ({...state, parameters: action.payload}),
    setProjects: (state, action) => ({...state, projects: action.payload}),
    setProjectUsers: (state, action) => ({
      ...state,
      projectUsers: action.payload,
    }),
    setProjectID:(state,action)=>({...state,projectID:action.payload}),
    setLeaveRequests : (state,action)=>({...state,leaveRequests:action.payload}),
    setExpenses: (state, action) => ({...state, expenses: action.payload}),
    setFixedExpenses: (state, action) => ({
      ...state,
      fixedExpenses: action.payload,
    }),
    setUserID: (state, action) => ({...state, userID: action.payload}),
    setEditExpenses: (state,action) => ({...state, editExpenses: action.payload}),
    setEditPayments: (state,action) => ({...state, editPayments: action.payload}),
  },
});
export default userSlicer.reducer;

export const {
  setUser,
  setProjects,
  setProjectUsers,
  setExpenses,
  setFixedExpenses,
  setUserID,
  setEditExpenses,
  setEditPayments,
  setProjectID,
  setLeaveRequests
} = userSlicer.actions;
