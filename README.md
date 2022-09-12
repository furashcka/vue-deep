# About

vue-deep allows you to initialize objects of any depth without loss of reactivity, the library is an extension of the standard $set and $delete methods, which is why such a small weight and no bugs. You can use library in vuex or vue files.

# Installation

Install via NPM

```sh
npm i vue-deep
```

Install via Yarn

```sh
yarn add vue-deep
```

# How use

Register globally

```javascript
import vueDeep from "vue-deep";

Vue.use(vueDeep);
```

Register locally

```javascript
import vueDeep from "vue-deep";

import { vueDeepMixin } from "vue-deep";

// Options API
export default {
  name: "component-name",

  mixins: [vueDeepMixin],
};
```

Usage

```javascript
// Options API
export default {
  data: () => ({
    products: {},
  }),

  mounted() {
    this.$deepSet("products.categories.flowers.roses", {
      id: 1,
      price: 18.3,
    });
  },
};
```

**Note** vue-deep can work with ONLY entry points, what does it mean? You must initialize main object in data, and then works with the object use some: $deepGet, $deepSet, $deepDelete, $deepModel

# Methods

## $deepGet

Gets value by path. If path not exists can be return default value.

```javascript
// Options API
export default {
  data: () => ({
    authors: {},
  }),

  mounted() {
    const topBooks = this.$deepGet("authors.stephen-king.books.top", [
      "The Stand",
      "It",
      "The Shining",
    ]);
  },
};
```

## $deepSet

Set value to object by path, without loss reactivity.

```javascript
// Options API
export default {
  data: () => ({
    authors: {},
  }),

  mounted() {
    const topBooks = ["The Stand", "It", "The Shining"];

    this.$deepSet("authors.stephen-king.books.top", topBooks);
  },
};
```

## $deepDelete

Removes the property by path, without loss reactivity.

```javascript
// Options API
export default {
  data: () => ({
    authors: {},
  }),

  mounted() {
    const topBooks = ["The Stand", "It", "The Shining"];

    this.$deepSet("authors.stephen-king.books.top", topBooks);
    this.$deepDelete("authors.stephen-king.books.top[1]");
  },
};
```

## $deepModel

Bindings form input by path.

```html
<input v-model="$deepModel('authors.stephen-king.books.top[0]').model" />
<!-- OR -->
<input v-model="$deepModel('authors.stephen-king.books.top[0]').m" />
```

## Usage in VUEX

```javascript
import _ from "lodash";
import axios from "axios";
import { deepGet, deepSet, deepDelete } from "vue-deep";

export const state = () => ({
  authors: {},
});

export const getters = {};

export const actions = {
  async fetchBooks({ state, commit }) {
    const res = await axios.get("api/books/get");

    _.each(res.data, (book) => {
      if (!book.isTop) return;

      const path = `authors.${book.key}.books.top`;
      const index = _.size(deepGet(state, path, []));

      commit("setState", {
        [`${path}[${index}]`]: book.name,
      });
    });
  },
};

export const mutations = {
  setState(state, newState) {
    _.each(newState, (val, path) => deepSet(state, path, val));
  },

  deleteState(state, path) {
    deepDelete(state, path);
  },
};
```
