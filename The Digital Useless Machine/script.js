const powerButton = document.getElementById('powerButton');
const offSwitch = document.querySelector('.off-switch');
const roboticArm = document.querySelector('.robotic-arm');
const arm = document.querySelector('.arm');

powerButton.addEventListener('click', function() {
    // 1. Disable the button so you can't click it again mid-animation
    powerButton.disabled = true;
    powerButton.textContent = "...";
    powerButton.classList.remove('power-on');

    // 2. Reveal the OFF switch and the robotic arm
    offSwitch.style.opacity = '1';
    roboticArm.style.opacity = '1';

    // 3. Animate the arm extending upwards towards the switch
    // Let's calculate how far the arm needs to grow to reach the OFF switch.
    const machineHeight = document.querySelector('.machine').offsetHeight;
    const targetHeight = machineHeight - 80; // Rough calculation to reach the top
    arm.style.height = targetHeight + 'px';

    // 4. After the arm is extended, simulate the "click" on the OFF switch
    setTimeout(() => {
        offSwitch.style.backgroundColor = '#e74c3c'; // Make the switch look "pressed"
        offSwitch.textContent = "✓";

        // 5. After a pause, reset the entire page dramatically!
        setTimeout(() => {
            document.body.innerHTML = '<h1 class="shutdown">I told you not to touch it.</h1>';
            document.body.style.backgroundColor = 'black';
            document.body.style.color = 'white';
            document.body.style.display = 'flex';
            document.body.style.justifyContent = 'center';
            document.body.style.alignItems = 'center';

            // 6. The ultimate uselessness: reload the page after a moment
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }, 800);
    }, 1000); // This timeout should match the arm's transition time
});