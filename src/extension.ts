import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const provider = new ThemeViewProvider(context);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ThemeViewProvider.viewType, provider)
	);
}

class ThemeViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'theme-maker-view';

	// We changed this to store the whole context, not just the URI
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
				await config.update('workbench.colorCustomizations', { [data.key]: data.color }, vscode.ConfigurationTarget.Global);
			}
			else if (data.type === 'updateToken') {
				const currentConfig: any = config.get('editor.tokenColorCustomizations') || { textMateRules: [] };
				let rules = currentConfig.textMateRules || [];

				const incomingScopes = data.scope.split(',').map((s: string) => s.trim());
				rules = rules.filter((rule: any) => !incomingScopes.includes(rule.scope));

				incomingScopes.forEach((scope: string) => {
					rules.push({
						"scope": scope,
						"settings": { "foreground": data.color }
					});
				});

				rules.sort((a: any, b: any) => {
					if (a.scope === 'comment') return 1;
					if (b.scope === 'comment') return -1;
					return 0;
				});

				// 1. Update the actual colors
				await config.update('editor.tokenColorCustomizations', {
					"textMateRules": rules
				}, vscode.ConfigurationTarget.Global);

				// 2. Update the semantic setting
				await config.update('editor.semanticHighlighting.enabled', false, vscode.ConfigurationTarget.Global);
			}
			else if (data.type === 'saveSlot') {
				const currentUI = config.get('workbench.colorCustomizations');
				const currentTokens = config.get('editor.tokenColorCustomizations');

				// Now we use this._context to reach the storage
				await this._context.globalState.update(`slot_${data.slotId}`, { ui: currentUI, tokens: currentTokens });
				vscode.window.showInformationMessage(`Theme saved to Slot ${data.slotId}!`);
			}
			else if (data.type === 'loadSlot') {
				const saved: any = this._context.globalState.get(`slot_${data.slotId}`);
				if (saved) {
					await config.update('workbench.colorCustomizations', saved.ui, vscode.ConfigurationTarget.Global);
					await config.update('editor.tokenColorCustomizations', saved.tokens, vscode.ConfigurationTarget.Global);
					vscode.window.showInformationMessage(`Slot ${data.slotId} loaded!`);
				}
			}
		});
	}

	private _getHtmlForWebview() {
		return `
        <!DOCTYPE html>
        <html>
        <body style="padding: 10px; color: white; font-family: sans-serif;">
            <h3>Kill the Rainbow</h3>

			<div>
				<input type="color" oninput="send('updateToken', 'keyword', this.value)">
				<label>Keywords</label>
			</div>
			<div>
				<input type="color" oninput="send('updateToken', 'string', this.value)">
				<label>Strings</label>
			</div>
			<div>
				<input type="color" oninput="send('updateToken', 'comment, punctuation.definition.comment', this.value)">
				<label>Comments</label>
			</div>
			<div>
				<input type="color" oninput="send('updateToken', 'punctuation, keyword.operator', this.value)">
				<label>Punctuation</label>
			</div>
			<div>
				<input type="color" oninput="send('updateToken', 'entity.name.function', this.value)">
				<label>Function Names</label>
			</div>
			<div>
				<input type="color" oninput="send('updateToken', 'storage.type', this.value)">
				<label>Storage Types</label>
			</div>
			<div>
				<input type="color" oninput="send('updateToken', 'storage.modifier', this.value)">
				<label>Storage Modifiers</label>
			</div>
			<div>
				<input type="color" oninput="send('updateToken', 'variable.other.property, variable.other.object.property, meta.object-literal.key, support.variable.property', this.value)">
				<label>Variable Properties</label>
			</div>
			<div>
				<input type="color" oninput="send('updateToken', 'support.type', this.value)">
				<label>Support Types</label>
			</div>
			<div>
				<input type="color" oninput="send('updateToken', 'variable.parameter', this.value)">
				<label>Variable Parameters</label>
			</div>


            <hr style="border: 0.5px solid #000;">
            <h3>Presets (Slots)</h3>
            <div style="display: flex; gap: 5px;">
                <button onclick="send('saveSlot', '1', '')" style="background: #d32f2f; color: white; border: none; padding: 5px; cursor: pointer; flex: 1;">Save 1</button>
                <button onclick="send('loadSlot', '1', '')" style="background: #388e3c; color: white; border: none; padding: 5px; cursor: pointer; flex: 1;">Load 1</button>
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                function send(type, keyOrScope, color) {
                    // We send slotId '1' specifically for these buttons
                    vscode.postMessage({ type, scope: keyOrScope, key: keyOrScope, color, slotId: '1' });
                }
            </script>
        </body>
        </html>`;
	}
}