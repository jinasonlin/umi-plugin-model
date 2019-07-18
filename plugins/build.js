module.exports  = (api) => {
  const { service } = api;
  const { cwd } = service;

  api.registerCommand(
    'build',
    {
      description: 'building for production',
    },
    (args = {}) => {
      service.applyPlugins('onBuild');
    },
  );

  api.registerMethod('onStart2');
}