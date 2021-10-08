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
let importForigenKey = [];
let columnObject: any = {};
for (let column of tableColumns) {
  let { name, primaryColumn, index, uuid, type, columnType, nullable, unique } =
    column;

  if (nullable) columnObject.nullable = true;
  if (unique) columnObject.unique = true;
  if (columnType) columnObject.type = columnType;
  console.log(columnObject);

  if (index) {
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
    documentEnity += `
  @Column(${
    Object.keys(columnObject).length === 0
      ? ''
      : util.inspect(columnObject, false, null, true)
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

fs.writeFile(`${tableName.toLowerCase()}.entity.ts`, documentEnity, err => {
  if (err) throw err;

  console.log('The file was succesfully saved!');
});
