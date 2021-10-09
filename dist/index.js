"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var util = require("util");
var tableName = 'User';
var globalFileName = tableName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
var controllerServiceName = tableName.charAt(0).toLowerCase() + tableName.slice(1);
var controllerServiceNameAlt = tableName.charAt(0).toUpperCase() + tableName.slice(1);
var routeName = tableName.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
var tableColumns = [
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
var createdColumn = 'createdOn';
var updatedColumn = 'updatedOn';
var createdByColumn = "createdBy";
var updatedByColumn = "updatedBy";
var primaryKey = tableColumns.filter(function (column) {
    return column.primaryColumn === true;
});
var documentEnity = "\n@Entity()\nexport class " + tableName + " {";
var importTypeorm = new Map();
var importForigenKey = [];
var columnObject = {};
importTypeorm.set('entity', 'Entity');
importTypeorm.set('createdDateColumn', 'CreatedDateColumn');
importTypeorm.set('updatedDateColumn', 'UpdatedDateColumn');
for (var _i = 0, tableColumns_1 = tableColumns; _i < tableColumns_1.length; _i++) {
    var column = tableColumns_1[_i];
    var name_1 = column.name, primaryColumn = column.primaryColumn, index = column.index, uuid = column.uuid, type = column.type, columnType = column.columnType, nullable = column.nullable, unique = column.unique;
    if (nullable)
        columnObject.nullable = true;
    if (unique)
        columnObject.unique = true;
    if (columnType)
        columnObject.type = columnType;
    if (index) {
        importTypeorm.set('index', 'Index');
        documentEnity += "\n  @Index()";
    }
    if (primaryColumn) {
        importTypeorm.set('primaryColumn', 'PrimaryGeneratedColumn');
        documentEnity += "\n  @PrimaryGeneratedColumn(" + (uuid ? "'uuid'" : '') + ")\n  " + name_1 + ": " + type + ";\n    ";
    }
    if (!primaryColumn) {
        importTypeorm.set('defaultColumn', 'Column');
        documentEnity += "\n  @Column(" + (Object.keys(columnObject).length === 0
            ? ''
            : util.inspect(columnObject, false, null, false)) + ")\n  " + name_1 + ": " + type + ";\n    ";
    }
    columnObject = {};
}
documentEnity += "\n  @Index()\n  @CreatedDateColumn()\n  " + createdColumn + ": Date;\n\n  @Index()\n  @UpdatedDateColumn()\n  " + updatedColumn + ": Date;\n}";
var maxImportSizeTypeORM = importTypeorm.size + 1;
var importTypeormText = 'import {';
var loopTypeORM = 1;
importTypeorm.forEach(function (value, key, map) {
    loopTypeORM++;
    if (loopTypeORM === maxImportSizeTypeORM) {
        importTypeormText += " " + value;
    }
    else {
        importTypeormText += " " + value + ",";
    }
});
importTypeormText += " } from \"typeorm\";\n";
var entity = importTypeormText + documentEnity;
fs.mkdirSync("./" + globalFileName + "/entities", { recursive: true });
fs.writeFileSync("./" + globalFileName + "/entities/" + globalFileName + ".entity.ts", entity);
var documentCreateDto = "\nexport class Create" + tableName + "Dto {";
var documentUpdateDto = "\nexport class Update" + tableName + "Dto {";
var documentDeleteDto = "\nexport class Delete" + tableName + "Dto {";
var importCreateValidator = new Map();
var importUpdateValidator = new Map();
var importDeleteValidator = new Map();
var createDtoArrary = [];
var updateDtoArrary = [];
var deleteDtoArray = [];
for (var _a = 0, tableColumns_2 = tableColumns; _a < tableColumns_2.length; _a++) {
    var column = tableColumns_2[_a];
    var name_2 = column.name, type = column.type, nullable = column.nullable, primaryColumn = column.primaryColumn;
    if (primaryColumn) {
        importDeleteValidator.set('notnullable', 'IsNotEmpty');
        deleteDtoArray.push(name_2);
        if (type === 'string') {
            importDeleteValidator.set('string', 'IsUUID');
            documentDeleteDto += "\n  @IsUUID(4)";
        }
        else if (type === 'number') {
            importDeleteValidator.set('number', 'IsNumber');
            documentDeleteDto += "\n  @IsNumber()";
        }
        documentDeleteDto += "\n  " + name_2 + ": " + type + ";\n";
    }
    if (!primaryColumn) {
        if (nullable) {
            importCreateValidator.set('nullable', 'IsOptional');
            documentCreateDto += "\n  @IsOptional()";
        }
        if (!nullable) {
            importCreateValidator.set('notnullable', 'IsNotEmpty');
            documentCreateDto += "\n  @IsNotEmpty()";
        }
        if (type === 'string') {
            importCreateValidator.set('string', 'IsString');
            documentCreateDto += "\n  @IsString()";
        }
        if (type === 'number') {
            importCreateValidator.set('number', 'IsNumber');
            documentCreateDto += "\n  @IsNumber()";
        }
        if (type === 'date') {
            importCreateValidator.set('date', 'IsDate');
            documentCreateDto += "\n  @IsDate()";
        }
        createDtoArrary.push(name_2);
        documentCreateDto += "\n  " + name_2 + ": " + type + ";\n";
    }
    updateDtoArrary.push(name_2);
    if (!nullable && primaryColumn) {
        importUpdateValidator.set('nullable', 'IsNotEmpty');
        documentUpdateDto += "\n  @IsNotEmpty()";
    }
    if (nullable && !primaryColumn) {
        importUpdateValidator.set('nullable', 'IsOptional');
        documentUpdateDto += "\n  @IsOptional()";
    }
    if (!nullable && !primaryColumn) {
        importUpdateValidator.set('notnullable', 'IsNotEmpty');
        documentUpdateDto += "\n  @IsOptional()";
    }
    if (type === 'string') {
        importUpdateValidator.set('string', 'IsString');
        documentUpdateDto += "\n  @IsString()";
    }
    if (type === 'number') {
        importUpdateValidator.set('number', 'IsNumber');
        documentUpdateDto += "\n  @IsNumber()";
    }
    if (type === 'date') {
        importUpdateValidator.set('date', 'IsDate');
        documentUpdateDto += "\n  @IsDate()";
    }
    documentUpdateDto += "\n  " + name_2 + ": " + type + ";\n";
}
documentCreateDto += "}";
documentUpdateDto += "}";
documentDeleteDto += "}";
var maxImportSizeCreateDto = importCreateValidator.size + 1;
var importCreateValidatorText = 'import {';
var loopCreateDto = 1;
importCreateValidator.forEach(function (value, key, map) {
    loopCreateDto++;
    if (loopCreateDto === maxImportSizeCreateDto) {
        importCreateValidatorText += " " + value;
    }
    else {
        importCreateValidatorText += " " + value + ",";
    }
});
importCreateValidatorText += " } from \"class-validator\";\n";
var createDto = importCreateValidatorText + documentCreateDto;
fs.mkdirSync("./" + globalFileName + "/dtos/" + globalFileName + "-dtos", {
    recursive: true
});
fs.writeFileSync("./" + globalFileName + "/dtos/" + globalFileName + "-dtos/create-" + globalFileName + ".dto.ts", createDto);
var maxImportSizeUpdateDto = importCreateValidator.size + 1;
var importUpdateValidatorText = 'import {';
var loopUpdateDto = 1;
importUpdateValidator.forEach(function (value, key, map) {
    loopUpdateDto++;
    if (loopUpdateDto === maxImportSizeUpdateDto) {
        importUpdateValidatorText += " " + value;
    }
    else {
        importUpdateValidatorText += " " + value + ",";
    }
});
importUpdateValidatorText += " } from \"class-validator\";\n";
var updateDto = importUpdateValidatorText + documentUpdateDto;
fs.writeFileSync("./" + globalFileName + "/dtos/" + globalFileName + "-dtos/update-" + globalFileName + ".dto.ts", updateDto);
var maxImportDeleteSizeDto = importCreateValidator.size + 1;
var importDeleteValidatorText = 'import {';
var loopDeleteDto = 1;
importDeleteValidator.forEach(function (value, key, map) {
    loopDeleteDto++;
    if (loopDeleteDto === maxImportDeleteSizeDto) {
        importDeleteValidatorText += " " + value;
    }
    else {
        importDeleteValidatorText += " " + value + ",";
    }
});
importDeleteValidatorText += " } from \"class-validator\";\n";
var deleteDto = importDeleteValidatorText + documentDeleteDto;
fs.writeFileSync("./" + globalFileName + "/dtos/" + globalFileName + "-dtos/delete-" + globalFileName + ".dto.ts", deleteDto);
var documentController = "import { Injectable, Controller, Get, Post, Put, Delete, Body, Res, Req } from '@nestjs/common';\nimport { Request, Response  } from 'express';\nimport { " + tableName + "Service } from './" + globalFileName + ".service';\nimport { Create" + tableName + "Dto } from './dtos/" + globalFileName + "-dtos/create-" + globalFileName + ".dto';\nimport { Update" + tableName + "Dto } from './dtos/" + globalFileName + "-dtos/update-" + globalFileName + ".dto';\nimport { Delete" + tableName + "Dto } from './dtos/" + globalFileName + "-dtos/delete-" + globalFileName + ".dto';\n\n@Injectable()\n@Controller('" + controllerServiceName + "')\nexport class " + tableName + "Controller {\n  constructor(private readonly " + controllerServiceName + "Service: " + tableName + "Service) {}\n  \n  @Get()\n  async fetchAll" + controllerServiceNameAlt + "() {\n    return this." + controllerServiceName + "Service.fetchAll" + controllerServiceNameAlt + "();\n  }\n  \n  @Post()\n  async create" + controllerServiceNameAlt + " (\n    @Body() create" + tableName + "Dto: Create" + tableName + "Dto,\n    @Res() res: Response,\n    @Req() req: Request\n  ) {\n    const cookie = req.cookies[process.env.REFRESH_TOKEN];\n    const pieUserPayload = await this." + controllerServiceName + "Service.verifyJWT(cookie);\n    const result = await this." + controllerServiceName + "Service.create" + controllerServiceNameAlt + "(\n      create" + tableName + "Dto,\n      pieUserPayload\n    )\n\n    if (result.hasOwnProperty('code')) return res.status(409).send(result);\n    return res.status(201).send(result);\n  }\n\n  @Put()\n  async update" + controllerServiceNameAlt + " (\n    @Body() update" + tableName + "Dto: Update" + tableName + "Dto,\n    @Res() res: Response,\n    @Req() req: Request\n  ) {\n    const cookie = req.cookies[process.env.REFRESH_TOKEN];\n    const pieUserPayload = await this." + controllerServiceName + "Service.verifyJWT(cookie);\n      \n    const result = await this." + controllerServiceName + "Service.update" + controllerServiceNameAlt + "(\n      update" + tableName + "Dto,\n      pieUserPayload\n    );\n\n    if (result.hasOwnProperty('code')) return res.status(409).send(result);\n    return res.status(200).send(result);\n  }\n\n  @Delete()\n  async delete" + controllerServiceNameAlt + " (\n    @Body() delete" + tableName + "Dto: Delete" + tableName + "Dto\n  ) {\n    return this." + controllerServiceName + "Service.delete" + controllerServiceNameAlt + "(delete" + tableName + "Dto);\n  }\n}\n  ";
fs.writeFileSync("./" + globalFileName + "/" + globalFileName + ".controller.ts", documentController);
var documentCache = "export const fetchAll" + tableName + "s = \"fetchAll" + tableName + "s\";";
fs.mkdirSync(globalFileName + "/constants", { recursive: true });
fs.writeFileSync("./" + globalFileName + "/constants/cache.constant.ts", documentCache);
var create = '';
var createDtoArraryLoop = 1;
var createDtoArraryMaxLoop = createDtoArrary.length + 1;
createDtoArrary.forEach(function (data) {
    createDtoArraryLoop++;
    if (createDtoArraryLoop === createDtoArraryMaxLoop) {
        create += "" + data;
    }
    else {
        create += data + ", ";
    }
});
var update = '';
var updateDtoArraryLoop = 1;
var updateDtoArraryMaxLoop = updateDtoArrary.length + 1;
updateDtoArrary.forEach(function (data) {
    updateDtoArraryLoop++;
    if (updateDtoArraryLoop === updateDtoArraryMaxLoop) {
        update += "" + data;
    }
    else {
        update += data + ", ";
    }
});
var createServiceSave = '';
var createServiceSaveLoop = 1;
var createServiceSaveMaxLoop = createDtoArrary.length + 1;
createDtoArrary.forEach(function (data) {
    createServiceSaveLoop++;
    if (createServiceSaveLoop === createServiceSaveMaxLoop) {
        createServiceSave += "\n      " + controllerServiceName + "." + data + " = " + data;
    }
    else {
        createServiceSave += "\n      " + controllerServiceName + "." + data + " = " + data + ";";
    }
});
var updateServiceSave = '';
var updateServiceSaveLoop = 1;
var updateServiceSaveMaxLoop = createDtoArrary.length + 1;
updateDtoArrary.forEach(function (data) {
    updateServiceSaveLoop++;
    if (updateServiceSaveLoop === updateServiceSaveMaxLoop) {
        updateServiceSave += "\n    " + (data === 'id' ? '' : "  if (" + data + ")") + " " + controllerServiceName + "." + data + " = " + data;
    }
    else {
        updateServiceSave += "\n    " + (data === 'id' ? '' : "  if (" + data + ")") + "  " + controllerServiceName + "." + data + " = " + data + ";";
    }
});
var documentService = "\nimport { BadRequestException, InternalServerErrorException, Injectable  } from '@nestjs/common';\nimport { fetchAll" + tableName + "s } from './constants/cache.constant';\nimport { getConnection  } from 'typeorm';\nimport { CoreOutput  } from 'sm-interfaces';\nimport { " + tableName + " } from './entities/" + globalFileName + ".entity';\nimport { client  } from '../main';\nimport {\n  PG_UNIQUE_CONSTRAINT_VIOLATION,\n  PG_VIOLATES_FK_CONSTRAINT,\n  SomethingWentWrong,\n  SomethingWentWrongCode,\n  UnableToCreate,\n  UnableToCreateCode,\n  UnableToDeleteParticular,\n  UnableToDeleteParticularCode,\n  UnableToFindAny,\n  UnableToFindAnyCode,\n  UnableToFindParticularContent,\n  UnableToFindParticularContentCode,\n  UnableToUpdateParticular,\n  UnableToUpdateParticularCode\n} from 'sm-errors';\nimport {\n  CreateSuccessful,\n  DeleteSuccessful,\n  UpdateSuccessful\n} from 'sm-messages';\nimport * as jwt from 'jsonwebtoken';\n\n@Injectable()\nexport class " + tableName + "Service {\n  constructor() {}\n\n  async fetchAll" + controllerServiceNameAlt + " () {\n    try {\n      const cache = await client.get(fetchAll" + tableName + "s);\n      if (cache) return JSON.parse(cache);\n    } catch (error) {\n      await client.del(fetchAll" + tableName + "s);\n    }\n\n    const route = '" + routeName + "';\n    const connection = getConnection();\n    const queryRunner = connection.createQueryRunner();\n    \n    await queryRunner.connect();\n    await queryRunner.startTransaction();\n    \n    try {\n      const result = await queryRunner.manager.find<" + tableName + ">(\n        " + tableName + "\n      );\n\n      await client.set(fetchAll" + tableName + "s, JSON.stringify(result));\n\n      await queryRunner.commitTransaction();\n\n      return result;\n    } catch (error) {\n      await queryRunner.rollbackTransaction();\n      throw new InternalServerErrorException({\n        ok: false,\n        error: true,\n        message: SomethingWentWrong,\n        code: SomethingWentWrongCode\n      })\n    } finally {\n      await queryRunner.release();\n    }\n  }\n\n  async create" + tableName + " (\n    { " + create + "  },\n    pieUserPayload\n  ): Promise<CoreOutput> {\n    const route = '" + routeName + "';\n    const connection = getConnection(); \n    const queryRunner = connection.createQueryRunner();\n\n    await queryRunner.connect();\n    await queryRunner.startTransaction();\n\n    try {\n      const " + controllerServiceName + " = new " + tableName + "();\n      " + createServiceSave + ";\n\n      const result = await queryRunner.manager.save<" + tableName + ">(" + controllerServiceName + ");\n      \n      if (!result) {\n        return {\n          ok: false,\n          error: true,\n          message: UnableToCreate(route),\n          code: UnableToCreateCode\n        };\n      }\n\n      await client.del(fetchAll" + tableName + "s);\n  \n      return {\n        ok: true,\n        error: false,\n        message: CreateSuccessful(route);\n      }\n    \n    } catch (error) {\n      await queryRunner.rollbackTransaction();\n      \n      if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {\n        throw new BadRequestException({\n          ok: false,\n          error: true,\n          message: error.detail,\n          code: error.code\n        });\n      }\n      \n      if (error && error.code === PG_VIOLATES_FK_CONSTRAINT) {\n        throw new BadRequestException({\n          ok: false,\n          error: true,\n          message: error.detail,\n          code: error.code\n        });\n      }\n      \n      throw new InternalServerErrorException({\n        ok: false,\n        error: true,\n        code: SomethingWentWrongCode,\n        message: SomethingWentWrong\n      });\n    \n    } finally {\n      await queryRunner.release();\n    }\n  }\n\n  async update" + tableName + " (\n    { " + update + "  },\n    pieUserPayload\n  ) {\n    const route = '" + routeName + "';\n    const connection = getConnection();\n    const queryRunner = connection.createQueryRunner();\n\n    await queryRunner.connect();\n    await queryRunner.startTransaction();\n\n    try {\n      const " + controllerServiceName + " = new " + tableName + "();\n      " + updateServiceSave + "\n\n      const result = await queryRunner.manager.update<" + tableName + ">(\n        " + tableName + ",\n        { " + primaryKey[0].name + "  },\n        " + controllerServiceName + "\n      )\n\n      if (result.affected === 0) {\n        return {\n          ok: false,\n          error: true,\n          message: UnableToUpdateParticular(route),\n          code: UnableToUpdateParticularCode\n        };\n      }\n\n      await queryRunner.commitTransaction();\n\n      await client.del(fetchAll" + tableName + "s);\n\n      return {\n        ok: true,\n        error: false,\n        message: UpdateSuccessful(route)\n      }\n\n    } catch (error) {\n      await queryRunner.rollbackTransaction();\n\n      if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {\n        throw new BadRequestException({\n          ok: false,\n          error: true,\n          message: error.detail,\n          code: error.code\n        });\n      }\n\n      if (error && error.code === PG_VIOLATES_FK_CONSTRAINT) {\n        throw new BadRequestException({\n          ok: false,\n          error: true,\n          message: error.detail,\n          code: error.code\n        });\n      }\n\n      throw new InternalServerErrorException({\n        ok: false,\n        error: true,\n        code: SomethingWentWrongCode,\n        message: SomethingWentWrong\n      });\n\n    } finally {\n      await queryRunner.release();\n    }\n  }\n\n  async verifyJWT(token: string) {\n    try {\n      const PRIVATE_KEY = JSON.parse('\"" + process.env.PRIVATE_KEY + "\"');\n      const PUBLIC_KEY = JSON.parse('\"" + process.env.PUBLIC_KEY + "\"');\n\n      const decoded = jwt.verify(token, PUBLIC_KEY, {\n        algorithms: ['RS512']\n      });\n\n      return decoded;\n    } catch (error) {\n      return {\n        payload: null,\n        expired: error.message.includes('jwt expired')\n      };\n    }\n  }\n}";
fs.writeFileSync("./" + globalFileName + "/" + globalFileName + ".service.ts", documentService);
//# sourceMappingURL=index.js.map