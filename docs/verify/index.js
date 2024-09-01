window.onload = function() {
    var canvas = document.getElementById('verification-canvas');
    var ctx = canvas.getContext('2d');

    // Set canvas background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.fillStyle = '#333';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text
    ctx.fillText('Verification Code', canvas.width / 2, canvas.height / 2);
};
