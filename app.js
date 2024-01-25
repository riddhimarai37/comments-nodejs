// Importing Modules
const express = require('express')
const axios = require('axios')

// Creating Express App and setting up port
const app = express()
const port = process.env.PORT || 3000

// parsing JSON in req body
app.use(express.json())

// endpoint for fetching comment data
app.get('/fetch-data', async (req,res) => {
    try {
        const apiUrl ='https://jsonplaceholder.typicode.com/comments/';
        const response = await axios.get(apiUrl);

        res.send(response.data);
    } catch(error) {
        console.error('Error fetching data: ', error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
});

// endpoint for processing data and returning the top 10 longest commments
app.get('/process-data', async (req,res) => {
    try {
        const data_response = await axios.get('http://localhost:3000/fetch-data');
        const data = data_response.data;
        var top10 = []

        let html = '<html><head><title> Top 10 </title></head><body>';
        html+= '<h1>Top 10 Longest Comments</h1>';
        html += '<ul>';

        const comments = data.sort((c1,c2) => c2.body.length - c1.body.length);
        for(c in comments.slice(0,10)) {
            var body = comments.slice(0,10)[c].body
            html += `<li> ${JSON.stringify(body)} </li>`
        }
        html += '</ul></body></html>'

        res.send(html)

    } catch(error) {
        console.error("Error processing data: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
});

app.get('/', (req, res) => {
  res.send('Welcome!')
})

app.use((req,res) => {
    res.status(404).json({error: "Not Found"});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})