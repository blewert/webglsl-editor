import React from 'react'
import codeExamples from '../cfg/examples.json'
import { connect } from 'react-redux'
import * as actionTypes from '../redux/actionTypes'
import axios from 'axios'

import { threejsUpdateLoadStatus } from '../redux/actions'
import MenuPopout from './MenuPopout'

class ExamplesMenu extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    onExampleClick(item)
    {
        //Load the shader
        this.props.loadShader(item.vert, item.frag);
    }

    render()
    {        
        //Just make a popout menu
        return <MenuPopout onItemClicked={this.onExampleClick.bind(this)} data={codeExamples}/>
    }
}


const mapDispatchToProps = dispatch => ({
    loadShader: (vert, frag) => dispatch(async () =>
    {
        //Dispatch load status update
        dispatch(threejsUpdateLoadStatus("loading"));

        //Get vert + frag
        const vertSrc = await axios.get(vert);
        const fragSrc = await axios.get(frag);

        //Dispatch load status update
        dispatch(threejsUpdateLoadStatus("not-loading"));

        //Dispatch with that data
        dispatch({
            type: actionTypes.ASYNC_LOAD_SHADER_EXAMPLE,
            payload: {
                vert: vertSrc.data,
                frag: fragSrc.data
            }
        })
    })
});

export default connect(null, mapDispatchToProps, null, { forwardRef: true })(ExamplesMenu);