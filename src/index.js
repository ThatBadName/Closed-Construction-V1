const { ShardingManager } = require('discord.js')
const { token } = require('../config.json')

let manager = new ShardingManager('./src/bot.js', {
    token: token,
    totalShards: 'auto',
    respawn: true
})

manager.on('shardCreate', shard => {
    console.log(`[Sharding] Launched shard ${shard.id}`)
})

function checkBlacklistedUsers() {
	blacklisted users.findOne()
}

// Call the function initially
checkBlacklistedUsers();

// Set the interval to run the function every 10 seconds
setInterval(checkBlacklistedUsers, 10000);

manager.spawn()