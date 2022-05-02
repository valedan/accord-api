const wait = (seconds: number) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export default wait;
