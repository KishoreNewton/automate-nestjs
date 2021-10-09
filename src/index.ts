import * as fs from 'fs';
import * as util from 'util';

const tableName = 'User';
const globalFileName = tableName
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .toLowerCase();
const controllerServiceName =
  tableName.charAt(0).toLowerCase() + tableName.slice(1);
const controllerServiceNameAlt =
  tableName.charAt(0).toUpperCase() + tableName.slice(1);
const routeName = tableName.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
const tableColumns = [
  {
    name: 'id',
    primaryColumn: true,
    index: true,
    uuid: true,
    type: 'string'
  },
  {
    name: 'empNo',
    index: true,
    unique: true,
    nullable: false,
    type: 'string'
  },
  {
    name: 'organizationEmailId',
    index: true,
    columnType: 'citext',
    nullable: true,
    type: 'string'
  },
  {
    name: 'empStatus',
    index: true,
    unique: false,
    type: 'string'
  },
  {
    name: 'mobileNumber',
    index: true,
    type: 'string'
  }
];
const createdColumn = 'createdOn';
const updatedColumn = 'updatedOn';

let documentEnity = `
@Entity()
export class ${tableName} {`;

let importTypeorm = new Map();
let importForigenKey: string[] = [];
let columnObject: any = {};

importTypeorm.set('entity', 'Entity');
importTypeorm.set('createdDateColumn', 'CreatedDateColumn');
importTypeorm.set('updatedDateColumn', 'UpdatedDateColumn');

for (let column of tableColumns) {
  let { name, primaryColumn, index, uuid, type, columnType, nullable, unique } =
    column;

  if (nullable) columnObject.nullable = true;
  if (unique) columnObject.unique = true;
  if (columnType) columnObject.type = columnType;

  if (index) {
    importTypeorm.set('index', 'Index');
    documentEnity += `
  @Index()`;
  }

  if (primaryColumn) {
    importTypeorm.set('primaryColumn', 'PrimaryGeneratedColumn');
    documentEnity += `
  @PrimaryGeneratedColumn(${uuid ? "'uuid'" : ''})
  ${name}: ${type};
    `;
  }

  if (!primaryColumn) {
    importTypeorm.set('defaultColumn', 'Column');
    documentEnity += `
  @Column(${
    Object.keys(columnObject).length === 0
      ? ''
      : util.inspect(columnObject, false, null, false)
  })
  ${name}: ${type};
    `;
  }
  columnObject = {};
}

documentEnity += `
  @Index()
  @CreatedDateColumn()
  ${createdColumn}: Date;

  @Index()
  @UpdatedDateColumn()
  ${updatedColumn}: Date;
}`;

const maxImportSizeTypeORM = importTypeorm.size + 1;

let importTypeormText = 'import {';
let loopTypeORM = 1;
importTypeorm.forEach((value, key, map) => {
  loopTypeORM++;
  if (loopTypeORM === maxImportSizeTypeORM) {
    importTypeormText += ` ${value}`;
  } else {
    importTypeormText += ` ${value},`;
  }
});

importTypeormText += ` } from "typeorm";\n`;

const entity = importTypeormText + documentEnity;

fs.mkdirSync(`./${globalFileName}/entities`, { recursive: true });
fs.writeFileSync(
  `./${globalFileName}/entities/${globalFileName}.entity.ts`,
  entity
);

let documentCreateDto = `
export class Create${tableName}Dto {`;
let documentUpdateDto = `
export class Update${tableName}Dto {`;
let documentDeleteDto = `
export class Delete${tableName}Dto {`;

let importCreateValidator = new Map();
let importUpdateValidator = new Map();
let importDeleteValidator = new Map();

const createDtoArrary = [];
const updateDtoArrary = [];
const deleteDtoArray = [];
for (let column of tableColumns) {
  let { name, type, nullable, primaryColumn } = column;

  if (primaryColumn) {
    importDeleteValidator.set('notnullable', 'IsNotEmpty');
    deleteDtoArray.push(name);
    if (type === 'string') {
      importDeleteValidator.set('string', 'IsUUID');
      documentDeleteDto += `
  @IsUUID(4)`;
    } else if (type === 'number') {
      importDeleteValidator.set('number', 'IsNumber');
      documentDeleteDto += `
  @IsNumber()`;
    }
    documentDeleteDto += `
  ${name}: ${type};\n`;
  }

  if (!primaryColumn) {
    if (nullable) {
      importCreateValidator.set('nullable', 'IsOptional');
      documentCreateDto += `
  @IsOptional()`;
    }

    if (!nullable) {
      importCreateValidator.set('notnullable', 'IsNotEmpty');
      documentCreateDto += `
  @IsNotEmpty()`;
    }

    if (type === 'string') {
      importCreateValidator.set('string', 'IsString');
      documentCreateDto += `
  @IsString()`;
    }

    if (type === 'number') {
      importCreateValidator.set('number', 'IsNumber');
      documentCreateDto += `
  @IsNumber()`;
    }

    if (type === 'date') {
      importCreateValidator.set('date', 'IsDate');
      documentCreateDto += `
  @IsDate()`;
    }

    createDtoArrary.push(name);
    documentCreateDto += `
  ${name}: ${type};\n`;
  }

  updateDtoArrary.push(name);
  if (!nullable && primaryColumn) {
    importUpdateValidator.set('nullable', 'IsNotEmpty');
    documentUpdateDto += `
  @IsNotEmpty()`;
  }
  if (nullable && !primaryColumn) {
    importUpdateValidator.set('nullable', 'IsOptional');
    documentUpdateDto += `
  @IsOptional()`;
  }

  if (!nullable && !primaryColumn) {
    importUpdateValidator.set('notnullable', 'IsNotEmpty');
    documentUpdateDto += `
  @IsOptional()`;
  }

  if (type === 'string') {
    importUpdateValidator.set('string', 'IsString');
    documentUpdateDto += `
  @IsString()`;
  }

  if (type === 'number') {
    importUpdateValidator.set('number', 'IsNumber');
    documentUpdateDto += `
  @IsNumber()`;
  }

  if (type === 'date') {
    importUpdateValidator.set('date', 'IsDate');
    documentUpdateDto += `
  @IsDate()`;
  }

  documentUpdateDto += `
  ${name}: ${type};\n`;
}

documentCreateDto += `}`;
documentUpdateDto += `}`;
documentDeleteDto += `}`;

const maxImportSizeCreateDto = importCreateValidator.size + 1;
let importCreateValidatorText = 'import {';
let loopCreateDto = 1;

importCreateValidator.forEach((value, key, map) => {
  loopCreateDto++;
  if (loopCreateDto === maxImportSizeCreateDto) {
    importCreateValidatorText += ` ${value}`;
  } else {
    importCreateValidatorText += ` ${value},`;
  }
});
importCreateValidatorText += ` } from "class-validator";\n`;

const createDto = importCreateValidatorText + documentCreateDto;

fs.mkdirSync(`./${globalFileName}/dtos/${globalFileName}-dtos`, {
  recursive: true
});
fs.writeFileSync(
  `./${globalFileName}/dtos/${globalFileName}-dtos/create-${globalFileName}.dto.ts`,
  createDto
);

const maxImportSizeUpdateDto = importCreateValidator.size + 1;
let importUpdateValidatorText = 'import {';
let loopUpdateDto = 1;

importUpdateValidator.forEach((value, key, map) => {
  loopUpdateDto++;
  if (loopUpdateDto === maxImportSizeUpdateDto) {
    importUpdateValidatorText += ` ${value}`;
  } else {
    importUpdateValidatorText += ` ${value},`;
  }
});
importUpdateValidatorText += ` } from "class-validator";\n`;

const updateDto = importUpdateValidatorText + documentUpdateDto;

fs.writeFileSync(
  `./${globalFileName}/dtos/${globalFileName}-dtos/update-${globalFileName}.dto.ts`,
  updateDto
);

const maxImportDeleteSizeDto = importCreateValidator.size + 1;
let importDeleteValidatorText = 'import {';
let loopDeleteDto = 1;

importDeleteValidator.forEach((value, key, map) => {
  loopDeleteDto++;
  if (loopDeleteDto === maxImportDeleteSizeDto) {
    importDeleteValidatorText += ` ${value}`;
  } else {
    importDeleteValidatorText += ` ${value},`;
  }
});
importDeleteValidatorText += ` } from "class-validator";\n`;

const deleteDto = importDeleteValidatorText + documentDeleteDto;

fs.writeFileSync(
  `./${globalFileName}/dtos/${globalFileName}-dtos/delete-${globalFileName}.dto.ts`,
  deleteDto
);

let documentController = `import { Injectable, Controller, Get, Post, Put, Delete, Body, Res, Req } from '@nestjs/common';
import { Request, Response  } from 'express';
import { ${tableName}Service } from './${globalFileName}.service';
import { Create${tableName}Dto } from './dtos/${globalFileName}-dtos/create-${globalFileName}.dto';
import { Update${tableName}Dto } from './dtos/${globalFileName}-dtos/update-${globalFileName}.dto';
import { Delete${tableName}Dto } from './dtos/${globalFileName}-dtos/delete-${globalFileName}.dto';

@Injectable()
@Controller('${controllerServiceName}')
export class ${tableName}Controller {
  constructor(private readonly ${controllerServiceName}Service: ${tableName}Service) {}
  
  @Get()
  async fetchAll${controllerServiceNameAlt}() {
    return this.${controllerServiceName}Service.fetchAll${controllerServiceNameAlt}();
  }
  
  @Post()
  async create${controllerServiceNameAlt} (
    @Body() create${tableName}Dto: Create${tableName}Dto,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const cookie = req.cookies[process.env.REFRESH_TOKEN];
    const pieUserPayload = await this.${controllerServiceName}Service.verifyJWT(cookie);
    const result = await this.${controllerServiceName}Service.create${controllerServiceNameAlt}(
      create${tableName}Dto,
      pieUserPayload
    )

    if (result.hasOwnProperty('code')) return res.status(409).send(result);
    return res.status(201).send(result);
  }

  @Put()
  async update${controllerServiceNameAlt} (
    @Body() update${tableName}Dto: Update${tableName}Dto,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const cookie = req.cookies[process.env.REFRESH_TOKEN];
    const pieUserPayload = await this.${controllerServiceName}Service.verifyJWT(cookie);
      
    const result = await this.${controllerServiceName}Service.update${controllerServiceNameAlt}(
      update${tableName}Dto,
      pieUserPayload
    );

    if (result.hasOwnProperty('code')) return res.status(409).send(result);
    return res.status(200).send(result);
  }

  @Delete()
  async delete${controllerServiceNameAlt} (
    @Body() delete${tableName}Dto: Delete${tableName}Dto
  ) {
    return this.${controllerServiceName}Service.delete${controllerServiceNameAlt}(delete${tableName}Dto);
  }
}
  `;

fs.writeFileSync(
  `./${globalFileName}/${globalFileName}.controller.ts`,
  documentController
);

let documentCache = `export const fetchAll${tableName}s = "fetchAll${tableName}s";`;

fs.mkdirSync(`${globalFileName}/constants`, { recursive: true });
fs.writeFileSync(
  `./${globalFileName}/constants/cache.constant.ts`,
  documentCache
);

let create = '';
let createDtoArraryLoop = 1;
let createDtoArraryMaxLoop = createDtoArrary.length + 1;
createDtoArrary.forEach(data => {
  createDtoArraryLoop++;
  if (createDtoArraryLoop === createDtoArraryMaxLoop) {
    create += `${data}`;
  } else {
    create += `${data}, `;
  }
});
let documentService = `
import { BadRequestException, InternalServerErrorException, Injectable  } from '@nestjs/common';
import { fetchAll${tableName}s } from './constants/cache.constant';
import { getConnection  } from 'typeorm';
import { CoreOutput  } from 'sm-interfaces';
import { ${tableName} } from './entities/${globalFileName}.entity';
import { client  } from '../main';
import {
  PG_UNIQUE_CONSTRAINT_VIOLATION,
  PG_VIOLATES_FK_CONSTRAINT,
  SomethingWentWrong,
  SomethingWentWrongCode,
  UnableToCreate,
  UnableToCreateCode,
  UnableToDeleteParticular,
  UnableToDeleteParticularCode,
  UnableToFindAny,
  UnableToFindAnyCode,
  UnableToFindParticularContent,
  UnableToFindParticularContentCode,
  UnableToUpdateParticular,
  UnableToUpdateParticularCode
} from 'sm-errors';
import {
  CreateSuccessful,
  DeleteSuccessful,
  MailSentSuccessfully,
  PasswordResetSuccessful,
  UpdateSuccessful
} from 'sm-messages';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ${tableName}Service {
  constructor() {}

  async fetchAll${controllerServiceNameAlt} () {
    try {
      const cache = await client.get(fetchAll${tableName}s);
      if (cache) return JSON.parse(cache);
    } catch (error) {
      await client.del(fetchAll${tableName}s);
    }

    const route = '${routeName}';
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const result = await queryRunner.manager.find<${tableName}>(
        ${tableName}
      );

      await client.set(fetchAll${tableName}s, JSON.stringify(result));

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        ok: false,
        error: true,
        message: SomethingWentWrong,
        code: SomethingWentWrongCode
      })
    } finally {
      await queryRunner.release();
    }
  }

  async create${tableName} (
    { ${create}  },
    pieUserPayload
  ): Promise<CoreOutput> {
    const route = '${routeName}';
    const connection = getConnection(); 
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ${controllerServiceName} = new ${tableName}();

      const result = await queryRunner.manager.save<${tableName}>(${controllerServiceName});
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new BadRequestException({
          ok: false,
          error: true,
          message: error.detail,
          code: error.code
        });
      }
      if (error && error.code === PG_VIOLATES_FK_CONSTRAINT) {
        throw new BadRequestException({
          ok: false,
          error: true,
          message: error.detail,
          code: error.code
        });
      }
      throw new InternalServerErrorException({
        ok: false,
        error: true,
        code: SomethingWentWrongCode,
        message: SomethingWentWrong
      });
    } finally {
      await queryRunner.release();
    }
  }

  async verifyJWT(token: string) {
    try {
      const PRIVATE_KEY = JSON.parse('"${process.env.PRIVATE_KEY}"');
      const PUBLIC_KEY = JSON.parse('"${process.env.PUBLIC_KEY}"');

      const decoded = jwt.verify(token, PUBLIC_KEY, {
        algorithms: ['RS512']
      });

      return decoded;
    } catch (error) {
      return {
        payload: null,
        expired: error.message.includes('jwt expired')
      };
    }
  }
}`;

fs.writeFileSync(
  `./${globalFileName}/${globalFileName}.service.ts`,
  documentService
);
