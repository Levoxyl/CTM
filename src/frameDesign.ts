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
        workbenchKeys: ['titleBar.activeBackground', 'titleBar.border', 'input.background']
    },
    'bottomPanel': {
        name: 'Bottom Bar & Panels Background',
        description: 'Background surface for the status bar and bottom output/terminal panels.',
        workbenchKeys: ['statusBar.background', 'statusBar.border', 'panel.background', 'panel.border']
    },
    'editorBackground': {
        name: 'Code Editor Canvas Background',
        description: 'Main coding window canvas backdrop surface.',
        workbenchKeys: [
            'editor.background', 
            'editorLayout.background', 
            'breadcrumb.background', 
            'editorGroupHeader.tabsBackground',
            'tab.inactiveBackground',
            'tab.activeBackground'
        ]
    },
    // NEW ISOLATED TEXT / UI UTILITY PICKS
    'uiGeneralText': {
        name: 'UI Interactive General Text',
        description: 'Global text typography elements across sidebars, files tree, and layout tabs.',
        workbenchKeys: [
            'sideBar.foreground',
            'sideBarTitle.foreground',
            'sideBarSectionHeader.foreground',
            'titleBar.activeForeground',
            'panelTitle.activeForeground',
            'panelTitle.inactiveForeground',
            'tab.activeForeground',
            'tab.inactiveForeground',
            'input.foreground',
            'list.hoverForeground',
            'list.activeSelectionForeground'
        ]
    },
    'uiIconsAndVectors': {
        name: 'UI System Action Icons',
        description: 'SVG Vector elements, activity bar indicators, and layout badges.',
        workbenchKeys: [
            'activityBar.foreground',
            'activityBar.inactiveForeground',
            'activityBarBadge.background',
            'activityBarBadge.foreground',
            'tree.indentGuidesStroke',
            'statusBar.foreground',
            'statusBar.debuggingForeground'
        ]
    },
    'editorLineNumbers': {
        name: 'Editor Line Numbers Typography',
        description: 'Isolates the actual code line indexing numbers running down the gutter.',
        workbenchKeys: [
            'editorLineNumber.foreground',
            'editorLineNumber.activeForeground'
        ]
    }
};