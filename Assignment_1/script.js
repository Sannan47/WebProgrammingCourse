// Get elements
const chooseBtn = document.getElementById('choose-btn');
const saveBtn = document.getElementById('save-btn');
const fileInput = document.getElementById('file-input');
const previewImg = document.getElementById('preview-img');
const slider = document.getElementById('slider');
const sliderLabel = document.getElementById('slider-label');
const resetBtn = document.getElementById('reset');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const historyList = document.getElementById('history-list');
const filterPanel = document.getElementById('filter-panel');

// Filter tabs
const brightnesTab = document.getElementById('brightness-tab');
const saturationTab = document.getElementById('saturation-tab');
const inversionTab = document.getElementById('inversion-tab');
const grayscaleTab = document.getElementById('grayscale-tab');
const sepiaTab = document.getElementById('sepia-tab');
const blurTab = document.getElementById('blur-tab');

// Rotate and flip buttons
const rotateLeft = document.getElementById('rotate-left');
const rotateRight = document.getElementById('rotate-right');
const flipH = document.getElementById('flip-h');
const flipV = document.getElementById('flip-v');

// Filter values
let brightness = 100;
let saturation = 100;
let inversion = 0;
let grayscale = 0;
let sepia = 0;
let blur = 0;
let rotation = 0;
let flipHorizontal = 1;
let flipVertical = 1;

// Current active filter
let currentFilter = 'brightness';

// History system
let history = [];
let currentHistoryIndex = -1;

// Disable filter panel initially
filterPanel.classList.add('disabled');

// Save initial state to history
const saveInitialState = () => {
    const state = {
        brightness: 100,
        saturation: 100,
        inversion: 0,
        grayscale: 0,
        sepia: 0,
        blur: 0,
        rotation: 0,
        flipHorizontal: 1,
        flipVertical: 1,
        action: 'Initial State'
    };
    history = [state];
    currentHistoryIndex = 0;
    updateHistoryPanel();
    updateUndoRedoButtons();
};

// Save state to history
const saveToHistory = (action) => {
    const state = {
        brightness: brightness,
        saturation: saturation,
        inversion: inversion,
        grayscale: grayscale,
        sepia: sepia,
        blur: blur,
        rotation: rotation,
        flipHorizontal: flipHorizontal,
        flipVertical: flipVertical,
        action: action
    };
    
    // Remove all states after current index
    history = history.slice(0, currentHistoryIndex + 1);
    
    // Add new state
    history.push(state);
    currentHistoryIndex = history.length - 1;
    
    updateHistoryPanel();
    updateUndoRedoButtons();
};

// Restore state from history
const restoreState = (state) => {
    brightness = state.brightness;
    saturation = state.saturation;
    inversion = state.inversion;
    grayscale = state.grayscale;
    sepia = state.sepia;
    blur = state.blur;
    rotation = state.rotation;
    flipHorizontal = state.flipHorizontal;
    flipVertical = state.flipVertical;
    
    // Update slider if needed
    if (currentFilter === 'brightness') {
        slider.value = brightness;
        sliderLabel.textContent = `Brightness ${brightness}%`;
    } else if (currentFilter === 'saturation') {
        slider.value = saturation;
        sliderLabel.textContent = `Saturation ${saturation}%`;
    } else if (currentFilter === 'inversion') {
        slider.value = inversion;
        sliderLabel.textContent = `Inversion ${inversion}%`;
    } else if (currentFilter === 'grayscale') {
        slider.value = grayscale;
        sliderLabel.textContent = `Grayscale ${grayscale}%`;
    } else if (currentFilter === 'sepia') {
        slider.value = sepia;
        sliderLabel.textContent = `Sepia ${sepia}%`;
    } else if (currentFilter === 'blur') {
        slider.value = blur;
        sliderLabel.textContent = `Blur ${blur}px`;
    }
    
    applyFilters();
};

// Update history panel UI
const updateHistoryPanel = () => {
    historyList.innerHTML = '';
    
    history.forEach((state, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        if (index === currentHistoryIndex) {
            item.classList.add('active');
        }
        item.textContent = state.action;
        item.addEventListener('click', () => {
            currentHistoryIndex = index;
            restoreState(state);
            updateHistoryPanel();
            updateUndoRedoButtons();
        });
        historyList.appendChild(item);
    });
};

// Update undo/redo button states
const updateUndoRedoButtons = () => {
    undoBtn.disabled = currentHistoryIndex <= 0;
    redoBtn.disabled = currentHistoryIndex >= history.length - 1;
};

// Undo
undoBtn.addEventListener('click', () => {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        restoreState(history[currentHistoryIndex]);
        updateHistoryPanel();
        updateUndoRedoButtons();
    }
});

// Redo
redoBtn.addEventListener('click', () => {
    if (currentHistoryIndex < history.length - 1) {
        currentHistoryIndex++;
        restoreState(history[currentHistoryIndex]);
        updateHistoryPanel();
        updateUndoRedoButtons();
    }
});

// Choose image
chooseBtn.addEventListener('click', () => {
    fileInput.click();
});

// Load image
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            filterPanel.classList.remove('disabled');
            saveInitialState();
        };
        reader.readAsDataURL(file);
    }
});

// Apply filters
const applyFilters = () => {
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px)`;
    previewImg.style.transform = `rotate(${rotation}deg) scaleX(${flipHorizontal}) scaleY(${flipVertical})`;
};

// Update slider value
slider.addEventListener('input', () => {
    const value = slider.value;
    
    if (currentFilter === 'brightness') {
        brightness = value;
        sliderLabel.textContent = `Brightness ${value}%`;
    } else if (currentFilter === 'saturation') {
        saturation = value;
        sliderLabel.textContent = `Saturation ${value}%`;
    } else if (currentFilter === 'inversion') {
        inversion = value;
        sliderLabel.textContent = `Inversion ${value}%`;
    } else if (currentFilter === 'grayscale') {
        grayscale = value;
        sliderLabel.textContent = `Grayscale ${value}%`;
    } else if (currentFilter === 'sepia') {
        sepia = value;
        sliderLabel.textContent = `Sepia ${value}%`;
    } else if (currentFilter === 'blur') {
        blur = value;
        sliderLabel.textContent = `Blur ${value}px`;
    }
    
    applyFilters();
});

// Save to history when slider is released
slider.addEventListener('change', () => {
    const value = slider.value;
    
    if (currentFilter === 'brightness') {
        saveToHistory(`Brightness: ${value}%`);
    } else if (currentFilter === 'saturation') {
        saveToHistory(`Saturation: ${value}%`);
    } else if (currentFilter === 'inversion') {
        saveToHistory(`Inversion: ${value}%`);
    } else if (currentFilter === 'grayscale') {
        saveToHistory(`Grayscale: ${value}%`);
    } else if (currentFilter === 'sepia') {
        saveToHistory(`Sepia: ${value}%`);
    } else if (currentFilter === 'blur') {
        saveToHistory(`Blur: ${value}px`);
    }
});

// Tab switching
const switchTab = (filter) => {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.classList.remove('active');
    });
    
    currentFilter = filter;
    
    // Set slider value and label
    if (filter === 'brightness') {
        brightnesTab.classList.add('active');
        slider.value = brightness;
        sliderLabel.textContent = `Brightness ${brightness}%`;
    } else if (filter === 'saturation') {
        saturationTab.classList.add('active');
        slider.value = saturation;
        sliderLabel.textContent = `Saturation ${saturation}%`;
    } else if (filter === 'inversion') {
        inversionTab.classList.add('active');
        slider.value = inversion;
        sliderLabel.textContent = `Inversion ${inversion}%`;
    } else if (filter === 'grayscale') {
        grayscaleTab.classList.add('active');
        slider.value = grayscale;
        sliderLabel.textContent = `Grayscale ${grayscale}%`;
    } else if (filter === 'sepia') {
        sepiaTab.classList.add('active');
        slider.value = sepia;
        sliderLabel.textContent = `Sepia ${sepia}%`;
    } else if (filter === 'blur') {
        blurTab.classList.add('active');
        slider.min = 0;
        slider.max = 30;
        slider.value = blur;
        sliderLabel.textContent = `Blur ${blur}px`;
    }
};

brightnesTab.addEventListener('click', () => {
    slider.min = 0;
    slider.max = 200;
    switchTab('brightness');
});

saturationTab.addEventListener('click', () => {
    slider.min = 0;
    slider.max = 200;
    switchTab('saturation');
});

inversionTab.addEventListener('click', () => {
    slider.min = 0;
    slider.max = 200;
    switchTab('inversion');
});

grayscaleTab.addEventListener('click', () => {
    slider.min = 0;
    slider.max = 200;
    switchTab('grayscale');
});

sepiaTab.addEventListener('click', () => {
    slider.min = 0;
    slider.max = 200;
    switchTab('sepia');
});

blurTab.addEventListener('click', () => {
    switchTab('blur');
});

// Rotate and flip
rotateLeft.addEventListener('click', () => {
    rotation -= 45;
    applyFilters();
    saveToHistory('Rotate Left');
});

rotateRight.addEventListener('click', () => {
    rotation += 45;
    applyFilters();
    saveToHistory('Rotate Right');
});

flipH.addEventListener('click', () => {
    flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    applyFilters();
    saveToHistory('Flip Horizontal');
});

flipV.addEventListener('click', () => {
    flipVertical = flipVertical === 1 ? -1 : 1;
    applyFilters();
    saveToHistory('Flip Vertical');
});

// Reset filters
resetBtn.addEventListener('click', () => {
    brightness = 100;
    saturation = 100;
    inversion = 0;
    grayscale = 0;
    sepia = 0;
    blur = 0;
    rotation = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    
    slider.min = 0;
    slider.max = 200;
    slider.value = 100;
    sliderLabel.textContent = 'Brightness 100%';
    currentFilter = 'brightness';
    
    document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.classList.remove('active');
    });
    brightnesTab.classList.add('active');
    
    applyFilters();
    saveToHistory('Reset All Filters');
});

// Save image
saveBtn.addEventListener('click', () => {
    if (!previewImg.src) {
        alert('Please choose an image first!');
        return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement('a');
    link.download = 'edited-image.jpg';
    link.href = canvas.toDataURL();
    link.click();
});

