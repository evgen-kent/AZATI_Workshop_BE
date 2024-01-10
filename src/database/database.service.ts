import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { Model } from 'mongoose';

type InitDocumentsType = any;

interface IDatabaseService {
  initializeAll(): Promise<void>;

  initialize(collection: Model<InitDocumentsType>, from: string): Promise<void>;
}

@Injectable()
export class DatabaseService implements IDatabaseService {
  constructor() {}

  async initializeAll(): Promise<void> {}

  async initialize(
    collection: Model<InitDocumentsType>,
    from: string,
  ): Promise<void> {
    try {
      const collectionExists = await collection.find().exec();
      if (collectionExists.length === 0) {
        const filePath = path
          .join(__dirname, 'datasets', from)
          .replace('\\dist', '');
        const dataString = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(dataString);
        await collection.create(data);
        console.log(
          `[Database Service] ${collection.modelName} initialized successfully.`,
        );
      }
    } catch (error) {
      console.error(
        `[Database Service] Error initializing ${collection.modelName}:`,
      );
    }
  }
}
