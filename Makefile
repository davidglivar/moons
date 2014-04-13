TEST_MODE ?= -n

all: clean
	@npm i
	@echo "\nMoving testing libraries into venus ..."
	@cp node_modules/mocha/mocha.js .venus/libraries/mocha.js
	@cp node_modules/expect.js/index.js .venus/libraries/expect.js
	@echo "done."
	@echo "\nCopying better copy of phantomjs into venus ..."
	@rm -rf node_modules/venus/node_modules/phantomjs
	@cp -r node_modules/phantomjs node_modules/venus/node_modules/phantomjs
	@echo "done."

clean:
	@rm -rf node_modules

test:
	@./node_modules/.bin/venus run -t test/ $(TEST_MODE) -c

.PHONY: all clean test
