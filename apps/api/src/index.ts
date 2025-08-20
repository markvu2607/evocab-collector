/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Context, Hono } from 'hono';
import { apiKeyMiddleware } from './middlewares/api-key.middleware';
import Saved from './models/saved.model';
import Word from './models/word.model';
// import mongoose from 'mongoose';

const app = new Hono();

app.use(apiKeyMiddleware);

app.get('/ping', (c) => {
	return c.text('pong');
});

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
			const foundWord = await Word.findOne({ id: word.id });
			if (!foundWord) {
				const newWord = new Word(word);
				newWord.save();
			}
		})
	);

	const wordStatus = await Promise.allSettled(
		wordList.map(async (word) => {
			const foundWord = await Word.findOne({ id: word.id });
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

export default app;
