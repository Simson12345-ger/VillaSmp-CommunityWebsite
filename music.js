let uploadedAudioFile = null;

document.getElementById('music-upload').addEventListener('change', (e) => {
    uploadedAudioFile = e.target.files[0];
    if (uploadedAudioFile) {
        alert(`Loaded: ${uploadedAudioFile.name}`);
    }
});

document.getElementById('generate-pack-btn').addEventListener('click', async () => {
    if (!uploadedAudioFile) {
        alert("Please upload an audio file first!");
        return;
    }

    const discName = document.getElementById('disc-select').value;
    
    // Show loading state
    const btn = document.getElementById('generate-pack-btn');
    btn.textContent = "Generating Pack...";
    btn.disabled = true;

    try {
        const zip = new JSZip();
        
        // 1. Add pack.mcmeta
        const packMcmeta = {
            "pack": {
                "pack_format": 1,
                "description": "Custom Music Pack by Villa Tools"
            }
        };
        zip.file("pack.mcmeta", JSON.stringify(packMcmeta, null, 2));
        
        // 2. Add the audio file to the correct 1.8.8 path
        // Path: assets/minecraft/sounds/records/[disc].ogg
        const audioPath = `assets/minecraft/sounds/records/${discName}.ogg`;
        
        // Read file as arraybuffer and add to zip
        const arrayBuffer = await uploadedAudioFile.arrayBuffer();
        zip.file(audioPath, arrayBuffer);
        
        // 3. Generate the ZIP
        const content = await zip.generateAsync({type: "blob"});
        
        // 4. Trigger download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `Villa_Tools_Music_${discName}.zip`;
        link.click();
        
        alert("Resource Pack generated successfully!");
    } catch (error) {
        alert("Error generating pack: " + error.message);
    } finally {
        btn.textContent = "Generate Resource Pack";
        btn.disabled = false;
    }
});
