let skinViewer = null;
let currentSkinCanvas = document.getElementById('skin-2d-canvas');
let skinCtx = currentSkinCanvas.getContext('2d');
let isDrawing = false;
let hasGlasses = false;

// Initialize 3D Viewer
function initSkinViewer() {
    const skinViewerElement = document.getElementById('skin-viewer-3d');
    skinViewer = new skinview3d.SkinViewer({
        canvas: skinViewerElement,
        width: 300,
        height: 400,
        skin: "img/steve.png" // Placeholder
    });
    
    // Add default Steve skin to 2D canvas
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "https://minecraft.wiki/images/Steve.png";
    img.onload = () => {
        skinCtx.imageSmoothingEnabled = false;
        skinCtx.drawImage(img, 0, 0, 64, 64);
        skinViewer.loadSkin(img.src);
    };
}

// 2D Editor Logic
currentSkinCanvas.addEventListener('mousedown', () => isDrawing = true);
currentSkinCanvas.addEventListener('mouseup', () => isDrawing = false);
currentSkinCanvas.addEventListener('mouseleave', () => isDrawing = false);

currentSkinCanvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    applyColorToCanvas(e);
});

currentSkinCanvas.addEventListener('click', (e) => {
    applyColorToCanvas(e);
});

function applyColorToCanvas(e) {
    const rect = currentSkinCanvas.getBoundingClientRect();
    const scaleX = currentSkinCanvas.width / rect.width;
    const scaleY = currentSkinCanvas.height / rect.height;
    
    // Calculate 4x4 block pixel (since standard skin canvas is 64x64 and we render at 256x256)
    // But we set canvas to 64x64 in HTML, so coordinates are 1:1
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    
    const color = document.getElementById('skin-color-picker').value;
    
    // Paint a 2x2 area for better visibility on head region (e.g., 8,8 to 16,16)
    skinCtx.fillStyle = color;
    skinCtx.fillRect(x, y, 2, 2);
    
    // Update 3D Model
    update3DModel();
}

function update3DModel() {
    // Convert canvas to data URL and load into 3D viewer
    const dataUrl = currentSkinCanvas.toDataURL();
    skinViewer.loadSkin(dataUrl);
}

// Upload Skin
document.getElementById('skin-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            skinCtx.clearRect(0, 0, 64, 64);
            skinCtx.drawImage(img, 0, 0, 64, 64);
            update3DModel();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Add Glasses Accessory
document.getElementById('add-glasses').addEventListener('click', () => {
    hasGlasses = true;
    // Draw basic glasses on the face (Face starts at x=8, y=8, size 8x8)
    skinCtx.fillStyle = '#000000';
    // Left lens
    skinCtx.fillRect(10, 10, 2, 2);
    // Right lens
    skinCtx.fillRect(13, 10, 2, 2);
    // Bridge
    skinCtx.fillRect(12, 10, 1, 1);
    
    update3DModel();
});

// Clear Accessory / Repaint face area roughly
document.getElementById('clear-accessory').addEventListener('click', () => {
    // Just reload the original steve face area as a reset
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "https://minecraft.wiki/images/Steve.png";
    img.onload = () => {
        // Copy just the face region back from original image
        skinCtx.drawImage(img, 8, 8, 8, 8, 8, 8, 8, 8);
        update3DModel();
    };
});

// Download Skin
document.getElementById('download-skin-btn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'custom_skin.png';
    link.href = currentSkinCanvas.toDataURL();
    link.click();
});

// Initialize on load
document.addEventListener('DOMContentLoaded', initSkinViewer);
