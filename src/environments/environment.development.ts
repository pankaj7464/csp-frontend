
const {
   AUTH0_CLIENT_ID,
    AUTH0_DOMAIN,
    API_URL,
    CLIENT_URL,
} = {
    AUTH0_DOMAIN: 'dev-w2cpuspyl8y04bzh.us.auth0.com',
    AUTH0_CLIENT_ID: 'l6AoZ9MlugUZmmFY83P58BA2YQargRJ3',
    API_URL: 'https://localhost:44347',
    CLIENT_URL: 'http://localhost:4200',
};
export const environment = {
    API_URL,
    clientURL: CLIENT_URL,
    auth0: {
        domain: AUTH0_DOMAIN,
        clientId: AUTH0_CLIENT_ID,
        authorizationParams: {
            redirect_uri: `${CLIENT_URL}/dashboard`,
        }
    }
};