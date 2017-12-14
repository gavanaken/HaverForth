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
    stack.slice().reverse().forEach(function(element) {
        $("#thestack").append("<tr><td>" + element + "</td></tr>");
    });
};

function dotS(stack, terminal) {
    print(terminal, " <" + stack.length + "> " + stack.slice().join(" "));
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
    stack.push(first-second);
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
    } else if (input in words) {
        if (words[input] instanceof Array) {
            for (cmd in words[input]) {
                process(stack, words[input][cmd], terminal)
            }
        } else {
        words[input](stack, terminal);
        }
    } else {
        print(terminal, ":-( Unrecognized input");
    }
    renderStack(stack);
};


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
                    UDfunc.push(commands[i]);  // still need to put this somewhere and process them
                    i++;
                }
                words[funckey] = UDfunc;
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

    var stack = [];

    print(terminal, "Welcome to HaverForth! v0.1");
    print(terminal, "As you type, the stack (on the right) will be kept in sync");


    //https://api.jquery.com/click/
    var resetButton = $("#reset");
    resetButton.click(function emptyStack() {
    // Clearing the stack
    while (stack.length != 0) {
        stack.pop();
    }
    renderStack(stack);
});
    runRepl(terminal, stack);
});
