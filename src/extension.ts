// extension.ts
import * as vscode from 'vscode';
import { MASTER_MAP } from './tokenMap';
import { FRAME_MAP } from './frameDesign'; 

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
                            currentUI[key] = data.color + '40'; // 25% opacity
                        } else if (key.endsWith('Slider.hoverBackground')) {
                            currentUI[key] = data.color + '66'; // 40% opacity on hover 
                        } else if (key.endsWith('Slider.activeBackground')) {
                            currentUI[key] = data.color + '80'; // 50% opacity on click drag
                        } else if (key === 'editorLineNumber.foreground') {
                            currentUI[key] = data.color + '55'; // 33% alpha tint so regular line numbers stay subtle
                        } else if (key === 'editorLineNumber.activeForeground') {
                            currentUI[key] = data.color;        // 100% full opacity pop on the current active line
                        } else if (key.startsWith('editorIndentGuide.background')) {
                            currentUI[key] = data.color + '40'; // FIX: Subtle alpha blend for dormant indent guides
                        } else if (key.startsWith('editorIndentGuide.activeBackground')) {
                            currentUI[key] = data.color + 'cc'; // FIX: Brighter opacity focus for current line scope
                        } else if (key === 'editorBracketMatch.background') {
                            currentUI[key] = data.color + '33'; // FIX: Handle opacity background behind bracket frames
                        } else if (key === 'editorBracketMatch.border') {
                            currentUI[key] = data.color;        // FIX: High visibility solid frame border
                        } else {
                            currentUI[key] = data.color;
                        }
                    });
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
                        if (!rule.scope) return true; 
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

                        'editorBracketMatch.background': data.color + '33',      
                        'editorBracketMatch.border': data.color,                  
                        
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
            else if (data.type === 'saveSlot') {
                const currentUI = config.get('workbench.colorCustomizations');
                const currentTokens = config.get('editor.tokenColorCustomizations');
                
                await this._context.globalState.update(`slot_${data.slotId}`, { 
                    ui: currentUI, 
                    tokens: currentTokens,
                    uiState: data.uiState 
                });
                vscode.window.showInformationMessage(`Theme saved to Slot ${data.slotId}!`);
            }
            else if (data.type === 'loadSlot') {
                const saved: any = this._context.globalState.get(`slot_${data.slotId}`);
                if (saved) {
                    await config.update('workbench.colorCustomizations', saved.ui, vscode.ConfigurationTarget.Workspace);
                    await config.update('editor.tokenColorCustomizations', saved.tokens, vscode.ConfigurationTarget.Workspace);
                    
                    webviewView.webview.postMessage({ type: 'hydrate', uiState: saved.uiState });
                    vscode.window.showInformationMessage(`Slot ${data.slotId} loaded!`);
                }
            }
            else if (data.type === 'reset') {
                await config.update('workbench.colorCustomizations', undefined, vscode.ConfigurationTarget.Workspace);
                await config.update('editor.tokenColorCustomizations', undefined, vscode.ConfigurationTarget.Workspace);
                await config.update('workbench.colorCustomizations', undefined, vscode.ConfigurationTarget.Global);
                await config.update('editor.tokenColorCustomizations', undefined, vscode.ConfigurationTarget.Global);
                
                webviewView.webview.postMessage({ type: 'hydrate', uiState: {} });
                vscode.window.showInformationMessage("All colors and global leftovers cleared!");
            }
        });
    }

    private _getHtmlForWebview() {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: sans-serif; padding: 10px; color: var(--vscode-foreground); }
                h3 { margin-top: 12px; margin-bottom: 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
                .control-group { display: flex; align-items: center; margin-bottom: 8px; }
                input[type="color"] { background: none; border: none; width: 24px; height: 24px; cursor: pointer; padding: 0; }
                label { margin-left: 8px; font-size: 12px; }
                button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 6px; cursor: pointer; width: 100%; font-size: 12px; }
                button:hover { background: var(--vscode-button-hoverBackground); }
                hr { border: none; border-top: 1px solid var(--vscode-panel-border); margin: 15px 0; }
            </style>
        </head>
        <body>
            <h3 style="color: #64b5f6;">1a. Layout Frame Backgrounds</h3>
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

            <h3 style="color: #81c784;">1b. Core Interface Typography & Icons</h3>
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

            <h3 style="color: #ffd54f;">2. Text Token Colorizer</h3>
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
                <button onclick="send('reset')" style="background: #555;">Reset Theme</button>
            </div>

            <h3>Presets (Slots)</h3>
            <div style="display: flex; gap: 5px;">
                <button onclick="send('saveSlot', '1')" style="background: #d32f2f; font-weight: bold;">Save 1</button>
                <button onclick="send('loadSlot', '1')" style="background: #388e3c; font-weight: bold;">Load 1</button>
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                let state = vscode.getState() || {};

                document.querySelectorAll('input[type="color"]').forEach((el) => {
                    const scope = el.dataset.scope;
                    if (scope && state[scope]) {
                        el.value = state[scope];
                    }
                });

                function send(type, keyOrScope, color) {
                    if (type === 'saveSlot' || type === 'loadSlot') {
                        vscode.postMessage({ type, slotId: keyOrScope, uiState: state });
                        return;
                    }
                    
                    if (type === 'reset') {
                        state = {};
                        vscode.setState(state);
                        document.querySelectorAll('input[type="color"]').forEach(el => el.value = '#000000');
                    } else if (color) {
                        state[keyOrScope] = color;
                        vscode.setState(state);
                    }

                    vscode.postMessage({ type, scope: keyOrScope, key: keyOrScope, color, slotId: '1' });
                }

                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.type === 'hydrate') {
                        state = message.uiState || {};
                        vscode.setState(state);
                        document.querySelectorAll('input[type="color"]').forEach(el => {
                            const scope = el.dataset.scope;
                            el.value = state[scope] || '#000000';
                        });
                    }
                });
            </script>
        </body>
        </html>`;
    }
}