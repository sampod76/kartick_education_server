/* eslint-disable @typescript-eslint/no-inferrable-types */
export type ITimeFream =
  | 'weekly'
  | '15days'
  | 'monthly'
  | 'biannual'
  | 'yearly'
  | '2years'
  | '3years'
  | 'customDay';

export default function calculateNextBillingDate(
  selectedPackage: ITimeFream,
  day = 1,
) {
  const currentDate = new Date();

  switch (selectedPackage) {
    case 'customDay':
      currentDate.setDate(currentDate.getDate() + day);
      break;
    case 'weekly':
      currentDate.setDate(currentDate.getDate() + 7);
      break;

    case '15days':
      currentDate.setDate(currentDate.getDate() + 15);
      break;

    case 'monthly':
      currentDate.setMonth(currentDate.getMonth() + 1);
      break;

    case 'biannual':
      currentDate.setMonth(currentDate.getMonth() + 6);
      break;

    case 'yearly':
      currentDate.setFullYear(currentDate.getFullYear() + 1);
      break;

    case '2years':
      currentDate.setFullYear(currentDate.getFullYear() + 2);
      break;

    case '3years':
      currentDate.setFullYear(currentDate.getFullYear() + 3);
      break;

    default:
      return null;
  }

  return currentDate;
}
