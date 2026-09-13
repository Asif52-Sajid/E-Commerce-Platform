const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'E-Commerce API server is running smoothly!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealthStatus };