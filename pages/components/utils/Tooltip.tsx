import React from 'react'


interface ToolTip {
  hoveredBubbleData:any;
  tipLeft:number;
  tipTop:number;
}

const ToolTip: React.FC<ToolTip> = ({hoveredBubbleData, tipLeft,tipTop}) => {
  console.log(hoveredBubbleData);
  const styles:any = {left:`${tipLeft}px`,top:`${tipTop}px`};
  return (
   <React.Fragment>
      <div className="Tooltip" style={styles}>
        <table>
          <tbody>
            { Object.keys(hoveredBubbleData).map((hkey:any)=>(
                 <tr key = {`m_${hoveredBubbleData[hkey]}`}>
                    <td style={{width:"25%"}} key = {`m_${hoveredBubbleData[hkey]}_1`} colSpan={1}>{hkey}</td>
                    <td style = {{width:"75%",fontWeight:"bolder"}} key = {`m_${hoveredBubbleData[hkey]}_2`} colSpan={1}><label style = {{marginLeft:"15px"}}>{hoveredBubbleData[hkey]}</label></td>
                 </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </React.Fragment>  
  )
}

export default ToolTip