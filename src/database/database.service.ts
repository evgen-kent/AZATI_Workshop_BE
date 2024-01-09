import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

interface IDatabaseService {
  initializeAll(): Promise<void>;

  initializeBrands(): Promise<void>;

  initializeCategories(): Promise<void>;

  initializeSizes(): Promise<void>;

  initializeGenders(): Promise<void>;

  initializeColors(): Promise<void>;
}

@Injectable()
export class DatabaseService implements IDatabaseService {
  constructor() {}

  async initializeAll(): Promise<void> {}

  async initializeBrands(): Promise<void> {}

  async initializeCategories(): Promise<void> {}

  async initializeColors(): Promise<void> {}

  async initializeGenders(): Promise<void> {}

  async initializeSizes(): Promise<void> {}

  /*  async initializeUsers() {
      try {
        const usersExist = await this.userModel.find().exec();
        if (usersExist.length === 0) {
          const filePath = path
            .join(__dirname, 'datasets', 'users.dataset.json')
            .replace('\\dist', '');
          const usersData = fs.readFileSync(filePath, 'utf8');
          const users = JSON.parse(usersData);
          await this.userModel.create(users);
          console.log('Users initialized successfully.');
        }
      } catch (error) {
        console.error('Error initializing users:', error);
      }
    }
  */
}
