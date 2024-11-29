// @ts-check
'use strict';

import RemoveBlocks from 'remove-blocks';
import {isEmptyArray, isNotSet} from './utils.js';

const PLUGIN_NAME = 'vite-plugin-remove-blocks';

const EXCLUDE_MODES = ['development'];
const DEFAULT_NAME = 'devblock';
const DEFAULT_TAG_PREFIX = '/*';
const DEFAULT_TAG_SUFFIX = '*/';

/**
 * @param {Object} options
 * @param {boolean} [options.ignoreNodeModules]
 * @param {Array<string|{name: string, prefix: string, suffix: string}>|undefined} [options.blocks]
 * @return {{name: string, transform: (code: string, id: string) => (undefined|string|{code: string, map: Object})}}
 *
 * @throws Error
 */
export default function ViteRemoveBlocks(options = {}) {
  return {
    name: PLUGIN_NAME,

    /**
     * @param {string} code
     * @param {string} id
     * @returns {undefined|string|{code: string, map: Object}}
     */
    transform(code, id) {
      if (options.ignoreNodeModules !== false && id.includes('/node_modules/')) {
        return;
      }

      let modified = '';

      try {
        modified = remove(code, options);
      } catch (err) {
        throw err;
      }

      return {
        code: modified,
        map: {mappings: ''}
      };
    },
  };
}

/**
 * @param {string} content
 * @param {Object} options
 * @param {boolean} [options.ignoreNodeModules]
 * @param {Array<string|{name: string, prefix: string, suffix: string}>|undefined} [options.blocks]
 * @return {string}
 *
 * @throws Error
 */
function remove(content, options = {}) {
  if (shouldSkipProcessing(import.meta.env?.MODE ?? process.env.NODE_ENV)) {
    return content;
  }

  if (shouldUseDefaults(options)) {
    options.blocks = [generateDefaultBlock()];
  }

  return RemoveBlocks(content, options);
}

/**
 * @param {string} mode
 * @return {boolean}
 */
function shouldSkipProcessing(mode) {
  return EXCLUDE_MODES.includes(mode);
}

/**
 * @param {Object} options
 * @param {Array<*>|undefined} [options.blocks]
 */
function shouldUseDefaults(options) {
  return isNotSet(options.blocks) || isEmptyArray(options.blocks);
}

/**
 * @param {string} [name=DEFAULT_NAME]
 * @return {{name:string, prefix: string, suffix: string}}
 */
function generateDefaultBlock(name = DEFAULT_NAME) {
  return {
    name: `${name}`,
    prefix: DEFAULT_TAG_PREFIX,
    suffix: DEFAULT_TAG_SUFFIX,
  };
}


