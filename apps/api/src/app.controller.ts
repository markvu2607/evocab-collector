import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RouteConfig } from '@nestjs/platform-fastify';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { WordDocument } from '@/schemas/word.schema';
import type { SavedDocument } from '@/schemas/saved.schema';

type MochiWord = { id: number; [key: string]: unknown };
type MochiResponse = { vi: { detail: MochiWord[] }[] };
type MochiEnvelope = { data?: MochiResponse };
type WordPlain = {
  id?: number;
  content?: string;
  position?: string;
  trans?: string;
  en_sentence?: string;
  vi_sentence?: string;
};

@Controller()
export class AppController {
  constructor(
    @InjectModel('words') private readonly wordModel: Model<WordDocument>,
    @InjectModel('saveds') private readonly savedModel: Model<SavedDocument>,
  ) {}

  @RouteConfig({
    isPublic: true,
  })
  @Get('health-check')
  healthCheck(): string {
    return 'Server is running ... too fast';
  }

  @RouteConfig({
    isPublic: false,
  })
  @Get('search')
  async search(@Query('keyword') keyword: string) {
    const queryParams = new URLSearchParams({
      key: keyword,
      uuid: 'd6a781ea-309c-431f-afd2-4a1f3ecaaa1b',
    } as Record<string, string>);
    const response = await fetch(
      `https://mochien-server.mochidemy.com/v3.1/words/dictionary-english?${queryParams}`,
      {
        method: 'GET',
        headers: {
          Privatekey: 'M0ch1M0ch1_En_$ecret_k3y',
        },
      },
    );
    const json = (await response.json()) as unknown as
      | MochiEnvelope
      | MochiResponse;
    const viSections =
      ('data' in json ? json.data?.vi : (json as MochiResponse).vi) ?? [];
    const safeSections = Array.isArray(viSections) ? viSections : [];
    let wordList: MochiWord[] = safeSections.flatMap((section) =>
      Array.isArray(section.detail) ? section.detail : [],
    );

    await Promise.all(
      wordList.map(async (word) => {
        const count = await this.wordModel
          .countDocuments({ id: word.id } as Record<string, unknown>)
          .exec();
        if (count === 0) {
          await this.wordModel.create(word as Record<string, unknown>);
        }
      }),
    );

    const wordStatus = await Promise.all(
      wordList.map(async (word) => {
        const count = await this.savedModel
          .countDocuments({ id: word.id } as Record<string, unknown>)
          .exec();
        return count > 0;
      }),
    );
    wordList = wordList.map((word, index) => ({
      ...word,
      isSaved: wordStatus[index],
    }));

    return {
      data: wordList,
      message: 'OK',
      statusCode: 200,
    };
  }

  @RouteConfig({
    isPublic: false,
  })
  @Post('save-word')
  async saveWord(@Body('id') id: number) {
    await this.savedModel.updateOne(
      { id } as Record<string, unknown>,
      { $setOnInsert: { id } } as Record<string, unknown>,
      { upsert: true },
    );

    return {
      data: { id },
      message: 'OK',
      statusCode: 200,
    };
  }

  @RouteConfig({
    isPublic: false,
  })
  @Get('random-word')
  async getRandomWord() {
    const results = await this.savedModel.aggregate<{ id: number }>([
      { $sample: { size: 1 } },
      { $project: { _id: 0, id: 1 } },
    ]);
    const randomSaved = results[0];

    if (!randomSaved) {
      return {
        data: null,
        message: 'Not Found',
        statusCode: 404,
      };
    }

    const word = (await this.wordModel
      .findOne({ id: randomSaved.id } as Record<string, unknown>)
      .lean()
      .exec()) as unknown as WordPlain | null;

    return {
      data: word,
      message: 'OK',
      statusCode: 200,
    };
  }
}
