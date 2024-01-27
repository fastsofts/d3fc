
import * as React from "react";
import css from '../../styles/ForceGraph.module.scss';

import * as d3 from "d3"
import Tooltip from './utils/Tooltip'

import ShortestPath from "./ShortestPath";

interface forceproperties{ 
    nodes:[];
    links:[];
    chartwidth:number;
    chartheight:number;
    screenwidth:number;
    screenheight:number;
    zoomTo:number;
    initZoom:number;
    titles:any;
    settings:{
      bubbleTooltipRequired:boolean;
      lineTooltipRequired:boolean;
      zoomRequired:boolean;
      bubbleAnimationRequired:boolean;
      lineAnimationRequired:boolean;
      bubbleAnimationDuration:number;
      lineAnimationDuration:number;
      zoomButtonsRequired:boolean;        
    };
}
let zoom:any = null;
const ForceGraph: React.FC<forceproperties> = ({zoomTo,initZoom,nodes,links,settings,chartwidth,chartheight,screenwidth,screenheight,titles})  => {
  let chartsvgelement:any = null;
  const chartRef = React.useRef(null);
  const [animatedNodes, setAnimatedNodes] = React.useState<any>([]);
  const [animatedLinks,setAnimatedLinks] = React.useState<any>([]);
  const [hoveredBubbleData,sethoveredBubbleData] = React.useState<any>({})
  const [hoveredBubble,sethoveredBubble]= React.useState(false);
  const [tipLeft,setTipLeft] = React.useState(99999);
  const [tipTop,setTipTop] = React.useState(99999);


  React.useEffect(()=>{
    setAnimatedLinks(links);  
  },[links]);

  React.useEffect(() => {
    const simulations:any = d3
      .forceSimulation()
      .force("x", d3.forceX(400))
      .force("y", d3.forceY(300));

    simulations.on("tick", () => {
        setAnimatedNodes([...simulations.nodes()]);
    });

    simulations.nodes([...nodes]);
    simulations.alpha(0.1).restart();

    const adjustDisplay = ()=>{
      let element:any = d3.select(chartRef.current);
      let boundss = element.node().getBBox();   
      let bounds = new Array(2);
      bounds[0] = new Array(2)
      bounds[0][0] =  boundss.x
      bounds[0][1] =  boundss.y 
      bounds[1] = new Array(2)
      bounds[1][0] = boundss.x+boundss.width
      bounds[1][1] = boundss.y+boundss.height; 
      let s = 0.95 / Math.max((bounds[1][0] - bounds[0][0]) / chartwidth, (bounds[1][1] - bounds[0][1]) / chartheight);  
      let redfactor = 1.35;
      let __restrictmaximumscaleto = 5;
      s = s/redfactor
      if ( s > __restrictmaximumscaleto){
          s = __restrictmaximumscaleto;
      }          
      let t = [(chartwidth - s * (bounds[1][0] + bounds[0][0])) / 2, (chartheight - s * (bounds[1][1] + bounds[0][1])) / 2];  

      var transform = d3.zoomIdentity
            .translate(t[0] ,t[1])
            .scale(s);

      d3.select(chartRef.current).transition().duration(1000).attr("transform","translate(" + t[0]+","+t[1]+ ")" + " scale(" + s + ")").on("end",() =>{
          if (settings.zoomRequired){
              zoom = d3.zoom()
                 .scaleExtent([.5, 16])
                 .on("zoom",Zoomed);
              d3.select("#chartholder").call(zoom);
          }          
      })
    }


    setTimeout(()=>{
        let domnodes:any = d3.select(chartRef.current).selectAll("[id^=linkpath_]");
        domnodes["_groups"][0].forEach((link:any,i:any)=>{
           let linelength = link.getTotalLength();
           d3.select(link).attr("stroke-dashoffset",`${linelength}`);
           d3.select(link).attr("stroke-dasharray",`${linelength} ${linelength}`);
        }); 
        let incr = 20;
        let nodecounter = 0;
        domnodes = d3.select(chartRef.current).selectAll("[id^=node_]");
        domnodes["_groups"][0].forEach((node:any,i:any)=>{
          let id = d3.select(node).attr("id").split("node_")[1];  
          let targetx = 0;
          let targety = 0;
          nodes.forEach((everynode:any)=>{
            if (everynode.id === id){
                targetx = everynode.fx;
                targety = everynode.fy;
            }
          });
          if (settings.bubbleAnimationRequired){
              d3.select(node).transition()
                .delay(nodecounter)
                .duration(2000)
                .ease(d3.easeLinear)   
                .attr("transform",((d:any,i:any)=>{
                    return `translate(${targetx},${targety})`
                }))  
                .on("end", () =>{
                    let linkconnect:any = d3.select(chartRef.current).selectAll("[id^=linkpath_]");
                    if (settings.lineAnimationRequired){
                        setTimeout(()=>{
                          let linkcounter = 0;
                          if (linkconnect["_groups"][0][0]){
//                            console.log("hit");
                              linkconnect["_groups"][0].forEach((link:any,i:any)=>{
                                 let totalLength:number = link.getTotalLength();   
                                  d3.select(link)
                                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                                    .attr("stroke-dashoffset", totalLength)
                                    .transition()
                                    .delay(linkcounter)
                                    .duration(1000)
                                    .ease(d3.easeLinear)
                                    .attr("stroke-dashoffset", 0)
                                    .on("end",()=>{
                                       adjustDisplay();
                                    });
                                    linkcounter += 10 + (i * (incr/2));    
                             });
                          }else{ 
                             adjustDisplay();
                          }     
                        },200);
                    }else{
                        linkconnect["_groups"][0].forEach((link:any,i:any)=>{
                          d3.select(link)
                            .attr("stroke-dasharray",null)
                            .attr("stroke-dashpffset",null)
                        });      
                        adjustDisplay();                          
                    }                        
                 });
                 nodecounter += 10 + (i * incr);
            }else{
                 d3.select(node)   
                   .attr("transform",((d:any,i:any)=>{
                       return `translate(${targetx},${targety})`
                 }))  
                 if (settings.lineAnimationRequired){
                     setTimeout(()=>{
                       let linkcounter = 0;
                       let linkconnect:any = d3.select(chartRef.current).selectAll("[id^=linkpath_]")
                       if (linkconnect["_groups"][0][0]){
                           linkconnect["_groups"][0].forEach((link:any,i:any)=>{
                              let totalLength:number = link.getTotalLength();   
                              d3.select(link)
                                .attr("stroke-dasharray", totalLength + " " + totalLength)
                                .attr("stroke-dashoffset", totalLength)
                                .transition()
                                .delay(linkcounter)
                                .duration(1000)
                                .ease(d3.easeLinear)
                                .attr("stroke-dashoffset", 0)
                                .on("end",()=>{
                                    adjustDisplay();
                                });
                                linkcounter += 10 + (i * (incr/2));    
                           });
                       }else{
                           adjustDisplay();
                       }    
                     },200);  
                 }else{
                     let linkconnect:any = d3.select(chartRef.current).selectAll("[id^=linkpath_]")                  
                     linkconnect["_groups"][0].forEach((link:any,i:any)=>{
                       d3.select(link)
                        .attr("stroke-dasharray",null)
                        .attr("stroke-dashpffset",null)
                     });      
                     adjustDisplay();                     
                 }                 
            }    
        });      
    },100);

    // stop simulation on unmount
    return () => simulations.stop();

  }, [nodes,settings.bubbleAnimationRequired,settings.lineAnimationRequired,settings.zoomRequired,chartheight,chartwidth]);


  const Zoomed = (e:any)=>{
      d3.select(chartRef.current).transition().duration(200).attr("transform","translate(" + e.transform.x+","+e.transform.y+ ")" + " scale(" + e.transform.k + ")");
  }


  const getPath = (link:any) => {
       let source = link.source;
       let target = link.target;
       let sourceX1 = 0;
       let sourceY1 = 0;
       let targetY1 = 0;
       let targetX1 = 0;
       animatedNodes.forEach((node:any)=>{
          if (node.id === source){
              sourceX1 = node.fx; 
              sourceY1 = node.fy;
          } 
          if (node.id === target){
              targetX1 = node.fx;
              targetY1 = node.fy;
          } 
       }); 
       return `M${sourceX1} ${sourceY1}, L${targetX1} ${targetY1}`
  }

  const showToolTip = (e:any,id:string,tid:string,type:number) =>{
      e.target.style.cursor = "pointer";
      if (type === 1){
          nodes.forEach((node:any)=>{
             if (node.id === id){
                 sethoveredBubbleData({"Name":node.main});
                 settings.bubbleAnimationRequired && d3.select(`#node_${node.id}`).select("circle")
                   .transition()
                   .delay(10)
                   .duration(settings.bubbleAnimationDuration)
                   .ease(d3.easeLinear)
                   .attr("r",node.radius * 2)
                   .on("end",()=>{
                       sethoveredBubble(true);
                   });
                   setTipLeft(e.clientX-75);
                   setTipTop(e.clientY-50);             
             }
         })
      }
      if (type === 2){
          let hdata:any = {};
          nodes.forEach((node:any)=>{
             if (node.id === id){
                 hdata.From = node.main;
                 setTipLeft(node.fx+(node.radius/2)+10);
                 setTipTop(node.fy+(node.radius/2)+20);             
             }
             if (node.id === tid){
                 hdata.To = node.main;
                 setTipLeft(node.fx+(node.radius/2)+10);
                 setTipTop(node.fy+(node.radius/2)+20);        
             }                    
         });
         settings.lineAnimationRequired && d3.select(`#link_${id}_${tid}`).select("path")
           .transition()
           .delay(10)
           .duration(settings.lineAnimationDuration)
           .ease(d3.easeLinear)
           .attr("stroke-width","4")
           .on("end",()=>{
                sethoveredBubble(true);
           });
         sethoveredBubbleData(hdata);
      }           
  }


  const hideToolTip = (e:any,id:string,tid:string,type:number) =>{
      e.target.style.cursor = "defaukt";
      if (type === 1){
          nodes.forEach((node:any)=>{
            if (node.id === id){  
                d3.select(`#node_${node.id}`).select("circle")
                  .transition()
                  .delay(10)
                  .duration(500)
                  .ease(d3.easeLinear)
                  .attr("r",node.radius)
                  .on("end",()=>{
                       sethoveredBubble(false);
                  });
            }  
          })
      }
      if (type === 2){
          d3.select(`#link_${id}_${tid}`).select("path")
            .transition()
            .delay(10)
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("stroke-width","1")
            .on("end",() =>{
              sethoveredBubble(false);
            });
      }  
  }  

  React.useEffect(()=>{
      if (zoom){
          if (zoomTo === 1){
              zoom.scaleBy(d3.select(chartRef.current), 1.3);
          }
          if (zoomTo === 2){
              d3.select("#chartholder").transition()
                .duration(750)
                .call(zoom.transform, d3.zoomIdentity); 
          }
          if (zoomTo === 3){
              zoom.scaleBy(d3.select(chartRef.current), 1/1.3);        
          }
      }    
  },[zoomTo,initZoom])

  return(
        <React.Fragment>
              <svg id = "chartholder" className={css.chartholder}>
                  <g ref={chartRef}>
                     {animatedLinks && animatedLinks.map((link:any)=>(
                        <g key={`${link.source}_${link.target}`} id = {`link_${link.source}_${link.target}`}>
                           <path 
                             d = {`${getPath(link)}`}
                             stroke="black"
                             key={`${link.source}_${link.target}`}
                             fill="none"
                             strokeOpacity=".2"
                             strokeWidth="1"
                             id={`linkpath_${link.source}_${link.target}`}
                             strokeDasharray = {`${link.distance} ${link.distance}`}
                             strokeDashoffset = {`${link.distance}`}
                             onMouseOver={(e:any) => settings.lineTooltipRequired && showToolTip(e,link.source,link.target,2)}
                             onMouseOut={(e:any) => settings.lineTooltipRequired &&  hideToolTip(e,link.source,link.target,2)}                             
                           />  
                        </g>
                     ))}
                     {titles && titles.length > 0 && titles.map((title:any,index:number)=>(
                         title[Object.keys(title)[0]].include?<text key = {`${index}`} textAnchor = "middle" className="title" x={title[Object.keys(title)[0]].posX} y={title[Object.keys(title)[0]].posY}>{Object.keys(title)[0]}</text>:''
                     ))}                                         
                     {animatedNodes && animatedNodes.map((node:any)=>(
                       <g  key={node.id} id = {`node_${node.id}`} transform = {`translate(${node.ix},${node.iy})`}>  
                          <circle
                              cx={"0"}
                              cy={"0"}
                              r={node.radius}
                              key={node.id}
                              stroke={node.stroke}
                              fill={node.fill}
                              strokeWidth={node.strokewidth}
                              onMouseOver={(e:any) => settings.bubbleTooltipRequired && showToolTip(e,node.id,'',1)}
                              onMouseOut={(e:any) => settings.bubbleTooltipRequired &&  hideToolTip(e,node.id,'',1)}
                          />
                       </g>
                     ))};
                  </g>
              </svg>
              {hoveredBubble ?
                <Tooltip
                   hoveredBubbleData={hoveredBubbleData}
                   tipLeft={tipLeft} 
                   tipTop={tipTop}       
                 /> :
                   null
              }
       </React.Fragment>
  )
}
export default ForceGraph;