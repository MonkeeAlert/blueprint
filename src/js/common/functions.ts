export const FUNCTIONS = {
	/** Create button and put it inside parent node
	 *
	 * @param {HTMLElement} parent parent node
	 * @param {string} className classname for created buttn
	 * @param {string} html button's html
	 * @param {Function} cb button's action
	 */

	createButton: (
		parent: HTMLElement,
		className: string,
		html: string,
		cb: () => void
	) => {
		let btn = document.createElement('button');
		btn.className = ['blueprint__btn', className.split(' ')].join(' ');
		btn.innerHTML = html;
		btn.addEventListener('click', cb);
		parent.appendChild(btn);

		return btn;
	},

	/** Check if target is descendant of supposed element
	 *
	 * @param {HTMLElement} target checked element
	 * @param {HTMLElement} parent supposed parent
	 */

	isDescendant: (target: any, parent: HTMLElement) => {
		let isChild = false;

		if (target.id === parent.id) isChild = true;

		while ((target = target.parentNode)) {
			if (target.id === parent.id) isChild = true;
		}

		return isChild;
	},

	calculateOrigin: (origin: number[], scaleIndex: number) => {
		return origin && origin.length > 0
			? origin.map((i) => i * scaleIndex + 'px').join(' ')
			: '50% 50%';
	},
};
