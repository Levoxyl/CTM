// frameDesign.ts

export interface UIZoneMapping {
    name: string;
    description: string;
    workbenchKeys: string[];
}

export const FRAME_MAP: Record<string, UIZoneMapping> = {
    'activityBar': {
        name: 'Left Panel L (Icon Strip Background)',
        description: 'Background surface for the far left icon column.',
        workbenchKeys: ['activityBar.background']
    },
    'sideBar': {
        name: 'Left Panel R (Explorer Background)',
        description: 'Background surface for the file tree, solutions, and C# Dev Kit views.',
        workbenchKeys: ['sideBar.background', 'sideBarSectionHeader.background']
    },
    'topPanel': {
        name: 'Top Panel Background',
        description: 'Background for the window title and top search layout.',
        workbenchKeys: ['titleBar.activeBackground', 'titleBar.inactiveBackground', 'input.background']
    },
    'bottomPanel': {
        name: 'Bottom Bar & Panels Background',
        description: 'Background surface for the status bar and bottom output/terminal panels.',
        workbenchKeys: [
            'statusBar.background', 
            'statusBar.debuggingBackground',
            'statusBar.noFolderBackground',
            'panel.background', 
            'panelSectionHeader.background',
            'terminal.background',
            'badge.background',
            'activityBarBadge.background'
        ]
    },
    'editorBackground': {
        name: 'Code Editor Canvas Background',
        description: 'Main coding window canvas backdrop surface and context overlays.',
        workbenchKeys: [
            'editor.background', 
            'editorLayout.background', 
            'breadcrumb.background', 
            'editorGroupHeader.tabsBackground',
            'tab.activeBackground', 
            'tab.inactiveBackground',
            'tab.unfocusedActiveBackground',
            'tab.unfocusedInactiveBackground',
            'editorGutter.background',
            'editorStickyScroll.background',       
            'editorStickyScrollHover.background'   
        ]
    },
    'uiGeneralText': {
        name: 'UI Panel Text, Menus & Gutter Numbers',
        description: 'Global text typography elements across windows, sidebars, context menus, and editor line numbers.',
        workbenchKeys: [
            'foreground', 
            'sideBar.foreground',
            'sideBarTitle.foreground',
            'sideBarSectionHeader.foreground',
            'titleBar.activeForeground',
            'titleBar.inactiveForeground',
            'panelTitle.activeForeground',
            'panelTitle.inactiveForeground',
            'input.foreground',
            'badge.foreground',
            'activityBarBadge.foreground',
            'terminal.foreground',
            'menubar.selectionForeground',
            'tab.activeForeground',
            'tab.inactiveForeground',
            'tab.hoverForeground',
            'tab.unfocusedActiveForeground',
            'tab.unfocusedInactiveForeground',
            'tab.unfocusedHoverForeground',
            'list.hoverForeground',
            'list.activeSelectionForeground',
            'list.inactiveSelectionForeground',
            'list.focusForeground',
            'quickInput.foreground',
            'quickInputList.focusForeground',
            'dropdown.foreground',
            'selectBox.foreground',
            'combobox.foreground',
            'menu.foreground',
            'menu.selectionForeground',
            'disabledForeground',                    
            'menu.disabledForeground',              
            'list.disabledForeground',              
            'menu.shortcutForeground',              
            'list.secondaryForeground',             
            'input.placeholderForeground',          
            'breadcrumb.foreground',                
            'breadcrumb.focusForeground',            
            'breadcrumb.activeSelectionForeground',
            'list.deemphasizedItems.foreground',    
            'gitDecoration.ignoredResourceForeground', 
            'gitDecoration.submoduleResourceForeground',
            'editorLineNumber.foreground',
            'editorLineNumber.activeForeground'
        ]
    },
    'uiIconsAndVectors': {
        name: 'UI System Action Icons',
        description: 'SVG Vector elements, activity bar indicators, and layout badges.',
        workbenchKeys: [
            'icon.foreground',                                     
            'activityBar.foreground',
            'activityBar.inactiveForeground',
            'tree.indentGuidesStroke',
            'statusBar.foreground',
            'statusBar.debuggingForeground',
            'activityBar.activeBorder'
        ]
    },
    'uiLayoutBorders': {
        name: 'UI Layout Borders & Form Fields',
        description: 'Isolates structural frames, bottom borders, window split lines, and panel input fields.',
        workbenchKeys: [
            'activityBar.border',
            'sideBar.border',
            'sideBarSectionHeader.border',
            'titleBar.border',
            'panel.border',
            'panelSectionHeader.border',
            'panelSection.border',
            'terminal.border',
            'editorGroupHeader.tabsBorder',
            'editorGroupHeader.border',
            'editorStickyScroll.border',
            'tab.border',                                           
            'tab.inactiveBorder',
            'statusBar.border',
            'statusBar.debuggingBorder',
            'statusBar.noFolderBorder',
            'sash.hoverBorder',                                     
            'window.activeBorder',
            'menu.border',
            'widget.border',
            'input.border',                                         
            'panelInput.border',
            'dropdown.border',
            'selectBox.border',
            'combobox.border',
            'pickerGroup.border',
            'settings.dropdownBorder',
            'settings.checkboxBorder',
            'settings.textInputBorder',
            'focusBorder'                                           
        ]
    },
    'uiInteractiveStates': {
        name: 'UI Selection, Hovers & Menus',
        description: 'Forces selection block updates, falling autocompletion menus, dropdown fields, and app highlights.',
        workbenchKeys: [
            'list.hoverBackground',
            'list.activeSelectionBackground',
            'list.inactiveSelectionBackground',
            'list.focusBackground',
            'list.focusOutline',
            'editor.lineHighlightBackground',
            'editor.lineHighlightBorder',
            'editor.selectionBackground',
            'editor.inactiveSelectionBackground',
            'editor.selectionHighlightBackground',
            'tab.hoverBackground',
            'tab.unfocusedHoverBackground',
            'panelTitle.activeBorder', 
            'tab.activeBorder',
            'tab.activeBorderTop',
            'quickInput.background',
            'quickInputList.focusBackground',
            'dropdown.background',
            'dropdown.listBackground',
            'selectBox.background',
            'combobox.background',
            'menubar.selectionBackground',
            'menu.background',
            'menu.selectionBackground',
            'menu.separatorBackground',
            'editorSuggestWidget.background',
            'editorSuggestWidget.border',
            'editorSuggestWidget.foreground',
            'editorSuggestWidget.selectedBackground',
            'editorSuggestWidget.highlightForeground',
            'editorSuggestWidget.focusHighlightForeground',
            'widget.shadow',
            'toolbar.hoverBackground',
            'toolbar.activeBackground',
            'terminalCursor.foreground',
            'terminalCursor.background',
            'terminal.ansiBlack', 'terminal.ansiRed', 'terminal.ansiGreen', 'terminal.ansiYellow',
            'terminal.ansiBlue', 'terminal.ansiMagenta', 'terminal.ansiCyan', 'terminal.ansiWhite',
            'settings.headerForeground',
            'settings.modifiedItemIndicator',
            'settings.dropdownBackground',
            'settings.checkboxBackground',
            'settings.textInputBackground'
        ]
    }
};