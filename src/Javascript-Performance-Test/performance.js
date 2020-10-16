var header = new Vue({
    el   : '#header',
    data : {
        message : 'Javascript Performance Test'
    }
});

var commonsEditor = new Vue({
    el   : '#commonsEditor',
    data : {
        code : 'function foo(){ \n    return { val : "3" };\n}'
    },
    methods : {
        updateCode : function () {
            this.code = aceCommonsEditor.getValue()
        }
    }
});

var leftTitle = new Vue({
    el   : '#leftTitle',
    data : {
        text     : 'Left:',
        isWinner : false
    }
});

var rightTitle = new Vue({
    el   : '#rightTitle',
    data : {
        text     : 'Right:',
        isWinner : false
    }
});

var leftEditor = new Vue({
    el      : '#leftEditor',
    data    : {
        code     : 'function foo(commons){ \n    Number(commons.val);\n}',
        isWinner : false
    },
    methods : {
        updateCode : function () {
            this.code = aceLeftEditor.getValue()
        }
    }
});

var rightEditor = new Vue({
    el      : '#rightEditor',
    data    : {
        code     : 'function foo(commons){ \n    +commons.val;\n}',
        isWinner : false
    },
    methods : {
        updateCode : function () {
            this.code = aceRightEditor.getValue();
        }
    }
});

var leftEditorWrapper = new Vue({
    el   : '#leftEditorWrapper',
    data : {
        isWinner : false
    }
});

var rightEditorWrapper = new Vue({
    el   : '#rightEditorWrapper',
    data : {
        isWinner : false
    }
});

Number.prototype.toFormatted = function (prefix, suffix, decimals) {
    var decs = this.toString().split('.');
    return (prefix || '') + decs[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (decs[1] ? '.' + decs[1].substr(0, decimals || Infinity) : '') + (suffix || '');
};

var winner = function (el) {
    leftEditorWrapper.isWinner  = false;
    rightEditorWrapper.isWinner = false;
    el.isWinner                 = true;
};

var clear = function () {
    leftTitle.text              = 'Left:';
    rightTitle.text             = 'Right:';
    leftEditorWrapper.isWinner  = false;
    rightEditorWrapper.isWinner = false;
    running.show                = true;

    leftEditor.updateCode();
    rightEditor.updateCode();
    commonsEditor.updateCode();
};

var running = new Vue({
    el   : '#running',
    data : {
        show : false
    }
});

var runTest = function () {

    clear();

    setTimeout(function () {
        var tests   = [leftEditor.code, rightEditor.code];
        var results = [];
        eval('var commons = ' + commonsEditor.code);

        var commonsRes = commons();

        var t, lent, i,
            iterations         = 1000,
            multiplyIterations = true;

        while (multiplyIterations) {
            for (t = 0, lent = tests.length; t < lent; t++) {
                results[t] = Date.now();
                eval('var funToRun =' + tests[t]);
                for (i = 0; i < iterations; i++) {
                    funToRun(commonsRes);
                }
                results[t] = Date.now() - results[t];
                if (results[t] > 1000) multiplyIterations = false;
            }
            if (multiplyIterations) iterations *= 10;
        }

        leftTitle.text  = 'Left: After ' + iterations.toFormatted() + ' iterations, the total time is: ' + results[0].toFormatted(null, ' milliseconds');
        rightTitle.text = 'Right: After ' + iterations.toFormatted() + ' iterations, the total time is: ' + results[1].toFormatted(null, ' milliseconds');

        winner(results[0] > results[1] ? rightEditorWrapper : leftEditorWrapper);
        // removeCursorProgress()
        running.show = false;
    }, 100);
};
