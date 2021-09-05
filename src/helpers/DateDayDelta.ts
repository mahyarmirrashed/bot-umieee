const dateDayDelta = (d1: Date, d2: Date): number =>
  Math.floor(
    (Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate()) -
      Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate())) /
      (1000 * 60 * 60 * 24),
  );

export default dateDayDelta;
