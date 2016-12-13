var contextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);

class Oscillator
{
	//Consists of an oscillator and an amp env.
	constructor()
	{
		this.test="Hello";
		this.osc = null;
		this.gainMaster = null;
		this.gainEnv = null;
		this.parameter = {
			freq:440,
			gain:1,
			a:0,
			d:1,
			s:1,
			r:3
		};
	}
}

class Synth
{
	
	envelopeGenerator()
	{
		$(document).on('gateOn', function(_){
		this.trigger();
		})
	};

	constructor()
	{
		//Our 6 operators
		this.op = [new Oscillator(), new Oscillator()];
		this.parameter =
		{
			freq: 440,
			gain:1,
			filterFreq:440,
			a : 0,
			d : 0.5,
			s : 2,
			r : 10
		};

		this.analyser = null;
		this.context = null;
		this.gainNode = null;
		this.oscillator = null;
		this.filterNode = null;
		this.filterFreq = 440;
		this.running = false;
	}
	//Synth.oscillator = null;


	noteOn()
	{
		for(var i = 0; i < this.op.length; i++)
		{
			this.noteOnOp(i)
		}
		var now = this.context.currentTime;
		this.filterNode.frequency.value = 0;
		this.filterNode.frequency.cancelScheduledValues(now);
		this.filterNode.frequency.linearRampToValueAtTime(this.parameter.filterFreq, now+this.parameter.a);
		this.filterNode.frequency.linearRampToValueAtTime(this.parameter.s * this.parameter.filterFreq, now+this.parameter.d);


	};

	noteOff()
	{
		for(var i = 0; i < this.op.length; i++)
		{
			this.noteOffOp(i)
		}
		var now = this.context.currentTime;
		this.filterNode.frequency.linearRampToValueAtTime(0, now+this.parameter.r);
	};

	noteOnOp(i)
	{
		var now = this.context.currentTime;
		this.op[i].gainEnv.gain.cancelScheduledValues(now);
		this.op[i].gainEnv.gain.linearRampToValueAtTime(1, now+this.op[i].parameter.a);
		this.op[i].gainEnv.gain.linearRampToValueAtTime(this.op[i].parameter.s, now+this.op[i].parameter.d);
	};

	noteOffOp(i)
	{
		var now = this.context.currentTime;
		this.op[i].gainEnv.gain.cancelScheduledValues(now);	
		console.log("r is: " + this.op[i].parameter.r);
		this.op[i].gainEnv.gain.linearRampToValueAtTime(0, now+this.op[i].parameter.r);
	};

	trigger()
	{
		console.log("trigger1");
		var now = this.context.currentTime;
		//this.gainNode.value = 0;
		this.op[1].gainEnv.gain.cancelScheduledValues(now);
		this.op[1].gainEnv.gain.linearRampToValueAtTime(1, now+this.op[1].parameter.a);
		this.op[1].gainEnv.gain.linearRampToValueAtTime(this.op[1].parameter.s, now+this.op[1].parameter.d);
		this.op[1].gainEnv.gain.linearRampToValueAtTime(0, now+this.op[1].parameter.r);

		this.op[0].gainEnv.gain.cancelScheduledValues(now);
		this.op[0].gainEnv.gain.linearRampToValueAtTime(1, now+this.op[0].parameter.a);
		this.op[0].gainEnv.gain.linearRampToValueAtTime(this.op[1].parameter.s, now+this.op[0].parameter.d);
		this.op[0].gainEnv.gain.linearRampToValueAtTime(0, now+this.op[0].parameter.r);
	 
		this.filterNode.frequency.value = 0;
		this.filterNode.frequency.cancelScheduledValues(now);
		this.filterNode.frequency.linearRampToValueAtTime(this.parameter.filterFreq, now+this.parameter.a);
		this.filterNode.frequency.linearRampToValueAtTime(this.parameter.s * this.parameter.filterFreq, now+this.parameter.d);
		this.filterNode.frequency.linearRampToValueAtTime(0, now+this.parameter.r);
		console.log("trigger2");

	};

	start()
	{
		if(this.running)
		{
			return;
		}
		else if (contextClass)
		{
			this.running = true;
			// Web Audio API is available.
			this.context = new contextClass();

			//Create our first oscillator
			if(this.op[0] == null)
			{
				console.log("hmm1");
				this.op[0] =new Oscillator();
			}
			if(this.op[0] == null)
			{
				console.log("hmm");
			}
			console.log(this.op[0].test);

			//create Oscillators.
			for(var i = 0; i < this.op.length; i++)
			{
				this.op[i].osc = this.context.createOscillator();
				this.op[i].gainEnv = this.context.createGain();
				this.op[i].gainMaster = this.context.createGain();
			}
			
			//Create our gain and LP filter
			//this.modOscillator = this.context.createOscillator();
			this.gainNode = this.context.createGain();
			this.filterNode = this.context.createBiquadFilter();
			this.analyser = this.context.createAnalyser();

			//Connect our nodes together
			this.op[0].osc.connect(this.op[0].gainEnv);
			this.op[0].gainEnv.connect(this.op[0].gainMaster);
			this.op[0].gainMaster.connect(this.op[1].osc.frequency);

			this.op[1].osc.connect(this.op[1].gainEnv);
			this.op[1].gainEnv.connect(this.op[1].gainMaster);
			this.op[1].gainMaster.connect(this.filterNode);
			this.filterNode.connect(this.gainNode);
			this.gainNode.connect(this.analyser);
			this.analyser.connect(this.context.destination);
			this.op[0].osc.frequency.value = 300;
			this.op[0].gainMaster.gain.value = 30;
			this.op[0].osc.frequency.value = this.parameter.freq;
			this.op[1].osc.detune.value = 5 * 100;
			this.op[1].type = 'square';

			this.op[1].gainMaster.gain.value = 1;

			this.filterNode.type = 'lowpass';
			this.filterNode.frequency.value = 100;

			this.op[0].osc.start(0);
			this.op[1].osc.start(0);


		} else {
			// Web Audio API is not available. Ask the user to use a supported browser.
			alert('Web Audio API unavailable!');
		}
	}

	stop()
	{
		this.op[1].osc.stop(0);
		this.op[1].osc.disconnect();
		this.running = false;
	};

	updateNodes()
	{

		this.filterNode.frequency.value = this.parameter.freq;
		this.gainNode.gain.value = this.parameter.gain;
	};

	changeParameter(param, value)
	{
		console.log(param + " "  + value);
		this.parameter[param] = 1*value;
		this.updateNodes();
	};

	changeOpParameter(i, param, value)
	{
		console.log("Parameter is: " + param + ", value: " + value);
		this.op[i].parameter[param] = 1*value;
		console.log("entering updateOpNodes");
		this.updateOpNodes(i);
		console.log("out changeOpParameter");
	};

	updateOpNodes(i)
	{
		console.log("freq: " + this.op[i].parameter.freq);
		this.op[i].osc.frequency.value = this.op[i].parameter.freq;
		console.log("gain: " + this.op[i].parameter.gain);
		this.op[i].gainMaster.gain.value = this.op[i].parameter.gain;
	};

	changeFilterFrequency(val)
	{
	this.filterFrequency = val;
	this.filterNode.frequency.value = this.filterFrequency;
	};

	changeGain(val)
	{
	this.gain = val;
	this.gainNode.gain.value = this.gain;
	};
};

var synth = new Synth();
console.log(synth.op[0].test);


