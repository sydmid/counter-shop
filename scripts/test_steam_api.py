import unittest
import asyncio
from steam_service import app
from httpx import AsyncClient, ASGITransport

class TestSteamService(unittest.IsolatedAsyncioTestCase):
    async def test_health_check(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    async def test_trade_dispatch(self):
        transport = ASGITransport(app=app)
        payload = {
            "partner_steam_id": "76561198012345678",
            "partner_trade_url": "https://steamcommunity.com/tradeoffer/new/?partner=52080000&token=TestToken",
            "items_to_give": ["asset_1", "asset_2"],
            "items_to_receive": ["asset_3"],
            "message": "Unit Test Trade"
        }
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.post("/api/trade/dispatch", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])

if __name__ == "__main__":
    unittest.main()
