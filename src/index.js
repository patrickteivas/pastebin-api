const express = require('express');
const redis = require("redis");
const formidable = require('formidable');
const createHash = require("./utils/createHash");
const { promisify } = require("util");

const client = redis.createClient("redis://redis:6379");
const getAsync = promisify(client.get).bind(client);
const app = express();
const port = 8080;

client.on("error", function(error) {
  console.error(error);
});


app.post('/create', (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields) => {
    const content = JSON.stringify(fields.content);
    if(!content) return res.status(400).send(JSON.stringify({message: "Invalid content parameter"}))
    let hash = null

    let isHashUniq = false
    while(!isHashUniq) {
      hash = createHash(12);
      await getAsync(hash).then((value, err) => !value ? isHashUniq = true : null)
    }

    client.set(hash, content);
    return res.status(200).send(JSON.stringify({hash, content: JSON.parse(content)}));
  });
});

app.put('/edit', async (req, res) => {
  const form = formidable({ multiples: true });
  await form.parse(req, async (err, fields) => {
    const content = JSON.stringify(fields.content);
    if(!content) return res.status(400).send(JSON.stringify({message: "Invalid content parameter"}))
    const hash = fields.hash.toString();
    if(!hash) return res.status(400).send(JSON.stringify({message: "Invalid hash parameter"}))

    const getHashContent = await getAsync(hash).then((value, err) => (value))
    if(!getHashContent) return res.status(400).send(JSON.stringify({message: "Invalid hash parameter"}))
    if(getHashContent === content) return res.status(400).send(JSON.stringify({message: "Invalid content parameter"}))

    client.set(hash, content);
    return res.status(200).send(JSON.stringify({hash, content: JSON.parse(content)}));
  });
});

app.get('/[A-Za-z0-9]{12}', (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields) => {
    const hash = fields.hash.toString();
    if(!hash) return res.status(400).send(JSON.stringify({message: "Invalid hash parameter"}))

    const getHashContent = await getAsync(hash).then((value, err) => (value))
    if(!getHashContent) return res.status(400).send(JSON.stringify({message: "Invalid hash parameter"}))

    return res.status(200).send(JSON.stringify({hash, content: JSON.parse(getHashContent)}));
  });
})

app.delete('/delete', (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields) => {
    const hash = fields.hash.toString();
    if(!hash) return res.status(400).send(JSON.stringify({message: "Invalid hash parameter"}))

    const getHashContent = await getAsync(hash).then((value, err) => (value))
    if(!getHashContent) return res.status(400).send(JSON.stringify({message: "Invalid hash parameter"}))

    client.del(hash)

    return res.status(200).send(JSON.stringify({message: "Paste deleted"}))
  });
})



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))