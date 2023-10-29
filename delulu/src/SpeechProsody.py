import asyncio

from hume import HumeStreamClient, StreamSocket
from hume.models.config import ProsodyConfig

async def main():
    client = HumeStreamClient(
        "ZOYDAGJtcZ41Aw0vf1f3RQmjUbyYR0vzGlusUuVgDICxXv1m")
    config = ProsodyConfig()
    async with client.connect([config]) as socket:
        result = await socket.send_file("/Users/ayumad/delulu recordings")
        print(result)

asyncio.run(main())