const length = async (
  input: string,
  interpolate: (value: string) => Promise<string>
) => {
  const interpolatedInput = await interpolate(input);
  return interpolatedInput.length;
};

export default length;
