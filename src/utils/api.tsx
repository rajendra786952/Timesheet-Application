import { resetEmploy } from '@/app/features/employ/employSlice';
import { resetFilter } from '@/app/features/filter/filterSlice';
import { logOutUser } from '@/app/features/user/userSlice';
import store  from '@/app/store';
import axios, { AxiosInstance } from 'axios';

export const BASE_URL = '';


const axiosJSON: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const setToken = () => {
  let { token }:{token:any} = store.getState().user;
    // token = token === null ? sessionStorage.getItem('token') : token;
    if (token) {
      axiosJSON.defaults.headers['token']=token;
    }
}


axiosJSON.interceptors.request.use(
  config => {
    setToken()
    return config
  },
  error => {
    // Promise.reject(error)
  }
);

axiosJSON.interceptors.response.use(
  res => {
    if(res.data.status_code === 440 && res.data.response.trim() === 'Session Timeout or Invalid Token.'){
      delete axiosJSON.defaults.headers['token'];
      store.dispatch(logOutUser());
      store.dispatch(resetEmploy());
      store.dispatch(resetFilter());
    }
    return res
  },
  error => {
    console.log('axious error = ',error);
    // Promise.reject(error)
  }
);


export default axiosJSON;
