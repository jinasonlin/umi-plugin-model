class PluginAPI {
  constructor(id, service) {
    this.id = id;
    this.service = service;

    this.addMethod();
  }

  addMethod() {
    ['onStart', 'onBuild', 'modifyCommand'].forEach((method) => this.registerMethod(method));
  }

  register(hook, fn) {
    const { hooks } = this.service;
    hooks[hook] = hooks[hook] || [];
    hooks[hook].push({
      fn,
    });
  }

  registerMethod(name) {
    console.log(`plugin register method ${name}`, Object.keys(this.service.methods), Object.keys(this.service.methods).map(method => !!this[method]));

    if (this.service.methods[name] || this[name]) {
      console.log(`api.${name} exists.`);
      return;
    }

    console.log(`plugin register method ${name} to service`);

    this.service.methods[name] = (fn) => {
      console.log(`register hook ${name}`);
      this.register(name, fn);
    };
  }

  registerCommand(name, opts, fn) {
    this.service.registerCommand(name, opts, fn);
  }
}

module.exports = PluginAPI;
