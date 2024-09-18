test_url:
	@ts-node test/url_test.ts https://github.com/cloudinary/cloudinary_npm
	@ts-node test/url_test.ts https://www.npmjs.com/package/express
	@ts-node test/url_test.ts https://github.com/nullivex/nodist
	@ts-node test/url_test.ts https://github.com/lodash/lodash
	@ts-node test/url_test.ts https://www.npmjs.com/package/browserify

testall:
	@make test_url

refresh_node:
	@rm -rf node_modules
	@npm install
	@npm install axios@latest
	@npm install ts-node@latest
	@npm install typescript@latest
	@npm install @types/node@latest
	@npm install @types/axios@latest
	@npm install jest@latest
	@npm install @types/jest@latest

clean_js:
	@find . -type f -name "*.js" -exec rm -f {} +
	@find dist -mindepth 1 -delete