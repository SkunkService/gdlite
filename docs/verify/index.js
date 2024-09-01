window.onload = function() {
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

    // Initialize verification section
    function initializeVerificationSection() {
        var canvas = document.getElementById('verification-canvas');
        var ctx = canvas.getContext('2d');

        // Generate a random code
        const code = generateRandomCode(6); // Adjust the length as needed

        // Set canvas background to a non-white color
        ctx.fillStyle = '#f0f0f0'; // Light gray background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set text properties
        ctx.fillStyle = '#000'; // Black text for high contrast
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw the random code on canvas
        ctx.fillText(code, canvas.width / 2, canvas.height / 2);

        // Handle button click event
        var sendButton = document.getElementById('send-verification');
        var inputField = document.getElementById('verification-input');

        if (sendButton && inputField) {
            sendButton.addEventListener('click', function() {
                if (inputField.value === code) {
                    alert('Verification code is correct.');
                } else {
                    alert('Incorrect code. Please try again.');
                }
            });
        }
    }

    // Initialize the verification section
    initializeVerificationSection();
};
