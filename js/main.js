// See the following on using objects as key/value dictionaries
// https://stackoverflow.com/questions/1208222/how-to-do-associative-array-hashing-in-javascript
var words = {};
words["+"] = add;
words["-"] = sub;
words["*"] = mult;
words["/"] = div;
words["nip"] = nip;
words["swap"] = swap;
words["over"] = over;
words["<"] = lessThan;
words[">"] = greaterThan;
words["="] = equal;
words[".s"] = dotS;
words["dup"] = dup;

// Stack Class
function Stack () {
    this.elements = [];
}

Stack.prototype.pop = function() { return this.elements.pop();};
Stack.prototype.push = function(item) {this.elements.push(item);};
Stack.prototype.getElements = function() {return this.elements;};

// ObservableStack class
function ObservableStack() {
    Stack.apply(this, arguments);
    this.observers = [render];
}

ObservableStack.prototype = new Stack();
ObservableStack.prototype.pop = function() {
    a = this.elements.pop();
    this.registerObserver(); 
    return a;
};
ObservableStack.prototype.push = function(item) {
    this.elements.push(item);
    this.registerObserver();
};
ObservableStack.prototype.subscribe = function(fn) {this.observers.push(fn);};
ObservableStack.prototype.registerObserver = function() {
    for (var i = 0; i < this.observers.length; i++) {
       this.observers[i](this);
    }
}

function render(stack){
    renderStack(stack);
}

/**
 * Print a string out to the terminal, and update its scroll to the
 * bottom of the screen. You should call this so the screen is
 * properly scrolled.
 * @param {Terminal} terminal - The `terminal` object to write to
 * @param {string}   msg      - The message to print to the terminal
 */
function print(terminal, msg) {
    terminal.print(msg);
    $("#terminal").scrollTop($('#terminal')[0].scrollHeight + 40);
}


/** 
 * Sync up the HTML with the stack in memory
 * @param {Array[Number]} The stack to render
 */
function renderStack(stack) {
    $("#thestack").empty();
    stack.getElements().slice().reverse().forEach(function(element) {
        $("#thestack").append("<tr><td>" + element + "</td></tr>");
    });
};

function dotS(stack, terminal) {
    print(terminal, " <" + stack.getElements().length + "> " + stack.getElements().slice().join(" "));
    return;
}

function add(stack, terminal) {
    var first = stack.pop();
    var second = stack.pop();
    stack.push(first+second);
    return;
}

function sub(stack, terminal) {
    var first = stack.pop();
    var second = stack.pop();
    stack.push(second-first);
    return;
}

function mult(stack, terminal) {
    var first = stack.pop();
    var second = stack.pop();
    stack.push(first*second);
    return;
}

function div(stack, terminal) {
    var first = stack.pop();
    var second = stack.pop();
    stack.push(first/second);
    return;
}

function swap(stack, terminal) {
    var first = stack.pop();
    var second = stack.pop();
    stack.push(first);
    stack.push(second);
    return;
}

function dup(stack, terminal) {
    var first = stack.pop();
    stack.push(first);
    stack.push(first);
    return;
}

function nip(stack, terminal) {
    swap(stack);
    stack.pop();
    return;
}

function dup(stack, terminal) {
    var a = stack.pop();
    stack.push(a);
    stack.push(a);
    return;
}

function over(stack, terminal) {
    var first = stack.pop();
    var second = stack.pop();
    stack.push(first);
    stack.push(second);
    stack.push(first);
    return;
}

function greaterThan(stack, terminal) {
    var first = stack.pop();
    var second = stack.pop();
    if (second > first) {
        stack.push(-1)
    }
    else {
        stack.push(0)
    }
    return;
}

function lessThan(stack, terminal) {
    var first = stack.pop();
    var second = stack.pop();
    if (second < first) {
        stack.push(-1)
    }
    else {
        stack.push(0)
    }
    return;
}

function equal(stack, terminal) {
    var first = stack.pop();
    var second = stack.pop();
    if (second === first) {
        stack.push(-1)
    }
    else {
        stack.push(0)
    }
    return;
}

/** 
 * Process a user input, update the stack accordingly, write a
 * response out to some terminal.
 * @param {Array[Number]} stack - The stack to work on
 * @param {string} input - The string the user typed
 * @param {Terminal} terminal - The terminal object
 */

 
function process(stack, input, terminal) {
    // The user typed a number
    if (!(isNaN(Number(input)))) {
        print(terminal,"pushing " + Number(input));
        stack.push(Number(input));
    } 
    else if (input in words) {
        if (words[input] instanceof Array) {
            var commands = words[input].slice();
            var cmd = 0;
            while (cmd < commands.length) {
                if (commands[cmd] === "if") {
                    var ifplace = cmd;
                    var numif = 1;
                    var numelse = 0;
                    cmd++;                    
                    var ifcmd = [];
                    var elsecmd = [];
                    while (numif != numelse) {
                        if (commands[cmd] === "if") {
                            numif++;
                        }
                        if (commands[cmd] === "else") {
                            numelse++;
                        }
                        ifcmd.push(commands[cmd]);
                        cmd++;
                    }
                    ifcmd.pop() // get rid of that else that was pushed
                    while (commands[cmd] != "end") {
                        elsecmd.push(commands[cmd]);
                        cmd++;
                    }
                    var endplace = cmd;
                    cmd++;
                    var top = stack.pop();
                    if (top === 0) {
                        words[input+"else"] = elsecmd;
                        process(stack, input+"else", terminal);
                    }
                    else {
                        words[input+"if"] = ifcmd;
                        process(stack, input+"if", terminal)
                    }
                    var beforeif = commands.slice(ifplace);
                    var afterend = commands.slice(endplace, words[input].length);
                    commands = beforeif.concat(afterend);
                }
                else {
                process(stack, words[input][cmd], terminal);
                }
                cmd++;
            }
        }
        else {
            words[input](stack, terminal);
        }
    }
    else {
        print(terminal, ":-( Unrecognized input: " + String(input));
    }
    //renderStack(stack);
};

function processif(stack, input, terminal) {
    var test = stack.pop();
    if (test === -1) {
        for (cmd in words[input+"if"]) {
            process(stack, words[input+"if"][cmd], terminal);
        }
    }
    else {
        for (cmd in words[input+"else"]) {
            process(stack, words[input+"else"][cmd], terminal);
        }
    }
}


function runRepl(terminal, stack) {
    terminal.input("Type a forth command:", function(line) {
        print(terminal, "User typed in: " + line);
        //https://stackoverflow.com/questions/1418050/string-strip-for-javascript
        var commands = line.trim().split(/ +/);
        var i = 0;
        while (i < commands.length) {
            if (commands[i] === ":") {
                var UDfunc = [];
                i++;
                var funckey = commands[i];
                i++;
                while(commands[i] != ";") {
                    UDfunc.push(commands[i]);  
                    i++;
                    }
                words[funckey] = UDfunc;
                var div = document.getElementById('buttons go here');
                var btn = document.createElement('button');
                var txt = document.createTextNode(funckey);

                btn.appendChild(txt);
                btn.setAttribute('type', 'button');
                btn.setAttribute('id', 'button ' + funckey)
                btn.onclick = function execute() {
                    process(stack, btn.childNodes[0].textContent, terminal)
                };
                div.appendChild(btn);

            }
            else {
                process(stack, commands[i], terminal);
            }
            i++;
        }
        runRepl(terminal, stack);
    });
};

// Whenever the page is finished loading, call this function. 
// See: https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function() {
    var terminal = new Terminal();
    terminal.setHeight("400px");
    terminal.blinkingCursor(true);
    
    // Find the "terminal" object and change it to add the HTML that
    // represents the terminal to the end of it.
    $("#terminal").append(terminal.html);

    var stack = new ObservableStack;

    print(terminal, "Welcome to HaverForth! v0.1");
    print(terminal, "As you type, the stack (on the right) will be kept in sync");


    //https://api.jquery.com/click/
    var resetButton = $("#reset");
    resetButton.click(function emptyStack() {
    // Clearing the stack
    while (stack.getElements().length != 0) {
        stack.pop();
    }
    renderStack(stack);
});

    runRepl(terminal, stack);
});
