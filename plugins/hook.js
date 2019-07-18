module.exports  = (api) => {
  const { service } = api;

  api.registerMethod('onHook');

  api.onStart(() => {
    console.log('plugin hook onStart1');
  });
  api.onStart(() => {
    console.log('plugin hook onStart2');
  });
  api.onStart(() => {
    console.log('plugin hook onStart3');
  });
  api.onStart(() => {
    service.applyPlugins('onHook');
  });
}