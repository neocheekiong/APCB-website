module.exports = {
    /**
     * Renders specified page
     */
    renderPage (page) {
        return (request, response) => {
            response.render(page);
        };
    }
};
