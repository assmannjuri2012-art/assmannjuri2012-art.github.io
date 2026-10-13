// Screenshot lightbox: click a picture to enlarge, arrows / swipe to browse, Esc to close.
(function () {
	const buttons = Array.from(document.querySelectorAll('.gallery button'));
	const box = document.querySelector('.lightbox');
	if (!box || buttons.length === 0) {
		return;
	}
	const img = box.querySelector('img');
	const caption = box.querySelector('figcaption');
	let index = 0;
	let lastFocus = null;

	function show(i) {
		index = (i + buttons.length) % buttons.length;
		const b = buttons[index];
		img.src = b.dataset.full;
		img.alt = b.querySelector('img').alt;
		caption.textContent = b.querySelector('img').alt;
	}
	function open(i) {
		lastFocus = document.activeElement;
		show(i);
		box.classList.add('open');
		box.querySelector('.close').focus();
		document.body.style.overflow = 'hidden';
	}
	function close() {
		box.classList.remove('open');
		document.body.style.overflow = '';
		if (lastFocus) {
			lastFocus.focus();
		}
	}
	buttons.forEach((b, i) => b.addEventListener('click', () => open(i)));
	box.querySelector('.prev').addEventListener('click', () => show(index - 1));
	box.querySelector('.next').addEventListener('click', () => show(index + 1));
	box.querySelector('.close').addEventListener('click', close);
	box.addEventListener('click', (e) => {
		if (e.target === box) {
			close();
		}
	});
	document.addEventListener('keydown', (e) => {
		if (!box.classList.contains('open')) {
			return;
		}
		if (e.key === 'Escape') {
			close();
		} else if (e.key === 'ArrowLeft') {
			show(index - 1);
		} else if (e.key === 'ArrowRight') {
			show(index + 1);
		}
	});
	let touchX = null;
	box.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
	box.addEventListener('touchend', (e) => {
		if (touchX === null) {
			return;
		}
		const dx = e.changedTouches[0].clientX - touchX;
		if (Math.abs(dx) > 50) {
			show(index + (dx < 0 ? 1 : -1));
		}
		touchX = null;
	});
}());
