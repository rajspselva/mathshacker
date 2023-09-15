/* eslint-disable no-plusplus */
export const generatePairs = (max) => {
  const pairs = new Set()
  if (!max) {
    max = 10
  }
  const min = 1
  max += 1
  while (pairs.size < 200) {
    
    const a = Math.floor(Math.random() * (max - min) + min)
    const b = Math.floor(Math.random() * (max - min) + min)

    if (a !== b) {
      const pair = [a, b].sort(() => Math.random() - 0.5)
      pairs.add(pair)
    }
  }
  console.log(Array.from(pairs));
  return Array.from(pairs)
}

export const pickRandomPair = (pairs) => {
  const index = Math.floor(Math.random() * pairs.length)
  const pair = pairs[index]
  pairs.splice(index, 1)
  return pair || []
}