# Parser lesson 2: expression calculator.
 This is the second in series of lessons of how to build parsers.

 Here, we're parsing simple math formula, like
 ```2 * (2 + 4)```
  and calculating the result.

 It takes 3 stages to implement:
 1. Tokenize - convert string into sequence of tokens - entities with meaning in our formula context (like ```(```, ```+```, etc.)
 2. Parse - convert sequence of tokens into tree representation, so called abstract syntax tree, where nodes will be arithmetic operations and leafs are constants.
 3. Calculate - recursively walk the tree and calculatate node operations of leafs.

## How to launch
 1. Get [node](https://nodejs.org/en/) of at least 6th version.
 2. Say ```node calculate.js```.
