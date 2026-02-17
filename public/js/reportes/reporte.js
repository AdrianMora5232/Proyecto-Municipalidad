document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('report-form');
    const responseMessage = document.getElementById('response-message');
    const submitBtn = document.getElementById('submit-btn');

    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get values
        const reportData = {
            type: document.getElementById('reportType').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            timestamp: new Date().toISOString(),
            status: 'pendiente'
        };

        // UI Feedback
        submitBtn.disabled = true;
        submitBtn.innerText = 'Enviando...';
        responseMessage.style.display = 'none';

        try {
            // 1. Save to LocalStorage (as requested)
            const reports = JSON.parse(localStorage.getItem('user_reports') || '[]');
            reports.push(reportData);
            localStorage.setItem('user_reports', JSON.stringify(reports));

            // 2. POST to Server
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportData)
            });

            if (response.ok) {
                const result = await response.json();
                showMessage(result.message || 'Reporte enviado con éxito.', 'success');
                reportForm.reset();
            } else {
                const error = await response.json();
                showMessage(error.error || 'Error al enviar el reporte.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error de conexión con el servidor. El reporte se guardó localmente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Enviar Reporte';
        }
    });

    function showMessage(text, type) {
        responseMessage.innerText = text;
        responseMessage.className = type;
        responseMessage.style.display = 'block';

        // Auto hide after 5 seconds
        setTimeout(() => {
            responseMessage.style.display = 'none';
        }, 5000);
    }
});
