---
title: "Python Caching"
date: 2024-08-13T19:35:22+03:00
draft: true
---

# python caching
after encountering an issue with python [caching method causes instances to live forever](https://github.com/python/cpython/issues/122827), I dig in to see
why it happens and how I can resolve this, there is also some cool code there that is worth noting.

## why instances live forever when use python cache?
all python cache function does it wraps the original function, gets the passed *args and **kwargs to the function
and puts them in a tuple (which is hashable), then that tuple is used as dict key, without hashing, so all
the elements inside the tuple are alive

```py
cache = {}

def _example_cache_wrapper(*args, **kwargs):  # our self will be included in the *args
  cache_key = args

  for item in kwargs.items():
    cache_key += item

  results = ...
  cache[cache_key] = results
  ...
```

so our cache dict would look like this
```py
{
  (<Main.Foo at 0x...>, 1, 5, ("name", "foo")): ...,
  (<Main.Foo> at 0x..., ("name": "bob")): ...
}
```
you see it? the reference to out instance is in our dict, causing the instance reference count
to never reach zero until the cache entry is removed.

## why not just hash the tuple?
while it is possible to instead of storing the tuple object as the key storing the tuple hash instead. problem if the instance memory
is cleared and a new instance is created on the same memory, it will have the same hash, and it can results in an unexpected behaviour
```py
class Foo:

  def method(self) -> int:
    return 1

x = Foo()
x.method()  # cache miss, storing the results in the cache dict
print(id(x))  # 0x000001 just for example the memory location is 1
del x  # memory is available

y = Foo()
print(id(y))  # lets say it reused the free memory of 0x000001
y.method()  # cache hit, it returned the results of instance `x`
```
so python keeps references to the instances on purpose so they won't die

## how to fix it?
in the hopes of fixing it, I wrote [this library](https://github.com/dsal3389/cachemethod)

## cool circular queue
reading the code of `cache` and trying to figure out and understand how they put limit on a dict
and how they know which entry in the dict is the oldest, I encountered a structure I wasn't
familiar with, the circular queue!, they use it to know which cache entry is the oldest and which
one is the newest

turns out they just look and sound complex but in reality you can think of it as a linkd list (it is sometimes even implemented as linked list)
but the last node in the list, points to the head of the list causing it to be "circular", this is the cache function
```py
def _lru_cache_wrapper(user_function, maxsize, typed, _CacheInfo):
    # Constants shared by all lru cache instances:
    sentinel = object()          # unique object used to signal cache misses
    make_key = _make_key         # build a key from the function arguments
    PREV, NEXT, KEY, RESULT = 0, 1, 2, 3   # names for the link fields

    cache = {}
    hits = misses = 0
    full = False
    cache_get = cache.get    # bound method to lookup a key or return None
    cache_len = cache.__len__  # get cache size without calling len()
    lock = RLock()           # because linkedlist updates aren't threadsafe
    root = []                # root of the circular doubly linked list
    root[:] = [root, root, None, None]     # initialize by pointing to self

    if maxsize == 0:

        def wrapper(*args, **kwds):
            # No caching -- just a statistics update
            nonlocal misses
            misses += 1
            result = user_function(*args, **kwds)
            return result

    elif maxsize is None:

        def wrapper(*args, **kwds):
            # Simple caching without ordering or size limit
            nonlocal hits, misses
            key = make_key(args, kwds, typed)
            result = cache_get(key, sentinel)
            if result is not sentinel:
                hits += 1
                return result
            misses += 1
            result = user_function(*args, **kwds)
            cache[key] = result
            return result

    else:

        def wrapper(*args, **kwds):
            # Size limited caching that tracks accesses by recency
            nonlocal root, hits, misses, full
            key = make_key(args, kwds, typed)
            with lock:
                link = cache_get(key)
                if link is not None:
                    # Move the link to the front of the circular queue
                    link_prev, link_next, _key, result = link
                    link_prev[NEXT] = link_next
                    link_next[PREV] = link_prev
                    last = root[PREV]
                    last[NEXT] = root[PREV] = link
                    link[PREV] = last
                    link[NEXT] = root
                    hits += 1
                    return result
                misses += 1
            result = user_function(*args, **kwds)
            with lock:
                if key in cache:
                    # Getting here means that this same key was added to the
                    # cache while the lock was released.  Since the link
                    # update is already done, we need only return the
                    # computed result and update the count of misses.
                    pass
                elif full:
                    # Use the old root to store the new key and result.
                    oldroot = root
                    oldroot[KEY] = key
                    oldroot[RESULT] = result
                    # Empty the oldest link and make it the new root.
                    # Keep a reference to the old key and old result to
                    # prevent their ref counts from going to zero during the
                    # update. That will prevent potentially arbitrary object
                    # clean-up code (i.e. __del__) from running while we're
                    # still adjusting the links.
                    root = oldroot[NEXT]
                    oldkey = root[KEY]
                    oldresult = root[RESULT]
                    root[KEY] = root[RESULT] = None
                    # Now update the cache dictionary.
                    del cache[oldkey]
                    # Save the potentially reentrant cache[key] assignment
                    # for last, after the root and links have been put in
                    # a consistent state.
                    cache[key] = oldroot
                else:
                    # Put result in a new link at the front of the queue.
                    last = root[PREV]
                    link = [last, root, key, result]
                    last[NEXT] = root[PREV] = cache[key] = link
                    # Use the cache_len bound method instead of the len() function
                    # which could potentially be wrapped in an lru_cache itself.
                    full = (cache_len() >= maxsize)
            return result

    def cache_info():
        """Report cache statistics"""
        with lock:
            return _CacheInfo(hits, misses, maxsize, cache_len())

    def cache_clear():
        """Clear the cache and cache statistics"""
        nonlocal hits, misses, full
        with lock:
            cache.clear()
            root[:] = [root, root, None, None]
            hits = misses = 0
            full = False

    wrapper.cache_info = cache_info
    wrapper.cache_clear = cache_clear
    return wrapper
```
lets break this circular queue

## breaking cache circular queue
```py
root = []
root[:] = [root, root, None, None]
```
like linked lists, we need `prev` and `next`, here the first argument `root[0]` is `PREV` and `root[1]` is `NEXT`, we
can see both `PREV` and `NEXT` pointing to theselves
```py
print(id(root)) #  1000
print(id(root[0]))  # 1000
print(id(root[1]))  # 1000
```

now we will look at this function more closely
```py
def wrapper(*args, **kwds):
    # Size limited caching that tracks accesses by recency
    nonlocal root, hits, misses, full
    key = make_key(args, kwds, typed)
    with lock:
        link = cache_get(key)
        if link is not None:
            # Move the link to the front of the circular queue
            link_prev, link_next, _key, result = link
            link_prev[NEXT] = link_next
            link_next[PREV] = link_prev
            last = root[PREV]
            last[NEXT] = root[PREV] = link
            link[PREV] = last
            link[NEXT] = root
            hits += 1
            return result
        misses += 1
    result = user_function(*args, **kwds)
    with lock:
        if key in cache:
            # Getting here means that this same key was added to the
            # cache while the lock was released.  Since the link
            # update is already done, we need only return the
            # computed result and update the count of misses.
            pass
        elif full:
            # Use the old root to store the new key and result.
            oldroot = root
            oldroot[KEY] = key
            oldroot[RESULT] = result
            # Empty the oldest link and make it the new root.
            # Keep a reference to the old key and old result to
            # prevent their ref counts from going to zero during the
            # update. That will prevent potentially arbitrary object
            # clean-up code (i.e. __del__) from running while we're
            # still adjusting the links.
            root = oldroot[NEXT]
            oldkey = root[KEY]
            oldresult = root[RESULT]
            root[KEY] = root[RESULT] = None
            # Now update the cache dictionary.
            del cache[oldkey]
            # Save the potentially reentrant cache[key] assignment
            # for last, after the root and links have been put in
            # a consistent state.
            cache[key] = oldroot
        else:
            # Put result in a new link at the front of the queue.
            last = root[PREV]
            link = [last, root, key, result]
            last[NEXT] = root[PREV] = cache[key] = link
            # Use the cache_len bound method instead of the len() function
            # which could potentially be wrapped in an lru_cache itself.
            full = (cache_len() >= maxsize)
    return result
```
to understand it better, it would be easier to jump to the last `else` block at the end of the function
where we add new items to the list

it is important to note that `root[PREV]` will always point on the last added item while
`root[NEXT]` points on the oldest item.

we insert a new `node` between the current last item and the root, causing
our node to be the last item in the list
```py
last = root[PREV]  # take the current last node
link = [last, root, key, result]  # create our node PREV points to last, NEXT points to root

# last[NEXT] will point to our node, and root[PREV] will also point to our node
last[NEXT], root[PREV] = ... = link
```
now our list will look something like this
```console
           ,-------------,
          V               \
node1 <- root -> node1 - root
  \              ^
   `-------------`
```
the root `prev` and `next` will point to the same node, and the node `prev` and `next` will point
to the same root

things becomes easier to understand when we add another item to the list, and it will look like this
```console
   ,----------------------,
  V                        \
node1 -> node2 <- root -> node1
```
we inserted a new item `node2`, now `root[NEXT]` which is `node1` is the oldest entry, while `root[PREV]` is
the newest entry and it points to `node2`, our list will keep growing until our `cache` dict reaches
a certain length.


in case our cache length hit the max size, we stop adding new items to the list, and start
replacing nodes with the new cache information because remember that `root[PREV]` is always
the newest entry, we also need to delete the oldest entry.

this happens at the `elif full:` line, right above our current `else` block.

we take the current root and assign to it the new cache data
```py
oldroot = root
oldroot[KEY] = key
oldroot[RESULT] = result
```

now the `oldroot` is the node that we replace instead of adding, and now we move the root to the next
node, causing the `oldroot` to be `root[PREV]` which is the newest entry in the list, in that step
we also clear the new root stored cache information because it the `root` should not hold information, only
point to the oldest and newest entries
```py
root = oldroot[NEXT]
oldkey = root[KEY]  # cache key
oldlresult = root[RESULT]  # a line that does literally nothing
root[KEY] = root[RESULT] = None  # delete the stored root data
del cache[oldkey]  # delete the cache entry

cache[key] = oldroot  # store the new node to cache
```

now if there is a hit on the cache, we need to take the entry in the list and make it the newest entry
this happens in the first `if` statement

```py
link = cache_get(key)
if link is not None:  # we have a hit
```
we pop the node from its current position
```py
link_prev, link_next, _key, result = link
link_prev[NEXT] = link_next
link_next[PREV] = link_prev
```
we like before push the node to the end of the list
```py
last = root[PREV]
last[NEXT] = last[PREV] = link  # the pushing
link[PREV] = last  # update the prev in our node
link[NEXT] = root  # update the next in our node
```

thats it, I thought this circular queue is cool
