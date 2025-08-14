type AppConfig = {
  app: {
    environment: 'development' | 'production' | 'test';
    port: number;
    timeout: number;
  };
  database: {
    url: string;
  };
  xApiKey: string;
};

export default (): AppConfig => ({
  app: {
    environment: (process.env.ENVIRONMENT || 'development') as
      | 'development'
      | 'production'
      | 'test',
    port: parseInt(process.env.PORT || '9999', 10),
    timeout: parseInt(process.env.TIMEOUT || '5000', 10),
  },
  database: {
    url: process.env.MONGO_URL || 'mongodb://localhost/nest',
  },
  xApiKey: process.env.X_API_KEY || '',
});
