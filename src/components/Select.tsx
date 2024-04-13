import React from 'react';
import Select from 'react-select';
// import Icon from "./Icon";

const CustomSelect = (props: any) => {
  const selectTheme: any = (theme: any) => {
    return {
      ...theme,
      borderRadius: '8px',
      colors: {
        ...theme.colors,
        primary50: '#EFE9FC',
        primary25: '#F9F9FB',
        primary: '#EFE9FC',
        danger: '#EF4444',
        neutral20: '#9A9CB0',
        neutral50: '#9A9CB0',
        neutral80: '#000000',
      },
    };
  };

  const validate = () => {
   return  props.hasOwnProperty('errorClass') && props.errorClass.trim().length > 0 
  }

  const colourStyles: any = {
    control: (styles: any, { isDisabled }: any) => ({
      ...styles,
      backgroundColor: 'white',
      padding: '0px 8px',
      height: 'fit-content',
      outline: '0',
      fontSize: '14px',
      fontFamily: 'Figtree',
      fontWeight: '400',
      lineHeight: '20px',
      minHeight: '46px',
      borderRadius: '12px',
      width: `${props.width ? props.width : '100%'}`,
      border: `1px solid ${validate()? '#E54848' : '#F1F5F9'}`,
      ':focus-within': {
        border: `1px solid ${validate() ? '#E54848' : '#64748B'}!important`,
      },
      ':hover': {
        border: `1px solid ${validate() ? '#E54848' : '#D6D3FD'}`,
      },
    }),
    option: (styles: any, state: any) => {
      return {
        ...styles,
        textTransform:'none',
        padding: '6px 16px',
        marginTop:'2px',
        marginBottom:'2px',
        backgroundColor: state.isSelected ? '#F1F5F9' : 'white',
        color:state.isSelected ?  '#000' : state.isDisabled ? '#E2E8F0' :'#000',
        fontSize: state.isDisabled ? '14px' : '14px',
        fontFamily: 'Figtree',
        fontWeight: '400',
        lineHeight: '20px',
        borderRadius: state.isSelected ? '6px' : '0px',
        ':hover': {
          backgroundColor:state.isSelected ? '#F1F5F9' : state.isDisabled ? 'transparent' :'#F1F5F9',
          borderRadius: state.isSelected ? '6px' : state.isDisabled ? '0px' :'6px',
        },
      };
    },
    singleValue: (provided: any) => ({
      ...provided,
      color: `${props.color ? props.color : '#1E293B'}`,
      fontSize: '14px',
      fontFamily: 'Figtree',
      fontWeight: '400',
      margin: '0px',
    }),
    multiValue: (styles: any) => {
      return {
        ...styles,
        backgroundColor: '#F2EDFC',
        color: '#B592F6',
        borderRadius: '4px',
        overflow: 'hidden',
      };
    },
    multiValueLabel: (styles: any) => {
      return {
        ...styles,
        color: '#814CD6',
        fontFamily: '"Inter",sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '20px',
      };
    },
    indicatorSeparator: (styles: any) => {
      return { ...styles, display: 'none' };
    },
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      display: 'none', // Hide the dropdown indicator
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#94A3B8', // Change the color to your preferred color
    }),
    menu: (provided: any) => ({
      ...provided,
      width: '300px',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      background: '#FFF',
      padding: '10px 6px',
      boxShadow: '0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)',
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 99999,
    }),
    group: (provided: any,state:any) => ({
      ...provided,
      fontFamily: 'Figtree',
      textTransform: 'uppercase',
      //cursor: state.isDisabled ? 'not-allowed' : 'default',
    }),
    
  };

  const filterOption = (option: any, searchText: any) => {
    if (option.data.label.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Select
      styles={colourStyles}
      menuPortalTarget={document.body}
      menuPosition={'fixed'}
      theme={(theme) => selectTheme(theme)}
      filterOption={filterOption}
      {...props}
    />
  );
};

// const StyledSelect = styled.div`
// 	position: relative;

// 	.leftIcon {
// 		position: absolute;
// 		top: 14px;
// 		left: 12px;
// 		pointer-events: none;
// 	}

// 	.error {
// 		color: ${(props:any) => props.theme.colors.danger[400]};
// 		font-size: 0.9rem;
// 		height: 20px;
// 		font-family: ${(props:any) => props.theme.fonts.secondary};
// 		font-weight: 400;
// 		font-size: 14px;
// 		line-height: 20px;
// 	}
// `;

CustomSelect.defaultProps = {
  options: [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ],
};
export default CustomSelect;
