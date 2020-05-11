import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const holidays = [
  {
    name: `元旦`,
    range: [new Date(`2020-01-01 00:00:00`)],
  },
  {
    name: `春节`,
    range: [new Date(`2020-01-24 00:00:00`), new Date(`2020-01-30 00:00:00`)],
  },
  {
    name: `清明节`,
    range: [new Date(`2020-04-04 00:00:00`), new Date(`2020-04-06 00:00:00`)],
  },
  {
    name: `劳动节`,
    range: [new Date(`2020-05-01 00:00:00`), new Date(`2020-05-05 00:00:00`)],
  },
  {
    name: `端午节`,
    range: [new Date(`2020-06-25 00:00:00`), new Date(`2020-06-27 00:00:00`)],
  },
  {
    name: `中秋节`,
    range: [new Date(`2020-10-01 00:00:00`), new Date(`2020-10-08 00:00:00`)],
  },
];

export const isHoliday = (date) => {
  let result = false;
  let holidayName = ``;

  for (const { range, name } of holidays) {
    result = dayjs(date).isBetween(range[0], range[1] || range[0], null, `[]`);
    if (result) {
      holidayName = name;
      break;
    }
  }

  return [result, holidayName];
};

export const toDay = (date) => dayjs(new Date(date)).format(`YYYY-MM-DD`);

export const toTime = (time) => dayjs(new Date(time)).format(`YYYY-MM-DD HH:mm`);

export default dayjs;
