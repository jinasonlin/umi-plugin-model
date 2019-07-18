module.exports  = (api) => {
  const { service } = api;
  const { cwd } = service;

  api.registerCommand(
    'dev',
    {
      description: 'start a dev server for development',
    },
    (args = {}) => {
      service.applyPlugins('onStart');
    },
  );

  api.registerMethod('onStart1');

  api.onHook(() => {
    console.log('plugin dev onHook');
  })
}