class PluginAPI {
  constructor(id, service) {
    console.log();
    console.log(`PluginAPI ${id}`)

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

    /**
     * 仅通过 this[name] 判断是否已经注册这个方法存在一个问题，就是未使用 proxy 的上下文时，会反复更新内置的 method。
     * 也就是上面每个 PluginAPI 的 addMethod 执行过程
     */
    if (/* this.service.methods[name] || */ this[name]) {
      console.log(`api.${name} exists.`);
      return;
    }

    console.log(`plugin register method ${name} to service`);

    this.service.methods[name] = (fn) => {
      console.log(`plugin register hook ${name}`);
      this.register(name, fn);
    };
  }

  registerCommand(name, opts, fn) {
    this.service.registerCommand(name, opts, fn);
  }
}

module.exports = PluginAPI;
