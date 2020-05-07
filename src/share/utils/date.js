import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const holidays = [
  {
    name: `New Year's Day`,
    range: [new Date(`2020-01-01 00:00:00`)],
  },
  {
    name: `Spring Festival`,
    range: [new Date(`2020-01-24 00:00:00`), new Date(`2020-01-30 00:00:00`)],
  },
  {
    name: `Tomb Sweeping`,
    range: [new Date(`2020-04-04 00:00:00`), new Date(`2020-04-06 00:00:00`)],
  },
  {
    name: `Labor Day`,
    range: [new Date(`2020-05-01 00:00:00`), new Date(`2020-05-05 00:00:00`)],
  },
  {
    name: `The Dragon Boat Festival`,
    range: [new Date(`2020-06-25 00:00:00`), new Date(`2020-06-27 00:00:00`)],
  },
  {
    name: `The Mid-Autumn Festival`,
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
