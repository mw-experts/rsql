import { RsqlTokenType } from './rsql-token-type';
import { RsqlTokenizer } from './rsql-tokenizer';

describe('RsqlTokenizer', () => {
  let unit: RsqlTokenizer;

  beforeEach(() => {
    unit = RsqlTokenizer.getInstance();
  });

  it('should tokenize rsql', () => {
    const result = unit.tokenize(
      'genres=in=(sci-fi,action);genres=out=(romance,animated,horror),director==Que*Tarantino',
    );
    expect(result).toEqual([
      {
        type: RsqlTokenType.String,
        value: 'genres',
        origin: 'genres',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '=in=',
        origin: '=in=',
      },
      {
        type: RsqlTokenType.Paren,
        value: '(',
        origin: '(',
      },
      {
        type: RsqlTokenType.String,
        value: 'sci-fi',
        origin: 'sci-fi',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ',',
        origin: ',',
      },
      {
        type: RsqlTokenType.String,
        value: 'action',
        origin: 'action',
      },
      {
        type: RsqlTokenType.Paren,
        value: ')',
        origin: ')',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ';',
        origin: ';',
      },

      {
        type: RsqlTokenType.String,
        value: 'genres',
        origin: 'genres',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '=out=',
        origin: '=out=',
      },
      {
        type: RsqlTokenType.Paren,
        value: '(',
        origin: '(',
      },
      {
        type: RsqlTokenType.String,
        value: 'romance',
        origin: 'romance',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ',',
        origin: ',',
      },
      {
        type: RsqlTokenType.String,
        value: 'animated',
        origin: 'animated',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ',',
        origin: ',',
      },
      {
        type: RsqlTokenType.String,
        value: 'horror',
        origin: 'horror',
      },
      {
        type: RsqlTokenType.Paren,
        value: ')',
        origin: ')',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ',',
        origin: ',',
      },
      {
        type: RsqlTokenType.String,
        value: 'director',
        origin: 'director',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '==',
        origin: '==',
      },
      {
        type: RsqlTokenType.String,
        value: 'Que*Tarantino',
        origin: 'Que*Tarantino',
      },
    ]);
  });

  it('should tokenize rsql filtering spaces', () => {
    const result = unit.tokenize(
      'genres  =in=  (sci-fi,action) ;  genres  =out= ( romance, animated, horror ) ,  director ==  Que*Tarantino',
    );
    expect(result).toEqual([
      {
        type: RsqlTokenType.String,
        value: 'genres',
        origin: 'genres',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '=in=',
        origin: '=in=',
      },
      {
        type: RsqlTokenType.Paren,
        value: '(',
        origin: '(',
      },
      {
        type: RsqlTokenType.String,
        value: 'sci-fi',
        origin: 'sci-fi',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ',',
        origin: ',',
      },
      {
        type: RsqlTokenType.String,
        value: 'action',
        origin: 'action',
      },
      {
        type: RsqlTokenType.Paren,
        value: ')',
        origin: ')',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ';',
        origin: ';',
      },

      {
        type: RsqlTokenType.String,
        value: 'genres',
        origin: 'genres',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '=out=',
        origin: '=out=',
      },
      {
        type: RsqlTokenType.Paren,
        value: '(',
        origin: '(',
      },
      {
        type: RsqlTokenType.String,
        value: 'romance',
        origin: 'romance',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ',',
        origin: ',',
      },
      {
        type: RsqlTokenType.String,
        value: 'animated',
        origin: 'animated',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ',',
        origin: ',',
      },
      {
        type: RsqlTokenType.String,
        value: 'horror',
        origin: 'horror',
      },
      {
        type: RsqlTokenType.Paren,
        value: ')',
        origin: ')',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ',',
        origin: ',',
      },
      {
        type: RsqlTokenType.String,
        value: 'director',
        origin: 'director',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '==',
        origin: '==',
      },
      {
        type: RsqlTokenType.String,
        value: 'Que*Tarantino',
        origin: 'Que*Tarantino',
      },
    ]);
  });

  it('should tokenize string in double quotes', () => {
    const result = unit.tokenize('name=="Andrey";name!="Long Name"');
    expect(result).toEqual([
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '==',
        origin: '==',
      },
      {
        type: RsqlTokenType.String,
        value: 'Andrey',
        origin: '"Andrey"',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ';',
        origin: ';',
      },
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '!=',
        origin: '!=',
      },
      {
        type: RsqlTokenType.String,
        value: 'Long Name',
        origin: '"Long Name"',
      },
    ]);
  });

  it('should tokenize string in single quotes', () => {
    const result = unit.tokenize("name=='Andrey';name!='Long Name'");
    expect(result).toEqual([
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '==',
        origin: '==',
      },
      {
        type: RsqlTokenType.String,
        value: 'Andrey',
        origin: "'Andrey'",
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ';',
        origin: ';',
      },
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '!=',
        origin: '!=',
      },
      {
        type: RsqlTokenType.String,
        value: 'Long Name',
        origin: "'Long Name'",
      },
    ]);
  });

  it('should tokenize string without quotes skipping spaces', () => {
    const result = unit.tokenize('name==Andrey;name!= LongName ');
    expect(result).toEqual([
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '==',
        origin: '==',
      },
      {
        type: RsqlTokenType.String,
        value: 'Andrey',
        origin: 'Andrey',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ';',
        origin: ';',
      },
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '!=',
        origin: '!=',
      },
      {
        type: RsqlTokenType.String,
        value: 'LongName',
        origin: 'LongName',
      },
    ]);
  });

  it('should tokenize 1 char string without quotes skipping spaces', () => {
    const result = unit.tokenize('name==A;name!= L N ');
    expect(result).toEqual([
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '==',
        origin: '==',
      },
      {
        type: RsqlTokenType.String,
        value: 'A',
        origin: 'A',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ';',
        origin: ';',
      },
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '!=',
        origin: '!=',
      },
      {
        type: RsqlTokenType.String,
        value: 'L N',
        origin: 'L N',
      },
    ]);
  });

  it('should tokenize string with mixed quoted string', () => {
    const result = unit.tokenize(`name=='Andrey';name!="Long Name";name==NextName`);
    expect(result).toEqual([
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '==',
        origin: '==',
      },
      {
        type: RsqlTokenType.String,
        value: 'Andrey',
        origin: "'Andrey'",
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ';',
        origin: ';',
      },
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '!=',
        origin: '!=',
      },
      {
        type: RsqlTokenType.String,
        value: 'Long Name',
        origin: '"Long Name"',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ';',
        origin: ';',
      },
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '==',
        origin: '==',
      },
      {
        type: RsqlTokenType.String,
        value: 'NextName',
        origin: 'NextName',
      },
    ]);
  });

  it('should tokenize string with quotes inside', () => {
    const result = unit.tokenize(`name=="And'r'ey";name!='Long Na"m"e'`);
    expect(result).toEqual([
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '==',
        origin: '==',
      },
      {
        type: RsqlTokenType.String,
        value: `And'r'ey`,
        origin: `"And'r'ey"`,
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ';',
        origin: ';',
      },
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '!=',
        origin: '!=',
      },
      {
        type: RsqlTokenType.String,
        value: `Long Na"m"e`,
        origin: `'Long Na"m"e'`,
      },
    ]);
  });

  it('should tokenize string with escaped quotes', () => {
    // eslint-disable-next-line no-useless-escape
    const result = unit.tokenize(`name=='And\'r\'ey';name!="Long Na\"m\"e"`);
    expect(result).toEqual([
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '==',
        origin: '==',
      },
      {
        type: RsqlTokenType.String,
        value: `And'r'ey`,
        // eslint-disable-next-line no-useless-escape
        origin: `'And\'r\'ey'`,
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ';',
        origin: ';',
      },
      {
        type: RsqlTokenType.String,
        value: 'name',
        origin: 'name',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '!=',
        origin: '!=',
      },
      {
        type: RsqlTokenType.String,
        value: `Long Na"m"e`,
        // eslint-disable-next-line no-useless-escape
        origin: `"Long Na\"m\"e"`,
      },
    ]);
  });
});
