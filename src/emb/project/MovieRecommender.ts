import { generateEmbeddings, saveDataToJSONFile } from "../embedding"
import { dotProduct, Similarity } from "../similar"
import { join } from "path"
import { existsSync, readFileSync } from "fs"
import { CreateEmbeddingResponse } from "openai/resources/embeddings"

type Movie = {
  name: string
  description: string
}

type MovieWithEmbeddings = Movie & {
  embedding: number[]
}

export const loadJSONData = <T>(fileName: string): T => {
  const path = join(__dirname, fileName)
  const rawData = readFileSync(path)
  return JSON.parse(rawData.toString())
}

const data = loadJSONData<Movie[]>("movies.json")

console.log("What movies do you like?")
console.log("............................")
process.stdin.addListener("data", async (input) => {
  let userInput = input.toString().trim()
  await recommendMovies(userInput)
})

const recommendMovies = async (input: string) => {
  const embedding = await generateEmbeddings(input)
  const descriptionEmbeddings = await getMovieEmbeddings()

  const moviesWithEmbeddings: MovieWithEmbeddings[] = data.map(
    (movie, index) => ({
      name: movie.name,
      description: movie.description,
      embedding: descriptionEmbeddings.data[index].embedding,
    })
  )

  const similarities: Similarity[] = moviesWithEmbeddings.map((movie) => {
    const similarity = dotProduct(movie.embedding, embedding.data[0].embedding)
    return {
      input: movie.name,
      similarity,
    }
  })

  console.log(`If you like "${input}", you might also like:`)
  console.log("........................................")

  const sortedSimilarities = similarities.sort(
    (a, b) => b.similarity - a.similarity
  )
  sortedSimilarities.forEach((item) => {
    console.log(`${item.input}: ${item.similarity}`)
  })
}

const getMovieEmbeddings = async () => {
  const fileName = "movieEmbeddings.json"
  const filePath = join(__dirname, fileName)
  if (existsSync(filePath)) {
    const descriptionEmbeddings =
      loadJSONData<CreateEmbeddingResponse>(fileName)
    return descriptionEmbeddings
  } else {
    const descriptionEmbeddings = generateEmbeddings(
      data.map((movie) => movie.description)
    )
    saveDataToJSONFile(descriptionEmbeddings, fileName)
    return descriptionEmbeddings
  }
}

/*
What movies do you like?
............................
Movies set up in ancient times
Data saved to movieEmbeddings.json
If you like "Movies set up in ancient times", you might also like:
........................................
Gladiator: 0.32053660804708534
The Matrix Revolutions: 0.2661433765608103
The Lord of the Rings: The Fellowship of the Ring: 0.2535471537142863
The Matrix Reloaded: 0.25307790929803947
The Lord of the Rings: The Return of the King: 0.239923913670708
The Godfather: Part II: 0.23915546083782124
The Shawshank Redemption: 0.22972951948963524
Pulp Fiction: 0.22585305236253547
The Godfather: 0.22030908047246558
Fight Club: 0.17902555612344334
The Departed: 0.17891703460405545
The Dark Knight Rises: 0.16445680607507585
Schindler's List: 0.15619526879780254
The Matrix: 0.15561154609750755
The Dark Knight: 0.13874937524719336
Forrest Gump: 0.13269511123973515
The Silence of the Lambs: 0.12054538939708978
Inception: 0.11420277143805814
The Green Mile: 0.08440070004662223

Science Fiction Movies
Data saved to movieEmbeddings.json
If you like "Science Fiction Movies", you might also like:
........................................
The Matrix Reloaded: 0.31016674384757686
The Matrix: 0.27066398450477896
Pulp Fiction: 0.21476647154505069
Inception: 0.17978899660027167
The Matrix Revolutions: 0.17892836409204974
The Silence of the Lambs: 0.1757122116435358
Fight Club: 0.16085871439810817
The Godfather: 0.15440948239758914
The Lord of the Rings: The Return of the King: 0.1491834203492981
The Dark Knight Rises: 0.14790103609397587
The Lord of the Rings: The Fellowship of the Ring: 0.14762773882892138
The Departed: 0.14382311861600716
The Godfather: Part II: 0.13794023127229738
Forrest Gump: 0.13417438032186402
Schindler's List: 0.1324040156730375
The Dark Knight: 0.12546583916668863
Gladiator: 0.1141358054497897
The Shawshank Redemption: 0.11394108503797523
The Green Mile: 0.10606800725208611
*/
