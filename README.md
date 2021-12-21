# RSQL / FIQL tools

Complete and thoroughly tested parser for RSQL/FIQL written in Typescript(Javascript).
Tools to work with RSQL: matcher, filter, converter to SQL.
Built with zero dependencies.

## Installing

```sh
npm install @mw-experts/rsql
```

or

```sh
yarn add @mw-experts/rsql
```

## Usage

### Import library

Import library as CommonJS module:
```
const rsql = require('@mw-experts/rsql');
```

Import library as ES6 module:
```
import { RsqlMatcher } from '@mw-experts/rsql';
import { RsqlFilter } from '@mw-experts/rsql';
import { RsqlToSqlConverter } from '@mw-experts/rsql';
```
or
```
import * as rsql from '@mw-experts/rsql';
```

Import library as standalone script in a browser:
```
<script src="../node_modules/@mw-experts/rsql/dist/rsql-browser.js"></script>
```

## About RSQL / FIQL

RSQL is a query language for parametrized filtering of entries in RESTful APIs.

It’s based on [FIQL](http://tools.ietf.org/html/draft-nottingham-atompub-fiql-00) (Feed Item Query Language)
an URI-friendly syntax for expressing filters across the entries in an Atom Feed.

The simplicity of RSQL and its capability to express complex queries in a compact and HTTP URI-friendly way
makes it a good candidate for becoming a generic query language for searching REST endpoints.

For example, you can query your resource like this:

`/movies?search=name=="Kill Bill";year=gt=2003`

or

`/movies?search=director.lastName==Nolan and year>=2000`.

RSQL introduces simple and composite operators which can be used to build basic and complex queries.

### Basic operators:

| Basic Operator | Description         |
|----------------|---------------------|
| ==             | Equal To            |
| !=             | Not Equal To        |
| =gt=           | Greater Than        |
| >              | Greater Than        |
| =ge=           | Greater Or Equal To |
| >=             | Greater Or Equal To |
| =lt=           | Less Than           |
| <              | Less Than           |
| =le=           | Less Or Equal To    |
| <=             | Less Or Equal To    |
| =in=           | In                  |
| =out=          | Not in              |
| =includes-all= | Includes all        |
| =includes-one= | Includes one        |

These operators can be used to do all sort of simple queries, for example:

* name==Fero: find all people whose name is Fero
* street!=Darna: find all people who do not live at Darna
* age=gt=10: find all people older than 10 (exclusive)
* age>10: find all people older than 10 (exclusive)
* age=ge=10: find all people older than 10 (inclusive)
* age>=10: find all people older than 10 (inclusive)
* house=lt=3: find all people who have less than 3 houses
* house<3: find all people who have less than 3 houses
* house=le=3: find all people who have less than or 3 houses
* house<=3: find all people who have less than or 3 houses
* name=in=(Fero,Jane) find all people whose name is Fero or Jane
* name=out=(Alex,Mike) find all people whose name is not Alex or Mike
* list=includes-all=(item1,item2) find all records where list is array and includes item1 and item2
* list=includes-one=(item1,item2) find all records where list is array and includes item1 or item2

### Composite operators:

| Composite Operator   | Description         |
|----------------------|---------------------|
| ;                    | Logical AND         |
| and                  | Logical AND         |
| ,                    | Logical OR          |
| or                   | Logical OR          |

These operators can be used to join the simple queries and build more involved queries which can be as complex as required.
Here are some examples:

* age=gt=10;age=lt=20: find all people older than 10 and younger than 20
* age=gt=10 and age=lt=20: find all people older than 10 and younger than 20
* age=lt=5,age=gt=30: find all people younger than 5 or older than 30
* age<5 or age>30: find all people younger than 5 or older than 30
* age=gt=10;age=lt=20;name=in=(Fero,Jane): find all people older than 10 and younger than 20 with names either Fero or Jane.

### Fields and Values

#### Fields can only consist of next regexp symbols: **[\w-.]** (A-Za-z0-9_-.)

* field.name==value
* field-name==value
* field_name==value
* FieldName==value
* FIELD_NAME_777==value

#### Values can only consist of next regexp symbols:

* in double quotes - space, any unicode letter, any unicode number, `_`, `-`, `.`, `'`, `(`, `)`
* in single quotes - space, any unicode letter, any unicode number, `_`, `-`, `.`, `"`, `(`, `)`
* without quotes - any unicode letter, any unicode number, `_`, `-`, `.`
* with == or != operators you can also use asterisk `*` as a wildcard

### Ordering

By default, operators evaluated from left to right.
However, a parenthesized expression can be used to change the precedence.

* age=lt=20;(name==Fero,name==Jane): find all people younger than 20 with names either Fero or Jane.

## Convert RSQL to SQL

```
const rsqlStr = 'name=="Kill Bill",year=ge=2000';
let result;

try {
  result = rsql.RsqlToSqlConverter.getInstance().convert(rsqlStr);
} catch (e) {
  console.warn(e);
}

console.log(result);

// will output:
// ("name" = 'Kill Bill' OR "year" >= '2000')
```

You can have different field names wrapper, for example if you use Mysql.
Just pass a second argument to `convert` method like this:

```
const rsqlStr = 'name=="Kill Bill",year=ge=2000';
let result;

try {
  result = rsql.RsqlToSqlConverter.getInstance().convert(rsqlStr, '`');
} catch (e) {
  console.warn(e);
}

console.log(result);

// will output:
// (`name` = 'Kill Bill' OR `year` >= '2000')
```

* "=includes-all=", "=includes-one=" operators are not supported in RsqlToSqlConverter
* Not included in browser bundle

## Filter array of objects

```
const data = [
  { name: 'Kill Bill', year: 2006 },
  { name: 'Terminator', year: 1998 },
  { name: 'Matrix', year: 2000 },
];

const rsqlStr = 'name=="Kill Bill",year=ge=2000';
let result = [];

try {
  result = rsql.RsqlFilter.getInstance().filter(rsqlStr, data);
} catch (e) {
  console.warn(e);
}

console.log(result);

// will output:
// [
//  { name: 'Kill Bill', year: 2006 },
//  { name: 'Matrix', year: 2000 },
// ]
```

#### You can ask for deep nested properties using dot separator - `someObj.prop`, or array notation - `someList[0].prop`:

```
const data = [
    {
        deep: {
            nested: {
                field: 777
            }
        },
        list: [1, 2, 3]
    }
]

const rsql = 'deep.nested.field==777';
const rsql = 'list[1]==2';
```

## Match item

```
const data = { name: 'Matrix', year: 2000 };

const rsqlStr = 'name=="Kill Bill";year=ge=2000';

try {
  result = rsql.RsqlMatcher.getInstance().match(rsqlStr, data);
} catch (e) {
  console.warn(e);
}

console.log(result);

// will output: false
```


Value part of matching expression also can be used as path to value, example:

```
const data = [
    {
        deep: {
            nested: {
                field: 2
            }
        },
        list: [1, 2, 3]
    }
]

const rsqlStr = 'deep.nested.field==list[1]';

try {
  result = rsql.RsqlMatcher.getInstance().match(rsqlStr, data);
} catch (e) {
  console.warn(e);
}

console.log(result);

// will output: true
```

## Match many items

typescript version:

```
const rsqlStr = 'name=="Kill Bill";year=ge=2000';

const tokens: Token<RsqlTokenType>[] = RsqlTokenizer.getInstance().tokenize(rsqlStr);
const ast: RsqlAstRootNode = RsqlParser.getInstance().parse(tokens);
const matcher: RsqlMatcher = RsqlMatcher.getInstance();

try {
  result1 = matcher.matchWithPreparedAst(ast, { name: 'Matrix', year: 2000 });
  result2 = matcher.matchWithPreparedAst(ast, { name: 'Kill Bill', year: 2021 });
} catch (e) {
  console.warn(e);
}

console.log(result1);
// will output: false

console.log(result2);
// will output: true
```

javascript version:

```
const rsqlStr = 'name=="Kill Bill";year=ge=2000';

const tokens = rsql.RsqlTokenizer.getInstance().tokenize(rsqlStr);
const ast = rsql.RsqlParser.getInstance().parse(tokens);
const matcher = rsql.RsqlMatcher.getInstance();

try {
  result1 = matcher.matchWithPreparedAst(ast, { name: 'Matrix', year: 2000 });
  result2 = matcher.matchWithPreparedAst(ast, { name: 'Kill Bill', year: 2021 });
} catch (e) {
  console.warn(e);
}

console.log(result1);
// will output: false

console.log(result2);
// will output: true
```

#### Filter and Matcher is case-insensitive

* `name==Marina` and `name==marina` will give the same results - Marina, marina 

#### Usage of wildcard

You can use wildcard `*` in `==` and `!=` operators. Example:
* `name==Ma*` find all items where name starts from `Ma` - Marina, Maxim, Maria 
* `value==*de*` find all items where value starts and ends with any symbols - Made, abcdefg 

#### Comparison rules:

* "==", "!=" before comparison data converts to string
* "=gt=", ">", "=ge=", ">=", "=lt=", "<", "=le=", "<=" before comparison data converts to number
* "=in=", "=out=" before comparison data converts to string
* "=includes-all=", "=includes-one=" before comparison data converts to array of strings

## Authors

* **Andrey Korovin** - [misticwonder](https://github.com/misticwonder)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/mw-experts/rsql/blob/main/LICENSE) file for details
