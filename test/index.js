import assert from 'assert';
import fn, { DiscardSignal } from '../index';

before(function() {
	window.fixture.load('/test/fixtures/index.html');
});

after(function() {
	window.fixture.cleanup();
});

it('should use only last Promise', async function() {
	const instance = fn();

	const originalPromise = async () => 'success';

	const wrappedPromise = async (promise) => {
		try {
			return await instance(promise);
		} catch (error) {
			if (error instanceof DiscardSignal) {
				return 'discard';
			}
			throw error;
		}
	};

	const response = await Promise.all([
		wrappedPromise(originalPromise()),
		wrappedPromise(originalPromise()),
		wrappedPromise(originalPromise())
	]);

	assert.deepEqual(response, ['discard', 'discard', 'success']);
});
