export const omitData = <T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> => {
  const result = { ...obj }; // Create a copy of the object
  keys.forEach((key) => delete result[key]);
  return result;
};
