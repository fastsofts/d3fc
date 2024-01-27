
interface Settings {
   bubbleTooltipRequired:boolean;
   lineTooltipRequired:boolean;
   zoomRequired:boolean;
   bubbleAnimationRequired:boolean;
   lineAnimationRequired:boolean;
   bubbleAnimationDuration:number;
   lineAnimationDuration:number;
   zoomButtonsRequired:boolean;
} 

const Settings : Array<Settings> = [
    {
     bubbleTooltipRequired:true,
     lineTooltipRequired:true,
     zoomRequired:true,
     bubbleAnimationRequired:true,
     lineAnimationRequired:true,
     bubbleAnimationDuration:1000,
     lineAnimationDuration:2000,
     zoomButtonsRequired:true
    }
]

const Config:any = {};
Config.settings = Settings;
export default Config;