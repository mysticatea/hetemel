/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// Patch to tokenizer before loading parser.
require("./tokenizer-patch")

const Parse5Parser = require("./parse5/lib/parser/index")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

class Parser extends Parse5Parser {
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = Parser
