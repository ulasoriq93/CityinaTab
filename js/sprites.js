window.SpriteArt = {
  markup(id){
    const sprites = {
      house:`<span class="sprite house"><i class="roof"></i><i class="body"></i><i class="door"></i><i class="window w1"></i><i class="window w2"></i><i class="chimney"></i></span>`,
      apartments:`<span class="sprite apartments"><i class="body"></i><i class="roofline"></i><i class="door"></i><i class="window w1"></i><i class="window w2"></i><i class="window w3"></i><i class="window w4"></i><i class="window w5"></i><i class="window w6"></i></span>`,
      tower:`<span class="sprite tower"><i class="antenna"></i><i class="body"></i><i class="side"></i><i class="door"></i><i class="windows"></i></span>`,
      shops:`<span class="sprite shops"><i class="body"></i><i class="awning"></i><i class="sign"></i><i class="door"></i><i class="window"></i></span>`,
      mall:`<span class="sprite mall"><i class="body"></i><i class="roofline"></i><i class="glass"></i><i class="door d1"></i><i class="door d2"></i><i class="sign"></i></span>`,
      office:`<span class="sprite office"><i class="body"></i><i class="side"></i><i class="roofline"></i><i class="windows"></i><i class="door"></i></span>`,
      workshop:`<span class="sprite workshop"><i class="body"></i><i class="sawroof"></i><i class="door"></i><i class="window"></i><i class="crate"></i></span>`,
      factory:`<span class="sprite factory"><i class="body"></i><i class="sawroof"></i><i class="chimney c1"></i><i class="chimney c2"></i><i class="door"></i><i class="window"></i></span>`,
      advanced:`<span class="sprite advanced"><i class="body"></i><i class="glass g1"></i><i class="glass g2"></i><i class="glass g3"></i><i class="pipe"></i><i class="door"></i></span>`,
      clinic:`<span class="sprite clinic"><i class="body"></i><i class="roofline"></i><i class="cross v"></i><i class="cross h"></i><i class="door"></i><i class="window w1"></i><i class="window w2"></i></span>`,
      police:`<span class="sprite police"><i class="body"></i><i class="roofline"></i><i class="badge"></i><i class="door"></i><i class="window w1"></i><i class="window w2"></i></span>`,
      library:`<span class="sprite library"><i class="roof"></i><i class="body"></i><i class="step"></i><i class="column c1"></i><i class="column c2"></i><i class="column c3"></i><i class="door"></i></span>`
    };
    return sprites[id] || `<span class="tile-art ${id}"></span>`;
  }
};
