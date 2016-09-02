
const Token = {
  NUMBER: 'NUMBER',
  LEFT_PAREN: 'LEFT_PAREN',
  RIGHT_PAREN: 'RIGHT_PAREN',
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  DIVIDE: 'DIVIDE',
  MULTIPLY: 'MULTIPLY'
}

function createToken(aType, aValue) {
  return {
    type: aType,
    value: aValue
  }
}

let index = -1;

function getNextChar(aString) {
  let nextChar;
  if (index + 1 < aString.length) {
    nextChar = aString.charAt(++index);
  }
  else {
    nextChar = '';
  }
  return nextChar;
}

function peekNextChar(aString) {
  let nextChar;
  if (index + 1 < aString.length) {
    nextChar = aString.charAt(index + 1);
  }
  else {
    nextChar = '';
  }
  return nextChar;
}

function eatUpSpaces(aString) {
  while (/\s/.test(peekNextChar(aString))) {
    getNextChar(aString);
  }
}

function scanForNumber(aString) {
  const buff = [];
  while (/\d/.test(peekNextChar(aString))) {
    buff.push(getNextChar(aString));
  }
  if (buff.length) {
    return createToken(Token.NUMBER, parseInt(buff.join(''), 10));
  } else {
    return null;
  }
}

function scanForOperator(aString) {
  switch (peekNextChar(aString)) {
    case '+': return createToken(Token.PLUS, getNextChar(aString));
    case '-': return createToken(Token.MINUS, getNextChar(aString));
    case '/': return createToken(Token.DIVIDE, getNextChar(aString));
    case '*': return createToken(Token.MULTIPLY, getNextChar(aString));
    default: return null;
  }
}

function scanForParen(aString) {
  switch (peekNextChar(aString)) {
    case '(': return createToken(Token.LEFT_PAREN, getNextChar(aString));
    case ')': return createToken(Token.RIGHT_PAREN, getNextChar(aString));
    default: return null;break;
  }
}

function tokenize(aString) {
  const tokens = [];
  index = -1;

  while (index + 1 < aString.length) {
    console.log('index: ', index)
    let nextToken;
    eatUpSpaces(aString);
    nextToken = scanForParen(aString);
    nextToken = nextToken || scanForOperator(aString);
    nextToken = nextToken || scanForNumber(aString);
    if (nextToken) {
      tokens.push(nextToken)
    } else {
      throw new Error('Syntax error: unrecognized token at char: ' + peekNextChar(aString));
    }
  }

  return tokens;
}

exports.default = tokenize;
exports.Token = Token;

console.log(tokenize('(56 + 11) * ((22 + 2) / 4) * 2'));
