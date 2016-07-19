// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper";
const path = require("path");
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

    const textlintRcFilePath = context.config ? context.config.configFile : null;
    // .textlinrc directory
    const textlintRCDir = textlintRcFilePath ? path.dirname(textlintRcFilePath) : process.cwd();
    const absoluteErrataPath = path.resolve(textlintRCDir, errataFilePath);
    const errataList = require(absoluteErrataPath);
    const matchList = errataList.map(errata => {
        const actualMatchTokens = errata.oldTokens.slice(errata.start, errata.end);
        const actual = actualMatchTokens.map(token => token.surface_form).join("");
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
                    const reportCandidates = [];
                    matchList.forEach(({matcher, message, expected}) => {
                        const {match, tokens} = matcher(token);
                        if (!match) {
                            return;
                        }
                        const firstToken = tokens[0];
                        const index = Math.max(firstToken.word_position - 1, 0);
                        let ruleError;
                        if (expected) {
                            ruleError = new RuleError(message, {
                                index: index,
                                fix: fixer.replaceTextRange([index, index + expected.length], expected)
                            });
                        } else {
                            ruleError = new RuleError(message, {
                                index: index
                            });
                        }
                        const key = tokens.map(token => token.surface_form).join("");
                        reportCandidates.push([key, ruleError]);
                    });
                    // two match same token, maybe it someting wrong
                    // dictionary conflict
                    const duplicatedDict = {};
                    reportCandidates.forEach(([key]) => {
                        duplicatedDict[key] = duplicatedDict[key] ? duplicatedDict[key] + 1 : 1;
                    });
                    reportCandidates.forEach(([key, ruleError]) => {
                        if (reportCandidates[key] > 1) {
                            // wrong mismatch?
                            return
                        }
                        report(node, ruleError);
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