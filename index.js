const app = require("express")();
const { Client } = require("pg");
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
  
  // Usage
  const hr = new SimpleConsistentHash();
  hr.add(["5432", "5433", "5434"]);


const clients = {
  5432 : new Client({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "postgres",
    port: 5432,
  }),
  5433: new Client({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "postgres",
    port: 5433,
  }),
  5434: new Client({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "postgres",
    port: 5434,
  }),
};

async function connect() {
  // for (const key in client) {
  //     try {
  //         await client[key].connect();
  //         console.log(`Connected to ${key}`);
  //     } catch (err) {
  //         console.log(err);
  //     }
  // }


  try {
    await clients["5432"].connect();
    console.log("Connected to 5432");
    await clients["5433"].connect();
    console.log("Connected to 5433");
    await clients["5434"].connect();
    console.log("Connected to 5434");
  } catch (err) {
    console.error("Connection error", err);
  }

}

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/post", async (req, res) => {
  const url = req.query.url;

  //consistently has this to get a port!
  const hash = crypto.createHash("sha256").update(url).digest("base64");

  const urlId = hash.substring(0, 5);

  const server = hr.get(urlId);

  console.log("Server", server);

  if (!server || !clients[server]) {
    return res.status(500).json({ error: "Invalid server configuration" });
  }

  try {
    await clients[server].query(
      "INSERT INTO URL_TABLE (url_id, url) VALUES ($1, $2)",
      [urlId, url]
    );

    res.send({
      urlId: urlId,
      url: url,
      server: server,
    });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

connect()
  .then(() => {
    app.listen(8081, () => {
      console.log("Server is running on port 8081");
    });
  })
  .catch((err) => {
    console.log(err);
  });
