const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { OpenAIEmbeddings } = require("@langchain/openai");
const dotenv = require("dotenv");
const {Document} = require("langchain/document");
const RecursiveCharacterTextSplitter = require("langchain/text_splitter");
const fs = require("fs");

dotenv.config();

const getTableSchemas = async (filePath) => {
  // Parse the file , separate content by ";" and add it to the list
  const fileContent = await fs.readFileSync(filePath, "utf8");
  const tableSchemas = fileContent.split(";");
  return tableSchemas;
};


async function loadDocuments(filePath) {
  const tableSchemas = await getTableSchemas(filePath);
  return tableSchemas;
}


// TODO: This should be created only once at the start of the session
const createVectorStore = async (docOutput) => {
  let ids = docOutput.map((_, index) => ({ id: index + 1 }));
  return  await MemoryVectorStore.fromTexts(
    docOutput,
    ids,
    new OpenAIEmbeddings()
  );
}

async function similaritySearch(vectorStore, query, k) {
  return await vectorStore.similaritySearch(query, k);
}
const processDocuments = async (filePath, query, k) => {
  try {
    const docOutput = await loadDocuments(filePath);
    const vectorStore = await createVectorStore(docOutput);
    const result = await similaritySearch(vectorStore, query, k);
    return result;
  } catch (error) {
    console.error("Error processing documents:", error);
    return null;
  }
}

module.exports = processDocuments;
