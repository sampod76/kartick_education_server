/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const fs = require('fs').promises;
const path = require('path');

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const files = [
  {
    name: 'constant.ts',
    getCode: folderName =>
      `
      export const ${capitalize(folderName)}_SEARCHABLE_FIELDS = [
        'title',
        'price',
        'level',
        'status',
        'details',
      ];
      export const ${capitalize(folderName)}_FILTERABLE_FIELDS = [
        'searchTerm',
        'price',
        'duration',
        'level',
        'status',
        'price_type',
      ];
      
      // export const ${capitalize(
        folderName
      )}_TYPES = ['free', 'paid', 'open', 'closed', 'recurrig'];
      // export const ${capitalize(
        folderName
      )}_STATUS = ['active', 'deactive', 'save'];
      
`,
  },
  {
    name: 'model.ts',
    getCode: folderName =>
      `
      import { Schema, model } from 'mongoose';
      import { ${capitalize(folderName)}Model, I${capitalize(
        folderName
      )} } from './${capitalize(folderName)}.interface';
      
      const ${capitalize(folderName)}Schema = new Schema<I${capitalize(
        folderName
      )}, ${capitalize(folderName)}Model>(
        {
          title: {
            type: String,
            required: true,
          },
          main_${capitalize(folderName)}_category_id: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
          },
          sub1_${capitalize(folderName)}_category_id: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
          },
      
        },
        {
          timestamps: true,
          // strict: 'throw',
          toJSON: {
            virtuals: true,
          },
        }
      );
      
      export const ${capitalize(folderName)} = model<I${capitalize(
        folderName
      )}, ${capitalize(folderName)}Model>('${capitalize(
        folderName
      )}', ${capitalize(folderName)}Schema);
      
      
`,
  },
  {
    name: 'interface.ts',
    getCode: folderName =>
      `
      import { Model, Types } from 'mongoose';
      
      export type I${capitalize(folderName)}Filters = {
        searchTerm?: string;
        price?: number;
        duration?: string;
        level?: string;
        status?: string;
        price_type?: string;
      };
      
      export type I${capitalize(folderName)}SearchableField = {
        title: string;
        price: string;
        level: string;
        status: string;
        details: string;
      };
      
      export type I${capitalize(folderName)} = {
        title: string;
        img: string;
        details: string;
        author_id: Types.ObjectId;
        main_${capitalize(folderName)}_category_id: Types.ObjectId;
        sub1_${capitalize(folderName)}_category_id: Types.ObjectId;
        price: number;
        duration: string;
        level: string;
        price_type: 'free' | 'paid' | 'open' | 'closed' | 'recurrig';
        status: 'active' | 'deactive' | 'save';
 
        demo_video_id: Types.ObjectId;
      };
      
      export type ${capitalize(folderName)}Model = Model<I${capitalize(
        folderName
      )}, Record<string, unknown>>;
      
`,
  },
  {
    name: 'interface.ts',
    getCode: folderName =>
      `
      import { Model, Types } from 'mongoose';
      
      export type I${capitalize(folderName)}Filters = {
        searchTerm?: string;
        price?: number;
        duration?: string;
        level?: string;
        status?: string;
        price_type?: string;
      };
      
      export type I${capitalize(folderName)}SearchableField = {
        title: string;
        price: string;
        level: string;
        status: string;
        details: string;
      };
      
      export type I${capitalize(folderName)} = {
        title: string;
        img: string;
        details: string;
        author_id: Types.ObjectId;
        main_${capitalize(folderName)}_category_id: Types.ObjectId;
        sub1_${capitalize(folderName)}_category_id: Types.ObjectId;
        price: number;
        duration: string;
        level: string;
        price_type: 'free' | 'paid' | 'open' | 'closed' | 'recurrig';
        status: 'active' | 'deactive' | 'save';
 
        demo_video_id: Types.ObjectId;
      };
      
      export type ${capitalize(folderName)}Model = Model<I${capitalize(
        folderName
      )}, Record<string, unknown>>;
      
`,
  },
  {
    name: 'controller.ts',
    getCode: folderName =>
      `
      import { Request, Response } from 'express';
      import httpStatus from 'http-status';
      import { PAGINATION_FIELDS } from '../../../constant/pagination';
      
      import catchAsync from '../../share/catchAsync';
      import pick from '../../share/pick';
      import sendResponse from '../../share/sendResponse';

      const create${capitalize(
        folderName
      )} = catchAsync(async (req: Request, res: Response) => {
        const { ...${capitalize(folderName)}Data } = req.body;
      
        const result = await ${capitalize(
          folderName
        )}Service.create${capitalize(folderName)}ByDb(${capitalize(
        folderName
      )}Data);
      
        sendResponse<I${capitalize(folderName)}>(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: 'successfully create academic ${capitalize(folderName)}',
          data: result,
        });
      });
      export const ${capitalize(folderName)}Controller = {
        create${capitalize(folderName)},
        getAll${capitalize(folderName)},
        getSingle${capitalize(folderName)},
        update${capitalize(folderName)},
        delete${capitalize(folderName)},
        ${capitalize(folderName)}ReviewsByUser,
      };
`,
  },
  {
    name: 'service.ts',
    getCode: folderName =>
      `
      import mongoose, { PipelineStage, Types } from 'mongoose';

      import { paginationHelper } from '../../../helper/paginationHelper';
      
      import { IGenericResponse } from '../../interface/common';
      import { IPaginationOption } from '../../interface/pagination';
      
      import ApiError from '../../errors/ApiError';
      const { ObjectId } = mongoose.Types;

      const create${capitalize(folderName)}ByDb = async (payload: I${capitalize(
        folderName
      )}):Promise<I${capitalize(folderName)}> => {
        const ${folderName} = new ${capitalize(folderName)}(payload);
        return await ${folderName}.save();
      } 


export const ${capitalize(folderName)}Service = {
  create${capitalize(folderName)}ByDb,
  getAll${capitalize(folderName)}FromDb,
  getSingle${capitalize(folderName)}FromDb,
  update${capitalize(folderName)}FromDb,
  delete${capitalize(folderName)}ByIdFromDb,

};
`,
  },
  {
    name: 'validation.ts',
    getCode: folderName =>
      `
import { z } from 'zod';
const  create${capitalize(folderName)}ZodSchema = z.object({
  body: z.object({
    year: z.number({
      required_error: 'year is Required (zod)',
    }),
    title: z.string({
      required_error: 'title is Required (zod)',
    })
  }),
});
const update${capitalize(folderName)}ZodSchema = z.object({
  body: z.object({
    year: z.number({
      required_error: 'year is Required (zod)',
    }).optional(),
    title: z.string({
      required_error: 'title is Required (zod)',
    }).optional(),
  }),
});


export const ${capitalize(folderName)}Validation = {create${capitalize(
        folderName
      )}ZodSchema ,update${capitalize(folderName)}ZodSchema};
`,
  },
  {
    name: 'route.ts',
    getCode: folderName =>
      `
import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequestZod from '../../middlewares/validateRequestZod';
import { ${capitalize(
        folderName
      )}Controller } from './${folderName}.controller';
import {${capitalize(folderName)}Validation } from './${folderName}.validation';

const router = express.Router();

router
  .route('/')
  .get(${capitalize(folderName)}Controller.getAll${capitalize(folderName)})
  .post(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(${capitalize(folderName)}Validation.create${capitalize(
        folderName
      )}ZodSchema),
    ${capitalize(folderName)}Controller.create${capitalize(folderName)}
  );

router
  .route('/:id')
  .get(${capitalize(folderName)}Controller.getSingle${capitalize(folderName)})
  .put(
    authMiddleware(ENUM_USER_ROLE.ADMIN),
    validateRequestZod(${capitalize(folderName)}Validation.update${capitalize(
        folderName
      )}ZodSchema),
    ${capitalize(folderName)}Controller.update${capitalize(folderName)}
  )
  .delete(authMiddleware(ENUM_USER_ROLE.ADMIN), ${capitalize(
    folderName
  )}Controller.delete${capitalize(folderName)});

export const ${capitalize(folderName)}Routes = router;
`,
  },
];

async function createFolderAndFiles(parentDirectory, folderName) {
  try {
    const moduleDirectory = path.join(parentDirectory, folderName);

    // Create the folder
    await fs.mkdir(moduleDirectory);

    // Create the files using for...of loop and async/await
    for (const file of files) {
      const filePath = path.join(moduleDirectory, `${folderName}.${file.name}`);
      await fs.writeFile(filePath, file.getCode(folderName));
      console.log(`Created ${filePath}`);
    }

    console.log('Module and files created successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getUserInput() {
  return new Promise(resolve => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question(
      'Enter the Module name (or "exit" to terminate): ',
      folderName => {
        readline.close();
        resolve(folderName);
      }
    );
  });
}

async function start() {
  const parentDirectory = 'src/app/modules';

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const folderName = await getUserInput();

    if (folderName.toLowerCase() === 'exit') {
      process.exit(0);
    }

    await createFolderAndFiles(parentDirectory, folderName);
  }
}

start();
