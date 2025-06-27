const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  // 1. 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { password } = req.body;

    // 2. 从 Vercel 环境变量中安全地获取真实密码和 JWT 密钥
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
    
    // 检查环境变量是否存在，这是一个好的实践
    if (!ADMIN_PASSWORD || !SUPABASE_JWT_SECRET) {
        console.error("Environment variables ADMIN_PASSWORD or SUPABASE_JWT_SECRET are not set.");
        return res.status(500).json({ error: "Server configuration error." });
    }

    // 3. 验证密码
    if (password === ADMIN_PASSWORD) {
      // 4. 密码正确，准备签发“管理员通行证” (JWT)
      const payload = {
        role: 'authenticated', // 赋予管理员权限
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8), // 设置8小时后过期
      };

      // 5. 使用您的 JWT Secret 对通行证进行签名
      const token = jwt.sign(payload, SUPABASE_JWT_SECRET);

      // 6. 将签发好的通行证返回给前端
      res.status(200).json({ success: true, accessToken: token });
    } else {
      // 密码错误
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    console.error('Auth API Error:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};
