import { readFileSync, writeFileSync } from "fs"
import OpenAI from "openai"
import { join } from "path"

const openai = new OpenAI()

export type DataWithEmbeddings = {
  input: string
  embedding: number[]
}

export const generateEmbeddings = async (input: string | string[]) => {
  const response = await openai.embeddings.create({
    input,
    model: "text-embedding-3-small",
  })

  // console.log(response.data[0].embedding)
  return response
}

export const loadJSONData = <T>(fileName: string): T => {
  const path = join(__dirname, fileName)
  const rawData = readFileSync(path)
  return JSON.parse(rawData.toString())
}

export const saveDataToJSONFile = (data: any, fileName: string) => {
  const dataString = JSON.stringify(data)
  const dataBuffer = Buffer.from(dataString)
  const path = join(__dirname, fileName)
  writeFileSync(path, dataBuffer)
  console.log(`Data saved to ${fileName}`)
}

const main = async () => {
  const data = loadJSONData<string[]>("data2.json")
  const embeddings = await generateEmbeddings(data)
  const dataWithEmbeddings: DataWithEmbeddings[] = data.map((input, index) => ({
    input,
    embedding: embeddings.data[index].embedding,
  }))
  saveDataToJSONFile(dataWithEmbeddings, "dataWithEmbeddings2.json")
}

// generateEmbeddings("Cat")
// main()
