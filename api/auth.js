module.exports = async (req, res) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (password === ADMIN_PASSWORD) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
};
