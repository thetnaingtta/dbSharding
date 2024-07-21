const app = require("express")();
const crypto = require("crypto");
const { clients } = require("./clients");
const SimpleConsistentHash = require("./simpleConsistentHash");

const hr = new SimpleConsistentHash();
hr.add(Object.keys(clients)) ;

async function connect() {
  for (const key in clients) {
    try {
      await clients[key].connect();
      console.log(`Connected to ${key}`);
    } catch (err) {
      console.log(err);
    }
  }
}

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/:urlId", async (req, res) => {
  const urlId = req.params.urlId;
  const server = hr.get(urlId);

  const result = await clients[server].query(
    "Select url from URL_TABLE where url_id = $1",
    [urlId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "URL not found" });
  }

  res.send({
    url: result.rows[0].url,
    server: server,
  });
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
