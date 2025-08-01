const express = require("express");
const cors = require("cors");
const noblox = require("noblox.js");

const app = express();
app.use(cors());
app.use(express.json());

const ROBLOSECURITY = process.env.ROBLOSECURITY;
const GROUP_ID = 35148239;
const TARGET_RANK = 5;

async function startBot() {
  try {
    await noblox.setCookie(ROBLOSECURITY);
    console.log("✅ Robloxにログイン成功");
  } catch (err) {
    console.error("❌ Robloxログイン失敗:", err);
  }
}
startBot();

app.post("/promote", async (req, res) => {
  try {
    console.log("リクエストボディ:", req.body);

    const { username } = req.body;
    console.log("📩 リクエスト受信:", username);

    if (!username) {
      return res.status(400).send("username is required");
    }

    let userId;
    try {
      userId = await noblox.getIdFromUsername(username);
      console.log("🔍 取得したUserID:", userId);
    } catch (e) {
      console.error("❌ getIdFromUsername失敗:", e);
      return res.status(404).send("User not found");
    }

    try {
      await noblox.setRank(GROUP_ID, userId, TARGET_RANK);
      console.log(`✅ ${username} をランク${TARGET_RANK}に昇格しました`);
      res.status(200).send(`Promoted ${username} to rank ${TARGET_RANK}`);
    } catch (e) {
      console.error("❌ setRank失敗:", e);
      res.status(500).send("Failed to set rank");
    }
  } catch (error) {
    console.error("❌ エラー:", error);
    res.status(500).send("Internal server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐ポート${PORT}で実行中`);
});
