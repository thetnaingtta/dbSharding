const crypto = require("crypto");

class SimpleConsistentHash {
    constructor() {
      this.servers = [];
    }
  
    add(servers) {
      this.servers = servers;
    }
  
    get(key) {
      const hash = crypto.createHash("sha256").update(key).digest("hex");
      const index = parseInt(hash, 16) % this.servers.length;
      return this.servers[index];
    }
  }

  module.exports = SimpleConsistentHash;