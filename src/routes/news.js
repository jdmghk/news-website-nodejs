const express = require('express')
const newsRouter = express.Router()
const axios = require('axios')
require('dotenv').config();

const apiKey = process.env.API_KEY;

newsRouter.get('', async(req, res) => {


    try {
        const newsAPI = await axios.get(`https://newsdata.io/api/1/latest?apikey=${apiKey}`);
        console.log('API Response:', newsAPI.data);

        const articles = newsAPI.data.results;

        if (!Array.isArray(articles)) {
            throw new Error('Expected results to be an array');
        }

        res.render('news', { articles: articles });
    } catch (err) {
        if(err.response){
            res.render('news', { articles: null });
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        }  else if(err.request){
            res.render('news', { articles: null });
            console.log(err.request)
        }  else{
            res.render('news', { articles: null });  
            console.error('Error', err.message)
        }
    }
})

newsRouter.get('/article/:id', async(req, res) => {
    let articleID = req.params.id 

    try {
        const newsAPI = await axios.get(`https://newsdata.io/api/1/latest?apikey=${apiKey}/${articleID}`);
        // console.log('API Response:', newsAPI.data);

        const article = newsAPI.data.link;

        if (!Array.isArray(article)) {
            throw new Error('Expected results to be an array');
        }

        res.render('newsSingle', { article: article });
    } catch (err) {
        if(err.response){
            res.render('newsSingle', { article: null });
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        }  else if(err.request){
            res.render('newsSingle', { article: null });
            console.log(err.request)
        }  else{
            res.render('newsSingle', { article: null });  
            console.error('Error', err.message)
        }
    }
})


newsRouter.post('', async(req, res) => {
    let search = req.body.search

    try {
        const newsAPI = await axios.get(`https://newsdata.io/api/1/latest?apikey=${apiKey}&q=${search}`);
        console.log('API Response:', newsAPI.data);

        const articles = newsAPI.data.results;
        const simplifiedArticles = articles.map(article => ({
            title: article.title,
            link: article.link,
            pubDate: article.pubDate
        }));
        res.render('newsSearch', { articles: simplifiedArticles });

        // if (!Array.isArray(articles)) {
        //     throw new Error('Expected results to be an array');
        // }

        // res.render('newsSearch', { articles: articles });
    } catch (err) {
        if(err.response){
            res.render('newsSearch', { articles: null });
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        }  else if(err.request){
            res.render('newsSearch', { articles: null });
            console.log(err.request)
        }  else{
            res.render('newsSearch', { articles: null });  
            console.error('Error', err.message)
        }
    }
});

//https://newsdata.io/api/1/latest?apikey=pub_51455588f16a23de86b1638652ae244a3f8cc&q=pizza

module.exports = newsRouter