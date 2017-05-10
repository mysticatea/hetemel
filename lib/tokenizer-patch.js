/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

/*eslint-disable no-invalid-this, prefer-rest-params */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const UNICODE = require("./parse5/lib/common/unicode").CODE_POINTS
const Tokenizer = require("./parse5/lib/tokenizer/index")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const LS = Symbol("location state")

/**
 * Override a method of Parse5's Tokenizer.
 * @param {string} name The name of the method to override.
 * @param {function(Function):Function} define The function to define the overriding function.
 * The 1st argument of `define` is the original method of the overriding method.
 * @returns {void}
 */
function override(name, define) {
    Tokenizer.prototype[name] = define(Tokenizer.prototype[name])
}

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

// Don't abandon duplicate attributes.
override("_isDuplicateAttr", () => () => false)

// Initialize location state in the first time.
override("write", (base) => function() {
    if (!(LS in this)) {
        this[LS] = {
            // The start location of the current token.
            tokenStart: {
                offset: 0,
                line: 0,
                column: 0,
            },
            // The start location of the current attribute name.
            attrNameStart: {
                offset: 0,
                line: 0,
                column: 0,
            },
            // The end location of the current attribute name.
            attrNameEnd: {
                offset: 0,
                line: 0,
                column: 0,
            },
            // The start location of the current attribute value.
            attrValueStart: {
                offset: 0,
                line: 0,
                column: 0,
            },
            // The current line number.
            currentLine: 1,
            // The offset of the last newline.
            lineStartOffset: 0,
            // The flag to indicate the last code point is LF.
            eol: false,
        }
    }
    return base.apply(this, arguments)
})

// Update the current location.
override("_consume", (base) => function() {
    const cp = base.apply(this, arguments)

    // LF should be in the last column of the line.
    if (this[LS].eol) {
        this[LS].eol = false
        this[LS].lineStartOffset = this.preprocessor.sourcePos
        this[LS].currentLine += 1
    }
    if (cp === UNICODE.LINE_FEED) {
        this[LS].eol = true
    }

    return cp
})

// Came from official locationInfo mixin.
// Not sure but probably this method does not be called after eol.
override("_unconsume", (base) => function() {
    this[LS].eol = false
    return base.apply(this, arguments)
})

// Save all attribute
override("_createAttr", (base) => function() {
    base.apply(this, arguments)
    this.currentAttr.location = {
        startOffset: this.preprocessor.sourcePos,
        startLine: this[LS].currentLine,
        startColumn: this[LS].currentLine,
    }
})

//
// TEST
//

const t = new Tokenizer({})

t.write("<p>aaa<b foo=1 foo=2 bar=3>bbb</p>ccc</b>ddd", true)

let token = null
while ((token = t.getNextToken()).type !== "EOF_TOKEN") {
    console.log(token)
}

/*eslint-enable no-invalid-this, prefer-rest-params */
