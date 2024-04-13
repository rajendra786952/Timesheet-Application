

export const getNewValueOnBlur = (value: string): string => {
  const inputValue = value;
  const regex = /:/g;
  const colonCount = inputValue.match(regex)?.length;
  const isLastCharacterColon = regex.test(inputValue.slice(-1));
  const colonIndex = inputValue.indexOf(':');
  let updatedValue: string = '00:00';

  if (inputValue.length === 1) {
    if (colonCount !== 1) {
      updatedValue = '0' + inputValue + ':00';
    } else {
      updatedValue = '00:00';
    }
  } else if (inputValue.length === 2) {
    if (isLastCharacterColon) {
      updatedValue = '0' + inputValue + '00';
    } 
    else if(colonCount !== 1){
        updatedValue = inputValue+':00';
    }
    else{
      const splittedValue = inputValue.split(':');
      updatedValue = '00:0' + splittedValue[1];
    }
  } else if (inputValue.length === 3) {
    if (colonIndex === 2) {
      updatedValue = inputValue + '00';
    } else if (colonIndex === 1) {
      const splittedValue = inputValue.split(':');
      updatedValue = '0' + splittedValue[0] + ':0' + splittedValue[1];
    } else {
      updatedValue = '00' + inputValue;
    }
  } else if (inputValue.length === 4) {
    if (colonIndex === 1) {
      updatedValue = '0' + inputValue;
    } else  {
      let splitValue = inputValue.split(':');
      updatedValue =  splitValue[0]+':0'+splitValue[1];
    }
  } else {
    updatedValue = inputValue;
  }

  return updatedValue;
};
