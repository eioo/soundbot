const config = {
  socketHost: process.env.REACT_APP_HOST || 'localhost',
  socketPort: Number(process.env.REACT_APP_SOCKET_PORT) || 1234
};

export default config;
