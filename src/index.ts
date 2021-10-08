import * as fs from 'fs';
import * as util from 'util';

const tableName = 'User';
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
let importForigenKey: any[] = [];
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
  console.log(columnObject);

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
let importTypeormText = 'import {';
//importTypeorm.forEach(import => {
//  importTypeormText += ` ${import}`,
//})
console.log(importTypeorm);
const maxImportSize = importTypeorm.size + 1;
let loop = 1;
importTypeorm.forEach((value, key, map) => {
  loop++;
  if (loop === maxImportSize) {
    importTypeormText += ` ${value}`;
  } else {
    importTypeormText += ` ${value},`;
  }
});

importTypeormText += ` } from "typeorm";\n`;

const entity = importTypeormText + documentEnity;

fs.mkdir(`./${tableName.toLowerCase()}/entities`, { recursive: true }, err => {
  if (err) throw err;
});
fs.writeFile(
  `./${tableName.toLowerCase()}/entities/${tableName.toLowerCase()}.entity.ts`,
  entity,
  err => {
    if (err) throw err;

    console.log('The file was succesfully saved!');
  }
);
