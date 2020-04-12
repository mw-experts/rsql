# RSQL / FIQL parser

RSQL is a query language for parametrized filtering of entries in RESTful APIs.

It’s based on [FIQL](http://tools.ietf.org/html/draft-nottingham-atompub-fiql-00) (Feed Item Query Language)
an URI-friendly syntax for expressing filters across the entries in an Atom Feed.

The simplicity of RSQL and its capability to express complex queries in a compact and HTTP URI-friendly way
makes it a good candidate for becoming a generic query language for searching REST endpoints.

For example, you can query your resource like this:

`/movies?query=name=="Kill Bill";year=gt=2003`

or

`/movies?query=director.lastName==Nolan and year>=2000`.

See examples below.

This is a complete and thoroughly tested parser for RSQL written in Typescript(Javascript).
Since RSQL is a superset of the FIQL, it can be used for parsing FIQL as well.

## RSQL overview

RSQL introduces simple and composite operators which can be used to build basic and complex queries.

The following table lists basic operators:

| Basic Operator | Description         |
|----------------|---------------------|
| ==             | Equal To            |
| !=             | Not Equal To        |
| =gt=           | Greater Than        |
| =ge=           | Greater Or Equal To |
| =lt=           | Less Than           |
| =le=           | Less Or Equal To    |
| =in=           | In                  |
| =out=          | Not in              |

These operators can be used to do all sort of simple queries, for example:

* name==Fero: find all people whose name is Fero
* street!=Darna: find all people who do not live at Darna
* age=gt=10: find all people older than 10 (exclusive)
* age=ge=10: find all people older than 10 (inclusive)
* house=lt=3: find all people who have less than 3 houses
* house=le=3: find all people who have less than or 3 houses
* genres=in=(sci-fi,action)
* genres=out=(sci-fi,action)

The following tables lists two joining operators:

| Composite Operator | Description         |
|--------------------|---------------------|
| ;                  | Logical AND         |
| ,                  | Logical OR          |

| Composite Operator   | Description         |
|----------------------|---------------------|
| and                  | Logical AND         |
| or                   | Logical OR          |

These two operators can be used to join the simple queries and build more involved queries which can be as complex as required.
Here are some examples:

* age=gt=10;age=lt=20: find all people older than 10 and younger than 20
* age=lt=5,age=gt=30: find all people younger than 5 or older than 30
* age=gt=10;age=lt=20;(str=Fero,str=Hero): find all people older than 10 and younger than 20 and living either at Fero or Hero.

Note that while the complexity of the queries can grow, the complete expression still remains in a form which is easy to understand and quite compact.

By default, operators evaluated from left to right.
However, a parenthesized expression can be used to change the precedence.

## Examples

Examples of RSQL expressions in both FIQL-like and alternative notation:

- name=="Kill Bill";year=gt=2003
- name=="Kill Bill" and year>2003
- genres=in=(sci-fi,action);(director=='Christopher Nolan',actor==*Bale);year=ge=2000
- genres=in=(sci-fi,action) and (director=='Christopher Nolan' or actor==*Bale) and year>=2000
- director.lastName==Nolan;year=ge=2000;year=lt=2010
- director.lastName==Nolan and year>=2000 and year<2010
- genres=in=(sci-fi,action);genres=out=(romance,animated,horror),director==Que*Tarantino
- genres=in=(sci-fi,action) and genres=out=(romance,animated,horror) or director==Que*Tarantino

## How to use

```
const data = [{name: 'Kill Bill', year: 2006}];
const rsqlFilter = RsqlFilter.getInstance();
const result = rsqlFilter.filter('name=="Kill Bill";year=gt=2003', data);
```

## License

This project is licensed under [MIT license](http://opensource.org/licenses/MIT).
