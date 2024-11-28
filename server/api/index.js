const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/getAnswer', async (req, res) => {
    try {
        const { question } = req.body;

        const response = await axios({
            method: 'post',
            url: `${process.env.AZURE_LANGUAGE_ENDPOINT}/language/:query-knowledgebases`,
            params: {
                'api-version': '2021-10-01',
                'projectName': process.env.AZURE_PROJECT_NAME,
                'deploymentName': process.env.AZURE_DEPLOYMENT_NAME
            },
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.AZURE_LANGUAGE_KEY
            },
            data: {
                question: question,
                top: 1
            }
        });

        res.json({
            answers: response.data.answers || [{
                answer: "I'm sorry, I don't have an answer for that question."
            }]
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            error: error.response?.data?.error || error.message
        });
    }
});

module.exports = app;
