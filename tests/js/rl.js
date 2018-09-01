function startRLTest() {

    /* RL: Calculate Q test */
    new JsSuccessTest(
        ReinforcementLearning.SUCCESS_CALCULATE_Q,
        new JsTestTestFunction(function () {
            var discountRate = 0.95;
            var iterations   = 100;

            var statesActionsStatesTR = [
                /* state 0 */
                [
                    { /* action 0 */
                        0: [0.7, 10], /* to state 0 */
                        1: [0.3,  0]  /* to state 1 */
                    },
                    { /* action 1 */
                        0: [1.0, 0]  /* to state 0 */
                    },
                    { /* action 2 */
                        0: [0.8, 0], /* to state 0 */
                        1: [0.2, 0]  /* to state 1 */
                    }
                ],

                /* state 1 */
                [
                    { /* action 0 */
                        1: [1.0, 0] /* to state 1 */
                    },
                    { /* action 1 */
                        2: [1.0, -50] /* to state 2 */
                    }
                ],

                /* state 2 */
                [
                    { /* action 0 */
                        0: [0.8, 40], /* to state 0 */
                        1: [0.1,  0], /* to state 1 */
                        2: [0.1,  0]  /* to state 2 */
                    }
                ]
            ];

            var rl = new ReinforcementLearning(statesActionsStatesTR);

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