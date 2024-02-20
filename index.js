const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const PORT = process.env.PORT || 3000;

const app = express();

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    }, {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: '',
    }, {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk'
    }, {
        name: 'bbc',
        address: 'https://www.bbc.com/news/science_and_environment',
        base: 'https://www.bbc.com'
    }, {
        name: 'cnn',
        address: 'https://edition.cnn.com/world/cnn-climate',
        base: 'https://edition.cnn.com'
    }, {
        name: 'nytimes',
        address: 'https://www.nytimes.com/international/section/climate',
        base: ''
    }, {
        name: 'apnews',
        address: 'https://apnews.com/climate-and-environment',
        base: ''
    }, {
        name: 'ccn',
        address: 'https://www.climatechangenews.com/science/',
        base: ''
    },
    , {
        name: 'nbc',
        address: 'https://www.nbcnews.com/science',
        base: ''
    }, {
        name: 'icn',
        address: 'https://insideclimatenews.org/category/science/',
        base: '',
    }, {
        name: 'abc',
        address: 'https://abcnews.go.com/alerts/climate-change',
        base: ''
    }
]

const articles = [];

newspapers.forEach(newspaper => {
    axios.get(newspaper.address).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');

            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })
        })


    })
})

app.get('/', (req, res) => {
    res.json('Welcome to my climate change news API');
});

app.get('/news', (req, res) => {
    res.json(articles);
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));