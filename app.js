const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const cheerios = require('cheerio');
const axios = require('axios');

app.get('/', (req, res) => {
    res.json("hello");
})

app.get('/api/data/:id', async(req, res) => {
    const { id } = req.params;
                 
    try {
        const url = `https://www.spoj.com/users/${id}/`;
            
        const { data } = await axios.get(url);

        const $ = cheerios.load(data);

        const scrapedData = {};


        scrapedData["User Id"] = id;
        scrapedData["Global Rank"] = $('p:nth-child(6)').text();
        scrapedData["Problems Solved"] = $('div:nth-child(2) > div > div.col-md-9 > div:nth-child(2) > div > div.row > div.col-md-6.text-center.valign-center > dl > dd:nth-child(2)').text();
        scrapedData["Submissions"] = $('div:nth-child(2) > div > div.col-md-9 > div:nth-child(2) > div > div.row > div.col-md-6.text-center.valign-center > dl > dd:nth-child(4)').text();

        res.json(scrapedData);
    } catch (error) {
        console.error("Error fetching or scraping:", error.message);
        res.status(500).json({ error: "Failed to fetch or parse user profile." });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`server running at ${port}`);
})

module.exports = app;