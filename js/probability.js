function sigmoid(x,x0,k,L){
    return L/(1+Math.exp(-k*(x-x0)));
}

function calcProbability(){
    const day=dn(), daysLeft=dl();
    const bbH=D.tm.bb/60;
    const uploads=D.yt.up.length;
    const consistency=calcConsistency();
    const streak=stk();
    const twoDayViolations=countTwoDayViolations();
    const v7=vel7(), v14=vel14();
    const elapsed=Math.max(1,day-1);

    const P_skill=sigmoid(bbH,150,0.028,0.82);
    const violationPenalty=Math.pow(0.92,twoDayViolations);
    const P_consistency=Math.max(0.1, (0.3+0.7*consistency)*violationPenalty);

    const p1Done=D.bb.dn.filter(x=>x.startsWith('p1')).length;
    const p2Done=D.bb.dn.filter(x=>x.startsWith('p2')).length;
    const p3Done=D.bb.dn.filter(x=>x.startsWith('p3')).length;
    const p4Done=D.bb.dn.filter(x=>x.startsWith('p4')).length;
    const p5Done=D.bb.dn.filter(x=>x.startsWith('p5')).length;
    const weightedCoverage=(p1Done/14*0.25 + p2Done/14*0.30 + p3Done/14*0.25 + p4Done/14*0.10 + p5Done/14*0.10);
    const P_coverage=0.3+0.7*Math.min(1,weightedCoverage*1.3);

    const dailyBBRate=bbH/Math.max(1,elapsed);
    const projectedBBH=bbH+dailyBBRate*daysLeft;
    const P_timeFeasibility=sigmoid(projectedBBH,150,0.02,1.0);

    const velocityTrend=v14>0?(v7/v14):1;
    const trendMult=Math.max(0.7,Math.min(1.15,0.85+velocityTrend*0.15));

    const bbFactors=[P_skill,P_consistency,P_coverage,P_timeFeasibility];
    const bbGeometric=Math.pow(bbFactors.reduce((a,b)=>a*b,1), 1/bbFactors.length);
    let P_bb=bbGeometric*trendMult;

    let P_yt;
    let p_viral_per_video_=0, P_yt_viral_=0, P_yt_volume_=0, P_yt_consistency_=0, projectedUploads_=0, dailyUploadRate_=0;
    
    if(uploads===0){
        P_yt=0.01; 
    } else {
        const p_viral_per_video=0.012+Math.min(0.018,uploads*0.0001);
        const P_yt_viral=1-Math.pow(1-p_viral_per_video,uploads);
        const dailyUploadRate=uploads/Math.max(1,elapsed);
        const projectedUploads=uploads+dailyUploadRate*daysLeft;
        const P_yt_volume=sigmoid(projectedUploads,60,0.04,1.0);
        
        const uploadDays=getDailyUploads(Math.min(14,elapsed));
        const uploadDaysActive=uploadDays.filter(x=>x>0).length;
        const uploadConsistency=uploadDaysActive/Math.max(1,uploadDays.length);
        const P_yt_consistency=uploads>0?(0.1+0.9*uploadConsistency):0;
        
        P_yt=P_yt_viral*0.35+P_yt_volume*0.35+P_yt_consistency*0.30;

        p_viral_per_video_=p_viral_per_video; P_yt_viral_=P_yt_viral; P_yt_volume_=P_yt_volume; P_yt_consistency_=P_yt_consistency;
        projectedUploads_=projectedUploads; dailyUploadRate_=dailyUploadRate;
    }

    const noveltyRiskBase=day>=10&&day<=25?0.88:day<10?0.93:0.96;
    const noveltyMitigation=Math.min(1, 0.85+streak*0.015);
    const noveltyRisk=Math.min(1, noveltyRiskBase*noveltyMitigation);

    const hasPrecommit=D.pc[td()]?1.08:1.0;
    const conscientiousnessBase=0.75;
    const conscientiousnessRisk=Math.min(1, conscientiousnessBase*hasPrecommit);

    const daysActiveRecently=vel7()>0?1:0;
    const neuroticismRisk=daysActiveRecently?0.95:0.85;

    const contrarianBoost=1.03;
    let personalityMult = noveltyRisk * conscientiousnessRisk * neuroticismRisk * contrarianBoost;

    const vaultBonus = Math.min(0.05, D.vault.length * 0.005);
    const qrBonus = Math.min(0.05, D.qr * 0.01);
    const boredomBonus = (D.bv === td()) ? 0.02 : 0;
    personalityMult = Math.min(1.2, personalityMult + vaultBonus + qrBonus + boredomBonus);

    P_bb=Math.max(0.01,Math.min(0.92,P_bb*personalityMult));
    P_yt=Math.max(0.01,Math.min(0.85,P_yt*personalityMult));

    const correlation=0.3;
    const P_joint=P_bb*P_yt + correlation*Math.sqrt(P_bb*(1-P_bb)*P_yt*(1-P_yt));
    const P_combined_raw=Math.max(0.01,Math.min(0.95,P_bb+P_yt-P_joint));
    
    const wagerAdj = ((D.wagerWins || 0) * 0.005) - ((D.wagerLosses || 0) * 0.02);
    const P_final = Math.max(0.01, Math.min(0.95, P_combined_raw + wagerAdj));

    const uncertainty=day<7?0.25:day<14?0.18:day<30?0.12:0.08;
    const CI_low=Math.max(0.01,P_final-P_final*uncertainty*1.96);
    const CI_high=Math.min(0.95,P_final+P_final*uncertainty*1.96);

    const dL=daysLeft;
    const optBBH=bbH+Math.max(dailyBBRate*1.3,4.5)*dL;
    const optUploads=uploads+Math.max((uploads/Math.max(1,elapsed))*1.3,2)*dL;
    const P_opt_bb=sigmoid(optBBH,150,0.028,0.82)*0.95;
    const P_opt_yt=optUploads>0?(1-Math.pow(1-0.015,optUploads))*0.35+sigmoid(optUploads,60,0.04,1)*0.35+0.85*0.30:0.01;
    const P_optimistic=Math.min(0.95,P_opt_bb+P_opt_yt-P_opt_bb*P_opt_yt);

    const pesBBH=bbH+dailyBBRate*0.6*dL;
    const pesUploads=uploads+(uploads/Math.max(1,elapsed))*0.6*dL;
    const P_pes_bb=sigmoid(pesBBH,150,0.028,0.82)*0.70;
    const P_pes_yt=pesUploads>0?(1-Math.pow(1-0.01,pesUploads))*0.35+sigmoid(pesUploads,60,0.04,1)*0.35+0.4*0.30:0.01;
    const P_pessimistic=Math.max(0.01,(P_pes_bb+P_pes_yt-P_pes_bb*P_pes_yt)*0.85);

    const sensitivities=[];
    function probWith(overrides){
        const ob=Object.assign({bbH_:bbH,uploads_:uploads,consistency_:consistency,streak_:streak},overrides);
        const sk=sigmoid(ob.bbH_,150,0.028,0.82);
        const vp=Math.pow(0.92,twoDayViolations);
        const pc=Math.max(0.1,(0.3+0.7*ob.consistency_)*vp);
        const dr=ob.bbH_/Math.max(1,elapsed);
        const pr=ob.bbH_+dr*dL;
        const tf=sigmoid(pr,150,0.02,1.0);
        const bg=Math.pow([sk,pc,P_coverage,tf].reduce((a,b)=>a*b,1),0.25)*trendMult;
        const bb_=Math.max(0.01,Math.min(0.92,bg*personalityMult));
        let yt_=P_yt; 
        if(ob.uploads_!==uploads&&ob.uploads_>0){
            const pvv=0.012+Math.min(0.018,ob.uploads_*0.0001);
            const ytv=1-Math.pow(1-pvv,ob.uploads_);
            const dur=ob.uploads_/Math.max(1,elapsed);
            const pu=ob.uploads_+dur*dL;
            const pyv=sigmoid(pu,60,0.04,1.0);
            yt_=Math.max(0.01,Math.min(0.85,(ytv*0.35+pyv*0.35+P_yt*0.30)*personalityMult)); 
        }
        const j_=bb_*yt_+correlation*Math.sqrt(bb_*(1-bb_)*yt_*(1-yt_));
        return Math.max(0.01,Math.min(0.95,bb_+yt_-j_));
    }

    const boost_bb2h=(probWith({bbH_:bbH+2})-P_final)*100;
    sensitivities.push({action:'+2h BB practice today',boost:Math.max(0,boost_bb2h),type:'bb'});

    const boost_yt2=(probWith({uploads_:uploads+2})-P_final)*100;
    sensitivities.push({action:'+2 YouTube uploads today',boost:Math.max(0,boost_yt2),type:'yt'});

    const s_streak=Math.min(1,0.85+(streak+7)*0.015);
    const boost_streak=(s_streak-noveltyMitigation)*P_bb*0.5;
    sensitivities.push({action:'Maintain streak for 7 more days',boost:Math.max(0,boost_streak*100),type:'streak'});

    const s_topics=(p1Done+Math.min(5,14-p1Done))/14*0.25+p2Done/14*0.30+p3Done/14*0.25+p4Done/14*0.10+p5Done/14*0.10;
    const boost_topics=((0.3+0.7*Math.min(1,s_topics*1.3))-P_coverage)*0.5*100;
    sensitivities.push({action:'Complete 5 more BB topics',boost:Math.max(0,boost_topics),type:'bb'});

    if(!D.pc[td()]){
        sensitivities.push({action:"Pre-commit tomorrow's plan now",boost:1.2,type:'habit'});
    }
    if(consistency<0.7){
        const boost_cons=(probWith({consistency_:0.8})-P_final)*100;
        sensitivities.push({action:'Zero missed days for next 7 days',boost:Math.max(0,boost_cons),type:'habit'});
    }
    sensitivities.sort((a,b)=>b.boost-a.boost);

    return {
        bb:P_bb, yt:P_yt, combined:P_final, ci:{low:CI_low,high:CI_high},
        scenarios:{optimistic:P_optimistic,base:P_final,pessimistic:P_pessimistic},
        factors:{
            skill:P_skill, consistency:P_consistency, coverage:P_coverage, timeFeasibility:P_timeFeasibility,
            trendMult:trendMult, noveltyRisk:noveltyRisk, conscientiousnessRisk:conscientiousnessRisk,
            neuroticismRisk:neuroticismRisk, contrarianBoost:contrarianBoost, personalityMult:personalityMult,
            ytViral:P_yt_viral_, ytVolume:P_yt_volume_, ytConsistency:P_yt_consistency_
        },
        meta:{
            bbH, projectedBBH, uploads, projectedUploads:Math.round(projectedUploads_),
            dailyBBRate, dailyUploadRate:dailyUploadRate_, consistency, streak, twoDayViolations,
            velocityTrend, v7, v14, elapsed, day, daysLeft
        },
        sensitivities:sensitivities.slice(0,6),
        personality:{
            novelty:{score:1-noveltyRisk,label:'Novelty-Seeking',danger:day>=10&&day<=25},
            conscientiousness:{score:1-conscientiousnessRisk,label:'Discipline Gap',danger:consistency<0.5},
            neuroticism:{score:1-neuroticismRisk,label:'Urgency Blindness',danger:vel7()<3},
            contrarian:{score:contrarianBoost-1,label:'Contrarian Edge',danger:false}
        }
    };
}
