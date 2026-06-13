export interface UIZoneMapping {
    name: string;
    description: string;
    workbenchKeys: string[];
}

export const FRAME_MAP: Record<string, UIZoneMapping> = {
    'leftPanel': {
        name: 'Left Panel (Sidebar)',
        description: 'Controls the primary sidebar container background, badges, and its selection items.',
        workbenchKeys: [
            'sideBar.background',
            'sideBar.foreground',
            'sideBar.border',
            'sideBarTitle.foreground',
            'activityBar.background',
            'activityBar.foreground',
            'activityBar.inactiveForeground',
            'activityBar.border',
            'activityBarBadge.background',
            'activityBarBadge.foreground'
        ]
    },
    'rightPanel': {
        name: 'Right Panel (Auxiliary Bar)',
        description: 'Controls the secondary right-hand sidebar panels.',
        workbenchKeys: [
            'auxiliaryBar.background',
            'auxiliaryBar.foreground',
            'auxiliaryBar.border',
            'auxiliaryBarTitle.foreground'
        ]
    },
    'topPanel': {
        name: 'Top Panel & Global Search',
        description: 'Controls the layout header, window title controls, and global search widgets.',
        workbenchKeys: [
            'titleBar.activeBackground',
            'titleBar.activeForeground',
            'titleBar.border',
            'searchEditor.textInputBorder',
            'input.background',
            'input.foreground',
            'input.border'
        ]
    },
    'bottomPanel': {
        name: 'Bottom Panel & Status Bar',
        description: 'Controls the status container metadata bar and embedded output panels.',
        workbenchKeys: [
            'statusBar.background',
            'statusBar.foreground',
            'statusBar.border',
            'statusBar.debuggingBackground',
            'statusBar.debuggingForeground',
            'statusBarItem.hoverBackground',
            'panel.background',
            'panel.border',
            'panelTitle.activeForeground',
            'panelTitle.inactiveForeground'
        ]
    },
    'editorBackground': {
        name: 'Code Editor Canvas',
        description: 'Alters the layout backdrop surface color behind text frames.',
        workbenchKeys: [
            'editor.background',
            'editorLayout.background',
            'breadcrumb.background',
            'editorGroupHeader.tabsBackground'
        ]
    },
    'editorGutter': {
        name: 'Editor Line Numbers & Font Margin',
        description: 'Customizes line coordinates, font offsets, and side breakpoints.',
        workbenchKeys: [
            'editorLineNumber.foreground',
            'editorLineNumber.activeForeground',
            'editorGutter.background',
            'editorGutter.modifiedBackground',
            'editorGutter.addedBackground',
            'editorGutter.deletedBackground'
        ]
    }
};