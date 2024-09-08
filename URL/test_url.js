"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_url = test_url;
var sync_request_1 = require("sync-request");
function test_url(url) {
    try {
        var response = (0, sync_request_1.default)('HEAD', url);
        return response.statusCode >= 200 && response.statusCode < 400;
    }
    catch (error) {
        return false;
    }
}
