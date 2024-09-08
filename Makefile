test_urls:
	@tsc isolate_urls.ts && node isolate_urls.js sample_url_file.txt

clean:
	@rm *.js