
const DAY_MAP: { [key: number]: string } = {
  0: 'ma',
  1: 'ti',
  2: 'ke',
  3: 'to',
  4: 'pe',
  5: 'la',
  6: 'su',

}
export default function useDateformatter() {
  return function (pvm: Date): string {
    return (
      `${DAY_MAP[pvm.getDay()]} ${pvm.getDate()}.${pvm.getMonth()}.${pvm.getFullYear()}`
    );
  };
}