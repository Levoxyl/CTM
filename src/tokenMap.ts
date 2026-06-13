
interface TokenMapping {
    textMate: string[];
    semantic: string[];
}
export const MASTER_MAP: Record<string, TokenMapping> = {
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