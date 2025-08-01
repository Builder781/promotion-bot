const express = require("express");
const noblox = require("noblox.js");

const app = express();
app.use(express.json());

const ROBLOSECURITY = process.env.ROBLOSECURITY; // Renderの環境変数にセット済み
const GROUP_ID = 35148239; // あなたのグループIDに変更してください
const TARGET_RANK = 5;     // 昇格させたいランク番号

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
    const { username } = req.body;
    if (!username) {
      return res.status(400).send("username is required");
    }

    // usernameからuserIdを取得
    const userId = await noblox.getIdFromUsername(username);
    // 指定グループのランクを変更
    await noblox.setRank(GROUP_ID, userId, TARGET_RANK);

    console.log(`✅ ${username} をランク${TARGET_RANK}に昇格しました`);
    res.status(200).send(`Promoted ${username} to rank ${TARGET_RANK}`);
  } catch (error) {
    console.error("❌ エラー:", error);
    res.status(500).send("Failed to promote user");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
