(function($) {
    $.fn.terminal = function(files) {
        function runCommand(command) {
            var tokens = command.trim().split(/\s+/);

            var output;

            if (tokens[0] == "cat") {
                output = runCatCommand(tokens);
            } else if (tokens[0] == "ls" && tokens.length == 1) {
                output = runLsCommand();
            } else if (tokens[0] == "clear") {
                $output.html("");
                $prompt.val("");
                return;
            }

            $("<p>").text("> " + command).appendTo($output);
            $("<pre>").text(output || "Error.").appendTo($output);
            $prompt.val("");

            $element.scrollTop($element[0].scrollHeight);
        }

        function runCatCommand(tokens) {
            var output = "";

            for (var i = 1; i < tokens.length; i++) {
                var fileName = tokens[i];

                if (!files[fileName]) {
                    return "File not found: " + fileName;
                }

                output += files[fileName];
            }

            return output;
        }

        function runLsCommand() {
            var fileNames = [];
            for (var fileName in files) {
                fileNames.push(fileName);
            }

            return fileNames.join("\t");
        }

        var $element = this;
        var $inputForm = $element.find("form#terminal-input");
        var $prompt = $inputForm.find("#prompt");
        var $output = $element.find("#terminal-output");

        $inputForm.on("submit", function(event) {
            event.preventDefault();

            runCommand($prompt.val());
        });

        $prompt.on("focus", function() {
            $element.addClass("started");
        });

        $element.on("click", function() {
            $prompt.focus();
        });

        return { runCommand: runCommand };
    }
}(jQuery));
