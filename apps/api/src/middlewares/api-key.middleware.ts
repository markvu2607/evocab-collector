import { Context, Next } from 'hono';

export const apiKeyMiddleware = async (c: Context, next: Next) => {
	const apiKey = c.req.header('x-api-key');
	if (!apiKey) return c.json({ error: 'API key is required' }, 401);
	if (apiKey !== c.env.X_API_KEY) return c.json({ error: 'Invalid API key' }, 401);

	await next();
};
