# Syntax and structure

Haskell programs are made of expressions that evaluate to values, and declarations that define types, functions, and bindings. Layout (indentation) is significant: the compiler uses it to group declarations and to close blocks. Understanding the lexical and syntactic rules below helps avoid parse and layout errors.

**Lexical structure.** A program is a sequence of *lexemes* and *whitespace*. Lexemes include variable and constructor identifiers (`varid`, `conid`), operator symbols (`varsym`, `consym`), literals (integer, float, character, string), and special tokens such as `(`, `)`, `,`, `;`, `[`, `]`, `` ` ``, `{`, `}`. The lexer uses *maximal munch*: at each point it reads the longest possible lexeme. So `case` is a reserved word but `cases` is not; `=` is reserved but `==` and `~=` are not. Any kind of whitespace (including comments) is a valid delimiter for lexemes.

**Comments.** A single-line comment starts with `--` (two or more dashes) and continues to the next newline. The dash sequence must not be part of a legal lexeme (e.g. `-->` does not start a comment). A nested comment starts with `{-` and ends with `-}`. Inside a nested comment, each `{-` is matched by a `-}`; nested comments can be nested to any depth. The first unmatched `-}` terminates the comment. Nested comments are also used for compiler pragmas.

**Identifiers and reserved words.** A *variable identifier* (`varid`) starts with a lowercase letter or underscore, then zero or more letters, digits, underscores, or single quotes. A *constructor identifier* (`conid`) starts with an uppercase letter, then zero or more letters, digits, underscores, or single quotes. Identifiers are case-sensitive: `name`, `naMe`, and `Name` are distinct. The standalone `_` is reserved as the wild-card pattern. Reserved *keywords* (cannot be used as variable identifiers) include: `case`, `class`, `data`, `default`, `deriving`, `do`, `else`, `foreign`, `if`, `import`, `in`, `infix`, `infixl`, `infixr`, `instance`, `let`, `module`, `newtype`, `of`, `then`, `type`, `where`. Reserved *operators* include: `..`, `:`, `::`, `=`, `\`, `|`, `<-`, `->`, `@`, `=>`.

**Operators.** An operator symbol is one or more symbol characters (e.g. `!`, `#`, `$`, `%`, `&`, `*`, `+`, `.`, `/`, `<`, `=`, `>`, `?`, `@`, `\`, `^`, `|`, `-`, `~`). A symbol starting with `:` is a *constructor* operator; otherwise it is a variable operator. The colon `:` by itself is reserved as the list constructor. You can use an identifier as an infix operator by enclosing it in backticks (e.g. `` x `elem` xs ``).

**Numeric literals.** Integer literals can be decimal, or octal (`0o` / `0O` prefix), or hexadecimal (`0x` / `0X` prefix). Floating literals are decimal and must have digits on both sides of the decimal point. Negative numbers are expressed via the prefix negation operator (see Expressions). The type of a numeric literal is determined by overloaded `fromInteger` (integers) or `fromRational` (floats).

**Character and string literals.** Characters are written between single quotes with escapes (e.g. `\n`, `\t`, `\'`, `\\`). Strings are between double quotes; they may contain gaps (backslash, whitespace, backslash) which are ignored, so long strings can span lines. String literals are syntactic sugar for lists of characters (`[Char]`).

**Layout.** When the opening brace is omitted after `where`, `let`, `do`, or `of`, the *layout rule* applies. The indentation of the next lexeme is remembered. For each subsequent line: if it is indented *more* than that level, the previous item continues; if it is indented the *same*, a new item starts (a semicolon is inserted); if it is indented *less*, the layout list ends (a close brace is inserted). A close brace is also inserted when the syntactic category containing the layout list ends. You can use explicit `{` and `}` and semicolons instead of layout; the two styles can be mixed, but an explicit open brace must be closed by an explicit close brace.

**Expressions (summary).** Expressions include: *infixexp* (infix application, or prefix negation `-`, or *lexp*); *lexp* (lambda `\ pats -> exp`, `let decls in exp`, `if exp then exp else exp`, `case exp of alts`, `do stmts`, or *fexp*); *fexp* (applications *fexp aexp*); *aexp* (variable, constructor, literal, parenthesised expression, tuple, list, arithmetic sequence, list comprehension, section, record construction/update). Function application associates to the left (`f x y` = `(f x) y`). Infix expressions are disambiguated by fixity (precedence 0–9, associativity). Lambda, `let`, and `if` extend as far to the right as possible. The only prefix operator in the language is negation: `- e` is `negate e`; for a section meaning “subtract e” you use `subtract e`.

**Sections.** The form `(op e)` is equivalent to `\ x -> x op e`, and `(e op)` to `\ x -> e op x`, where `x` does not occur free in `e`. So `(1+)` is “add one”, `(+1)` is “add one” (same for commutative ops), and `(+)` is the full binary function. The form `(- e)` is *not* a section; it is prefix negation.

**Conditionals and case.** The form `if e1 then e2 else e3` is equivalent to `case e1 of { True -> e2; False -> e3 }`. So `e1` must have type `Bool`; `e2` and `e3` must have the same type. In a `case`, the first matching alternative is chosen; pattern matching is top-down, left-to-right. All right-hand sides of a `case` (or of the equations defining a function) must have the same type.

**Pattern matching.** In function equations and in `case`/`let`/lambda, patterns are matched against values. Variables in patterns must be *linear*: no variable may appear more than once in the same set of patterns. A failed match gives ⊥ (errors and non-termination are indistinguishable). Guards can be used: `pat | g1 = e1 | g2 = e2`; guards are evaluated in order; the first guard that is True selects that branch.

**List comprehensions and arithmetic sequences.** A list comprehension has the form `[ exp | qual1, ..., qualn ]`. Qualifiers are generators (`pat <- exp`) or guards (boolean expressions). The meaning is that of nested applications of `concatMap` and `filter`. An arithmetic sequence can be `[ e1.. ]`, `[ e1, e2.. ]`, `[ e1..e3 ]`, or `[ e1, e2..e3 ]`, and is defined in terms of the `Enum` class (see topic 7).

```haskell
-- Type signature and equations
inc :: Integer -> Integer
inc n = n + 1

-- Pattern matching: empty list vs non-empty
length []     = 0
length (x:xs) = 1 + length xs

-- case expression
sign x = case x of
  _ | x > 0  -> 1
  _ | x == 0 -> 0
  _ | x < 0  -> -1

-- Sections
map (1+) [1,2,3]   -- [2,3,4]
filter (>0) [-1,0,1]  -- [1]
```

**Modules.** A file usually starts with `module ModName (exports) where`. If the header is omitted, it is as if `module Main(main) where`. The module name is a dot-separated sequence of constructor-style identifiers (e.g. `Data.List`). See topic 6 for exports and imports.

---

## Further reading

- [Haskell 2010 report – Chapter 2 Lexical structure](https://haskell.org/onlinereport/haskell2010/haskellch2.html)
- [Haskell 2010 report – Chapter 3 Expressions](https://haskell.org/onlinereport/haskell2010/haskellch3.html)
- [GHC User's Guide – Language extensions](https://www.haskell.org/ghc/docs/latest/html/users_guide/exts.html)
