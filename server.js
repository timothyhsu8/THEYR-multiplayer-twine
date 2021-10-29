const express = require('express');
const app = express();
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.get('/group/:groupId', (req, res) => {
  res.send("Welcome Group " + req.params.groupId + "!")
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})