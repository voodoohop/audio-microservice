
const log = (descriptor => ((...args) => console.log(descriptor,...args)))



const midiTransformers = [
    {
        match: ([type,note]) => type === 144 && note === 126, // NOTE ON
        replace: () => [252] // Midi Clock Start
    },
    {
        match: ([type,note]) => type === 144 && note === 127, //NOTE ON
        replace: () => [248] // Midi Clock Tick
    }
]

async function accessMidi() {
    const access = await navigator.requestMIDIAccess()

    const newlyConnectedMidiDevices$ = most
    .fromEvent("statechange", access)
    .filter(({port}) => port.state === "connected")
    .map(({port}) => port)
// 
    const alreadyConnectedMidiInputDevices$ = most.from(access.inputs.values())
    const alreadyConnectedMidiOutputDevices$ = most.from(access.outputs.values())

    const midiDevices$ = most.mergeArray([newlyConnectedMidiDevices$, alreadyConnectedMidiInputDevices$,alreadyConnectedMidiOutputDevices$])
    .tap(log("connected"))
    .multicast()


    const midiFromAbleton$ = most
        .switch(
            midiDevices$
            .filter(({name}) => name === "IAC Driver IAC Bus 2")
            .filter(d => d instanceof MIDIInput)
            .map(d => most.fromEvent("midimessage",d)))

            .map(({data}) => data)
            .tap(log("midi"))  
            .multicast()
           
    


    const midiToTwister$ = most.mergeArray(midiTransformers.map(({match, replace}) => midiFromAbleton$.filter(match).map(replace)))

    
    const twisterOutputDevice$ = midiDevices$
        .filter(({name}) => name === "Midi Fighter Twister")
        .filter(d => d instanceof MIDIOutput)
        // .observe(log("twisterOutputDevice"));
// .drain()


    midiToTwister$
    // .observe(log("midiToTwister"))
    .combine((midi,twister) =>  twister.send(midi), twisterOutputDevice$)
    .drain();



}

accessMidi()