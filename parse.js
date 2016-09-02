const tokenize = require('./tokenize').default;
const Token = require('./tokenize').Token;

const NodeType = {
  NUMBER: 1,
  PLUS: 2,
  MINUS: 3,
  DIVIDE: 4,
  MULTIPLY: 5
}

let index = -1;

function getNextToken(aTokens) {
  let nextToken;
  if (index + 1 < aTokens.length) {
    nextToken = aTokens[++index];
  }
  else {
    nextToken = null;
  }
  return nextToken;
}

function peekNextToken(aTokens) {
  let nextToken;
  if (index + 1 < aTokens.length) {
    nextToken = aTokens[index + 1];
  }
  else {
    nextToken = null;
  }
  return nextToken;
}

function createExpressionNode(aType, aLeft, aRight) {
  return {
    type: aType,
    left: aLeft,
    right: aRight
  }
}

function createNumberNode(aValue) {
  return {
    type: NodeType.NUMBER,
    value: aValue
  }
}

function parsePrimaryExpression(aTokens) {
  let nextToken = peekNextToken(aTokens);
  console.log('nextToken: ', nextToken);
  let expression;
  if (nextToken.type === Token.NUMBER) {
    getNextToken(aTokens);
    expression = createNumberNode(nextToken.value);
    return expression;
  } else if (nextToken.type === Token.LEFT_PAREN) {
    getNextToken(aTokens);
    expression = parseAddExpression(aTokens);
    if (peekNextToken(aTokens) !== Token.RIGHT_PAREN) {
      throw new Error('Right paren \')\' was expected ' + peekNextToken(aTokens));
    }
    getNextToken(aTokens);
    return expression;
  } else {
    throw new Error('Expected number or paren ' + peekNextToken(aTokens));
  }
}

function parseAddExpression(aTokens) {
  let leftExpression = parseMultiplyExpression(aTokens);
  let nextToken = peekNextToken(aTokens);
  if (nextToken.type === Token.ADD || nextToken.type == Token.MINUS) {
    getNextToken(aTokens);
    return createExpressionNode(nextToken.type, leftExpression,
        parseMultiplyExpression(aTokens));
  }
  return leftExpression;
}

function parseMultiplyExpression(aTokens) {
  let leftExpression = parsePrimaryExpression(aTokens);
  let nextToken = peekNextToken(aTokens);
  if (nextToken.type === Token.DIVIDE || nextToken.type == Token.MULTIPLY) {
    getNextToken(aTokens);
    return createExpressionNode(nextToken.type, leftExpression,
        parsePrimaryExpression(aTokens));
  }
  return leftExpression;
}

function parse(aString) {
  index = -1;
  parsePrimaryExpression(tokenize(aString));
}

exports.default = parse;
exports.NodeType = NodeType;

console.log(parse('(22 + 2)'));
