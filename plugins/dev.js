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

  api.registerMethod('onStart1', () => console.log('this is test'));
}