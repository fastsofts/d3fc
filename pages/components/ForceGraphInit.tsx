
import * as React from "react";
import css from '../../styles/ForceGraph.module.scss';
import ForceGraph from "./ForceGraph";
import * as d3 from "d3";
import Config from "../../public/assets/settings/settings";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome} from '@fortawesome/free-solid-svg-icons'
import * as config from "../../next.config.js"


interface initproperties {
  screenwidth:number;
  screenheight:number;
}

interface IcurrentMovies{
  [index:number]: string
}

interface IpopcornTypes{
  [index:number]:string;
}

interface ImoviesProduced{
  [index:number]:string;
}

interface IstudiosLocations{
  [index:number]:string;
}

interface IproductionCompaniesWorkingWith{
  [index:number]:{connectionWithCinemaConfirmed:boolean;headOfficeLocation:string;moviesProduced:ImoviesProduced;name:string;studiosLocations:IstudiosLocations;type:string}
}

interface IfavMovie{
  [index:number]:string;
}

interface IsurveyParticipants{
  [index:number]:{name:string,favMovie:IfavMovie}
}

interface IsurveyDemographic{
  [index:number]:{demographic:string;surveyParticipants:IsurveyParticipants}
}

interface IteatherLocations{
  [index:number]:string;
}

interface Icinemacompany{
  cinemaName:string;    
  currentMovies:IcurrentMovies;
  popcornTypes:IpopcornTypes;
  productionCompaniesWorkingWith:IproductionCompaniesWorkingWith;
  surveyDemographic:IsurveyDemographic;
  teatherLocations:IteatherLocations;
  type:string;
}

interface forcedata {
   cinemaCompany:Icinemacompany
}

let chartheight:any = 0;
let chartwidth:any = 0;
let inprocess = true;
let chartMargin:any = {left:.10,right:.10,top:.10,bottom:.10};
const keysorder:any = {"currentMovies":[],"productionCompaniesWorkingWith_name":[],"productionCompaniesWorkingWith_studiosLocations":[],"productionCompaniesWorkingWith_headOfficeLocation":[],"theatreLocations":[]};
let title:any = [{"Movies":{include:true,posX:0,posY:0}},{"Production Companies":{include:true,posX:0,posY:0}},{"Studio Locations":{include:true,posX:0,posY:0}},{"Office Locations":{include:true,posX:0,posY:0}},{"Theatre Locations":{include:true,posX:0,posY:0}}];
const colors:any = [{"currentMovies":{"fill":"rgba(50,205,50,1)","stroke":"rgba(135,206,250.5)","strokewidth":"1"}},{"productionCompaniesWorkingWith_name":{"fill":"rgb(135,206,250,1)","stroke":"rgba(255,160,122,.5)","strokewidth":"1"}},{"productionCompaniesWorkingWith_studioLocations":{"fill":"rgba(255,165,0,.5)","stroke":"rgba(0,0,0,.5)","strokewidth":"1"}},{"theatreLocations":{"fill":"rgba(255, 223, 0,1)","stroke":"rgba(30,144,255,1)","strokewidth":"1"}},{"productionCompaniesWorkingWith_officelocation":{"fill":"rgba(255, 223, 0,1)","stroke":"rgba(30,144,255,1)","strokewidth":"1"}}];
const ForceGraphInit: React.FC<initproperties> = ({screenwidth,screenheight})  => {
  let chartWidth:number = screenwidth;
  let chartHeight:number = screenheight ;
  let margin:any = {left:screenwidth * .10,top:screenheight * .10,right:screenwidth * .10,bottom:screenheight * .10};
  let centers = {};
  const [radius,setRadius] = React.useState(0);
  let chartsvgelement:any = null;
  const [nodes,setNodes] = React.useState<any>([]);
  const [links,setLinks] = React.useState<any>([]);
  const zoomButtonRef = React.useRef(null); 
  const [zoomTo,setZoomTo] = React.useState(0);
  const [initZoom,setInitZoom] = React.useState(0);
  const dataURL:string = config.assetPrefix?`${config.assetPrefix}/assets/data/datanew.json`:`/assets/data/datanew.json`;
  const [newTitles,setNewTitles] = React.useState({});
  const linkeddata : { [key: string]: any } = []; 
  //const linkeddata:any[] = [];
  let linkedobjects:any = {};

 /*  const rtraverse = (obj:any,source:any,sourcekey:any) =>{ 
    let duplicate = false
    for (let ky in obj){
         if (obj[ky] == null){
             continue;
         } 
         if (typeof obj === "object" && obj[ky] && typeof obj[ky][0] === "object" ){ 
             if (typeof  obj[ky][0] !== "object"){
                 if (ky === sourcekey){
                     obj[ky].forEach((kval:any)=>{
                        duplicate = false;
                        if (!linkedobjects[ky]){
                            linkedobjects[ky] = [];
                        }
                        linkedobjects[ky].push(kval);
                     });
                }    
             }          
             if (typeof  obj[ky][0] === "object"){ 
                 if (obj[ky] && !obj[ky][0]){
                     Object.keys(obj[ky]).forEach((ob:any)=>{
                         if (typeof obj[ky][ob][0] === "object"){
                             obj[ky][ob].forEach((obx:any)=>{
                                obx.parent = ky + "_" +  ob;                          
                             });
                         }   
                     })
                 }
                 obj[ky].forEach((obj:any)=>{
                      let duplicate = false
                      if (sourcekey.split("_").length > 0){
                          let mkey = sourcekey.split("_")[1];
                          linkedobjects[sourcekey] && linkedobjects[sourcekey].forEach((lobj:any)=>{
                              if (obj[mkey] === lobj[mkey]){
                                  duplicate = true;
                              }
                          });    
                      }
                      if (!duplicate){
                          if (!linkedobjects[sourcekey]){
                              linkedobjects[sourcekey] = [];
                          }
                          linkedobjects[sourcekey].push(obj);
                      }    
                      rtraverse(obj,obj.parent,sourcekey);
                 })
             }   
         }else{ 
             if (obj[ky]){
                 if (typeof obj[ky] === "object"){
                     if (obj[ky][0] && Object.keys(obj[ky][0]).length > 0){
                         if (typeof obj[ky] !== "object"){
                             continue;
                         }else{
                            if (typeof obj[ky][0] !== "object"){
                                continue;
                            }else{
                                continue;
                            }
                        }          
                     }
                 }    
//                 console.log(ky);console.log(obj[ky]); 
                 linkedobjects[ky]
                 

                 duplicate = false;
                 Object.keys(linkedobjects).forEach((lkdata:any,index:number)=>{
                    if (lkdata === ky){
                        duplicate = true;
                    }
                 });   
//                 console.log(ky);console.log(sourcekey);console.log(obj[ky]);
                 if (obj[ky][0] && typeof obj[ky] === "object" && ky === sourcekey){
                     obj[ky].forEach((obs:any)=>{
                        if (!linkedobjects[`${ky}`]){
                            linkedobjects[`${ky}`] = [];
                        }    
                        linkedobjects[`${ky}`].push(obs);
                     });    
                 }else{
                     if (ky === sourcekey){
                         if (obj[ky] === "object"){    
                             obj[ky].forEach((obs:any)=>{
                                if (!linkedobjects[`${ky}`]){
                                    linkedobjects[`${ky}`] = [];
                                }                                      
                                linkedobjects[`${ky}`].push(obs);
                             });                                                        
                         }else{
                             if (!linkedobjects[`${ky}`]){
                                 linkedobjects[`${ky}`] = [];
                             }       
                             linkedobjects[`${ky}`].push(obj[ky]); 
                         }
                    }    
                 }
                 if (source){
                     let added = false;
                     let objs = Object.keys(linkedobjects);
                     objs.forEach((lkdata:any,index:number)=>{
                        if (lkdata === source+"_"+ky){
                            if (typeof obj[ky] === "object"){
                                obj[ky].forEach((ob:any)=>{
                                   duplicate = false; 
                                   linkedobjects[lkdata].forEach((val:any)=>{
                                        if (val ===  ob){
                                            duplicate = true;
                                        }
                                   });   
                                   if (!duplicate){       
                                       if (!linkedobjects[lkdata]){
                                           linkedobjects[lkdata] = [];
                                       }                          
                                       linkedobjects[lkdata].push(ob);
                                   }    
                                });
                            }else{
                                  duplicate = false;
                                  linkedobjects[lkdata].forEach((val:any)=>{
                                       if (val ===  obj[ky]){
                                           duplicate = true;
                                       }
                                  });
                                  if (!duplicate){
                                       if (!linkedobjects[lkdata]){
                                           linkedobjects[lkdata] = [];
                                       }  
                                       linkedobjects[lkdata].push(obj[ky]);
                                  }                 
                            }         
                            added = true;
                        }
                     });       
                     if (!added && !linkeddata[source+"_"+ky] && ky != "parent" && source+"_"+ky === sourcekey){
                         if (typeof obj[ky] === "object"){
                             if (!linkedobjects[source+"_"+ky]){
                                 linkedobjects[source+"_"+ky] = [];
                             } 
                             obj[ky].forEach((obs:any)=>{
                                linkedobjects[source+"_"+ky].push(obs);   
                             });     
                         }else{
                             if (!linkedobjects[source+"_"+ky]){
                                 linkedobjects[source+"_"+ky] = [];
                             }       
                             linkedobjects[source+"_"+ky].push(obj[ky]); 
                         }    
                     }       
                 }else{
                     if (!duplicate){   
                        if (ky === sourcekey){
                            if (!linkedobjects[ky]){
                                linkedobjects[ky] = [];
                            } 
                            linkedobjects[ky].push(obj[ky])
                        }    
                     }else{
                         let objs = Object.keys(linkedobjects)
                         objs.forEach((lkdata:any,index:number)=>{
                            if (lkdata === ky){
                                if (obj[ky][0] && typeof obj[ky] === "object"){
                                    obj[ky].forEach((obs:any)=>{
                                        if ( ky === sourcekey){
                                            linkedobjects[lkdata].forEach((check:any)=>{
                                                 let duplicate = false;
                                                 if (check === obs){
                                                     duplicate = true;
                                                 }
                                            })     
                                            if (!duplicate){
                                                linkedobjects[Object.keys(lkdata)[0]].push(obs);
                                            }
                                        }     
                                    });
                                }       
                            }
                         });        
                     }    
                 }    
             }    
         }
     }       
  }
 */
  const rtraverse = (obj:any,key:string,subname:string,basename:string,mainkey:string) =>{
    for (let ky in obj){
        if (obj[ky] == null){
            continue;
        } 
        if (typeof obj[ky][0] === "object"){ 
            obj[ky].forEach((obj:any)=>{         
                rtraverse(obj,key,subname,ky,mainkey);
           })
        }else{
            if (subname && ky === subname && basename === key && obj[subname]){
                if (mainkey.split("_")[1] && mainkey.split("_")[0] === basename){
                    if (mainkey.split("_")[1]){
                        if (!linkedobjects[mainkey]){
                            linkedobjects[mainkey] = []
                        }
                        linkedobjects[mainkey].push(obj);
                    }
                }
            }else{

            }
        }    
    }
  }

  const traverse = (obj:any,source:string) =>{ 
    for (let ky in obj){
         if (obj[ky] == null){
             continue;
         } 
         if (typeof obj[ky][0] === "object"){ 
             if (typeof  obj[ky][0] !== "object"){
                 let fdata:any = {};
                 fdata[`${ky}`] = [obj[ky]];
                 linkeddata.push(fdata);
//                 if (!linkedobjects[ky]){
//                     linkedobjects[ky] = [];
//                 }
//                 linkedobjects[ky] = obj;
             }            
             if (typeof  obj[ky][0] === "object"){     
                 if (obj[ky] && !obj[ky][0]){
                     Object.keys(obj[ky]).forEach((ob:any)=>{
                         if (typeof obj[ky][ob][0] === "object"){
                             obj[ky][ob].forEach((obx:any)=>{
//                                if (!linkedobjects[ky + "_" +  ob]){
//                                    linkedobjects[ky + "_" +  ob] = [];
//                                }                                    
//                                linkedobjects[ky + "_" +  ob].push(obx);
                                obx.parent = ky + "_" +  ob;                          
                             });
                         }   
                     })
                 }
                 obj[ky].forEach((obj:any)=>{
//                      if (!linkedobjects[obj.parent]){
//                          linkedobjects[obj.parent] = [];
//                      }                                    
//                      linkedobjects[obj.parent].push(obj);     
                      traverse(obj,obj.parent);
                 })

             }   
         }else{ 
             if (obj[ky]){
                 let fdata:any = {};
                 let duplicate = false;
                 linkeddata.forEach((lkdata:any,index:number)=>{
                    if (Object.keys(lkdata)[0] === ky){
                        duplicate = true;
                    }
                 });   
                 if (obj[ky][0] && typeof obj[ky] === "object"){
                     fdata[`${ky}`] = [];
                     obj[ky].forEach((obs:any)=>{
                         fdata[`${ky}`].push(obs);
                     });   
                 }else{
                     if (obj[ky] === "object"){
                        fdata[`${ky}`] = [obj[ky]];
                     }else{
                        fdata[`${ky}`] = [obj[ky]];
                     }
                 }
                 if (source){
                     let added = false;
                     linkeddata.forEach((lkdata:any,index:number)=>{
                        if (Object.keys(lkdata)[0] === source+"_"+ky){
                            if (typeof obj[ky] === "object"){
                               // console.log(obj[ky]);
                                obj[ky].forEach((ob:any)=>{
                                   let duplicate = false; 
                                   //problem is here
                                   linkeddata[index][Object.keys(lkdata)[0]].forEach((val:any)=>{
                                        if (val ===  ob){
                                            duplicate = true;
                                        }
                                   });   
                                   if (!duplicate){                            
                                       linkeddata[index][Object.keys(lkdata)[0]].push(ob);
                                   }    
                                });
                            }else{
                                  let duplicate = false;
                                  linkeddata[index][Object.keys(lkdata)[0]].forEach((val:any)=>{
                                       if (val ===  obj[ky]){
                                           duplicate = true;
                                       }
                                  });
                                  if (!duplicate){
                                       linkeddata[index][Object.keys(lkdata)[0]].push(obj[ky]);   
                                  }                 
                            }         
                            added = true;
                        }
                     });       
                     if (!added && !linkeddata[`${source}_${ky}`] && ky != "parent"){
                         if (typeof obj[ky] === "object"){
                             let ftdata:any = {};
                             ftdata[source+"_"+ky] = obj[ky];
                             linkeddata.push(ftdata);
                         }else{
                             let ftdata:any = {};                      
                             ftdata[source+"_"+ky] = [obj[ky]];                            
                             linkeddata.push(ftdata);
                         }     
                     }   
                 }else{
                     if (!duplicate){   
                         linkeddata.push(fdata);
                     }else{
                         linkeddata.forEach((lkdata:any,index:number)=>{
                            if (Object.keys(lkdata)[0] === ky){
                                if (obj[ky][0] && typeof obj[ky] === "object"){
                                    obj[ky].forEach((obs:any)=>{
                                        linkeddata[index][Object.keys(lkdata)[0]].forEach((checkobj:any)=>{
                                             let duplicate = false;
                                             if (typeof checkobj === "object"){
                                                 checkobj.forEach((cobj:any)=>{
                                                     if (cobj === obs){
                                                         duplicate = true;
                                                     }
                                                 });
                                                 if (!duplicate){
                                                     linkeddata[index][Object.keys(lkdata)[0]].push(obs);
                                                 } 
                                             }       
                                        });    
                                    });
                                }       
                            }
                         });        
                     }    
                 }    
             }    
         }
    }       
 }

 React.useEffect(()=>{
   if (inprocess){
    inprocess = false; 
    getData<forcedata>(dataURL)
    .then((frcdata) => {
      // assigning the response data `toDoItem` directly to `myNewToDo` variable which is
      // of Todo type
      let forcedata:forcedata = frcdata;
      interface Isub{
         [index:number] : {}
      }

      interface Inode{
        id:string;
        fx:number;
        fy:number;
        main:string;
        ix:number;
        iy:number;
        radius:number;   
        fill:string;
        stroke:string;
        strokewidth:string;
        mkey:string;    
      }
      const node: Array<Inode> = [];
      interface Ilink{
        source:string;
        target:string;
      }
      const link: Array<Ilink> = [];      
      let counter = 0;
      let fkeys:any = Object.keys(forcedata["cinemaCompany"]);
      let ftdata:any = forcedata["cinemaCompany"]; 
      fkeys.forEach((okey:any)=>{
         if (ftdata[okey][0] && typeof ftdata[okey][0] === "object"){
            ftdata[okey].forEach((kdata:any)=>{
                kdata.parent = okey; 
             });
         }
      });
      let ff  = JSON.stringify(forcedata["cinemaCompany"]);
      traverse(forcedata["cinemaCompany"],'');
      forcedata["cinemaCompany"] = JSON.parse(ff);
 
  
      let cwidth:number = (document.querySelector("#forcechart") as HTMLDivElement).offsetWidth;
      let cheight:number = (document.querySelector("#forcechart") as HTMLDivElement).offsetHeight;
      chartwidth  = cwidth - (cwidth * chartMargin.left) - (cwidth * chartMargin.right);
      chartheight = cheight - (cheight * chartMargin.top) - (cheight * chartMargin.bottom);
      let maxitems:number = 0;
      let icounter = 1;
      Object.keys(keysorder).forEach((mainkey:any)=>{
        keysorder[mainkey] = [];
        linkeddata.forEach((ldata:any)=>{
            if (Object.keys(ldata)[0] === mainkey){
                let lkey:any = Object.keys(ldata)[0];
                ldata[lkey].forEach((ldat:any)=>{
                    keysorder[mainkey].push(ldat)
                })
            }    
        })    
      });  
      let totalkeys:number = 0;      
      Object.keys(keysorder).forEach((mainkey:any)=>{
            totalkeys++;
            if (maxitems < keysorder[mainkey].length){
                maxitems = keysorder[mainkey].length;
            }
      })
      let perwidth:number = chartwidth/totalkeys    
      let rad:number = 10  // /  (chartheight > chartwidth?chartheight:chartwidth) 
      let radii = rad;
      let startX:number = chartMargin.left;
      interface header{
        value:number;
      }
      let headertop:  Array<header> = [];
      let idslist:any = {};
      Object.keys(keysorder).forEach((mainkey:any,sindex:any)=>{
        let y:number = 0;
        let gap:number = 0;
        let centerpoint:number = 0;
        let cpoint:number = (chartheight/2)    //+ (chartheight * chartMargin.top);
        let above:number = cpoint;
        let below:number = cpoint;
        let ix = chartMargin.left;
        let iy = cpoint;           
        if (keysorder[mainkey].length === 1){
            centerpoint = 0;
            gap = 0;
        }
        if (keysorder[mainkey].length === 2){
            gap = (chartheight/6);
            centerpoint = .5            
        }        
        if (keysorder[mainkey].length > 2){
            gap = (chartheight / (keysorder[mainkey].length * 2)) + rad;
            centerpoint = (keysorder[mainkey].length-1)/2;            
        } 
        title[sindex][Object.keys(title[sindex])[0]].posX = startX;
        title[sindex][Object.keys(title[sindex])[0]].width = perwidth;
        keysorder[mainkey].forEach((item:any,subindex:number)=>{
            let fillc = "blue";
            let strokec = "red";
            let strokewidth = "1";
            colors.forEach((color:any)=>{
               if (Object.keys(color)[0] === mainkey){
                   fillc = color[Object.keys(color)[0]].fill;
                   strokec = color[Object.keys(color)[0]].stroke;
                   strokewidth = color[Object.keys(color)[0]].strokewidth;
               }
            });
            let fx = 0;
            let fy = 0;
            if (subindex < centerpoint){
                above -= gap;
                fx = startX;
                fy = above;
            }   
            if (subindex > centerpoint){
                below += gap;    
                fx = startX;
                fy = below;
             }      
            if (subindex === centerpoint){
                fx = startX;
                fy = cpoint;
            }    
            node.push({id:`n_${icounter}`,fill:fillc,stroke:strokec,strokewidth:strokewidth,fx:fx,fy:fy,main:keysorder[mainkey][subindex],radius:radii,ix:ix,iy:iy,mkey:mainkey})
            idslist[`n_${icounter}`] = {"name":keysorder[mainkey][subindex],fill:fillc,stroke:strokec,strokewidth:strokewidth,fx:fx,"tagged":false,key:mainkey,radius:radii,ix:ix,iy:iy};
            icounter++;                
        }); 
        startX += perwidth; 
        headertop.push({"value":above});
      });  
      title.forEach((header:any,sindex:number)=>{
         let minX = d3.min(headertop,(min)=>min.value);
         if (minX){
             title[sindex][Object.keys(title[sindex])[0]].posY = minX-80; 
         }    
      });   
      let ntitles:any = [];
      title.forEach((header:any,sindex:number)=>{
         if (Object.keys(title[sindex])[0].split(" ").length > 1){
             let addtop = 0
             Object.keys(title[sindex])[0].split(" ").forEach((stitle)=>{
                let n:any = {};
                Object.keys(header[Object.keys(header)[0]]).forEach((hkey:string)=>{
                   n[hkey] = header[Object.keys(header)[0]][hkey]
                });
                let nnew:any = {}
                nnew[stitle] = n;
                nnew[stitle]["posY"] = nnew[stitle]["posY"] + addtop;
                addtop += 13; 
                ntitles.push(nnew);
            });
         }else{
            ntitles.push(header);
         }
      });   
      let prevtag = "";
      let prevvalues:any = [];
      let first = true;
      let processed = [];
      linkedobjects = {};
      let donethings = [];
      let prevkeyvalues = [];
//      console.log(keysorder);
      Object.keys(keysorder).forEach((mainkey:any,sindex:any)=>{    
//          keysorder[mainkey].forEach((item:any,subindex:number)=>{
//             if (first){
//                if (!linkedobjects[mainkey]){
//                    linkedobjects[mainkey] = [];
//                }
/*                 let duplicate = false;
                linkedobjects[mainkey].forEach((psd:any)=>{
                    if (psd === mainkey){
                        foundrow = index;
                    }
                 });
                 if (foundrow > -1){
                     processed[foundrow].data.push(item);
                     if (!linkedobjects[mainkey]){
                         linkedobjects[mainkey]= [];
                     }
                 }else{
                     processed.push({key:mainkey,data:[item]});                   
                 }   */  
//             }else{
                 rtraverse(forcedata["cinemaCompany"],mainkey.split("_")[0],mainkey.split("_")[1],'',mainkey); 
//                 console.log(linkedobjects);
 //            }
  //        });   
          first = false;
      });    
      console.log(linkedobjects);
      console.log(linkeddata);
      console.log(idslist);
      console.log(node);
      let processedobjects:any[] = [];
      let proskey:any = {}
      proskey[Object.keys(keysorder)[0]] = keysorder[Object.keys(keysorder)[0]];
      processedobjects.push(proskey);  
      let linkedids:any[] = [];
      let firstdata = true;
      Object.keys(keysorder).forEach((lkey)=>{
           if (firstdata){
               firstdata = false; 
           }else{   
               let pobject = processedobjects[processedobjects.length-1];
               let pkey = Object.keys(pobject)[0];
               if (lkey.split("_").length > 1 || pkey.split("_").length > 1){   
                   if (lkey.split("_").length > 1 && pkey.split("_").length > 1){
                       let l_data = linkedobjects[lkey]; 
                       let p_data = linkedobjects[pkey]; 
                       l_data.forEach((ld:any)=>{
                           if (ld[lkey.split("_")[1]]){
                               if (typeof ld[lkey.split("_")[1]] === "string"){
                                   p_data.forEach((pd:any)=>{
                                      if (typeof pd[pkey.split("_")[1]] === "string"){
                                          if (pd[lkey.split("_")[1]].toUpperCase() === ld[lkey.split("_")[1]].toUpperCase()){                                                                                  
                                              let sourceid = "";
                                              let targetid = "";
                                              Object.keys(idslist).forEach((id)=>{
                                                  if (idslist[id].key === lkey){
                                                      if (ld[lkey.split("_")[1]].toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                          targetid = id;
                                                      }
                                                  }
                                              });
                                              Object.keys(idslist).forEach((id)=>{
                                                  if (idslist[id].key === pkey){
                                                      if (pd[pkey.split("_")[1]].toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                          sourceid = id;
                                                      }
                                                  }
                                              });                                              
                                              let tdata:any = {};
                                              tdata.source = sourceid;
                                              tdata.target = targetid;
                                              let duplicate = false;
                                              linkedids.forEach((lnk:any)=>{
                                                 if (lnk.source.toUpperCase() === sourceid.toUpperCase()  && lnk.target.toUpperCase() === targetid.toUpperCase()){
                                                      duplicate = true;
                                                  }
                                              });
                                              //console.log("value1");console.log(tdata);
                                              if (!duplicate){
                                                  linkedids.push(tdata);
                                              }    
                                          }
                                      }else{
                                          pd[pkey.split("_")[1]].forEach((pdt:any)=>{
                                            if (pdt.toUpperCase() === ld[lkey.split("_")[1]].toUpperCase()){
                                                let sourceid = "";
                                                let targetid = "";
                                                Object.keys(idslist).forEach((id)=>{
                                                    if (idslist[id].key === lkey){
                                                        if (ld[lkey.split("_")[1]].toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                            targetid = id;
                                                        }
                                                    }
                                                });
                                                Object.keys(idslist).forEach((id)=>{
                                                    if (idslist[id].key === pkey){
                                                        if (pdt.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                            sourceid = id;
                                                        }
                                                    }
                                                });                                              
                                                let tdata:any = {};
                                                tdata.source = sourceid;
                                                tdata.target = targetid;
                                                let duplicate = false;
                                                linkedids.forEach((lnk:any)=>{
                                                    if (lnk.source.toUpperCase() === sourceid.toUpperCase()  && lnk.target.toUpperCase() === targetid.toUpperCase()){
                                                        duplicate = true;
                                                    }
                                                });
                                                //console.log("value2");console.log(tdata);                                                
                                                if (!duplicate){
                                                    linkedids.push(tdata);
                                                }   
                                            }     
                                          });
                                      }
                                   });
                                }else{
                                   p_data.forEach((pd:any)=>{
                                        if (typeof pd[pkey.split("_")[1]] === "string"){
                                            ld[lkey.split("_")[1]].forEach((ldt:any)=>{
                                                 if (typeof ld[pkey.split("_")[1]] === "string"){
                                                     if (ld[pkey.split("_")[1]].toUpperCase() === pd[pkey.split("_")[1]].toUpperCase()){
                                                        //console.log("found");
                                                         let sourceid = "";
                                                         let targetid = "";
                                                         Object.keys(idslist).forEach((id)=>{
                                                            if (idslist[id].key === lkey){
                                                                if (ldt.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                                    targetid = id;
                                                                }
                                                            }
                                                         });
                                                         Object.keys(idslist).forEach((id)=>{
                                                            if (idslist[id].key === pkey){
                                                                if (pd[pkey.split("_")[1]].toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                                    sourceid = id;
                                                                }
                                                            }
                                                        });     
                                                        let tdata:any = {};
                                                        tdata.source = sourceid;
                                                        tdata.target = targetid;
                                                        let duplicate = false;
                                                        linkedids.forEach((lnk)=>{
                                                            if (lnk.source.toUpperCase() === sourceid.toUpperCase()  && lnk.target.toUpperCase() === targetid.toUpperCase()){
                                                                duplicate = true;
                                                            }
                                                        });
                                                        //console.log("value3");console.log(tdata);
                                                        if (!duplicate){
                                                            linkedids.push(tdata);
                                                        }                                                        
                                                    }else{    
//                                                        let sourceid = "";
//                                                        let targetid = "";
//                                                        Object.keys(idslist).forEach((id)=>{
//                                                           if (idslist[id].key === lkey){
//                                                               if (ldt.toUpperCase() === idslist[id].name.toUpperCase()){                                         
//                                                                   targetid = id;
//                                                               }
//                                                           }
//                                                        });
//                                                        Object.keys(idslist).forEach((id)=>{
//                                                            if (idslist[id].key === pkey){
 //                                                               if (pd[pkey.split("_")[1]].toUpperCase() === idslist[id].name.toUpperCase()){                                         
  //                                                                  sourceid = id;
   //                                                             }
    //                                                        }    
     //                                                   });                                              
     //                                                   let tdata:any = {};
     //                                                   tdata.source = sourceid;
     //                                                   tdata.target = targetid;
     //                                                   let duplicate = false;
      //                                                  linkedids.forEach((lnk:any)=>{
       //                                                     if (lnk.source.toUpperCase() === sourceid.toUpperCase()  && lnk.target.toUpperCase() === targetid.toUpperCase()){
        //                                                        duplicate = true;
         //                                                   }
         //                                               });
         //                                               console.log("value4");console.log(tdata);
         //                                               if (!duplicate){
          //                                                  linkedids.push(tdata);
           //                                             }    
                                                    }    
                                                 }else{
                                                    console.log("hit");

                                                 }
                                            });     
                                        }else{
                                            pd[pkey.split("_")[1]].forEach((pdt:any)=>{
                                                ld[pkey.split("_")[1]].forEach((ldt:any)=>{
                                                    if (pdt.toUpperCase() === ldt.toUpperCase()){
                                                        ld[lkey.split("_")[1]].forEach((ldt:any)=>{
                                                           let sourceid = "";
                                                           let targetid = "";                                                            
                                                           Object.keys(idslist).forEach((id)=>{
                                                              if (idslist[id].key === lkey){
                                                                  if (ldt.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                                      targetid = id;
                                                                      Object.keys(idslist).forEach((id)=>{
                                                                          if (idslist[id].key === pkey){
                                                                              if (pdt.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                                                  sourceid = id;
                                                                              }
                                                                          }
                                                                      });                                              
                                                                      let tdata:any = {};
                                                                      tdata.source = sourceid;
                                                                      tdata.target = targetid;
                                                                      //console.log(tdata);
                                                                      let duplicate = false;
                                                                      linkedids.forEach((lnk:any)=>{
                                                                          if (lnk.source.toUpperCase() === sourceid.toUpperCase()  && lnk.target.toUpperCase() === targetid.toUpperCase()){
                                                                              duplicate = true;
                                                                          }
                                                                      });
                                                                      //console.log("value5");console.log(tdata);                                                        
                                                                      if (!duplicate){
                                                                          linkedids.push(tdata);
                                                                      }                                                                        
                                                                  }
                                                              }
                                                           });
                                                        });      
                                                    }    
                                                });     
                                            });
                                        }
                                     });  
                                }    
                           }
                       })
                       let proskey:any = {}
                       proskey[lkey] = keysorder[lkey];
                       processedobjects.push(proskey);                                 
                   }else{
                       if (lkey.split("_").length > 1 &&  pkey.split("_").length < 2){
                           let l_data = linkedobjects[lkey];    
                           let p_data:any;
                           linkeddata.forEach((lnk:any)=>{
                                if (Object.keys(lnk)[0].toUpperCase() === pkey.toUpperCase()){
                                    p_data = lnk[Object.keys(lnk)[0]];
                                }
                           });
                           l_data.forEach((ld:any)=>{
                              if (ld[lkey.split("_")[1]]){
                                  if (typeof ld[lkey.split("_")[1]] === "string"){     
                                      let sourceid = "";
                                      let targetid = "";
                                      Object.keys(idslist).forEach((id)=>{
                                         if (idslist[id].key === lkey){
                                             if (ld[lkey.split("_")[1]].toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                 targetid = id;
                                             }
                                         }
                                      });
                                      if (typeof p_data === "string"){
                                          Object.keys(idslist).forEach((id)=>{
                                              if (idslist[id].key === pkey){
                                                  if (p_data.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                      sourceid = id;
                                                  }
                                              }    
                                          });
                                          let tdata:any = {};
                                          tdata.source = sourceid;
                                          tdata.target = targetid;
                                          let duplicate = false;
                                          linkedids.forEach((lnk)=>{
                                              if (lnk.source.toUpperCase() === sourceid.toUpperCase()  && lnk.target.toUpperCase() === targetid.toUpperCase()){
                                                  duplicate = true;
                                              }
                                          });
                                          //console.log("value6");console.log(tdata);                                          
                                          if (!duplicate){
                                              linkedids.push(tdata);
                                          }                                             
                                      }else{
                                          p_data.forEach((pdt:any)=>{
                                             Object.keys(idslist).forEach((id)=>{
                                                if (idslist[id].key === pkey){
                                                    if (pdt.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                        sourceid = id;
                                                    }
                                                }    
                                              });
                                              let tdata:any = {};
                                              tdata.source = sourceid;
                                              tdata.target = targetid;
                                              let duplicate = false;
                                              linkedids.forEach((lnk)=>{
                                                  if (lnk.source.toUpperCase() === sourceid.toUpperCase()  && lnk.target.toUpperCase() === targetid.toUpperCase()){
                                                      duplicate = true;
                                                  }
                                              });
                                              //console.log("value7");console.log(tdata);                                              
                                              if (!duplicate){
                                                  linkedids.push(tdata);
                                              }                                                  
                                          });    
                                      }                                                                                  
                                  }else{
                                      let sourceid = "";
                                      let targetid = "";
                                      ld[lkey.split("_")[1]].forEach((ldt:any)=>{
                                         Object.keys(idslist).forEach((id)=>{
                                            if (idslist[id].key === lkey){
                                                if (ldt.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                    targetid = id;
                                                    if (typeof p_data === "string"){
                                                        Object.keys(idslist).forEach((id)=>{
                                                            if (idslist[id].key === pkey){
                                                                if (p_data.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                                    sourceid = id;
                                                                    let tdata:any = {};
                                                                    tdata.source = sourceid;
                                                                    tdata.target = targetid;
                                                                    let duplicate = false;
                                                                    linkedids.forEach((lnk)=>{
                                                                        if (lnk.source.toUpperCase() === sourceid.toUpperCase()  && lnk.target.toUpperCase() === targetid.toUpperCase()){
                                                                            duplicate = true;
                                                                        }
                                                                    });
                                                                   // console.log("value8");console.log(tdata);                                      
                                                                    if (!duplicate){
                                                                        linkedids.push(tdata);
                                                                    }                                                                         
                                                                }
                                                            }    
                                                        });
                                                    }else{
                                                        p_data.forEach((pdt:any)=>{
              //                                              pd[pkey.split("_")[1]].forEach((pdt:any)=>{
                                                              Object.keys(idslist).forEach((id)=>{
                                                                  if (idslist[id].key === pkey){
                                                                      if (pdt.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                                          sourceid = id;
                                                                          let tdata:any = {};
                                                                          tdata.source = sourceid;
                                                                          tdata.target = targetid;
                                                                          let duplicate = false;
                                                                          linkedids.forEach((lnk)=>{
                                                                              if (lnk.source.toUpperCase() === sourceid.toUpperCase()  && lnk.target.toUpperCase() === targetid.toUpperCase()){
                                                                                  duplicate = true;
                                                                              }
                                                                          });
                                                                         // console.log("value8");console.log(tdata);                                      
                                                                          if (!duplicate){
                                                                              linkedids.push(tdata);
                                                                          }                                                                               
                                                                      }
                                                                  }    
                                                              //});
                                                            })      
                                                        });    
                                                    }                                                  
                                                }
                                            }
                                         });
                                      });   
                                                                             
                                  }  
                              }  
                           });    
                           let proskey:any = {}
                           proskey[lkey] = keysorder[lkey];
                           processedobjects.push(proskey);                                    
                       }else{
                           if (lkey.split("_").length < 2 &&  pkey.split("_").length > 1){  
                               let l_data:any[] = [];
                               linkeddata.forEach((lnk:any)=>{
                                    if (Object.keys(lnk)[0].toUpperCase() === lkey.toUpperCase()){
                                        l_data = lnk[Object.keys(lnk)[0]];
                                    }
                               });
                               let p_data = linkedobjects[pkey];   
                               l_data.forEach((ld:any)=>{
                                   if (typeof ld[lkey.split("_")[1]] === "string"){     
                                       let sourceid = "";
                                       let targetid = "";
                                       Object.keys(idslist).forEach((id)=>{
                                           if (idslist[id].key === lkey){
                                               if (ld[lkey.split("_")[1]].toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                   targetid = id;
                                               }
                                           }
                                       });
                                       if (typeof p_data === "string"){
                                           Object.keys(idslist).forEach((id)=>{
                                              if (idslist[id].key === pkey){
                                                  if (p_data.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                      sourceid = id;
                                                  }
                                              }    
                                           });
                                       }else{
                                           p_data.forEach((pd:any)=>{
                                              pd[pkey.split("_")[1]].forEach((pdt:any)=>{
                                                 Object.keys(idslist).forEach((id)=>{
                                                    if (idslist[id].key === pkey){
                                                        if (pdt.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                            sourceid = id;
                                                        }
                                                    }    
                                                  });
                                               })      
                                           });    
                                        }                                             
                                        let tdata:any = {};
                                        tdata.source = sourceid;
                                        tdata.target = targetid;
                                        let duplicate = false;  
                                        linkedids.forEach((lnk)=>{
                                            if (lnk.source.toUpperCase() === sourceid.toUpperCase()  && lnk.target.toUpperCase() === targetid.toUpperCase()){
                                                duplicate = true;
                                            }
                                        });
                                        //console.log("value9");console.log(tdata);                                        
                                        if (!duplicate){
                                            linkedids.push(tdata);
                                        }                                         
                                    }else{
                                        let sourceid = "";
                                        let targetid = "";
                                        if (typeof ld === "string"){
                                            Object.keys(idslist).forEach((id)=>{
                                                if (idslist[id].key === lkey){
                                                    if (ld.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                        targetid = id;
                                                    }
                                                }
                                             });
                                        }else{
                                            ld[lkey.split("_")[1]].forEach((ldt:any)=>{
                                               Object.keys(idslist).forEach((id)=>{
                                                  if (idslist[id].key === lkey){
                                                      if (ldt.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                          targetid = id;
                                                      }
                                                  }
                                               });
                                            });
                                        }  
                                        if (typeof p_data === "string"){
                                            Object.keys(idslist).forEach((id)=>{
                                                if (idslist[id].key === pkey){
                                                    if (p_data.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                        sourceid = id;
                                                    }
                                                }    
                                            });
                                            let tdata:any = {};
                                            tdata.source = sourceid;
                                            tdata.target = targetid;
                                            let duplicate = false;
                                            linkedids.forEach((lnk)=>{
                                                if (lnk.source.toUpperCase() === sourceid.toUpperCase()  && lnk.target.toUpperCase() === targetid.toUpperCase()){
                                                    duplicate = true;
                                                }
                                            });
                                            //console.log("value10");console.log(tdata);                                            
                                            if (!duplicate){
                                                linkedids.push(tdata);
                                            }                                              
                                        }else{
                                            p_data.forEach((pd:any)=>{
                                                pd[pkey.split("_")[1]].forEach((pdt:any)=>{
                                                   Object.keys(idslist).forEach((id)=>{
                                                      if (idslist[id].key === pkey){
                                                          if (pdt.toUpperCase() === idslist[id].name.toUpperCase()){                                         
                                                              sourceid = id;
                                                              let tdata:any = {};
                                                              tdata.source = sourceid;
                                                              tdata.target = targetid;
                                                              let duplicate = false;
                                                              linkedids.forEach((lnk)=>{
                                                                  if (lnk.source.toUpperCase() === sourceid.toUpperCase()  && lnk.target.toUpperCase() === targetid.toUpperCase()){
                                                                      duplicate = true;
                                                                  }
                                                              });
                                                              //console.log("value11");console.log(tdata);                                                              
                                                              if (!duplicate){
                                                                  linkedids.push(tdata);
                                                              }                                                                
                                                          }
                                                       }    
                                                   });
                                                })      
                                            });    
                                        }                                                                                   
                                    }  
                               });                               
                           }  
                           let proskey:any = {}
                           proskey[lkey] = keysorder[lkey];
                           processedobjects.push(proskey);             
                       }
                   }
               }else{
                   let sourceids:any = {};
                   let targetids:any = {};  
                   pobject = processedobjects[processedobjects.length-1];
                   pkey = Object.keys(pobject)[0];       
                   pobject[pkey].forEach((obj:any)=>{
                       if (typeof obj === "object"){
                       }else{
                           Object.keys(idslist).forEach((id)=>{
                               if (idslist[id].key === pkey){
                                   if (obj.toUpperCase() === idslist[id].name.toUpperCase()){
                                       sourceids[id] = true;       
                                   } 
                               }
                           });   
                       }
                   });
                   keysorder[lkey].forEach((kdata:any)=>{
                       Object.keys(idslist).forEach((id)=>{
                           if (idslist[id].key === lkey){
                               if (kdata.toUpperCase() === idslist[id].name.toUpperCase()){
                                   targetids[id] = true;       
                               } 
                           }
                       });   
                   });    
                   Object.keys(sourceids).forEach((sid:any)=>{
                       Object.keys(targetids).forEach((tid:any)=>{
                           let tdata:any = {};
                           tdata.source = sid;
                           tdata.target = tid;
                           let duplicate = false;
                           linkedids.forEach((lnk)=>{
                               if (lnk.source.toUpperCase() === sid.toUpperCase()  && lnk.target.toUpperCase() === tid.toUpperCase()){
                                   duplicate = true;
                               }
                           });
                           //console.log("value12");console.log(tdata);
                           if (!duplicate){
                               linkedids.push(tdata);
                           }    
                       });      
                   });  
                   let proskey:any = {}
                   proskey[lkey] = keysorder[lkey];
                   processedobjects.push(proskey);                    
                }   
             }   
 //       });
      });      
     //console.log(linkedids);
     //console.log(processedobjects)
     //console.log(idslist);
    // console.log(linkeddata);

//      console.log(title);
//      console.log(node);
 //     console.log(link);
 //console.log(processedobjects);
 //console.log(linkedids);
      setNewTitles(ntitles);
      setNodes(node);
      setLinks(linkedids);
    });
   } 
  },[dataURL]);


  async function getData<T>(resourceUrl: string): Promise<T> {
    return await fetch(resourceUrl).then(response => {
        // fetching the reponse body data
        //return response.json<T>()
        return response.json().then(data => data as T);
      })
  }

  const zmTo = (e:any,option:number) =>{
    e.preventDefault();
    e.stopPropagation();
    setZoomTo(option);
    setInitZoom(Math.random());
  }


  return(
        <React.Fragment>
          <div id = "forcechart" style = {{width:`${chartWidth}px`,height:`${chartHeight}px`, paddingLeft:`${margin.left}px`,paddingTop:`${margin.top}px`, paddingRight:`${margin.right}px`,paddingBottom:`${margin.bottom}px`}}>
              {Config.settings[0].zoomButtonsRequired?
                 <div id="zoom" className={css.zoom}>
                     <button id="zoom_in" onClick={(e:any)=>zmTo(e,1)} className = {css.zoom_in}>+</button>
                     <button id="home" onClick={(e:any)=>zmTo(e,2)} className={css.home}>
                       <FontAwesomeIcon icon={faHome} style={{ fontSize: '.67em' }}/>
                     </button>       
                     <button  id="zoom_out" onClick={(e:any)=>zmTo(e,3)} className = {css.zoom_out}>-</button>
                  </div> 
                 :''
               }               
               <ForceGraph initZoom={initZoom} zoomTo={zoomTo} nodes={nodes} links={links} settings={Config.settings[0]} chartwidth={chartwidth} chartheight={chartheight} screenwidth={screenwidth} screenheight = {screenheight} titles={newTitles}/>
          </div>  
       </React.Fragment>
  )
}
export default ForceGraphInit;