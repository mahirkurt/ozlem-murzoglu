export default {
  multipass: true,
  js2svg: { pretty: false },
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'cleanupAttrs',
    'convertStyleToAttrs',
    'removeUselessDefs',
    'cleanupNumericValues',
    'collapseGroups',
    'convertShapeToPath',
    { name: 'removeAttrs', params: { attrs: '(data-name|id|class)' } },
    { name: 'removeDimensions' } // width/height -> viewBox kalsın
  ]
};