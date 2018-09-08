# A javascript reinforcement learning framework

This is a javascript reinforcement learning framework.

## 1. Introduction

Coming soon.. 

## 2. Markov decision process

### 2.1 Theory

<img src="https://latex.ixno.de/?r=300&f=V%5E%2A%28s%29%20%3D%20%5Csubstack%7B%5Ctextbf%7Bmax%7D%5C%5C%20%7B%5Ctiny%20a%7D%7D%5Csum_%7Bs%27%7D%5E%7B%7D%20T%28s%2C%20a%2C%20s%27%29%5BR%28s%2C%20a%2C%20s%27%29%20%2B%20%5Cgamma%20%5Ccdot%20V_k%28s%27%29%5D" width="453" alt="V^*(s) = \substack{\textbf{max}\\ {\tiny a}}\sum_{s'}^{} T(s, a, s')[R(s, a, s') + \gamma \cdot V_k(s')]">

### 2.2 Usage

#### 2.2.1 Super basic example

Let's look at a state s<sub>0</sub> which contains 3 actions which point back to the state s<sub>0</sub>. Okay, it doesn't make much sense, but it should show the procedure in more detail:

<img src="/images/SuperBasic.png" width="480" alt="super basic example">

As one can logically see, a<sub>0</sub> is the best option and leads to maximum reward. a<sub>1</sub> teaches us punishment and is the most unfavorable variant, while a<sub>2</sub> is the neutral version without any reward. Let's calculate that:

#### 2.2.1.1 Code

**The written-out version:**

```javascript
var discountRate = 0.9;
var iterations   = 1;

var rl = new ReinforcementLearning();

/* s0 */
var s0 = rl.addState();

/* create a0, a1 and a2 */
var a0 = rl.addAction(s0);
var a1 = rl.addAction(s0);
var a2 = rl.addAction(s0);

/* add the action to state connections (state changes) */
rl.addStateChange(a0, s0, 1.0,  1);
rl.addStateChange(a1, s0, 1.0, -1);
rl.addStateChange(a2, s0, 1.0,  0);

var Q = rl.calulateQ(iterations, discountRate);

console.log(JSON.stringify(Q));
```

**The short version:**

```javascript
var discountRate = 0.9;
var iterations   = 1;

var rl = new ReinforcementLearning();

/* s0 */
var s0 = rl.addState();

/* a0, a1 and a2 */
rl.addAction(s0, new StateChange(s0, 1.0,  1));
rl.addAction(s0, new StateChange(s0, 1.0, -1));
rl.addAction(s0, new StateChange(s0, 1.0,  0));

var Q = rl.calulateQ(iterations, discountRate);

console.log(JSON.stringify(Q));
```

**It returns:**

```json
[[1,-1,0]]
```

As we suspected above: a<sub>0</sub> is the winner and with the maximum value of Q<sub>(s=0)</sub> (Q<sub>(s=0,a=0)</sub> = 1). The variable discountRate is uninteresting in this case, since we only consider one iteration step. If we increase the iteration step to a number higher than 1, the discountRate determines the importance of future rewards: A factor of 0 makes the agent "short-sighted" by considering only the current rewards, while a factor of close to 1 makes him strive for a high long-sighted reward.

The situation does not change if we look at the current state more long-sighted:

```javascript
var discountRate = 0.9;
var iterations   = 1000;
```

**It returns:**

```json
[[9.999999999999995,7.999999999999995,8.999999999999995]]
```

Q<sub>(s=0,a=0)</sub> is still the winner with the maximum of Q<sub>(s=0)</sub>: 9.999999999999995

#### 2.2.2 Basic example

<img src="/images/Basic.png" width="512" alt="super basic example">

##### 2.2.2.1 Code

```javascript
var discountRate =  0.9;
var iterations   = 1000;

var rl = new ReinforcementLearning();

/* s0 and s1 */
var s0 = rl.addState();
var s1 = rl.addState();

/* s0.a0, s0.a1 and s1.a0 */
rl.addAction(s0, new StateChange(s1, 1.0, -5));
rl.addAction(s0, new StateChange(s0, 1.0,  2));
rl.addAction(s1, new StateChange(s0, 1.0, 10));

var Q = rl.calulateQ(iterations, discountRate);

console.log(JSON.stringify(Q));
```

**It returns:**

```json
[
    [21.052631578947363,20.947368421052627],
    [28.947368421052627]
]
```

#### 2.2.3 More complex example

<img src="/images/Complex.png" width="960" alt="super basic example">

#### 2.2.4 Basic example

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

#### 2.2.5 Basic example (shortcut from the previous example)

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

