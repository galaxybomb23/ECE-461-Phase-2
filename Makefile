test_url:
	@ts-node test/url_test.ts https://github.com/cloudinary/cloudinary_npm
	@ts-node test/url_test.ts https://www.npmjs.com/package/express
	@ts-node test/url_test.ts https://github.com/nullivex/nodist
	@ts-node test/url_test.ts https://github.com/lodash/lodash
	@ts-node test/url_test.ts https://www.npmjs.com/package/browserify

testall:
	@make test_url

clean_js:
	@find . -type f -name "*.js" -exec rm -f {} +
	@find dist -mindepth 1 -delete