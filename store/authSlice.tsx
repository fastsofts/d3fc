"use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface initialState{
    data:Array<string>;
    loading:boolean;
    error:Array<string>;
 }
 
 const initialState = {
   data: [],
   error:[],
   loading: true,
 };
 

const authSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    GET_SAMPLE: (state:any,action:any) => {
        state.push({
            data: action.payload,
            loading: false,
          })    
    },
    SAMPLE_ERROR: (state:any,action:any) => {
        state.push({
            data: false,
            error: action.payload
          }) 
    },
  },
});

export const { GET_SAMPLE, SAMPLE_ERROR } = authSlice.actions;
export default authSlice.reducer;