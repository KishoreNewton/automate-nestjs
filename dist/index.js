"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var util = require("util");
var tableName = 'User';
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
    console.log(columnObject);
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
var importTypeormText = 'import {';
//importTypeorm.forEach(import => {
//  importTypeormText += ` ${import}`,
//})
console.log(importTypeorm);
var maxImportSize = importTypeorm.size + 1;
var loop = 1;
importTypeorm.forEach(function (value, key, map) {
    loop++;
    if (loop === maxImportSize) {
        importTypeormText += " " + value;
    }
    else {
        importTypeormText += " " + value + ",";
    }
});
importTypeormText += " } from \"typeorm\";\n";
var entity = importTypeormText + documentEnity;
fs.mkdir("./" + tableName.toLowerCase() + "/entities", { recursive: true }, function (err) {
    if (err)
        throw err;
});
fs.writeFile("./" + tableName.toLowerCase() + "/entities/" + tableName.toLowerCase() + ".entity.ts", entity, function (err) {
    if (err)
        throw err;
    console.log('The file was succesfully saved!');
});
//# sourceMappingURL=index.js.map