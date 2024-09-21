test_url:
	@ts-node test/url_test.ts https://github.com/cloudinary/cloudinary_npm
	@ts-node test/url_test.ts https://www.npmjs.com/package/express
	@ts-node test/url_test.ts https://github.com/nullivex/nodist
	@ts-node test/url_test.ts https://github.com/lodash/lodash
	@ts-node test/url_test.ts https://www.npmjs.com/package/browserify

testall:
	@make test_url

test:
	@ tsc src/index.ts && node src/index.js /home/miller/mknotes/ECE/461/Project/__tests__/data/sample_urls.txt

refresh:
	@find . -type f -name "*.js" -exec rm -f {} +
	@find dist -mindepth 1 -delete
	@rm -rf node_modules
	@npm install
	@npm install axios@latest

clean_js:
	@find . -type f -name "*.js" -exec rm -f {} +
	@find dist -mindepth 1 -delete