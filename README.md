Vite Plugin Remove Blocks ![test workflow](https://github.com/kudashevs/vite-plugin-remove-blocks/actions/workflows/run-tests.yml/badge.svg)
==========================

The `vite-plugin-remove-blocks` removes marked blocks from any type of code.

## Install

```bash
# NPM
npm install --save-dev vite-plugin-remove-blocks
# Yarn
yarn add --dev vite-plugin-remove-blocks
```


## Options

`ignoreNodeModules` is a boolean that defines whether to process the `node_modules` folder.

`blocks` is an array of blocks' representations. Each element of this array describes a unique pair of tags with name,
prefix, suffix and optional replacement. These values are represented by a string or an object with the following properties:
```
name: 'devblock'               # a string defines a name for start/end tags (unique)
prefix: '/*'                   # a string defines the beginning of a tag
suffix: '*/'                   # a string defines the end of a tag
replacement: 'optional'        # a string defines a substitution for a removed block
```


## Usage example

For example, suppose the task is to remove some debug information and non-production code from this code sample.
```javascript
function makeFoo(bar, baz) {
    console.log('creating Foo'); 
    
    if (bar instanceof Bar !== true) {
        throw new Error('makeFoo: bar param must be an instance of Bar');
    }
    
    if (baz instanceof Baz !== true) {
        throw new Error('makeFoo: baz param must be an instance of Baz');
    }
    
    return new Foo(bar, baz);
}
```

The plugin removes blocks of code marked with two paired tags (a block). A block is represented by a string or an object
with the properties described in "[Options](#options)" above. Let's identify two different blocks and describe them in the configuration:
```javascript
// vite.config.js 
import {defineConfig} from 'vite';
import RemoveBlocks from 'vite-plugin-remove-blocks';

export default defineConfig({
  plugins: [
    RemoveBlocks({
      blocks: [
        'debug',
        {
          name: 'development',
          prefix: '//',
          suffix: '',
        },
      ],
    }),
  ],
})
```

Once the blocks are described in the configuration, the unwanted areas of code can be marked in the code:
```javascript
function makeFoo(bar, baz) {
    /* debug:start */ console.log('creating Foo'); /* debug:end */
    // development:start
    if (bar instanceof Bar !== true) {
        throw new Error('makeFoo: bar param must be an instance of Bar');
    }
    // development:end
    // development:start
    if (baz instanceof Baz !== true) {
        throw new Error('makeFoo: baz param must be an instance of Baz');
    }
    // development:end
    // This code will remain
    return new Foo(bar, baz);
}
```

After the building process, the marked blocks will be completely removed.
```javascript
function makeFoo(bar, baz) {
    // This code will remain
    return new Foo(bar, baz);
}
```


## License

The MIT License (MIT). Please see the [License file](LICENSE.md) for more information.