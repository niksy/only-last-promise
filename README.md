# only-last-promise

[![Build Status][ci-img]][ci]
[![BrowserStack Status][browserstack-img]][browserstack]

Resolve or reject only last Promise.

Useful if you want to "abort" already running async operations started with
debounced input event.

## Install

```sh
npm install only-last-promise --save
```

## Usage

When calling the wrapper function multiple times, only the last returned
`Promise` will resolve or reject and all other `Promise`s will be aborted with
`DiscardSignal` error.

```js
import onlyLastPromise, { DiscardSignal } from 'only-last-promise';

const wrapper = onlyLastPromise();

async function main() {
	try {
		return await wrapper(fetch('/becky'));
	} catch (error) {
		if (!(error instanceof DiscardSignal)) {
			throw error;
		}
	}
}
```

## API

### onlyLastPromise()

Returns: `Function`

Factory function which returns wrapper function.

#### wrapper(promise)

Type: `Function`

##### promise

Type: `Promise`

`Promise` to handle.

## Browser support

Tested in IE9+ and all modern browsers.

## Test

For automated tests, run `npm run test:automated` (append `:watch` for watcher
support).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

<!-- prettier-ignore-start -->

[ci]: https://travis-ci.com/niksy/only-last-promise
[ci-img]: https://travis-ci.com/niksy/only-last-promise.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://www.browserstack.com/automate/badge.svg?badge_key=bktwN1F3c2UwZThjaVBTOFpFSUZCR3FFTDNUeVh1Z0Y1UzVwQ081R1BNTT0tLVpPcEJMNk5hUzRDUGRjU1pWOE1leUE9PQ==--0bba593c68b36b11cece1050c8cc28f514218c64

<!-- prettier-ignore-end -->
