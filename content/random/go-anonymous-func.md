---
title: "Go Anonymous Func"
date: 2024-03-10T23:14:40+02:00
draft: false
---

started to learn a little bit of go, so here is some good notes about anonymous functions

## anonymous functions
well, there are 3 types really for the phrase "anonymous function".

#### nameless function
first as the name suggests, the function is anonymous, it doesn't have a name, 
where you define it, is also where you call it, also known as self invoking function

here is a javascript example
```js
(function() {
    console.log("called!")
}())
```

there are people who will tell you _"actually it is not anonymous function it is 'self invoking' function"_, please poke them in the eye
with your index finger, and tell them to touch some grass, *there is no difference*, 'self invoking' is just more specific and easier to understand in that specific case


#### function in function
another implementation of anonymous function, is a function inside a function, this makes your code
more contain, and helps the people who read this understand, that this specific function, is only for the internal function use

here is another javascript example
```js
function foo(number) {
    console.log(`your number is ${number}`)

    function doSomething() {
        console.log("your number is odd!")
        // more code here ...
    }

    if(number % 2 1= 0){
        doSomething()
    }
}
```

#### inline functions
some people will include inline function as anonymous function, if you search for `python anonymous function` or `javascript anonymous function` you will get
the same results if you replace the `anonymous` with `inline`, so because of this simple fact, I also include `inline` functions as `anonymous` functions.

---

##### inline in C
well, in `C` the `inline` keyword
means the function content should be dumped where you call it, so the `inline`ed function doesn't have his own stack in the memory, so its anonymous(?),

---

inline functions are a way to define function as an expression (in python it is known as `lambda`)

another JAVSCRIPT EXAMPLE!!!
```js 
const foo = function() {  // inline function
    const internal = () => { // also inline, but more modern and does things in the hope of fixing javascript which will never happen!!!
        // ...
    }
}
```

## what special about go anonymous function?
nothing really, this is just notes for me, and to flex my understanding about "anonymous function"
so in go we can define (nerd) "self invoking" function like so

### self invoking, you nerd
```go
func myFunc() {
    func() {
        // do something here...
    }()
}
```

### inline function 
```go
func myFunc() {
    foo := func() {
        // do something
    }

    if <expression> {
        foo()
    }
}
```

### inline function + recursion
ahh, here we have a special case, if we try to create an `inline` function, and call
the `inline` function from inside the `inline` function (recursion) the code will not even compile

this code won't compile
```go
func myFunc() {
    myRec := func() {
        // ...
        myRec()
    }

    myRec()
}
```

your output will look something like this:
```sh
>>> go run -- main.go
# command-line-arguments
./main.go:18:30: undefined: myRec
```

go will not find a declaration for the `myRec` function, because the variable is not defined yet, the variable is defined after the block
of the function is compile, so first, we need to define the variable, and the variable type should be the function prototype
```go
func myFunc() {
    var myRec func(string, int, int)
    myRec = function(s string, a int, b int) {
        // do something...
        myRec(s, a+1, b-1)
    }

    myRec("", -100, 100)
}
```

now go won't complain about "undefined myRec" function
