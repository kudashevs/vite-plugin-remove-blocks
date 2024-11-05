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


## License

The MIT License (MIT). Please see the [License file](LICENSE.md) for more information.