/**
 * A class to do some reinforcement learning stuff.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-08-31)
 */
class ReinforcementLearning {

    static get SUCCESS_CALCULATE_Q() {
        return [new JsTestException(201, 'Calculate Q test'), this];
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

        this.statesActionsStatesTR = [];
    }

    /**
     * Adds a new state to this environment.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-08-31)
     */
    addState() {
        this.statesActionsStatesTR.push([]);

        return this.statesActionsStatesTR.length - 1;
    }

    /**
     * Adds a new action to this environment.
     *
     * @param state
     */
    addAction(state) {
        this.statesActionsStatesTR[state].push({});

        return [state, this.statesActionsStatesTR[state].length - 1];
    }

    /**
     * Adds a state change.
     *
     * @param action
     * @param likelihood
     * @param reward
     */
    addStateChange(action, toState, likelihood, reward) {
        this.statesActionsStatesTR[action[0]][action[1]][toState] = [likelihood, reward];
    }

    /**
     * Create the initial Q Array.
     *
     * @returns {Array}
     */
    getInitialQ() {
        var Q = [];

        for (var s = 0; s < this.statesActionsStatesTR.length; s++) {
            Q.push([]);

            for (var a = 0; a < this.statesActionsStatesTR[s].length; a++) {
                Q[s].push(0);
            }
        }

        return Q;
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

        var Q = this.getInitialQ();

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
