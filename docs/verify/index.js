window.onload = function() {
    var canvas = document.getElementById('verification-canvas');
    var ctx = canvas.getContext('2d');

    // Function to generate a random code
    function generateRandomCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // Generate a random code
    const code = generateRandomCode(6); // Adjust the length as needed

    // Set canvas background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.fillStyle = '#333';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw the random code on canvas
    ctx.fillText(code, canvas.width / 2, canvas.height / 2);

    // Ensure the toggle button only affects the verification context
    var toggleButton = document.getElementById('toggle-verification-info');
    var hiddenSection = document.getElementById('verification-info');
    var inputField = document.getElementById('verification-code');

    if (toggleButton && hiddenSection && inputField) {
        toggleButton.addEventListener('click', function() {
            // Check if the entered code matches the generated random code
            if (inputField.value === code) {
                hiddenSection.classList.toggle('hidden');
            } else {
                alert('The code must match the displayed code to toggle the section.');
            }
        });
    }
};
