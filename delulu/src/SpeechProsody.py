import asyncio

from hume import HumeStreamClient, StreamSocket
from hume.models.config import ProsodyConfig

async def main():
    client = HumeStreamClient("<your-api-key>")
    config = ProsodyConfig()
    async with client.connect([config]) as socket:
        result = await socket.send_file("<your-video-or-audio-filepath>")
        print(result)

asyncio.run(main())