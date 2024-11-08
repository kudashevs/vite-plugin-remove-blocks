import VitePluginRemoveBlock from "../../src/plugin.js";
import * as path from "node:path";
import {fileURLToPath} from 'node:url';

// https://stackoverflow.com/questions/70009442/parsing-error-unexpected-token-import-when-accessing-import-meta-url-cloud9
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, '../any.css');

export default function VitePluginAdapter(options = {}) {
  const adaptee = VitePluginRemoveBlock(options);

  return {
    name: adaptee.name,
    transform(content, id = filePath) {
      const result = adaptee.transform(content, id);

      return result?.code ?? content;
    },
  };
}
