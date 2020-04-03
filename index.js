import Dodgy from 'dodgy';

class DiscardSignal {}

export default () => {
	let lastPromise = null;
	return (promise) => {
		lastPromise?.abort();
		lastPromise = new Dodgy((resolve, reject, onAbort) => {
			promise.then(resolve, reject);
			onAbort(() => {
				return new DiscardSignal();
			});
		});
		return lastPromise;
	};
};

export { DiscardSignal };
