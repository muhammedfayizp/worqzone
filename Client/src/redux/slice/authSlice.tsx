import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthSliceState{
    isloggedIn:boolean,
    token:string,
    role:string;
    name: string;
    email: string;
    phone: string;
}

const initialState:AuthSliceState={
    isloggedIn:!!localStorage.getItem('accessToken'),
    token:localStorage.getItem('accessToken')||'',
    role:localStorage.getItem('role')||'',
    name: localStorage.getItem('name') || '',
    email: localStorage.getItem('email') || '',
    phone: localStorage.getItem('phone') || ''
}
const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        loginSuccess:(state,action: PayloadAction<{token:string,role:string; name: string; email: string; phone: string;}>)=>{
            localStorage.setItem('accessToken',action.payload.token);
            localStorage.setItem('role',action.payload.role);
            localStorage.setItem('name', action.payload.name);
            localStorage.setItem('email', action.payload.email);
            localStorage.setItem('phone', action.payload.phone);
            state.isloggedIn = true;
            state.token = action.payload.token; 
            state.role = action.payload.role;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.phone = action.payload.phone;
        },
        logout:(state)=>{
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
            localStorage.removeItem('name');
            localStorage.removeItem('email');
            localStorage.removeItem('phone');
            state.isloggedIn = false;
            state.token = '';
            state.role = '';
            state.name = '';
            state.email = '';
            state.phone = '';
        }
    }
})



export const {loginSuccess,logout}=authSlice.actions
export default authSlice.reducer