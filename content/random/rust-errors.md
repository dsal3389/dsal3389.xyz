---
title: "Rust Errors"
date: 2024-07-06T19:23:51+03:00
draft: false
---

> at the time of writing, I am new to Rust to take everything with a grain of salt

rust errors are quite unique from other programming languages, they are not exceptions, but they can be
literally everything that implements the `fmt::Display` trait.

rust requires errors to implement `fmt::Dsiplay` because rust need a way to display that error to the screen, at the 
minimum rust requires you to at least derive from `Debug`

although if we look at `std::result::Result` implementation, we can see that the generic type `E` doesn't 
requires us to implement the `fmt::Display` trait, but allows us to return anything we want.

```rs
enum Result<T, E> {
  Ok(T),
  Err(E)
}
```
but we can also see in in action if we try to compile this code:

```rs 
struct MyCustomError;

fn main() -> Result<(), MyCustomError> {
  Err(MyCustomError{})
}
```

this code won't compile, and we will get an error

```sh
error[E0277]: `MyCustomError` doesn't implement `Debug`
 --> src/main.rs:3:14
  |
3 | fn main() -> Result<(), MyCustomError> {
  |              ^^^^^^^^^^^^^^^^^^^^^^^^^ `MyCustomError` cannot be formatted using `{:?}`
  |
  = help: the trait `Debug` is not implemented for `MyCustomError`, which is required by `Result<(), MyCustomError>: Termination`
  = note: add `#[derive(Debug)]` to `MyCustomError` or manually `impl Debug for MyCustomError`
  = note: required for `Result<(), MyCustomError>` to implement `Termination`
help: consider annotating `MyCustomError` with `#[derive(Debug)]`
  |
1 + #[derive(Debug)]
2 | struct MyCustomError;
  |

For more information about this error, try `rustc --explain E0277`.
error: could not compile `learnrust` (bin "learnrust") due to 1 previous error
```

rust requires us to at least `derive` from `Debug`

```rs
#[derive(Debug)]
struct MyCustomError;

...
```

now when we compile the error, rust will print it to the screen
```sh
Error: MyCustomError
```

now that we understand that rust errors can be literally anything that implements `fmt::Display` how should we 
properly implement them then? can I use whatever I want?

the answer is basically yes, but there is one more step for this, you need to implement `std::error::Error` on your
custom errors, this trait requires no implementation for any function, this is also known as marker trait.

but the error trait requires your type to implement `fmt::Display` or derive from `Debug`!

```rs
impl std::error::Error for MyCustomError {}
```

also this marker trait helps us when we write functions that can return
different error types
```rs
fn test_fn() -> Result<(), Box<dyn std::error::Error>> {
  ...
}
```

## the `?` marker 
the `?` operation does more then forward the error lower in the stack, it also converts!,
in the function 

```rs
fn test_fn() -> Result<(), Box<dyn std::error::Error>> {
  ...
}

fn caller() {
  match test_fn() {
    Ok(_) => {},
    Err(e) => {...}
  }
}
```

when our function return `Err`, the caller function really have no idea
what type the error is since we said "we return something the implement the `std::error::Error` trait".

what `?` operator actually does, is something like this 

```rs
fn test_fn() -> Result<(), Box<dyn std::error::Error>> {
  Err(MyCustomError{}.into())
}
```

it converts our specific type to the more "generic" one, if you don't believe me try to compile
the code without the `into()`

## custom Errors
a good way to implement an error is with enum like so

```rs
use std::result::Result;

// give me a break, I just made those stupid names for the tutorial
$[derive(Debug)]
enum ServerErrors {
  ClientConnectionLost,
  CantReadSocket,
  OutOfSockets
}

impl std::fmt::Display for ServerErrors {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    match self {
      ServerErrors::ClientConnectionLost => {...},
      ServerErrors::CantReadSocket => {...},
      ServerErrors::OutOfSockets => {...}
    }
  }
}

// if you write a lib, you can
// control error in the results
type Result<T> = Result<T, ServerErrors>
```


