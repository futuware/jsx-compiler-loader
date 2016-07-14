'use strict';

const babel = require('babel-core');

const regExps = {
    single: /'\s*<jsx>([^']*)<\/jsx>\s*'/g,
    double: /"\s*<jsx>([^"]*)<\/jsx>\s*"/g,
    template: /`\s*<jsx>([^`]*)<\/jsx>\s*`/gm
};

const quoteSymbols = {
    single: '\'',
    double: '"',
    template: '`'
};

module.exports = function (source) {
    this.cacheable();

    if (source.indexOf('<jsx>') === -1) {
        return source;
    }

    for (let r in regExps) {
        source = source.replace(regExps[r], function (match, code) {
            let symbol = quoteSymbols[r];
            return symbol + babel.transform('<span>' + code + '</span>', {
                plugins: ['transform-react-jsx']
            }).code.replace(/\n/gm, '\\n') + symbol;
        });
    }

    return source;
};
