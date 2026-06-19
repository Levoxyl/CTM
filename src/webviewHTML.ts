import * as vscode from 'vscode';

export function getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    const styleUri = webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, 'src', 'style.css')
    );
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="${styleUri}">
    </head>
    <body>
        <h3 style="color: var(--vscode-textLink-foreground);">1. Layout Frame Backgrounds</h3>
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
        <div class="control-group" id="group-uiInteractiveStates">
            <input type="color" data-scope="uiInteractiveStates" id="cp-uiInteractiveStates" oninput="handleNativeColorInput('uiInteractiveStates', this.value)">
            <input type="text" class="hex-text-input" id="hex-uiInteractiveStates" maxlength="7" oninput="handleHexTextInput('uiInteractiveStates', this.value)">
            <label>Selections, Hovers & Menus</label>
            <button class="confirm-btn" id="ok-uiInteractiveStates" title="Commit Color" onclick="commitChange('uiInteractiveStates')">✓</button>
            <button class="cancel-btn" id="cc-uiInteractiveStates" title="Revert Changes" onclick="cancelChange('uiInteractiveStates')">✕</button>
        </div>

        <h3 style="color: var(--vscode-gitDecoration-addedResourceForeground);">2. Core Interface Typography & Icons</h3>
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

        <hr>

        <h3>3. Text Token Colorizer</h3>
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

            // FIXED: Synchronized initialization flow so placeholders stay un-overwritten
            document.querySelectorAll('input[type="color"]').forEach((el) => {
                const scope = el.dataset.scope;
                const rowWrapper = el.closest('.control-group');
                const txtInput = document.getElementById('hex-' + scope);

                if (scope && state[scope]) {
                    el.value = state[scope];
                    if (txtInput) { txtInput.value = state[scope]; }
                    if (rowWrapper) { rowWrapper.classList.remove('is-empty'); }
                } else {
                    el.value = '#000000';
                    if (txtInput) { 
                        txtInput.value = ''; 
                        txtInput.placeholder = '#------';
                    }
                    if (rowWrapper) { rowWrapper.classList.add('is-empty'); }
                }
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
                        const txtInput = document.getElementById('hex-' + scope);
                        if (txtInput) {
                            txtInput.value = '';
                            txtInput.placeholder = '#------';
                        }
                        const rowWrapper = el.closest('.control-group');
                        if (rowWrapper) { rowWrapper.classList.add('is-empty'); }
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
                    const rowWrapper = document.getElementById('cp-' + scope).closest('.control-group');
                    if (rowWrapper) { rowWrapper.classList.remove('is-empty'); }
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
                        const rowWrapper = document.getElementById('cp-' + scope).closest('.control-group');
                        if (rowWrapper) { rowWrapper.classList.remove('is-empty'); }
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
                
                const cp = document.getElementById('cp-' + scope);
                const txtInput = document.getElementById('hex-' + scope);
                const rowWrapper = cp.closest('.control-group');

                if (snap.uiStateColor && snap.uiStateColor !== '#000000') {
                    cp.value = snap.domColor;
                    if (txtInput) { txtInput.value = snap.domColor; }
                    if (rowWrapper) { rowWrapper.classList.remove('is-empty'); }
                } else {
                    cp.value = '#000000';
                    if (txtInput) {
                        txtInput.value = '';
                        txtInput.placeholder = '#------';
                    }
                    if (rowWrapper) { rowWrapper.classList.add('is-empty'); }
                }

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
                        const input = document.querySelectorAll('.hex-text-input');
                        input.forEach(input =>{
                            input.value = '';
                            input.placeholder = '#------';
                            const colorPicker = input.previousElementSibling;
                            if(colorPicker) colorPicker.value = '#000000';
                            const rowWrapper = input.closest('.control-group');
                            if(rowWrapper) rowWrapper.classList.add('is-empty');
                        });
                    }

                    state = message.uiState || {};
                    savedSlots = state.savedSlots || [];
                    vscode.setState(state);
                    
                    document.querySelectorAll('input[type="color"]').forEach((el) => {
                        const scope = el.dataset.scope;
                        const txtInput = document.getElementById('hex-' + scope);
                        const rowWrapper = el.closest('.control-group');

                        if (scope && state[scope]) {
                            el.value = state[scope];
                            if (txtInput) { txtInput.value = state[scope]; }
                            if(rowWrapper) rowWrapper.classList.remove('is-empty');
                        } else {
                            if (txtInput) { 
                                txtInput.value = ''; 
                                txtInput.placeholder = '#------';
                            }                
                            if(el) { el.value = '#000000'; }
                            if(rowWrapper) rowWrapper.classList.add('is-empty');
                        }
                    });
                    renderSlots();
                } else if (message.type === 'updateLibrary') {
                    savedSlots = message.savedSlots || [];
                    state.savedSlots = savedSlots;
                    vscode.setState(state);
                    renderSlots();
                }
            });
        </script>
    </body>
</html>`;
}