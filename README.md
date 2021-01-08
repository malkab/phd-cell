# Implementing a New Gridding Task

First, create a new entry at **libcellbackend/griddertasks/egriddertasktype** with a proper name describing the method.

Then, implement the gridder task code in a new file at **libcellbackend/griddertasks**. Take an existing one as model.

Create a test at **libcellbackend/test/gridder_tasks**.

Create a set of config files for the **cellutilities** scripts at **cellutilities/assets** for the three CLI commands.

Create a set of tests for the three CLI commands at **cellutilities/tests**.

Store the new commands/configs at **Dropbox/scientific/2020-12-21-libcellbackend_cli_commands**.s
