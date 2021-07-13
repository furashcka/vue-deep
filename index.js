import _ from "lodash";
import Vue from "vue";

const mixin = {
  __DEEP_V_MODAL_CACHE__: {},

  methods: {
    $deepGet() {
      let args = _getArgs(arguments, this.$data);

      return _deepGet(args.obj, args.path, args.data);
    },

    $deepSet() {
      let args = _getArgs(arguments, this.$data);

      _deepSet(args.obj, args.path, args.data);
    },

    $deepDelete() {
      let args = _getArgs(arguments, this.$data);

      _deepDelete(args.obj, args.path);
    },

    $deepModel(path) {
      let cache = this.$options.__DEEP_V_MODAL_CACHE__;

      if (cache[path]) return cache[path];

      let model = {
        get: () => this.$deepGet(path),
        set: (data) => this.$deepSet(path, data),
      };

      return (cache[path] = Object.create(null, {
        m: model,
        model,
      }));
    },
  },
};

function _isReactive(obj, key) {
  let property = Object.getOwnPropertyDescriptor(obj, key);
  let gettter = _.get(property, "get.name", "");

  return gettter == "proxyGetter" || gettter == "reactiveGetter";
}

function _getArgs(_arguments, $data) {
  let args = _arguments;

  if (_.size(args) === 3) {
    return {
      obj: args[0],
      path: args[1],
      data: args[2],
    };
  }

  return {
    obj: $data,
    path: args[0],
    data: args[1],
  };
}

function _deepGet(obj, path, defaultData) {
  return _.get(obj, path, defaultData);
}

function _deepSet(obj, path, data) {
  let keys = _.toPath(path);
  let lastKey = _.last(keys);

  _.each(_.slice(keys, 0, -1), (key) => {
    if (!_isReactive(obj, key)) {
      Vue.set(obj, key, {});
    }

    obj = obj[key];
  });

  Vue.set(obj, lastKey, data);
}

function _deepDelete(obj, path) {
  let keys = _.toPath(path);
  let lastKey = _.last(keys);

  _.each(_.slice(keys, 0, -1), (key) => (obj = obj[key] || {}));

  Vue.delete(obj, lastKey);
}

// add to global
Vue.deepGet = _deepGet;
Vue.deepSet = _deepSet;
Vue.deepDelete = _deepDelete;

export default (Vue) => Vue.mixin(mixin);
export const vueDeepMixin = mixin;
export const deepGet = _deepGet;
export const deepSet = _deepSet;
export const deepDelete = _deepDelete;
