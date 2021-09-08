const DECIMAL_PLACES = 1000000000000; //TODO - get from config, but need to make injectable class. Now it seems to be a lot of new things to try and learn.

export const convertBalance = (balance) => {
  const result = balance.toString() / DECIMAL_PLACES;
  return result;
};
