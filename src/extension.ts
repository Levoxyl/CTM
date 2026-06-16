import * as vscode from 'vscode';
import { MASTER_MAP } from './tokenMap';
import { FRAME_MAP } from './frameDesign'; 
import { getAdaptiveGitColor, getLuminance } from './colorUtils';
import { getHtmlForWebview } from './webviewHTML';

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

        // Extracted cleanly here
        webviewView.webview.html = getHtmlForWebview();

        webviewView.webview.onDidReceiveMessage(async (data) => {
            const config = vscode.workspace.getConfiguration();

            // Cache snapshot color values before updating changes for cancellation fallback
            if (data.type === 'snapshotCurrentColors') {
                const currentUI = config.get('workbench.colorCustomizations') || {};
                const currentTokens = config.get('editor.tokenColorCustomizations') || {};
                webviewView.webview.postMessage({
                    type: 'colorSnapshotResponse',
                    scope: data.scope,
                    ui: currentUI,
                    tokens: currentTokens
                });
                return;
            }

            // User hit the Cancel button: Revert configuration to saved state
            if (data.type === 'revertColors') {
                await config.update('workbench.colorCustomizations', data.snapshot.ui, vscode.ConfigurationTarget.Workspace);
                await config.update('editor.tokenColorCustomizations', data.snapshot.tokens, vscode.ConfigurationTarget.Workspace);
                return;
            }

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
}