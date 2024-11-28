const app = require('./api');

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log('API Endpoint:', process.env.AZURE_LANGUAGE_ENDPOINT);
        console.log('Project Name:', process.env.AZURE_PROJECT_NAME);
    });
}

module.exports = app;
