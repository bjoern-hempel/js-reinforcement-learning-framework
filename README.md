# A javascript reinforcement learning framework

This is a javascript reinforcement learning framework.

## 1. Introduction

In progress.. 

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
var discountFactor = 0;

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

var Q = rl.calculateQ(discountFactor);

console.log(JSON.stringify(Q));
```

**The short version:**

```javascript
var discountFactor = 0;

var rl = new ReinforcementLearning();

/* s0 */
var s0 = rl.addState();

/* s0.a0, s0.a1 and s0.a2 */
rl.addAction(s0, new StateChange(s0, 1.0,  1));
rl.addAction(s0, new StateChange(s0, 1.0, -1));
rl.addAction(s0, new StateChange(s0, 1.0,  0));

var Q = rl.calculateQ(discountFactor);

console.log(JSON.stringify(Q));
```

**It returns:**

```json
[
    [1, -1, 0]
]
```

As we suspected above: a<sub>0</sub> is the winner and with the maximum value of Q<sub>(s=0)</sub> (Q<sub>(s=0,a=0)</sub> = 1). The discountFactor is set to 0, because we only want to consider one iteration step. The discountFactor determines the importance of future rewards: A factor of 0 makes the agent "short-sighted" by considering only the current rewards, while a factor of close to 1 makes him strive for a high long-sighted reward. Because it is set to 0, only the next step is important and it shows the previously shown result.

The situation doesn't change if we look a little bit more far-sighted and we set the discount factor close to 1:

```javascript
var discountFactor = 0.9;
```

**It returns:**

```json
[
    [9.991404955442832, 7.991404955442832, 8.991404955442832]
]
```

Q<sub>(s=0,a=0)</sub> is still the winner with the maximum of Q<sub>(s=0)</sub>: 9.991404955442832. The algorithm is implemented until a certain threshold value is reached and then stops repeating the above given formula (default is the Q change difference of 0.001).

#### 2.2.2 Basic example

Let's look at the next following example:

<img src="/images/Basic.png" width="512" alt="super basic example">

If we look at this example in the short term, it is a good idea to go through a<sub>1</sub> from s<sub>0</sub> (discountRate = 0): Because we always get a reward of 2 and we don't want to receive any punishment of -5. From a far-sighted point of view, it's better to go through a<sub>0</sub> (discountRate = 0.9), because in future we will receive a reward of 10 in addition to the punishment of -5 (it means the sum of 5 reward instead of only 2). Let's calculate that:  

##### 2.2.2.1 Code

```javascript
var discountRate = 0.9;

var rl = new ReinforcementLearning();

/* s0 and s1 */
var s0 = rl.addState();
var s1 = rl.addState();

/* s0.a0, s0.a1 and s1.a0 */
rl.addAction(s0, new StateChange(s1, 1.0, -5));
rl.addAction(s0, new StateChange(s0, 1.0,  2));

/* s1.a0 */
rl.addAction(s1, new StateChange(s0, 1.0, 10));

var Q = rl.calculateQ(discountRate);

console.log(JSON.stringify(Q));
```

**It returns:**

As we expected, the choice of s<sub>0</sub>.a<sub>0</sub> farsighted is the better choice:

```json
[
    [21.044799074176453, 20.93957918978874],
    [28.93957918978874]
]
```

#### 2.2.3 More complex example

<img src="/images/Complex.png" width="960" alt="super basic example">

##### 2.2.3.1 Code

```javascript
var discountRate =  0.9;

var rl = new ReinforcementLearning();

/* s0, s1 and s2 */
var s0 = rl.addState();
var s1 = rl.addState();
var s2 = rl.addState();

/* s0.a0 and s0.a1 */
rl.addAction(s0, new StateChange(s0, 1.0,   1));
rl.addAction(s0, new StateChange(s0, 0.5,  -2), new StateChange(s1, 0.5, 0));

/* s1.a0 and s1.a1 */
rl.addAction(s1, new StateChange(s1, 1.0,   0));
rl.addAction(s1, new StateChange(s2, 1.0, -50));

/* s2.a0 */
rl.addAction(s2, new StateChange(s0, 0.8, 100), new StateChange(s1, 0.1, 0), new StateChange(s2, 0.1, 0));

var Q = rl.calculateQ(discountRate);

console.log(JSON.stringify(Q));
```

**It returns:**

```json
[
    [61.75477734479686, 67.50622243150205],
    [76.25766751820726, 84.73165595751362],
    [149.70275422340958]
]
```

##### 2.2.3.2 Comparison of the discountRate variable

| discountRate | type | s<sub>0</sub> | s<sub>1</sub> | s<sub>2</sub> | s<sub>0</sub> (winner) | s<sub>1</sub> (winner) | s<sub>2</sub> (winner) |
|---|-------------------------------------|----------------|----------------|----------|----------------|----------------|----------|
| 0.0 | short-sighted | `[1, -1]` | `[0, -50]` | `[80]` | a<sub>0</sub> | a<sub>0</sub> | a<sub>0</sub> |
| 0.1 | short-sighted | `[1.11, -0.94]` | `[0, -41.91]` | `[80.90]` | a<sub>0</sub> | a<sub>0</sub> | a<sub>0</sub> |
| 0.5 | half short-sighted | `[2, -0.5]` | `[0, -7.47]` | `[85.05]` | a<sub>0</sub> | a<sub>0</sub> | a<sub>0</sub> |
| 0.9 | far-sighted | `[61.76, 67.51]` | `[76.27, 84.74]` | `[149.71]` | a<sub>1</sub> | a<sub>1</sub> | a<sub>0</sub> |

## 3. Temporal Difference Learning and Q-Learning

In progress.. 

## A. Authors

* Björn Hempel <bjoern@hempel.li> - _Initial work_ - [https://github.com/bjoern-hempel](https://github.com/bjoern-hempel)

## B. Licence

This tutorial is licensed under the MIT License - see the [LICENSE.md](/LICENSE.md) file for details

## C. Closing words

Have fun! :)

