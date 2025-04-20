const redis = require("redis");
const client = redis.createClient();

client.on("error", (err) => {
  console.error("Redis Error:", err);
});

client.connect(); // Redis connection
module.exports = client;
