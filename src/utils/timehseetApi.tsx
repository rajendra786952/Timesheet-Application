import { format } from "date-fns";
import axiosJSON from "./api";
import { getISTDate } from "./timesheet";

export const getProjectByEmpId = async (emp_id:Number,month:Number) => {
    return await axiosJSON.get(`get-emp-projects?emp_id=${emp_id}&month=${month}`);
};
export const getTaskByEmpId = async (params:any) => {
    const httpParam = getParam(params);
    return await axiosJSON.get(`get-emp-tasks?${httpParam}`);
};
export const getTimehseetByDate = async (params:any) => {
    const httpParam = getParam(params);
    return await axiosJSON.get(`get-timesheet-data?${httpParam}`);
};
export const addTimesheetByDate = async (body:any) => {
    return await axiosJSON.post(`add-tms-data`,body);
};
export const updateTimesheetStatus = async (body:any) => {
  return await axiosJSON.put(`update-tms-status`,body);
};
export const updateEmployTimesheetStatus = async (body:any) => {
  return await axiosJSON.put(`resubmit-tms-data`,body);
};
export const getSearchEmploy = async (params:any) => {
  const httpParam = getParam(params);
  return await axiosJSON.get(`search-emp-details?${httpParam}`);
};

const getParam = (param:any) => {
  let headerParam ='';
  if(Object.keys(param).length > 0){
    for(let i in param)
     headerParam+=`${i}=${param[i]}&`
    headerParam=headerParam.slice(0,-1)
  }
  return headerParam;
}

const getOption = (option:any) => {
 let list=[];
  for(let i of option){
    list.push({label:i,value:i})
  }
  return list;
}

export const getTestOption = (option:any,uniquePair:any=[]) => {
  let list=[];
  for(let i of option){
    list.push({label:`Test-${i.test_id}`,value:i.test_id,isDisabled:uniquePair.includes(`test-${i.test_id}`)})
  }
  return list;
}

export let interviewList:any=[];
export let testList:any=[];
export let projectList:any=[];
// export let otherList:any=[];
export let supportList:any=[];
export let productList:any=[];
export let trainingList:any=[];
export let selfLearningList:any = [];
export let taskType:any={interview:[],test:[],other:[],support:[],Product:[],Training:[],'self-learning':[]};


export const getInterviewList = async (emp_id:any,getToast:any) => {
  try{
   let res = await getTaskByEmpId({ emp_id, type: 'interview',submit_month:'' });
   if(res.data?.status_code === 200 ){
    interviewList = getOption(res?.data?.response?.tasks);
    taskType['interview'] = interviewList;
   }
   else{
    getToast('Error', res.data?.message);
   }
  }
  catch(error:any){
    getToast('Error', error?.message?.toString());
  }
}

export const getTestList = async (emp_id:any,date:any,getToast:any) => {
  try{
  let res = await getTaskByEmpId({ emp_id, type: 'test',submit_month:date});
  if(res.data?.status_code === 200 ){
    // testList= getTestOption( res?.data?.response?.data.length > 0 ? res?.data?.response?.data:TESTMOCKLIST);
    testList= getTestOption(res?.data?.response?.data);
    taskType['test']=testList;
  }
  else{
    getToast('Error', res.data?.message);
  }
  }
  catch(error:any){
    getToast('Error', error?.message?.toString());
  }
}

// export const getOtherList = async (emp_id:any,getToast:any) => {
//   try{
//   let res = await getTaskByEmpId({ emp_id, type: 'other',submit_month:'' });
//   if(res.data?.status_code === 200 ){
//     otherList = getOption(res?.data?.response?.tasks);
//     taskType['other']=otherList;
//   }
//   else{
//     getToast('Error', res.data?.message);
//   }
//   }
//   catch(error:any){
//     getToast('Error', error?.message?.toString());
//   }
// }

export const getSupportList = async (emp_id:any,getToast:any) => {
  try{
  let res = await getTaskByEmpId({ emp_id, type: 'support',submit_month:'' });
  if(res.data?.status_code === 200 ){
    supportList = getOption(res?.data?.response?.tasks);
    taskType['support'] = supportList;
  }
  else{
    getToast('Error', res.data?.message);
  }
  }
  catch(error:any){
    getToast('Error', error?.message?.toString());
  }
}

export const getProductList = async (emp_id:any,getToast:any) => {
  try{
  let res = await getTaskByEmpId({ emp_id, type: 'Product',submit_month:'' });
  if(res.data?.status_code === 200 ){
    productList = getOption(res?.data?.response?.tasks);
    taskType['Product'] = productList;
  }
  else{
    getToast('Error', res.data?.message);
  }
  }
  catch(error:any){
    getToast('Error', error?.message?.toString());
  }
}

export const getTrainingList = async (emp_id:any,getToast:any) => {
  try{
  let res = await getTaskByEmpId({ emp_id, type: 'Training',submit_month:''});
  if(res.data?.status_code === 200 ){
    trainingList = getOption(res?.data?.response?.tasks);
    taskType['Training'] = trainingList;
  }
  else{
    getToast('Error', res.data?.message);
  }
  }
  catch(error:any){
    getToast('Error', error?.message?.toString());
  }
}


export const getSelfLearningList = async (emp_id:any,getToast:any) => {
  try{
  let res = await getTaskByEmpId({ emp_id, type: 'self-learning',submit_month:''});
  if(res.data?.status_code === 200 ){
    selfLearningList = getOption(res?.data?.response?.tasks);
    taskType['self-learning'] = selfLearningList;
  }
  else{
    getToast('Error', res.data?.message);
  }
  }
  catch(error:any){
    getToast('Error', error?.message?.toString());
  }
}


export const getProjectList = async (emp_id:any,month:any,getToast:any) => {
  try{
    const response = await getProjectByEmpId(emp_id,month);
    if(response.data?.status_code === 200 ){
      //let list=[{"id": 1380,"display_name": "1380:Bloomberg","type": "support",label:"1380:Bloomberg",value:1380}];
      let list=[];
      for(let i of response?.data?.response)
       list.push({...i,label:i.display_name,type:i.type, value: i?.type === 'support' || i?.type === 'Product' || i?.type === 'Training' ? i.id : i.type })
      projectList=list;
    }
    else{
      getToast('Error', response.data?.message);
    }
  }
  catch(error:any){
    getToast('Error', error?.message?.toString());
  }
};
