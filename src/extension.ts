import * as vscode from 'vscode';
import { MASTER_MAP } from './tokenMap';
import { FRAME_MAP } from './frameDesign'; 
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

        webviewView.webview.html = getHtmlForWebview();

        webviewView.webview.onDidReceiveMessage(async (data) => {
            const config = vscode.workspace.getConfiguration();
            //Check array length for stopping from empty window tracking
            const targetConfig = (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0)
                ? vscode.ConfigurationTarget.Workspace 
                : vscode.ConfigurationTarget.Global;


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

            if (data.type === 'revertColors') {
                await config.update('workbench.colorCustomizations', data.snapshot.ui, targetConfig);
                await config.update('editor.tokenColorCustomizations', data.snapshot.tokens, targetConfig);
                return;
            }

            if (data.type === 'updateFrame') {
                const currentUI: any = JSON.parse(JSON.stringify(config.get('workbench.colorCustomizations') || {}));
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
                        } else if (key.toLowerCase().includes('disabled') || key.endsWith('placeholderForeground')) {
                            currentUI[key] = data.color + '66';
                        } else {
                            if (key === 'descriptionForeground' && data.scope === 'marketplace' && data.color.toLowerCase() === '#ff0000') {
                                delete currentUI[key]; 
                            } else {
                                currentUI[key] = data.color;
                            }
                        }
                    });
                    
                    const referenceBg = currentUI['editor.background'];
                    if (referenceBg) { 
                        const inheritedForeground = currentUI['foreground'];
                        const borderToken = currentUI['panel.border'] || currentUI['sideBar.border'];

                        if (borderToken) {
                            currentUI['debugToolBar.border'] = currentUI['debugToolBar.border'] || borderToken;
                            currentUI['debugWidget.border'] = currentUI['debugWidget.border'] || borderToken;
                        }
                        
                        currentUI['debugToolBar.background'] = currentUI['debugToolBar.background'] || currentUI['sideBar.background'] || referenceBg;
                        currentUI['debugWidget.background'] = currentUI['debugWidget.background'] || currentUI['sideBar.background'] || referenceBg;
                        
                        if (inheritedForeground) {
                            currentUI['debugConsole.infoForeground'] = currentUI['debugConsole.infoForeground'] || inheritedForeground;
                            currentUI['tooltip.foreground'] = currentUI['tooltip.foreground'] || inheritedForeground;
                            currentUI['editorHoverWidget.foreground'] = currentUI['editorHoverWidget.foreground'] || inheritedForeground;
                        }
                        
                        currentUI['debugConsoleInputIcon.foreground'] = currentUI['debugConsoleInputIcon.foreground'] || data.color;
                        currentUI['tooltip.background'] = currentUI['tooltip.background'] || referenceBg;
                        currentUI['editorHoverWidget.background'] = currentUI['editorHoverWidget.background'] || referenceBg;
                        currentUI['editorHoverWidget.statusBarBackground'] = currentUI['editorHoverWidget.statusBarBackground'] || referenceBg;
                        currentUI['editorWidget.background'] = currentUI['editorWidget.background'] || referenceBg;
                    }
                    await config.update('workbench.colorCustomizations', currentUI, targetConfig);
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
                }, targetConfig);

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
                    }, targetConfig);
                }
            }
            else if (data.type === 'requestSlotName') {
                const slotName = await vscode.window.showInputBox({
                    prompt: 'Enter a name for this custom theme preset:',
                    placeHolder: 'e.g., Cyberpunk Crimson, Muted Mint...'
                });

                if (slotName && slotName.trim() !== '') {
                    const slotId = 'slot_' + Date.now();
                    
                    const currentUI = JSON.parse(JSON.stringify(config.get('workbench.colorCustomizations') || {}));
                    const currentTokens = JSON.parse(JSON.stringify(config.get('editor.tokenColorCustomizations') || {}));
                    
                    await this._context.globalState.update(slotId, { 
                        ui: currentUI, 
                        tokens: currentTokens,
                        uiState: data.uiState 
                    });

                    let activeLibrary: any = this._context.globalState.get('theme_library_slots') || [];
                    activeLibrary.push({ id: slotId, name: slotName.trim() });
                    await this._context.globalState.update('theme_library_slots', activeLibrary);

                    const targetState = { 
                        ...JSON.parse(JSON.stringify(data.uiState)), 
                        savedSlots: activeLibrary 
                    };
                    
                    webviewView.webview.postMessage({ type: 'hydrate', uiState: targetState });
                    vscode.window.showInformationMessage(`Theme "${slotName}" captured successfully!`);
                }
            }
            else if (data.type === 'loadSlot') {
                const saved: any = this._context.globalState.get(data.slotId);

                if (saved) {
                    //Fall back to empty instead of setting them undefined right away 
                    const targetUI = saved.ui || {};
                    const targetTokens = saved.tokens || {};

                    // No leaks
                    await config.update('workbench.colorCustomizations', Object.keys(targetUI).length > 0 ? targetUI : undefined ,targetConfig);
                    await config.update('editor.tokenColorCustomizations', Object.keys(targetTokens).length > 0 ? targetTokens: undefined, targetConfig);
                    
                    let activeLibrary = this._context.globalState.get('theme_library_slots') || [];

                    const cleanUIState = saved.uiState || {};
                    const combinedState = JSON.parse(JSON.stringify({ ...cleanUIState, savedSlots: activeLibrary }));
                    
                    webviewView.webview.postMessage({ type: 'hydrate', uiState: combinedState });
                    vscode.window.showInformationMessage(`Loaded preset configuration!`);
                }
            }
            else if (data.type === 'deleteSlot') {
                const presetToDelete: any = this._context.globalState.get(data.slotId);

                if(presetToDelete){
                    const config = vscode.workspace.getConfiguration();
                    const currentActiveUI: any = config.get('workbench.colorCustomizations') || {};
                    const presetUI = presetToDelete.ui || {};

                    let isCurrentlyActive = true;
                    const presetKeys = Object.keys(presetUI);

                    if (presetKeys.length === 0 && Object.keys(currentActiveUI).length === 0){
                        isCurrentlyActive = true;
                    }else{
                        for (const key of presetKeys){
                            if (currentActiveUI[key] !== presetUI[key]){
                                isCurrentlyActive = false;
                                break;
                            } 
                        }
                        if (Object.keys(currentActiveUI).length !== presetKeys.length){
                            isCurrentlyActive = false;
                        }
                    }

                    if(isCurrentlyActive){
                        await config.update('workbench.colorCustomizations', {}, targetConfig);
                        await config.update('editor.tokenColorCustomizations', {}, targetConfig);
                    }else{
                        //Mismatch
                    }
                    let activeLibrary: any[] = this._context.globalState.get('theme_library_slots') || [];
                    activeLibrary = activeLibrary.filter(slot => slot.id !== data.slotId);

                    await this._context.globalState.update('theme_library_slots', activeLibrary);
                    await this._context.globalState.update(data.slotId, undefined);

                    if(isCurrentlyActive){
                        webviewView.webview.postMessage({
                            type:'hydrate',
                            uiState:{savedSlots: activeLibrary, isHardReset: true}
                        });
                    }else{
                        const currentUIState = this._context.globalState.get('theme_library_staet') || {};
                        const combinedState = {...currentUIState, savedSlots: activeLibrary};
                        webviewView.webview.postMessage({type: 'hydrate', uiState: combinedState});
                    }
                    vscode.window.showInformationMessage(`Removed preset from library.`);
                }
            }
            else if (data.type === 'reset') {

                //Safe wrap
                try {
                        await config.update('workbench.colorCustomizations', undefined, vscode.ConfigurationTarget.Workspace);
                        await config.update('editor.tokenColorCustomizations', undefined, vscode.ConfigurationTarget.Workspace);
                    } catch (e) {
                        // Workspace target unavailable; ignore and proceed to clean Global settings
                    }

                await config.update('workbench.colorCustomizations', undefined, vscode.ConfigurationTarget.Global);
                await config.update('editor.tokenColorCustomizations', undefined, vscode.ConfigurationTarget.Global);
                
                let activeLibrary = this._context.globalState.get('theme_library_slots') || [];

                webviewView.webview.postMessage({
                        type: 'hydrate',
                        uiState: {
                                savedSlots: activeLibrary,
                                isHardReset: true
                            } 
                    });
                vscode.window.showInformationMessage("Workspace live colors reset! Your saved theme library remains intact.");
            }
        });
    }
}