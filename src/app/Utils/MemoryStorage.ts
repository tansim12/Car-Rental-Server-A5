/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { StorageEngine } from "multer";
import concat from "concat-stream";
import { Express } from "express"; // Import Express to use Multer's File type

class MemoryStorage implements StorageEngine {
  constructor(opts: any) {}

  _handleFile(
    req: Request,
    file: Express.Multer.File,
    cb: (error: any, info?: Partial<Express.Multer.File>) => void
  ): void {
    file.stream.pipe(
      concat({ encoding: "buffer" }, (data: Buffer) => {
        cb(null, {
          buffer: data,
          size: data.length,
        });
      })
    );
  }

  _removeFile(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null) => void
  ): void {
    delete (file as any).buffer;
    cb(null);
  }
}

export const memoryStorage = (): MemoryStorage => {
  return new MemoryStorage({});
};
