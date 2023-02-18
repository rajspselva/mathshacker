export const uniqueNumber = (numbers = [], maxVal) => {
  const number = Math.floor(Math.random() * maxVal + 1);
  if (!numbers.includes(number)) {
    numbers.push(number);
    return number;
  } 
  if (numbers.length - 1 !== maxVal) {
    this.uniqueNumber(maxVal);
  }
  return null;
};

export const getRandomNumber = (max) => {
  const numbers = [];
  return uniqueNumber(numbers, max);
};