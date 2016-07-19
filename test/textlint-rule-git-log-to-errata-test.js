const path = require("path");
const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
// rule
import rule from "../src/textlint-rule-git-log-to-errata";
// ruleName, rule, { valid, invalid }
const options = {
    filePath: path.join(__dirname, "fixtures/jser.eratta.json")
};
tester.run("textlint-rule-git-log-to-errata.js", rule, {
    valid: [
        {
            text: "text",
            options
        }
    ],
    invalid: [
        {
            text: "システムの破壊",
            output: "システムを破壊",
            options,
            errors: [
                {
                    message: "の => を"
                }
            ]
        },
        {
            text: "どれも離された内容ですが",
            output: "どれも話された内容ですが",
            options,
            errors: [
                {
                    message: "離さ => 話さ"
                }
            ]
        }
    ]
});