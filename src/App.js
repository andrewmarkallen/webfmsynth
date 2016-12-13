import React from 'react';
import ReactDOM from 'react-dom';
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import 'bootstrap/less/bootstrap.less';
import Visualiser from './visualisation/visualiser.js'
//import Navbar from 'react-bootstrap/lib/Navbar';

var header = document.querySelector("#header");
var synths = document.querySelector("#synths");
var controls = document.querySelector("#controls");
var keyboard = document.querySelector("#keyboard");
var app = document.querySelector("#app");
var visualiser = document.querySelector("#visualiser");

var vis; 

var VisualiserComponent = React.createClass({

	toggleMode: function(e)
	{
		vis.draw();
	},

	visualise: function(e)
	{
		vis = new Visualiser(synth);
	},

	render: function()
	{
		return(
			<div className = "VisualiserComponent">
				<button onClick={this.toggleMode}>Toggle</button>
				<button onClick={this.visualise}>Visualise</button>
			</div>
			);
	}
});

var Oscillator = React.createClass({

	changeParameter: function(e)
	{
		synth.changeOpParameter(this.props.index, e.target.id, e.target.value);
		console.log(e.target.id + ": " + e.target.value);
	},

	render: function()
	{
		return(
		<div className = "Oscillator">
			<Slider name="Gain:" id="gain" min="0" max="50" step="0.01" value="0.5" clickHandler={this.changeParameter} />
			<Slider name="Frequency:" id="freq" min="0" max="2000" step="1" value="440" clickHandler={this.changeParameter}/>
			<Slider name="Attack:" id="a" min="0" max="5" step="0.01" value="1" clickHandler={this.changeParameter} />
			<Slider name="Decay:" id="d" min="0" max="5" step="0.01" value="1" clickHandler={this.changeParameter} />
			<Slider name="Sustain:" id="s" min="0" max="5" step="0.01" value="1" clickHandler={this.changeParameter} />
			<Slider name="Release:" id="r" min="0" max="5" step="0.01" value="1" clickHandler={this.changeParameter} />
		</div>
		);
	}
});

var SynthControls = React.createClass({
	
	changeParameter: function(e)
	{
		console.log(e.target.id + ": " + e.target.value);
		synth.changeParameter(e.target.id, e.target.value);
	},

	render: function()
	{
		return(
		<div className="SynthControls">
			<Slider name="Gain:" id="gain" min="0" max="1" step="0.0001" value="0.5" clickHandler={this.changeParameter} />
		</div>
		);
	}
});

var Slider = React.createClass({

	render: function()
	{
		return(
		<div className="Slider">{this.props.name}<input 
		id={this.props.id}
		type="range"
		min={this.props.min}
		max={this.props.max}
		step={this.props.step}
		defaultValue={this.props.value}
		onChange={this.props.clickHandler}
		/>
		 </div>

		);
	}
});


var Keyboard = React.createClass({

	eventListener: function(e)
	{
		console.log("event fired!");
	},

	render: function()
	{
		return(
		<div className="Keyboard">
			<Key note="C4"/>
			<Key note="D4"/>
			<Key note="E4"/>
		</div>
		);
	}
});

var Key = React.createClass({

	noteOn: function()
	{
		console.log("note On");
		synth.changeOpParameter(0,"freq",noteMap[this.props.note]);
		synth.changeOpParameter(1,"freq",noteMap[this.props.note]);

		synth.noteOn();
	},

	noteOff: function()
	{
		synth.noteOff();
		console.log("note Off");
	},

	render: function()
	{
		return(
			<button onMouseDown={this.noteOn} 
					onMouseUp={this.noteOff}
			className ="note">{this.props.note}</button>
		);
	}
});


//ReactDOM.render(<Navbar></Navbar>, app);
ReactDOM.render(<Keyboard></Keyboard>, keyboard);
ReactDOM.render(<SynthControls></SynthControls>, controls);
ReactDOM.render(
	<div>
		<Grid>
		<Row className="show-grid">
			<Col xs={6} md={2}><Oscillator index="0"/></Col>
			<Col xs={6} md={2}><Oscillator index="1"/></Col>
			<Col xs={6} md={2}><Oscillator index="2"/></Col>
			<Col xs={6} md={2}><Oscillator index="3"/></Col>
			<Col xs={6} md={2}><Oscillator index="4"/></Col>
			<Col xs={6} md={2}><Oscillator index="5"/></Col>
		</Row>
		</Grid>	
	</div>,
	synths
	);
ReactDOM.render(<VisualiserComponent></VisualiserComponent>, visualiser);

