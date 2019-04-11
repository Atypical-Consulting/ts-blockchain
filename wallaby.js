module.exports = function(wallaby) {
  return {
    files: ['tsconfig.json', 'src/**/*.ts?(x)', '!src/**/*.test.ts?(x)'],

    tests: ['src/**/*.test.ts?(x)'],

    env: {
      type: 'node',
      runner: 'node',
    },

    testFramework: 'jest',

    compilers: {
      '**/*.ts?(x)': wallaby.compilers.typeScript({ module: 'commonjs' }),
    },

    preprocessors: {
      '**/*.js?(x)': file =>
        require('@babel/core').transform(file.content, {
          sourceMap: true,
          compact: false,
          filename: file.path,
          presets: [require('babel-preset-jest')],
        }),
    },

    debug: true,
  };
};
