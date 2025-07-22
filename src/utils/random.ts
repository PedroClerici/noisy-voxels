// Credits: https://github.com/cprosche/mulberry32
export function mulberry(seed: string) {
  let seedCharCodes = 0;

  let stringTemp = '';
  for (let i = 0; i < seed.length; i++) {
    const charCode = seed.charCodeAt(i);
    stringTemp += charCode.toString();
  }

  seedCharCodes = Number(stringTemp);

  return {
    random() {
      seedCharCodes |= 0;
      seedCharCodes = (seedCharCodes + 0x6d2b79f5) | 0;
      let temp = Math.imul(
        seedCharCodes ^ (seedCharCodes >>> 15),
        1 | seedCharCodes,
      );
      temp = (temp + Math.imul(temp ^ (temp >>> 7), 61 | temp)) ^ temp;
      return ((temp ^ (temp >>> 14)) >>> 0) / 4294967296;
    },
  };
}
