import * as vscode from 'vscode';

const MASTER_TOKEN_MAP: Record<string, string[]> = {
    'keywords': [
        'keyword', 
        'keyword.control', 
        'keyword.other', 
        'keyword.operator.new',
        'keyword.operator.expression',
        'storage.type', 
        'storage.modifier',
        'constant.language',
        'variable.language.this'
    ],
    'strings': [
        'string.quoted', 
        'string.template', 
        'string.unquoted',
        'punctuation.definition.string'
    ],
    'comments': [
        'comment', 
        'punctuation.definition.comment'
    ],
    'punctuation': [
        'punctuation', 
        'keyword.operator', 
        'meta.brace', 
        'punctuation.definition.tag', 
        'punctuation.separator', 
        'punctuation.terminator',
        'meta.tag.jsx',
        'punctuation.definition.bindingpattern',
        // Target ONLY the raw structural characters, not the entire block contents
        'meta.brace.round.js',
        'meta.brace.curly.js',
        'punctuation.definition.template-expression'
    ],
    'functions': [
        'entity.name.function', 
        'support.function',
        'entity.name.tag', 
        'support.class.component',
        'entity.name.type',
        'support.type',
        // Specific class & ID selectors for CSS files
        'entity.other.attribute-name.class.css',
        'entity.other.attribute-name.id.css'
    ],
    'variables': [
        'variable', 
        'variable.other', 
        'variable.parameter', 
        'variable.other.property', 
        'meta.object-literal.key',
        'support.variable',
        'support.constant',
        'constant.numeric',
        'constant.other',
        'meta.definition.variable',
        // Targets raw CSS rules properties without hijacking the language syntax
        'support.type.property-name.css'
    ]
};

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

            if (data.type === 'updateColor') {
                await config.update('workbench.colorCustomizations', { [data.key]: data.color }, vscode.ConfigurationTarget.Workspace);
            }
            else if (data.type === 'updateToken') {
                const currentConfig: any = config.get('editor.tokenColorCustomizations') || {};
                let rules = currentConfig.textMateRules || [];

                const targetScopes = MASTER_TOKEN_MAP[data.scope];
                
                if (targetScopes) {
					// Wipe out any existing rule blocks handling these specific group scopes to prevent clutter
					rules = rules.filter((rule: any) => {
						if (!rule.scope) {
							return true;
						}
						const ruleArray = Array.isArray(rule.scope) ? rule.scope : [rule.scope];
						return !ruleArray.some((s: string) => targetScopes.includes(s));
					});

                    // Inject the group scopes inside a unified layout block
                    rules.push({
                        "scope": targetScopes,
                        "settings": { 
                            "foreground": data.color,
                            "fontStyle": "" // Forces override over theme transparency/italics inheritance bugs
                        }
                    });
                }

                await config.update('editor.tokenColorCustomizations', { ...currentConfig, "textMateRules": rules }, vscode.ConfigurationTarget.Workspace);

                // Disable semantic highlighting and layout engines that interfere with standard colors
                await config.update('editor.semanticHighlighting.enabled', false, vscode.ConfigurationTarget.Workspace);
                await config.update('editor.bracketPairColorization.enabled', false, vscode.ConfigurationTarget.Workspace);
            }
            else if (data.type === 'saveSlot') {
                const currentUI = config.get('workbench.colorCustomizations');
                const currentTokens = config.get('editor.tokenColorCustomizations');
                await this._context.globalState.update(`slot_${data.slotId}`, { ui: currentUI, tokens: currentTokens });
                vscode.window.showInformationMessage(`Theme saved to Slot ${data.slotId}!`);
            }
            else if (data.type === 'loadSlot') {
                const saved: any = this._context.globalState.get(`slot_${data.slotId}`);
                if (saved) {
                    await config.update('workbench.colorCustomizations', saved.ui, vscode.ConfigurationTarget.Workspace);
                    await config.update('editor.tokenColorCustomizations', saved.tokens, vscode.ConfigurationTarget.Workspace);
                    vscode.window.showInformationMessage(`Slot ${data.slotId} loaded!`);
                }
            }
            else if (data.type === 'reset') {
                await config.update('workbench.colorCustomizations', undefined, vscode.ConfigurationTarget.Workspace);
                await config.update('editor.tokenColorCustomizations', undefined, vscode.ConfigurationTarget.Workspace);
                await config.update('workbench.colorCustomizations', undefined, vscode.ConfigurationTarget.Global);
                await config.update('editor.tokenColorCustomizations', undefined, vscode.ConfigurationTarget.Global);
                await config.update('editor.semanticHighlighting.enabled', undefined, vscode.ConfigurationTarget.Workspace);
                await config.update('editor.bracketPairColorization.enabled', undefined, vscode.ConfigurationTarget.Workspace);
                vscode.window.showInformationMessage("All colors and global leftovers cleared!");
            }
        });
    }

    private _getHtmlForWebview() {
        return `
        <!DOCTYPE html>
        <html>
        <body style="padding: 10px; color: white; font-family: sans-serif;">
            <h3>Kill the Rainbow</h3>

            <div style="margin-bottom: 8px;">
                <input type="color" oninput="send('updateToken', 'keywords', this.value)">
                <label style="margin-left: 5px;">Keywords & Storage</label>
            </div>
            <div style="margin-bottom: 8px;">
                <input type="color" oninput="send('updateToken', 'strings', this.value)">
                <label style="margin-left: 5px;">Strings</label>
            </div>
            <div style="margin-bottom: 8px;">
                <input type="color" oninput="send('updateToken', 'comments', this.value)">
                <label style="margin-left: 5px;">Comments</label>
            </div>
            <div style="margin-bottom: 8px;">
                <input type="color" oninput="send('updateToken', 'punctuation', this.value)">
                <label style="margin-left: 5px;">Punctuation & Operators</label>
            </div>
            <div style="margin-bottom: 8px;">
                <input type="color" oninput="send('updateToken', 'functions', this.value)">
                <label style="margin-left: 5px;">Functions & Types</label>
            </div>
            <div style="margin-bottom: 15px;">
                <input type="color" oninput="send('updateToken', 'variables', this.value)">
                <label style="margin-left: 5px;">Variables, Props & Values</label>
            </div>

            <hr style="border: 0.5px solid #444; margin-bottom: 15px;">

            <div style="margin-bottom: 15px;">
                <button onclick="send('reset')" style="width: 100%; background: #555; color: white; border: none; padding: 6px; cursor: pointer;">Reset Theme</button>
            </div>

            <h3>Presets (Slots)</h3>
            <div style="display: flex; gap: 5px;">
                <button onclick="send('saveSlot', '1', '')" style="background: #d32f2f; color: white; border: none; padding: 7px; cursor: pointer; flex: 1; font-weight: bold;">Save 1</button>
                <button onclick="send('loadSlot', '1', '')" style="background: #388e3c; color: white; border: none; padding: 7px; cursor: pointer; flex: 1; font-weight: bold;">Load 1</button>
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                let state = vscode.getState() || {};

                document.querySelectorAll('input[type="color"]').forEach((el, index) => {
                    el.dataset.idx = index; 
                    if (state[index]) el.value = state[index];
                });

                function send(type, keyOrScope, color) {
                    if (color) {
                        const activeEl = document.activeElement;
                        if (activeEl && activeEl.dataset.idx !== undefined) {
                            state[activeEl.dataset.idx] = color;
                            vscode.setState(state);
                        }
                    } else if (type === 'reset') {
                        state = {};
                        vscode.setState(state);
                        document.querySelectorAll('input[type="color"]').forEach(el => el.value = '#000000');
                    }
                    vscode.postMessage({ type, scope: keyOrScope, key: keyOrScope, color, slotId: '1' });
                }
            </script>
        </body>
        </html>`;
    }
}