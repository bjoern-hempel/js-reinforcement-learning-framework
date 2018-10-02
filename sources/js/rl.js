/**
 * The class that represents a state.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-09-01)
 */
class State {

    /**
     * The constructor of this class.
     *
     * @param idState
     */
    constructor(idState) {
        this.ids = {
            idState: idState
        };
    }

    /**
     * Returns the state id.
     *
     * @returns Integer
     */
    get idState() {
        return this.ids.idState;
    }
}

/**
 * The class that represents an action.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-09-01)
 */
class Action {

    /**
     * The constructor of this class.
     *
     * @param state
     * @param idAction
     */
    constructor(state, idAction) {
        this.state = state;

        this.ids = {
            idAction: idAction
        };
    }

    /**
     * Returns the state id.
     *
     * @returns Integer
     */
    get idState() {
        return this.state.idState;
    }

    /**
     * Returns the action id.
     *
     * @returns Integer
     */
    get idAction() {
        return this.ids.idAction;
    }
}

/**
 * The class that represents a state change.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-09-01)
 */
class StateChange {

    /**
     * The constructor of this class.
     *
     */
    constructor() {
        this.state       = null;
        this.action      = null;
        this.stateTarget = null;

        this.stateTargetFirst = true;

        this.values = {
            likelihood: null,
            reward:     null
        };

        /* Iterate through all arguments. */
        for (var i = 0; i < arguments.length; i++) {
            switch(true) {
                /* object State given */
                case arguments[i] instanceof State:
                    if (this.stateTargetFirst) {
                        if (this.stateTarget === null) {
                            this.stateTarget = arguments[i];
                        } else if (this.state === null) {
                            this.state = arguments[i];
                        } else {
                            console.error('Too much state objects given.');
                        }
                    } else {
                        if (this.state === null) {
                            this.state = arguments[i];
                        } else if (this.stateTarget === null) {
                            this.stateTarget = arguments[i];
                        } else {
                            console.error('Too much state objects given.');
                        }
                    }

                    this.stateTarget = arguments[i];
                    break;

                /* object Action given */
                case arguments[i] instanceof Action:
                    this.action = arguments[i];
                    break;

                /* number given (likelihood and reward) */
                case typeof arguments[i] == 'number' && !isNaN(arguments[i]) && isFinite(arguments[i]):
                    if (this.values.reward === null) {
                        this.values.reward = arguments[i];
                    } else if (this.values.likelihood === null) {
                        this.values.likelihood = this.values.reward;
                        this.values.reward = arguments[i];
                    } else {
                        console.error('Too much numbers given!');
                        continue;
                    }
                    break;
            }
        }


    }

    /**
     * Returns the state id.
     *
     * @returns Integer
     */
    get idState() {
        return this.state !== null ? this.state.idState : null;
    }

    /**
     * Returns the action id.
     *
     * @returns Integer
     */
    get idAction() {
        return this.action.idAction;
    }

    /**
     * Returns the id from state target.
     *
     * @returns Integer
     */
    get idStateTarget() {
        console.log(this.stateTarget);

        return this.stateTarget.idState;
    }

    /**
     * Returns the id from state target.
     *
     * @returns Integer
     */
    get likelihood() {
        return this.values.likelihood;
    }

    /**
     * Returns the id from state target.
     *
     * @returns Integer
     */
    get reward() {
        return this.values.reward;
    }
}

/**
 * A class to do some reinforcement learning stuff (base class).
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-08-31)
 */
class ReinforcementLearningBase {

    /**
     * The constructor of this class.
     * Creates a new environment.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-08-31)
     */
    constructor() {
        this.name = 'ReinforcementLearning';

        this.config = {};

        this.randomSeedNumber = 1;

        this.ouputs = {};

        this.reset();
    }

    /**
     * Resets all states.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-08-31)
     */
    reset() {
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

        return new State(this.statesActionsStatesTR.length - 1);
    }

    /**
     * Adds a new action to this environment.
     *
     */
    addAction() {
        var action = null;

        /* Iterate through all arguments. */
        for (var i = 0; i < arguments.length; i++) {
            switch(true) {
                case arguments[i] instanceof State:
                    var state = arguments[i];

                    /* Multiple entries of the state object. */
                    if (action !== null) {
                        console.error('Only one state is allowed!');
                        continue;
                    }

                    this.statesActionsStatesTR[state.idState].push({});
                    action = new Action(state, this.statesActionsStatesTR[state.idState].length - 1);
                    break;
            }
        }

        /* No state was given */
        if (action === null) {
            console.error('No State was given!');
            return null;
        }

        /* Iterate through all arguments. */
        for (var i = 0; i < arguments.length; i++) {
            switch(true) {
                case arguments[i] instanceof StateChange:
                    var sc = arguments[i];

                    this.addStateChange(action, sc.stateTarget, sc.likelihood, sc.reward);
                    break;
            }
        }

        return action;
    }

    /**
     * Adds a state change.
     *
     * @param action
     * @param likelihood
     * @param reward
     */
    addStateChange(action, toState, likelihood, reward) {
        this.statesActionsStatesTR[action.idState][action.idAction][toState.idState] = [likelihood, reward];
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
     * Create the initial T Array.
     *
     * @returns {Array}
     */
    getInitialT() {
        var T = [];

        for (var s = 0; s < this.statesActionsStatesTR.length; s++) {
            T.push([]);

            for (var a = 0; a < this.statesActionsStatesTR[s].length; a++) {
                T[s].push({});

                for (var sp in this.statesActionsStatesTR[s][a]) {
                    T[s][a][sp] = this.statesActionsStatesTR[s][a][sp][0];
                }
            }
        }

        return T;
    }

    /**
     * Create the initial N Array.
     *
     * @returns {Array}
     */
    getInitialN(div) {
        var div = div ? div : 0;

        var N = [];

        for (var s = 0; s < this.statesActionsStatesTR.length; s++) {
            if (div === 0) {
                N.push(0);
                continue;
            }

            N.push([]);

            for (var a = 0; a < this.statesActionsStatesTR[s].length; a++) {
                if (div === 1) {
                    N[s].push(0);
                    continue;
                }

                N[s].push({});

                for (var sp in this.statesActionsStatesTR[s][a]) {
                    N[s][a][sp] = 0;
                }
            }
        }

        return N;
    }

    /**
     * Calculate the difference between the current Q and the last Q.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-08-28)
     * @param Q
     * @param Q_prev
     * @returns {number}
     */
    calculateQDifferenceMax(Q, Q_prev) {
        var Q_diffMax = 0;
        var number    = 0;

        for (var state = 0; state < Q.length; state++) {
            for (var action = 0; action < Q[state].length; action++) {
                var diff = Q[state][action] - Q_prev[state][action];
                Q_diffMax = diff > Q_diffMax ? diff : Q_diffMax;
            }
        }

        return Q_diffMax;
    }

    /**
     * Adopt given config.
     *
     * @param config
     */
    adoptConfig(config) {
        for (var name in config) {
            this.config[name] = config[name];
        }
    }

    /**
     * Returns a optimized random element of given array or object.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-18)
     * @param NValues
     * @returns {number}
     */
    getOptimizedRandomIndex(NValues) {
        /* Get a random number from 0 to 1 */
        var random = this.config.useSeededRandom ? this.seedRandom() : Math.random();

        /* get the count min -> we only want to have the min counts */
        var countMin = Math.min(...NValues);

        /* change the N to count to a N to index array and mark counts higher than countMin with null */
        var NPreferred = NValues.map(function(count, index) { return count <= countMin ? index : null; });

        /* remove the null marked elements of NPreferred */
        NPreferred = NPreferred.filter(function(index) { return index !== null; });

        /* returns a random index of NPreferred array */
        return NPreferred[Math.round((NPreferred.length - 1) * random)];
    }

    /**
     * Returns a random elements of given array or object.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-18)
     * @param N
     * @returns {*}
     */
    getRandomIndex(N) {
        switch (true) {
            /* array */
            case this.isArray(N):
                /* extract values from array (associative array compatibility */
                var NValues = N;

                if (this.config.useOptimizedRandom) {
                    var randomIndex = this.getOptimizedRandomIndex(NValues);
                } else {
                    /* Get a random number from 0 to 1 */
                    var random = this.config.useSeededRandom ? this.seedRandom() : Math.random();

                    /* get a random index of NPreferred array */
                    var randomIndex = Math.round((NValues.length - 1) * random);
                }

                /* return random key */
                return randomIndex;

            /* object */
            case typeof N === 'object':
                /* extract values from object */
                var NValues = Object.values(N);

                /* extract keys from object */
                var NKeys = Object.keys(N);

                if (this.config.useOptimizedRandom) {
                    var randomIndex = this.getOptimizedRandomIndex(NValues);
                } else {
                    /* Get a random number from 0 to 1 */
                    var random = this.config.useSeededRandom ? this.seedRandom() : Math.random();

                    /* get a random index of NPreferred array */
                    var randomIndex = Math.round((NKeys.length - 1) * random);
                }

                /* return random key */
                return parseInt(NKeys[randomIndex]);

            /* unsupported kind of elements */
            default:
                return null;
        }
    }

    /**
     * Returns a random elements of given array or object.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-18)
     * @param T
     * @returns {*}
     */
    getRandomIndexByT(T) {
        var random = this.config.useSeededRandom ? this.seedRandom() : Math.random();
        var value  = 0;

        for (var sp in T) {
            value += T[sp];

            if (random <= value) {
                return sp;
            }
        }

        return sp;
    }

    /**
     * Check if given element is an array.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-18)
     * @param element
     * @returns {*}
     */
    isArray(element) {
        if (typeof Array.isArray === 'undefined') {
            return Object.prototype.toString.call(obj) === '[object Array]';
        } else {
            return Array.isArray(element);
        }
    }

    /**
     * Prints a table with all results.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-13)
     * @param object
     */
    printTableGridWorld(Q, width, reward) {

        var table = this.ouputs['tableGridWorld'] ? this.ouputs['tableGridWorld'] : null;

        /* Nothing to to, if we do not have any states */
        if (this.statesActionsStatesTR.length <= 0) {
            return null;
        }

        var stateReward = {};

        /* calculate the state reward list */
        for (var x in reward) {
            for (var y in reward[x]) {
                stateReward[this.getStateNumber({x: parseInt(x), y: parseInt(y)}, width)] = reward[x][y];
            }
        }

        /* remove table content or create table */
        if (table) {
            while (table.firstChild) {
                table.removeChild(table.firstChild);
            }
        } else {
            table = this.addTable(document.body, {
                border: 0,
                cellspacing: 0,
                cellpadding: 0,
                style: {paddingBottom: '100px'}
            });
        }

        var QMax  = this.calculateQMaxArray(Q);
        var QSign = this.translateGrid(QMax);

        var tr = null;

        for (var state in QSign) {

            var R           = stateReward[state] ? stateReward[state] : 0;
            var QMaxCurrent = Q[state][QMax[state]];

            var color = '#f0f0f0';

            if (R < 0) {
                color = '#ff8080';
            }

            if (R > 0) {
                color = '#80ff80';
            }

            if (state % width === 0) {
                tr = this.addTr(table);
            }

            this.addTd(
                tr,
                this.createHtmlElement(
                    'div',
                    [
                        this.createHtmlElement(
                            'div',
                            R > 0 ? '↻' : QSign[state]
                        ),
                        this.createHtmlElement(
                            'div',
                            String(R),
                            {
                                style: {
                                    position: 'absolute',
                                    right: '5px',
                                    bottom: '5px',
                                    lineHeight: 'normal',
                                    fontSize: '12px',
                                    color: '#404040',
                                    fontStyle: 'italic'
                                }
                            }
                        ),
                        this.createHtmlElement(
                            'div',
                            String(this.roundToAtLeastNumberView(QMaxCurrent, 2)),
                            {
                                style: {
                                    position: 'absolute',
                                    right: '5px',
                                    top: '5px',
                                    lineHeight: 'normal',
                                    fontSize: '12px',
                                    color: '#404040',
                                    fontStyle: 'italic'
                                }
                            }
                        )
                    ],
                    {
                        style: {
                            margin: '5px',
                            border: '2px solid #000',
                            backgroundColor: color,
                            width: '75px',
                            height: '75px',
                            lineHeight: '75px',
                            borderRadius: '15px',
                            boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.5)',
                            textAlign: 'center',
                            position: 'relative'
                        },
                        id: 'rl-state-' + state,
                        onmouseover: function (e) {
                            var id = e.target.id;

                            if (!id) {
                                id = e.target.parentNode.id;
                            }

                            if (!id) {
                                console.error('Something went wrong');
                            }

                            id = parseInt(id.replace('rl-state-', ''));

                            console.log(id);
                        }
                    }
                ),
                {
                    style: {fontWeight: 'bold', fontSize: '20px'}
                },

            );
        }

        this.ouputs['tableGridWorld'] = table;

        return table;
    }

    /**
     * Prints a table with all results.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-13)
     * @param object
     */
    printTableResult(Q) {

        /* Nothing to to, if we do not have any states */
        if (this.statesActionsStatesTR.length <= 0) {
            return null;
        }

        var table = this.ouputs['tableResult'] ? this.ouputs['tableResult'] : null;

        /* remove table content or create table */
        if (table) {
            while (table.firstChild) {
                table.removeChild(table.firstChild);
            }
        } else {
            table  = this.addTable(document.body, {
                border: 0,
                cellspacing: 0,
                cellpadding: 0
            });
        }

        var config = this.calculateConfig();
        var QMax   = this.calculateQMaxArray(Q);
        var tr     = null;

        /* Iterate through all available states */
        for (var s = 0; s < this.statesActionsStatesTR.length; s++) {
            var actionsStatesTR = this.statesActionsStatesTR[s];

            tr = this.addTr(table);

            this.addTd(
                tr,
                this.createHtmlElement(
                    'div',
                    String('S<sub>%s</sub>').replace(/%s/, s),
                    {
                        style: {
                            margin: '5px',
                            border: '2px solid #000',
                            backgroundColor: '#fff',
                            width: '100px',
                            height: '100px',
                            lineHeight: '100px',
                            borderRadius: '52px',
                            boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.5)',
                            textAlign: 'center',
                            backgroundColor: config.state[s].color
                        }
                    }
                ),
                {
                    rowspan: config.state[s].rows,
                    style: {fontWeight: 'bold', fontSize: '20px'}
                }
            );

            /* Iterate through all available actions */
            for (var a = 0; a < actionsStatesTR.length; a++) {
                var statesTR = actionsStatesTR[a];

                tr = a > 0 ? this.addTr(table) : tr;

                this.addTd(tr, this.getArrow(a, actionsStatesTR.length), {rowspan: config.action[s][a].rows, style: {fontSize: '30px'}});
                this.addTd(
                    tr,
                    this.createHtmlElement(
                        'div',
                        String('a<sub>%s</sub>').replace(/%s/, a),
                        {
                            style: {
                                margin: '5px',
                                border: '2px solid #000',
                                backgroundColor: '#fff',
                                width: '50px',
                                height: '50px',
                                lineHeight: '50px',
                                borderRadius: '10px',
                                boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.5)',
                                backgroundColor: (QMax[s].indexOf(a) !== -1 ? '#80ff80' : '#ff8080'),
                                textAlign: 'center'
                            }
                        }
                    ),
                    {
                        rowspan: config.action[s][a].rows,
                        style: {fontWeight: 'bold', fontSize: '14px'}
                    }
                );

                /* iterate through all target states */
                var spCounter = 0;
                for (var sp in statesTR) {
                    var T = statesTR[sp][0];
                    var R = statesTR[sp][1];

                    tr = spCounter > 0 ? this.addTr(table) : tr;

                    this.addTd(tr, this.getArrow(spCounter, Object.keys(statesTR).length), {style: {fontSize: '30px'}});
                    this.addTd(
                        tr,
                        this.createHtmlElement(
                            'div',
                            String('S<sub>%s</sub>').replace(/%s/, sp),
                            {
                                style: {
                                    margin: '5px',
                                    border: '2px solid #000',
                                    backgroundColor: '#fff',
                                    width: '50px',
                                    height: '50px',
                                    lineHeight: '50px',
                                    borderRadius: '27px',
                                    boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.5)',
                                    backgroundColor: config.state[sp].color,
                                    textAlign: 'center'
                                }
                            }
                        ),
                        {
                            style: {fontWeight: 'bold', fontSize: '14px'}
                        }
                    );

                    if (this.name === 'ReinforcementLearningMDP') {
                        this.addTd(tr, String('T = %s').replace('%s', String(T)), {style: {textAlign: 'left', padding: '0 15px'}});
                    }

                    this.addTd(tr, String('R = %s').replace('%s', String(R)), {style: {textAlign: 'left', padding: '0 15px'}});

                    this.addTd(tr, this.getArrow(spCounter, Object.keys(statesTR).length, true), {style: {fontSize: '30px'}});
                    if (spCounter === 0) {
                        var style = {
                            color: QMax[s].indexOf(a) !== -1 ? 'green' : 'red',
                            textAlign: 'left',
                            padding: '0 15px'
                        };

                        if (QMax[s].indexOf(a) !== -1) {
                            style['textDecoration'] = 'underline';
                            style['fontWeight'] = 'bold';
                        } else {
                            style['fontStyle'] = 'italic';
                        }

                        this.addTd(
                            tr,
                            String('Q = %s').replace('%s', String(this.roundToAtLeastNumberView(Q[s][a], 2))),
                            {
                                rowspan: config.action[s][a].rows,
                                style: style
                            }
                        );
                    }

                    if (spCounter === 0) {
                        this.addTd(tr, this.getArrow(a, actionsStatesTR.length, true), {rowspan: config.action[s][a].rows, style: {fontSize: '30px'}});
                    }

                    /* optimal action */
                    if (a === 0 && spCounter === 0) {
                        this.addTd(
                            tr,
                            this.createHtmlElement(
                                'div',
                                String('S<sub>%s</sub>.a<sub>%s</sub>').
                                    replace(/%s/, s).
                                    replace(/%s/, QMax[s].length === 1 ? QMax[s][0] : '[' + QMax[s].join(';') + ']'),
                                {
                                    style: {
                                        margin: '5px',
                                        padding: '5px',
                                        border: '2px solid #000',
                                        boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.5)',
                                        backgroundColor: '#fff',
                                        width: '80px',
                                        height: '80px',
                                        lineHeight: '80px',
                                        backgroundColor: '#f0f0f0',
                                        textAlign: 'center'
                                    }
                                }
                            ),
                            {
                                rowspan: config.state[s].rows,
                                style: {fontWeight: 'bold', padding: '0 15px'}
                            }
                        );
                    }

                    spCounter++;
                }

            }

            tr = this.addTr(table);
            this.addTd(tr, '&nbsp;', {style: {fontSize: '40px'}});
        }

        this.ouputs['tableResult'] = table;

        return table;
    }

    /**
     * Calculate the QMax from Q Array.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-13)
     */
    calculateQMax(Q, N, exploreFunction) {

        var max = -Infinity;

        var useExploreFunction = typeof exploreFunction === 'function' &&
            this.isArray(N) &&
            Q.length === N.length &&
            this.config.hyperParameter > 0;

        for (var i = 0; i < Q.length; i++) {
            var Q_current = useExploreFunction ? exploreFunction.call(this, Q[i], N[i]) : Q[i];

            if (Q_current > max) {
                max = Q_current;
            }
        }

        return max;
    }

    /**
     * Calculate the QMax from Q Array.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-13)
     */
    calculateQMaxArray(Q) {
        var QMax = [];

        for (var i = 0; i < Q.length; i++) {
            var max = -Infinity;
            var index = [];

            for (var j = 0; j < Q[i].length; j++) {
                if (Q[i][j] > max) {
                    max = Q[i][j];

                    index = [j];
                } else if (Q[i][j] === max) {
                    index.push(j);
                }
            }

            QMax[i] = index;
        }

        return QMax;
    }

    /**
     * Calculates the config according the given states and actions.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-13)
     * @returns {{state: Array, action: Array}}
     */
    calculateConfig() {
        var stateConfig  = [];
        var actionConfig = [];

        /* Iterate through all available states */
        for (var s = 0; s < this.statesActionsStatesTR.length; s++) {
            var actionsStatesTR = this.statesActionsStatesTR[s];
            var stateRows = 0;

            actionConfig.push([]);

            /* Iterate through all available actions */
            for (var a = 0; a < actionsStatesTR.length; a++) {
                var statesTR = actionsStatesTR[a];
                var actionRows = 0;

                /* iterate through all target states */
                for (var sp in statesTR) {
                    stateRows++;
                    actionRows++;
                }

                actionConfig[actionConfig.length - 1].push({rows: actionRows});
            }

            stateConfig.push({rows: stateRows, color: this.getColor(s)});
        }

        return {state: stateConfig, action: actionConfig};
    }

    /**
     * Returns a color according the given number.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-16)
     * @param number
     * @returns {string}
     */
    getColor(number) {
        var colors = [
            '4f6d63',
            '7a87ff',
            'a4d29c',
            '45bb49',
            '7d90d4',
            '5ea765',
            '437afa',
            'ee876b',
            'accac1',
            'd0c1f4'
        ];

        if (!Number.isInteger(number) || number > colors.length - 1) {
            return this.getRandomColor();
        }

        return '#' + colors[number];
    }

    /**
     * Returns a random color.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-15)
     * @returns {string}
     */
    getRandomColor() {
        var r = Math.round(Math.random() * 192);
        var g = Math.round(Math.random() * 192);
        var b = Math.round(Math.random() * 192);

        r += 64;
        g += 64;
        b += 64;

        return '#' + r.toString(16) + g.toString(16) + b.toString(16);
    }

    /**
     * Applies attributes to given element.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-13)
     * @param element
     * @param attributes
     */
    applyAttributes(element, attributes) {
        for (name in attributes) {
            switch (name) {
                case 'style':
                    this.applyStyle(element, attributes[name]);
                    break;

                default:
                    switch (true) {
                        case typeof attributes[name] === 'function':
                            element[name] = attributes[name];
                            break;

                        case typeof attributes[name] === 'string':
                        case typeof attributes[name] === 'number':
                            element.setAttribute(name, attributes[name]);
                            break;
                    }
                    break;
            }
        }
    }

    /**
     * Applies all styles to element.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-15)
     * @param element
     * @param styles
     */
    applyStyle(element, styles) {
        switch (typeof styles) {
            case 'string':
                element.setAttribute('style', styles);
                break;

            case 'object':
                var style = '';
                for (name in styles) {
                    style += this.decamelize(name) + ': ' + styles[name] + '; ';
                }
                element.setAttribute('style', style);
                break;
        }
    }

    /**
     * Decamelize the given string.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-15)
     * @param str
     * @param separator
     * @returns {string}
     */
    decamelize(str, separator) {
        separator = typeof separator === 'undefined' ? '-' : separator;

        return str
            .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
            .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
            .toLowerCase();
    }

    /**
     * Adds a table element to given element.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-13)
     * @param table
     * @returns {HTMLTableRowElement}
     */
    addTable(element, attributes) {
        var table = document.createElement('table');
        element.appendChild(table);

        if (attributes) {
            this.applyAttributes(table, attributes);
        }

        return table;
    }

    /**
     * Adds a tr element to given table.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-13)
     * @param table
     * @param attributes
     * @returns {HTMLTableRowElement}
     */
    addTr(table, attributes, group) {
        var element = table;

        if (group) {
            var groupElement = document.createElement(group);
            element.appendChild(groupElement);

            element = groupElement;
        }

        var tr = document.createElement('tr');
        element.appendChild(tr);

        if (attributes) {
            this.applyAttributes(tr, attributes);
        }

        return tr;
    }

    /**
     * Adds a td element to given tr.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-13)
     * @param tr
     * @param html
     * @param attributes
     * @returns {HTMLTableDataCellElement}
     */
    addTd(tr, html, attributes) {
        var td = document.createElement('td');
        tr.appendChild(td);

        switch (true) {
            case html instanceof HTMLElement:
                td.appendChild(html);
                break;

            case typeof html === 'string':
                td.innerHTML = html;
                break;
        }

        if (attributes) {
            this.applyAttributes(td, attributes);
        }

        return td;
    }

    /**
     * Creates an html element.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-15)
     * @param name
     * @param html
     * @param attributes
     * @returns {HTMLElement}
     */
    createHtmlElement(name, html, attributes) {
        var htmlElement = document.createElement(name);

        switch (true) {
            case html instanceof HTMLElement:
                htmlElement.appendChild(html);
                break;

            case typeof html === 'string':
                htmlElement.innerHTML = html;
                break;

            case this.isArray(html):
                for (var i = 0; i < html.length; i++) {
                    htmlElement.appendChild(html[i]);
                }
                break;
        }

        if (attributes) {
            this.applyAttributes(htmlElement, attributes);
        }

        return htmlElement;
    }

    /**
     * Creates an arrow according the position of given element.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-15)
     * @param number
     * @param elements
     * @returns {string}
     */
    getArrow(number, elements, back) {
        var template = '<div style="margin: 0 10px; transform: rotate(%sdeg); text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);">→</div>';

        number *= 2;
        elements -= 1;

        if (number === elements) {
            return template.replace(/%s/, 0);
        }

        return number > elements ? template.replace(/%s/, back ? -15 : 15) : template.replace(/%s/, back ? 15 : -15);
    }

    /**
     * Deep copy (clone) of an object.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-08-28)
     * @param object
     */
    deepCopy(object) {
        return JSON.parse(JSON.stringify(object));
    }


    /**
     * Round the number to see at least "view" numbers.
     * 1.234 3 -> 1.234; 0.0001234 3 -> 0.000123
     *
     * @param number
     * @param view
     * @returns {number}
     */
    roundToAtLeastNumberView(number, view) {
        if (typeof number === 'undefined') {
            return 0;
        }

        var exponential = number.toExponential(view).split('e');

        exponential[0] = parseFloat(exponential[0]);
        exponential[1] = parseInt(exponential[1]);

        if (exponential[1] < -3) {
            return exponential.join('e');
        }

        var roundValue = exponential[1] >= 0 ?
            Math.pow(10, view):
            Math.pow(10, -1 * exponential[1] + view - 1);

        return Math.round(number * roundValue) / roundValue;
    }

    /**
     * Analyse and adopt given arguments.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-20)
     */
    analyseAndAdoptGivenArguments() {
        for (var i = 0; i < arguments.length; i++) {
            switch (typeof(arguments[i])) {

                /* object given */
                case 'object':
                    this.adoptConfig(arguments[i]);
                    break;

                /* number given → discount factor */
                case 'number':
                    this.config.discountFactor = arguments[i];
                    break;
            }
        }
    }

    /**
     * Cancel function if threshold is reached.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-20)
     * @param counter
     * @param parameter
     * @returns {boolean}
     */
    cancelIfThresholdIsReached(counter, parameter, cancelFunction) {
        /* Calculate until threshold is reached */
        if (this.config.iterations === 'auto') {

            /* The maximum iterations are reached */
            if (counter >= this.config.iterationsMax) {
                return true;
            }

            if (cancelFunction.call(this, counter, parameter)) {
                return true;
            }

        /* Iteration number was given */
        } else {

            /* Wanted iterations reached */
            if (counter >= this.config.iterations) {
                return true;
            }
        }
    }

    /**
     * Generates a seeded random number.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-22)
     * @param {Number=} min (optional)
     * @param {Number=} max (optional)
     * @returns {Number}
     */
    seedRandom(min, max) {
        /* set min and max to default if needed */
        var max = max || 1;
        var min = min || 0;

        /* use only the digits from the 5th position of the sin function */
        var number = Math.sin(this.randomSeedNumber++) * 10000;

        /* Math.abs and use only the fractional part of the number */
        var rnd = number - Math.floor(number);

        /* return the seeded random number */
        return min + rnd * (max - min);
    }

    /**
     * Calculates the grid world number from x and y.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-20)
     * @param xy
     * @param x_rows
     * @returns {*}
     */
    getStateNumber(xy, x_rows) {
        return xy.y * x_rows + xy.x;
    }

    /**
     * Calculates the x and y position from given x, y and grid dimensions.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-20)
     * @param x
     * @param y
     * @param grid
     * @returns {{x: (number|*), y: (number|*)}}
     */
    getXY(x, y, grid, modus) {
        switch (modus) {
            case 0:
                x--;
                break;

            case 1:
                x++;
                break;

            case 2:
                y--;
                break;

            case 3:
                y++;
                break;
        }

        x = x < 0 ? x + 1 : x;
        x = x > grid[0] - 1 ? grid[0] - 1 : x;

        y = y < 0 ? y + 1 : y;
        y = y > grid[1] - 1 ? grid[1] - 1 : y;

        return {
            x: x,
            y: y
        }
    }

    /**
     * Returns the left or right modus number.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-30)
     * @param modus
     * @param right
     * @returns {*}
     */
    getLeftOrRightModus(modus, right) {
        switch (modus) {
            case 0:
                return right ? 2 : 3;
            case 1:
                return right ? 3 : 2;
            case 2:
                return right ? 1 : 0;
            case 3:
                return right ? 0 : 1;
        }

        console.error('Unknown modus.');

        return null;
    }

    /**
     * Calculates the x and y position from given x, y and grid dimensions.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-20)
     * @param x
     * @param y
     * @param grid
     * @returns {{x: (number|*), y: (number|*)}}
     */
    translateGrid(Q) {
        var Q = this.deepCopy(Q);

        for (var number in Q) {
            switch (parseInt(Q[number])) {
                case 0:
                    Q[number] = '←';
                    break;
                case 1:
                    Q[number] = '→';
                    break;
                case 2:
                    Q[number] = '↑';
                    break;
                case 3:
                    Q[number] = '↓';
                    break;
            }
        }

        return Q;
    }

    /**
     * Builds the grid world.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-20)
     * @param width
     * @param height
     * @param reward
     */
    buildGridWorld(width, height, reward) {
        var states = [];
        var grid = [width, height];
        var stateReward = {};

        /* calculate the state reward list */
        for (var x in reward) {
            for (var y in reward[x]) {
                stateReward[this.getStateNumber({x: parseInt(x), y: parseInt(y)}, grid[0])] = reward[x][y];
            }
        }

        /* create states */
        for (var y = 0; y < grid[1]; y++) {
            for (var x = 0 ; x < grid[0]; x++) {
                states[this.getStateNumber({x: x, y: y}, grid[0])] = this.addState();
            }
        }

        /* create state changes */
        for (var y = 0; y < grid[1]; y++) {
            for (var x = 0 ; x < grid[0]; x++) {
                var stateFromNumber    = this.getStateNumber({x: x, y: y}, grid[0]);
                var stateToNumber      = null;
                var stateToNumberRight = null;
                var stateToNumberLeft  = null;

                /* 0: x--; 1: x++; 2: y--; 3: y++ */
                for (var i = 0; i < 4; i++) {
                    /* create action in each direction */
                    var a = this.addAction(states[stateFromNumber]);

                    var T = 1;

                    stateToNumber = this.getStateNumber(this.getXY(x, y, grid, i), grid[0]);

                    if (this.config.splitAction) {
                        stateToNumberRight = this.getStateNumber(this.getXY(x, y, grid, this.getLeftOrRightModus(i, true)), grid[0]);
                        stateToNumberLeft = this.getStateNumber(this.getXY(x, y, grid, this.getLeftOrRightModus(i, false)), grid[0]);

                        T -= stateFromNumber !== stateToNumberRight ? this.config.splitT : 0;
                        T -= stateFromNumber !== stateToNumberLeft ? this.config.splitT : 0;
                    }

                    this.addStateChange(a, states[stateToNumber], T, stateReward[stateToNumber] ? stateReward[stateToNumber] : 0);

                    if (this.config.splitAction) {
                        if (stateFromNumber !== stateToNumberRight) {
                            this.addStateChange(a, states[stateToNumberRight], this.config.splitT, stateReward[stateToNumberRight] ? stateReward[stateToNumberRight] : 0);
                        }

                        if (stateFromNumber !== stateToNumberLeft) {
                            this.addStateChange(a, states[stateToNumberLeft], this.config.splitT, stateReward[stateToNumberLeft] ? stateReward[stateToNumberLeft] : 0);
                        }
                    }
                }
            }
        }
    }
}

/**
 * Reinforcement Learning MDP class
 *
 * @author Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-09-20)
 */
class ReinforcementLearningMDP extends ReinforcementLearningBase {

    static get SUCCESS_CALCULATE_Q() {
        return [new JsTestException(201, 'Calculate Q test'), this];
    }

    /**
     * The constructor of this class.
     * Creates a new environment.
     *
     */
    constructor(config) {
        super();

        this.name = 'ReinforcementLearningMDP';

        /* add config */
        this.config = {
            iterations: 'auto',
            iterationThreshold: 0.001,
            iterationsMax: 100000,
            discountFactor: 0.95,
            useSeededRandom: false,
            useOptimizedRandom: false,
            splitAction: false,
        }

        /* add own config */
        if (config) {
            this.adoptConfig(config);
        }
    }

    /**
     * Do all calculations.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-08-28)
     */
    calculateQ() {

        /* analyse and adopt given arguments */
        this.analyseAndAdoptGivenArguments(...arguments);

        var Q = this.getInitialQ(),
            Q_prev = null,
            counter = 0;

        /* Iterate until a threshold or a iteration number is reached */
        while (true) {

            /* cancel function in auto mode */
            var cancelFunction = function (counter, parameter) {
                if (Q_prev !== null) {
                    if (this.calculateQDifferenceMax(parameter.Q, parameter.Q_prev) < this.config.iterationThreshold) {
                        return true;
                    }
                }

                return false;
            };

            /* cancel if threshold is reached. */
            if (this.cancelIfThresholdIsReached(counter, {Q: Q, Q_prev: Q_prev}, cancelFunction)) {
                break;
            }

            /* Copy last Q values */
            Q_prev = this.deepCopy(Q);

            /* Iterate through all available states */
            for (var s = 0; s < this.statesActionsStatesTR.length; s++) {
                var actionsStatesTR = this.statesActionsStatesTR[s];

                /* Iterate through all available actions */
                for (var a = 0; a < actionsStatesTR.length; a++) {
                    var statesTR = actionsStatesTR[a];
                    Q[s][a] = 0;

                    /* iterate through all target states */
                    for (var sp in statesTR) {
                        var T = statesTR[sp][0];
                        var R = statesTR[sp][1];

                        Q[s][a] += T * (R + this.config.discountFactor * Math.max(...Q_prev[sp]));
                    }
                }
            }

            /* Increase the counter. */
            counter++;
        }

        return Q;
    }
}

/**
 * Reinforcement Q Learning class.
 *
 * @author Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-09-20)
 */
class ReinforcementLearningQLearning extends ReinforcementLearningBase {

    static get SUCCESS_CALCULATE_Q() {
        return [new JsTestException(301, 'Calculate Q test'), this];
    }

    static get SUCCESS_CALCULATE_Q_OPTIMIZED() {
        return [new JsTestException(302, 'Calculate Q test (optimized)'), this];
    }

    static get SUCCESS_CALCULATE_Q_GRID_WORLD() {
        return [new JsTestException(303, 'Calculate Q test (grid world)'), this];
    }

    static get SUCCESS_CALCULATE_Q_GRID_WORLD_OPTIMIZED() {
        return [new JsTestException(304, 'Calculate Q test (grid world optimized)'), this];
    }

    /**
     * The constructor of this class.
     * Creates a new environment.
     *
     */
    constructor(config) {
        super();

        this.name = 'ReinforcementLearningQLearning';

        /* add config */
        this.config = {
            iterations: 'auto',
            iterationThreshold: 0.001,
            iterationsMax: 100000,
            learningRateStart: 0.05,
            learningRateDecay: 0.1,
            discountFactor: 0.95,
            hyperParameter: 0,
            useSeededRandom: false,
            useOptimizedRandom: false,
            splitT: 0
        };

        /* add own config */
        if (config) {
            this.adoptConfig(config);
        }

        this.config.splitAction = this.config.splitT > 0 ? true : false;
    }

    /**
     * Q-Learning: Do all calculations.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-08-28)
     */
    calculateQ() {

        /* analyse and adopt given arguments */
        this.analyseAndAdoptGivenArguments(...arguments);

        var Q = this.getInitialQ(),
            T = this.getInitialT(),
            s = 0,
            counter = 0;

        var N0 = this.getInitialN(0);
        var N1 = this.getInitialN(1);
        var N2 = this.getInitialN(2);

        /* Iterate until a threshold or a iteration number is reached */
        while (true) {

            /* cancel function in auto mode */
            var cancelFunction = function (counter, parameter) {
                alert('Not implemented yet');
                return true;
            };

            /* cancel if threshold is reached. */
            if (this.cancelIfThresholdIsReached(counter, {}, cancelFunction)) {
                break;
            }

            /* get possible actions from current state */
            var actionsStatesTR = this.statesActionsStatesTR[s];

            /* get random action a from current state */
            var a = this.getRandomIndex(N1[s]);

            /* get possible states from current action a */
            var statesTR = actionsStatesTR[a];

            /* get random state s' */
            var sp = this.getRandomIndexByT(T[s][a]);

            /* get reward */
            var R = statesTR[sp][1];

            /* from this.config.learningRateStart to about 0 */
            var learningRate = this.config.learningRateStart / (1 + counter * this.config.learningRateDecay);

            /* max from Q */
            var Q_max = this.calculateQMax(Q[sp], N1[sp]);/*, function (q, n) {
                return q + this.config.hyperParameter / (1 + n);
            });*/

            /* (1 - learningRate) * CURRENT_Q + learningRate * (REWARD + NEXT_MAX_Q) */
            Q[s][a] = (1 - learningRate) * Q[s][a] + learningRate * (R + this.config.discountFactor * Q_max);

            /* count used state-action-state' change */
            N0[s]++;
            N1[s][a]++;
            N2[s][a][sp]++;

            /* Use s' as next state */
            s = sp;

            /* Increase the counter. */
            counter++;
        }

        return Q;
    }

    exploreFunction(QMax, NMax) {
        var K = 1;

        return QMax + K / (1 + NMax);
    }
}

/**
 * Reinforcement factory.
 *
 * @author Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-09-20)
 * @type {{mdp: (function(): ReinforcementLearningMDP), qLearning: (function(): ReinforcementLearningQLearning)}}
 */
var ReinforcementLearning = {

    /**
     * Markov decision process
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-20)
     * @returns {ReinforcementLearningMDP}
     */
    mdp: function () {
        return new ReinforcementLearningMDP();
    },

    /**
     * Q-Learning
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-20)
     * @returns {ReinforcementLearningQLearning}
     */
    qLearning: function (config) {
        return new ReinforcementLearningQLearning(config);
    }
};
