export function getDate() {
  if (typeof moment === "undefined") {
    const now = new Date();
    now.setHours(now.getHours() + 7);
    return now;
  }

  return moment().add(7, "hours").toDate();
}
