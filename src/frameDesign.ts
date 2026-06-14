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
        workbenchKeys: ['activityBar.background', 'activityBar.border']
    },
    'sideBar': {
        name: 'Left Panel R (Explorer Background)',
        description: 'Background surface for the file tree and folders window.',
        workbenchKeys: [
            'sideBar.background', 
            'sideBar.border', 
            'sideBarSectionHeader.background', 
            'sideBarSectionHeader.border'
        ]
    },
    'topPanel': {
        name: 'Top Panel Background',
        description: 'Background for the window title and top search layout.',
        workbenchKeys: [
            'titleBar.activeBackground', 
            'titleBar.inactiveBackground', 
            'titleBar.border', 
            'input.background'
        ]
    },
    'bottomPanel': {
        name: 'Bottom Bar & Panels Background',
        description: 'Background surface for the status bar and bottom output/terminal panels.',
        workbenchKeys: [
            'statusBar.background', 
            'statusBar.border', 
            'statusBar.debuggingBackground',
            'statusBar.noFolderBackground',
            'panel.background', 
            'panel.border',
            'panelSectionHeader.background',
            'terminal.background',
            'terminal.border',
            'badge.background',
            'activityBarBadge.background'
        ]
    },
    'editorBackground': {
        name: 'Code Editor Canvas Background',
        description: 'Main coding window canvas backdrop surface.',
        workbenchKeys: [
            'editor.background', 
            'editorLayout.background', 
            'breadcrumb.background', 
            'editorGroupHeader.tabsBackground',
            'editorGroupHeader.tabsBorder',
            'editorGroupHeader.border',
            'tab.activeBackground', 
            'tab.inactiveBackground',
            'tab.unfocusedActiveBackground',
            'tab.unfocusedInactiveBackground',
            'editorGutter.background',
            'editorStickyScroll.background',
            'editorStickyScroll.border',
            'editorStickyScrollHover.background'
        ]
    },
    'uiGeneralText': {
        name: 'UI Interactive General Text',
        description: 'Global text typography elements across sidebars, files tree, and layout tabs.',
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

            // ==========================================
            // EXSTENSIVE STATE FIXES FOR INACTIVE ITEMS
            // ==========================================
            'disabledForeground',                   // Global fallback for disabled interface elements
            'menu.disabledForeground',              // Fixes grayed out context items (Save All, Go/Run actions)
            'list.disabledForeground',              // Fixes disabled sidebar interactions
            'menu.shortcutForeground',              // Makes keyboard shortcuts listed in menus completely readable
            'list.secondaryForeground',             // Fixes subtext/file paths in search dialog boxes
            'input.placeholderForeground',          // Fixes pale prompt text inside search inputs
            'breadcrumb.foreground',                // Top code path track layout text
            'breadcrumb.focusForeground',           
            'breadcrumb.activeSelectionForeground'
        ]
    },
    'uiIconsAndVectors': {
        name: 'UI System Action Icons',
        description: 'SVG Vector elements, activity bar indicators, and layout badges.',
        workbenchKeys: [
            'activityBar.foreground',
            'activityBar.inactiveForeground',
            'tree.indentGuidesStroke',
            'statusBar.foreground',
            'statusBar.debuggingForeground',
            'activityBar.activeBorder'
        ]
    },
    'editorLineNumbers': {
        name: 'Editor Line Numbers Typography',
        description: 'Isolates the actual code line indexing numbers running down the gutter.',
        workbenchKeys: [
            'editorLineNumber.foreground',
            'editorLineNumber.activeForeground'
        ]
    },
    'uiInteractiveStates': {
        name: 'UI Selection, Hovers & Menus',
        description: 'Forces selection block updates, dropdown fields, and app menu highlights.',
        workbenchKeys: [
            'list.hoverBackground',
            'list.activeSelectionBackground',
            'list.inactiveSelectionBackground',
            'list.focusBackground',
            'editor.lineHighlightBackground',
            'editor.selectionBackground',
            'tab.hoverBackground',
            'tab.unfocusedHoverBackground',
            'panelTitle.activeBorder', 
            'tab.activeBorder',
            'tab.activeBorderTop',
            'quickInput.background',
            'quickInputList.focusBackground',
            'pickerGroup.border',
            'dropdown.background',
            'dropdown.border',
            'dropdown.listBackground',
            'selectBox.background',
            'selectBox.border',
            'combobox.background',
            'combobox.border',
            'window.activeBorder',
            'menubar.selectionBackground',
            'menu.background',
            'menu.selectionBackground',
            'menu.border',
            'menu.separatorBackground',
            'widget.border',
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
            'settings.dropdownBorder',
            'settings.checkboxBackground',
            'settings.checkboxBorder',
            'settings.textInputBackground',
            'settings.textInputBorder'
        ]
    }
};