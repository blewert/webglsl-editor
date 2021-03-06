import React from "react";
import ReactDOM from "react-dom";

//Redux
import { Provider, dispatch, useSelector, useDispatch, connect } from 'react-redux'
import store from './redux/store'
import { threejsUploadObject } from './redux/actions'

//ACE
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-glsl";
import "ace-builds/src-noconflict/snippets/glsl";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/keybinding-vscode"

//Sass
import './sass/main.sass';

//GLSL template imports
import VERT_SHADER_TEMPLATE from './glsl/templates/vert.glsl'
import FRAG_SHADER_TEMPLATE from './glsl/templates/frag.glsl'

//Components
import CodeEditor from './components/CodeEditor'
import CodeEditorTab from './components/CodeEditorTab'
import PreviewView from './components/PreviewView'
import StatusBox from './components/StatusBox'
import MenuPopoutButton from './components/MenuPopoutButton'
import Modal from './components/modals/Modal'
import UploadObjectModal from './components/modals/UploadObjectModal'

//Import config
import config from './cfg/config.json'
import BinaryToggle from "./components/BinaryToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAlt, faRobot, faCog, faCode, faCube, faUpload } from "@fortawesome/free-solid-svg-icons";
import { SideBarContent, SideBarItem } from "./components/SideBarContent";
import SettingsPane from "./components/left-side-pane/SettingsPane";
import ExamplesMenu from "./components/ExamplesMenu";
import ObjectExamplesMenu from "./components/ObjectExamplesMenu";


class App extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = 
		{
			leftSidePaneMode: null,
			modalMode: null
		}

		this.timer = null;
		this.fragTabRef = React.createRef();
		this.vertTabRef = React.createRef();

		//Show config info for debugging purposes
		console.log(`%c${config.projectName}\n${this.getVersion()}`, 'font-weight: bold; font-size: 14pt; background-color: black; color: white;');
	}

	getVersion(long=true)
	{
		if(long)
			return `${config.projectVersion}-${VERSION}-${BRANCH}`;
		else
			return `${config.projectVersion}`;
	}

	onSideBarSettingsClick(event)
	{
		// alert("This feature isn't implemented yet. Sorry!");
		this.setState({ leftSidePaneMode: (this.state.leftSidePaneMode == "settings") ? (null) : ("settings") });
	}

	onModalClose()
	{
		this.setState({ modalMode: null });
	}

	onObjUploaded(text)
	{
		store.dispatch(threejsUploadObject(text));
	}

	getModal()
	{
		if(this.state.modalMode == null)
			return null;
		
		else if(this.state.modalMode == "upload-model")
			return <UploadObjectModal onObjUploaded={this.onObjUploaded.bind(this)} onModalClose={this.onModalClose.bind(this)} />;
	}

	showUploadObjModal() 
	{
		//Set state
		this.setState({ modalMode: "upload-model" });
	}
	

	getLeftSidePane()
	{
		//Settings? show settings
		if(this.state.leftSidePaneMode == "settings")
			return <SettingsPane />

		return null;
	}

	render()
	{
		return(
			<Provider store={store}>
				<main>
					{this.getModal()}
					<aside className="left-bar">
						<div className="left-side">
							<div className="top">
								<img src="assets/logos/logomono-lod.png" title={`${config.projectName}\n${this.getVersion()}`} />
							</div>
							<div className="middle">
								<SideBarContent>
									<SideBarItem onClick={this.onSideBarSettingsClick.bind(this)} icon={faCog} title="Settings" paneKey="settings" activePane={this.state.leftSidePaneMode} />
									{/* <SideBarItem icon={faArrowsAlt} title="Settings" /> */}
								</SideBarContent>
							</div>
						</div>
						<div className="right-side">
							{this.getLeftSidePane()}
						</div>
					</aside>
					<div className="right-view">
						<header>
							<div className="right-pane">
								<StatusBox />
								<MenuPopoutButton id="upload-object-button" icon={faUpload} title="Upload 3D Model" onClick={this.showUploadObjModal.bind(this)} />
								<MenuPopoutButton id="object-examples" icon={faCube} title="Object Examples">
									<ObjectExamplesMenu />
								</MenuPopoutButton>
								<MenuPopoutButton id="shader-examples" icon={faCode} title="Shader Examples">
									<ExamplesMenu />
								</MenuPopoutButton>
								<BinaryToggle keys={["manual", "auto"]} icons={[ faArrowsAlt, faRobot ]}/>
							</div>
						</header>
						<div className="split-pane">
							<CodeEditor tabs={["Vertex", "Fragment"]}/>
							<PreviewView />
						</div>
					</div>
				</main>
			</Provider>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("AppContainer"));