const express = require('express');
const app = express();
const port = process.env.port || 3000
app.set('view engine', 'ejs')

function renderFrontPage(request, response) {
    response.render("index")
}

app.get('/', renderFrontPage)

app.listen(port, () => {
    console.log("Listening on port ", port)
})
