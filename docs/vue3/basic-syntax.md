---
sidebar_position: 1
description: Basic syntax of Vue 3.
keywords: [piesdoc, vue3, vue basic syntax, vue tutorial]
---

# Basic Syntax

Learn the essentials of a component in Vue 3.

:::info

Make sure to check out the super convenient online Vue 3 IDE — [Vue SFC Playground](https://sfc.vuejs.org/)!

:::

## Sample Component

Here's an example of Vue 3 single file component (SFC) with [Composition API](https://vuejs.org/guide/introduction.html#composition-api):

```html showLineNumbers
<template>
  <div>
    <h1>Hello, {{ name }}</h1>
    <input v-model="name">
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const name = ref('world')
</script>

<style scoped>
h1 {
  color: blue;
}
</style>
```

Similar to Vue 2, a SFC in Vue 3 consists of 3 tags — `<template>`, `<script>`, and `<style>`.

- The main difference is, now we have a `setup` attribute on `<script>`, which only works with Composition API.
- TypeScript is now officially supported in Vue 3, we can just add `lang="ts"` attribute on `<script>` to start building components in TypeScript.
- [`<style>`](https://vuejs.org/api/sfc-spec.html#style) is still optional, and the [`scoped` attribute](https://vue-loader.vuejs.org/guide/scoped-css.html#scoped-css) still works.
- The template syntax remains the same; we can still use double curly braces `{{ }}`, `v-on` (shorthand as `@`), and `v-bind` (shorthand as `:`) in Vue 3.

:::info

There's a new [`v-bind` in CSS](https://vuejs.org/api/sfc-css-features.html#v-bind-in-css) feature that allows us to have dynamic value in `<style>`. It may come in handy in some situations.

:::

## `<script setup>`

So what is this `<scrtip setup>`? What can the `setup` attribute do in a SFC?

Similar to the `export default { ... }` in Options API, the `setup` attribute on `<script>` is used to tell Vue that the code in this `<script>` block should be treated as the definition of a component. Anything we can do in Options API, we can also do it in `<script setup>`.

Also, there **cannot be more than one `<script setup>`** in a SFC, just like how we cannot `export default` multiple times in a single file. You can have as many `<script>` as you want, just remember only one of them can be decorated with `setup` attribute.

## Define a component

There are multiple ways to define a component in Vue 3, `<script setup>` is just one of them. Options API still works, and there's a new `setup()` option in Options API. Make sure to check out [Define a Component](./define-a-component) for more details.