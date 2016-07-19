# textlint-rule-git-log-to-errata

Use [git-log-to-errata](https://github.com/azu/git-log-to-errata "git-log-to-errata") for textlint.

You Git history help to write text.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-git-log-to-errata

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "git-log-to-errata": {
            "filePath": "path/to/errata.json"
        }
    }
}
```

## Options

- `"filePath"`: string
    - **required**
    - Path to errata.json

## Changelog

See [Releases page](https://github.com/azu/textlint-rule-git-log-to-errata/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/textlint-rule-git-log-to-errata/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
