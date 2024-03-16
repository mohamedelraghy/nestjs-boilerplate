import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import { renameSync, unlinkSync } from 'fs';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  constructor() {}

  saveFile = (file: Express.Multer.File) => {
    try {
      // * get file ext
      const fileExt = extname(file.originalname);

      // Create new name for the uploaded file
      const filename = `upload/${uuidv4()}${fileExt}`;

      // * rename file.path
      renameSync(file.path, filename);

      const url = 'http://localhost:3000' + filename.replace('upload', '');

      return { url };
    } catch (err: unknown) {
      console.log(err);
      unlinkSync(file.path);
    }
  };
}
