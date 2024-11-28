module.exports.AccountGen = () => {
  const numPool = "1234567890";

  let accountNumber = "";

  for (let i = 0; i <= numPool.length; i++) {
    accountNumber += [Math.floor(Math.random() * 10)];
  }

  return accountNumber;
};
