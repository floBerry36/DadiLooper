// DadiLooper — capture micro en AudioWorklet.
//
// Remplace l'ancien ScriptProcessorNode : le traitement tourne ici sur le
// thread audio temps réel du navigateur, pas sur le thread principal. Un
// ralentissement de l'affichage (redessin de la roue, ramasse-miettes,
// défilement tactile…) ne peut donc plus provoquer de décrochage, de bip ou
// de « déchirure » dans l'enregistrement — c'était la cause des glitches avec
// l'ancien moteur.
//
// Protocole (port.postMessage) :
//   main -> worklet : {cmd:'start', target}   commence à enregistrer ;
//                       target=0 -> longueur libre (1re prise),
//                       target>0 -> s'arrête tout seul à ce nombre d'échantillons
//                                    (overdub, calé sur la longueur de la boucle)
//                      {cmd:'stop'}            arrête et renvoie ce qui a été capté
//                      {cmd:'calStart'}        démarre la capture de calibration
//                      {cmd:'calStop'}         arrête et renvoie les blocs de calibration
//   worklet -> main : {type:'done', data, auto, endTime}
//                      {type:'calDone', blocks:[{t, data}, …]}
class DadiRecorder extends AudioWorkletProcessor {
  constructor(){
    super();
    this.recording = false;
    this.target = 0;
    this.count = 0;
    this.chunks = [];        // Float32Array[] (un par quantum de rendu, 128 échantillons)

    this.calibrating = false;
    this.calChunks = [];     // {t, data}[]

    this.port.onmessage = (e)=>{
      const m = e.data;
      if(m.cmd === 'start'){
        this.recording = true;
        this.target = m.target || 0;
        this.count = 0;
        this.chunks = [];
      } else if(m.cmd === 'stop'){
        this._flush(false);
      } else if(m.cmd === 'calStart'){
        this.calibrating = true;
        this.calChunks = [];
      } else if(m.cmd === 'calStop'){
        this.calibrating = false;
        const blocks = this.calChunks;
        this.calChunks = [];
        this.port.postMessage({ type:'calDone', blocks }, blocks.map(b=> b.data.buffer));
      }
    };
  }

  _flush(auto){
    let total = 0;
    for(const c of this.chunks) total += c.length;
    const out = new Float32Array(total);
    let off = 0;
    for(const c of this.chunks){ out.set(c, off); off += c.length; }
    this.recording = false;
    this.chunks = [];
    this.port.postMessage({ type:'done', data:out, auto, endTime: currentTime }, [out.buffer]);
  }

  process(inputs){
    const ch = inputs[0] && inputs[0][0];
    if(!ch || ch.length === 0) return true;   // pas encore de signal d'entrée connecté

    if(this.calibrating){
      this.calChunks.push({ t: currentTime, data: ch.slice() });
    }

    if(this.recording){
      this.chunks.push(ch.slice());
      this.count += ch.length;
      if(this.target > 0 && this.count >= this.target){
        const over = this.count - this.target;
        if(over > 0){
          const last = this.chunks[this.chunks.length - 1];
          this.chunks[this.chunks.length - 1] = last.subarray(0, last.length - over);
        }
        this._flush(true);
      }
    }
    return true;   // rester actif indéfiniment
  }
}
registerProcessor('dadi-recorder', DadiRecorder);
