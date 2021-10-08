"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var util = require("util");
var tableName = 'User';
var globalFileName = tableName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
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
for (var _a = 0, tableColumns_2 = tableColumns; _a < tableColumns_2.length; _a++) {
    var column = tableColumns_2[_a];
    var name_2 = column.name, type = column.type, nullable = column.nullable, primaryColumn = column.primaryColumn;
    if (primaryColumn) {
        importDeleteValidator.set('notnullable', 'IsNotEmpty');
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
        documentCreateDto += "\n  " + name_2 + ": " + type + ";\n";
    }
    if (!nullable && primaryColumn) {
        importUpdateValidator.set('nullable', 'IsNotEmpty');
        documentUpdateDto += "\n  @IsNotEmpty()";
    }
    console.log(nullable, primaryColumn);
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
console.log(importCreateValidatorText);
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
console.log(importUpdateValidatorText);
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
console.log(importUpdateValidatorText);
var deleteDto = importDeleteValidatorText + documentDeleteDto;
fs.writeFileSync("./" + globalFileName + "/dtos/" + globalFileName + "-dtos/delete-" + globalFileName + ".dto.ts", deleteDto);
var documentController = "\n@Injectable()\n@Controller('" + tableName.replace(/([a-z0-9])([A-Z])/g, '$1-$2') + "')\nexport class " + tableName + "Controller {\n  constructor(private readonly " + (tableName.charAt(0).toLowerCase() + tableName.slice(1)) + "Service: " + tableName + "Service) {}\n  \n  @Get()\n  async fetchAll" + (tableName.charAt(0).toLowerCase() + tableName.slice(1)) + "() {\n    return this." + (tableName.charAt(0).toLowerCase() + tableName.slice(1)) + "Service.fetchAll" + (tableName.charAt(0).toLowerCase() + tableName.slice(1)) + "();\n  }";
fs.writeFileSync("./" + globalFileName + "/" + globalFileName + ".controller.ts", documentController);
//# sourceMappingURL=index.js.map