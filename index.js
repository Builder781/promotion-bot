const express = require("express");
const noblox = require("noblox.js");

const app = express();
app.use(express.json());

const ROBLOSECURITY = process.env.ROBLOSECURITY; // 環境変数から読み取り
const GROUP_ID = 12345678; // ←変更する
const TARGET_RANK = 2;

(async () => {
  await noblox.setCookie(ROBLOSECURITY);
  console.log("✅ Cookie 認証成功");
})();

app.post("/promote", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).send("Username is required");

    const userId = await noblox.getIdFromUsername(username);
    await noblox.setRank(GROUP_ID, userId, TARGET_RANK);

    res.send(`✅ ${username} をランク ${TARGET_RANK} に設定しました`);
  } catch (err) {
    console.error(err);
    res.status(500).send("エラーが発生しました");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Listening on port ${PORT}`));
