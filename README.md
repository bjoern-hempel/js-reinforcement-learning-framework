# A javascript reinforcement learning framework

This is a javascript reinforcement learning framework.

## 1. Introduction

Coming soon.. 

## 2. Theory

### 2.1 Markov decision process

<img src="https://latex.ixno.de/?r=300&f=V%5E%2A%28s%29%20%3D%20%5Csubstack%7B%5Ctextbf%7Bmax%7D%5C%5C%20%7B%5Ctiny%20a%7D%7D%5Csum_%7Bs%27%7D%5E%7B%7D%20T%28s%2C%20a%2C%20s%27%29%5BR%28s%2C%20a%2C%20s%27%29%20%2B%20%5Cgamma%20%5Ccdot%20V_k%28s%27%29%5D" width="453" alt="V^*(s) = \substack{\textbf{max}\\ {\tiny a}}\sum_{s'}^{} T(s, a, s')[R(s, a, s') + \gamma \cdot V_k(s')]">

## 3. Usage

### 3.1 Super basic example

Let's look at a state s<sub>0</sub> which contains 3 actions which point back to the state s<sub>0</sub>. Okay, it doesn't make much sense, but it should show the procedure in more detail. One action leads to reward (a<sub>0</sub>), one action to punishment (a<sub>1</sub>) and one is neutral (a<sub>2</sub>):

<img src="/images/SuperBasic.png" width="480" alt="super basic example">

As one can logically see, a<sub>0</sub> is the best option and leads to maximum reward. a<sub>1</sub> teaches us punishment and is the most unfavorable variant, while a<sub>2</sub> is the neutral version without any reward. Let's calculate that:

#### 3.1.1 Code

```javascript
var discountRate = 0.9;
var iterations   = 1000;

var rl = new ReinforcementLearning();

/* s0 */
var s0 = rl.addState();

/* a0 */
rl.addAction(s0, new StateChange(s0, 1.0,  1));

/* a1 */
rl.addAction(s0, new StateChange(s0, 1.0, -1));

/* a2 */
rl.addAction(s0, new StateChange(s0, 1.0,  0));

var Q = rl.calulateQ(iterations, discountRate);

console.log(JSON.stringify(Q));
```

Returns:

```json
[[9.999999999999995,7.999999999999995,8.999999999999995]]
```

As we suspected above: a<sub>0</sub> is the winner (Q<sub>0,0</sub>).

### 3.2 Basic example

<img src="/images/Basic.png" width="512" alt="super basic example">

### 3.3 Complex example

<img src="/images/Complex.png" width="960" alt="super basic example">

### 3.4 Basic example

```php
var discountRate = 0.95;
var iterations   = 100;

var rl = new ReinforcementLearning();

var s0 = rl.addState();
var s1 = rl.addState();
var s2 = rl.addState();

var a0 = rl.addAction(s0);
var a1 = rl.addAction(s0);
var a2 = rl.addAction(s0);
var a3 = rl.addAction(s1);
var a4 = rl.addAction(s1);
var a5 = rl.addAction(s2);

rl.addStateChange(a0, s0, 0.7,  10);
rl.addStateChange(a0, s1, 0.3,   0);
rl.addStateChange(a1, s0, 1.0,   0);
rl.addStateChange(a2, s0, 0.8,   0);
rl.addStateChange(a2, s1, 0.2,   0);
rl.addStateChange(a3, s1, 1.0,   0);
rl.addStateChange(a4, s2, 1.0, -50);
rl.addStateChange(a5, s0, 0.8,  40);
rl.addStateChange(a5, s1, 0.1,   0);
rl.addStateChange(a5, s2, 0.1,   0);

var Q = rl.calulateQ(iterations, discountRate);

console.log(Q);
```

### 3.5 Basic example (shortcut from the previous example)

```php
var discountRate = 0.95;
var iterations   = 100;

var rl = new ReinforcementLearning();

var s0 = rl.addState();
var s1 = rl.addState();
var s2 = rl.addState();

rl.addAction(s0, new StateChange(s0, 0.7,  10), new StateChange(s1, 0.3, 0));
rl.addAction(s0, new StateChange(s0, 1.0,   0));
rl.addAction(s0, new StateChange(s0, 0.8,   0), new StateChange(s1, 0.2, 0));
rl.addAction(s1, new StateChange(s1, 1.0,   0));
rl.addAction(s1, new StateChange(s2, 1.0, -50));
rl.addAction(s2, new StateChange(s0, 0.8,  40), new StateChange(s1, 0.1, 0), new StateChange(s2, 0.1, 0));

var Q = rl.calulateQ(iterations, discountRate);

console.log(Q);
```

## A. Authors

* Björn Hempel <bjoern@hempel.li> - _Initial work_ - [https://github.com/bjoern-hempel](https://github.com/bjoern-hempel)

## B. Licence

This tutorial is licensed under the MIT License - see the [LICENSE.md](/LICENSE.md) file for details

## C. Closing words

Have fun! :)

