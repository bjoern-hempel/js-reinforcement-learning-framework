function startRLTest() {

    /* RL.mdp: Calculate Q test 1 */
    new JsSuccessTest(
        ReinforcementLearningMDP.SUCCESS_CALCULATE_Q,
        new JsTestTestFunction(function () {
            var discountFactor = 0.95;
            var iterations     = 100;

            var rl = new ReinforcementLearning.mdp();

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

            var Q = rl.calculateQ({iterations: iterations, discountFactor: discountFactor});

            var QExpected = [
                [21.8864, 20.7914, 16.8548],
                [ 1.1080,  1.1670],
                [53.8607]
            ];

            return (
                JsTest.equalArrayValues(Q, QExpected, 3)
            );
        })
    );

    /* RL.mdp: Calculate Q test 2 */
    new JsSuccessTest(
        ReinforcementLearningMDP.SUCCESS_CALCULATE_Q,
        new JsTestTestFunction(function () {
            var discountFactor = 0.95;
            var iterations     = 100;

            var rl = new ReinforcementLearning.mdp();

            var s0 = rl.addState();
            var s1 = rl.addState();
            var s2 = rl.addState();

            rl.addAction(s0, new StateChange(s0, 0.7,  10), new StateChange(s1, 0.3, 0));
            rl.addAction(s0, new StateChange(s0, 1.0,   0));
            rl.addAction(s0, new StateChange(s0, 0.8,   0), new StateChange(s1, 0.2, 0));
            rl.addAction(s1, new StateChange(s1, 1.0,   0));
            rl.addAction(s1, new StateChange(s2, 1.0, -50));
            rl.addAction(s2, new StateChange(s0, 0.8,  40), new StateChange(s1, 0.1, 0), new StateChange(s2, 0.1, 0));

            var Q = rl.calculateQ({iterations: iterations, discountFactor: discountFactor});

            var QExpected = [
                [21.8864, 20.7914, 16.8548],
                [ 1.1080,  1.1670],
                [53.8607]
            ];

            return (
                JsTest.equalArrayValues(Q, QExpected, 3)
            );
        })
    );

    /* RL.ql: Calculate Q test 1 */
    new JsSuccessTest(
        ReinforcementLearningQLearning.SUCCESS_CALCULATE_Q,
        new JsTestTestFunction(function () {
            var discountRate = 0.9;

            var rl = new ReinforcementLearning.qLearning();

            /* s0 to s5 */
            var s0 = rl.addState();
            var s1 = rl.addState();
            var s2 = rl.addState();
            var s3 = rl.addState();
            var s4 = rl.addState();
            var s5 = rl.addState();

            rl.addAction(s0, new StateChange(s4,   0));

            rl.addAction(s1, new StateChange(s3,   0));
            rl.addAction(s1, new StateChange(s5, 100));

            rl.addAction(s2, new StateChange(s3,   0));

            rl.addAction(s3, new StateChange(s1,   0));
            rl.addAction(s3, new StateChange(s2,   0));
            rl.addAction(s3, new StateChange(s4,   0));

            rl.addAction(s4, new StateChange(s0,   0));
            rl.addAction(s4, new StateChange(s3,   0));
            rl.addAction(s4, new StateChange(s5, 100));

            rl.addAction(s5, new StateChange(s1,   0));
            rl.addAction(s5, new StateChange(s4,   0));
            rl.addAction(s5, new StateChange(s5, 100));

            var Q = rl.calculateQ(discountRate, {iterations: 20000, useSeededRandom: true});

            var QExpected = [
                [2.4031],
                [0.2413, 22.3212],
                [0.5743],
                [3.1499,  0.0750,  3.3649],
                [0.1530,  0.3755, 24.2189],
                [1.4851,  3.7082,  9.3230]
            ];

            return (
                JsTest.equalArrayValues(Q, QExpected, 3)
            );
        })
    )
}