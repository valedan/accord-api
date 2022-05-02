interface Condition {
  condition: string;
  true: string;
  false: string;
}

const ifCondition = async (
  { condition, true: ifTrue, false: ifFalse }: Condition,
  interpolate: (value: string) => Promise<string>
) => {
  const interpolatedInput = await interpolate(condition);
  const interpolatedIfTrue = await interpolate(ifTrue);
  const interpolatedIfFalse = await interpolate(ifFalse);

  return interpolatedInput === "true"
    ? interpolatedIfTrue
    : interpolatedIfFalse;
};

export default ifCondition;
