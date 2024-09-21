# Target: test_url
# This target runs a series of tests using `ts-node` for the provided URLs.
# `ts-node` allows you to execute TypeScript files directly.
test_url:
	# Run the `url_test.ts` script, passing in the GitHub URL for the Cloudinary NPM package.
	@ts-node test/url_test.ts https://github.com/cloudinary/cloudinary_npm
	# Run the `url_test.ts` script for the NPM Express package.
	@ts-node test/url_test.ts https://www.npmjs.com/package/express
	# Run the `url_test.ts` script for the Nodist GitHub repository.
	@ts-node test/url_test.ts https://github.com/nullivex/nodist
	# Run the `url_test.ts` script for the Lodash GitHub repository.
	@ts-node test/url_test.ts https://github.com/lodash/lodash
	# Run the `url_test.ts` script for the Browserify NPM package.
	@ts-node test/url_test.ts https://www.npmjs.com/package/browserify

# Target: testall
# This target triggers the `test_url` target, running all the URL tests at once.
testall:
	# Executes the `test_url` target which runs the tests for all predefined URLs.
	@make test_url

# Target: test
# This target compiles the TypeScript code and then runs the Node.js script with a file input.
# It ensures the code is first transpiled from TypeScript to JavaScript before running.
test:
	# Compile the TypeScript source file `src/index.ts` into JavaScript.
	@ tsc src/index.ts
	# Execute the compiled JavaScript file `src/index.js`, providing a sample URL text file as input.
	@node src/index.js /home/miller/mknotes/ECE/461/Project/__tests__/data/sample_urls.txt

# Target: refresh
# This target cleans up the JavaScript files, removes the `node_modules`, reinstalls all dependencies,
# and ensures the latest version of `axios` is installed.
refresh:
	# Find and remove all JavaScript files recursively (`-type f -name "*.js"`) and delete them.
	@find . -type f -name "*.js" -exec rm -f {} +
	# Delete everything within the `dist` directory, but keep the `dist` folder itself.
	@find dist -mindepth 1 -delete
	# Remove the `node_modules` directory to ensure all dependencies are reinstalled.
	@rm -rf node_modules
	# Install all dependencies listed in the `package.json` file.
	@npm install
	# Install the latest version of the `axios` package, ensuring you're up to date with HTTP requests.
	@npm install axios@latest
	@npm install ts-node@latest
	@npm install typescript@latest
	@npm install @types/node@latest
	@npm install @types/axios@latest
	@npm install jest@latest
	@npm install @types/jest@latest

# Target: clean_js
# This target deletes all JavaScript files and cleans the `dist` directory.
# Similar to part of the `refresh` target, but without reinstalling dependencies.
clean_js:
	# Find and remove all JavaScript files recursively (`-type f -name "*.js"`) and delete them.
	@find . -type f -name "*.js" -exec rm -f {} +
	# Delete everything inside the `dist` directory, but keep the `dist` folder itself.
	@find dist -mindepth 1 -delete
