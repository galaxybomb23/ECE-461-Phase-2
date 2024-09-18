"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBusFactor = getBusFactor;
var github_data_1 = require("./../github_data");
var API_1 = require("./../API");
/**
 * Calculates the Bus Factor of a repository based on the contribution distribution.
 * The Bus Factor represents the minimum number of key contributors required
 * to maintain the project, relative to the total number of contributors.
 *
 * @param {any[]} data - Array containing contributor information from GitHub API.
 * Each element represents a contributor with their commit counts.
 * @returns {number} - The calculated Bus Factor, rounded to the nearest tenth.
 */
function getBusFactor(data) {
    var threshold = 0.95; // Define a threshold for % critical for project maintenance
    // For some reason 0.975 threshold gets the sample numbers ¯\_(ツ)_/¯
    var num_committers = data.length; // Get number of contributors in repo
    var commit_count = (0, github_data_1.getContributionCounts)(data); // Get array of commit counts
    var total_commits = 0; // Start total commits at 0
    for (var i_1 = 0; i_1 < num_committers; i_1++) { // Sum up all commit counts
        total_commits += commit_count[i_1];
    }
    var current_percentage = 0.0; // Start current commit percentage at 0
    var i = 0; // Reset i to 0
    // Get inverse Bus Factor (How many people need to be working to notice no change)
    while (current_percentage < threshold && i < num_committers) { // While threshold not hit and still more committers
        current_percentage += (commit_count[i] / total_commits); // Add each contributor's contribution percentage
        i++; // Move to the next contributor
    }
    var bus_factor = 1 - (i / num_committers); // Calculate Bus Factor from Inverse
    return Math.round(bus_factor * 10) / 10; // Round Bus Factor
}
// Sample Calls
function calculateBusFactor1() {
    return __awaiter(this, void 0, void 0, function () {
        var data, bus_factor, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, API_1.fetchJsonFromApi)((0, github_data_1.getGitHubAPILink)("https://github.com/lodash/lodash", "contributors"))];
                case 1:
                    data = _a.sent();
                    bus_factor = getBusFactor(data);
                    console.log("Bus Factor Lodash: ".concat(bus_factor));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching data:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function calculateBusFactor2() {
    return __awaiter(this, void 0, void 0, function () {
        var data, bus_factor, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, API_1.fetchJsonFromApi)((0, github_data_1.getGitHubAPILink)("https://github.com/cloudinary/cloudinary_npm", "contributors"))];
                case 1:
                    data = _a.sent();
                    bus_factor = getBusFactor(data);
                    console.log("Bus Factor Cloudinary_NPM: ".concat(bus_factor));
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error fetching data:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function calculateBusFactor3() {
    return __awaiter(this, void 0, void 0, function () {
        var data, bus_factor, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, API_1.fetchJsonFromApi)((0, github_data_1.getGitHubAPILink)("https://github.com/nullivex/nodist", "contributors"))];
                case 1:
                    data = _a.sent();
                    bus_factor = getBusFactor(data);
                    console.log("Bus Factor Nodist: ".concat(bus_factor));
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error fetching data:', error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
calculateBusFactor1();
calculateBusFactor2();
calculateBusFactor3();
