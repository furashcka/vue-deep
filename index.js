import _ from "lodash";

const vueDeepMixin = {
  __DEEP_MODEL_CACHE__: {},

  methods: {
    $deepGet(path, defaultValue) {
      return _.get(this, path, defaultValue);
    },

    $deepSet(path, value) {
      deepSetWith(this, path, value, this.$set);
    },

    $deepDelete(path) {
      deepDeleteWith(this, path, this.$delete);
    },

    $deepModel(path) {
      const cache = this.$options.__DEEP_MODEL_CACHE__;

      if (cache[path]) return cache[path];

      const model = {
        get: () => this.$deepGet(path),
        set: (value) => this.$deepSet(path, value),
      };

      return (cache[path] = Object.create(null, {
        m: model,
        model,
      }));
    },
  },

  beforeDestroy() {
    delete this.$options.__DEEP_MODEL_CACHE__;
  },
};

function deepSetWith(object, path, value, setter) {
  if (!_.isObject(object)) return object;
  if (!_.isFunction(setter)) setter = () => {};

  const keys = _.toPath(path);
  const lastIndex = _.size(keys) - 1;
  let nsObject = object;

  for (let i = 0; i < lastIndex; i++) {
    const key = keys[i];

    if (_.has(nsObject, key)) {
      nsObject = nsObject[key];
      continue;
    }

    const nextKey = keys[i + 1];

    setter(nsObject, key, _isIndex(nextKey) ? [] : {});
    nsObject = nsObject[key];
    break;
  }

  setter(nsObject, keys[lastIndex], value);
  return object;
}

function deepDeleteWith(object, path, deleter) {
  if (!_.isObject(object)) return;
  if (!_.isFunction(deleter)) deleter = () => {};

  const keys = _.toPath(path);
  const lastIndex = _.size(keys) - 1;
  let nsObject = object;

  for (let i = 0; i < lastIndex; i++) {
    const key = keys[i];

    if (!_.has(nsObject, key)) {
      nsObject = {};
      break;
    }

    nsObject = nsObject[key];
  }

  deleter(nsObject, keys[lastIndex]);
}

function _isIndex(value) {
  return _.isFinite(+value) && value > -1 && value < Number.MAX_SAFE_INTEGER;
}

export { vueDeepMixin, deepSetWith, deepDeleteWith };
