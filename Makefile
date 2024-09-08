test_urls:
	@tsc main.ts && node main.js sample_url_file.txt

clean:
	@rm **/*.js