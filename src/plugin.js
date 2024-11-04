'use strict';

import RemoveBlocks from 'remove-blocks';
import {isNotSet, isEmptyArray} from './utils.js';

const PLUGIN_NAME = 'vite-plugin-remove-blocks';

const EXCLUDE_MODES = ['development'];
const DEFAULT_NAME = 'devblock';
const TAG_PREFIX = '/*';
const TAG_SUFFIX = '*/';

export default function ViteRemoveBlocks(options = {}) {
  return {
    name: PLUGIN_NAME,

    transform(code, id) {
      try {
        code = remove(code, options);
      } catch (e) {
        throw e;
      }

      return {
        code: code,
        map: {mappings: ''}
      };
    },
  };
}

/**
 * @param {string} content
 * @param {Object} options
 * @param {Array<string|{name: string, prefix: string, suffix: string}>|undefined} [options.blocks]
 * @return {string}
 *
 * @throws Error
 */
function remove(content, options = {}) {
  if (shouldSkipProcessing(import.meta.env?.MODE || process.env.NODE_ENV)) {
    return content;
  }

  if (shouldUseDefaults(options)) {
    options.blocks = [generateDefaultBlock()];
  }

  try {
    content = RemoveBlocks(content, options);
  } catch (e) {
    // implement Specific Error?
    throw e;
  }

  return content;
}

/**
 * @param {string} mode
 * @return {boolean}
 */
function shouldSkipProcessing(mode) {
  return EXCLUDE_MODES.includes(mode);
}

function shouldUseDefaults(options) {
  return isNotSet(options.blocks) || isEmptyArray(options.blocks);
}

/**
 * @param {string} [name=DEFAULT_NAME]
 * @return {Object}
 */
function generateDefaultBlock(name = DEFAULT_NAME) {
  return {
    name: `${name}`,
    prefix: TAG_PREFIX,
    suffix: TAG_SUFFIX,
  };
}


