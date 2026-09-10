window.StorageSystem = {
  key:'cityInATabSaveV1',
  save(state){
    try{ state.lastSaved=Date.now(); localStorage.setItem(this.key,JSON.stringify(state)); return true; }
    catch(e){ console.error(e); return false; }
  },
  load(){
    try{
      const raw=localStorage.getItem(this.key); if(!raw) return null;
      const s=JSON.parse(raw); if(!s||typeof s!=='object'||!Array.isArray(s.map)||!s.stats) throw new Error('Invalid save');
      return s;
    }catch(e){ console.warn('Corrupt save ignored',e); localStorage.setItem(this.key+'_corrupt',localStorage.getItem(this.key)||''); return null; }
  },
  reset(){ localStorage.removeItem(this.key); },
  export(state){
    const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='city-in-a-tab-save.json'; a.click(); URL.revokeObjectURL(a.href);
  },
  importFile(file,done){
    const r=new FileReader(); r.onload=()=>{try{const s=JSON.parse(r.result); if(!Array.isArray(s.map)||!s.stats) throw 0; localStorage.setItem(this.key,JSON.stringify(s)); done(null,s)}catch(e){done(new Error('Invalid save file'))}}; r.readAsText(file);
  }
};
