import { Pinecone } from "@pinecone-database/pinecone"

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

type CoolType = {
  coolness: number
  reference: string
}

const createIndex = async () => {
  await pc.createIndex({
    name: "cool-index",
    dimension: 1536,
    metric: "cosine",
    spec: {
      serverless: {
        cloud: "aws",
        region: "us-east-1",
      },
    },
  })
}

const listIndexes = async () => {
  const result = await pc.listIndexes()
  console.log(result)
}

const createNamespace = async () => {
  const index = getIndex()
  const namespace = index.namespace("cool-namespace")
}

const getIndex = () => {
  return pc.Index<CoolType>("cool-index")
}

const generateNumberArray = (length: number): number[] => {
  return Array.from({ length }, () => Math.random())
}

const upsertVectors = async () => {
  const embedding = generateNumberArray(1536)
  const index = getIndex()

  await index.upsert([
    {
      id: "id-1",
      values: embedding,
      metadata: {
        coolness: 3,
        reference: "abcd",
      },
    },
  ])
}

const queryVectors = async () => {
  const index = getIndex()

  const result = await index.query({
    id: "id-1",
    topK: 1,
    includeMetadata: true,
  })

  console.log(result)
}

const main = async () => {
  // await createIndex()
  // await listIndexes()
  // await upsertVectors()
  await queryVectors()
}

// main()
