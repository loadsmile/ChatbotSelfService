require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST'],
    credentials: true
}));
app.use(express.json());

app.post('/api/getAnswer', async (req, res) => {
    console.log('Received question:', req.body.question);
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

        console.log('Azure response:', response.data);

        res.json({
            answers: response.data.answers || [{
                answer: "I'm sorry, I don't have an answer for that question."
            }]
        });
    } catch (error) {
        console.error('Full error object:', error);
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);

        res.status(500).json({
            error: error.response?.data?.error || error.message
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('API Endpoint:', process.env.AZURE_LANGUAGE_ENDPOINT);
    console.log('Project Name:', process.env.AZURE_PROJECT_NAME);
});
