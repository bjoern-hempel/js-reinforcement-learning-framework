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
                    if (this.values.likelihood === null) {
                        this.values.likelihood = arguments[i];
                    } else if (this.values.reward === null) {
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
    constructor() {
        this.name = 'ReinforcementLearning';

        this.statesActionsStatesTR = [];

        /* add config */
        this.config = {
            iterations: 'auto',
            iterationThreshold: 0.001,
            iterationsMax: 100000,
            discountFactor: 0.95
        }
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
     * Do all calculations.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-08-28)
     */
    calculateQ() {

        /* analyse and adopt given arguments */
        for (var i = 0; i < arguments.length; i++) {
            switch (typeof(arguments[i])) {

                /* object given */
                case 'object':
                    this.adoptConfig(arguments[i]);
                    break;

                /* number given -> discount factor */
                case 'number':
                    this.config.discountFactor = arguments[i];
                    break;
            }
        }

        var Q = this.getInitialQ();

        var Q_prev = null;

        var counter = 0;

        /* Iterate until a threshold or a iteration number is reached */
        while (true) {

            /* Calculate until threshold is reached */
            if (this.config.iterations === 'auto') {

                /* The maximum iterations are reached */
                if (counter >= this.config.iterationsMax) {
                    break;
                }

                if (Q_prev !== null) {
                    var difference = this.calculateQDifferenceMax(Q, Q_prev);

                    /* Cancel the calculation if the difference between Q and Q_prev is lower than iterationThreshold */
                    if (difference < this.config.iterationThreshold) {
                        break;
                    }
                }

            /* Iteration number was given */
            } else {

                /* Wanted iterations reached */
                if (counter >= this.config.iterations) {
                    break;
                }
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

    /**
     * Prints a table with all results.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-13)
     * @param object
     */
    printTable(Q) {

        /* Nothing to to, if we do not have any states */
        if (this.statesActionsStatesTR.length <= 0) {
            return;
        }

        var config = this.calculateConfig();
        var table  = this.addTable(document.body, {border: 0, cellspacing: 0, cellpadding: 0});
        var QMax   = this.calculateQMax(Q);
        var tr     = null;

        /* Iterate through all available states */
        for (var s = 0; s < this.statesActionsStatesTR.length; s++) {
            var actionsStatesTR = this.statesActionsStatesTR[s];

            /* add header */
            tr = this.addTr(table);
            this.addTdSet(tr, ['S', '', 'a', '', 'S\'', 'T', 'R', '', 'Q'], {style: {
                fontWeight: 'bold',
                textAlign: 'center',
                lineHeight: '40px'
            }});

            tr = this.addTr(table);

            this.addTd(
                tr,
                String('S<sub>%s</sub>').replace(/%s/, s),
                {
                    rowspan: config.state[s].rows
                },
                this.createHtmlElement('div', {
                    style: {
                        margin: '5px',
                        border: '1px solid #000',
                        backgroundColor: '#fff',
                        width: '100px',
                        height: '100px',
                        lineHeight: '100px',
                        borderRadius: '50px',
                        textAlign: 'center',
                        backgroundColor: config.state[s].color
                    }
                })
            );

            /* Iterate through all available actions */
            for (var a = 0; a < actionsStatesTR.length; a++) {
                var statesTR = actionsStatesTR[a];

                tr = a > 0 ? this.addTr(table) : tr;

                this.addTd(tr, this.getArrow(a, actionsStatesTR.length), {rowspan: config.action[s][a].rows, style: {fontSize: '30px'}});
                this.addTd(
                    tr,
                    String('a<sub>%s</sub>').replace(/%s/, a),
                    {
                        rowspan: config.action[s][a].rows
                    },
                    this.createHtmlElement('div', {
                        style: {
                            margin: '5px',
                            border: '1px solid #000',
                            backgroundColor: '#fff',
                            width: '50px',
                            height: '50px',
                            lineHeight: '50px',
                            borderRadius: '15px',
                            backgroundColor: (QMax[s] === a ? 'green' : 'red'),
                            textAlign: 'center'
                        }
                    })
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
                        'S\'<sub>' + sp + '</sub>',
                        {},
                        this.createHtmlElement('div', {
                            style: {
                                margin: '5px',
                                border: '1px solid #000',
                                backgroundColor: '#fff',
                                width: '50px',
                                height: '50px',
                                lineHeight: '50px',
                                borderRadius: '25px',
                                backgroundColor: config.state[sp].color,
                                textAlign: 'center'
                            }
                        })
                    );
                    this.addTd(tr, String('T = %s').replace('%s', String(T)), {style: {textAlign: 'left', padding: '0 15px'}});
                    this.addTd(tr, String('R = %s').replace('%s', String(R)), {style: {textAlign: 'left', padding: '0 15px'}});

                    this.addTd(tr, this.getArrow(spCounter, Object.keys(statesTR).length, true), {style: {fontSize: '30px'}});
                    if (spCounter === 0) {
                        this.addTd(
                            tr,
                            String('Q = %s').replace('%s', String(Math.round(Q[s][a] * 1000) / 1000)),
                            {
                                rowspan: config.action[s][a].rows,
                                style: {
                                    color: QMax[s] === a ? 'green' : 'red',
                                    textAlign: 'left',
                                    padding: '0 15px'
                                }
                            }
                        );
                    }

                    spCounter++;
                }
            }

            tr = this.addTr(table);
            this.addTd(tr, '&nbsp;');
        }
    }

    /**
     * Calculate the QMax.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-13)
     */
    calculateQMax(Q) {
        var QMax = [];

        for (var i = 0; i < Q.length; i++) {
            var max = 0;
            var index = 0;

            for (var j = 0; j < Q[i].length; j++) {
                if (max < Q[i][j]) {
                    max = Q[i][j];

                    index = j;
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

            stateConfig.push({rows: stateRows, color: this.getRandomColor()});
        }

        return {state: stateConfig, action: actionConfig};
    }

    /**
     * Returns a random color.
     *
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
                    element.setAttribute(name, attributes[name]);
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
    addTd(tr, html, attributes, wrapper) {
        var td = document.createElement('td');
        tr.appendChild(td);

        if (wrapper) {
            td.appendChild(wrapper);
        }

        if (html) {
            if (wrapper) {
                wrapper.innerHTML = html;
            } else {
                td.innerHTML = html;
            }
        }

        if (attributes) {
            this.applyAttributes(td, attributes);
        }

        return td;
    }

    /**
     * Like addTd but with a set of addTd's.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-13)
     * @param tr
     * @param set
     * @param attributes
     */
    addTdSet(tr, set, attributes) {
        for (var i = 0; i < set.length; i++) {
            this.addTd(tr, set[i], attributes);
        }
    }

    /**
     * Creates an html element.
     *
     * @author Björn Hempel <bjoern@hempel.li>
     * @version 1.0 (2018-09-15)
     * @param name
     * @param attributes
     * @returns {HTMLElement | HTMLSelectElement | HTMLLegendElement | HTMLTableCaptionElement | HTMLTextAreaElement | HTMLModElement | HTMLHRElement | HTMLOutputElement | HTMLPreElement | HTMLEmbedElement | HTMLCanvasElement | HTMLFrameSetElement | HTMLMarqueeElement | HTMLScriptElement | HTMLInputElement | HTMLUnknownElement | HTMLMetaElement | HTMLStyleElement | HTMLObjectElement | HTMLTemplateElement | HTMLBRElement | HTMLAudioElement | HTMLIFrameElement | HTMLMapElement | HTMLTableElement | HTMLAnchorElement | HTMLMenuElement | HTMLPictureElement | HTMLParagraphElement | HTMLTableDataCellElement | HTMLTableSectionElement | HTMLQuoteElement | HTMLTableHeaderCellElement | HTMLProgressElement | HTMLLIElement | HTMLTableRowElement | HTMLFontElement | HTMLSpanElement | HTMLTableColElement | HTMLOptGroupElement | HTMLDataElement | HTMLDListElement | HTMLFieldSetElement | HTMLSourceElement | HTMLBodyElement | HTMLDirectoryElement | HTMLDivElement | HTMLUListElement | HTMLHtmlElement | HTMLAreaElement | HTMLMeterElement | HTMLAppletElement | HTMLFrameElement | HTMLOptionElement | HTMLImageElement | HTMLLinkElement | HTMLHeadingElement | HTMLSlotElement | HTMLVideoElement | HTMLBaseFontElement | HTMLTitleElement | HTMLButtonElement | HTMLHeadElement | HTMLParamElement | HTMLTrackElement | HTMLOListElement | HTMLDataListElement | HTMLLabelElement | HTMLFormElement | HTMLTimeElement | HTMLBaseElement}
     */
    createHtmlElement(name, attributes) {
        var htmlElement = document.createElement(name);

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
        var template = '<div style="margin: 0 10px; transform: rotate(%sdeg);">→</div>';

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
}
