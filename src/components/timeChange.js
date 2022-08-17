// // 变量
// const myTime1 = 1628990100000;
// const myTime2 = 'Sun Aug 15 2021 09:15:00 GMT+0800 (中国标准时间)';

// 实现方法 @return 返回2个值，一个是带时分秒，另一个不带。
// eslint-disable-next-line space-before-function-paren
export const msToDate = (msec) => {
  const datetime = new Date(msec);
  const year = datetime.getFullYear();
  const month = datetime.getMonth();
  const date = datetime.getDate();
  const hour = datetime.getHours();
  const minute = datetime.getMinutes();
  const second = datetime.getSeconds();

  const result1 = year +
    '-' +
    ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
    '-' +
    ((date + 1) < 10 ? '0' + date : date) +
    ' ' +
    ((hour + 1) < 10 ? '0' + hour : hour) +
    ':' +
    ((minute + 1) < 10 ? '0' + minute : minute) +
    ':' +
    ((second + 1) < 10 ? '0' + second : second);

  const result2 = year +
    '-' +
    ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
    '-' +
    ((date + 1) < 10 ? '0' + date : date);

  const result = {
    hasTime: result1,
    withoutTime: result2
  };

  return result;
};

// // 例子
// console.log(msToDate(myTime1).hasTime);// 2021-08-15 9:15:00
// console.log(msToDate(myTime1).withoutTime);// 2021-08-15
// console.log(msToDate(myTime2).hasTime);// 2021-08-15 9:15:00
// console.log(msToDate(myTime2).withoutTime);// 2021-08-15
