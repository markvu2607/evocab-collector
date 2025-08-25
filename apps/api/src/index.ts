import { Context, Hono } from 'hono';
import { apiKeyMiddleware } from './middlewares/api-key.middleware';
import { cors } from 'hono/cors';

type Bindings = {
	X_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(cors());
app.use(apiKeyMiddleware);

app.get('/search', async (c: Context) => {
	const { keyword } = c.req.query();

	const queryParams = new URLSearchParams({
		key: keyword,
		uuid: 'd6a781ea-309c-431f-afd2-4a1f3ecaaa1b',
	} as Record<string, string>);
	const { data } = (await fetch(`https://mochien-server.mochidemy.com/v3.1/words/dictionary-english?${queryParams}`, {
		method: 'GET',
		headers: {
			Privatekey: 'M0ch1M0ch1_En_$ecret_k3y',
		},
	}).then((data) => data.json())) as any;
	let wordList: any[] = data.vi.map((type: any) => type.detail).flat();

	await Promise.all(
		wordList.map(async (word) => {
			const foundWord = await c.env.DB.prepare('SELECT * FROM words WHERE id = ?').bind(word.id).first();
			if (!foundWord) {
				await c.env.DB.prepare('INSERT INTO words (id, content, position, trans, en_sentence, vi_sentence) VALUES (?, ?, ?, ?, ?, ?)')
					.bind(word.id, word.content, word.position, word.trans, word.en_sentence, word.vi_sentence)
					.run();
			}
		})
	);

	const wordStatus = await Promise.allSettled(
		wordList.map(async (word) => {
			const foundWord = await c.env.DB.prepare('SELECT * FROM saved WHERE id = ?').bind(word.id).first();
			return !!foundWord;
		})
	).then((results) => {
		return results.map((result) => {
			if (result.status == 'fulfilled') {
				return result.value;
			}
			return false;
		});
	});
	wordList = wordList.map((word, index) => ({
		...word,
		isSaved: wordStatus[index],
	}));

	return c.json({ data: wordList });
});

app.post('/save-word', async (c: Context) => {
	const { id } = await c.req.json();

	await c.env.DB.prepare('INSERT INTO saved (id) VALUES (?)').bind(id).run();

	return c.json({
		data: id,
		message: 'Saved word',
		statusCode: 200,
	});
});

app.get('/random-word', async (c: Context) => {
	const randomSaved = await c.env.DB.prepare('SELECT * FROM saved ORDER BY RANDOM() LIMIT 1').first();

	if (!randomSaved) {
		return c.json({
			message: 'No saved word',
			statusCode: 404,
		});
	}

	const word = await c.env.DB.prepare('SELECT * FROM words WHERE id = ?').bind(randomSaved.id).first();

	return c.json({
		data: word,
		message: 'OK',
		statusCode: 200,
	});
});

export default app;
