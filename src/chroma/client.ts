import { ChromaClient } from "chromadb"
import { OpenAIEmbeddingFunction } from "@chroma-core/openai"

const client = new ChromaClient({
  host: "localhost",
  port: 8000,
})

const embeddingFunction = new OpenAIEmbeddingFunction({
  apiKey: process.env.OPENAI_API_KEY!,
  modelName: "text-embedding-3-small",
})

const main = async () => {
  const response = await client.createCollection({
    name: "data-test2",
  })

  console.log(response)
}

const addData = async () => {
  const collection = await client.getCollection({
    name: "data-test2",
    embeddingFunction,
  })

  const result = await collection.add({
    ids: ["id1"],
    documents: ["Here is my entry"],
    // embeddings: [[0.1, 0.2]],
  })

  console.log(result)
}

// main()
addData()
