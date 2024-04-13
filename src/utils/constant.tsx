import { Like1, ClipboardTick, Notification1 } from "iconsax-react";

export const PROJECTLIST = [
    { label: 'Log1', value: 'log1' },
    { label: 'Beats', value: 'beats' },
    { label: 'Aleye Health', value: 'Aleye Health' },
    { label: 'Inclusive+', value: 'Inclusive+' },
    { label: 'Softphone', value: 'Softphone' },
    { label: 'Yash Technologies', value: 'Yash Technologies' },
  ];
export const ButtonStatus: any = {
    Approved: { bg: 'success.100', color: 'success.300', icon: <Like1 size="14" color="#159D70" />, title: 'Approved' },
    Rejected: { bg: 'error.100', color: 'error.300', icon: <Like1 size="14" color="#E54848" />, title: 'Rejected' },
    Submitted: {
      bg: 'warning.100',
      color: 'warning.300',
      icon: <ClipboardTick size="14" color="#EDA302" />,
      title: 'Submitted',
    },
    Submit: {
      bg: 'primary.100',
      color: 'primary.300',
      icon: <ClipboardTick size="14" color="#5A50E0" className="submit-icon" />,
      title: 'Submit',
    },
    'Not Filled': {
      bg: 'neutral.200',
      color: 'neutral.600',
      icon: <Notification1 size="14" color="#64748B" />,
      title: 'Not Filled',
    },
  };
 export const TESTMOCKLIST =[
    {
      "test_id": 2144,
      "companies": {
          "client": "CVS",
          "vendor": "Verticalmove, Inc."
      },
      "consultant": {
          "id": 948,
          "name": "Jyothsna Maharna"
      },
      "submit_date": "2023-04-14",
      "assign_to": [
          {
              "employee_id": 2864,
              "name": "Jayesh rathore"
          },
          {
              "employee_id": 2895,
              "name": "Niraj Kumar Lathar"
          },
          {
              "employee_id": 2922,
              "name": "Rutvik Kapade"
          }
      ],
      "submit_month": "2023-04"
  },
  {
      "test_id": 2158,
      "companies": {
          "client": "McKinsey & Company",
          "vendor": "McKinsey & Company"
      },
      "consultant": {
          "id": 1070,
          "name": "Mohammed Abdul Moid Arif"
      },
      "submit_date": "2023-04-24",
      "assign_to": [
          {
              "employee_id": 2895,
              "name": "Niraj Kumar Lathar"
          },
          {
              "employee_id": 2922,
              "name": "Rutvik Kapade"
          },
          {
              "employee_id": 2881,
              "name": "Shruti Itoria"
          }
      ],
      "submit_month": "2023-04"
  },
  {
      "test_id": 2156,
      "companies": {
          "client": "TBD",
          "vendor": "TEKsystems"
      },
      "consultant": {
          "id": 514,
          "name": "Chintan Modi"
      },
      "submit_date": "2023-04-21",
      "assign_to": [
          {
              "employee_id": 2909,
              "name": "Prerna Chitransh"
          },
          {
              "employee_id": 2922,
              "name": "Rutvik Kapade"
          },
          {
              "employee_id": 2881,
              "name": "Shruti Itoria"
          }
      ],
      "submit_month": "2023-04"
  },
  {
      "test_id": 2143,
      "companies": {
          "client": "Centene",
          "vendor": "Apex Systems"
      },
      "consultant": {
          "id": 1018,
          "name": "Vaibhav Ashokkumar Parmar"
      },
      "submit_date": "2023-04-12",
      "assign_to": [
          {
              "employee_id": 2907,
              "name": "Darshan hirekurubar"
          },
          {
              "employee_id": 2927,
              "name": "Prakhar Patidar"
          },
          {
              "employee_id": 2922,
              "name": "Rutvik Kapade"
          }
      ],
      "submit_month": "2023-04"
  },
  {
      "test_id": 2136,
      "companies": {
          "client": "TBD",
          "vendor": "Beacon Hill Staffing Group LLC"
      },
      "consultant": {
          "id": 490,
          "name": "Pratik Matkar"
      },
      "submit_date": "2023-04-06",
      "assign_to": [
          {
              "employee_id": 10009,
              "name": "Chinmay Raiker"
          },
          {
              "employee_id": 2849,
              "name": "Nitin Dwivedi"
          },
          {
              "employee_id": 2922,
              "name": "Rutvik Kapade"
          }
      ],
      "submit_month": "2023-04"
  },
  {
      "test_id": 2140,
      "companies": {
          "client": "Corteva",
          "vendor": "Paragon It Professionals"
      },
      "consultant": {
          "id": 1033,
          "name": "Venkata Sai Karthik Pabbisetty"
      },
      "submit_date": "2023-04-07",
      "assign_to": [
          {
              "employee_id": 2943,
              "name": "Harsh Singhal"
          },
          {
              "employee_id": 2922,
              "name": "Rutvik Kapade"
          },
          {
              "employee_id": 2879,
              "name": "Sandeep Makwana"
          }
      ],
      "submit_month": "2023-04"
  }
  ]