import {describe, expect, it} from 'vitest';
import VitePlugin from '../helpers/adapter.js';

describe('default test suite', () => {
  const originalMode = import.meta.env.MODE;
  const plugin = VitePlugin();

  it.each([
    ['production', '/* devblock:start */ any /* devblock:end */', ''],
    ['test', '/* devblock:start */ any /* devblock:end */', ''],
  ])('can proceed in %s environment', (environment, input, expected) => {
    import.meta.env.MODE = environment;

    expect(import.meta.env.MODE).toStrictEqual(environment);
    expect(plugin.transform(input)).toStrictEqual(expected);

    import.meta.env.MODE = originalMode;
  });

  it.each([
    ['development', '/* devblock:start */ any /* devblock:end */', '/* devblock:start */ any /* devblock:end */'],
  ])('can skip in %s environment', (environment, input, expected) => {
    import.meta.env.MODE = environment;

    expect(import.meta.env.MODE).toStrictEqual(environment);
    expect(plugin.transform(input)).toStrictEqual(expected);

    import.meta.env.MODE = originalMode;
  });

  it('can skip development environment set with a vite option', () => {
    import.meta.env.MODE = 'development';

    const input = '/* devblock:start */ any /* devblock:end */';
    const expected = '/* devblock:start */ any /* devblock:end */';

    expect(plugin.transform(input)).toStrictEqual(expected);

    import.meta.env.MODE = originalMode;
  });

  it('can handle an empty mode option', () => {
    import.meta.env.MODE = '';

    const input = '/* devblock:start */ any /* devblock:end */';
    const expected = '';

    expect(plugin.transform(input)).toStrictEqual(expected);

    import.meta.env.MODE = originalMode;
  });

  it('can handle an empty blocks options', () => {
    const plugin = VitePlugin({
      blocks: [],
    });

    const input = '/* devblock:start */ any /* devblock:end */';
    const expected = '';

    expect(plugin.transform(input)).toStrictEqual(expected);
  });

  it.each([
    ['is of a wrong type', {blocks: 'wrong'}, 'blocks option must be an array'],
    ['has a wrong value', {blocks: [42]}, 'blocks.0 should be a string or a valid object'],
  ])('can validate blocks option when it %s', (_, options, expected) => {
    const plugin = VitePlugin(options);
    try {
      const input = '/* devblock:start */ any /* devblock:end */';

      plugin.transform(input);
    } catch (e) {
      expect(e.message).toStrictEqual(expected);
    }
    expect.assertions(1);
  });

  it('can ignore files from node_modules with default options', () => {
    const path = '/node_modules/axios/index.js';
    const input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    const expected = 'visible /* devblock:start */ will be removed /* devblock:end */';

    expect(plugin.transform(input, path)).toStrictEqual(expected);
  });

  it('can process files from node_modules with the specific option', () => {
    const plugin = VitePlugin({
      ignoreNodeModules: false,
    });

    const path = '/node_modules/axios/index.js';
    const input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    const expected = 'visible ';

    expect(plugin.transform(input, path)).toStrictEqual(expected);
  });

  it('can remove a code block marked with the colon (default block representation)', () => {
    const input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    const expected = 'visible ';

    expect(plugin.transform(input)).toStrictEqual(expected);
  });

  it('can use special characters in names', () => {
    const plugin = VitePlugin({
      blocks: [
        {
          name: '*devblock!',
          prefix: '<!--',
          suffix: '-->',
        },
      ],
    });

    const input = 'visible <!-- *devblock!:start --> will be removed <!-- *devblock!:end -->';
    const expected = 'visible ';

    expect(plugin.transform(input)).toStrictEqual(expected);
  });

  it('can remove a code block marked in lower case', () => {
    const input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    const expected = 'visible ';

    expect(plugin.transform(input)).toStrictEqual(expected);
  });

  it('cannot remove a code block marked in upper case with default options', () => {
    const input = "visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */";
    const expected = "visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */";

    expect(plugin.transform(input)).toStrictEqual(expected);
  });

  it('can remove a code block marked in upper case with the specific options', () => {
    const plugin = VitePlugin({
      blocks: [
        {
          name: 'DEVBLOCK',
          prefix: '/*',
          suffix: '*/',
        },
      ],
    });

    const input = 'visible /* DEVBLOCK:start */ will be removed /* DEVBLOCK:end */';
    const expected = 'visible ';

    expect(plugin.transform(input)).toStrictEqual(expected);
  });

  it('can replace a code block with a replacement', () => {
    const plugin = VitePlugin({
      blocks: [
        {
          name: 'devblock',
          prefix: '<!--',
          suffix: '-->',
          replacement: '<!-- replaced -->',
        },
      ],
    });

    const input = 'visible <!-- devblock:start --> will be removed <!-- devblock:end -->';
    const expected = 'visible <!-- replaced -->';

    expect(plugin.transform(input)).toStrictEqual(expected);
  });
});
