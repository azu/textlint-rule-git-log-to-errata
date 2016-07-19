// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper";
const tokenize = require("kuromojin");
const createTokenMatcher = require("morpheme-match");
const defaultOptions = {
    filePath: undefined
};
var reporter = function(context, options) {
    const {Syntax, RuleError, fixer, report, getSource} = context;
    const helper = new RuleHelper(context);
    const errataFilePath = options.filePath;
    if (errataFilePath === undefined) {
        throw new Error('`filePath` is required. { "filePath": "path/to/errata.json", ')
    }
    const errataList = require(errataFilePath);
    const matchList = errataList.map(errata => {
        const actual = errata.oldTokens.slice(errata.start, errata.end).map(token => token.surface_form).join("");
        const expected = errata.newTokens.slice(errata.start, errata.end).map(token => token.surface_form).join("");
        const message = `${actual} => ${expected}`;
        return {
            matcher: createTokenMatcher(errata.oldTokens),
            message: message,
            expected: errata.newText
        };
    });
    return {
        [Syntax.Str](node) {
            if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
                return;
            }
            const text = getSource(node);
            return tokenize(text).then(currentTokens => {
                currentTokens.forEach(token => {
                    matchList.forEach(({matcher, message, expected}) => {
                        const {match, tokens} = matcher(token);
                        if (!match) {
                            return;
                        }
                        const firstToken = tokens[0];
                        const index = Math.max(firstToken.word_position - 1, 0);
                        if (expected) {
                            report(node, new RuleError(message, {
                                index: index,
                                fix: fixer.replaceTextRange([index, index + expected.length], expected)
                            }));
                        } else {
                            report(node, new RuleError(message, {
                                index: index
                            }));
                        }
                    });
                });
            });
        }
    }
};
module.exports = {
    linter: reporter,
    fixer: reporter
};