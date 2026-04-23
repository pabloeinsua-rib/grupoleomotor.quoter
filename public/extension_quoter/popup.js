document.addEventListener('DOMContentLoaded', () => {
    // Attempt auto-paste from clipboard
    navigator.clipboard.readText().then(text => {
        if (text && text.includes('datosTitulares')) {
            document.getElementById('pdd-data').value = text;
        }
    }).catch(err => console.log('Clipboard permission denied', err));

    document.getElementById('fill-btn').addEventListener('click', () => {
        const dataBox = document.getElementById('pdd-data');
        const statusBox = document.getElementById('status');
        
        try {
            const pddStr = dataBox.value.trim();
            if(!pddStr) throw new Error("Por favor, pega los datos primero.");
            const pdd = JSON.parse(pddStr);

            // Execute script in current tab
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                const currentTab = tabs[0];
                if (!currentTab.url.includes('caixabankpc.com')) {
                    throw new Error("No estás en la web de CaixaBank Consumer Finance.");
                }

                chrome.scripting.executeScript({
                    target: {tabId: currentTab.id},
                    files: ['content.js']
                }, () => {
                    // Send data to content script after injection
                    chrome.tabs.sendMessage(currentTab.id, {action: 'FILL_PDD', data: pdd}, (response) => {
                        if (chrome.runtime.lastError || !response || !response.success) {
                            showStatus("Error al rellenar formulario. ¿Estás en la pantalla correcta?", false);
                        } else {
                            showStatus("¡Formulario rellenado con éxito!", true);
                        }
                    });
                });
            });
        } catch (e) {
            showStatus(e.message, false);
        }
    });

    function showStatus(text, isSuccess) {
        const el = document.getElementById('status');
        el.textContent = text;
        el.className = isSuccess ? 'success' : 'error';
        el.style.display = 'block';
        setTimeout(() => el.style.display = 'none', 5000);
    }
});
