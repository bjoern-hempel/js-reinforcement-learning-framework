function startRLTest() {

    /* RL: Calculate Q test 1 */
    new JsSuccessTest(
        ReinforcementLearning.SUCCESS_CALCULATE_Q,
        new JsTestTestFunction(function () {
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

    /* RL: Calculate Q test 2 */
    new JsSuccessTest(
        ReinforcementLearning.SUCCESS_CALCULATE_Q,
        new JsTestTestFunction(function () {
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
}