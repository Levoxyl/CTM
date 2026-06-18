export function getHtmlForWebview(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: var(--vscode-font-family, sans-serif);
                font-weight: var(--vscode-font-weight, normal);
                font-size: var(--vscode-font-size, 13px);
                padding: 10px;
                color: var(--vscode-foreground, #cccccc); 
            }
            h3 { 
                margin-top: 12px;
                margin-bottom: 8px;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .control-group { 
                display: flex; 
                align-items: center; 
                margin-bottom: 8px; 
                gap: 6px;
                background: var(--vscode-sideBar-background, #252526);
                padding: 4px;
                border-radius: 4px;
                border: 1px solid transparent;
            }
            .control-group:focus-within {
                border-color: var(--vscode-focusBorder, #007acc);
            }
            input[type="color"] {
                --webkit-appearance: none;
                background: transparent;
                border: 1px solid var(--vscode-settings-textInputBorder, #444);
                width: 24px;
                height: 24px;
                cursor: pointer;
                padding: 0;
                box-sizing: border-box;
                vertical-align: middle;
            }
            input[type="color"]::-webkit-color-swatch-wrapper {
                padding: 0;
            }
            input[type="color"]::-webkit-color-swatch {
                border: none;
            }
            .theme-row.is-empty input[type="color"] {
                opacity: 0.3; 
                border: 1px dashed var(--vscode-panel-border, #888);
                filter: grayscale(100%);
            }

            label { flex-grow: 1; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            .hex-text-input {
                width: 55px;
                padding: 2px 4px;
                font-size: 10px;
                border: 1px solid var(--vscode-input-border, #3c3c3c);
                background: var(--vscode-input-background, #1e1e1e);
                color: var(--vscode-input-foreground, #ffffff);
                text-align: center;
                font-family: monospace;
                text-transform: uppercase;
                border-radius: 2px;
            }

            .hex-text-input::placeholder {
                color: var(--vscode-input-placeholderForeground, #888888);
                opacity: 0.8;
            }

            .confirm-btn, .cancel-btn {
                border: none;
                border-radius: 2px;
                cursor: pointer;
                font-size: 10px;
                width: 18px;
                height: 18px;
                display: none; /* Only show when modified */
                align-items: center;
                justify-content: center;
                color: #ffffff !important;
                font-weight: bold;
                padding: 0;
            }
            .confirm-btn { background: #1f8c47; }
            .confirm-btn:hover { background: #2ea75b; }
            .cancel-btn { background: #ce3737; }
            .cancel-btn:hover { background: #e04a4a; }

            .action-button { 
                background: var(--vscode-button-background, #007acc); 
                color: var(--vscode-button-foreground, #ffffff) !important; 
                border: 1px solid var(--vscode-button-border, transparent); 
                padding: 6px; 
                cursor: pointer; 
                width: 100%; 
                font-size: 12px; 
                border-radius: 2px;
                transition: background 0.15s ease, border-color 0.15s ease;
                display: block;
                text-align: center;
                font-weight: 500;
            }
            .action-button:hover { 
                background: var(--vscode-button-hoverBackground, #1188ff); 
            }
            
            .btn-reset-live {
                background: var(--vscode-button-secondaryBackground, #3a3d41);
                color: var(--vscode-button-secondaryForeground, #ffffff) !important;
            }
            .btn-reset-live:hover {
                background: var(--vscode-button-secondaryHoverBackground, #4c5054);
            }

            hr { border: none; border-top: 1px solid var(--vscode-panel-border, #444444); margin: 15px 0; }
            
            .slots-header { display: flex; align-items: center; justify-content: space-between; margin-top: 15px; margin-bottom: 8px; }
            
            .btn-add-slot { 
                background: var(--vscode-button-background, #007acc); 
                color: var(--vscode-button-foreground, #ffffff) !important; 
                border: none; 
                padding: 5px 10px; 
                cursor: pointer; 
                font-size: 11px; 
                font-weight: bold; 
                border-radius: 2px; 
                width: auto;
                display: inline-block;
            }
            .btn-add-slot:hover { background: var(--vscode-button-hoverBackground, #1188ff); }
            .slots-list { display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto; padding-right: 2px; }
            
            .slot-item { 
                display: flex; 
                align-items: center; 
                justify-content: space-between; 
                background: var(--vscode-sideBar-background, #252526); 
                border: 1px solid var(--vscode-panel-border, #444444); 
                border-radius: 4px; 
                position: relative; 
                overflow: hidden;
                transition: background 0.2s ease, transform 0.15s ease, border-color 0.15s ease; 
            }
            .slot-item:hover { 
                background: var(--vscode-list-hoverBackground, #2a2d2e) !important;
                border-color: var(--vscode-focusBorder, #007acc);
                transform: translateY(-1px);
            }
            
            .slot-name { 
                flex-grow: 1; 
                padding: 8px 32px 8px 10px;
                font-size: 12px; 
                text-align: left; 
                overflow: hidden; 
                text-overflow: ellipsis; 
                white-space: nowrap; 
                font-weight: 500; 
                cursor: pointer; 
                position: relative;
                z-index: 2; 
                color: var(--vscode-foreground, #cccccc);
            }
            .slot-item:hover .slot-name {
                color: var(--vscode-textLink-activeForeground, #3794ff) !important;
            }
            
            .btn-delete-slot { 
                background: transparent; 
                border: none; 
                position: absolute; 
                right: 6px; 
                top: 50%; 
                transform: translateY(-50%); 
                cursor: pointer; 
                color: var(--vscode-errorForeground, #d5482c); 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                opacity: 0.5; 
                padding: 4px; 
                border-radius: 2px; 
                width: 24px; 
                height: 24px; 
                z-index: 5;
            }
            .btn-delete-slot:hover { opacity: 1; background: var(--vscode-list-hoverBackground, #2a2d2e); }
            .is-empty input[type="color"] {
                opacity: 0.25; 
                border-style: dashed;
                filter: grayscale(100%);
            }
        </style>
    </head>
    <body>
        <h3 style="color: var(--vscode-textLink-foreground);">1a. Layout Frame Backgrounds</h3>
        <div class="control-group" id="group-activityBar">
            <input type="color" data-scope="activityBar" id="cp-activityBar" oninput="handleNativeColorInput('activityBar', this.value)">
            <input type="text" class="hex-text-input" id="hex-activityBar" maxlength="7" oninput="handleHexTextInput('activityBar', this.value)">
            <label>Left Panel L Background</label>
            <button class="confirm-btn" id="ok-activityBar" title="Commit Color" onclick="commitChange('activityBar')">✓</button>
            <button class="cancel-btn" id="cc-activityBar" title="Revert Changes" onclick="cancelChange('activityBar')">✕</button>
        </div>
        <div class="control-group" id="group-sideBar">
            <input type="color" data-scope="sideBar" id="cp-sideBar" oninput="handleNativeColorInput('sideBar', this.value)">
            <input type="text" class="hex-text-input" id="hex-sideBar" maxlength="7" oninput="handleHexTextInput('sideBar', this.value)">
            <label>Left Panel R Background</label>
            <button class="confirm-btn" id="ok-sideBar" title="Commit Color" onclick="commitChange('sideBar')">✓</button>
            <button class="cancel-btn" id="cc-sideBar" title="Revert Changes" onclick="cancelChange('sideBar')">✕</button>
        </div>
        <div class="control-group" id="group-topPanel">
            <input type="color" data-scope="topPanel" id="cp-topPanel" oninput="handleNativeColorInput('topPanel', this.value)">
            <input type="text" class="hex-text-input" id="hex-topPanel" maxlength="7" oninput="handleHexTextInput('topPanel', this.value)">
            <label>Top Header Background</label>
            <button class="confirm-btn" id="ok-topPanel" title="Commit Color" onclick="commitChange('topPanel')">✓</button>
            <button class="cancel-btn" id="cc-topPanel" title="Revert Changes" onclick="cancelChange('topPanel')">✕</button>
        </div>
        <div class="control-group" id="group-bottomPanel">
            <input type="color" data-scope="bottomPanel" id="cp-bottomPanel" oninput="handleNativeColorInput('bottomPanel', this.value)">
            <input type="text" class="hex-text-input" id="hex-bottomPanel" maxlength="7" oninput="handleHexTextInput('bottomPanel', this.value)">
            <label>Bottom Frame Background</label>
            <button class="confirm-btn" id="ok-bottomPanel" title="Commit Color" onclick="commitChange('bottomPanel')">✓</button>
            <button class="cancel-btn" id="cc-bottomPanel" title="Revert Changes" onclick="cancelChange('bottomPanel')">✕</button>
        </div>
        <div class="control-group" id="group-editorBackground">
            <input type="color" data-scope="editorBackground" id="cp-editorBackground" oninput="handleNativeColorInput('editorBackground', this.value)">
            <input type="text" class="hex-text-input" id="hex-editorBackground" maxlength="7" oninput="handleHexTextInput('editorBackground', this.value)">
            <label>Code Canvas Background</label>
            <button class="confirm-btn" id="ok-editorBackground" title="Commit Color" onclick="commitChange('editorBackground')">✓</button>
            <button class="cancel-btn" id="cc-editorBackground" title="Revert Changes" onclick="cancelChange('editorBackground')">✕</button>
        </div>

        <h3 style="color: var(--vscode-gitDecoration-addedResourceForeground);">1b. Core Interface Typography & Icons</h3>
        <div class="control-group" id="group-uiGeneralText">
            <input type="color" data-scope="uiGeneralText" id="cp-uiGeneralText" oninput="handleNativeColorInput('uiGeneralText', this.value)">
            <input type="text" class="hex-text-input" id="hex-uiGeneralText" maxlength="7" oninput="handleHexTextInput('uiGeneralText', this.value)">
            <label>UI Text, Menus & Gutter Lines</label>
            <button class="confirm-btn" id="ok-uiGeneralText" title="Commit Color" onclick="commitChange('uiGeneralText')">✓</button>
            <button class="cancel-btn" id="cc-uiGeneralText" title="Revert Changes" onclick="cancelChange('uiGeneralText')">✕</button>
        </div>
        <div class="control-group" id="group-uiIconsAndVectors">
            <input type="color" data-scope="uiIconsAndVectors" id="cp-uiIconsAndVectors" oninput="handleNativeColorInput('uiIconsAndVectors', this.value)">
            <input type="text" class="hex-text-input" id="hex-uiIconsAndVectors" maxlength="7" oninput="handleHexTextInput('uiIconsAndVectors', this.value)">
            <label>System Action Icons (SVG)</label>
            <button class="confirm-btn" id="ok-uiIconsAndVectors" title="Commit Color" onclick="commitChange('uiIconsAndVectors')">✓</button>
            <button class="cancel-btn" id="cc-uiIconsAndVectors" title="Revert Changes" onclick="cancelChange('uiIconsAndVectors')">✕</button>
        </div>
        <div class="control-group" id="group-uiLayoutBorders">
            <input type="color" data-scope="uiLayoutBorders" id="cp-uiLayoutBorders" oninput="handleNativeColorInput('uiLayoutBorders', this.value)">
            <input type="text" class="hex-text-input" id="hex-uiLayoutBorders" maxlength="7" oninput="handleHexTextInput('uiLayoutBorders', this.value)">
            <label>Layout Separators & Borders</label>
            <button class="confirm-btn" id="ok-uiLayoutBorders" title="Commit Color" onclick="commitChange('uiLayoutBorders')">✓</button>
            <button class="cancel-btn" id="cc-uiLayoutBorders" title="Revert Changes" onclick="cancelChange('uiLayoutBorders')">✕</button>
        </div>
        <div class="control-group" id="group-uiInteractiveStates">
            <input type="color" data-scope="uiInteractiveStates" id="cp-uiInteractiveStates" oninput="handleNativeColorInput('uiInteractiveStates', this.value)">
            <input type="text" class="hex-text-input" id="hex-uiInteractiveStates" maxlength="7" oninput="handleHexTextInput('uiInteractiveStates', this.value)">
            <label>Selections, Hovers & Menus</label>
            <button class="confirm-btn" id="ok-uiInteractiveStates" title="Commit Color" onclick="commitChange('uiInteractiveStates')">✓</button>
            <button class="cancel-btn" id="cc-uiInteractiveStates" title="Revert Changes" onclick="cancelChange('uiInteractiveStates')">✕</button>
        </div>

        <hr>

        <h3>2. Text Token Colorizer</h3>
        <div class="control-group" id="group-keywords">
            <input type="color" data-scope="keywords" id="cp-keywords" oninput="handleNativeColorInput('keywords', this.value)">
            <input type="text" class="hex-text-input" id="hex-keywords" maxlength="7" oninput="handleHexTextInput('keywords', this.value)">
            <label>Keywords & Storage</label>
            <button class="confirm-btn" id="ok-keywords" title="Commit Color" onclick="commitChange('keywords')">✓</button>
            <button class="cancel-btn" id="cc-keywords" title="Revert Changes" onclick="cancelChange('keywords')">✕</button>
        </div>
        <div class="control-group" id="group-strings">
            <input type="color" data-scope="strings" id="cp-strings" oninput="handleNativeColorInput('strings', this.value)">
            <input type="text" class="hex-text-input" id="hex-strings" maxlength="7" oninput="handleHexTextInput('strings', this.value)">
            <label>Strings</label>
            <button class="confirm-btn" id="ok-strings" title="Commit Color" onclick="commitChange('strings')">✓</button>
            <button class="cancel-btn" id="cc-strings" title="Revert Changes" onclick="cancelChange('strings')">✕</button>
        </div>
        <div class="control-group" id="group-comments">
            <input type="color" data-scope="comments" id="cp-comments" oninput="handleNativeColorInput('comments', this.value)">
            <input type="text" class="hex-text-input" id="hex-comments" maxlength="7" oninput="handleHexTextInput('comments', this.value)">
            <label>Comments</label>
            <button class="confirm-btn" id="ok-comments" title="Commit Color" onclick="commitChange('comments')">✓</button>
            <button class="cancel-btn" id="cc-comments" title="Revert Changes" onclick="cancelChange('comments')">✕</button>
        </div>
        <div class="control-group" id="group-punctuation">
            <input type="color" data-scope="punctuation" id="cp-punctuation" oninput="handleNativeColorInput('punctuation', this.value)">
            <input type="text" class="hex-text-input" id="hex-punctuation" maxlength="7" oninput="handleHexTextInput('punctuation', this.value)">
            <label>Punctuation & Operators</label>
            <button class="confirm-btn" id="ok-punctuation" title="Commit Color" onclick="commitChange('punctuation')">✓</button>
            <button class="cancel-btn" id="cc-punctuation" title="Revert Changes" onclick="cancelChange('punctuation')">✕</button>
        </div>
        <div class="control-group" id="group-functions">
            <input type="color" data-scope="functions" id="cp-functions" oninput="handleNativeColorInput('functions', this.value)">
            <input type="text" class="hex-text-input" id="hex-functions" maxlength="7" oninput="handleHexTextInput('functions', this.value)">
            <label>Functions & Types</label>
            <button class="confirm-btn" id="ok-functions" title="Commit Color" onclick="commitChange('functions')">✓</button>
            <button class="cancel-btn" id="cc-functions" title="Revert Changes" onclick="cancelChange('functions')">✕</button>
        </div>
        <div class="control-group" id="group-variables">
            <input type="color" data-scope="variables" id="cp-variables" oninput="handleNativeColorInput('variables', this.value)">
            <input type="text" class="hex-text-input" id="hex-variables" maxlength="7" oninput="handleHexTextInput('variables', this.value)">
            <label>Variables, Props & Values</label>
            <button class="confirm-btn" id="ok-variables" title="Commit Color" onclick="commitChange('variables')">✓</button>
            <button class="cancel-btn" id="cc-variables" title="Revert Changes" onclick="cancelChange('variables')">✕</button>
        </div>

        <hr>

        <div style="margin-bottom: 15px;">
            <button class="action-button btn-reset-live" onclick="send('reset')">Reset Live Colors</button>
        </div>

        <hr>
        <div class="slots-header">
            <h3>Theme Library Presets</h3>
            <button class="btn-add-slot" onclick="promptSaveSlot()">+ Save Current</button>
        </div>
        <div id="slotsContainer" class="slots-list"></div>

        <script>
            const vscode = acquireVsCodeApi();
            let state = vscode.getState() || {};
            let savedSlots = state.savedSlots || [];
            
            let modificationSnapshots = {};

            document.querySelectorAll('input[type="color"]').forEach((el) => {
                const scope = el.dataset.scope;
                const value = (scope && state[scope]) ? state[scope] : '#000000';
                el.value = value;
                
                const txtInput = document.getElementById('hex-' + scope);
                if (txtInput) { txtInput.value = value; }
            });
            renderSlots();

            function send(type, keyOrScope, color) {
                if (type === 'reset') {
                    const originalSlots = state.savedSlots || [];
                    state = { savedSlots: originalSlots };
                    vscode.setState(state);
                    document.querySelectorAll('input[type="color"]').forEach(el => {
                        el.value = '#000000';
                        const scope = el.dataset.scope;
                        document.getElementById('hex-' + scope).value = '#000000';
                        toggleActionButtons(scope, false);
                    });
                    modificationSnapshots = {};
                    renderSlots();
                } else if (color) {
                    state[keyOrScope] = color;
                    vscode.setState(state);
                }
                vscode.postMessage({ type, scope: keyOrScope, key: keyOrScope, color });
            }

            function handleNativeColorInput(scope, color) {
                ensureSnapshot(scope, () => {
                    document.getElementById('hex-' + scope).value = color;
                    const type = ['keywords','strings','comments','punctuation','functions','variables'].includes(scope) ? 'updateToken' : 'updateFrame';
                    send(type, scope, color);
                });
            }

            function handleHexTextInput(scope, value) {
                if (!value.startsWith('#') && value.trim().length > 0) {
                    value = '#' + value;
                    document.getElementById('hex-' + scope).value = value;
                }
                if (/^#[0-9A-F]{6}$/i.test(value)) {
                    ensureSnapshot(scope, () => {
                        document.getElementById('cp-' + scope).value = value;
                        const type = ['keywords','strings','comments','punctuation','functions','variables'].includes(scope) ? 'updateToken' : 'updateFrame';
                        send(type, scope, value);
                    });
                }
            }

            function ensureSnapshot(scope, callback) {
                if (modificationSnapshots[scope]) {
                    callback();
                    return;
                }
                modificationSnapshots[scope] = {
                    uiStateColor: state[scope] || '#000000',
                    domColor: document.getElementById('cp-' + scope).value
                };
                toggleActionButtons(scope, true);
                
                vscode.postMessage({ type: 'snapshotCurrentColors', scope: scope });
                
                const tempHandler = (event) => {
                    if (event.data.type === 'colorSnapshotResponse' && event.data.scope === scope) {
                        modificationSnapshots[scope].workbenchSnapshot = {
                            ui: event.data.ui,
                            tokens: event.data.tokens
                        };
                        window.removeEventListener('message', tempHandler);
                        callback();
                    }
                };
                window.addEventListener('message', tempHandler);
            }

            function toggleActionButtons(scope, show) {
                document.getElementById('ok-' + scope).style.display = show ? 'inline-flex' : 'none';
                document.getElementById('cc-' + scope).style.display = show ? 'inline-flex' : 'none';
            }

            function commitChange(scope) {
                delete modificationSnapshots[scope];
                toggleActionButtons(scope, false);
            }

            function cancelChange(scope) {
                const snap = modificationSnapshots[scope];
                if (!snap) return;

                state[scope] = snap.uiStateColor;
                vscode.setState(state);
                document.getElementById('cp-' + scope).value = snap.domColor;
                document.getElementById('hex-' + scope).value = snap.domColor;

                if (snap.workbenchSnapshot) {
                    vscode.postMessage({ type: 'revertColors', snapshot: snap.workbenchSnapshot });
                }

                delete modificationSnapshots[scope];
                toggleActionButtons(scope, false);
            }

            function promptSaveSlot() {
                vscode.postMessage({ type: 'requestSlotName', uiState: state });
            }

            function renderSlots() {
                const container = document.getElementById('slotsContainer');
                if (!container) { return; }
                container.innerHTML = '';
                
                if (!savedSlots || savedSlots.length === 0) {
                    const fallback = document.createElement('div');
                    fallback.style.fontSize = '11px';
                    fallback.style.color = 'var(--vscode-descriptionForeground)';
                    fallback.style.padding = '5px';
                    fallback.style.fontStyle = 'italic';
                    fallback.textContent = 'No configurations saved yet.';
                    container.appendChild(fallback);
                    return;
                }

                savedSlots.forEach(slot => {
                    const item = document.createElement('div');
                    item.className = 'slot-item';

                    const nameEl = document.createElement('div');
                    nameEl.className = 'slot-name';
                    nameEl.title = 'Click to load setup';
                    nameEl.textContent = slot.name;
                    
                    nameEl.addEventListener('click', () => {
                        modificationSnapshots = {};
                        document.querySelectorAll('.confirm-btn, .cancel-btn').forEach(b => b.style.display = 'none');
                        vscode.postMessage({ type: 'loadSlot', slotId: slot.id });
                    });

                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'btn-delete-slot';
                    deleteBtn.title = 'Delete Preset';                     
                    deleteBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 1v1H1v1h14V2h-4.5V1h-5zM2 4v10.5a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5V4H2zm3 10.5H4V6h1v8.5zm3 0H7V6h1v8.5zm3 0h-1V6h1v8.5z"/></svg>';
                    
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation(); 
                        savedSlots = savedSlots.filter(s => s.id !== slot.id);
                        state.savedSlots = savedSlots;
                        vscode.setState(state);
                        renderSlots();
                        vscode.postMessage({ type: 'deleteSlot', slotId: slot.id, savedSlots });
                    });
                    
                    item.appendChild(nameEl);
                    item.appendChild(deleteBtn);
                    container.appendChild(item);
                }); 
            }

            window.addEventListener('message', event => {
                const message = event.data;

                if (message.type === 'hydrate') {
                    const { uiState } = message;

                    if (uiState && uiState.isHardReset){
                        const input = document.querySelectorAll('input[type="text"]');
                        input.forEach(input =>{
                            input.value = '';
                            input.placeholder = '#------';
                            const colorPicker = input.previousElementSibling;
                            if(colorPicker) colorPicker.style.background = '#000000';
                        });
                    }

                    state = message.uiState || {};
                    savedSlots = state.savedSlots || [];
                    vscode.setState(state);
                    
                    document.querySelectorAll('input[type="color"]').forEach((el) => {
                        const scope = el.dataset.scope;
                        const txtInput = document.getElementById('hex-' + scope);

                        const rowWrapper = el.closest('.theme-row') || el.parentElement;

                        if (scope && state[scope]) {
                            el.value = state[scope];
                            if (txtInput) { txtInput.value = state[scope]; }
                            if(rowWrapper) rowWrapper.classList.remove('is-empty');
                        } else {
                            if (txtInput) { 
                                txtInput.value = ''; 
                                txtInput.placeholder = '#------';
                            }                
                            if(el) {
                                el.value = '#000000';
                            }
                            if(rowWrapper) rowWrapper.classList.add('is-empty');
                        }
                    });
                    renderSlots();
                }
            });
        </script>
    </body>
</html>`;
}