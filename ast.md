# AST

Some types are featured from [ESTree].

- [Node]
- [Literal]

## Node

```js
extend interface Node {
    range: [ number ]
}
```

- This AST spec enhances the [Node] nodes like ESLint.
- The `range` property is an array which has 2 integers.
  The 1st integer is the offset of the start location of the node.
  The 2nd integer is the offset of the end location of the node.

## HTMLIdentifier

```js
interface HTMLIdentifier <: Node {
    type: "HTMLIdentifier"
    name: string
}
```

- This is similar to [Identifier] nodes but this `name` property can include any
  characters except U+0000-U+001F, U+007F-U+009F, U+0020, U+0022, U+0027, U+003E,
  U+002F, U+003D, U+FDD0-U+FDEF, U+FFFE, U+FFFF, U+1FFFE, U+1FFFF, U+2FFFE, U+2FFFF,
  U+3FFFE, U+3FFFF, U+4FFFE, U+4FFFF, U+5FFFE, U+5FFFF, U+6FFFE, U+6FFFF, U+7FFFE,
  U+7FFFF, U+8FFFE, U+8FFFF, U+9FFFE, U+9FFFF, U+AFFFE, U+AFFFF, U+BFFFE, U+BFFFF,
  U+CFFFE, U+CFFFF, U+DFFFE, U+DFFFF, U+EFFFE, U+EFFFF, U+FFFFE, U+FFFFF, U+10FFFE
  and U+10FFFF.
- This is tag names or attribute names.

## HTMLText

```js
interface HTMLText <: Node {
    type: "HTMLText"
    value: string
    raw: string
    cdata: boolean
}
```

- Plain text of HTML.
- The `raw` property includes HTML entities and XML entities. On the other hand, those are decoded in the `value` property.
- If the `cdata` property is `true`, it's CDATA sections. In that case, `raw` property includes `<![CDATA[` and `]]>`.

## HTMLAttributeValue

```js
interface HTMLAttributeValue <: Node {
    type: "HTMLAttributeValue"
    value: string
    raw: string
}
```

- This is similar to [Literal] nodes but this is not always quoted.

## HTMLAttribute

```js
interface HTMLAttribute <: Node {
    type: "HTMLAttribute"
    key: HTMLIdentifier | null
    value: HTMLAttributeValue | null
}
```

- If the `value` property is `null`, their attribute value does not exist.

## HTMLStartTag

```js
interface HTMLStartTag <: Node {
    type: "HTMLStartTag"
    id: HTMLIdentifier
    attributes: [ HTMLAttribute ]
}
```

## HTMLEndTag

```js
interface HTMLEndTag <: Node {
    type: "HTMLEndTag"
    id: HTMLIdentifier
}

interface HTMLExtraEndTag <: Node {
    type: "HTMLEndTag"
    id: HTMLIdentifier
}
```

## HTMLElement

```js
interface HTMLElement <: Node {
    type: "HTMLElement"
    name: string
    startTag: HTMLStartTag | null
    children: [ HTMLText | HTMLElement ]
    endTag: HTMLEndTag | null
}
```

- The `name` is the same as `startTag.id.name` or `endTag.id.name`.
- The `startTag` is possible `null` in [misnested tags](https://html.spec.whatwg.org/multipage/syntax.html#misnested-tags:-b-i-/b-/i).
- Both `startTag` and `endTag` might be `null` in [unclosed formatting elements](https://html.spec.whatwg.org/multipage/syntax.html#unclosed-formatting-elements).

[ESTree]:     https://github.com/estree/estree
[Node]:       https://github.com/estree/estree/blob/master/es5.md#node-objects
[Literal]:    https://github.com/estree/estree/blob/master/es5.md#literal
[Identifier]: https://github.com/estree/estree/blob/master/es5.md#identifier
