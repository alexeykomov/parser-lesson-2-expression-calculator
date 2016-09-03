const parse = require('./parse').default;
const NodeType = require('./parse').NodeType;

function calculate(aString) {
  const root = parse(aString);
  return calcAndWalk(root);
}

function calcAndWalk(aNode) {
  switch (aNode.type) {
    case NodeType.NUMBER: return aNode.value;
    case NodeType.PLUS: return calcAndWalk(aNode.left) + calcAndWalk(aNode.right);
    case NodeType.MINUS: return calcAndWalk(aNode.left) - calcAndWalk(aNode.right);
    case NodeType.MULTIPLY: return calcAndWalk(aNode.left) * calcAndWalk(aNode.right);
    case NodeType.DIVIDE: return calcAndWalk(aNode.left) / calcAndWalk(aNode.right);
    default:break;
  }
}

exports.default = calculate;

console.log(calculate('(22 + 2) * 2 / 2'));
