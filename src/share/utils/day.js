import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { holidays } from './holidays';

dayjs.extend(isBetween);

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
