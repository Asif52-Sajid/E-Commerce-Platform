const mongoose = require('mongoose');
const dns = require('dns');

// Fallback DNS lookup for restrictive local dev setups without breaking production hosting
if (process.env.NODE_ENV !== 'production') {
  try {
    dns.setDefaultResultOrder('ipv4first');
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (err) {
    console.warn('[Database Warning]: DNS server override skipped.');
  }
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: process.env.NODE_ENV !== 'production', // Disable autoIndex builds in production
    });
    console.log(`[Database]: MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;