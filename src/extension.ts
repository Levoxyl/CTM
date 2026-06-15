import * as vscode from 'vscode';
import { MASTER_MAP } from './tokenMap';
import { FRAME_MAP } from './frameDesign'; 
import { getAdaptiveGitColor, getLuminance } from './colorUtils';

export function activate(context: vscode.ExtensionContext) {
    const provider = new ThemeViewProvider(context);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(ThemeViewProvider.viewType, provider)
    );
}

class ThemeViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'theme-maker-view';

    constructor(private readonly _context: vscode.ExtensionContext) { }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._context.extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview();

        webviewView.webview.onDidReceiveMessage(async (data) => {
            const config = vscode.workspace.getConfiguration();

            if (data.type === 'updateFrame') {
                const currentUI: any = config.get('workbench.colorCustomizations') || {};
                const targetFrame = FRAME_MAP[data.scope];

                if (targetFrame) {
                    targetFrame.workbenchKeys.forEach((key) => {
                        if (key.endsWith('Slider.background')) {
                            currentUI[key] = data.color + '40'; 
                        } else if (key.endsWith('Slider.hoverBackground')) {
                            currentUI[key] = data.color + '66'; 
                        } else if (key.endsWith('Slider.activeBackground')) {
                            currentUI[key] = data.color + '80'; 
                        } else if (key === 'editorLineNumber.foreground') {
                            currentUI[key] = data.color + '55'; 
                        } else if (key === 'editorLineNumber.activeForeground') {
                            currentUI[key] = data.color;        
                        } else if (key === 'activityBar.inactiveForeground') {
                            currentUI[key] = data.color + '99';
                        } 
                        else if (key.toLowerCase().includes('disabled') || key.endsWith('placeholderForeground')) {
                            currentUI[key] = data.color + '66';
                        } 
                        else {
                            currentUI[key] = data.color;
                        }
                    });
                    
                    const referenceBg = currentUI['editor.background'];
                    if (referenceBg) { 
                        const inheritedForeground = currentUI['foreground'] || 'var(--vscode-foreground)';
                        const borderToken = currentUI['panel.border'] || currentUI['sideBar.border'] || 'var(--vscode-panel-border)';

                        currentUI['descriptionForeground'] = currentUI['descriptionForeground'] || 'var(--vscode-descriptionForeground)';
                        
                        currentUI['debugToolBar.background'] = currentUI['sideBar.background'] || referenceBg;
                        currentUI['debugToolBar.border'] = borderToken;
                        currentUI['debugWidget.border'] = borderToken;
                        currentUI['debugWidget.background'] = currentUI['sideBar.background'] || referenceBg;
                        
                        currentUI['debugConsole.infoForeground'] = inheritedForeground;
                        currentUI['debugConsole.warningForeground'] = currentUI['editorMarkerNavigationWarning.background'] || 'var(--vscode-editorMarkerNavigationWarning-background)';
                        currentUI['debugConsoleInputIcon.foreground'] = data.color;
                        
                        currentUI['tooltip.background'] = referenceBg;
                        currentUI['editorHoverWidget.background'] = referenceBg;
                        currentUI['editorHoverWidget.statusBarBackground'] = referenceBg;
                        currentUI['editorWidget.background'] = referenceBg;
                        currentUI['tooltip.foreground'] = inheritedForeground;
                        currentUI['editorHoverWidget.foreground'] = inheritedForeground;
                    }
                    await config.update('workbench.colorCustomizations', currentUI, vscode.ConfigurationTarget.Workspace);
                }
            }
            else if (data.type === 'updateToken') {
                const currentConfig: any = config.get('editor.tokenColorCustomizations') || {};
                let textMateRules = currentConfig.textMateRules || [];
                let semanticTokenColors = currentConfig.semanticTokenColors || {};

                const targetMapping = MASTER_MAP[data.scope];
                
                if (targetMapping) {
                    textMateRules = textMateRules.filter((rule: any) => {
                        if (!rule.scope) { return true; } 
                        const ruleArray = Array.isArray(rule.scope) ? rule.scope : [rule.scope];
                        return !ruleArray.some((s: string) => targetMapping.textMate.includes(s));
                    });

                    textMateRules.push({
                        "scope": targetMapping.textMate,
                        "settings": { 
                            "foreground": data.color,
                            "fontStyle": "" 
                        }
                    });

                    targetMapping.semantic.forEach((semanticType) => {
                        semanticTokenColors[semanticType] = data.color;
                    });
                }
                await config.update('editor.tokenColorCustomizations', { 
                    ...currentConfig, 
                    "textMateRules": textMateRules,
                    "semanticTokenColors": semanticTokenColors
                }, vscode.ConfigurationTarget.Workspace);

                if (data.scope === 'punctuation') {
                    const currentUI: any = config.get('workbench.colorCustomizations') || {};
                    await config.update('workbench.colorCustomizations', {
                        ...currentUI,
                        'editorBracketHighlight.foreground1': data.color,
                        'editorBracketHighlight.foreground2': data.color,
                        'editorBracketHighlight.foreground3': data.color,
                        'editorBracketHighlight.foreground4': data.color,
                        'editorBracketHighlight.foreground5': data.color,
                        'editorBracketHighlight.foreground6': data.color,
                        'editorBracketHighlight.unexpectedBracket.foreground': data.color,

                        'editorIndentGuide.background': data.color + '40',
                        'editorIndentGuide.activeBackground': data.color,                    
                        
                        'editorBracketPairGuide.background1': data.color + '40',  
                        'editorBracketPairGuide.background2': data.color + '40',
                        'editorBracketPairGuide.background3': data.color + '40',
                        'editorBracketPairGuide.background4': data.color + '40',
                        'editorBracketPairGuide.background5': data.color + '40',
                        'editorBracketPairGuide.background6': data.color + '40',
                        
                        'editorBracketPairGuide.activeBackground1': data.color,   
                        'editorBracketPairGuide.activeBackground2': data.color,
                        'editorBracketPairGuide.activeBackground3': data.color,
                        'editorBracketPairGuide.activeBackground4': data.color,
                        'editorBracketPairGuide.activeBackground5': data.color,
                        'editorBracketPairGuide.activeBackground6': data.color
                    }, vscode.ConfigurationTarget.Workspace);
                }
            }
            else if (data.type === 'requestSlotName') {
                const slotName = await vscode.window.showInputBox({
                    prompt: 'Enter a name for this custom theme preset:',
                    placeHolder: 'e.g., Cyberpunk Crimson, Muted Mint...'
                });

                if (slotName && slotName.trim() !== '') {
                    const slotId = 'slot_' + Date.now();
                    const currentUI = config.get('workbench.colorCustomizations');
                    const currentTokens = config.get('editor.tokenColorCustomizations');
                    
                    await this._context.globalState.update(slotId, { 
                        ui: currentUI, 
                        tokens: currentTokens,
                        uiState: data.uiState 
                    });

                    let activeLibrary: any = this._context.globalState.get('theme_library_slots') || [];
                    activeLibrary.push({ id: slotId, name: slotName.trim() });
                    await this._context.globalState.update('theme_library_slots', activeLibrary);

                    const targetState = { ...data.uiState, savedSlots: activeLibrary };
                    webviewView.webview.postMessage({ type: 'hydrate', uiState: targetState });
                    vscode.window.showInformationMessage(`Theme "${slotName}" captured successfully!`);
                }
            }
            else if (data.type === 'loadSlot') {
                const saved: any = this._context.globalState.get(data.slotId);
                if (saved) {
                    await config.update('workbench.colorCustomizations', saved.ui, vscode.ConfigurationTarget.Workspace);
                    await config.update('editor.tokenColorCustomizations', saved.tokens, vscode.ConfigurationTarget.Workspace);
                    
                    let activeLibrary = this._context.globalState.get('theme_library_slots') || [];
                    const combinedState = { ...saved.uiState, savedSlots: activeLibrary };
                    
                    webviewView.webview.postMessage({ type: 'hydrate', uiState: combinedState });
                    vscode.window.showInformationMessage(`Loaded preset configuration!`);
                }
            }
            else if (data.type === 'deleteSlot') {
                await this._context.globalState.update(data.slotId, undefined);
                await this._context.globalState.update('theme_library_slots', data.savedSlots);
            }
            else if (data.type === 'reset') {
                await config.update('workbench.colorCustomizations', undefined, vscode.ConfigurationTarget.Workspace);
                await config.update('editor.tokenColorCustomizations', undefined, vscode.ConfigurationTarget.Workspace);
                await config.update('workbench.colorCustomizations', undefined, vscode.ConfigurationTarget.Global);
                await config.update('editor.tokenColorCustomizations', undefined, vscode.ConfigurationTarget.Global);
                
                let activeLibrary = this._context.globalState.get('theme_library_slots') || [];
                
                webviewView.webview.postMessage({ type: 'hydrate', uiState: { savedSlots: activeLibrary } });
                vscode.window.showInformationMessage("Workspace live colors reset! Your saved theme library remains intact.");
            }
        });
    }

    private _getHtmlForWebview() {
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
                    color: var(--vscode-foreground); 
                }
                h3 { 
                    margin-top: 12px;
                    margin-bottom: 8px;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .control-group { display: flex; align-items: center; margin-bottom: 8px; }
                input[type="color"] { background: none; border: none; width: 24px; height: 24px; cursor: pointer; padding: 0; }
                label { margin-left: 8px; font-size: 12px; }

                .action-button { 
                    background: var(--vscode-button-background); 
                    color: var(--vscode-button-foreground); 
                    border: 1px solid var(--vscode-button-border, transparent); 
                    padding: 6px; 
                    cursor: pointer; 
                    width: 100%; 
                    font-size: 12px; 
                    border-radius: 2px;
                    transition: background 0.15s ease, border-color 0.15s ease;
                    display: block;
                    text-align: center;
                }
                .action-button:hover { 
                    background: var(--vscode-button-hoverBackground); 
                }
                
                .btn-reset-live {
                    background: var(--vscode-button-secondaryBackground);
                    color: var(--vscode-button-secondaryForeground);
                }
                .btn-reset-live:hover {
                    background: var(--vscode-button-secondaryHoverBackground);
                }

                hr { border: none; border-top: 1px solid var(--vscode-panel-border); margin: 15px 0; }
                
                .slots-header { display: flex; align-items: center; justify-content: space-between; margin-top: 15px; margin-bottom: 8px; }
                
                .btn-add-slot { 
                    background: var(--vscode-button-background); 
                    color: var(--vscode-button-foreground); 
                    border: none; 
                    padding: 5px 10px; 
                    cursor: pointer; 
                    font-size: 11px; 
                    font-weight: bold; 
                    border-radius: 2px; 
                    width: auto;
                    display: inline-block;
                }
                .btn-add-slot:hover { background: var(--vscode-button-hoverBackground); }
                .slots-list { display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto; padding-right: 2px; }
                
                .slot-item { 
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between; 
                    background: var(--vscode-sideBar-background); 
                    border: 1px solid var(--vscode-panel-border); 
                    border-radius: 4px; 
                    position: relative; 
                    z-index: 1;
                    overflow: hidden;
                    transition: background 0.2s ease, transform 0.15s ease, border-color 0.15s ease; 
                }
                .slot-item:hover { 
                    background: var(--vscode-list-hoverBackground) !important;
                    border-color: var(--vscode-focusBorder);
                    transform: translateY(-1px);
                }
                
                .slot-name { 
                    flex-grow: 1; 
                    padding: 8px 36px 8px 10px; 
                    font-size: 12px; 
                    text-align: left; 
                    overflow: hidden; 
                    text-overflow: ellipsis; 
                    white-space: nowrap; 
                    font-weight: 500; 
                    cursor: pointer; 
                    color: var(--vscode-foreground);
                }
                .slot-name:hover { color: var(--vscode-textLink-activeForeground); }
                
                .btn-delete-slot { 
                    background: transparent; 
                    border: none; 
                    position: absolute; 
                    right: 6px; 
                    top: 50%; 
                    transform: translateY(-50%); 
                    cursor: pointer; 
                    color: var(--vscode-errorForeground); 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    opacity: 0.5; 
                    padding: 4px; 
                    border-radius: 2px; 
                    width: 24px; 
                    height: 24px; 
                }
                .btn-delete-slot:hover { opacity: 1; background: var(--vscode-list-hoverBackground); }
            </style>
        </head>
        <body>
            <h3 style="color: var(--vscode-textLink-foreground);">1a. Layout Frame Backgrounds</h3>
            <div class="control-group">
                <input type="color" data-scope="activityBar" oninput="send('updateFrame', 'activityBar', this.value)">
                <label>Left Panel L Background</label>
            </div>
            <div class="control-group">
                <input type="color" data-scope="sideBar" oninput="send('updateFrame', 'sideBar', this.value)">
                <label>Left Panel R Background</label>
            </div>
            <div class="control-group">
                <input type="color" data-scope="topPanel" oninput="send('updateFrame', 'topPanel', this.value)">
                <label>Top Header Background</label>
            </div>
            <div class="control-group">
                <input type="color" data-scope="bottomPanel" oninput="send('updateFrame', 'bottomPanel', this.value)">
                <label>Bottom Frame Background</label>
            </div>
            <div class="control-group">
                <input type="color" data-scope="editorBackground" oninput="send('updateFrame', 'editorBackground', this.value)">
                <label>Code Canvas Background</label>
            </div>

            <h3 style="color: var(--vscode-gitDecoration-addedResourceForeground);">1b. Core Interface Typography & Icons</h3>
            <div class="control-group">
                <input type="color" data-scope="uiGeneralText" oninput="send('updateFrame', 'uiGeneralText', this.value)">
                <label>UI Text, Menus & Gutter Lines</label>
            </div>
            <div class="control-group">
                <input type="color" data-scope="uiIconsAndVectors" oninput="send('updateFrame', 'uiIconsAndVectors', this.value)">
                <label>System Action Icons (SVG)</label>
            </div>
            <div class="control-group">
                <input type="color" data-scope="uiLayoutBorders" oninput="send('updateFrame', 'uiLayoutBorders', this.value)">
                <label>Layout Separators & Borders</label>
            </div>
            <div class="control-group">
                <input type="color" data-scope="uiInteractiveStates" oninput="send('updateFrame', 'uiInteractiveStates', this.value)">
                <label>Selections, Hovers & Menus</label>
            </div>

            <hr>

            <h3>2. Text Token Colorizer</h3>
            <div class="control-group">
                <input type="color" data-scope="keywords" oninput="send('updateToken', 'keywords', this.value)">
                <label>Keywords & Storage</label>
            </div>
            <div class="control-group">
                <input type="color" data-scope="strings" oninput="send('updateToken', 'strings', this.value)">
                <label>Strings</label>
            </div>
            <div class="control-group">
                <input type="color" data-scope="comments" oninput="send('updateToken', 'comments', this.value)">
                <label>Comments</label>
            </div>
            <div class="control-group">
                <input type="color" data-scope="punctuation" oninput="send('updateToken', 'punctuation', this.value)">
                <label>Punctuation & Operators</label>
            </div>
            <div class="control-group">
                <input type="color" data-scope="functions" oninput="send('updateToken', 'functions', this.value)">
                <label>Functions & Types</label>
            </div>
            <div class="control-group">
                <input type="color" data-scope="variables" oninput="send('updateToken', 'variables', this.value)">
                <label>Variables, Props & Values</label>
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

                document.querySelectorAll('input[type="color"]').forEach((el) => {
                    const scope = el.dataset.scope;
                    if (scope && state[scope]) { el.value = state[scope]; }
                });
                renderSlots();

                function send(type, keyOrScope, color) {
                    if (type === 'reset') {
                        const originalSlots = state.savedSlots || [];
                        state = { savedSlots: originalSlots };
                        vscode.setState(state);
                        document.querySelectorAll('input[type="color"]').forEach(el => el.value = '#000000');
                        renderSlots();
                    } else if (color) {
                        state[keyOrScope] = color;
                        vscode.setState(state);
                    }
                    vscode.postMessage({ type, scope: keyOrScope, key: keyOrScope, color });
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
                        state = message.uiState || {};
                        savedSlots = state.savedSlots || [];
                        vscode.setState(state);
                        
                        document.querySelectorAll('input[type="color"]').forEach(el => {
                            const scope = el.dataset.scope;
                            el.value = state[scope] || '#000000';
                        });
                        renderSlots();
                    }
                });
            </script>
        </body>
        </html>`;
    }
}