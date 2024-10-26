let selectedInverter = {};
let selectedBattery = {};
let selectedPanels = 0;
const accessoryCost = 4000 + 2500 + 4000 + 15000; // Fixed accessory costs

function selectInverter(kva, voltage, price, labour) {
    selectedInverter = { kva, voltage, price, labour };

    // Show battery options and update visuals
    document.getElementById('battery-section').classList.remove('hidden');
    updateBatteryOptions();

    // Highlight selected inverter
    document.querySelectorAll('#inverter-section .option').forEach(option => option.classList.remove('selected'));
    event.currentTarget.classList.add('selected');

    // Hide the summary section if a battery hasn't been selected
    document.getElementById('summary-section').classList.add('hidden');

    // Scroll to the battery section
    const batterySection = document.getElementById('battery-section');
    batterySection.scrollIntoView({ behavior: 'smooth' });
}

function updateBatteryOptions() {
    const batterySection = document.getElementById('battery-section');
    batterySection.innerHTML = `<h2>Select a Battery</h2>`;

    const batteries = [
        { name: 'Tubular 200AH', price: 23500, img: 'images/battery-200ah-tubular.png', specsLink: 'https://pdfupload.io/docs/b178b8c4' },
        { name: 'Maintenance Free KM12 12V 200AH', price: 35500, img: 'images/battery-200ah-mf.png', specsLink: 'https://pdfupload.io/docs/a0b61089' },
        { name: 'Lithium LFP 51.2-100W', price: 125000, img: 'images/battery-100ah-lithium.png', specsLink: 'https://pdfupload.io/docs/e0115faa' }
    ];

    // Determine which batteries to show based on selected inverter
    batteries.forEach(battery => {
        let compatible = false;
        let batteryCount = 0;

        // Logic for 3.6kVA - 24V inverter
        if (selectedInverter.kva === 3.6 && selectedInverter.voltage === 24) {
            if (battery.name === 'Tubular 200AH' || battery.name === 'Maintenance Free KM12 12V 200AH') {
                compatible = true; // Show first two batteries only
                batteryCount = selectedInverter.voltage / 12; // Calculate count for compatible batteries
            }
        }
        
        // Logic for 3.6kVA - 48V inverter
        else if (selectedInverter.kva === 3.6 && selectedInverter.voltage === 48) {
            if (battery.name === 'Lithium LFP 51.2-100W') {
                compatible = true; // Show lithium battery
                batteryCount = 1; // Only 1 lithium battery
            } else if (battery.name === 'Tubular 200AH' || battery.name === 'Maintenance Free KM12 12V 200AH') {
                compatible = true; // Show first two batteries
                batteryCount = selectedInverter.voltage / 12; // Calculate count for compatible batteries
            }
        }

        // Logic for 6.0kVA - 48V inverter
        else if (selectedInverter.kva === 6.0 && selectedInverter.voltage === 48) {
            if (battery.name === 'Lithium LFP 51.2-100W') {
                compatible = true; // Show lithium battery
                batteryCount = 2; // Show 2 lithium batteries
            } else if (battery.name === 'Tubular 200AH' || battery.name === 'Maintenance Free KM12 12V 200AH') {
                compatible = true; // Show first two batteries
                batteryCount = selectedInverter.voltage / 12; // Calculate count for compatible batteries
            }
        }

        // Append compatible batteries to the section
        if (compatible) {
            const div = document.createElement('div');
            div.className = 'option';
            div.onclick = () => selectBattery(battery, batteryCount);

            div.innerHTML = `
                <img src="${battery.img}" alt="${battery.name}">
                <p>${battery.name}</p>
                <p class="view-specs">
                    <a href="${battery.specsLink}" target="_blank">View Specification</a>
                </p>
                <p class="price">Price: ${battery.price} Ksh (x${batteryCount})</p>`; // Add price class here
            
            batterySection.appendChild(div);
        }
    });
}


function selectBattery(battery, count) {
    selectedBattery = battery;
    selectedBattery.count = count;

    // Show panel section and update visuals
    document.getElementById('panel-section').classList.remove('hidden');
    updatePanelRequirement();

    // Highlight selected battery
    document.querySelectorAll('#battery-section .option').forEach(option => option.classList.remove('selected'));
    event.currentTarget.classList.add('selected');

    // Update summary only when both inverter and battery are selected
    updateSummary();

    // Scroll to the panel section
    const panelSection = document.getElementById('panel-section');
    panelSection.scrollIntoView({ behavior: 'smooth' });
}

function updatePanelRequirement() {
    selectedPanels = selectedBattery.count === 2 ? 6 : 10;
    document.getElementById('panel-info').innerHTML = `
        You need ${selectedPanels} solar panels (16,150 Ksh each) - 
        <a href="https://pdfupload.io/docs/c5316a01" target="_blank"> View Specifications</a>`; // Add PDF link here

    // Create panel images
    const panelImagesContainer = document.getElementById('panel-images');
    panelImagesContainer.innerHTML = ''; // Clear previous images

    for (let i = 0; i < selectedPanels; i++) {
        const img = document.createElement('img');
        img.src = 'images/solar-panel.png'; // Path to your solar panel image
        img.alt = 'Solar Panel';
        img.className = 'solar-panel'; // Add a class for styling
        panelImagesContainer.appendChild(img);
    }

    // Show accessory section after panel selection
    document.getElementById('accessory-section').classList.remove('hidden');
}

function updateSummary() {
    const inverterCost = selectedInverter.price;
    const labourCost = selectedInverter.labour;
    const batteryCost = selectedBattery.price * selectedBattery.count;
    const panelCost = selectedPanels * 16150;
    const totalCost = inverterCost + labourCost + batteryCost + panelCost + accessoryCost;

    document.getElementById('summary').innerHTML = `
        <p>Inverter: ${selectedInverter.kva}kVA ${selectedInverter.voltage}V (${inverterCost} Ksh)</p>
        <p>Labour: ${labourCost} Ksh</p>
        <p>Batteries: ${selectedBattery.name} (${batteryCost} Ksh)</p>
        <p>Solar Panels: ${selectedPanels} panels (${panelCost} Ksh)</p>
        <p>Accessories: Included (${accessoryCost} Ksh)</p>`;
    document.getElementById('total-cost').innerText = totalCost;

    // Show the summary section
    document.getElementById('summary-section').classList.remove('hidden');
}

function shareSummary() {
    // Get the summary and total cost as plain text
    const summaryContent = document.getElementById('summary').innerText; // Use innerText instead of innerHTML
    const totalCost = document.getElementById('total-cost').innerText;

    // Create the email subject and body
    const subject = encodeURIComponent("Sangyug Solar Inverter System Summary");
    const body = encodeURIComponent(`Here is my solar inverter system summary:\n\n${summaryContent}\nTotal Cost: ${totalCost} KSH\n\nPlease note: Above quote does not include solar mounting/structure. This final quote can be given after the site survey is done.`);
    
    // Create the mailto link
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    // Open the mailto link in a new tab
    window.open(mailtoLink, '_blank'); // Open in new tab
}
