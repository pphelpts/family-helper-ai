export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();

    // ⭐⭐⭐ 加上这行：打印 DeepSeek 返回的数据
    console.log("🟡 DeepSeek raw response:", data);

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No response"
    });
  } catch (error) {
    console.error("🔴 API Error:", error);
    return res.status(500).json({ error: "Request failed" });
  }
}
