export function initMenu() {
    const menuButtons = document.querySelectorAll('.menu-item');
    const allSections = document.querySelectorAll('.content-section');

    menuButtons.forEach(btn => {
        btn.addEventListener('click', () => {

            menuButtons.forEach(b => b.classList.remove('active'));
            allSections.forEach(section =>
                section.classList.remove('active')
            );

            btn.classList.add('active');

            const targetSection = document.getElementById(btn.dataset.section);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}