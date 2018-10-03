# A javascript reinforcement learning framework

This is a javascript reinforcement learning framework.

## 1. Introduction

In progress.. 

## 2. Markov decision process (MDP)

### 2.1 Theory

#### 2.1.1 The bellman equation

<img src="https://latex.ixno.de/?r=300&p=1pt&c=1&f=V%5E%2A%28s%29%20%3D%20%5Csubstack%7B%5Ctextbf%7Bmax%7D%5C%5C%20%7B%5Ctiny%20a%7D%7D%5Csum_%7Bs%27%7D%5E%7B%7D%20T%28s%2C%20a%2C%20s%27%29%5BR%28s%2C%20a%2C%20s%27%29%20%2B%20%5Cgamma%20%5Ccdot%20V%5E%2A%28s%27%29%5D%20%5Cquad%20%5Cforall%20s" width="499" alt="V^*(s) = \substack{\textbf{max}\\ {\tiny a}}\sum_{s'}^{} T(s, a, s')[R(s, a, s') + \gamma \cdot V^*(s')] \quad \forall s">

#### 2.1.2 The value iteration algorithm

<img src="https://latex.ixno.de/?r=300&p=1pt&c=1&f=V_%7Bk%2B1%7D%28s%29%20%5Cleftarrow%20%5Csubstack%7B%5Ctextbf%7Bmax%7D%5C%5C%20%7B%5Ctiny%20a%7D%7D%5Csum_%7Bs%27%7D%5E%7B%7D%20T%28s%2C%20a%2C%20s%27%29%5BR%28s%2C%20a%2C%20s%27%29%20%2B%20%5Cgamma%20%5Ccdot%20V_k%28s%27%29%5D%20%5Cquad%20%5Cforall%20s" width="516" alt="V_{k+1}(s) \leftarrow \substack{\textbf{max}\\ {\tiny a}}\sum_{s'}^{} T(s, a, s')[R(s, a, s') + \gamma \cdot V_k(s')] \quad \forall s">

#### 2.1.3 The Q-value iteration algorithm

<img src="https://latex.ixno.de/?r=300&p=1pt&c=1&f=Q_%7Bk%2B1%7D%28s%2Ca%29%20%5Cleftarrow%20%5Csum_%7Bs%27%7D%5E%7B%7D%20T%28s%2C%20a%2C%20s%27%29%5BR%28s%2C%20a%2C%20s%27%29%20%2B%20%5Cgamma%20%5Ccdot%20%5Csubstack%7B%5Ctextbf%7Bmax%7D%5C%5C%20%7B%5Ctiny%20a%27%7D%7D%20Q_k%28s%27%2Ca%27%29%5D%20%5Cquad%20%5Cforall%20%28s%2Ca%29" width="604" alt="Q_{k+1}(s,a) \leftarrow \sum_{s'}^{} T(s, a, s')[R(s, a, s') + \gamma \cdot \substack{\textbf{max}\\ {\tiny a'}} Q_k(s',a')] \quad \forall (s,a)">

### 2.2 Usage

#### 2.2.1 Super basic example

Let's look at a state s<sub>0</sub> which contains 3 actions which point back to the state s<sub>0</sub>. The first action a<sub>0</sub> receives a reward of 1. The second action a<sub>1</sub> receives a penalty of 1 (-1). The third action a<sub>2</sub> remains neutral and results in neither reward nor punishment. In this case, each action contains only one possible state change, so the transition probability is 1,0 (100%). The whole setup does not make much sense, but it should show the procedure in more detail:

<img src="/images/SuperBasic.png" width="480" alt="super basic example">

As one can logically see, a<sub>0</sub> is the best option and leads to maximum reward. a<sub>1</sub> teaches us punishment and is the most unfavorable variant, while a<sub>2</sub> is the neutral version without any reward. Let's calculate that:

##### 2.2.1.1 Code

**The written-out version:**

```javascript
var discountFactor = 0;

var rl = new ReinforcementLearning.mdp();

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

The situation doesn't change if we look a little bit more far-sighted and we set the discount factor close to 1 (e.g. 0,9):

```javascript
var discountFactor = 0.9;
```

**It returns:**

```json
[
    [9.991404955442832, 7.991404955442832, 8.991404955442832]
]
```

Q<sub>(s=0,a=0)</sub> is still the winner with the maximum of Q<sub>(s=0)</sub> ≈ 10. The algorithm of the `calculateQ` function stops the iteration of the above Markov formula until the Q change difference falls below a certain threshold: the default value of this threshold is 0,001.

##### 2.2.1.2 Watch at the [demo](demo/rl-super-basic.html)

Discount rate 0,9:

<img src="/images/SuperBasicDemo.png" width="793" alt="super basic example">

#### 2.2.2 Basic example

Let's look at the next following example:

<img src="/images/Basic.png" width="512" alt="super basic example">

If we look at this example in the short term, it is a good idea to permanently go through a<sub>1</sub> from s<sub>0</sub> (discountRate = 0) and stay on state s<sub>0</sub>: Because we always get a reward of 2 and we don't want to receive any punishment of -5. From a far-sighted point of view, it's better to go through a<sub>0</sub> (discountRate = 0,9), because in future we will receive a reward of 10 in addition to the punishment of -5 (it means the sum of 5 reward instead of only 2). Let's calculate that:  

##### 2.2.2.1 Code

```javascript
var discountRate = 0.9;

var rl = new ReinforcementLearning.mdp();

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

As we expected, far-sighted it is better to choose s<sub>0</sub>.a<sub>0</sub> with the reward of Q<sub>(s=0,a=0)</sub>:

```json
[
    [21.044799074176453, 20.93957918978874],
    [28.93957918978874]
]
```

##### 2.2.2.2 Watch at the [demo](demo/rl-basic.html)

Discount rate 0,9:

<img src="/images/BasicDemo.png" width="828" alt="basic example">

##### 2.2.2.3 Comparison of different discount rates

| discountRate | type               | s<sub>0</sub>    | s<sub>1</sub> | s<sub>0</sub> (winner) | s<sub>1</sub> (winner) |
|--------------|--------------------|------------------|---------------|------------------------|------------------------|
| 0.0          | short-sighted      | `[-5, 2]`        | `[10]`        | a<sub>1</sub>          | a<sub>0</sub>          |
| 0.1          | short-sighted      | `[-3.98, 2.22]`  | `[10.22]`     | a<sub>1</sub>          | a<sub>0</sub>          |
| 0.5          | half short-sighted | `[1.00, 4.00]`   | `[12.00]`     | a<sub>1</sub>          | a<sub>0</sub>          |
| 0.9          | far-sighted        | `[21.04, 20.94]` | `[28.94]`     | a<sub>0</sub>          | a<sub>0</sub>          |

**Graphic:**

<img src="/images/BasicResult.png" width="792" alt="basic example result">

#### 2.2.3 More complex example

Let's look at the somewhat more complex example:

<img src="/images/Complex.png" width="960" alt="super basic example">

Short-sightedly it is a good idea to permanently go through a<sub>0</sub> and stay on state s<sub>0</sub>. But how is it farsighted? Is courage rewarded in this case? Let's calculate that:

##### 2.2.3.1 Code

```javascript
var discountRate =  0.9;

var rl = new ReinforcementLearning.mdp();

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

##### 2.2.3.2 Watch at the [demo](demo/rl-more-complex.html)

Discount rate 0,9:

<img src="/images/MoreComplexDemo.png" width="852" alt="more complex example">

##### 2.2.3.3 Comparison of different discount rates

| discountRate | type | s<sub>0</sub> | s<sub>1</sub> | s<sub>2</sub> | s<sub>0</sub> (winner) | s<sub>1</sub> (winner) | s<sub>2</sub> (winner) |
|---|-------------------------------------|----------------|----------------|----------|----------------|----------------|----------|
| 0.0 | short-sighted | `[1, -1]` | `[0, -50]` | `[80]` | a<sub>0</sub> | a<sub>0</sub> | a<sub>0</sub> |
| 0.1 | short-sighted | `[1.11, -0.94]` | `[0, -41.91]` | `[80.90]` | a<sub>0</sub> | a<sub>0</sub> | a<sub>0</sub> |
| 0.5 | half short-sighted | `[2, -0.5]` | `[0, -7.47]` | `[85.05]` | a<sub>0</sub> | a<sub>0</sub> | a<sub>0</sub> |
| 0.9 | far-sighted | `[61.76, 67.51]` | `[76.27, 84.74]` | `[149.71]` | a<sub>1</sub> | a<sub>1</sub> | a<sub>0</sub> |

**Graphic:**

<img src="/images/ComplexResult0.0.png" width="960" alt="more complex example result">

<img src="/images/ComplexResult0.1.png" width="960" alt="more complex example result">

<img src="/images/ComplexResult0.5.png" width="960" alt="more complex example result">

<img src="/images/ComplexResult0.9.png" width="960" alt="more complex example result">

#### 2.2.4 Real example

##### 2.2.4.1 Code

In progress..

##### 2.2.4.2 Watch at the [demo](demo/rl-real.html)

In progress..

##### 2.2.4.3 Comparison of different discount rates

In progress..

## 3. Temporal Difference Learning and Q-Learning

### 3.1 Theory

#### 3.1.1 Formula

In Progress

### 3.2 Usage

#### 3.2.1 Super basic example

In Progress.

#### 3.2.2 Simple Grid World

In progress.

##### 3.2.2.1 Code

```javascript
var discountRate = 0.95;

/* create the q-learning instance */
var rlQLearning = new ReinforcementLearning.qLearning();

/* get settings */
var width  = 5;
var height = 3;
var R      = {
    0: {2: 100},
    1: {2: -10},
    2: {2: -10, 1: -10},
    3: {2: -10},
    4: {2: 0, 0: -10}
};

/* build the grid world */
rlQLearning.buildGridWorld(width, height, R);

/* calculate Q */
var Q = rlQLearning.calculateQ(discountRate, {
    iterations: 100000,
    useSeededRandom: true,
    useOptimizedRandom: true
});

/* print result */
rlQLearning.printTableGridWorld(Q, width, R);
```

**It returns:**

In progress.

##### 3.2.2.2 Watch at the [demo](demo/rl-grid-world.html)

In progress.

## A. Tools

* All flowcharts were gratefully created with [Google Drive](https://www.google.com/drive/)

## B. Authors

* Björn Hempel <bjoern@hempel.li> - _Initial work_ - [https://github.com/bjoern-hempel](https://github.com/bjoern-hempel)

## C. Licence

This tutorial is licensed under the MIT License - see the [LICENSE.md](/LICENSE.md) file for details

## D. Closing words

Have fun! :)

