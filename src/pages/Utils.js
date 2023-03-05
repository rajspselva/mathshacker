/* eslint-disable no-plusplus */
export const generatePairs = () => {
  const pairs = new Set()

  while (pairs.size < 100) {
    const a = Math.floor(Math.random() * 10)
    const b = Math.floor(Math.random() * 10)

    if (a !== b) {
      const pair = [a, b].sort(() => Math.random() - 0.5)
      pairs.add(pair)
    }
  }
  return Array.from(pairs)
}

export const pickRandomPair = (pairs) => {
  const index = Math.floor(Math.random() * pairs.length)
  const pair = pairs[index]
  pairs.splice(index, 1)
  return pair
}