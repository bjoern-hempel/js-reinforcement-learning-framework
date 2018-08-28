/**
 * A class to do some reinforcement learning stuff.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-08-22)
 */
class ReinforcementLearning {

    /**
     * The constructor of this class.
     *
     * @param T
     * @param R
     */
    constructor(T, R, possibleActions) {
        this.name = 'ReinforcementLearning';
        this.T = T;
        this.R = R;
        this.possibleActions = possibleActions;
    }

    /**
     * Do all calculations.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-08-28)
     * @param iterations
     * @param discountRate
     */
    calulate(iterations, discountRate) {

        var possibleStates = Object.keys(this.possibleActions);

        var Q = [
            [0.0, 0.0, 0.0],
            [0.0, -Infinity, 0.0],
            [-Infinity, 0.0, -Infinity]
        ];

        for (var iteration = 0; iteration < iterations; iteration++) {
            /* deep array copy */
            var Q_Prev = JSON.parse(JSON.stringify(Q));

            console.log(Q_Prev);
            console.log([Math.max(...Q_Prev[0]), Math.max(...Q_Prev[1]), Math.max(...Q_Prev[2])]);
            console.log([discountRate * Math.max(...Q_Prev[0]), discountRate * Math.max(...Q_Prev[1]), discountRate * Math.max(...Q_Prev[2])]);

            for (var s in possibleStates) {
                for (var a in this.possibleActions) {
                    Q[s][a] = 0;

                    var print = 'Q[' + s + '][' + a + '] = 0';
                    for (var sp in possibleStates) {
                        print += ' + ' + this.T[s][a][sp] + ' * (' + this.R[s][a][sp] + ' + ' + discountRate + ' * ' + Math.max(...Q_Prev[sp]) + ')';
                        Q[s][a] += this.T[s][a][sp] * (this.R[s][a][sp] + discountRate * Math.max(...Q_Prev[sp]));
                    }
                    print += ' = ' + Q[s][a];

                    console.log(print);
                }
            }
        }

        console.log('Q', Q);
    }

}
