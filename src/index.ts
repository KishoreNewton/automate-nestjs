import * as fs from 'fs';
import * as util from 'util';

const tableName = 'UserHereTable';
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

fs.mkdirSync(
  `./${tableName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()}/entities`,
  { recursive: true }
);
fs.writeFileSync(
  `./${tableName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()}/entities/${tableName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()}.entity.ts`,
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

for (let column of tableColumns) {
  let { name, type, nullable, primaryColumn } = column;

  if (primaryColumn) {
    importDeleteValidator.set('notnullable', 'IsNotEmpty');
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

    documentCreateDto += `
  ${name}: ${type};\n`;
  }

  if (!nullable && primaryColumn) {
    importUpdateValidator.set('nullable', 'IsNotEmpty');
    documentUpdateDto += `
  @IsNotEmpty()`;
  }
  console.log(nullable, primaryColumn);
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
console.log(importCreateValidatorText);

const createDto = importCreateValidatorText + documentCreateDto;

fs.mkdirSync(
  `./${tableName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()}/dtos/${tableName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()}-dtos`,
  {
    recursive: true
  }
);
fs.writeFileSync(
  `./${tableName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()}/dtos/${tableName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()}-dtos/create-${tableName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()}.dto.ts`,
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
console.log(importUpdateValidatorText);

const updateDto = importUpdateValidatorText + documentUpdateDto;

fs.writeFileSync(
  `./${tableName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()}/dtos/${tableName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()}-dtos/update-${tableName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()}.dto.ts`,
  updateDto
);
