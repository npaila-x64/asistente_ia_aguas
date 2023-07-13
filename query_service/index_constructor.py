from utils import ServiceContextWrapper
from llama_index import download_loader
from llama_index.indices.document_summary import DocumentSummaryIndex
from llama_index.node_parser import SimpleNodeParser
import openai
import os

from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.environ.get('OPENAI_API_KEY')

def construct_index():
    service_context_wrapper = ServiceContextWrapper()
    service_context_wrapper.load_service_context()

    # define loader
    UnstructuredReader = download_loader('UnstructuredReader', refresh_cache=True)
    loader = UnstructuredReader()

    files = []

    for file in os.listdir("docs"):
        if file.endswith(".txt"):
            files.append(os.path.join("docs", file))

    documents = []
    for file in files:
        docs = loader.load_data(file, split_documents=True)
        documents.extend(docs)

    parser = SimpleNodeParser()
    nodes = parser.get_nodes_from_documents(documents)

    # build index
    index = DocumentSummaryIndex.from_documents(documents)

    print(service_context_wrapper.get_token_usage())
    service_context_wrapper.reset_token_counts()

    index.storage_context.persist(persist_dir="persist")

    return index

if __name__ == '__main__':
    print('creating index...')
    index = construct_index()
    print('index created')
    query_engine = index.as_query_engine()
    query = 'Que es aguas araucania?'
    print("testing with query: " + query)
    response = query_engine.query(query)
    print(str(response))
