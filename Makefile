test_urls:
	@ts-node main.ts sample_url_file.txt

clean_js:
	@find . -type f -name "*.js" | xargs rm -f