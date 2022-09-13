---
title: ref() or reactive()
sidebar_position: 5
---

# `ref()` or `reactive()`

:::caution Prerequisites

You must learn [`ref()`](./ref-and-ref#what-is-ref) and [`reactive()`](./reactive#what-is-reactive) before getting into this chapter.

:::

*So... which one should I use to declare reactive values, `ref()` or `reactive()`?*

We're finally here! This is probably the most commonly asked question when it comes to Vue 3.

We'll try to answer this question based on the type of argument, but all in all the conclusion is:

- For primitive values, `ref()` is recommended.
- For functions, neither `ref()` nor `reactive()` is recommended; just use `let` or `var` if it isn't constant.
- For any other type of values, either `ref()` or `reactive()` is fine.

## How `ref()` and `reactive()` Work

In order to know how to choose between `ref()` and `reactive()`, it's essential to know how they work respectively.

### How `ref()` Works

The following pseudocode gives us a decent concept of how `ref()` works in Vue 3. Although it is extremely simplified and rearranged, we can still get some ideas of what's going on inside `ref()`:

```ts showLineNumbers
import { reactvie, Ref } from 'vue'

function ref(arg) {
  if (arg is Ref) {
    return arg
  } else {
    return new RefImpl(arg)
  }
}

class RefImp<T> implements Ref<T> {
  public value: T

  constructor(arg: T) {
    if (arg is primitive value) {
      this.value = arg
    } else {
      this.value = reactive(arg)
    }
    track(this.value)
  }
}
```

- As we've mentioned before, `RefImpl` is a class with only one public property `value`.
- If the argument is a primitive value, `RefImpl` will use it as `this.value`.
- If the argument is not a primitive value, `RefImpl` will just call `reactive()` and use the returned value as `this.value`.
- The `track(this.value)` actually works very differently than the source code; but the point is, `RefImpl` will "track" the changes of `this.value` when needed so that reactivity can be fulfilled.

By using `ref()`, you're actually using `reactive()` as well (if the argument is not a primitive value), you just didn't notice that! Therefore, if you want to know `ref()` better, you have no choice but to learn `reactive()` together.

### How `reactive()` Works

The following pseudocode gives us a good concept of how `reactive()` works in Vue 3. It's not exactly the same as the source code, but it's close enough to let us know what's going on inside `reactive()`:

```ts showLineNumbers
function reactive(arg) {
  if (arg is primitive value) {
    if (is in development mode) {
      console.warn(`value cannot be made reactive: ${String(arg)}`)
    }
    return arg
  } else if (arg is Ref OR arg is reactive OR arg is function) {
    return arg
  } else {
    const unwrappedValue = unwrapNestedly(arg)
    return createReactiveProxy(unwrappedValue)
  }
}
```

- As we've mentioned before, `reactive()` only works with non-primitive values.
- Even if functions are non-primitive values, `reactive()` still doesn't work with it; it directly returns it.
- `unwrapNestedly()` will do the unwrap mechanism we described in [`reactive()`](./reactive#what-is-unwrapnestedreft).

## Explanation

We can finally dive into the most important part — explain why we choose `ref()` or `reactive()` over the other based on different types of arguments.

### Primitive Values

If the argument is a primitive value, then `ref()` would be the best choice because `reactive()` only works with non-primitive values.

Of course we can wrap the value into an object like `const age = reactive({ someRandomKey: 5 })` to make it work, but...why? Just use `ref()` and you'll get the same result!

### Functions

If the argument is a function, you probably don't want it to be reactive. Functions are something that **should not be rendered** on the screen, and it **should not be used to represent the state of a component**, so making them reactive is just meaningless.

However, there are some cases where we do want to assign functions to variables. For example, **event subscription/registration**. It's those things we register when component mounts, and we remove them before component unmounts.

Take the [Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards) of [Vue Router](https://router.vuejs.org/) as an example:

```ts showLineNumbers
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// highlight-next-line
let unregisterNavGuard: () => void | undefined = undefined

onMounted(() => {
  // highlight-start
  unregisterNavGuard = router.beforeEach((to, from) => {
    // ...
  })
  // highlight-end
})

onBeforeUnmount(() => {
  // highlight-next-line
  unregisterNavGuard?.()
})
```

1. We register the navigation guard in `onMounted()` by using `router.beforeEach()`.
2. `router.beforeEach()` returns the unregister function.
3. The unregister function should only be called in `onBeforeUnmount()`.
4. After we get the unregister function in step 2, we assign it to a variable called `unregisterNavGuard` and use it in step 3.

Since `unregisterNavGuard` has nothing to do with the rendering of a component, we just use `let` instead of `ref()` or `reactive()` during declaration. If for some reason we want to re-assign the value in the future, the component won't do unnecessary re-renders because it's neither a reactive proxy nor a `Ref<T>`.

If you REALLY want a function to be reactive (which we cannot think of any good reason), `ref()` would be a better choice because `reactive()` will directly returns the argument if it's a function, which means `const func = reactive(() => {})` will be the same as `const func = () => {}`.

### Any Other Type

Anything other than primitive value and function falls into this category. For example, plain object, Array, Map, etc.

In these cases, it doesn't really matter if you use `ref()` or `reactive()`; because the inner value returned by `ref()` and `reactive()` under these circumstances are exactly the same; the `.value` after `Ref<T>` would be the only difference.

Since none is better than the other, using either `ref()` or `reactive()` is fine. Just make sure **the whole team/project is following the same rule when choosing `ref()` and `reactive()`** (for code consistency) and you'll be just fine!