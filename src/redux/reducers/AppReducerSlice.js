//Import axios
import { axios } from 'axios'

//Action types
import * as actionTypes from '../actionTypes'

//GLSL template imports
import * as GLSLCompiler from '../../glsl/compiler/GLSLCompiler'
import VERT_SHADER_TEMPLATE from '../../glsl/templates/vert.glsl'
import FRAG_SHADER_TEMPLATE from '../../glsl/templates/frag.glsl'


//The initial state
export const APP_INITIAL_STATE =
{
    previewMode: "manual",
    vertSrc: VERT_SHADER_TEMPLATE,
    fragSrc: FRAG_SHADER_TEMPLATE,
    threejs: {
        renderer: null,
        obj: null,
        loadStatus: "not-loading",
        objSource: null
    },
    errors: {
        detailed: [],
        pretty: []
    },
    settings: { 
        transparentBackground: true
    },
    compileStatus: GLSLCompiler.COMPILE_STATUS_PASS
}

const setPreviewMode = (state, mode) => 
{
    return {
        ...state,
        previewMode: mode
    };
}

const setVertFragSrc = (state, vert, frag) =>
{
    return {
        ...state, 
        vertSrc: vert,
        fragSrc: frag
    };
}

const setVertFragErrors = (state, errors) =>
{
    return {
        ...state,
        errors: errors
    }
}

const setThreeJSRenderer = (state, renderer) =>
{
    return {
        ...state, 
        threejs: {
            ...state.threejs,
            renderer: renderer
        }
    }
}

const setThreeJSStatus = (state, status) =>
{
    return {
        ...state,
        threejs: {
            ...state.threejs,
            loadStatus: status
        }
    }
}

const setCompileStatus = (state, status) => 
{
    return {
        ...state,
        compileStatus: status
    }
}

const setSettingsKeyValue = (state, key, value) =>
{
    return {
        ...state,
        settings: {
            ...state.settings,
            [key]: value
        }
    }
}


function setShadersFromPath(store, payload)
{
    //Extract to separate variables
    const vert = payload.vert;
    const frag = payload.frag;

    //Set v+f src
    return setVertFragSrc(store, vert, frag);
}

function setLoadObjectPath(store, payload)
{
    return {
        ...store,
        threejs: {
            ...store.threejs,
            obj: payload.obj
        }
    }
}

function setThreeJSObjSource(store, payload)
{
    return {
        ...store,
        threejs: {
            ...store.threejs,
            objSource: payload.objSource
        }
    }
}

export default function(state = APP_INITIAL_STATE, action) 
{
    if (action.type == actionTypes.PREVIEW_VIEW_TOGGLE_TOGGLED)
    {
        //It's manual? Set to auto
        if(state.previewMode == "manual")
            return setPreviewMode(state, 'auto');

        //And vice-versa...
        else
            return setPreviewMode(state, 'manual');
    }

    if(action.type == actionTypes.EDITOR_VERTFRAG_SRC_UPDATED)
        return setVertFragSrc(state, action.payload.vert, action.payload.frag);

    if(action.type == actionTypes.EDITOR_VERTFRAG_ERRORS_UPDATED)
        return setVertFragErrors(state, action.payload.errors);

    if(action.type == actionTypes.THREEJS_UPDATE_RENDERER)
        return setThreeJSRenderer(state, action.payload.renderer);

    if (action.type == actionTypes.THREEJS_UPDATE_LOAD_STATUS)
        return setThreeJSStatus(state, action.payload.status);

    if (action.type == actionTypes.THREEJS_UPLOAD_MODEL)
        return setThreeJSObjSource(state, action.payload);

    if(action.type == actionTypes.EDITOR_UPDATE_COMPILE_STATUS)
        return setCompileStatus(state, action.payload.status);

    if(action.type == actionTypes.ASYNC_LOAD_SHADER_EXAMPLE)
        return setShadersFromPath(state, action.payload);

    if(action.type == actionTypes.ASYNC_LOAD_OBJECT_EXAMPLE)
        return setLoadObjectPath(state, action.payload);

    if(action.type == actionTypes.EDITOR_SETTINGS_UPDATE_KEY_VALUE)
        return setSettingsKeyValue(state, action.payload.key, action.payload.value);



    return state;
}
