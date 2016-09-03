const tokenize = require('./tokenize').default;
const Token = require('./tokenize').Token;

const NodeType = {
  NUMBER: 'NUMBER',
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  DIVIDE: 'DIVIDE',
  MULTIPLY: 'MULTIPLY'
}

let index = 0;

function consumeNextToken(aTokens, aTokenType) {
  let nextToken;
  if (index < aTokens.length) {
    nextToken = aTokens[index++];
  }
  if (aTokenType !== nextToken.type) {
    throw new SyntaxError(`Expected token ${aTokenType}.`);
  };
}

function peekNextToken(aTokens) {
  let nextToken;
  if (index < aTokens.length) {
    nextToken = aTokens[index];
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
  let expression;
  if (nextToken.type === Token.NUMBER) {
    consumeNextToken(aTokens, Token.NUMBER);
    expression = createNumberNode(nextToken.value);
  } else if (nextToken.type === Token.LEFT_PAREN) {
    consumeNextToken(aTokens, Token.LEFT_PAREN);
    expression = parseAddExpression(aTokens);
    if (peekNextToken(aTokens).type !== Token.RIGHT_PAREN) {
      throw new Error('Right paren ) was expected, got ' +
          peekNextToken(aTokens).type);
    }
    consumeNextToken(aTokens, Token.RIGHT_PAREN);
  } else {
    throw new Error('Expected number or paren ' + peekNextToken(aTokens));
  }
  return expression;
}

function parseAddExpression(aTokens) {
  let expression = parseMultiplyExpression(aTokens);
  let nextToken = peekNextToken(aTokens);
  while (nextToken && (nextToken.type === Token.PLUS || nextToken.type === Token.MINUS)) {
    consumeNextToken(aTokens, nextToken.type);
    expression = createExpressionNode(nextToken.type, expression,
        parseMultiplyExpression(aTokens));
    nextToken = peekNextToken(aTokens);
  }
  return expression;
}

function parseMultiplyExpression(aTokens) {
  let expression = parsePrimaryExpression(aTokens);
  let nextToken = peekNextToken(aTokens);
  while (nextToken && (nextToken.type === Token.MULTIPLY || nextToken.type === Token.DIVIDE)) {
    consumeNextToken(aTokens, nextToken.type);
    expression = createExpressionNode(nextToken.type, expression,
        parsePrimaryExpression(aTokens));
    nextToken = peekNextToken(aTokens);
  }
  return expression;
}

function parse(aString) {
  index = 0;
  const tokens = tokenize(aString);
  const expressionTree = parseAddExpression(tokens);
  if (index < tokens.length - 1) {
    throw new SyntaxError('Unparsed tokens are left: ' + tokens.slice(index).
        map(t => `${t.value}`));
  }
  return expressionTree;
}

exports.default = parse;
exports.NodeType = NodeType;
