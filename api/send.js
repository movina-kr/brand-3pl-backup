export default async function handler(req, res) {
  // 1. 타입에 따른 URL 선택
  const { type } = req.body;
  const url = type === 'qoo10' 
    ? process.env.APPS_SCRIPT_URL_QOO10 
    : process.env.APPS_SCRIPT_URL;

  if (!url) {
    return res.status(500).json({ error: "Target URL missing for type: " + type });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body), // 프론트에서 보낸 데이터 그대로 전달
      redirect: 'follow',
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ 
      error: "GAS_FETCH_FAILED", 
      details: error.message 
    });
  }
}
