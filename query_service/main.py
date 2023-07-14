from threading import Thread

from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from starlette.responses import JSONResponse
from utils import ServiceContextWrapper
from llama_index import (
    StorageContext,
    load_index_from_storage,
)
from ai_models import dummyai, openai
from pydantic import BaseModel
from fastapi import FastAPI, Request

IS_AI_DUMMY = False  # Change between the dummy ai model and the actual openai API

index = any
if not IS_AI_DUMMY:
    print('Loading index...')

    service_context_wrapper = ServiceContextWrapper()
    service_context_wrapper.load_service_context()

    # rebuild storage context
    storage_context = StorageContext.from_defaults(persist_dir="persist")

    # load index
    index = load_index_from_storage(
        storage_context=storage_context,
    )
    print('Index was loaded')

app = FastAPI()
slack_token = "xoxb-1928724628359-5575228807493-79a2CRSCjcx3GsVlKTOLJerp"
client = WebClient(token=slack_token)


# Could be used as dashboard
@app.get("/")
def read_root():
    return {"Hello": "World"}


# Dataclass for each user query
class Query(BaseModel):
    message: str


# Output an AI response
@app.post("/ai_output")
async def query_ai_response(response: Query):
    print("Input text: " + response.message)
    response = (dummyai if IS_AI_DUMMY else openai).ask(response.message, index)
    print("Response: " + str(response))  # TODO MUST log this response
    if not IS_AI_DUMMY:
        print(response.get_formatted_sources())
    return {"data": str(response)}


def process_event(event_data, data):
    if 'bot_id' not in event_data:
        print("data:")
        print(data)
        user_message = event_data.get('text', '')
        channel_id = event_data.get('channel')
        try:
            response = client.chat_postMessage(channel=channel_id, text="Por favor dame un momento...")
            # Query the index with the user's message
            response_text = (dummyai if IS_AI_DUMMY else openai).ask(user_message, index)
            # response_text = query_engine.query(user_message)
            # Post the response to the channel
            response = client.chat_postMessage(channel=channel_id, text=str(response_text))
        except SlackApiError as e:
            print(f"Error posting message: {e}")
        except Exception as e:  # catch exceptions from the index function
            print(f"Error querying index: {e}")


@app.post("/slack")
async def slack_event(request: Request):
    print(request)
    data = await request.json()
    if "challenge" in data:
        return {"challenge": data["challenge"]}
    elif 'event' in data:  # actual event
        event_data = data['event']
        Thread(target=process_event, args=(event_data, data)).start()
    return JSONResponse(content="", status_code=200)
