export const timestampToDateTime = (stamp: number): string => {
  const date = new Date(stamp * 1000)
  return date.toLocaleString()
}