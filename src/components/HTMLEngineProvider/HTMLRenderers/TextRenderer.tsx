import React from 'react';

function TextRenderer({TDefaultRenderer, textProps, ...props}) {
    return (
        <TDefaultRenderer
            {...props}
            textProps={{...textProps, numberOfLines: props.tnode.attributes.line}}
        />
    );
}

export default TextRenderer;
