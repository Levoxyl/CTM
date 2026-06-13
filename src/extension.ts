import * as vscode from 'vscode';

interface TokenMapping {
    textMate: string[];
    semantic: string[];
}
const MASTER_MAP: Record<string, TokenMapping> = {
    'keywords': {
        textMate: [
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
        semantic: ['keyword', 'storage', 'modifier']
    },
   'strings': {
        textMate: [
            'string.quoted', 
            'string.template', 
            'string.unquoted',
            'punctuation.definition.string',
            'string.template.js',
            'string.template.jsx',
            'string.template.ts',
            'string.template.tsx'
        ],
        semantic: ['string']
    },
    'comments': {
        textMate: [
            'comment', 
            'punctuation.definition.comment'
        ],
        semantic: ['comment']
    },
    'punctuation': {
        textMate: [
            'punctuation', 
            'keyword.operator', 
            'meta.brace', 
            'meta.brace.round',
            'meta.brace.curly',
            'meta.brace.square',
            'punctuation.section.block',
            'punctuation.section.array',
            'punctuation.section.bracket',
            'punctuation.definition.object',
            'punctuation.definition.parameters',
            'punctuation.definition.bindingpattern',
            'punctuation.definition.tag', 
            'punctuation.separator', 
            'punctuation.terminator',
            'meta.tag.jsx',
            'punctuation.definition.template-expression',
            'punctuation.definition.template-expression.begin.ts',
            'punctuation.definition.template-expression.begin.tsx',
            'punctuation.definition.template-expression.end.ts',
            'punctuation.definition.template-expression.end.tsx',
            'meta.template.expression.ts',
            'meta.template.expression.tsx'
        ],
        semantic: ['operator'] 
    },
    'functions': {
        textMate: [
            'entity.name.function', 
            'support.function',
            'entity.name.tag',
            'entity.name.tag.css',
            'entity.name.tag.html',
            'meta.tag.sgml',
            'support.class.component',
            'entity.name.type',
            'support.type',
            'entity.other.attribute-name.class.css',
            'entity.other.attribute-name.id.css',
            'support.class.builtin.ts',
            'support.class.builtin.tsx',
            'entity.name.type.ts',
            'entity.name.type.tsx',
            'support.type.primitive.ts',
            'support.type.primitive.tsx',
            'support.type.builtin.ts',
            'support.type.builtin.tsx',
            'support.class.builtin.js',
            'support.class.js',
            'support.class.ts',
            'support.class.tsx',
            'support.type.object.js',
            'support.type.object.ts',
            'support.type.object.tsx'
        ],
        semantic: [
            'function', 'method', 'member', 'class', 'interface', 'type', 'typeParameter',
            'class.declaration', 'interface.declaration', 'type.declaration',
            'class:defaultLibrary',
            'interface:defaultLibrary',
            'type:defaultLibrary'
        ]
    },
    'variables': {
        textMate: [
            'variable', 
            'variable.other', 
            'variable.parameter', 
            'variable.other.property', 
            'variable.other.object', 
            'variable.other.readwrite',
            'variable.other.readwrite.alias',
            'variable.other.constant',
            'meta.object-literal.key',
            'support.variable',
            'support.constant',
            'support.type.object', 
            'support.constant.dom',
            'constant.numeric',
            'constant.other', 
            'keyword.other.unit', 
            'entity.other.attribute-name', 
            'meta.definition.variable',
            'support.type.property-name.css',
            'support.constant.property-value.css',
            'constant.other.color.rgb-value.css',
            'meta.property-value.css',
            'meta.property-value.css variable.other',
            'variable.other.readwrite.ts',
            'variable.other.readwrite.tsx',
            'variable.other.constant.ts',
            'variable.other.constant.tsx',
            'variable.other.property.ts',
            'variable.other.property.tsx',
            'variable.parameter.ts',
            'variable.parameter.tsx',
            'meta.object-literal.key.ts',
            'meta.object-literal.key.tsx',
            'entity.other.attribute-name.tsx',
            'entity.other.attribute-name.jsx',
            'variable.other.object.ts',
            'variable.other.object.tsx'
        ],
        semantic: [
            'variable',
            'property', 
            'parameter', 
            'namespace',
            'variable.local',
            'variable.declaration',
            'variable.readonly',
            'variable.declaration.local',
            'variable.readonly.local',
            'property.declaration',
            'parameter.declaration',
            'variable:defaultLibrary'
        ]
    }
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
                let textMateRules = currentConfig.textMateRules || [];
                let semanticTokenColors = currentConfig.semanticTokenColors || {};

                const targetMapping = MASTER_MAP[data.scope];
                
                if (targetMapping) {
                    textMateRules = textMateRules.filter((rule: any) => {
                        if (!rule.scope) { 
                            return true; 
                        }
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

                // FORCE FIX: Direct injection into VS Code's native structural layout engine
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
                        'editorBracketHighlight.unexpectedBracket.foreground': data.color
                    }, vscode.ConfigurationTarget.Workspace);
                }
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