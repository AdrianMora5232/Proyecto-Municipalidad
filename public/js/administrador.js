document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            item.classList.add('active');

            // Get target section
            const targetId = item.getAttribute('data-target');

            // Update page title
            const titleText = item.querySelector('span').textContent;
            pageTitle.textContent = titleText;

            // Hide all sections and show the target one
            sections.forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active');
            });

            const targetSection = document.getElementById(`${targetId}-section`);
            if (targetSection) {
                targetSection.style.display = 'block';
                // Small delay to allow display:block to apply before opacity transition if we add one
                setTimeout(() => {
                    targetSection.classList.add('active');
                }, 10);
            }
        });
    });
});
