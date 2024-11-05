Vite Plugin Remove Blocks ![test workflow](https://github.com/kudashevs/vite-plugin-remove-blocks/actions/workflows/run-tests.yml/badge.svg)
==========================

The `vite-plugin-remove-blocks` removes marked blocks from any type of code.

## Options

`ignoreNodeModules` an boolean defines whether to process the node_modules folder.

`blocks` an array of blocks' representations. Each element of this array describes a unique pair of tags with name,
prefix, and suffix. These values are represented by a string or an object with the following properties:
```
name: 'devblock',              # string value defines the name of start/end tags (unique)
prefix: '/*',                  # string value defines the beginning of a tag
suffix: '*/',                  # string value defines the end of a tag
```


## Usage example

Suppose, the task is to remove some debug information and non-production code from this code sample.
```javascript
function makeFoo(bar, baz) {
    console.log('creating Foo'); 
    
    if (bar instanceof Bar !== true) {
        throw new Error('makeFoo: bar param is required and must be instance of Bar');
    }
    
    if (baz instanceof Baz !== true) {
        throw new Error('makeFoo: baz param is required and must be instance of Baz');
    }
    
    return new Foo(bar, baz);
}
```

The plugin removes blocks of code marked with two paired tags (a block). A block is represented by string or an object
with a name, prefix and suffix. Let's identify two different blocks and describe them in the plugin's configuration:
```javascript
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
        throw new Error('makeFoo: bar param is required and must be instance of Bar');
    }
    // development:end
    // development:start
    if (baz instanceof Baz !== true) {
        throw new Error('makeFoo: baz param is required and must be instance of Baz');
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