const PluginAPI = require('./PluginAPI');

class Server {
  constructor() {
    this.methods = {};
    this.hooks = {};
    this.plugins = this.loadPlugins();
    this.commands = {};
  }

  loadPlugins() {
    const builtInPlugins = [
      './plugins/hook',
      './plugins/dev',
      './plugins/build',
    ];

    const pluginsObj = [
      ...builtInPlugins.map(p => {
        let opts;
        if (Array.isArray(p)) {
          ([p, opts] = p)
        }
        const apply = require(p); // eslint-disable-line
        return {
          id: p.replace(/^.\//, 'built-in:'),
          apply: apply.default || apply,
          opts,
        };
      }),
      // load user plugin
      // ...getUserPlugins(plugins, { cwd }),
    ];

    return pluginsObj;
  }

  applyPlugins(key, opts = {}) {
    console.log(`apply plugins ${key}`);

    return (this.hooks[key] || []).reduce((memo, { fn }) => {
      try {
        return fn({
          memo,
          args: opts.args,
        });
      } catch (e) {
        console.error(`Plugin apply failed: ${e.message}`);
        throw e;
      }
    }, opts.initialValue);
  }

  initPlugin(plugin) {
    const { id, apply, opts } = plugin;
    const api = new Proxy(new PluginAPI(id, this), {
      get: (target, prop) => {
        if (this.methods[prop]) {
          return this.methods[prop];
        }

        return target[prop];
      },
    });

    apply(api, opts);
  }

  initPlugins() {
    this.plugins.forEach(plugin => {
      this.initPlugin(plugin);
    });
  }

  registerCommand(name, opts, fn) {
    console.log(`register command ${name}`);
    this.commands[name] = { fn, opts };
  }

  run(name) {
    console.log('command init');
    this.initPlugins();
    this.runCommand(name);
  }

  runCommand(name) {
    console.log();
    console.log(`command name: ${name}`);

    const command = this.commands[name];
    if (!command) {
      console.error(`command ${name} does not exists`);
      process.exit(1);
    }

    const { fn, opts } = command;

    fn(opts);
  }
}

module.exports = Server;
