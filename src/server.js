import express from 'express';
let app = express();

app.get('/', function (req, res) {
   res.send('Hello World');
});

let server = app.listen(3000,'localhost', function () {
  let host = server.address().address
  let port = server.address().port
  console.log("Ung dung Node.js dang hoat dong tai dia chi: http://%s:%s", host, port)
});