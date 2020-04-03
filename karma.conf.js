'use strict';

const path = require('path');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const nodeBuiltins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const babel = require('rollup-plugin-babel');
const istanbul = require('rollup-plugin-istanbul');
const rollupConfig = require('./rollup.config');

let config;

const local =
	typeof process.env.CI === 'undefined' || process.env.CI === 'false';
const port = process.env.SERVICE_PORT;

if (local) {
	config = {
		browsers: ['Chrome']
	};
} else {
	config = {
		hostname: 'bs-local.com',
		browserStack: {
			username: process.env.BROWSER_STACK_USERNAME,
			accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
			startTunnel: true,
			project: 'only-last-promise',
			name: 'Automated (Karma)',
			build: 'Automated (Karma)'
		},
		customLaunchers: {
			'BS-Chrome': {
				base: 'BrowserStack',
				browser: 'Chrome',
				os: 'Windows',
				'os_version': '7',
				project: 'only-last-promise',
				build: 'Automated (Karma)',
				name: 'Chrome'
			},
			'BS-Firefox': {
				base: 'BrowserStack',
				browser: 'Firefox',
				os: 'Windows',
				'os_version': '7',
				project: 'only-last-promise',
				build: 'Automated (Karma)',
				name: 'Firefox'
			},
			'BS-IE9': {
				base: 'BrowserStack',
				browser: 'IE',
				'browser_version': '9',
				os: 'Windows',
				'os_version': '7',
				project: 'only-last-promise',
				build: 'Automated (Karma)',
				name: 'IE9'
			}
		},
		browsers: ['BS-Chrome', 'BS-Firefox', 'BS-IE9']
	};
}

module.exports = function(baseConfig) {
	baseConfig.set({
		basePath: '',
		frameworks: ['mocha', 'fixture'],
		files: ['test/**/*.html', { pattern: 'test/**/*.js', watched: false }],
		exclude: [],
		preprocessors: {
			'test/**/*.html': ['html2js'],
			'test/**/*.js': ['rollup', 'sourcemap']
		},
		reporters: ['mocha', 'coverage-istanbul'],
		port: port,
		colors: true,
		logLevel: baseConfig.LOG_INFO,
		autoWatch: false,
		client: {
			captureConsole: true
		},
		browserConsoleLogOptions: {
			level: 'log',
			format: '%b %T: %m',
			terminal: true
		},
		rollupPreprocessor: {
			plugins: [
				nodeBuiltins(),
				babel({
					exclude: 'node_modules/**',
					runtimeHelpers: true
				}),
				resolve({
					preferBuiltins: true
				}),
				commonjs(),
				babel({
					include: 'node_modules/{has-flag,supports-color}/**',
					runtimeHelpers: true,
					babelrc: false,
					configFile: path.resolve(__dirname, '.babelrc')
				}),
				globals(),
				...rollupConfig.plugins.filter(
					({ name }) => !['babel'].includes(name)
				),
				istanbul({
					exclude: ['test/**/*.js', 'node_modules/**/*']
				})
			],
			output: {
				format: 'iife',
				name: 'onlyLastPromise',
				sourcemap: baseConfig.autoWatch ? false : 'inline', // Source map support has weird behavior in watch mode
				intro: 'window.TYPED_ARRAY_SUPPORT = false;' // IE9
			}
		},
		coverageIstanbulReporter: {
			dir: path.join(__dirname, 'coverage/%browser%'),
			fixWebpackSourcePaths: true,
			reports: ['html', 'text'],
			thresholds: {
				global: {
					statements: 80
				}
			}
		},
		singleRun: true,
		concurrency: Infinity,
		...config
	});
};
