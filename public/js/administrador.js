// Navigation Logic
export function navigateToSection(targetId) {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('page-title');

    // Update Sidebar
    navItems.forEach(nav => {
        nav.classList.remove('active');
        if (nav.dataset.target === targetId) {
            nav.classList.add('active');
            const titleText = nav.querySelector('span').textContent;
            pageTitle.textContent = titleText;
        }
    });

    // Update Content
    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(`${targetId}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        setTimeout(() => {
            targetSection.classList.add('active');
        }, 10);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Sidebar Navigation ---
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            navigateToSection(targetId);
        });
    });
});

