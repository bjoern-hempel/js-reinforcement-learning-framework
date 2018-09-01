/**
 * A class to do some reinforcement learning stuff.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-08-31)
 */
class ReinforcementLearning {

    static get SUCCESS_CALCULATE_Q() {
        return [new JsTestException(201, 'Init matrix'), this];
    }

    /**
     * The constructor of this class.
     * Creates a new environment.
     *
     * @param T
     * @param R
     * @param Q
     * @param possibleActions
     */
    constructor(statesActionsStatesTR) {
        this.name = 'ReinforcementLearning';
        this.statesActionsStatesTR = statesActionsStatesTR;
    }

    /**
     * Adds a new state to this environment.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-08-31)
     */
    addState() {

    }

    /**
     * Adds a new action to this environment.
     *
     * @param stateFrom
     * @param stateTo
     * @param likelihood
     * @param reward
     */
    addAction(stateFrom, stateTo, likelihood, reward) {

    }

    /**
     * Do all calculations.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-08-28)
     * @param iterations
     * @param discountRate
     */
    calulateQ(iterations, discountRate) {

        var Q = [
            [0.0, 0.0, 0.0],
            [0.0, 0.0],
            [0.0]
        ];

        for (var i = 0; i < iterations; i++) {

            var QPrev = JSON.parse(JSON.stringify(Q));

            for (var s = 0; s < this.statesActionsStatesTR.length; s++) {
                var actionsStatesTR = this.statesActionsStatesTR[s];

                for (var a = 0; a < actionsStatesTR.length; a++) {
                    var statesTR = actionsStatesTR[a];
                    Q[s][a] = 0;

                    for (var sp in statesTR) {
                        var T = statesTR[sp][0];
                        var R = statesTR[sp][1];

                        Q[s][a] += T * (R + discountRate * Math.max(...QPrev[sp]));
                    }
                }
            }
        }

        return Q;
    }
}
