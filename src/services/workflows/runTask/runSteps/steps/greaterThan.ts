const greaterThan = async (
  [input, threshold]: [string, number | string],
  interpolate: (value: string) => Promise<string>
) => {
  const interpolatedInput = await interpolate(input);
  const interpolatedThreshold = await interpolate(threshold.toString());

  const numericInput = Number(interpolatedInput);
  const numericThreshold = Number(interpolatedThreshold);

  // TODO: This is tricky - need some unit tests here!
  if (!Number.isFinite(numericInput)) {
    throw new Error(`Could not convert input ${interpolatedInput} to a number`);
  }

  if (!Number.isFinite(numericThreshold)) {
    throw new Error(`Could not convert threshold ${threshold} to a number`);
  }

  return numericInput > numericThreshold;
};

export default greaterThan;
