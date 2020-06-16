const express = require('express');
const app = express();
const port = process.env.port || 3000;
app.set('view engine', 'ejs');
const routes = require('./routes');

const ERROR_PAGE = 'error.ejs';

async function createNewUser (data) {
    data.password = encrypt(data.password);
    addToDB(data);
}

routes(app);

app.put('/register', (request, response) => {
    const data = request.body;
    try {
        createNewUser(data);
    } catch (error) {
        response.render(ERROR_PAGE, { message: error.message });
    }
});

app.listen(port, () => {
    console.log('Listening on port ', port);
});



