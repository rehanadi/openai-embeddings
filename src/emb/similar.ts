import {
  DataWithEmbeddings,
  generateEmbeddings,
  loadJSONData,
} from "./embedding"

export type Similarity = {
  input: string
  similarity: number
}

export const dotProduct = (a: number[], b: number[]): number => {
  return a
    .map((value, index) => value * b[index])
    .reduce((sum, value) => sum + value, 0)
}

export const cosineSimilarity = (a: number[], b: number[]): number => {
  const product = dotProduct(a, b)
  const aMagnitude = Math.sqrt(
    a.map((value) => value * value).reduce((sum, value) => sum + value, 0)
  )
  const bMagnitude = Math.sqrt(
    b.map((value) => value * value).reduce((sum, value) => sum + value, 0)
  )
  return product / (aMagnitude * bMagnitude)
}

const main = async () => {
  const dataWithEmbeddings = loadJSONData<DataWithEmbeddings[]>(
    "dataWithEmbeddings2.json"
  )

  // const input = "animal"
  // const input = "Cat"
  const input = "How old is John?"
  const inputEmbedding = await generateEmbeddings(input)

  const similarities: Similarity[] = dataWithEmbeddings.map((item) => {
    // const similarity = cosineSimilarity(
    //   item.embedding,
    //   inputEmbedding.data[0].embedding
    // )
    const similarity = dotProduct(
      item.embedding,
      inputEmbedding.data[0].embedding
    )
    return {
      input: item.input,
      similarity,
    }
  })

  const sortedSimilarities = similarities.sort(
    (a, b) => b.similarity - a.similarity
  )

  console.log(`Similarities for input "${input}":`)
  sortedSimilarities.forEach((item) => {
    console.log(`${item.input}: ${item.similarity}`)
  })
}

// main()

/*
Similarities for input "How old is John?":
John is 30 years old: 0.7520163201790604
John's mother is 55 years old: 0.6321925628934617
John's car is from 1999: 0.5479487374246345
John is a football player: 0.5401833729193665
John has a red car: 0.4846917145171741
John likes french fries: 0.3724870396412672
*/
